import { Store, StoreConfig } from '@datorama/akita';
import { LoremIpsum } from '../ui-kit/LoremIpsum';
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
import { LanguagesId, Tags2Id, TagsId, TextsId, WordsId } from './validators';

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

// TODO persist
export function createInitialState(): DataState {
  return {
    archivedtexts: [],
    archtexttags: [],
    languages: [
      {
        LgName: 'Amharic',
        LgID: 0 as LanguagesId,
        LgDict1URI: 'test123###',
        LgDict2URI: 'test123###',
        LgCharacterSubstitutions: '',
        LgExceptionsSplitSentences: '',
        LgExportTemplate: '',
        LgRegexpSplitSentences: '',
        LgRegexpWordCharacters: '',
        LgTextSize: 100,
        LgSplitEachChar: 100,
        LgRightToLeft: 0,
        LgRemoveSpaces: 0,
      },
      {
        LgName: 'Chinese',
        LgID: 1 as LanguagesId,
        LgDict1URI: 'test123###',
        LgDict2URI: 'test123###',
        LgCharacterSubstitutions: '',
        LgExceptionsSplitSentences: '',
        LgExportTemplate: '',
        LgRegexpSplitSentences: '',
        LgRegexpWordCharacters: '',
        LgTextSize: 100,
        LgSplitEachChar: 100,
        LgRightToLeft: 0,
        LgRemoveSpaces: 0,
      },
      {
        LgName: 'Spanish',
        LgID: 2 as LanguagesId,
        LgDict1URI: 'test123###',
        LgDict2URI: 'test123###',
        LgCharacterSubstitutions: '',
        LgExceptionsSplitSentences: '',
        LgExportTemplate: '',
        LgRegexpSplitSentences: '',
        LgRegexpWordCharacters: '',
        LgTextSize: 100,
        LgSplitEachChar: 100,
        LgRightToLeft: 0,
        LgRemoveSpaces: 0,
      },
    ],
    sentences: [],
    settings: [],
    tags: [
      { TgComment: 'test comment', TgID: 0 as TagsId, TgText: 'test tag' },
      {
        TgComment: 'test comment 2',
        TgID: 1 as TagsId,
        TgText: 'test tag2',
      },
    ],
    tags2: [
      {
        T2Comment: 'test',
        T2ID: 0 as Tags2Id,
        T2Text: 'test tag2',
      },
    ],
    // TODO what's this
    textitems: [],
    texts: [
      {
        TxText: LoremIpsum(300),
        TxTitle: 'title test',
        TxID: 2 as TextsId,
        TxLgID: 0 as LanguagesId,
        TxAnnotatedText: '',
      },
    ],
    texttags: [
      { TtT2ID: 0 as Tags2Id, TtTxID: 2 as TextsId },
      { TtT2ID: 1 as Tags2Id, TtTxID: 2 as TextsId },
      { TtT2ID: 1 as Tags2Id, TtTxID: 2 as TextsId },
    ],
    words: [
      {
        WoID: 0 as WordsId,
        WoLgID: 0 as LanguagesId,
        WoRomanization: 'test',
        WoSentence: 'test test test',
        WoStatus: 1,
        WoText: 'facilisis',
        WoTranslation: 'english',
        WoCreated: 2345,
        WoTextLC: '',
        WoStatusChanged: 12345,
        WoTodayScore: 0,
        WoTomorrowScore: 0,
        WoRandom: 0,
      },
      {
        WoID: 1 as WordsId,
        WoText: 'libero',
        WoStatus: 2,

        WoLgID: 0 as LanguagesId,
        WoRomanization: 'test',
        WoSentence: 'test test test',
        WoTranslation: 'english',
        WoCreated: 12345,
        WoTextLC: '',
        WoStatusChanged: 12345,
        WoTodayScore: 0,
        WoTomorrowScore: 0,
        WoRandom: 0,
      },
      {
        WoID: 2 as WordsId,
        WoText: 'maecenas',
        WoStatus: 3,

        WoLgID: 0 as LanguagesId,
        WoRomanization: 'testrom',
        WoSentence: 'test test 123',
        WoTranslation: 'english',
        WoCreated: 345,
        WoTextLC: '',
        WoStatusChanged: 12345,
        WoTodayScore: 0,
        WoTomorrowScore: 0,
        WoRandom: 0,
      },
      {
        WoID: 3 as WordsId,
        WoText: 'efficitur',
        WoStatus: 4,

        WoLgID: 0 as LanguagesId,
        WoRomanization: 'test',
        WoSentence: 'test test test',
        WoTranslation: 'english',
        WoCreated: 45,
        WoTextLC: '',
        WoStatusChanged: 12345,
        WoTodayScore: 0,
        WoTomorrowScore: 0,
        WoRandom: 0,
      },
      {
        WoID: 4 as WordsId,
        WoText: 'porta',
        WoStatus: 5,

        WoLgID: 0 as LanguagesId,
        WoRomanization: 'test',
        WoTranslation: 'english1',
        WoCreated: 5,
        WoTextLC: '',
        WoStatusChanged: 12345,
        WoTodayScore: 0,
        WoTomorrowScore: 0,
        WoRandom: 0,
      },
      {
        WoID: 5 as WordsId,
        WoText: 'gravida',
        WoStatus: 98,

        WoLgID: 0 as LanguagesId,
        WoRomanization: 'test',
        WoTranslation: 'english123',
        WoCreated: 987,
        WoTextLC: '',
        WoStatusChanged: 12345,
        WoTodayScore: 0,
        WoTomorrowScore: 0,
        WoRandom: 0,
      },
      {
        WoID: 6 as WordsId,
        WoText: 'curabitur',
        WoStatus: 99,

        WoLgID: 0 as LanguagesId,
        WoRomanization: 'testrom',
        WoSentence: 'test test test',
        WoTranslation: 'english test',
        WoCreated: 2312123,
        WoTextLC: '',
        WoStatusChanged: 12345,
        WoTodayScore: 0,
        WoTomorrowScore: 0,
        WoRandom: 0,
      },
    ],
    wordtags: [],

    // TODO save in cookie/local storage?
    activeLanguageId: 0 as LanguagesId,
  };
}

@StoreConfig({ name: 'data' })
export class DataStore extends Store<DataState> {
  constructor() {
    super(createInitialState());
  }
}

export const dataStore = new DataStore();
