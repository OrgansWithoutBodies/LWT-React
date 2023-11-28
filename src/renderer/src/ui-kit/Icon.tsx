import { ImgHTMLAttributes } from 'react';
import { IconNameMap } from '../icons';

export function Icon({
  src: iconName,
  title,
  alt,
  ...rest
}: {
  src: (typeof IconNameMap)[number];
  title?: string;
  alt?: string;
} & ImgHTMLAttributes<HTMLImageElement>): JSX.Element {
  const iconURI = `icn/${iconName}.png`;
  return (
    <img
      {...rest}
      src={iconURI}
      // automatically add alt text if title is specified but no alt
      alt={alt === undefined ? title : alt}
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
