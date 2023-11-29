import { BackendPlugin } from '../electron-sqlite.backend-plugin.renderer';
import type { DataState } from './data.storage';

export type PersistedValueGetter<
  TKey extends keyof DataState = keyof DataState
> = (key: TKey, nullFallback?: DataState[TKey]) => DataState[TKey];
export type PersistedValueSetter<
  TKey extends keyof DataState = keyof DataState
> = (key: TKey, val: DataState[TKey]) => void;
export type PersistedValueInserter<
  TKey extends keyof DataState = keyof DataState,
  TVal extends DataState[TKey][keyof DataState[TKey]] = DataState[TKey][keyof DataState[TKey]]
  // TODO restrict to only entries where val is an array
  //   TODO could use a returned id
> = (key: TKey, val: any) => void;

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

export const getPersistedValueRESTAPI: PersistedValueGetter = (key) => {
  return key as any;
};
export const setPersistedValueRESTAPI: PersistedValueGetter = (key) => {
  return key as any;
};

// ================== //

export enum PersistanceStrategy {
  LocalStorage,
  RestAPI,
  ElectronSqlite,
  // TODO Authorized RestAPI
  // TODO local sql server (if electron app) https://www.npmjs.com/package/electron-store
}

type StrategyLookup = Record<
  PersistanceStrategy,
  {
    get: PersistedValueGetter;
    set: PersistedValueSetter;
    insert?: PersistedValueInserter;
  }
>;

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
