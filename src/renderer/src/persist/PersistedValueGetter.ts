import { deflate } from 'pako';
import { BrandedString } from '../data/branding';
import type { DataState } from '../data/data.storage';
import { BackendPlugin } from '../plugins/electron-sqlite.backend-plugin.renderer';
import {
  PersistanceStrategy,
  PersistedValueGetter,
  PersistedValueSetter,
  StrategyLookup,
} from './PersistedValueGetter.types';

// ================== //

export const getPersistedValueLocalStorage = <TKey extends keyof DataState>(
  key: TKey,
  nullFallback = null
): DataState[TKey] => {
  const localVal = localStorage.getItem(key);
  // TODO val parser/validator
  return (
    localVal === null ? nullFallback : JSON.parse(localVal)
  ) as ReturnType<PersistedValueGetter<TKey>>;
};
export const setPersistedValueLocalStorage: PersistedValueSetter = (
  key,
  val
) => {
  localStorage.setItem(key, JSON.stringify(val));
  const { size } = new Blob(Object.values(localStorage));
  console.log(
    `LocalStorage Size: ${Math.round((size / (1000 * 1000)) * 100) / 100}Mb`
  );
  return true;
};

/**
 *
 * @param val
 */
function objectToGzUInt8(val: object): Uint8Array {
  return deflate(JSON.stringify(val));
}

type Base64String = BrandedString<'B64'>;
const uInt8ToBase64 = (u8: Uint8Array): Base64String => {
  const decoder = new TextDecoder('utf8');
  const b64encoded = btoa(decoder.decode(u8));
  return b64encoded as Base64String;
};
const base64ToUInt8 = (b64: Base64String): Uint8Array => {
  const binaryString = atob(b64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

// // note: `buffer` arg can be an ArrayBuffer or a Uint8Array
// async function bufferToBase64(buffer) {
//   // use a FileReader to generate a base64 data URI:
//   const base64url = await new Promise(r => {
//     const reader = new FileReader()
//     reader.onload = () => r(reader.result)
//     reader.readAsDataURL(new Blob([buffer]))
//   });
//   // remove the `data:...;base64,` part from the start
//   return base64url.slice(base64url.indexOf(',') + 1);
// }

const blobToBase64 = (blob: Blob) => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
};
/**
 *
 */
function gzBlobToObject() {}

// ===================== //
// GZipped Index DB
// ===================== //

// // Create an example Blob object
// var blob = new Blob(['blob object'], {type: 'text/plain'});

// try {
//     var store = db.transaction(['entries'], 'readwrite').objectStore('entries');

//     // Store the object
//     var req = store.put(blob, 'blob');
//     req.onerror = function(e) {
//         console.log(e);
//     };
//     req.onsuccess = function(event) {
//         console.log('Successfully stored a blob as Blob.');
//     };
// } catch (e) {
//     var reader = new FileReader();
//     reader.onload = function(event) {
//         // After exception, you have to start over from getting transaction.
//         var store = db.transaction(['entries'], 'readwrite').objectStore('entries');

//         // Obtain DataURL string
//         var data = event.target.result;
//         var req = store.put(data, 'blob');
//         req.onerror = function(e) {
//             console.log(e);
//         };
//         req.onsuccess = function(event) {
//             console.log('Successfully stored a blob as String.');
//         };
//     };
//     // Convert Blob into DataURL string
//     reader.readAsDataURL(blob);
// }

// export const getPersistedValueLocalStorage = async <
//   TKey extends keyof DataState
// >(
//   key: TKey,
//   nullFallback = null
// ): Promise<DataState[TKey]> => {
//   const localVal = localStorage.getItem(key);
//   if (localVal === null) {
//     return nullFallback;
//   }
//   console.log('TEST123-get', localVal, JSON.parse(localVal));
//   const gottenData = inflate(new Uint8Array(JSON.parse(localVal)), {
//     to: 'string',
//   });

//   // const blob = new Blob([localVal]);
//   // const gottenData = await blob.arrayBuffer().then((val) => {
//   //   console.log('TEST123-gettingdata', val);
//   //   const unzippedVal = inflate(new Uint8Array(val), { to: 'string' });

//   //   return unzippedVal;
//   // });
//   // TODO val parser/validator
//   console.log('TEST123-gotdata', gottenData);
//   return gottenData as ReturnType<PersistedValueGetter<TKey>>;
// };
// export const setPersistedValueLocalStorage: PersistedValueSetter = (
//   key,
//   val
// ) => {
//   const blob = new Blob([JSON.stringify(val)]);

//   localStorage.setItem(key, JSON.stringify(deflate(JSON.stringify(val))));
//   // blob.arrayBuffer().then((val) => {
//   //   const zippedVal = (val);

//   //   console.log(
//   //     `New Item Size (${key}): ${
//   //       Math.round((new Blob([zippedVal]).size / (1000 * 1000)) * 100) / 100
//   //     }Mb`
//   //   );
//   //   console.log('TEST123-setdata', zippedVal);
//   // });
//   const { size } = new Blob(Object.values(localStorage));
//   console.log(
//     `LocalStorage Size: ${Math.round((size / (1000 * 1000)) * 100) / 100}Mb`
//   );
//   return true;
// };
// ================== //

export const getPersistedValueRESTAPI: PersistedValueGetter = (key) =>
  key as any;
export const setPersistedValueRESTAPI: PersistedValueGetter = (key) =>
  key as any;

export const PersistenceStrategies: StrategyLookup = {
  [PersistanceStrategy.LocalStorage]: {
    get: getPersistedValueLocalStorage,
    set: setPersistedValueLocalStorage,
  },
  [PersistanceStrategy.IndexedDB]: {
    get: getPersistedValueLocalStorage,
    set: setPersistedValueLocalStorage,
  },
  [PersistanceStrategy.RestAPI]: {
    get: getPersistedValueRESTAPI,
    set: setPersistedValueRESTAPI,
  },
  [PersistanceStrategy.ElectronSqlite]: BackendPlugin,
};
