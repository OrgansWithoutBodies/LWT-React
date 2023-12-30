import { UIString } from "lwt-i18n";
import { ImgHTMLAttributes } from "react";
import { useI18N } from "./I18N";
import { IconNameMap } from "./icons";
const NonTranslatedStrings = ["-", "+", "->", "<-"] as const;
export function Icon({
  src: iconName,
  title,
  alt,
  translateTitle = true,
  ...rest
}: {
  translateTitle?: boolean;
  src: (typeof IconNameMap)[number];
  title?: UIString | (typeof NonTranslatedStrings)[number];
  alt?: UIString;
} & ImgHTMLAttributes<HTMLImageElement>): JSX.Element {
  const iconURI = `icn/${iconName}.png`;
  const t = translateTitle
    ? useI18N()
    : (val: UIString) => {
        return val;
      };
  const titleString = title
    ? // TODO why cast necessary? types overlap
      NonTranslatedStrings.includes(title as any)
      ? title
      : t(title as UIString)
    : "";
  return (
    <img
      {...rest}
      src={iconURI}
      // automatically add alt text if title is specified but no alt
      alt={alt === undefined ? titleString : t(alt)}
      title={titleString}
    />
  );
}

// TODO 'satisfactory' state where it turns green

export function RequiredLineButton(): JSX.Element {
  return (
    <Icon
      src="status-busy"
      title="Field must not be empty"
      alt="Field must not be empty"
    />
  );
}
