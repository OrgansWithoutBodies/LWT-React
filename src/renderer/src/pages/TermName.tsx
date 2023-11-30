import { Words } from '../data/parseMySqlDump';

export type TermName = 'w' | 't' | 'r' | 's' | 'g' | 'x';

export const ColumnImportMode: Record<
  TermName,
  { txt: string; termParam: keyof Words }
> = {
  w: { termParam: 'WoText', txt: 'Term' },
  t: { termParam: 'WoTranslation', txt: 'Translation' },
  r: { termParam: 'WoRomanization', txt: 'Romanization' },
  s: { termParam: 'WoSentence', txt: 'Sentence' },
  g: { termParam: 'TODO', txt: 'Tag List' },
  x: { termParam: 'TODO', txt: "Don't Import" },
};
