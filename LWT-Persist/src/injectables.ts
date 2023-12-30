import { PersistenceHandles } from "./PersistedValueGetter.types";
import {
  getPersistedValueLocalStorage,
  setPersistedValueLocalStorage,
} from "./getPersistedValueLocalStorage";
// ================== //
export const localStoragePersistanceStrategy: PersistenceHandles = {
  // TODO no any
  get: getPersistedValueLocalStorage as any,
  set: setPersistedValueLocalStorage,
};
