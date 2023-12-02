/**
 *
 * @param url
 */

export function openInNewWindow(url: string | URL | undefined) {
  // TODO
  window.open(
    url,
    'editwin',
    'width=800, height=600, scrollbars=yes, menubar=no, resizable=yes, status=no'
  );
}
