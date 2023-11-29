import { LanguagesId, TextsId } from './validators';

export type Settings = {
  dbversion: string;
  showallwords: number;
  currentlanguage: LanguagesId | null;
  lastscorecalc: number;
  currenttext: TextsId;
  'set-text-h-frameheight-no-audio': number;
  'set-text-h-frameheight-with-audio': number;
  'set-text-l-framewidth-percent': number;
  'set-text-r-frameheight-percent': number;
  'set-test-h-frameheight': number;
  'set-test-l-framewidth-percent': number;
  'set-test-r-frameheight-percent': number;
  'set-test-main-frame-waiting-time': number;
  'set-test-edit-frame-waiting-time': number;
  'set-test-sentence-count': number;
  'set-term-sentence-count': number;
  'set-archivedtexts-per-page': number;
  'set-texts-per-page': number;
  'set-terms-per-page': number;
  'set-tags-per-page': number;
  'set-show-text-word-counts': string;
  'set-text-visit-statuses-via-key': string;
  'set-term-translation-delimiters': string;
  'set-mobile-display-mode': string;
  'set-similar-terms-count': string;
};
