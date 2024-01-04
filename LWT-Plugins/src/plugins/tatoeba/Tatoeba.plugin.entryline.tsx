import { EntryRowComponent } from "../../Plugin";

export function TatoebaEntryLine({
  Component,
}: Parameters<EntryRowComponent>[0]) {
  console.log("TEST123-ENTRY-LINE", Component);
  return (
    <>
      <Component entryKey={"LgTatoebaSourceKey"} />
    </>
  );
}
