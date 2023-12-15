import { useUpdateParams } from '../hooks/useInternalNav';

export function SortableHeader({
  sorting,
  downSorting,
  upSorting,
  title,
  children,
}: React.PropsWithChildren<
  Parameters<typeof SortingArrow>[0] & { title?: string }
>) {
  const paramUpdater = useUpdateParams();
  return (
    <th
      title={title}
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
