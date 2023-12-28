import { PersistedValueGetter } from "./PersistedValueGetter.types";

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
