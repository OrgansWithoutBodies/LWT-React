import { Language, Word } from '../../utils/parseMySqlDump';

export type WordKnownTermLines = Pick<
  Word,
  'WoText' | 'WoRomanization' | 'WoStatus' | 'WoTranslation' | 'WoID'
>;
export type LanguageDictionaryData = Pick<
  Language,
  'LgDict1URI' | 'LgDict2URI' | 'LgGoogleTranslateURI'
>;
