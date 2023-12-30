export const BASENAME = "/lwt";
/**
 *
 * @param url
 */

/**
 *
 * @param url
 */
export function openInNewWindow(url: string | URL | undefined) {
  // TODO
  window.open(
    BASENAME + url,
    "editwin",
    "width=800, height=600, scrollbars=yes, menubar=no, resizable=yes, status=no"
  );
} // TODO if no ###
/**
 *
 * @param templateStr
 * @param word
 */

export function replaceTemplate(templateStr: string, word: string): string {
  console.log("TEST123-replaceTemplate", templateStr, word);
  // TODO template vs url branded type
  const startsWithStar = templateStr.startsWith("*");
  return (startsWithStar ? templateStr.slice(1) : templateStr).replace(
    "###",
    word
  );
}
