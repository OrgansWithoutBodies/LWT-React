import { UIString } from "lwt-i18n";
import { useI18N } from "../I18N";
import { InternalPaths, useInternalNavigate } from "../hooks/useInternalNav";
// const urlIsInternalPathGuard = (url: string): url is InternalPaths => {
//   return Object.values(headerValues).includes(url as any);
// };

export function A({
  children,
  href,
  ...rest
}: Omit<JSX.IntrinsicElements["a"], "href"> & {
  href?: InternalPaths;
  children: Exclude<React.ReactNode, string> | UIString;
}) {
  // TODO add dirty check here
  const nav = useInternalNavigate();
  const t = useI18N();
  const onClick = href === undefined ? undefined : () => nav(href);
  const childIsString = newFunction(children);
  return (
    <a {...rest} className="a" onClick={onClick}>
      {childIsString ? t(children) : children}
    </a>
  );
}
function newFunction(
  children: Exclude<React.ReactNode, string> | UIString
): children is UIString {
  return typeof children === "string";
}
