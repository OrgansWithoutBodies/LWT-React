/**
 *
 * @param data
 * @param page
 * @param pageSize
 */
export function usePager<TDate>(
  data: TDate[],
  page: number,
  pageSize: number
  // ): { page: number; setPage: (num: number) => void; dataOnPage: TDate[] } {
): { numPages: number; dataOnPage: TDate[] } {
  //   const [page, setPage] = useState<number>(0);
  const dataOnPage = data.slice(pageSize * (page - 1), pageSize * page);
  const numPages = Math.ceil(data.length / pageSize);
  //   return { page, setPage, dataOnPage };
  return { dataOnPage, numPages };
}
