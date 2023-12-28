import type { LWTData } from "lwt-schemas";
import {
  PersistedValueGetter,
  PersistedValueSetter,
} from "./PersistedValueGetter.types";

export const getPersistedValueLocalStorage = <TKey extends keyof LWTData>(
  key: TKey,
  nullFallback = null
): LWTData[TKey] => {
  console.log("TEST123-getting");
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
