export function InfoLine({ href, title }: { href: string; title: string }) {
  return (
    <dt>
      ▶
      <b>
        {' '}
        <a id={href}>{title}</a>{' '}
      </b>
      - <a href={'#'}>[↑]</a>{' '}
    </dt>
  );
}
