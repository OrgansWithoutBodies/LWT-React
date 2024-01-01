import { Query } from "@datorama/akita";
import { textexprcount, textwordcount, textworkcount } from "lwt-common";
import { SuppportedI18NLanguages } from "lwt-i18n";
import type {
  LanguagesID,
  NumericalStrengthPotentiallyCompound,
  SettingsObject,
  Text,
  TextItem,
  Word,
} from "lwt-schemas";
import { Observable, combineLatest, count, map, tap } from "rxjs";
import { DataState, DataStore, dataStore } from "./data.storage";
import {
  ArchivedTextDetailRow,
  TermDetailRow,
  TextDetailRow,
} from "./detailRows.types";
import { makeHash } from "./makeHash";

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

  public archivedtexts = this.select("archivedtexts");
  public archivedTextsHashmapByLanguage = DataQuery.makeCountHash(
    this.archivedtexts,
    "AtLgID"
  );

  public archtexttags = this.select("archtexttags");

  public languages = this.select("languages");
  // TODO use these
  public languageHashmap = DataQuery.makeHash(this.languages, "LgID");
  public languageHashmapByName = DataQuery.makeHash(this.languages, "LgName");

  public sentences = this.select("sentences");
  public sentenceHashmap = DataQuery.makeHash(this.sentences, "SeID");

  public tags = this.select("tags");
  public tagsHashmapByText = DataQuery.makeHash(this.tags, "TgText");
  public tagsHashmapByID = DataQuery.makeHash(this.tags, "TgID");

  public tags2 = this.select("tags2");
  public tags2HashmapByText = DataQuery.makeHash(this.tags2, "T2Text");
  public tags2HashmapByID = DataQuery.makeHash(this.tags2, "T2ID");

  public textitems = this.select("textitems");

  public texts = this.select("texts").pipe(
    tap((val) => console.log("TEST123-texts", val))
  );
  public textsCountmapByLanguage = DataQuery.makeCountHash(
    this.texts,
    "TxLgID"
  );
  public textsHashmap = DataQuery.makeHash(this.texts, "TxID");

  public texttags = this.select("texttags");

  public words = this.select("words");
  public wordHashmapByID = DataQuery.makeHash(this.words, "WoID");
  // TODO this isnt a unique key - lang&&lc is - maybe just string key?
  public wordHashmapByLC = DataQuery.makeHash(this.words, "WoTextLC");
  public wordCountmapByLanguage = DataQuery.makeCountHash(this.words, "WoLgID");

  public wordtags = this.select("wordtags");
  public wordTagCountmapByWord = DataQuery.makeCountHash(
    this.wordtags,
    "WtWoID"
  );
  public wordTagCountmapByTag = DataQuery.makeCountHash(
    this.wordtags,
    "WtTgID"
  );
  // TODO
  // public wordTagsHashmapByWord = DataQuery.makeHash(this.worta, 'WoTextLC');

  public settings: Observable<SettingsObject> = this.select("settings").pipe(
    map((settings) => {
      return Object.fromEntries(
        settings.map(
          ({ StKey, StValue }) =>
            [
              StKey,
              Number.isNaN(Number.parseInt(StValue))
                ? StValue
                : Number.parseInt(StValue),
            ] as [keyof SettingsObject, SettingsObject[keyof SettingsObject]]
        )
      ) as SettingsObject;
    })
  );

  // public;

  public notificationMessage = this.select("notificationMessage");

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
  public activeLanguage = combineLatest([
    this.activeLanguageID,
    this.languageHashmap,
  ]).pipe(
    map(([activeID, langs]) => (activeID !== null ? langs[activeID] : null))
  );
  public activeTextID = this.settings.pipe(
    map((val) =>
      val.currenttext === undefined || val.currenttext === null
        ? // semantically null's more meaningful here because null is an explicit state we can set
          null
        : val.currenttext
    )
  );

  public activeText = combineLatest([
    this.activeTextID,
    this.textsHashmap,
  ]).pipe(
    map(([activeID, texts]) => (activeID !== null ? texts[activeID] : null))
  );
  public languageOfActiveText = combineLatest([
    this.activeText,
    this.languageHashmap,
  ]).pipe(map(([text, langs]) => (text !== null ? langs[text.TxLgID] : null)));

  public uiLanguage: Observable<SuppportedI18NLanguages> = this.settings.pipe(
    map((val) => (val.uilanguage === undefined ? "English" : val.uilanguage))
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
      if (activeLanguageID === null) {
        return texts;
      }
      return texts.filter((text) => text.TxLgID === activeLanguageID);
    })
  );
  public archivedtextsForActiveLanguage = combineLatest([
    this.archivedtexts,
    this.activeLanguageID,
  ]).pipe(
    map(([texts, activeLanguageID]) => {
      if (activeLanguageID === null) {
        return texts;
      }
      return texts.filter((text) => text.AtLgID === activeLanguageID);
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
          Record<
            | Exclude<
                NumericalStrengthPotentiallyCompound,
                45 | 35 | 0 | 12 | 13 | 23 | 24 | 25 | 34
              >
            | "total",
            number
          >
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
    this.languageHashmap,
    this.textitems,
    this.tags2HashmapByID,
    this.texttags,
    this.words,
  ]).pipe(
    map(
      ([
        textsForActiveLanguage,
        languageHashmap,
        textitems,
        tags2HashmapByID,
        texttags,
        words,
      ]) => {
        return textsForActiveLanguage.map((text) => {
          // TODO maybe move these to own observable in order to not need to calc if setting is false
          const wordCounts = calculateWordCounts(text, textitems, words);
          return {
            ...text,
            totalWords: wordCounts.$txttotalwords,
            saved:
              wordCounts.$txtworkedall > 0
                ? wordCounts.$txtworkedwords + wordCounts.$txtworkedexpr
                : 0,
            unk: wordCounts.$txttodowords,
            unkPerc: wordCounts.$percentunknown,
            TxLgID: text.TxLgID,
            TxLgName: languageHashmap[text.TxLgID].LgName,
            taglist: texttags
              .filter((val) => val.TtTxID === text.TxID)
              .map((val) => tags2HashmapByID[val.TtT2ID].T2Text),
          };
        });
      }
    ),
    tap(console.log)
  );
  public archtextdetails: Observable<ArchivedTextDetailRow[]> = combineLatest([
    this.archivedtextsForActiveLanguage,
    this.languageHashmap,
  ]).pipe(
    map(([textsForActiveLanguage, languageHashmap]) => {
      return textsForActiveLanguage.map((text) => {
        return {
          ...text,
          // TODO split
          totalWords: text.AtText.length,
          // TODO
          saved: "test",
          // TODO
          unk: 100,
          // TODO
          unkPerc: 100,
          AtLgName: languageHashmap[text.AtLgID].LgName,
          // unkPerc: Math.round(100*)
          // txttodowords = txttotalwords - txtworkedwords;
          // percentunknown = 0;
          // if (txttotalwords !== 0) {
          //   percentunknown =
          //     round(100 * txttodowords / txttotalwords, 0);
        };
      });
    })
  );
  public termDetailRows: Observable<TermDetailRow[]> = combineLatest([
    this.words,
    this.languageHashmap,
  ]).pipe(
    map(([words, languageHashmap]) => {
      return words.map((val) => ({
        ...val,
        termCount: 0,
        WoLgName: languageHashmap[val.WoLgID].LgName,
      }));
    })
  );

  // TODO types not right
  private static makeHash<
    TKey extends string,
    TBrand extends number | string,
    TObj extends { [key in TKey]: TBrand }
  >(
    observable: Observable<TObj[]>,
    key: TKey
  ): Observable<Record<TBrand, TObj>> {
    return observable.pipe(
      map((vals) => makeHash<TKey, TBrand, TObj>(vals, key))
      // TODO no any
    ) as any;
  }
  private static makeCountHash<
    TKey extends string,
    TBrand extends number | string,
    TObj extends { [key in TKey]: TBrand }
  >(
    observable: Observable<TObj[]>,
    key: TKey
  ): Observable<Record<TBrand, number>> {
    return observable.pipe(
      map((vals) => {
        const hashKeys = vals.reduce((prev, curr) => {
          const mutablePrev = prev;
          // TODO no any
          if (!mutablePrev.has(curr[key] as any)) {
            // TODO no any
            mutablePrev.add(curr[key] as any);
            return mutablePrev;
          }
          return prev;
        }, new Set<TKey>());
        const hashmap = vals.reduce((prev, curr) => {
          const mutablePrev = prev;

          mutablePrev[curr[key]] = mutablePrev[curr[key]] + 1;
          return mutablePrev;
        }, Object.fromEntries([...hashKeys].map((key) => [key, 0])));
        return hashmap;
      })
      // TODO no any
    ) as any;
  }

  // TODO
  // private static makeCompoundCountHash<
  //   TKey extends string,
  //   TBrand extends number | string,
  //   TObj extends { [key in TKey]: TBrand }
  // >(
  //   observable: Observable<TObj[]>,
  //   keys: TKey[]
  // ): Observable<Record<TBrand, number>> {
  //   return observable.pipe(
  //     map((vals) => {
  //       const hashKeys = vals.reduce((prev, curr) => {
  //         const mutablePrev = prev;
  //         // TODO no any
  //         if (!mutablePrev.has(curr[keys] as any)) {
  //           // TODO no any
  //           mutablePrev.add(curr[keys] as any);
  //           return mutablePrev;
  //         }
  //         return prev;
  //       }, new Set<TKey>());
  //       const hashmap = vals.reduce((prev, curr) => {
  //         const mutablePrev = prev;

  //         mutablePrev[curr[keys]] = mutablePrev[curr[keys]] + 1;
  //         return mutablePrev;
  //       }, Object.fromEntries([...hashKeys].map((key) => [key, 0])));
  //       return hashmap;
  //     })
  //     // TODO no any
  //   ) as any;
  // }
}
export const dataQuery = new DataQuery(dataStore);

/**
 *
 * @param text
 * @param textItems
 * @param words
 */
export function calculateWordCounts(
  text: Text,
  textItems: TextItem[],
  words: Word[]
) {
  const $txttotalwords = textwordcount(text, textItems);
  const $txtworkedwords = textworkcount(text, textItems, words);
  const $txtworkedexpr = textexprcount(text, textItems, words);
  const $txtworkedall = $txtworkedwords + $txtworkedexpr;
  const $txttodowords = $txttotalwords - $txtworkedwords;
  const $percentunknown =
    $txttotalwords === 0
      ? 0
      : Math.max(
          0,
          Math.min(Math.round((100 * $txttodowords) / $txttotalwords), 100)
        );

  return {
    $txttotalwords,
    $txtworkedwords,
    $txtworkedexpr,
    $txtworkedall,
    $percentunknown,
    $txttodowords,
  };
}
