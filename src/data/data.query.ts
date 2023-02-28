import { Query } from '@datorama/akita';
import { combineLatest, map, Observable } from 'rxjs';
import { DataState, DataStore, dataStore } from './data.storage';
import { TextsId } from './validators';
const MINS_IN_SECONDS = 60;
const HOURS_IN_MINS = 60;
const DAYS_IN_HOURS = 24;
const DAYS_IN_SECONDS = DAYS_IN_HOURS * HOURS_IN_MINS * MINS_IN_SECONDS;
export class DataQuery extends Query<DataState> {
  constructor(protected store: DataStore) {
    super(store);
  }

  public archivedtexts = this.select('archivedtexts');
  public archtexttags = this.select('archtexttags');
  public languages = this.select('languages');
  public sentences = this.select('sentences');
  public settings = this.select('settings');
  public tags = this.select('tags');
  public tags2 = this.select('tags2');
  public textitems = this.select('textitems');
  public texts = this.select('texts');
  public texttags = this.select('texttags');
  public words = this.select('words');
  public wordtags = this.select('wordtags');

  public activeLanguageId = this.select('activeLanguageId');

  // derived observables
  public activeLanguage = combineLatest([
    this.activeLanguageId,
    this.languages,
  ]).pipe(
    map(([activeLanguageId, languages]) => {
      return languages.find((language) => {
        return language.LgID === activeLanguageId;
      });
    })
  );
  public activeWords = combineLatest([this.activeLanguageId, this.words]).pipe(
    map(([activeLanguageId, words]) => {
      return words.filter((word) => {
        return word.WoLgID === activeLanguageId;
      });
    })
  );
  public textsForActiveLanguage = combineLatest([
    this.texts,
    this.activeLanguageId,
  ]).pipe(
    map(([texts, activeLanguageId]) => {
      return texts.filter((text) => text.TxLgID === activeLanguageId);
    })
  );
  //   Total
  // 	Active
  // (1..5)	Learning
  // (1..4)	Unknown
  // (1)	Learning
  // (2)	Learning
  // (3)	Learning
  // (4)	Learned
  // (5)	Well
  // Known
  // (99)	Known
  // (5+99)	Ign.
  // (98)
  public termStatistics = combineLatest([this.words]).pipe(
    map(([words]) => {
      const getWordsWithinOffset = (numDays: number) =>
        words.map(
          (word) => word.WoCreated > new Date().getTime() + DAYS_IN_SECONDS
        );
      const todaysWords = getWordsWithinOffset(0);
      const yesterdaysWords = getWordsWithinOffset(1);
      const lastWeekWords = getWordsWithinOffset(7);
      const lastThirtyWords = getWordsWithinOffset(30);
      const lastYearWords = getWordsWithinOffset(365);
      // Today	Yesterday	Last 7 d	Last 30 d	Last 365 d	All Time
    })
  );
  // TODO
  public textDetails: Observable<TextDetailRow[]> = combineLatest([
    this.textsForActiveLanguage,
    this.texttags,
    this.tags2,
  ]).pipe(
    map(([textsForActiveLanguage, texttags, tags]) => {
      return textsForActiveLanguage.map((text) => {
        return {
          TxID: text.TxID,
          title: text.TxTitle,
          // TODO split
          totalWords: text.TxText.length,
          // TODO
          saved: 'test',
          // TODO
          unk: 100,
          // TODO
          unkPerc: 100,
          tags: texttags
            .filter((textTag) => {
              return textTag.TtTxID === text.TxID;
            })
            .map((textTag) => {
              const tag = tags.find((tag) => tag.T2ID === textTag.TtT2ID);
              return tag ? tag.T2Text : 'ERROR';
            }),
        };
      });
    })
  );
}
export const dataQuery = new DataQuery(dataStore);
// TODO map texts to "text detail row"
export type TextDetailRow = {
  title: string;
  link?: string;
  tags?: string[];
  annotatedAvailable?: boolean;
  audioAvailable?: boolean;
  totalWords: number;
  saved: string;
  unk: number;
  unkPerc: number;
  TxID: TextsId;
};
