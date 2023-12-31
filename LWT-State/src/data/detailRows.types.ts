/** ================== */

import { ArchivedText, Language, Tag, Tag2, Text, Word } from "lwt-schemas";

// TODO
export type LanguageDetailRow = Language & { termCount: number };
export type TermDetailRow = Word & {
  termCount: number;
  WoLgName: Language["LgName"];
};
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
  saved: number;
  unk: number;
  // in range 0-100
  unkPerc: number;
  taglist: Tag2["T2Text"][];
  TxLgName: Language["LgName"];
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
  AtLgName: Language["LgName"];
  unk: number;
  unkPerc: number;
};
