import { PersistenceHandles } from "./PersistedValueGetter.types";
import {
  getPersistedValueLocalStorage,
  setPersistedValueLocalStorage,
} from "./localStorage.persist";
// ================== //
export const localStoragePersistanceStrategy: PersistenceHandles = {
  // TODO no any
  get: getPersistedValueLocalStorage as any,
  set: setPersistedValueLocalStorage,
};
