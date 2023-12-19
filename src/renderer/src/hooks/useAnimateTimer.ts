import { useEffect, useState } from 'react';

export function useAnimationTimer({
  duration = 1000,
  delay = 0,
  retrigger,
}: {
  duration: number;
  delay: number;
  retrigger: any;
}) {
  const [elapsed, setTime] = useState(0);

  useEffect(
    () => {
      setTime(0);
      let animationFrame: number, timerStop: NodeJS.Timeout, start: number;

      // Function to be executed on each animation frame
      function onFrame() {
        setTime(Date.now() - start);
        loop();
      }

      // Call onFrame() on next animation frame
      function loop() {
        animationFrame = requestAnimationFrame(onFrame);
      }

      function onStart() {
        // Set a timeout to stop things when duration time elapses
        timerStop = setTimeout(() => {
          cancelAnimationFrame(animationFrame);
          setTime(Date.now() - start);
        }, duration);

        // Start the loop
        start = Date.now();
        loop();
      }

      // Start after specified delay (defaults to 0)
      const timerDelay = setTimeout(onStart, delay);

      // Clean things up
      return () => {
        clearTimeout(timerStop);
        clearTimeout(timerDelay);
        cancelAnimationFrame(animationFrame);
      };
    },
    [duration, delay, retrigger] // Only re-run effect if duration or delay changes
  );
  console.log('TEST123-elapsed', { elapsed });
  return elapsed;
}

export default function useAnimation({
  easingName = 'linear',
  duration = 500,
  delay = 0,
  retrigger,
}: {
  easingName?: keyof typeof easing;
  duration?: number;
  delay?: number;
  retrigger?: any;
} = {}) {
  // The useAnimationTimer hook calls useState every animation frame ...
  // ... giving us elapsed time and causing a rerender as frequently ...
  // ... as possible for a smooth animation.
  const elapsed = useAnimationTimer({ duration, delay, retrigger });
  // Amount of specified duration elapsed on a scale from 0 - 1
  const n = Math.min(1, elapsed / duration);
  // Return altered value based on our specified easing function
  return elapsed >= duration ? 1 : easing[easingName](n);
}

// Some easing functions copied from:
// https://github.com/streamich/ts-easing/blob/master/src/index.ts
// Hardcode here or pull in a dependency
const elasticFactors = [15, 67, 126, 106, 33];
const easing = {
  linear: (n: number) => n,
  outQuad: (t) => t * (2 - t),
  elastic: (n: number) =>
    n * (33 * n ** 4 - 106 * n ** 3 + 126 * n ** 2 - 67 * n + 15),
  inExpo: (n: number) => Math.pow(2, 10 * (n - 1)),
} as const;
