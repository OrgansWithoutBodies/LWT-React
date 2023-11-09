import { useNavigate } from 'react-router-dom';
import { headerValues } from '../pages/Header';
type InternalPathsFromHeader = typeof headerValues[keyof typeof headerValues];

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
