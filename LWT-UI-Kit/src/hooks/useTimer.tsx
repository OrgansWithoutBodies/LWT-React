import { useEffect, useState } from 'react';

/**
 *
 * @param intervalInMs
 * @param trigger
 */
export function useTick(intervalInMs: number, trigger?: any) {
  const initialTime = new Date().getTime();
  const [timeSinceStart, setTimeSinceStart] = useState<number | null>(null);
  const [stopTimer, setStopTimer] = useState<() => void>(() => () => {});
  useEffect(() => {
    const interval = setInterval(
      () => setTimeSinceStart(() => new Date().getTime() - initialTime),
      intervalInMs
    );
    setStopTimer(() => () => {
      clearInterval(interval);
      setTimeSinceStart(null);
    });
    return () => {
      clearInterval(interval);
      setTimeSinceStart(null);
    };
  }, [trigger]);
  return { tick: timeSinceStart, stopTimer };
}

export function useCountdown({
  countdownInMs,
  intervalInMs,
  trigger,
}: {
  countdownInMs: number;
  intervalInMs?: number;
  trigger?: any;
}) {
  const { tick, stopTimer } = useTick(intervalInMs || 1000, trigger);
  const [stillRunning, setStillRunning] = useState<boolean>(true);
  useEffect(() => {
    if (tick !== null) {
      if (tick > countdownInMs) {
        setStillRunning(false);
        stopTimer();
        return;
      } else if (!stillRunning) {
        setStillRunning(true);
      }
    }

    return () => {
      // setStillRunning(false);
      // stopTimer();
    };
  }, [trigger, tick]);
  return stillRunning;
}
