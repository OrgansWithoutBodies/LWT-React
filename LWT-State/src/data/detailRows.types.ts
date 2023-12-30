/** ================== */

import { ArchivedText, Language, Tag, Tag2, Text, Word } from "lwt-schemas";

// TODO
export type LanguageDetailRow = Language & { termCount: number };
export type TermDetailRow = Word & { termCount: number };
export type WordTagDetailRow = Tag & { termCount: number };

export type TextTagDetailRow = Tag2 & {
  textCount: number;
  archTextCount: number;
};

export type TextDetailRow = Pick<
  Text,
  | "TxTitle"
  | "TxSourceURI"
  | "TxAudioURI"
  | "TxID"
  | "TxLgID"
  | "TxAnnotatedText"
> & {
  totalWords: number;
  saved: string;
  unk: number;
  unkPerc: number;
  TxLgName: string;
};

export type ArchivedTextDetailRow = Pick<
  ArchivedText,
  | "AtTitle"
  | "AtSourceURI"
  | "AtAudioURI"
  | "AtID"
  | "AtLgID"
  | "AtAnnotatedText"
> & {
  totalWords: number;
  saved: string;
  unk: number;
  unkPerc: number;
};
