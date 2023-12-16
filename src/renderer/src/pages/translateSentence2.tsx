import { DictURITemplateType } from '../data/validators';
import { createTheDictUrl } from './ReaderPage.component';

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
