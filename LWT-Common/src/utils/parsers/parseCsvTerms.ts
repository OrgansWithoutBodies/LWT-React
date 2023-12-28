import { UploadTermsValidator, Word } from "lwt-schemas";
import { parse } from "papaparse";
import {
  ColumnImportMode,
  ColumnImportModeTermParam,
  ItemsFromWord,
  RelevantTermName,
  TermName,
} from "./ColumnImportMode";

// TODO
// const ColumnType = [
//   "Term",
//   "Translation",
//   "Romanization",
//   "Sentence",
//   "Tag List",
//   "Don't import",
// ] as const;
// const ColumnID = ["C1", "C2", "C3", "C4", "C5"] as const;
// TODO
// const overwriteTermsStr = "Overwrite existent terms: ";
export const delimiterMap = { c: ",", t: "\t", h: "#" };

// TODO
// type ColumnAssignment = {
//   [columnNumber in (typeof ColumnID)[number]]: (typeof ColumnType)[number];
// };
export type TermParsedFromCSV = Word & {
  taglist: string[];
};

/**
 *
 * @param refMap
 */
export async function parseTermsFromCSV<
  TData extends ReturnType<typeof UploadTermsValidator>["TYPE"] = ReturnType<
    typeof UploadTermsValidator
  >["TYPE"]
>(value: TData): Promise<TermParsedFromCSV[]> {
  const fileBlob = value.file.file;
  console.log("blob", fileBlob);
  const stringdata = await fileBlob?.text();
  const delimiterVal = delimiterMap[value.delimiter];
  const data = parse<string[]>(stringdata!, { delimiter: delimiterVal });
  const colVals = value.columns;
  const colIndsToCareAbout = colVals.reduce(
    (prev, curr, currInd) =>
      curr !== "x"
        ? [...prev, [currInd, curr] as [number, Exclude<TermName, "x">]]
        : prev,
    [] as [number, Exclude<TermName, "x">][]
  );
  const parsedTerms = data.data
    .filter(
      (row) =>
        !(
          (row[0] === undefined || row[0] === "") &&
          (row[1] === undefined || row[1] === "") &&
          (row[2] === undefined || row[2] === "") &&
          (row[3] === undefined || row[3] === "") &&
          (row[4] === undefined || row[4] === "")
        )
    )
    .map((row) => {
      type TaggableWord = Pick<Word, ItemsFromWord> & {
        taglist?: string[];
      };

      const mapColumn: {
        [key in Exclude<TermName, "x">]: (val: string) => any;
      } = {
        g: (val) => val.replace(" ", ",").split(","),
        r: (val) => val,
        s: (val) => val,
        t: (val) => val,
        w: (val) => val,
      };
      const term = Object.fromEntries(
        colIndsToCareAbout.map(
          ([ind, colKey]) =>
            [
              ColumnImportMode[colKey]["termParam"],
              mapColumn[colKey](row[ind]),
            ] as [
              (typeof ColumnImportMode)[RelevantTermName]["termParam"],
              TaggableWord[ColumnImportModeTermParam]
            ]
        )
      );
      return {
        ...term,
        WoLgID: value.WoLgID,
        WoStatus: value.WoStatus,
      };
    });
  return parsedTerms;
}
