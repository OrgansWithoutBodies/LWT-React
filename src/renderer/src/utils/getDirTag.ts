import { Language } from './parseMySqlDump';

export const getDirTag = (
  language: Pick<Language, 'LgRightToLeft'>
): { dir: 'rtl' | 'ltr' } => ({
  dir: language.LgRightToLeft ? 'rtl' : 'ltr',
});
