// import { BackendPlugin } from "../plugins/electron-sqlite.backend-plugin.renderer";
// import * as Reflect from "reflect-metadata";

// Reflect;

import { PersistenceHandles } from "./PersistedValueGetter.types";
import {
  getPersistedValueLocalStorage,
  setPersistedValueLocalStorage,
} from "./getPersistedValueLocalStorage";
// ================== //
export const localStoragePersistanceStrategy: PersistenceHandles = {
  get: getPersistedValueLocalStorage,
  set: setPersistedValueLocalStorage,
};
