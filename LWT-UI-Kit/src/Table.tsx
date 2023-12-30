import { SettingsObject } from "lwt-schemas";
import { TableFooter, usePager, useSelection } from ".";

export type PageProps = { currentPage: number; pageSize: number };

export function SelectableTable<
  TDatumKey extends string,
  TBrand extends number,
  TDatum extends { [key in TDatumKey]: TBrand }
>({
  data,
  RowTemplate,
  headerVals,
  currentPage,
  pageSize,
  key,
  footerElementName,
  footerSizeSettingsKey,
}: {
  data: TDatum[];
  RowTemplate: (
    val: TDatum & { selected: boolean; toggleRow: (id: string) => void }
  ) => JSX.Element;
  //   HeaderTemplate: (vals: TKeys) => JSX.Element;
  headerVals: (string | JSX.Element)[];
  key: TDatumKey;
  footerElementName: string;
  footerSizeSettingsKey: keyof SettingsObject;
} & PageProps) {
  const {
    // TODO
    // onSelectAll,
    //  onSelectNone,
    selectedValues,
    // onSelect,
  } = useSelection(data, key);
  const { dataOnPage, numPages } = usePager(data, currentPage, pageSize);
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>
              {/* <Checkbox
                onChange={toggleAll}
                checked={selection.length === data.length}
                indeterminate={
                  selection.length > 0 && selection.length !== data.length
                }
              /> */}
            </th>
            {headerVals.map((val) => {
              return <th>{val}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {dataOnPage.map((item) => {
            const selected = selectedValues.has(item[key]);
            return (
              <RowTemplate
                {...item}
                selected={selected}
                toggleRow={() => {
                  // onSelect()
                  alert("TODO");
                }}
              />
            );
          })}
        </tbody>
      </table>
      <TableFooter
        recno={data.length}
        currentPage={currentPage}
        numPages={numPages}
        pageSize={pageSize}
        elementName={footerElementName}
        pageSizeSettingsKey={footerSizeSettingsKey}
      />
    </>
  );
}
