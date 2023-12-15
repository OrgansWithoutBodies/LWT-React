import type { DataState } from '../data/data.storage';
import { PersistanceStrategy } from './PersistedValueGetter';
import {
  PersistedValueDeleter,
  PersistedValueEmptyer,
  PersistedValueGetter,
  PersistedValueGetterAsync,
  PersistedValueInserterAsync,
  PersistedValueSetter,
} from './PersistedValueGetter.types';

export type PersistedValueGetter<
  TKey extends keyof DataState = keyof DataState
> = (
  key: TKey,
  nullFallback?: DataState[TKey]
) => TKey extends keyof DataState ? DataState[TKey] : never;
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
export interface PersistenceHandles {
  get: PersistedValueGetter;
  set?: PersistedValueSetter;

  getAsync?: PersistedValueGetterAsync;

  insert?: PersistedValueInserterAsync;
  update?: PersistedValueInserterAsync;
  delete?: PersistedValueDeleter;
  empty?: PersistedValueEmptyer;
}
export type StrategyLookup = Record<PersistanceStrategy, PersistenceHandles>;
