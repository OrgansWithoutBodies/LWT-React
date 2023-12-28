import * as ss from "superstruct";
import { SettingsObjValidator } from "./validators";

export type SettingsObject = typeof SettingsObjValidator.TYPE;
export const settingSpec = {
  "set-text-h-frameheight-no-audio": {
    default: 140,
    isNumber: 1,
    min: 10,
    max: 999,
  },
  "set-text-h-frameheight-with-audio": {
    default: 200,
    isNumber: 1,
    min: 10,
    max: 999,
  },
  "set-text-l-framewidth-percent": {
    default: 50,
    isNumber: 1,
    min: 5,
    max: 95,
  },
  "set-text-r-frameheight-percent": {
    default: 50,
    isNumber: 1,
    min: 5,
    max: 95,
  },
  "set-test-h-frameheight": { default: 140, isNumber: 1, min: 10, max: 999 },
  "set-test-l-framewidth-percent": {
    default: 50,
    isNumber: 1,
    min: 5,
    max: 95,
  },
  "set-test-r-frameheight-percent": {
    default: 50,
    isNumber: 1,
    min: 5,
    max: 95,
  },
  "set-test-main-frame-waiting-time": {
    default: 0,
    isNumber: 1,
    min: 0,
    max: 9999,
  },
  "set-test-edit-frame-waiting-time": {
    default: 500,
    isNumber: 1,
    min: 0,
    max: 99999999,
  },
  "set-test-sentence-count": { default: "1", isNumber: 0 },
  "set-term-sentence-count": { default: "1", isNumber: 0 },
  "set-archivedtexts-per-page": {
    default: 100,
    isNumber: 1,
    min: 1,
    max: 9999,
  },
  "set-texts-per-page": { default: 10, isNumber: 1, min: 1, max: 9999 },
  "set-terms-per-page": { default: 100, isNumber: 1, min: 1, max: 9999 },
  "set-tags-per-page": { default: 100, isNumber: 1, min: 1, max: 9999 },
  //   Yes/No
  "set-show-text-word-counts": { default: "1", isNumber: 0 },
  "set-text-visit-statuses-via-key": { default: "", isNumber: 0 },
  "set-term-translation-delimiters": { default: "/;|", isNumber: 0 },
  //   Yes/No
  "set-mobile-display-mode": { default: "0", isNumber: 0 },
  "set-similar-terms-count": { default: 0, isNumber: 1, min: 0, max: 9 },
} as const;
type NumberInRange<TMin extends number, TMax extends number> = number & {
  __min: TMin;
  __max: TMax;
};
export type SettingSpec = typeof settingSpec;

// TODO this working, infer in validator not....
type MinMaxOfDefaultSetting<
  TKey extends keyof SettingSpec,
  TValue extends SettingSpec[TKey] = SettingSpec[TKey]
> = TValue extends { min: infer TMin; max: infer TMax }
  ? { min: TMin; max: TMax }
  : never;

export const NumericalSettingInRangeValidator = <
  TKey extends keyof SettingSpec,
  TMin extends MinMaxOfDefaultSetting<TKey> extends never
    ? never
    : MinMaxOfDefaultSetting<TKey>["min"],
  TMax extends MinMaxOfDefaultSetting<TKey> extends never
    ? never
    : MinMaxOfDefaultSetting<TKey>["max"]
>(
  key: TKey
) => {
  // TODO no cast
  const { min, max } = settingSpec[key] as { min: number; max: number };
  return ss.refine<NumberInRange<TMin, TMax>, any>(
    // TODO no any
    ss.number() as any as ss.Struct<NumberInRange<TMin, TMax>, any>,
    `number-in-range-${min}-${max}`,
    (val) => val >= min && val <= max
  );
};
// options for sentence-count stuff
// function get_sentence_count_selectoptions($v)
// {
// 	if (!isset($v))
// 		$v = 1;
// 	$r = "<option value=\"1\"" . get_selected($v, 1);
// 	$r .= ">Just ONE</option>";
// 	$r .= "<option value=\"2\"" . get_selected($v, 2);
// 	$r .= ">TWO (+previous)</option>";
// 	$r .= "<option value=\"3\"" . get_selected($v, 3);
// 	$r .= ">THREE (+previous,+next)</option>";
// 	return $r;
// }
