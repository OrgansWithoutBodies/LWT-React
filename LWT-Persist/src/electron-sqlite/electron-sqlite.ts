import { PersistenceHandles } from "../persist/PersistedValueGetter.types";
import { BackendPlugin } from "./electron-sqlite-backend.plugin.main";

export const electronSqlitePersistanceStrategy: PersistenceHandles = {
  get: BackendPlugin.get,
  set: BackendPlugin.set,
};
