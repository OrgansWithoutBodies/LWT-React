// TODO move to schemas?
// TODO table component?

import { getCurrentTimeAsString } from "lwt-common";
import { Language, LanguageNoID, Tag } from "lwt-schemas";

export const identityMap = (val: string) => val;

export const parseNumMap = (value: string) => Number.parseInt(value, 10);
export const emptyToUndefinedMap = (value: string) =>
  value === "" ? undefined : value;
export const undefinedToBlankMap = (value: string | undefined) =>
  value === undefined ? "" : value;
export const binaryMap = (val: "0" | "1") => val === "0";

export const languageNoIDPreValidateMap: {
  [key in keyof LanguageNoID]?: (
    value: string
  ) => number | string | undefined | null;
} = {
  LgTextSize: parseNumMap,
  LgRemoveSpaces: parseNumMap,
  LgSplitEachChar: parseNumMap,
  LgRightToLeft: parseNumMap,
  LgCharacterSubstitutions: emptyToUndefinedMap,
  LgDict2URI: emptyToUndefinedMap,
};
export const languagePreValidateMap: {
  [key in keyof Language]?: (
    value: string
  ) => number | string | undefined | null;
} = {
  LgID: parseNumMap,
  LgTextSize: parseNumMap,
  LgRemoveSpaces: parseNumMap,
  LgSplitEachChar: parseNumMap,
  LgRightToLeft: parseNumMap,
  LgDict2URI: emptyToUndefinedMap,
};

export const tagPreValidateMap: {
  [key in keyof Tag]?: (value: string) => any | null;
} = {
  TgText: identityMap,
  TgComment: emptyToUndefinedMap,
};
export const wordPrevalidateMap = {
  WoID: parseNumMap,

  WoStatus: parseNumMap,
  WoLgID: parseNumMap,
  WoSentence: emptyToUndefinedMap,
  WoStatusChanged: getCurrentTimeAsString,
  WoTextLC: (_: any, refMap: { WoText: { current: { value: string } } }) =>
    refMap.WoText.current.value.toLowerCase(),
  WoTranslation: undefinedToBlankMap,
} as const;

export const wordNoIDPrevalidateMap = {
  ...Object.fromEntries(
    Object.entries(wordPrevalidateMap).filter(([val]) => val !== "WoID")
  ),
  WoCreated: getCurrentTimeAsString,
};
export const textNoIDPrevalidateMap = {
  TxLgID: parseNumMap,
  TxAudioURI: emptyToUndefinedMap,
  TxSourceURI: emptyToUndefinedMap,
};
export const textPrevalidateMap = {
  TxID: parseNumMap,
  TxLgID: parseNumMap,
  TxAudioURI: emptyToUndefinedMap,
  TxSourceURI: emptyToUndefinedMap,
};
export const settingsPrevalidateMap = {
  "set-text-h-frameheight-no-audio": parseNumMap,
  "set-text-h-frameheight-with-audio": parseNumMap,
  "set-text-l-framewidth-percent": parseNumMap,
  "set-text-r-frameheight-percent": parseNumMap,
  "set-test-h-frameheight": parseNumMap,
  "set-test-l-framewidth-percent": parseNumMap,
  "set-test-r-frameheight-percent": parseNumMap,
  "set-test-main-frame-waiting-time": parseNumMap,
  "set-test-edit-frame-waiting-time": parseNumMap,
  "set-test-sentence-count": parseNumMap,
  "set-term-sentence-count": parseNumMap,
  "set-archivedtexts-per-page": parseNumMap,
  "set-texts-per-page": parseNumMap,
  "set-terms-per-page": parseNumMap,
  "set-tags-per-page": parseNumMap,
  "set-show-text-word-counts": parseNumMap,
  "set-similar-terms-count": parseNumMap,
  "set-mobile-display-mode": parseNumMap,
  "set-text-visit-statuses-via-key": parseNumMap,
};
