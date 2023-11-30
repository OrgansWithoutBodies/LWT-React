import { InternalPaths, useInternalNavigate } from './useInternalNav';
// const urlIsInternalPathGuard = (url: string): url is InternalPaths => {
//   return Object.values(headerValues).includes(url as any);
// };
export function A({
  children,
  href,
  ...rest
}: React.PropsWithChildren<
  Omit<JSX.IntrinsicElements['a'], 'href'> & { href?: InternalPaths }
>) {
  const nav = useInternalNavigate();
  const onClick =
    href === undefined
      ? undefined
      : () => nav(href);
  return (
    <a {...rest} className="a" onClick={onClick}>
      {children}
    </a>
  );
}
