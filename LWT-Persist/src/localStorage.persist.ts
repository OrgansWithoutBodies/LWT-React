import {
  Base64String,
  base64ToUInt8,
  gzipObject,
  uInt8ToBase64,
  unGzObject,
} from "lwt-common";
import type { LWTData } from "lwt-schemas";
import {
  PersistedValueGetter,
  PersistedValueSetter,
} from "./PersistedValueGetter.types";

export const getPersistedValueLocalStorage = <TKey extends keyof LWTData>(
  key: TKey,
  nullFallback = null
): LWTData[TKey] => {
  const localVal = localStorage.getItem(key);
  // TODO val parser/validator
  return (
    localVal === null
      ? nullFallback
      : unGzObject(base64ToUInt8(localVal as Base64String))
  ) as ReturnType<PersistedValueGetter<TKey>>;
};
export const setPersistedValueLocalStorage: PersistedValueSetter = (
  key,
  val
) => {
  console.log({ key, val });
  localStorage.setItem(key, uInt8ToBase64(gzipObject(val)));
  const { size } = new Blob(Object.values(localStorage));
  console.log(
    `LocalStorage Size: ${Math.round((size / (1000 * 1000)) * 100) / 100}Mb`
  );
  return true;
};
// export const getPersistedValueLocalStorage = <TKey extends keyof LWTData>(
//   key: TKey,
//   nullFallback = null
// ): LWTData[TKey] => {
//   const localVal = localStorage.getItem(key);
//   // TODO val parser/validator
//   return (
//     localVal === null ? nullFallback : JSON.parse(localVal)
//   ) as ReturnType<PersistedValueGetter<TKey>>;
// };
// export const setPersistedValueLocalStorage: PersistedValueSetter = (
//   key,
//   val
// ) => {
//   localStorage.setItem(key, JSON.stringify(val));
//   const { size } = new Blob(Object.values(localStorage));
//   console.log(
//     `LocalStorage Size: ${Math.round((size / (1000 * 1000)) * 100) / 100}Mb`
//   );
//   return true;
// };
