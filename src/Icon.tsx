import React from 'react';
import { IconNameMap } from './icons';

export function Icon({
  iconName,
  title,
  alt,
  className,
  onClick,
}: {
  iconName: typeof IconNameMap[number];
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
      alt={alt}
      onClick={onClick}
    />
  );
}
export function RequiredLineButton(): JSX.Element {
  return (
    <Icon
      iconName="status-busy"
      title="Field must not be empty"
      alt="Field must not be empty"
    />
  );
}
