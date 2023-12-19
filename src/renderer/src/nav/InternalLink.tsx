import { useI18N } from '../../../i18n/I18N';
import { InternalPaths, useInternalNavigate } from '../hooks/useInternalNav';
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
  // TODO add dirty check here
  const nav = useInternalNavigate();
  const t = useI18N();
  const onClick = href === undefined ? undefined : () => nav(href);
  return (
    <a {...rest} className="a" onClick={onClick}>
      {t(children)}
    </a>
  );
}
