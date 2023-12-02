// TODO table component?

import { Language, LanguageNoId, Tag } from '../data/parseMySqlDump';
import { emptyToNullMap, identityMap, parseNumMap } from '../forms/Forms';

export const languageNoIdPreValidateMap: {
  [key in keyof LanguageNoId]?: (
    value: string
  ) => number | string | undefined | null;
} = {
  LgTextSize: parseNumMap,
  LgRemoveSpaces: parseNumMap,
  LgSplitEachChar: parseNumMap,
  LgRightToLeft: parseNumMap,
  LgDict2URI: emptyToNullMap,
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
  LgDict2URI: emptyToNullMap,
};

export const tagPreValidateMap: {
  [key in keyof Tag]?: (value: string) => any | null;
} = {
  TgText: identityMap,
  TgComment: emptyToNullMap,
};
export const wordNoIdPrevalidateMap = {
  WoStatus: parseNumMap,
  WoLgID: parseNumMap,
  WoCreated: () => Date.now(),
  WoTextLC: (_, refMap) => refMap.WoText.current.value.toLowerCase(),
};
export const wordPrevalidateMap = {
  WoID: parseNumMap,
  WoStatus: parseNumMap,
  WoLgID: parseNumMap,
  WoCreated: () => Date.now(),
  WoTextLC: (_, refMap) => refMap.WoText.current.value.toLowerCase(),
};
export const textPrevalidateMap = {
  TxLgID: parseNumMap,
  TxAudioURI: emptyToNullMap,
  TxSourceURI: emptyToNullMap,
};
export const settingsPrevalidateMap = {
  'set-text-h-frameheight-no-audio': parseNumMap,
  'set-text-h-frameheight-with-audio': parseNumMap,
  'set-text-l-framewidth-percent': parseNumMap,
  'set-text-r-frameheight-percent': parseNumMap,
  'set-test-h-frameheight': parseNumMap,
  'set-test-l-framewidth-percent': parseNumMap,
  'set-test-r-frameheight-percent': parseNumMap,
  'set-test-main-frame-waiting-time': parseNumMap,
  'set-test-edit-frame-waiting-time': parseNumMap,
  'set-test-sentence-count': parseNumMap,
  'set-term-sentence-count': parseNumMap,
  'set-archivedtexts-per-page': parseNumMap,
  'set-texts-per-page': parseNumMap,
  'set-terms-per-page': parseNumMap,
  'set-tags-per-page': parseNumMap,
  'set-show-text-word-counts': parseNumMap,
  'set-similar-terms-count': parseNumMap,
  'set-mobile-display-mode': parseNumMap,
  'set-text-visit-statuses-via-key': parseNumMap,
};
