import { IconNameMap } from './icons';

export function Icon({
  src: iconName,
  title,
  alt,
  className,
  onClick,
}: {
  src: typeof IconNameMap[number];
  title?: string;
  alt?: string;
  className?: string;
  onClick?: () => void;
}): JSX.Element {
  const iconURI = `icn/${iconName}.png`;
  return (
    <img
      src={iconURI}
      className={className}
      title={title}
      // automatically add alt text if title is specified but no alt
      alt={alt === undefined ? title : alt}
      onClick={onClick}
    />
  );
}
export function RequiredLineButton(): JSX.Element {
  return (
    <Icon
      src="status-busy"
      title="Field must not be empty"
      alt="Field must not be empty"
    />
  );
}
