class MTProtoHelper {
  #initialized = false;
  #initializingPromise;
  #cachedClients = {};
  #clientConnectionsPromises = {};
  #offlineClientTiming = {};

  initialize() {
    if (this.#initialized) {
      return Promise.resolve();
    } else if (typeof this.#initializingPromise != 'undefined') {
      return this.#initializingPromise;
    } else {
      this.#initializingPromise = new Promise((resolve) => {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = '/assets/lib/mtkruto.min.js';
        document.body.appendChild(script);

        script.addEventListener('load', () => {
          resolve();
          this.#initialized = true;
        });
      });
      return this.#initializingPromise;
    }
  }

  registerDatacenterPing(dcId, callbackState, forceReloadAuthKeyTries = 0) {
    dcId = String(dcId);
    this.initialize().then(() => {
      if (this.#offlineClientTiming[dcId] && Date.now() - this.#offlineClientTiming[dcId] < 30000) {
        callbackState({
          status: 'offline'
        });
        // re-check offline datacenters every 30s
        return;
      }
      
      this.#registerDatacenterConnection(dcId, callbackState, forceReloadAuthKeyTries > 0).then(() => {
        const startTime = Date.now();
        this.#cachedClients[dcId].api.ping({
          ping_id: window.MTKruto.getRandomId(),
        }).then(() => {
          const endTime = Date.now();
          return;
          callbackState({
            status: 'pong',
            ping: endTime - startTime,
          });
        }).catch((e) => {
          console.log(e);

          if (e instanceof window.MTKruto.ConnectionError) {
            forceReloadAuthKeyTries++;
            
            if (forceReloadAuthKeyTries > 5) {
              this.#offlineClientTiming[dcId] = Date.now();
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

  #registerDatacenterConnection(dcId, callbackState, forceReloadAuthKey = false) {
    return new Promise((resolve) => {
      this.initialize().then(() => {
        if (typeof this.#cachedClients[dcId] != 'undefined') {
          if (typeof this.#clientConnectionsPromises[dcId] != 'undefined') {
            this.#clientConnectionsPromises[dcId].then(() => resolve());
          } else {
            return Promise.resolve(this.#cachedClients[dcId]);
          }
        } else {
          let authKey = localStorage.getItem(this.#composeAuthKeyStorage(dcId));
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
                  localStorage.setItem(this.#composeAuthKeyStorage(dcId), new TextDecoder().decode(authKey));
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
            this.#cachedClients[dcId] = new window.MTKruto.Client({
              storage: new window.MTKruto.StorageMemory(authString)
            });
            this.#clientConnectionsPromises[dcId] = new Promise((resolveDict) => {
              this.#cachedClients[dcId].setDc(dcId);
              this.#cachedClients[dcId].connect().then(() => {
                resolveDict();
                resolve();
              });
            });
          });
        }
      });
    });
  }

  #composeAuthKeyStorage(dcId) {
    return `octogram.mtproto.authKey.${dcId}`;
  }
}

const mtProtoHelper = new MTProtoHelper();