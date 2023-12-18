import { downloadTextFile } from '../downloadTxtFile';
import { makeCurrentDateTimeString } from '../time';
import { TermExportRow, replaceTabsWithNewLine } from './ankiExport';

/**
 *
 * @param termsToExport
 */
export function tsv_export(termsToExport: TermExportRow[]) {
  const exportString = termsToExport
    .map(
      ({
        WoText,
        WoTranslation,
        WoSentence,
        WoRomanization,
        WoStatus,
        LgName,
        WoID,
        taglist,
      }) =>
        `${replaceTabsWithNewLine(WoText)}\t${replaceTabsWithNewLine(
          WoTranslation
        )}\t${replaceTabsWithNewLine(WoSentence)}\t${replaceTabsWithNewLine(
          WoRomanization
        )}\t${WoStatus}\t${replaceTabsWithNewLine(
          LgName
        )}\t${WoID}\t${taglist}\r\n`
    )
    .join('');
  // TODO
  // header('Content-type: text/plain; charset=utf-8');
  // Content-disposition: attachment
  downloadTextFile(
    exportString,
    `lwt_tsv_export_${makeCurrentDateTimeString()}.txt"`
  );
}
