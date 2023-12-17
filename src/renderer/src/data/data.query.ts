import { Query } from '@datorama/akita';
import { Observable, combineLatest, count, map, tap } from 'rxjs';
import { NumericalStrength } from '../pages/StrengthMap';
import type { ArchivedText, Tag, Tag2, Text } from '../utils/parseMySqlDump';
import { DataState, DataStore, dataStore } from './data.storage';
import type { Settings } from './settings';
import type { LanguagesID } from './validators';

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

// const MINS_IN_SECONDS = 60;
// const HOURS_IN_MINS = 60;
// const DAYS_IN_HOURS = 24;
// const DAYS_IN_SECONDS = DAYS_IN_HOURS * HOURS_IN_MINS * MINS_IN_SECONDS;
// const TICKER_INTERVAL = 50;
// const TICKER_MAX_STEPS = 20;

// /**
//  *
//  * @param startValue
//  * @param endValue
//  */
// function ticker(startValue: number, endValue: number): Observable<number> {
//   return interval(TICKER_INTERVAL).pipe(
//     take(TICKER_MAX_STEPS),
//     map((count) => ++count),
//     map((count) =>
//       Math.floor(
//         startValue * ((TICKER_MAX_STEPS - count) / TICKER_MAX_STEPS) +
//           endValue * (count / TICKER_MAX_STEPS)
//       )
//     )
//   );
// }

// /**
//  *
//  * @param startObservable
//  * @param endObservable
//  * @param ticker_interval
//  */
// function timedSwitchMap<
//   TObservableA extends Observable<unknown>,
//   TObservableB extends Observable<unknown>
// >(
//   startObservable: TObservableA,
//   endObservable: TObservableB,
//   ticker_interval: number
// ) {
//   return interval(ticker_interval).pipe(
//     take(1),
//     map((count) => ++count),
//     switchMap((count) => (count === 0 ? startObservable : endObservable))
//   );
// }
export class DataQuery extends Query<DataState> {
  constructor(protected store: DataStore) {
    super(store);
  }

  public archivedtexts = this.select('archivedtexts');

  public archtexttags = this.select('archtexttags');

  public languages = this.select('languages');

  public sentences = this.select('sentences');

  public tags = this.select('tags');

  public tags2 = this.select('tags2');

  public textitems = this.select('textitems');

  public texts = this.select('texts');

  public texttags = this.select('texttags');

  public words = this.select('words').pipe(
    tap((val) => console.log('QUERY WORDS', val))
  );

  public wordtags = this.select('wordtags');

  public settings: Observable<Settings> = this.select('settings').pipe(
    map((settings) => {
      return Object.fromEntries(
        settings.map(
          ({ StKey, StValue }) =>
            [
              StKey,
              Number.isNaN(Number.parseInt(StValue))
                ? StValue
                : Number.parseInt(StValue),
            ] as [keyof Settings, Settings[keyof Settings]]
        )
      ) as Settings;
    }),
    tap((settings) => console.log('TEST123-query', settings))
  );

  public;

  public notificationMessage = this.select('notificationMessage');

  // public notificationMessageDisplay = of(100).pipe(
  //   withLatestFrom(this.notificationMessage),
  //   switchMap(([initial]) => timedSwitchMap(of(initial), ticker(100, 0), 2000))
  // );

  public numArchivedTexts = this.archivedtexts.pipe(count());
  // public archivedtextsLen = this.archivedtexts.pipe(count());
  // public archtexttagsLen = this.archtexttags.pipe(count());
  // public languagesLen = this.languages.pipe(count());
  // public sentencesLen = this.sentences.pipe(count());
  // public tagsLen = this.tags.pipe(count());
  // public tags2Len = this.tags2.pipe(count());
  // public textitemsLen = this.textitems.pipe(count());
  // public textsLen = this.texts.pipe(count());
  // public texttagsLen = this.texttags.pipe(count());
  // public wordsLen = this.words.pipe(count());
  // public wordtagsLen = this.wordtags.pipe(count());

  public activeLanguageID = this.settings.pipe(
    map((val) =>
      val.currentlanguage === undefined || val.currentlanguage === null
        ? // semantically null's more meaningful here because null is an explicit state we can set
          null
        : val.currentlanguage
    )
  );
  public activeTextID = this.settings.pipe(
    map((val) =>
      val.currenttext === undefined || val.currentlanguage === null
        ? // semantically null's more meaningful here because null is an explicit state we can set
          null
        : val.currenttext
    )
  );

