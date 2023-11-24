import { Store, StoreConfig } from '@datorama/akita';
import demoDB from '../demo_db.json';
import { AppVariables } from '../meta';
import {
  PersistedValueGetter,
  PersistenceStrategies,
} from './PersistedValueGetter';
import {
  ArchTextTags,
  ArchivedTexts,
  Languages,
  Sentences,
  Settings,
  Tags,
  Tags2,
  TextItems,
  TextTags,
  Texts,
  WordTags,
  Words,
} from './parseMySqlDump';
import { LanguagesId, TextsId } from './validators';

export interface DataState {
  archivedtexts: ArchivedTexts[];
  archtexttags: ArchTextTags[];
  languages: Languages[];
  sentences: Sentences[];
  settings: Settings[];
  tags: Tags[];
  tags2: Tags2[];
  textitems: TextItems[];
  texts: Texts[];
  texttags: TextTags[];
  words: Words[];
  wordtags: WordTags[];

  activeLanguageId: LanguagesId | null;
  parsedTexts: Record<TextsId, { text: string; isTerm: boolean }[]>;

  notificationMessage: null | { txt: string; time };
}
export const ACTIVE_LANGUAGE_LOCAL_STORAGE_KEY = 'activeLanguageId' as const;

// TODO decide this on compile w DI token
const MyPersistanceStrategy = AppVariables.persistMethod;
export const MyPersistanceHandles =
  PersistenceStrategies[MyPersistanceStrategy];

export function createDemoDBInitialState(): DataState {
  return {
    ...demoDB,
    parsedTexts: [],
    wordtags: [],
    notificationMessage: null,
  };
}

@StoreConfig({ name: 'data' })
export class DataStore extends Store<DataState> {
  constructor() {
    const { get: persistGetter } = MyPersistanceHandles;
    // TODO type issues
    super(getPersistedData(persistGetter));
  }
}

export const dataStore = new DataStore();
function getPersistedData(
  persistGetter: PersistedValueGetter
): Partial<DataState> {
  return {
    settings: persistGetter('settings', []),
    activeLanguageId: persistGetter('activeLanguageId', null),
    archivedtexts: persistGetter('archivedtexts', []),
    archtexttags: persistGetter('archtexttags', []),
    languages: persistGetter('languages', []),
    parsedTexts: persistGetter('parsedTexts', []),
    sentences: persistGetter('sentences', []),
    tags2: persistGetter('tags2', []),
    tags: persistGetter('tags', []),
    textitems: persistGetter('textitems', []),
    texts: persistGetter('texts', []),
    texttags: persistGetter('texttags', []),
    words: persistGetter('words', []),
    wordtags: persistGetter('wordtags', []),
  };
}
