import type { DataState } from '../data/data.storage';
import { BackendPlugin } from '../plugins/electron-sqlite.backend-plugin.renderer';
import {
  PersistanceStrategy,
  PersistedValueGetter,
  PersistedValueSetter,
  StrategyLookup,
} from './PersistedValueGetter.types';

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
  const { size } = new Blob(Object.values(localStorage));
  console.log(
    `LocalStorage Size: ${Math.round((size / (1000 * 1000)) * 100) / 100}Mb`
  );
  return true;
};

// ================== //

export const getPersistedValueRESTAPI: PersistedValueGetter = (key) =>
  key as any;
export const setPersistedValueRESTAPI: PersistedValueGetter = (key) =>
  key as any;

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
