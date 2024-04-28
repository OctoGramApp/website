import {decodeBase64, encodeBase64} from "./octogram.utils.base64.js";

let dcIdCallbackStates = {};
let connectedWorkers = {};

function registerDatacenterPing(dcId, callbackState) {
  dcId = String(dcId);

  if (typeof dcIdCallbackStates[dcId] == 'undefined') {
    dcIdCallbackStates[dcId] = [];
  }

  dcIdCallbackStates[dcId].push(callbackState);

  if (typeof connectedWorkers[dcId] == 'undefined') {
    connectedWorkers[dcId] = 0;
    initWorkerForDcId(dcId);
  }

  connectedWorkers[dcId].postMessage({
    intent: 'ping',
    dcId: dcId,
    authKey: getCurrentAuthKey(dcId),
  });
}

function initWorkerForDcId(dcId) {
  const worker = new Worker('/assets/lib/connectivity-worker.js', { type: 'module' });
  connectedWorkers[dcId] = worker;

  worker.addEventListener('message', (e) => {
    if (typeof e.data == 'object') {
      if (typeof e.data['status'] == 'string') {
        for (const callback of dcIdCallbackStates[dcId]) {
          callback(e.data);
        }
      } else if (typeof e.data['intent'] == 'string') {
        if (e.data['intent'] === 'save_auth_key') {
          if (!(e.data['authKey'] instanceof Uint8Array)) {
            return;
          }

          localStorage.setItem(composeAuthKeyStorage(dcId), encodeBase64(e.data['authKey']));
        } else if (e.data['intent'] === 'kill_done') {
          worker.terminate();
        }
      }
    }
  });
}

function killDatacenterConnection() {
  for (const worker of Object.values(connectedWorkers)) {
    worker.postMessage('kill');
  }

  dcIdCallbackStates = {};
  connectedWorkers = {};
}

function composeAuthKeyStorage(dcId) {
  return `octogram.mtproto.regAuthKey.${dcId}`;
}

function getCurrentAuthKey(dcId) {
  let authKey;
  const currentAuthKey = localStorage.getItem(composeAuthKeyStorage(dcId));
  if (currentAuthKey) {
    authKey = decodeBase64(currentAuthKey);
  }

  return authKey;
}

export {
  registerDatacenterPing,
  killDatacenterConnection,
};