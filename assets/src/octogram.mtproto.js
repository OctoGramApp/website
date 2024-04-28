let initialized = false;
let initializingPromise;
let cachedClients = {};
let clientConnectionsPromises = {};
let offlineClientTiming = {};

function initialize() {
  if (initialized) {
    return Promise.resolve();
  } else if (typeof initializingPromise != 'undefined') {
    return initializingPromise;
  } else {
    initializingPromise = new Promise((resolve) => {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = '/assets/lib/mtkruto.min.js';
      document.body.appendChild(script);

      script.addEventListener('load', () => {
        resolve();
        initialized = true;
      });
    });
    return initializingPromise;
  }
}

function registerDatacenterPing(dcId, callbackState, forceReloadAuthKeyTries = 0) {
  dcId = String(dcId);
  this.initialize().then(() => {
    if (offlineClientTiming[dcId] && Date.now() - offlineClientTiming[dcId] < 30000) {
      callbackState({
        status: 'offline'
      });
      // re-check offline datacenters every 30s
      return;
    }
    
    registerDatacenterConnection(dcId, callbackState, forceReloadAuthKeyTries > 0).then(() => {
      const startTime = Date.now();
      cachedClients[dcId].api.ping({
        ping_id: window.MTKruto.getRandomId(),
      }).then(() => {
        const endTime = Date.now();
        callbackState({
          status: 'pong',
          ping: endTime - startTime,
        });
      }).catch((e) => {
        console.error(e);

        if (e instanceof window.MTKruto.ConnectionError) {
          forceReloadAuthKeyTries++;
          
          if (forceReloadAuthKeyTries > 5) {
            offlineClientTiming[dcId] = Date.now();
            callbackState({
              status: 'offline'
            });
          } else {
            this.registerDatacenterPing(dcId, callbackState, forceReloadAuthKeyTries);
          }
        }
      });
    });
  });
}

function killDatacenterConnection() {
  for (const [id, connection] of Object.entries(cachedClients)) {
    connection.disconnect().then(() => {
      console.log('Disconnected from', id);
    }).catch((e) => {
      console.error('While disconnecting from', id, e);
    });
  }

  cachedClients = {};
  clientConnectionsPromises = {};
}

function registerDatacenterConnection(dcId, callbackState, forceReloadAuthKey = false) {
  return new Promise((resolve) => {
    this.initialize().then(() => {
      if (typeof cachedClients[dcId] != 'undefined') {
        if (typeof clientConnectionsPromises[dcId] != 'undefined') {
          clientConnectionsPromises[dcId].then(() => resolve());
        } else {
          return Promise.resolve(cachedClients[dcId]);
        }
      } else {
        let authKey = localStorage.getItem(composeAuthKeyStorage(dcId));
        let authKeyPromise = Promise.resolve();
        if (authKey && !forceReloadAuthKey) {
          authKey = new TextEncoder().encode(authKey);
        } else {
          authKeyPromise = new Promise((resolve) => {
            callbackState({ status: 'creating_keys' });
            const clientPlain = new window.MTKruto.ClientPlain({ initialDc: dcId });
            clientPlain.connect().then(() => {
              callbackState({ status: 'exchanging_encryption_keys' });
              clientPlain.createAuthKey().then((currentClientAuthKey) => {
                authKey = currentClientAuthKey[0];
                localStorage.setItem(composeAuthKeyStorage(dcId), new TextDecoder().decode(authKey));
                clientPlain.disconnect().then(() => resolve());
              });
            });
          });
        }

        authKeyPromise.then(() => {
          const writer = new window.MTKruto.TLWriter();
          writer.writeString(dcId);
          writer.writeBytes(authKey);
          writer.writeInt32(0);
          writer.write(new Uint8Array([0]));
          writer.writeInt64(0n);

          callbackState({ status: 'connecting' });
          const authString = window.MTKruto.base64EncodeUrlSafe(window.MTKruto.rleEncode(writer.buffer));
          cachedClients[dcId] = new window.MTKruto.Client({
            storage: new window.MTKruto.StorageMemory(authString)
          });
          clientConnectionsPromises[dcId] = new Promise((resolveDict) => {
            cachedClients[dcId].setDc(dcId);
            cachedClients[dcId].connect().then(() => {
              resolveDict();
              resolve();
            });
          });
        });
      }
    });
  });
}

function composeAuthKeyStorage(dcId) {
  return `octogram.mtproto.authKey.${dcId}`;
}

export {
  initialize,
  registerDatacenterPing,
  killDatacenterConnection,
};