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

let dcId;

let cachedClient;
let clientConnectionsPromise;
let offlineClientTiming = 0;

function registerDatacenterPing(forceReloadAuthKeyTries = 0, authKey) {
    if (offlineClientTiming && Date.now() - offlineClientTiming < 30000) {
        postMessage({
            status: 'offline'
        });
        // re-check offline datacenters every 30s
        return;
    }

    registerDatacenterConnection(forceReloadAuthKeyTries > 0, authKey).then(() => {
        const startTime = Date.now();
        cachedClient.api.ping({
            ping_id: getRandomId(),
        }).then(() => {
            const endTime = Date.now();
            postMessage({
                status: 'pong',
                ping: endTime - startTime,
            });
        }).catch((e) => {
            console.error(e);

            if (e instanceof ConnectionError) {
                forceReloadAuthKeyTries++;

                if (forceReloadAuthKeyTries > 5) {
                    offlineClientTiming = Date.now();
                    postMessage({
                        status: 'offline'
                    });
                } else {
                    registerDatacenterPing(forceReloadAuthKeyTries);
                }
            }
        });
    });
}

function killDatacenterConnection() {
    cachedClient.disconnect();
    cachedClient = undefined;
    clientConnectionsPromise = undefined;
}

function registerDatacenterConnection(forceReloadAuthKey = false, currentAuthKey) {
    return new Promise((resolve) => {
        if (typeof cachedClient != 'undefined') {
            if (typeof clientConnectionsPromise != 'undefined') {
                clientConnectionsPromise.then(() => resolve());
            } else {
                return Promise.resolve(cachedClient);
            }
        } else {
            let authKey = currentAuthKey;
            let authKeyPromise = Promise.resolve();
            if (!authKey || forceReloadAuthKey) {
                authKeyPromise = new Promise((resolve) => {
                    postMessage({ status: 'creating_keys' });
                    const clientPlain = new ClientPlain({ initialDc: dcId });
                    clientPlain.connect().then(() => {
                        postMessage({ status: 'exchanging_encryption_keys' });
                        clientPlain.createAuthKey().then((currentClientAuthKey) => {
                            authKey = currentClientAuthKey[0];
                            postMessage({
                                intent: 'save_auth_key',
                                authKey: authKey
                            });
                            //localStorage.setItem(composeAuthKeyStorage(dcId), new TextDecoder().decode(authKey));
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

                postMessage({ status: 'connecting' });
                const authString = base64EncodeUrlSafe(rleEncode(writer.buffer));
                cachedClient = new Client({
                    storage: new StorageMemory(authString)
                });
                clientConnectionsPromise = new Promise((resolveDict) => {
                    cachedClient.setDc(dcId);
                    cachedClient.connect().then(() => {
                        resolveDict();
                        resolve();
                    });
                });
            });
        }
    });
}

addEventListener('message', (e) => {
    if (typeof e.data == 'object') {
        if (typeof e.data["intent"] != 'string' || e.data['intent'] !== 'ping') {
            return;
        }

        if (typeof e.data["dcId"] != 'string') {
            return;
        }

        if (typeof e.data["authKey"] != 'undefined' && !(e.data["authKey"] instanceof Uint8Array)) {
            return;
        }

        dcId = e.data["dcid"];
        registerDatacenterPing(0, e.data["authKey"]);
    } else if (typeof e.data == 'string' && e.data === 'kill') {
        killDatacenterConnection();
        postMessage({
            intent: 'kill_done'
        });
    }
});