  // derived observables
  public activeLanguage = combineLatest([
    this.activeLanguageID,
    this.languages,
  ]).pipe(
    map(
      ([activeLanguageID, languages]) =>
        languages.find((language) => {
          console.log('TATOEBAKEY', language.LgTatoebaSourceKey);
          return language.LgID === activeLanguageID;
        }) || null
    )
  );

  public activeWords = combineLatest([this.activeLanguageID, this.words]).pipe(
    map(([activeLanguageID, words]) =>
      words.filter((word) => {
        console.log(word.WoLgID, activeLanguageID);
        return word.WoLgID === activeLanguageID;
      })
    )
  );

  public textsForActiveLanguage = combineLatest([
    this.texts,
    this.activeLanguageID,
  ]).pipe(
    map(([texts, activeLanguageID]) => {
      console.log('QUERY', { texts });

      if (activeLanguageID === null) {
        return texts;
      }
      return texts.filter((text) => text.TxLgID === activeLanguageID);
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
    // this.tags,
  ]).pipe(
    map(
      ([
        languages,
        words,
        // tags
      ]) => {
        const statisticMapEntries = words.reduce(
          (prev, curr) => {
            const val = prev;
            // while we're here may as well just count em all up to avoid another pass
            val[curr.WoLgID].total = val[curr.WoLgID].total + 1;
            if (curr.WoStatus === 0) {
              return val;
            }
            // mutable
            val[curr.WoLgID][curr.WoStatus] =
              val[curr.WoLgID][curr.WoStatus] + 1;

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
          LanguagesID,
          Record<NumericalStrengthPotentiallyCompound | 'total', number>
        > = statisticMapEntries;
        return statisticMap;
      }
    )
  );

  // TODO reincorporate working into here
  // public termTimeStatistics = combineLatest([this.words]).pipe(
  //   map(([words]) => {
  //     const getWordsWithinOffset = (numDays: number) =>
  //       words.map(
  //         (word) => word.WoCreated > new Date().getTime() + DAYS_IN_SECONDS
  //       );
  //     // const todaysWords = getWordsWithinOffset(0);
  //     // const yesterdaysWords = getWordsWithinOffset(1);
  //     // const lastWeekWords = getWordsWithinOffset(7);
  //     // const lastThirtyWords = getWordsWithinOffset(30);
  //     // const lastYearWords = getWordsWithinOffset(365);
  //     // Today	Yesterday	Last 7 d	Last 30 d	Last 365 d	All Time
  //   })
  // );

  // TODO not sure this is best pattern
  public textDetails: Observable<TextDetailRow[]> = combineLatest([
    this.textsForActiveLanguage,
  ]).pipe(
    map(([textsForActiveLanguage]) =>
      textsForActiveLanguage.map((text) => ({
        ...text,
        // TODO split
        totalWords: text.TxText.length,
        // TODO
        saved: 'test',
        // TODO
        unk: 100,
        // TODO
        unkPerc: 100,
        TxLgID: text.TxLgID,
        // unkPerc: Math.round(100*)
        // txttodowords = txttotalwords - txtworkedwords;
        // percentunknown = 0;
        // if (txttotalwords !== 0) {
        //   percentunknown =
        //     round(100 * txttodowords / txttotalwords, 0);
      }))
    )
  );
}
export const dataQuery = new DataQuery(dataStore);

/** ================== */

export type WordTagDetailRow = Tag & { termCount: number };

export type TextTagDetailRow = Tag2 & {
  textCount: number;
  archTextCount: number;
};

export type TextDetailRow = Pick<
  Text,
  | 'TxTitle'
  | 'TxSourceURI'
  | 'TxAudioURI'
  | 'TxID'
  | 'TxLgID'
  | 'TxAnnotatedText'
> & {
  totalWords: number;
  saved: string;
  unk: number;
  unkPerc: number;
};

export type ArchivedTextDetailRow = Pick<
  ArchivedText,
  | 'AtTitle'
  | 'AtSourceURI'
  | 'AtAudioURI'
  | 'AtID'
  | 'AtLgID'
  | 'AtAnnotatedText'
> & {
  totalWords: number;
  saved: string;
  unk: number;
  unkPerc: number;
};
