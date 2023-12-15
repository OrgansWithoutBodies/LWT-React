export const MS_IN_S = 1000;
export const S_IN_MIN = 60;
export const MIN_IN_HOUR = 60;
export const HOUR_IN_DAY = 24;

export const MS_IN_DAY = MS_IN_S * S_IN_MIN * MIN_IN_HOUR * HOUR_IN_DAY;
export function DateDiff(laterDate: Date, earlierDate: Date) {
  return Math.floor((laterDate.getTime() - earlierDate.getTime()) / MS_IN_DAY);
}
