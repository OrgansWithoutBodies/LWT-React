import { TRefMap } from "lwt-forms";

export function SelectBoolean<
  TSelKey extends string,
  TEntry extends Record<TSelKey, 0 | 1>
>({
  entry,
  entryKey,
  refMap,
}: {
  entry: TEntry;
  entryKey: TSelKey;
  refMap: TRefMap<TEntry>;
}) {
  const entryVal = entry[entryKey];
  return (
    <select ref={refMap[entryKey]} name={entryKey}>
      {/* TODO can i get away w/o setting selected here */}
      {/* TODO bring all yes/no dropdowns into using this */}
      <option value={0} selected={entryVal === 0}>
        No
      </option>
      <option value={1} selected={entryVal === 1}>
        Yes
      </option>
    </select>
  );
}
