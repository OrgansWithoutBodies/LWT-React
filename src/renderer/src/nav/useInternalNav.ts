import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { headerValues, headerValuesTemp } from '../pages/Header';
type InternalPathsFromHeader = (typeof headerValues)[keyof typeof headerValues];

type NonHeaderLinks =
  | ''
  | 'insert_word_wellknown'
  | 'insert_word_ignore'
  | 'edit_word'
  | 'table_set_management'
  | 'do_test'
  | 'edit_mword'
  | 'new_word'
  | 'print_text'
  | 'do_text';

type BasePath = InternalPathsFromHeader | NonHeaderLinks | '/';
export type InternalPaths = `/${BasePath}${`?${string}` | ''}`;
// const urlIsInternalPathGuard = (url: string): url is InternalPaths => {
//   return Object.values(headerValues).includes(url as any);
// };
export const useInternalNavigate: () => (url: InternalPaths) => void = () => {
  const nav = useNavigate();
  return (url) => {
    // if (urlIsInternalPathGuard(url)) {
    nav(url);
    return;
    // }
    // return;
  };
};

export type PathParams =
  (typeof headerValuesTemp)[keyof typeof headerValuesTemp]['params'][number];
export const useUpdateParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const currentParams: { [path in PathParams]?: string } = Object.fromEntries(
    headerValuesTemp[
      `${location.pathname.slice(1) as InternalPathsFromHeader}`
    ].params
      .map((param) => [param, searchParams.get(param)])
      .filter(([, val]) => val !== null)
  );
  return (params: { [path in PathParams]?: string | null }) => {
    const filteredParams: { [path in PathParams]?: string } =
      Object.fromEntries(
        Object.entries({ ...currentParams, ...params }).filter(
          ([, val]) => val !== null
        )
      );
    setSearchParams(filteredParams);
  };
  // searchParams.get()
};
