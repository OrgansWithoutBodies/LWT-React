import { Language } from '../utils/parseMySqlDump';

export const getDirTag = (language: Language) => ({
  dir: language.LgRightToLeft ? 'rtl' : 'ltr',
});
