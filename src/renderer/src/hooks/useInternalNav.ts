import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { headerValues, headerValuesTemp } from '../ui-kit/Header';

type InternalPathsFromHeader = (typeof headerValues)[keyof typeof headerValues];

type NonHeaderLinks =
  | ''
  | 'insert_word_wellknown'
  | 'info_export_template'
  | 'insert_word_ignore'
  | 'edit_word'
  | 'table_set_management'
  | 'do_test'
  | 'edit_mword'
  | 'new_word'
  | 'install_demo'
  | 'print_text'
  | 'print_impr_text'
  | 'do_text';

type BasePath = InternalPathsFromHeader | NonHeaderLinks | '/';
export type InternalPaths = `/${BasePath}${`?${string}` | ''}${
  | `#${string}`
  | ''}`;
// const urlIsInternalPathGuard = (url: string): url is InternalPaths => {
//   return Object.values(headerValues).includes(url as any);
// };
export const useInternalNavigate: () => (
  url: InternalPaths,
  addToCurrentURL?: boolean
) => void = () => {
  const nav = useNavigate();
  const location = useLocation();
  return (url, addToCurrentURL = false) => {
    // if (urlIsInternalPathGuard(url)) {
    if (addToCurrentURL) {
      return nav(location.pathname + url);
    }
    return nav(url);

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
  return (params: { [path in PathParams]?: string | null } | null) => {
    if (params === null) {
      setSearchParams({});
      return;
    }
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
