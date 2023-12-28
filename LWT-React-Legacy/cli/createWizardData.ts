import axios from 'axios';
import * as fs from 'fs';

import { ParseResult, parse, unparse } from 'papaparse';
import * as ss from 'superstruct';

const overwriteURI = 'data/wizard/wizardData.overwrite.csv' as const;
const defaultURI = 'data/wizard/wizardData.default.csv' as const;

/**
 *
 */
export async function getGoogleSheets<TCSV>({
  //   spreadsheetID,
  //   sheetID,
  url,
}: {
  url: string;
  //   spreadsheetID: string;
  //   sheetID: string;
}) {
  const txt = await axios
    .get(
      url
      //   `https://docs.google.com/spreadsheets/d/${spreadsheetID}/gviz/tq?tqx=out:csv&tq&gid=${sheetID}`
    )
    .then((val) => val.data);
  return parse<TCSV>(txt);
}
// TODO
export async function loadCSV<TCSV>({
  filePath,
  delimiter = ',',
}: {
  filePath: string;
  delimiter?: string;
}) {
  const data = parse<TCSV>(filePath, { delimiter });
  return data;
}

export const LangDefValidator = ss.object({
  LgGTransKey: ss.string(),
  LgGlosbeKey: ss.string(),
  LgTextSize: ss.number(),
  LgRegexpWordCharacters: ss.regexp(),
  LgRegexpSplitSentences: ss.regexp(),
  LgSplitEachChar: ss.boolean(),
  LgRemoveSpaces: ss.boolean(),
  LgRightToLeft: ss.boolean(),
});
type LangDef = typeof LangDefValidator.TYPE;
export async function parseWizardData(dataURI: string) {
  let data: ParseResult<LangDef> | null = null;
  if (
    new RegExp('https://docs.google.com/spreadsheets/d/.*/gviz/tq').test(
      dataURI
    )
  ) {
    data = await getGoogleSheets<LangDef>({ url: dataURI });
    // TODO
  } else if (true) {
    data = await loadCSV<LangDef>({ filePath: dataURI });
  }
  if (data === null) {
    throw new Error('Parsing Error!');
  }
  const file = new Blob([unparse(data.data)], {
    type: 'text/csv;charset=utf-8;',
  });

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFile('data/wizard/wizardData.overwrite.csv', buffer, () =>
    console.log('file saved!')
  );
}
if (process.argv.length < 3) {
  throw new Error('Wizard Must Be Supplied Data! <|:^(');
}
export async function parseWizardCSV() {
  let data = null;
  console.log(overwriteURI);
  if (fs.existsSync(overwriteURI)) {
    const fileData = fs.readFileSync(overwriteURI);
    // we expect to be able to handle the file all at once, no streaming
    data = parse(fileData.toString());
  } else {
    const fileData = fs.readFileSync(defaultURI);
    data = parse(fileData.toString());
  }
  if (data === null) {
    throw new Error('Parse Error! Does a default or overwrite file exist?');
  }
  console.log(data);
  const lookupIndexByKey: Record<keyof LangDef | 'LgName', number> =
    Object.fromEntries(data.data[0].map((val, ii) => [val, ii])) as any;
  const dataObj: Record<string, LangDef> = Object.fromEntries(
    data.data.slice(1).map((row) => [
      row[lookupIndexByKey['LgName']],
      {
        LgGTransKey: row[lookupIndexByKey['LgGTransKey']],
        LgGlosbeKey: row[lookupIndexByKey['LgGlosbeKey']],
        LgTextSize: Number.parseInt(row[lookupIndexByKey['LgTextSize']]),
        LgRegexpWordCharacters: row[lookupIndexByKey['LgRegexpWordCharacters']],
        LgRegexpSplitSentences: row[lookupIndexByKey['LgRegexpSplitSentences']],
        LgSplitEachChar:
          row[lookupIndexByKey['LgSplitEachChar']] === 'FALSE' ? false : true,
        LgRemoveSpaces:
          row[lookupIndexByKey['LgRemoveSpaces']] === 'FALSE' ? false : true,
        LgRightToLeft:
          row[lookupIndexByKey['LgRightToLeft']] === 'FALSE' ? false : true,
      },
    ])
  );

  fs.writeFileSync(
    'data/wizard/wizard.data.ts',
    `export const WizardData = ${JSON.stringify(dataObj)} as const;
    
export const AvailableLangs=${JSON.stringify(Object.keys(dataObj))} as const;

export type LangKey = (typeof AvailableLangs)[number]`
  );
}
async function wizard() {
  await parseWizardData(process.argv[2]);

  await parseWizardCSV();
}
wizard();
