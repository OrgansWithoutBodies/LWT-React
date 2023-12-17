// TODO this is sorta a mismash

/**
 *
 * @param url
 */
export function owin(url: string | URL | undefined): void {
  window.open(
    url,
    'dictwin',
    'width=800, height=400, scrollbars=yes, menubar=no, resizable=yes, status=no'
  );
}

/**
 *
 * @param s
 */
export function prepare_textdata(s: string) {
  return s.replace('\r\n', '\n');
}
/**
 *
 * @param s
 */
export function prepare_textdata_js(s: string) {
  const val = s;
  if (val === null) {
    return "''";
  }
  return val.replace("''", "\\'");
}
