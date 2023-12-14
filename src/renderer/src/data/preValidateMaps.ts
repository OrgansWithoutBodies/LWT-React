// TODO table component?

import {
  emptyToUndefinedMap,
  identityMap,
  parseNumMap,
  undefinedToBlankMap,
} from '../forms/Forms';
import { Language, LanguageNoId, Tag } from '../utils/parseMySqlDump';

export const languageNoIdPreValidateMap: {
  [key in keyof LanguageNoId]?: (
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
export const getCurrentTimeAsString = () => {
  const dt = new Date();

  const padL = (nr: number) => `${nr}`.padStart(2, '0');

  const yyyy = dt.getFullYear();
  const mm = padL(dt.getMonth() + 1);
  const dd = padL(dt.getDate());
  const hh = padL(dt.getHours());
  const min = padL(dt.getMinutes());
  const ss = padL(dt.getSeconds());
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
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

export const wordNoIdPrevalidateMap = {
  ...Object.fromEntries(
    Object.entries(wordPrevalidateMap).filter(([val]) => val !== 'WoID')
  ),
  WoCreated: getCurrentTimeAsString,
};
export const textNoIdPrevalidateMap = {
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
