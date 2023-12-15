import { useUpdateParams } from '../../hooks/useInternalNav';
import { Pager } from '../../ui-kit/Pager';
import { pluralize } from '../TermTag/pluralize';

// TODO better name

export function FilterSortPager({
  children,
  elementName,
  recno,
  ...pageProps
}: React.PropsWithChildren<Parameters<typeof Pager>[0]> & {
  recno: number;
  elementName: string;
}) {
  const paramUpdater = useUpdateParams();
  return (
    <tr>
      <th className="th1" style={{ whiteSpace: 'nowrap' }}>
        {recno} {elementName}
        {pluralize(recno)}
      </th>
      <th className="th1" colSpan={2} style={{ whiteSpace: 'nowrap' }}>
        <Pager {...pageProps} />
      </th>
      <th className="th1" style={{ whiteSpace: 'nowrap' }}>
        Sort Order:
        <select
          name="sort"
          onChange={({ target: { value } }) => {
            paramUpdater({ sort: value });
          }}
        >
          {children}
        </select>
      </th>
    </tr>
  );
}
