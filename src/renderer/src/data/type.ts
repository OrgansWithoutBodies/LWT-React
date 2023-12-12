import { textSizes } from './validators';

type BrandedString<TBrand extends string> = string & { __brand: TBrand };
export type BrandedURL = BrandedString<'URL'>;
export type TextSize = (typeof textSizes)[number];
export const TermStrengths = [1, 2, 3, 4, 5, 'WKn', 'Ign'] as const;
export type TermStrength = (typeof TermStrengths)[number];
export type TermStrengthOrUnknown = TermStrength | 0;
type LanguageId = BrandedString<'Language ID'>;

type Tag = string;
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
