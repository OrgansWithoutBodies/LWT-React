// function onClickSeekBar2(c) {
//   c.preventDefault(),
//     d[b](c),
//     d.options.autoBlur ? a(this).blur() : a(this).focus();
// }
// function onClickSeekBar1(a) {
//   return 'undefined' == typeof n || (a && n.event.triggered === a.type)
//     ? void 0
//     : n.event.dispatch.apply(k.elem, arguments);
// }
export function makeCurrentDateTimeString() {
  const date = new Date();

  return `${date.getFullYear()}-${formatTimeDigit(
    date.getMonth()
  )}-${formatTimeDigit(date.getDate())}-${formatTimeDigit(
    date.getHours()
  )}-${formatTimeDigit(date.getMinutes())}-${formatTimeDigit(
    date.getSeconds()
  )}`;
}
export const formatTimeDigit = (val: number) =>
  val < 10 ? `0${val}` : `${val}`;
export function formatTime(timeSec: number) {
  const numSecs = Math.round(timeSec % 60);
  const numMins = Math.floor(timeSec / 60);
  return `${formatTimeDigit(numMins)}:${formatTimeDigit(numSecs)}`;
}
export const MS_IN_S = 1000;
export const S_IN_MIN = 60;
export const MIN_IN_HOUR = 60;
export const HOUR_IN_DAY = 24;

export const MS_IN_DAY = MS_IN_S * S_IN_MIN * MIN_IN_HOUR * HOUR_IN_DAY;
export function DateDiff(laterDate: Date, earlierDate: Date) {
  return Math.floor((laterDate.getTime() - earlierDate.getTime()) / MS_IN_DAY);
}
export const getCurrentTimeAsString = () => {
  const dt = new Date();

  const padL = (nr: number) => `${nr}`.padStart(2, "0");

  const yyyy = dt.getFullYear();
  const mm = padL(dt.getMonth() + 1);
  const dd = padL(dt.getDate());
  const hh = padL(dt.getHours());
  const min = padL(dt.getMinutes());
  const ss = padL(dt.getSeconds());
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
};
