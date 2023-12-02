import { Store, StoreConfig } from '@datorama/akita';
import { Persistable } from '../../../shared/Persistable';
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
import { TextsId } from './validators';

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

  parsedTexts: Record<TextsId, { text: string; isTerm: boolean }[]>;
  notificationMessage: null | { txt: string };
}

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
/**
 *
 * @param persistGetter
 */
function getPersistedData(
  persistGetter: PersistedValueGetter
): Partial<DataState> {
  return {
    settings: persistGetter('settings', []),
    parsedTexts: persistGetter('parsedTexts', []),
    sentences: persistGetter('sentences', []),
    archivedtexts: persistGetter(Persistable.archivedtexts, []),
    archtexttags: persistGetter(Persistable.archtexttags, []),
    languages: persistGetter(Persistable.languages, []),
    tags2: persistGetter(Persistable.tags2, []),
    tags: persistGetter(Persistable.tags, []),
    textitems: persistGetter(Persistable.textitems, []),
    texts: persistGetter(Persistable.texts, []),
    texttags: persistGetter(Persistable.texttags, []),
    words: persistGetter(Persistable.words, []),
    wordtags: persistGetter(Persistable.wordtags, []),
  };
}
