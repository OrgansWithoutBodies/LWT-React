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
