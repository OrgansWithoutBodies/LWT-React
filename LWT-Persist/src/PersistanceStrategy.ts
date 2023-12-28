export enum PersistanceStrategy {
  LocalStorage,
  // TODO
  // IndexedDB,
  RestAPI,
  // TODO technically nothing here that should be specific to sqlite? maybe just "ElectronIPC"?
  ElectronSqlite,
}
export const PersistanceStrategyToken = Symbol("Persistance");
