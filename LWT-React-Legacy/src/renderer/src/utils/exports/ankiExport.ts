// TODO
import {
  downloadTextFile,
  makeCurrentDateTimeString,
  replaceTabsWithNewLine,
} from 'lwt-common';
import { Language, Word } from 'lwt-schemas';

// 	   ifnull(group_concat(distinct TgText order by TgText separator \' \'),\'\') as taglist
export type TermExportRow = Pick<
  Word & Language,
  | 'WoID'
  | 'LgRightToLeft'
  | 'LgRegexpWordCharacters'
  | 'LgName'
  | 'WoText'
  | 'WoStatus'
  | 'WoTranslation'
  | 'WoRomanization'
  | 'WoSentence'
> & { taglist: string[] };

const wrapRTL = (val: string, rtl: TermExportRow['LgRightToLeft']) => {
  return `${rtl ? '<span dir="rtl">' : ''}${val}${rtl ? '</span>' : ''}`;
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
}: TermExportRow) {
  const wrap = (val: string) => wrapRTL(val, LgRightToLeft);
  return `${wrap(replaceTabsWithNewLine(WoText))}\t${replaceTabsWithNewLine(
    WoTranslation
  )}\t${replaceTabsWithNewLine(WoRomanization)}\t${wrap(sent1)}\t${wrap(
    sent2
  )}\t${replaceTabsWithNewLine(LgName)}\t${WoID}\t${taglist}\r\n`;
}
export function anki_export(exportRows: TermExportRow[]) {
  const parsedTerms = exportRows.map((record) => {
    const { LgRightToLeft, LgRegexpWordCharacters } = record;
    const lpar = LgRightToLeft ? ']' : '[';
    const rpar = LgRightToLeft ? '[' : ']';
    const sent = replaceTabsWithNewLine(record['WoSentence']);
    // LgRegexpWordCharacters.replace
    // $sent1 = str_replace(
    // 	"{",
    // 	'<span style="font-weight:600; color:#0000ff;">' . $lpar,
    // 	str_replace(
    // 		"}",
    // 		$rpar . '</span>',
    // 		mask_term_in_sentence($sent, $record["LgRegexpWordCharacters"])
    // 	)
    // );
    // $sent2 = str_replace("{", '<span style="font-weight:600; color:#0000ff;">', str_replace("}", '</span>', $sent));
    const sent1 = ''.replace(
      '{',
      `<span style="font-weight:600; color:#0000ff;">${lpar}`
    );
    return fillAnkiTemplateForCard({ ...record, sent1, sent2 });
  });
  // TODO
  // header('Content-type: text/plain; charset=utf-8');
  // header("Content-disposition: attachment)
  downloadTextFile(
    parsedTerms.join(''),
    `lwt_anki_export_${makeCurrentDateTimeString()}.txt"`
  );
}

// function mask_term_in_sentence(s: any, regexword: any)
// {
// 	l = mb_strlen(s, 'utf-8');
// 	r = '';
// 	on = 0;
// 	for (i = 0; i < l; i++) {
// 		c = mb_substr(s, i, 1, 'UTF-8');
// 		if (c === '}')
// 			on = 0;
// 		if (on) {
// 			if (preg_match('/[' . regexword . ']/u', c)) {
// 				// r .= '•';
// 			} else {
// 				// r .= c;
// 			}
// 		} else {
// 			// r .= c;
// 		}
// 		if (c === '{')
// 			on = 1;
// 	}
// 	return r;
// }

// function mask_term_in_sentence_v2(s)
// {
// 	l = mb_strlen(s, 'utf-8');
// 	r = '';
// 	on = 0;
// 	for (i = 0; i < l; i++) {
// 		c = mb_substr(s, i, 1, 'UTF-8');
// 		if (c === '}') {
// 			on = 0;
// 			continue;
// 		}
// 		if (c === '{') {
// 			on = 1;
// 			r += '[...]';
// 			continue;
// 		}
// 		if (on === 0) {
// 			r += c;
// 		}
// 	}
// 	return r;
// }
