import { Store, StoreConfig } from '@datorama/akita';
import { AppVariables } from '../meta';
import { PersistenceStrategies } from '../persist/PersistedValueGetter';
import { PersistedValueGetter } from '../persist/PersistedValueGetter.types';
import {
  ArchTextTag,
  ArchivedText,
  Language,
  Sentence,
  Settings,
  Tag,
  Tag2,
  Text,
  TextItem,
  TextTag,
  Word,
  WordTag,
} from '../utils/parseMySqlDump';

export interface DataState {
  archivedtexts: ArchivedText[];
  archtexttags: ArchTextTag[];
  languages: Language[];

  sentences: Sentence[];
  settings: Settings[];
  tags: Tag[];
  tags2: Tag2[];
  textitems: TextItem[];
  texts: Text[];
  texttags: TextTag[];
  words: Word[];
  wordtags: WordTag[];

  notificationMessage: null | { txt: string };
}

// TODO decide this on compile w DI token
const MyPersistanceStrategy = AppVariables.persistMethod;
export const MyPersistanceHandles =
  PersistenceStrategies[MyPersistanceStrategy];

@StoreConfig({ name: 'data' })
// TODO
export class DataStore extends Store<DataState> {
  constructor() {
    const { get: persistGetter } = MyPersistanceHandles;
    // TODO type issues
    super(
      getPersistedData(
        // TODO
        (key) => (_key, defaultVal) => persistGetter(key, defaultVal)
      )
    );
  }
}

export const dataStore = new DataStore();
/**
 *
 * @param persistGetter
 */
function getPersistedData(
  persistGetter: <TKey extends keyof DataState>(
    key: TKey
  ) => PersistedValueGetter<TKey>
): DataState {
  return {
    settings: persistGetter('settings')('settings', []),
    sentences: persistGetter('sentences')('sentences', []),
    archivedtexts: persistGetter('archivedtexts')('archivedtexts', []),
    archtexttags: persistGetter('archtexttags')('archtexttags', []),
    languages: persistGetter('languages')('languages', []),
    tags2: persistGetter('tags2')('tags2', []),
    tags: persistGetter('tags')('tags', []),
    textitems: persistGetter('textitems')('textitems', []),
    texts: persistGetter('texts')('texts', []),
    texttags: persistGetter('texttags')('texttags', []),
    words: persistGetter('words')('words', []),
    wordtags: persistGetter('wordtags')('wordtags', []),
    notificationMessage: null,
  };
}
