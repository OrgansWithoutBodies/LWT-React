// TODO
// import { Language, Word } from '../data/parseMySqlDump';

// // 	   ifnull(group_concat(distinct TgText order by TgText separator \' \'),\'\') as taglist
// type ExportRow = Pick<
//   Word & Language,
//   | 'WoID'
//   | 'LgRightToLeft'
//   | 'LgRegexpWordCharacters'
//   | 'LgName'
//   | 'WoText'
//   | 'WoTranslation'
//   | 'WoRomanization'
//   | 'WoSentence'
// >;
// export function anki_export(exportRows: ExportRow[]) {
//   let x = '';
//   const parsedTerms = exportRows.map((record) => {
//     const { LgRightToLeft,LgRegexpWordCharacters } = record;
//     const span1 = LgRightToLeft ? '<span dir="rtl">' : '';
//     const span2 = LgRightToLeft ? '</span>' : '';
//     const lpar = LgRightToLeft ? ']' : '[';
//     const rpar = LgRightToLeft ? '[' : ']';
//     const sent = (replaceTabsWithNewLine(record['WoSentence']));
// 	// LgRegexpWordCharacters.replace
//     const sent1 =	 ''.replace(
// 		"{",`<span style="font-weight:600; color:#0000ff;">${lpar}`)
// 	//   );
//       // "{",
//       // '<span style="font-weight:600; color:#0000ff;">'
//       //  . lpar,
//       // str_replace(
//       // "}",
//       // rpar
//       //  . '</span>',
//       // mask_term_in_sentence(sent, record["LgRegexpWordCharacters"])
//       // )
//     // sent2 = str_replace("{", '<span style="font-weight:600; color:#0000ff;">', str_replace("}", '</span>', sent));
//     // x .= span1 . tohtml(replaceTabsWithNewLine(record["WoText"])) . span2 . "\t" .
//     // tohtml(replaceTabsWithNewLine(record["WoTranslation"])) . "\t" .
//     // tohtml(replaceTabsWithNewLine(record["WoRomanization"])) . "\t" .
//     // span1 . sent1 . span2 . "\t" .
//     // span1 . sent2 . span2 . "\t" .
//     // tohtml(replaceTabsWithNewLine(record["LgName"])) . "\t" .
//     // tohtml(record["WoID"]) . "\t" .
//     // tohtml(record["taglist"]) .
//     // "\r\n";
//   });
//   // header('Content-type: text/plain; charset=utf-8');
//   // header("Content-disposition: attachment; filename=lwt_anki_export_" . date('Y-m-d-H-i-s') . ".txt");
// }

// function mask_term_in_sentence($s: any, $regexword: any)
// {
// 	$l = mb_strlen($s, 'utf-8');
// 	$r = '';
// 	$on = 0;
// 	for ($i = 0; $i < $l; $i++) {
// 		$c = mb_substr($s, $i, 1, 'UTF-8');
// 		if ($c == '}')
// 			$on = 0;
// 		if ($on) {
// 			if (preg_match('/[' . $regexword . ']/u', $c)) {
// 				// $r .= '•';
// 			} else {
// 				// $r .= $c;
// 			}
// 		} else {
// 			// $r .= $c;
// 		}
// 		if ($c == '{')
// 			$on = 1;
// 	}
// 	return $r;
// }

// export function replaceTabsWithNewLine($s: string | undefined)
// {
// 	$s =  $s.replace(["\r\n", "\r", "\n", "\t"], ' ',);
// 	$s = $s.replace('/\s/u', ' ',);
// 	$s = $s.replace('/\s{2,}/u', ' ');
// 	return $s.trim()
// }
