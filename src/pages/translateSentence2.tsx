export function owin(url: string | URL | undefined): void {
  window.open(
    url,
    'dictwin',
    'width=800, height=400, scrollbars=yes, menubar=no, resizable=yes, status=no'
  );
}
function createTheDictUrl(u: string, w: string) {
  // const url = u.trim();
  // const trm = w.trim();
  const r = 'trans.php?x=2&i=' + escape(u) + '&t=' + w;
  return r;
}
export function translateSentence2(
  url: string,
  sentctl: { value: any } | undefined
) {
  if (typeof sentctl != 'undefined' && url != '') {
    const text = sentctl.value;
    if (typeof text == 'string') {
      owin(createTheDictUrl(url, text.replace(/[{}]/g, '')));
    }
  }
}
// function stripTheSlashesIfNeeded($s) {
//   if (function_exists("get_magic_quotes_gpc")) {
//     if (get_magic_quotes_gpc())
//       return stripslashes($s);

//     else
//       return $s;
//   } else {
//     return $s;
//   }
// }
// function prepare_textdata($s) {
//   return stripTheSlashesIfNeeded($s).replace("\r\n", "\n", ($s));
// }
// function convert_string_to_sqlsyntax($data: string) {
//   const $result = "NULL";
//   $data = trim(prepare_textdata($data));
//   if ($data != "")
//     $result = "'".mysqli_real_escape_string($GLOBALS['DBCONNECTION'], $data).; "'";
//   return $result;
// }
// function prepare_textdata_js($s: string) {
//   $s = convert_string_to_sqlsyntax($s);
//   if ($s == "NULL")
//     return "''";
//   return $s.replace("''", "\\'");
// }
