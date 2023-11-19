export function usePager<TDate>(
  data: TDate[],
  pageSize: number,
  page: number
  // ): { page: number; setPage: (num: number) => void; dataOnPage: TDate[] } {
): { dataOnPage: TDate[] } {
  //   const [page, setPage] = useState<number>(0);

  const dataOnPage = data.slice(pageSize * page, pageSize * (page + 1));
  //   return { page, setPage, dataOnPage };
  return { dataOnPage };
}
