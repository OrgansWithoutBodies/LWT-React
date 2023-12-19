import { ImgHTMLAttributes } from 'react';
import { useI18N } from '../../../i18n/I18N';
import { UIString } from '../../../i18n/strings';
import { IconNameMap } from '../icons';

export function Icon({
  src: iconName,
  title,
  alt,
  ...rest
}: {
  src: (typeof IconNameMap)[number];
  title?: UIString;
  alt?: UIString;
} & ImgHTMLAttributes<HTMLImageElement>): JSX.Element {
  const iconURI = `icn/${iconName}.png`;
  const t = useI18N();
  return (
    <img
      {...rest}
      src={iconURI}
      // automatically add alt text if title is specified but no alt
      alt={alt === undefined ? (title ? t(title) : '') : t(alt)}
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
