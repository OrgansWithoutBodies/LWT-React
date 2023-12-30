import { useData } from 'lwt-state';
import { useAnimation } from 'lwt-ui-kit';
import React from 'react';
import { useCountdown } from './hooks/useTimer';

export function NotificationMessage(): React.ReactNode {
  const [{ notificationMessage }] = useData(['notificationMessage']);

  // const [notificationMessageDisplay, setNotificationMessageDisplay] = useState<
  //   null | number
  // >(null);
  const hangOpenMS = 3000;
  const slideMS = 1000;
  const isOpen = useCountdown({
    countdownInMs: hangOpenMS + slideMS,
    intervalInMs: 500,
    trigger: notificationMessage,
  });
  const interval = useAnimation({
    duration: slideMS,
    retrigger: isOpen,
    easingName: 'elastic',
  });
  // this is needed for initial hook pass
  if (notificationMessage === null || notificationMessage === undefined) {
    return <></>;
  }
  const messageSize = 50;
  const calcSize = (isOpening: boolean, size: number) =>
    isOpening ? size : 1 - size;
  return (
    <div
      className="msgblue"
      style={{
        position: 'fixed',
        width: '100%',
        display: interval === 1 && !isOpen ? 'none' : 'flex',
        justifyContent: 'center',
        zIndex: 999,
        alignItems: 'center',
        // top        // maxHeight: 100,
        height: messageSize,
        // TODO some reason this doesnt completely hide the div
        top: `${messageSize * calcSize(isOpen, interval) - messageSize}px`,
      }}
    >
      <span>+++ {notificationMessage.txt} +++</span>
    </div>
  );
}
