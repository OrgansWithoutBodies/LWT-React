import { Word } from "lwt-schemas";

export type TermName = "w" | "t" | "r" | "s" | "g" | "x";
export type RelevantTermName = Exclude<TermName, "x">;

export const ColumnImportMode: Record<
  TermName,
  {
    txt: string;
    termParam:
      | "WoText"
      | "WoTranslation"
      | "WoRomanization"
      | "WoSentence"
      | "taglist"
      | null;
  }
> = {
  w: { termParam: "WoText", txt: "Term" },
  t: { termParam: "WoTranslation", txt: "Translation" },
  r: { termParam: "WoRomanization", txt: "Romanization" },
  s: { termParam: "WoSentence", txt: "Sentence" },
  g: { termParam: "taglist", txt: "Tag List" },
  x: { termParam: null, txt: "Don't Import" },
};
export type ColumnImportModeTermParam = Exclude<
  (typeof ColumnImportMode)[RelevantTermName]["termParam"],
  null
>;

export type ItemsFromWord = keyof Word & ColumnImportModeTermParam;
