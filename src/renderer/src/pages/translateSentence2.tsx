import { DictURITemplateType } from '../data/validators';

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
 * @param u
 * @param w
 */
export function createTheDictUrl(u: string, w: string) {
  // const url = u.trim();
  // const trm = w.trim();
  const r = `trans?x=2&i=${escape(u)}&t=${w}`;
  return r;
}
/**
 *
 * @param url
 * @param sentctl
 */
export function translateSentence2(
  url: DictURITemplateType,
  sentctl: { value: string } | undefined
) {
  if (sentctl !== undefined && url !== '') {
    const text = sentctl.value;
    if (typeof text === 'string') {
      owin(createTheDictUrl(url, text.replace(/[{}]/g, '')));
    }
  }
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
