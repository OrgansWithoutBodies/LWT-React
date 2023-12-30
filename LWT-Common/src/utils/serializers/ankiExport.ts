// TODO
import {
  downloadTextFile,
  makeCurrentDateTimeString,
  maskTermInSentence,
  replaceTabsWithNewLine,
} from "lwt-common";
import { Language, Word } from "lwt-schemas";

// 	   ifnull(group_concat(distinct TgText order by TgText separator \' \'),\'\') as taglist
export type TermExportRow = Pick<
  Word & Language,
  | "WoID"
  | "LgRightToLeft"
  | "LgRegexpWordCharacters"
  | "LgName"
  | "WoText"
  | "WoStatus"
  | "WoTranslation"
  | "WoRomanization"
  | "WoSentence"
> & { taglist: string[] };

const wrapRTL = (val: string, rtl: TermExportRow["LgRightToLeft"]) => {
  return `${rtl ? '<span dir="rtl">' : ""}${val}${rtl ? "</span>" : ""}`;
};
function fillAnkiTemplateForCard({
  LgRightToLeft,
  WoText,
  WoTranslation,
  WoRomanization,
  LgName,
  WoID,
  taglist,
  sent1,
  sent2,
}: TermExportRow & { sent1: string; sent2: string }) {
  const wrap = (val: string) => wrapRTL(val, LgRightToLeft);
  return `${wrap(replaceTabsWithNewLine(WoText))}\t${replaceTabsWithNewLine(
    WoTranslation
  )}\t${
    WoRomanization ? replaceTabsWithNewLine(WoRomanization) : "NULL"
  }\t${wrap(sent1)}\t${wrap(sent2)}\t${replaceTabsWithNewLine(
    LgName
  )}\t${WoID}\t${taglist}\r\n`;
}
export function anki_export(exportRows: TermExportRow[]) {
  const parsedTerms = exportRows.map((record) => {
    const { LgRightToLeft, WoSentence, LgRegexpWordCharacters } = record;
    const lpar = LgRightToLeft ? "]" : "[";
    const rpar = LgRightToLeft ? "[" : "]";
    const sent = replaceTabsWithNewLine(WoSentence ? WoSentence : "NULL");
    // LgRegexpWordCharacters.replace
    const sent1 = maskTermInSentence(sent, LgRegexpWordCharacters)
      .replace("}", `${rpar}</span>`)
      .replace("{", `<span style="font-weight:600; color:#0000ff;">${lpar}`);
    // sent1 = str_replace(
    // 	"{",
    // 	'<span style="font-weight:600; color:#0000ff;">' . lpar,
    // 	str_replace(
    // 		"}",
    // 		rpar . '</span>',
    // 		maskTermInSentence(sent, record["LgRegexpWordCharacters"])
    // 	)
    // );
    const sent2 = sent
      .replace("{", '<span style="font-weight:600; color:#0000ff;">')
      .replace("}", "</span>");
    return fillAnkiTemplateForCard({ ...record, sent1, sent2 });
  });
  // TODO
  // header('Content-type: text/plain; charset=utf-8');
  // header("Content-disposition: attachment)
  downloadTextFile(
    parsedTerms.join(""),
    `lwt_anki_export_${makeCurrentDateTimeString()}.txt"`
  );
}
