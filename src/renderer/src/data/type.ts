type BrandedString<TBrand extends string> = string & { __brand: TBrand };
type URL = BrandedString<'URL'>;
type TextSize = 100 | 150 | 200 | 250;
export const TermStrengths = [1, 2, 3, 4, 5, 'WKn', 'Ign'] as const;
export type TermStrength = typeof TermStrengths[number];
export type TermStrengthOrUnknown = TermStrength | 0;
type LanguageId = BrandedString<'Language ID'>;
export type Language = {
  id: LanguageId;
  name: string;
  dict1Url: URL;
  dict2Url?: URL;
  gTranUrl?: URL;
  textSize?: TextSize;
  characterSubs?: string;
  regexpSplitSent: string;
  exceptionsSplitSent?: string;
  regexpWordChar: string;
  eachCharWord: boolean;
  remSpaces: boolean;
  rtlScript: boolean;
  exportTemplate?: string;
};

type TextId = BrandedString<'Text ID'>;
type Tag = string;
export type Text = {
  id: TextId;
  langId: LanguageId;
  title: string;
  text: string;
  annText: any;
  sourceUrl?: URL;
  tags: Tag[];
  audioUrl?: URL;
};
type TermId = BrandedString<'Term ID'>;
export type Term = {
  id: TermId;
  langId: LanguageId;
  tags: Tag[];
  romanization?: string;
  sentenceTermIn: string;
  termStatus: TermStrength;
};

export enum Strength {
  unencountered,
  seen,
  planted,
  growing,
  bloomed,
  ignore,
}

// export type Term = {
//   id: string;
//   contents: string;
//   language: LangCode;
//   strength: Strength;
// };
