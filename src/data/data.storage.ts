import { Store, StoreConfig } from '@datorama/akita';
import demoDB from '../demo_db.json';
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
}
export const ACTIVE_LANGUAGE_LOCAL_STORAGE_KEY = 'ACTIVE_LANG_ID' as const;
// TODO persist - 'dataStrategy' as a build flag for different compile targets

export function createDemoDBInitialState(): DataState {
  return {
    ...demoDB,
    parsedTexts: [],
    wordtags: [],
  };
}

@StoreConfig({ name: 'data' })
export class DataStore extends Store<DataState> {
  constructor() {
    const localActiveLanguageID = localStorage.getItem(
      ACTIVE_LANGUAGE_LOCAL_STORAGE_KEY
    );
    console.log('local', localActiveLanguageID);
    super({
      ...createDemoDBInitialState(),
      activeLanguageId:
        localActiveLanguageID === null
          ? null
          : Number.parseInt(localActiveLanguageID),
    });
  }
}

export const dataStore = new DataStore();
