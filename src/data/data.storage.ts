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
import { LanguagesId } from './validators';

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
}
console.log(demoDB);
// TODO persist
export function createInitialState(): DataState {
  return {
    ...demoDB,
    wordtags: [],
    // TODO save in cookie/local storage?
    activeLanguageId: 1 as LanguagesId,
  };
}

@StoreConfig({ name: 'data' })
export class DataStore extends Store<DataState> {
  constructor() {
    super(createInitialState());
  }
}

export const dataStore = new DataStore();
