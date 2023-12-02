import { Language } from './parseMySqlDump';

// TODO get more details from wikidata?
// https://www.wikidata.org/wiki/Property:P4132
// https://www.wikidata.org/wiki/Property:P219
// https://www.wikidata.org/wiki/Property:P220
// https://www.wikidata.org/wiki/Property:P9753
// TODO make more pluginnable
// TODO get langs from csv/google sheet?

export type LangDef = Pick<
  Language,
  'LgTextSize' | 'LgRegexpSplitSentences' | 'LgRegexpWordCharacters'
> & {
  LgGTransKey: string;
  LgGlosbeKey: string;
  LgSplitEachChar: boolean;
  LgRemoveSpaces: boolean;
  LgRightToLeft: boolean;
};
export const LANGS = [
  'Afrikaans',
  'Arabic',
  'Belarusian',
  'Bulgarian',
  'Catalan',
  'Chinese (Simplified)',
  'Chinese (Traditional)',
  'Croatian',
  'Czech',
  'Danish',
  'Dutch',
  'English',
  'Esperanto',
  'Estonian',
  'Finnish',
  'French',
  'German',
  'Greek (Modern)',
  'Hebrew',
  'Hungarian',
  'Italian',
  'Japanese',
  'Korean',
  'Latin',
  'Latvian',
  'Lithuanian',
  'Macedonian',
  'Norwegian Bokm\u00e5l',
  'Polish',
  'Portuguese',
  'Romanian',
  'Russian',
  'Serbian',
  'Slovak',
  'Spanish',
  'Swedish',
  'Thai',
  'Turkish',
  'Ukrainian',
] as const;
export const LANGDEFS: Record<(typeof LANGS)[number], LangDef> = {
  Afrikaans: {
    LgGlosbeKey: 'af',
    LgGTransKey: 'af',
    LgTextSize: 150,
    LgRegexpSplitSentences:
      "\\-\\'a-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u0233\u0400-\u04f9",
    LgRegexpWordCharacters: '.!?:;',
    LgSplitEachChar: false,
    LgRemoveSpaces: false,
    LgRightToLeft: false,
  },
  Arabic: {
    LgGlosbeKey: 'ar',
    LgGTransKey: 'ar',
    LgTextSize: 200,
    LgRegexpSplitSentences:
      '\\x{0600}-\\x{061A}\\x{0620}-\\x{06FF}\\x{0750}-\\x{077F}\\x{FB50}-\\x{FDFF}\\x{FE70}-\\x{FEFF}',
    LgRegexpWordCharacters: '.!?:;\\x{061B}\\x{061F}',
    LgSplitEachChar: false,
    LgRemoveSpaces: false,
    LgRightToLeft: true,
  },
  Belarusian: {
    LgGlosbeKey: 'be',
    LgGTransKey: 'be',
    LgTextSize: 150,
    LgRegexpSplitSentences:
      "\\-\\'a-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u0233\u0400-\u04f9",
    LgRegexpWordCharacters: '.!?:;',
    LgSplitEachChar: false,
    LgRemoveSpaces: false,
    LgRightToLeft: false,
  },
  Bulgarian: {
    LgGlosbeKey: 'bg',
    LgGTransKey: 'bg',
    LgTextSize: 150,
    LgRegexpSplitSentences:
      "\\-\\'a-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u0233\u0400-\u04f9",
    LgRegexpWordCharacters: '.!?:;',
    LgSplitEachChar: false,
    LgRemoveSpaces: false,
    LgRightToLeft: false,
  },
  Catalan: {
    LgGlosbeKey: 'ca',
    LgGTransKey: 'ca',
    LgTextSize: 150,
    LgRegexpSplitSentences:
      "\\-\\'a-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u0233\u0400-\u04f9",
    LgRegexpWordCharacters: '.!?:;',
    LgSplitEachChar: false,
    LgRemoveSpaces: false,
    LgRightToLeft: false,
  },
  'Chinese (Simplified)': {
    LgGlosbeKey: 'zh',
    LgGTransKey: 'zh-CN',
    LgTextSize: 200,
    LgRegexpSplitSentences: '\\x{4E00}-\\x{9FFF}\\x{F900}-\\x{FAFF}',
    LgRegexpWordCharacters: '.!?:;\u3002\uff01\uff1f\uff1a\uff1b',
    LgSplitEachChar: true,
    LgRemoveSpaces: true,
    LgRightToLeft: false,
  },
  'Chinese (Traditional)': {
    LgGlosbeKey: 'zh',
    LgGTransKey: 'zh-TW',
    LgTextSize: 200,
    LgRegexpSplitSentences:
      '\\x{4E00}-\\x{9FFF}\\x{F900}-\\x{FAFF}\\x{3100}-\\x{312F}',
    LgRegexpWordCharacters: '.!?:;\u3002\uff01\uff1f\uff1a\uff1b',
    LgSplitEachChar: true,
    LgRemoveSpaces: true,
    LgRightToLeft: false,
  },
  Croatian: {
    LgGlosbeKey: 'hr',
    LgGTransKey: 'hr',
    LgTextSize: 150,
    LgRegexpSplitSentences:
      "\\-\\'a-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u0233\u0400-\u04f9",
    LgRegexpWordCharacters: '.!?:;',
    LgSplitEachChar: false,
    LgRemoveSpaces: false,
    LgRightToLeft: false,
  },
  Czech: {
    LgGlosbeKey: 'cs',
    LgGTransKey: 'cs',
    LgTextSize: 150,
    LgRegexpSplitSentences:
      "\\-\\'a-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u0233\u0400-\u04f9",
    LgRegexpWordCharacters: '.!?:;',
    LgSplitEachChar: false,
    LgRemoveSpaces: false,
    LgRightToLeft: false,
  },
  Danish: {
    LgGlosbeKey: 'da',
    LgGTransKey: 'da',
    LgTextSize: 150,
    LgRegexpSplitSentences:
      "\\-\\'a-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u0233\u0400-\u04f9",
    LgRegexpWordCharacters: '.!?:;',
    LgSplitEachChar: false,
    LgRemoveSpaces: false,
    LgRightToLeft: false,
  },
  Dutch: {
    LgGlosbeKey: 'nl',
    LgGTransKey: 'nl',
    LgTextSize: 150,
    LgRegexpSplitSentences:
      "\\-\\'a-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u0233\u0400-\u04f9",
    LgRegexpWordCharacters: '.!?:;',
    LgSplitEachChar: false,
    LgRemoveSpaces: false,
    LgRightToLeft: false,
  },
  English: {
    LgGlosbeKey: 'en',
    LgGTransKey: 'en',
    LgTextSize: 150,
    LgRegexpSplitSentences:
      "\\-\\'a-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u0233\u0400-\u04f9",
    LgRegexpWordCharacters: '.!?:;',
    LgSplitEachChar: false,
    LgRemoveSpaces: false,
    LgRightToLeft: false,
  },
  Esperanto: {
    LgGlosbeKey: 'eo',
    LgGTransKey: 'eo',
    LgTextSize: 150,
    LgRegexpSplitSentences:
      "\\-\\'a-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u0233\u0400-\u04f9",
    LgRegexpWordCharacters: '.!?:;',
    LgSplitEachChar: false,
    LgRemoveSpaces: false,
    LgRightToLeft: false,
  },
  Estonian: {
    LgGlosbeKey: 'et',
    LgGTransKey: 'et',
    LgTextSize: 150,
    LgRegexpSplitSentences:
      "\\-\\'a-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u0233\u0400-\u04f9",
    LgRegexpWordCharacters: '.!?:;',
    LgSplitEachChar: false,
    LgRemoveSpaces: false,
    LgRightToLeft: false,
  },
  Finnish: {
    LgGlosbeKey: 'fi',
    LgGTransKey: 'fi',
    LgTextSize: 150,
    LgRegexpSplitSentences:
      "\\-\\'a-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u0233\u0400-\u04f9",
    LgRegexpWordCharacters: '.!?:;',
    LgSplitEachChar: false,
    LgRemoveSpaces: false,
    LgRightToLeft: false,
  },
  French: {
    LgGlosbeKey: 'fr',
    LgGTransKey: 'fr',
    LgTextSize: 150,
    LgRegexpSplitSentences:
      "\\-\\'a-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u0233\u0400-\u04f9",
    LgRegexpWordCharacters: '.!?:;',
    LgSplitEachChar: false,
    LgRemoveSpaces: false,
    LgRightToLeft: false,
  },
  German: {
    LgGlosbeKey: 'de',
    LgGTransKey: 'de',
    LgTextSize: 150,
    LgRegexpSplitSentences:
      "\\-\\'a-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u0233\u0400-\u04f9",
    LgRegexpWordCharacters: '.!?:;',
    LgSplitEachChar: false,
    LgRemoveSpaces: false,
    LgRightToLeft: false,
  },
  'Greek (Modern)': {
    LgGlosbeKey: 'el',
    LgGTransKey: 'el',
    LgTextSize: 150,
    LgRegexpSplitSentences: '\\x{0370}-\\x{03FF}\\x{1F00}-\\x{1FFF}',
    LgRegexpWordCharacters: '.!?:;',
    LgSplitEachChar: false,
    LgRemoveSpaces: false,
    LgRightToLeft: false,
  },
  Hebrew: {
    LgGlosbeKey: 'he',
    LgGTransKey: 'iw',
    LgTextSize: 200,
    LgRegexpSplitSentences: '\\x{0590}-\\x{05FF}',
    LgRegexpWordCharacters: '.!?:;',
    LgSplitEachChar: false,
    LgRemoveSpaces: false,
    LgRightToLeft: true,
  },
  Hungarian: {
    LgGlosbeKey: 'hu',
    LgGTransKey: 'hu',
    LgTextSize: 150,
    LgRegexpSplitSentences:
      "\\-\\'a-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u0233\u0400-\u04f9",
    LgRegexpWordCharacters: '.!?:;',
    LgSplitEachChar: false,
    LgRemoveSpaces: false,
    LgRightToLeft: false,
  },
  Italian: {
    LgGlosbeKey: 'it',
    LgGTransKey: 'it',
    LgTextSize: 150,
    LgRegexpSplitSentences:
      "\\-\\'a-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u0233\u0400-\u04f9",
    LgRegexpWordCharacters: '.!?:;',
    LgSplitEachChar: false,
    LgRemoveSpaces: false,
    LgRightToLeft: false,
  },
  Japanese: {
    LgGlosbeKey: 'ja',
    LgGTransKey: 'ja',
    LgTextSize: 200,
    LgRegexpSplitSentences:
      '\\x{4E00}-\\x{9FFF}\\x{F900}-\\x{FAFF}\\x{3040}-\\x{30FF}\\x{31F0}-\\x{31FF}',
    LgRegexpWordCharacters: '.!?:;\u3002\uff01\uff1f\uff1a\uff1b',
    LgSplitEachChar: true,
    LgRemoveSpaces: true,
    LgRightToLeft: false,
  },
  Korean: {
    LgGlosbeKey: 'ko',
    LgGTransKey: 'ko',
    LgTextSize: 200,
    LgRegexpSplitSentences:
      '\\x{4E00}-\\x{9FFF}\\x{F900}-\\x{FAFF}\\x{1100}-\\x{11FF}\\x{3130}-\\x{318F}\\x{AC00}-\\x{D7A0}',
    LgRegexpWordCharacters: '.!?:;\u3002\uff01\uff1f\uff1a\uff1b',
    LgSplitEachChar: false,
    LgRemoveSpaces: false,
    LgRightToLeft: false,
  },
  Latin: {
    LgGlosbeKey: 'la',
    LgGTransKey: 'la',
    LgTextSize: 150,
    LgRegexpSplitSentences:
      "\\-\\'a-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u0233\u0400-\u04f9",
    LgRegexpWordCharacters: '.!?:;',
    LgSplitEachChar: false,
    LgRemoveSpaces: false,
    LgRightToLeft: false,
  },
  Latvian: {
    LgGlosbeKey: 'lv',
    LgGTransKey: 'lv',
    LgTextSize: 150,
    LgRegexpSplitSentences:
      "\\-\\'a-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u0233\u0400-\u04f9",
    LgRegexpWordCharacters: '.!?:;',
    LgSplitEachChar: false,
    LgRemoveSpaces: false,
    LgRightToLeft: false,
  },
  Lithuanian: {
    LgGlosbeKey: 'lt',
    LgGTransKey: 'lt',
    LgTextSize: 150,
    LgRegexpSplitSentences:
      "\\-\\'a-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u0233\u0400-\u04f9",
    LgRegexpWordCharacters: '.!?:;',
    LgSplitEachChar: false,
    LgRemoveSpaces: false,
    LgRightToLeft: false,
  },
  Macedonian: {
    LgGlosbeKey: 'mk',
    LgGTransKey: 'mk',
    LgTextSize: 150,
    LgRegexpSplitSentences:
      "\\-\\'a-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u0233\u0400-\u04f9",
    LgRegexpWordCharacters: '.!?:;',
    LgSplitEachChar: false,
    LgRemoveSpaces: false,
    LgRightToLeft: false,
  },
  'Norwegian Bokm\u00e5l': {
    LgGlosbeKey: 'nb',
    LgGTransKey: 'no',
    LgTextSize: 150,
    LgRegexpSplitSentences:
      "\\-\\'a-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u0233\u0400-\u04f9",
    LgRegexpWordCharacters: '.!?:;',
    LgSplitEachChar: false,
    LgRemoveSpaces: false,
    LgRightToLeft: false,
  },
  Polish: {
    LgGlosbeKey: 'pl',
    LgGTransKey: 'pl',
    LgTextSize: 150,
    LgRegexpSplitSentences:
      "\\-\\'a-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u0233\u0400-\u04f9",
    LgRegexpWordCharacters: '.!?:;',
    LgSplitEachChar: false,
    LgRemoveSpaces: false,
    LgRightToLeft: false,
  },
  Portuguese: {
    LgGlosbeKey: 'pt',
    LgGTransKey: 'pt',
    LgTextSize: 150,
    LgRegexpSplitSentences:
      "\\-\\'a-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u0233\u0400-\u04f9",
    LgRegexpWordCharacters: '.!?:;',
    LgSplitEachChar: false,
    LgRemoveSpaces: false,
    LgRightToLeft: false,
  },
  Romanian: {
    LgGlosbeKey: 'ro',
    LgGTransKey: 'ro',
    LgTextSize: 150,
    LgRegexpSplitSentences:
      "\\-\\'a-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u0233\u0400-\u04f9",
    LgRegexpWordCharacters: '.!?:;',
    LgSplitEachChar: false,
    LgRemoveSpaces: false,
    LgRightToLeft: false,
  },
  Russian: {
    LgGlosbeKey: 'ru',
    LgGTransKey: 'ru',
    LgTextSize: 150,
    LgRegexpSplitSentences:
      "\\-\\'a-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u0233\u0400-\u04f9",
    LgRegexpWordCharacters: '.!?:;',
    LgSplitEachChar: false,
    LgRemoveSpaces: false,
    LgRightToLeft: false,
  },
  Serbian: {
    LgGlosbeKey: 'sr',
    LgGTransKey: 'sr',
    LgTextSize: 150,
    LgRegexpSplitSentences:
      "\\-\\'a-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u0233\u0400-\u04f9",
    LgRegexpWordCharacters: '.!?:;',
    LgSplitEachChar: false,
    LgRemoveSpaces: false,
    LgRightToLeft: false,
  },
  Slovak: {
    LgGlosbeKey: 'sk',
    LgGTransKey: 'sk',
    LgTextSize: 150,
    LgRegexpSplitSentences:
      "\\-\\'a-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u0233\u0400-\u04f9",
    LgRegexpWordCharacters: '.!?:;',
    LgSplitEachChar: false,
    LgRemoveSpaces: false,
    LgRightToLeft: false,
  },
  Spanish: {
    LgGlosbeKey: 'es',
    LgGTransKey: 'es',
    LgTextSize: 150,
    LgRegexpSplitSentences:
      "\\-\\'a-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u0233\u0400-\u04f9",
    LgRegexpWordCharacters: '.!?:;',
    LgSplitEachChar: false,
    LgRemoveSpaces: false,
    LgRightToLeft: false,
  },
  Swedish: {
    LgGlosbeKey: 'sv',
    LgGTransKey: 'sv',
    LgTextSize: 150,
    LgRegexpSplitSentences:
      "\\-\\'a-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u0233\u0400-\u04f9",
    LgRegexpWordCharacters: '.!?:;',
    LgSplitEachChar: false,
    LgRemoveSpaces: false,
    LgRightToLeft: false,
  },
  Thai: {
    LgGlosbeKey: 'th',
    LgGTransKey: 'th',
    LgTextSize: 200,
    LgRegexpSplitSentences: '\\x{0E00}-\\x{0E7F}',
    LgRegexpWordCharacters: '.!?:;',
    LgSplitEachChar: false,
    LgRemoveSpaces: false,
    LgRightToLeft: false,
  },
  Turkish: {
    LgGlosbeKey: 'tr',
    LgGTransKey: 'tr',
    LgTextSize: 150,
    LgRegexpSplitSentences:
      "\\-\\'a-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u0233\u0400-\u04f9",
    LgRegexpWordCharacters: '.!?:;',
    LgSplitEachChar: false,
    LgRemoveSpaces: false,
    LgRightToLeft: false,
  },
  Ukrainian: {
    LgGlosbeKey: 'uk',
    LgGTransKey: 'uk',
    LgTextSize: 150,
    LgRegexpSplitSentences:
      "\\-\\'a-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u0233\u0400-\u04f9",
    LgRegexpWordCharacters: '.!?:;',
    LgSplitEachChar: false,
    LgRemoveSpaces: false,
    LgRightToLeft: false,
  },
};
