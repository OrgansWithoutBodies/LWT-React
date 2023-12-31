import { A, useAnimation } from 'lwt-ui-kit';
import { useEffect, useRef, useState } from 'react';

// TODO maybe this should be passed via children to be more generic?
// {/* TODO - maybe use floating-ui for this? */}

export function FloatingMenu({
  menuOptions,
  positioning = { right: 5, top: 5 },
}: {
  menuOptions: { href: string; title: string }[];
  positioning?: { right: number; top: number };
}) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuPixSourcePos, setMenuPixSourcePos] = useState<number>(0);
  const [menuPixTargetPos, setMenuPixTargetPos] = useState<number>(0);
  useEffect(() => {
    const onScroll = () => {
      // source is current position ie last it was set to
      const bodyRect = document.body.getBoundingClientRect();
      const elemRect = menuRef.current!.getBoundingClientRect();
      const offset = elemRect.top - bodyRect.top;

      setMenuPixSourcePos(offset);
      setMenuPixTargetPos(window.scrollY);
    };
    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
  const duration = 2000;
  const interpolate = useAnimation({
    duration,
    retrigger: menuPixTargetPos,
    easingName: 'elastic',
  });
  const menuPixPosInterpolated =
    menuPixSourcePos + (menuPixTargetPos - menuPixSourcePos) * interpolate;
  console.log('TEST123-POS', {
    menuPixSourcePos,
    menuPixTargetPos,
  });
  return (
    <div
      ref={menuRef}
      id="floatdiv"
      style={{
        position: 'absolute',
        width: 'auto',
        height: 'auto',
        top: `${menuPixPosInterpolated + positioning.top}px`,
        padding: '5px',
        background: 'rgb(221, 221, 221)',
        border: '1px solid rgb(136, 136, 136)',
        zIndex: 100,
        fontSize: '10pt',
        right: `${positioning.right}px`,
        textAlign: 'center',
      }}
    >
      {' '}
      <a href="#">↑ TOP ↑</a> <br />
      {menuOptions.map((option) => (
        <span key={option.title}>
          <br />
          {/* TODO no any */}
          <A href={`#${option.href}` as any}>{option.title}</A>
        </span>
      ))}
    </div>
  );
}
