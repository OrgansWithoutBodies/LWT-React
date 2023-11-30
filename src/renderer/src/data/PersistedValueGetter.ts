import { BackendPlugin } from '../electron-sqlite.backend-plugin.renderer';
import type { DataState } from './data.storage';

export type PersistedValueGetter<
  TKey extends keyof DataState = keyof DataState
> = (key: TKey, nullFallback?: DataState[TKey]) => DataState[TKey];
export type PersistedValueGetterAsync<
  TKey extends keyof DataState = keyof DataState
> = (key: TKey, nullFallback?: DataState[TKey]) => Promise<DataState[TKey]>;
export type PersistedValueSetter<
  TKey extends keyof DataState = keyof DataState
> = (key: TKey, val: DataState[TKey]) => void;
export type PersistedValueInserter<
  TKey extends keyof DataState = keyof DataState,
  TVal extends DataState[TKey][keyof DataState[TKey]] = DataState[TKey][keyof DataState[TKey]]
  // TODO restrict to only entries where val is an array
  //   TODO could use a returned id
> = (key: TKey, val: any) => TVal;
// TODO 'AsyncReturnValue'
export type PersistedValueInserterAsync<
  TKey extends keyof DataState = keyof DataState,
  TVal extends DataState[TKey][keyof DataState[TKey]] = DataState[TKey][keyof DataState[TKey]]
> = (key: TKey, val: any) => Promise<TVal>;
export type PersistedValueDeleter<
  TKey extends keyof DataState = keyof DataState
> = (key: TKey, deleteID: TKey extends object ? keyof TKey : never) => void;
export type PersistedValueEmptyer = () => void;

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
  return true;
};

// ================== //

export const getPersistedValueRESTAPI: PersistedValueGetter = (key) => key as any;
export const setPersistedValueRESTAPI: PersistedValueGetter = (key) => key as any;

// ================== //

export enum PersistanceStrategy {
  LocalStorage,
  RestAPI,
  // TODO technically nothing here that should be specific to sqlite? maybe just "ElectronIPC"?
  ElectronSqlite,
  // TODO Authorized RestAPI
  // TODO MySql compatibility
  // TODO shared details for sqlite implementation for IPC & REST-express
}

export interface PersistenceHandles {
  get: PersistedValueGetter;
  set: PersistedValueSetter;

  getAsync?: PersistedValueGetterAsync;

  insert?: PersistedValueInserterAsync;
  update?: PersistedValueInserterAsync;
  delete?: PersistedValueDeleter;
  empty?: PersistedValueEmptyer;
  // TODO ?
  // restoreBackup
  // drop
}

type StrategyLookup = Record<PersistanceStrategy, PersistenceHandles>;

export const PersistenceStrategies: StrategyLookup = {
  [PersistanceStrategy.LocalStorage]: {
    get: getPersistedValueLocalStorage,
    set: setPersistedValueLocalStorage,
  },
  [PersistanceStrategy.RestAPI]: {
    get: getPersistedValueRESTAPI,
    set: setPersistedValueRESTAPI,
  },
  [PersistanceStrategy.ElectronSqlite]: BackendPlugin,
};
