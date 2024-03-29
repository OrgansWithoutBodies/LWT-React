export const TermStrengths = [1, 2, 3, 4, 5, "WKn", "Ign"] as const;
export type TermStrength = (typeof TermStrengths)[number];
export type TermStrengthOrUnknown = TermStrength | 0;

export enum Strength {
  unencountered,
  seen,
  planted,
  growing,
  bloomed,
  ignore,
}
export type NumericalStrength = 0 | 1 | 2 | 3 | 4 | 5 | 98 | 99;

export const StrengthMap: Record<
  TermStrengthOrUnknown,
  { status: string; classKey: NumericalStrength }
> = {
  0: { status: "Unknown", classKey: 0 },
  1: { status: "Learning", classKey: 1 },
  2: { status: "Learning", classKey: 2 },
  3: { status: "Learning", classKey: 3 },
  4: { status: "Learning", classKey: 4 },
  5: { status: "Learned", classKey: 5 },
  Ign: { status: "Ignored", classKey: 98 },
  WKn: { status: "Well Known", classKey: 99 },
};
export const StrengthMapNumericalKey: Record<
  NumericalStrength,
  { name: string; abbr: TermStrengthOrUnknown }
> = {
  0: { name: "Unknown", abbr: 0 },
  1: { name: "Learning", abbr: 1 },
  2: { name: "Learning", abbr: 2 },
  3: { name: "Learning", abbr: 3 },
  4: { name: "Learning", abbr: 4 },
  5: { name: "Learned", abbr: 5 },
  98: { name: "Ignored", abbr: "Ign" },
  99: { name: "Well Known", abbr: "WKn" },
}; // todo STATUSES comes from her e
// function get_wordstatus_radiooptions(v)
// {
// 	if (!isset(v))
// 		v = 1;
// 	r = "";
// 	statuses = get_statuses();
// 	foreach (statuses as n => status) {
// 		r .= '<span class="status' . n . '" title="' . tohtml(status["name"]) . '">';
// 		r .= '&nbsp;<input type="radio" name="WoStatus" value="' . n . '"';
// 		if (v === n)
// 			r .= ' checked="checked"';
// 		r .= ' />' . tohtml(status["abbr"]) . "&nbsp;</span> ";
// 	}
// 	return r;
// }
/**
 *
 * @param status
 */
export function getStatusName(status: NumericalStrength | undefined) {
  return status !== undefined
    ? StrengthMapNumericalKey[status].name
    : "Unknown";
}
/**
 *
 * @param status
 */
export function getStatusAbbr(status: NumericalStrength | undefined) {
  return status !== undefined ? StrengthMapNumericalKey[status].abbr : "?";
}
// TODO dedupe with STATUSES

export const ReverseStrengthMap: Record<
  NumericalStrength,
  TermStrengthOrUnknown
> = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  98: "Ign",
  99: "WKn",
};
/**
 *
 * @param n
 */
export function get_status_name(n: NumericalStrength) {
  return StrengthMapNumericalKey[n].name;
}
// -------------------------------------------------------------
/**
 *
 * @param n
 */

export function get_status_abbr(n: NumericalStrength) {
  return StrengthMapNumericalKey[n].abbr;
}

export type NumericalStrengthPotentiallyCompound =
  | NumericalStrength
  | 12
  | 13
  | 14
  | 15
  | 23
  | 24
  | 25
  | 34
  | 35
  | 45
  | 599;
