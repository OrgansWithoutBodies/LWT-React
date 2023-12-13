import { ImgHTMLAttributes } from 'react';

/**
 *
 * @param args
 */
export function Loader(
  args: Omit<
    React.DetailedHTMLProps<
      ImgHTMLAttributes<HTMLImageElement>,
      HTMLImageElement
    >,
    'src'
  >
) {
  return (
    <>
      <img {...args} src="icn/waiting.gif" />
    </>
  );
}
