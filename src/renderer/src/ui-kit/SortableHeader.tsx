import { useI18N } from '../../../i18n/I18N';
import { UIString } from '../../../i18n/strings';
import { useUpdateParams } from '../hooks/useInternalNav';
/**
 * Two signatures here - if there's children then use those as the header text otherwise just translatable text
 */
export function SortableHeader({
  sorting,
  downSorting,
  upSorting,
  title,
  children,
}: React.PropsWithChildren<
  Parameters<typeof SortingArrow>[0] & { title?: UIString }
>) {
  const paramUpdater = useUpdateParams();
  const t = useI18N();
  return (
    <th
      title={title ? t(title) : undefined}
      className="th1 clickable"
      onClick={() =>
        paramUpdater({
          sort:
            sorting === upSorting
              ? downSorting.toString()
              : upSorting.toString(),
          page: null,
        })
      }
    >
      {children}
      <SortingArrow
        sorting={sorting}
        downSorting={downSorting}
        upSorting={upSorting}
      />
    </th>
  );
}
export function SortingArrow<TSort extends number>({
  sorting,
  downSorting,
  upSorting,
}: {
  sorting: TSort;
  downSorting: TSort;
  upSorting: TSort;
}) {
  return (
    <>
      {sorting === downSorting ? (
        <>&nbsp;{DOWN_ARROW}</>
      ) : sorting === upSorting ? (
        <>&nbsp;{UP_ARROW}</>
      ) : (
        <></>
      )}
    </>
  );
}
const DOWN_ARROW = '▾' as const;
const UP_ARROW = '▴' as const;
