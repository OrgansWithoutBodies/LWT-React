import axios from 'axios';
import { parse } from 'papaparse';

/**
 *
 */
export async function getGoogleSheets({
  spreadsheetID,
  sheetID,
}: {
  spreadsheetID: string;
  sheetID: string;
}) {
  const txt = await axios
    .get(
      `https://docs.google.com/spreadsheets/d/${spreadsheetID}/gviz/tq?tqx=out:csv&tq&gid=${sheetID}`
    )
    .then((val) => val.data);
  console.log('TEST123-google', {
    parse: parse(txt),
  });
  return txt;
}
