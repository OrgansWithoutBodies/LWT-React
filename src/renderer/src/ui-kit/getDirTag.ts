import { Language } from '../utils/parseMySqlDump';

export const getDirTag = (language: Pick<Language, 'LgRightToLeft'>) => ({
  dir: language.LgRightToLeft ? 'rtl' : 'ltr',
});
