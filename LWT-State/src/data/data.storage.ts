import { Store, StoreConfig } from "@datorama/akita";
import {
  LWTContainer,
  PersistanceStrategyToken,
  PersistedValueGetter,
  PersistenceHandles,
} from "lwt-persist";
import { LWTData } from "lwt-schemas";
import { inject, injectable } from "tsyringe";

export interface DataState extends LWTData {
  notificationMessage: null | { txt: string };
}

@StoreConfig({ name: "data" })
@injectable()
export class DataStore extends Store<DataState> {
  public persistanceHandles: PersistenceHandles;

  constructor(
    @inject(PersistanceStrategyToken)
    persistanceHandles: PersistenceHandles
  ) {
    const { get: persistGetter } = persistanceHandles;
    console.log("TEST123-di", persistGetter, persistanceHandles);
    super(
      getPersistedData(
        // TODO
        (key) => (_key, defaultVal) => persistGetter(key, defaultVal) as any
      )
    );
    this.persistanceHandles = persistanceHandles;
  }
}
// TODO this is super flimsy - since we conditionally import in lwt-build we need to wait for the promise to resolve before
// container registrations are loaded...this just waits the same length since it imports again....
await import("lwt-persist");
await import("lwt-build");
export const dataStore = LWTContainer.resolve(DataStore);
/**
 *
 * @param persistGetter
 */
function getPersistedData(
  persistGetter: <TKey extends keyof LWTData>(
    key: TKey
  ) => PersistedValueGetter<TKey>
): DataState {
  return {
    settings: persistGetter("settings")("settings", []),
    sentences: persistGetter("sentences")("sentences", []),
    archivedtexts: persistGetter("archivedtexts")("archivedtexts", []),
    archtexttags: persistGetter("archtexttags")("archtexttags", []),
    languages: persistGetter("languages")("languages", []),
    tags2: persistGetter("tags2")("tags2", []),
    tags: persistGetter("tags")("tags", []),
    textitems: persistGetter("textitems")("textitems", []),
    texts: persistGetter("texts")("texts", []),
    texttags: persistGetter("texttags")("texttags", []),
    words: persistGetter("words")("words", []),
    wordtags: persistGetter("wordtags")("wordtags", []),
    notificationMessage: null,
  };
}
