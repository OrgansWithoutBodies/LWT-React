import { dataService } from '../data/data.service';
import { Settings } from '../data/settings';
import { pluralize } from '../pages/TermTag/pluralize';
import { Icon } from './Icon';
import { Pager } from './Pager';

export function TableFooter({
  recno,
  currentPage,
  numPages,
  pageSize,
  elementName,
  pageSizeSettingsKey,
}: {
  recno: number;
  currentPage: number;
  numPages: number;
  pageSize: number;
  elementName: string;
  pageSizeSettingsKey: keyof Settings;
}): JSX.Element {
  return (
    <table className="tab1" cellSpacing={0} cellPadding={5}>
      <tbody>
        <tr>
          <th style={{ whiteSpace: 'nowrap' }} className="th1">
            {recno} {elementName}
            {pluralize(recno)}
          </th>
          <th style={{ whiteSpace: 'nowrap' }} className="th1">
            &nbsp; &nbsp;
            <Icon src="placeholder" alt="-" />
            <Icon src="placeholder" alt="-" />
            <Pager currentPage={currentPage} numPages={numPages} />
          </th>
          <th style={{ whiteSpace: 'nowrap' }} className="th1">
            &nbsp; &nbsp;
            <Icon src="placeholder" alt="-" />
            <Icon src="placeholder" alt="-" />
            <ResizePage
              pageSize={pageSize}
              onPageResize={function (newSize: number): void {
                dataService.setSettings({ [pageSizeSettingsKey]: newSize });
              }}
            />
          </th>
        </tr>
      </tbody>
    </table>
  );
}

export function ResizePage({
  pageSize,
  onPageResize,
}: {
  pageSize: number;
  onPageResize: (newSize: number) => void;
}) {
  const numberOptions = 20;
  const options = new Array(numberOptions).fill(0).map((_, ii) => (ii + 1) * 5);
  return (
    <>
      # / Page:{' '}
      {options.includes(pageSize) ? (
        <select
          value={pageSize}
          onChange={({ target: { value } }) =>
            onPageResize(Number.parseInt(value))
          }
        >
          {options.map((val) => (
            <option value={val}>{val}</option>
          ))}
        </select>
      ) : (
        <input
          type="number"
          defaultValue={pageSize}
          onChange={({ target: { value } }) =>
            onPageResize(Number.parseInt(value))
          }
        />
      )}
    </>
  );
}
