import { UIString } from "lwt-i18n";
import { ImgHTMLAttributes } from "react";
import { useI18N } from "./I18N";
import { IconNameMap } from "./icons";
const NonTranslatedStrings = ["-", "+", "->", "<-"] as const;
export function Icon({
  src: iconName,
  title,
  alt,
  dontTranslate = false,
  ...rest
}: (
  | {
      dontTranslate?: boolean;
      src: (typeof IconNameMap)[number];
      title?: UIString | (typeof NonTranslatedStrings)[number];
      alt?: UIString;
    }
  | {
      dontTranslate: true;
      src: (typeof IconNameMap)[number];
      title?: string;
      alt?: string;
    }
) &
  ImgHTMLAttributes<HTMLImageElement>): JSX.Element {
  const iconURI = `icn/${iconName}.png`;
  const t = dontTranslate
    ? (val: string) => {
        return val;
      }
    : useI18N();
  const titleString = title
    ? // TODO why cast necessary? types overlap
      NonTranslatedStrings.includes(title as any)
      ? title
      : t(title as UIString)
    : "";
  const altString = alt
    ? // TODO why cast necessary? types overlap
      NonTranslatedStrings.includes(alt as any)
      ? alt
      : t(alt as UIString)
    : "";
  return (
    <img
      {...rest}
      src={iconURI}
      // automatically add alt text if title is specified but no alt
      alt={alt === undefined ? titleString : altString}
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
