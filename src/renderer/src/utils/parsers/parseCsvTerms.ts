import { parse } from 'papaparse';
import { UploadTermsValidator } from '../../data/UploadTermsValidator';
import {
  ColumnImportMode,
  ColumnImportModeTermParam,
  ItemsFromWord,
  RelevantTermName,
  TermName,
} from '../../pages/columnImportMode';
import { Word } from '../parseMySqlDump';

const ColumnType = [
  'Term',
  'Translation',
  'Romanization',
  'Sentence',
  'Tag List',
  "Don't import",
] as const;
const ColumnID = ['C1', 'C2', 'C3', 'C4', 'C5'] as const;
const overwriteTermsStr = 'Overwrite existent terms: ';
export const delimiterMap = { c: ',', t: '\t', h: '#' };

type ColumnAssignment = {
  [columnNumber in (typeof ColumnID)[number]]: (typeof ColumnType)[number];
};
/**
 *
 * @param filePath
 */
export function parseCsvTerms(filePath: string) {
  return {};
}
export type TermParsedFromCSV = Word & {
  taglist: string[];
};

/**
 *
 * @param refMap
 */
export async function parseTermsFromCSV<
  TData extends ReturnType<typeof UploadTermsValidator>['TYPE'] = ReturnType<
    typeof UploadTermsValidator
  >['TYPE']
>(value: TData): TermParsedFromCSV[] {
  const fileBlob = value.file.file;
  console.log('blob', fileBlob);
  const stringdata = await fileBlob?.text();
  const delimiterVal = delimiterMap[value.delimiter];
  const data = parse<string[]>(stringdata!, { delimiter: delimiterVal });
  const colVals = value.columns;
  const colIndsToCareAbout = colVals.reduce(
    (prev, curr, currInd) =>
      curr !== 'x'
        ? [...prev, [currInd, curr] as [number, Exclude<TermName, 'x'>]]
        : prev,
    [] as [number, Exclude<TermName, 'x'>][]
  );
  const parsedTerms = data.data
    .filter(
      (row) =>
        !(
          (row[0] === undefined || row[0] === '') &&
          (row[1] === undefined || row[1] === '') &&
          (row[2] === undefined || row[2] === '') &&
          (row[3] === undefined || row[3] === '') &&
          (row[4] === undefined || row[4] === '')
        )
    )
    .map((row) => {
      type TaggableWord = Pick<Word, ItemsFromWord> & {
        // TODO do something with this
        TagList?: string[];
      };

      const mapColumn: {
        [key in Exclude<TermName, 'x'>]: (val: string) => any;
      } = {
        g: (val) => val.replace(' ', ',').split(','),
        r: (val) => val,
        s: (val) => val,
        t: (val) => val,
        w: (val) => val,
      };
      const term = Object.fromEntries(
        colIndsToCareAbout.map(
          ([ind, colKey]) =>
            [
              ColumnImportMode[colKey]['termParam'],
              mapColumn[colKey](row[ind]),
            ] as [
              (typeof ColumnImportMode)[RelevantTermName]['termParam'],
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
