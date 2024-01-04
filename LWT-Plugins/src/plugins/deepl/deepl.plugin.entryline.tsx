import { EntryRowComponent } from "lwt-plugins";
export function DeepLSettingEntryLine({
  Component,
}: Parameters<EntryRowComponent>[0]) {
  return (
    <>
      <Component entryKey={"plugin-deepl:auth-key"} />
    </>
  );
}
export function DeepLLanguageEntryLine({
  Component,
}: Parameters<EntryRowComponent>[0]) {
  return (
    <>
      <Component entryKey={"LgDeeplKey"} />
    </>
  );
}
