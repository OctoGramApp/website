import {
  Client,
  ClientPlain,
  ConnectionError,
  getRandomId,
  StorageMemory,
  TLWriter,
  base64EncodeUrlSafe,
  rleEncode,
} from "../lib/mtkruto.esmc.js";

let cachedClients = {};
let clientConnectionsPromises = {};
let offlineClientTiming = {};

function registerDatacenterPing(dcId, callbackState, forceReloadAuthKeyTries = 0) {
  dcId = String(dcId);
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
      ping_id: getRandomId(),
    }).then(() => {
      const endTime = Date.now();
      callbackState({
        status: 'pong',
        ping: endTime - startTime,
      });
    }).catch((e) => {
      console.error(e);

      if (e instanceof ConnectionError) {
        forceReloadAuthKeyTries++;

        if (forceReloadAuthKeyTries > 5) {
          offlineClientTiming[dcId] = Date.now();
          callbackState({
            status: 'offline'
          });
        } else {
          registerDatacenterPing(dcId, callbackState, forceReloadAuthKeyTries);
        }
      }
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
          const clientPlain = new ClientPlain({ initialDc: dcId });
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
        const writer = new TLWriter();
        writer.writeString(dcId);
        writer.writeBytes(authKey);
        writer.writeInt32(0);
        writer.write(new Uint8Array([0]));
        writer.writeInt64(0n);

        callbackState({ status: 'connecting' });
        const authString = base64EncodeUrlSafe(rleEncode(writer.buffer));
        cachedClients[dcId] = new Client({
          storage: new StorageMemory(authString)
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
}

function composeAuthKeyStorage(dcId) {
  return `octogram.mtproto.authKey.${dcId}`;
}

export {
  registerDatacenterPing,
  killDatacenterConnection,
};