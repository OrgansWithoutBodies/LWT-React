import type { IDValOf, LWTData } from "lwt-schemas";
import { PersistanceStrategy } from "./PersistanceStrategy";

export type PersistedValueGetter<TKey extends keyof LWTData = keyof LWTData> = (
  key: TKey,
  nullFallback?: LWTData[TKey]
) => TKey extends keyof LWTData ? LWTData[TKey] : never;
export type PersistedValueInitter<TKey extends keyof LWTData = keyof LWTData> =
  () => TKey extends keyof LWTData ? Promise<boolean> : never;
export type PersistedValueGetterAsync<
  TKey extends keyof LWTData = keyof LWTData
> = (key: TKey, nullFallback?: LWTData[TKey]) => Promise<LWTData[TKey]>;
export type PersistedValueSetter<TKey extends keyof LWTData = keyof LWTData> = (
  key: TKey,
  val: LWTData[TKey]
) => void;
export type PersistedValueInserter<
  TKey extends keyof LWTData = keyof LWTData,
  TVal extends LWTData[TKey][keyof LWTData[TKey]] = LWTData[TKey][keyof LWTData[TKey]]
  // TODO restrict to only entries where val is an array
  //   TODO could use a returned id
> = (key: TKey, val: any) => TVal;
// TODO 'AsyncReturnValue'
export type PersistedValueInserterAsync<
  TKey extends keyof LWTData = keyof LWTData,
  TVal extends LWTData[TKey][keyof LWTData[TKey]] = LWTData[TKey][keyof LWTData[TKey]]
> = (key: TKey, val: any) => Promise<TVal>;
export type PersistedValueDeleter<TKey extends keyof LWTData = keyof LWTData> =
  (key: TKey, deleteID: IDValOf<TKey>) => void;
export type PersistedValueEmptyer = () => void;
export interface PersistenceHandles {
  get: PersistedValueGetter;
  init?: PersistedValueInitter;
  set?: PersistedValueSetter;

  getAsync?: PersistedValueGetterAsync;

  insert?: PersistedValueInserterAsync;
  update?: PersistedValueInserterAsync;
  delete?: PersistedValueDeleter;
  empty?: PersistedValueEmptyer;
}
export type StrategyLookup = Record<PersistanceStrategy, PersistenceHandles>; // ================== //
