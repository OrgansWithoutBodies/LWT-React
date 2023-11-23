import { DataState } from './data.storage';

export type PersistedValueGetter<
  TKey extends keyof DataState = keyof DataState
> = (key: TKey, nullFallback?: DataState[TKey]) => DataState[TKey];
export type PersistedValueSetter<
  TKey extends keyof DataState = keyof DataState
> = (key: TKey, val: DataState[TKey]) => void;

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
  // TODO Authorized RestAPI
}

export const PersistenceStrategies: Record<
  PersistanceStrategy,
  { get: PersistedValueGetter; set: PersistedValueSetter }
> = {
  [PersistanceStrategy.LocalStorage]: {
    get: getPersistedValueLocalStorage,
    set: setPersistedValueLocalStorage,
  },
  [PersistanceStrategy.RestAPI]: {
    get: getPersistedValueRESTAPI,
    set: setPersistedValueRESTAPI,
  },
};
