import { Query } from '@datorama/akita';
import {
  combineLatest,
  count,
  interval,
  map,
  Observable,
  of,
  switchMap,
  take,
  withLatestFrom,
} from 'rxjs';
import { DataState, DataStore, dataStore } from './data.storage';
import { LanguagesId, TextsId } from './validators';
const MINS_IN_SECONDS = 60;
const HOURS_IN_MINS = 60;
const DAYS_IN_HOURS = 24;
const DAYS_IN_SECONDS = DAYS_IN_HOURS * HOURS_IN_MINS * MINS_IN_SECONDS;
const TICKER_INTERVAL = 50;
const TICKER_MAX_STEPS = 20;

function ticker(startValue: number, endValue: number): Observable<number> {
  return interval(TICKER_INTERVAL).pipe(
    take(TICKER_MAX_STEPS),
    map((count) => ++count),
    map((count) =>
      Math.floor(
        startValue * ((TICKER_MAX_STEPS - count) / TICKER_MAX_STEPS) +
          endValue * (count / TICKER_MAX_STEPS)
      )
    )
  );
}

function timedSwitchMap<
  TObservableA extends Observable<unknown>,
  TObservableB extends Observable<unknown>
>(
  startObservable: TObservableA,
  endObservable: TObservableB,
  ticker_interval: number
) {
  return interval(ticker_interval).pipe(
    take(1),
    map((count) => ++count),
    switchMap((count) => (count === 0 ? startObservable : endObservable))
  );
}
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

  public parsedTexts = this.select('parsedTexts');
  public notificationMessage = this.select('notificationMessage');

  public notificationMessageDisplay = of(100).pipe(
    withLatestFrom(this.notificationMessage),
    switchMap(([initial]) => timedSwitchMap(of(initial), ticker(100, 0), 2000))
  );

  public numArchivedTexts = this.archivedtexts.pipe(count());
  // public archivedtextsLen = this.archivedtexts.pipe(count());
  // public archtexttagsLen = this.archtexttags.pipe(count());
  // public languagesLen = this.languages.pipe(count());
  // public sentencesLen = this.sentences.pipe(count());
  // public settingsLen = this.settings.pipe(count());
  // public tagsLen = this.tags.pipe(count());
  // public tags2Len = this.tags2.pipe(count());
  // public textitemsLen = this.textitems.pipe(count());
  // public textsLen = this.texts.pipe(count());
  // public texttagsLen = this.texttags.pipe(count());
  // public wordsLen = this.words.pipe(count());
  // public wordtagsLen = this.wordtags.pipe(count());

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
        console.log(word.WoLgID, activeLanguageId);
        return word.WoLgID === activeLanguageId;
      });
    })
  );
  public textsForActiveLanguage = combineLatest([
    this.texts,
    this.activeLanguageId,
  ]).pipe(
    map(([texts, activeLanguageId]) => {
      console.log('QUERY', { texts });

      if (activeLanguageId === null) {
        return texts;
      }
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
  public languageStatusStatistics = combineLatest([
    this.languages,
    this.words,
    this.tags,
  ]).pipe(
    map(([languages, words, tags]) => {
      const statisticMapEntries = words.reduce(
        (prev, curr) => {
          const val = prev;
          // while we're here may as well just count em all up to avoid another pass
          val[curr.WoLgID]['total'] = val[curr.WoLgID]['total'] + 1;
          if (curr.WoStatus === 0) {
            return val;
          }
          // mutable
          val[curr.WoLgID][curr.WoStatus] = val[curr.WoLgID][curr.WoStatus] + 1;

          if (curr.WoStatus >= 1 && curr.WoStatus <= 5) {
            val[curr.WoLgID][15] = val[curr.WoLgID][15] + 1;
            if (curr.WoStatus <= 4) {
              val[curr.WoLgID][14] = val[curr.WoLgID][14] + 1;
            }
          }
          return val;
        },
        Object.fromEntries(
          languages.map((lang) => [
            lang.LgID,
            {
              total: 0,
              1: 0,
              2: 0,
              3: 0,
              4: 0,
              5: 0,
              15: 0,
              14: 0,
              99: 0,
              599: 0,
              98: 0,
            },
          ])
        )
      );
      const statisticMap: Record<
        LanguagesId,
        Record<1 | 2 | 3 | 4 | 5 | 15 | 14 | 99 | 599 | 98 | 'total', number>
      > = statisticMapEntries;
      console.log('TEST123-query', statisticMap);
      return statisticMap;
    })
  );

  public termTimeStatistics = combineLatest([this.words]).pipe(
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
      console.log({ textsForActiveLanguage });
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