import * as ss from "superstruct";
import { Language } from "./lwtTypes";
import {
  NumberInListValidator,
  StringInListValidator,
  csvFileValidator,
} from "./validators";

export const UploadTermsValidator = (languages: Language[]) =>
  ss.object({
    // TODO at least has term
    // columns: ss.refine(
    //   ss.nonempty(ss.array()),
    //   'no-dupes',
    //   (vals) =>
    //     ['w', 't', 'r', 's', 'g', 'x'].findIndex(
    //       (key) => vals.filter((keyVal) => keyVal !== key).length > 1
    //     ) === -1
    // ),
    columns: ss.nonempty(
      ss.array(StringInListValidator(["w", "t", "r", "s", "g", "x"] as const))
    ),
    over: NumberInListValidator([0, 1]),
    c1: StringInListValidator(["w", "t", "r", "s", "g", "x"] as const),
    c2: StringInListValidator(["w", "t", "r", "s", "g", "x"] as const),
    c3: StringInListValidator(["w", "t", "r", "s", "g", "x"] as const),
    c4: StringInListValidator(["w", "t", "r", "s", "g", "x"] as const),
    c5: StringInListValidator(["w", "t", "r", "s", "g", "x"] as const),
    delimiter: StringInListValidator(["c", "t", "h"] as const),
    WoStatus: NumberInListValidator([0, 1, 2, 3, 4, 5, 98, 99] as const),
    file: csvFileValidator,
    // TODO add hook callback to check if ID given exists
    WoLgID: NumberInListValidator(languages.map((val) => val.LgID)),
    // WoStatus: NumberInListValidator(
    //   Object.keys(StrengthMap).map(
    //     (strengthKey) => StrengthMap[strengthKey].classKey
    //   )
    // ),
  } as const);
