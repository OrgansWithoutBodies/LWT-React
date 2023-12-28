import { I18NLanguages } from "lwt-i18n";
import * as ss from "superstruct";
import { brandedNumber, brandedString, BrandedString } from "./branding";
import { NumericalSettingInRangeValidator } from "./settings";

type URL = `http://${string}` | `https://${string}`;
type URLTemplate = `http://${string}` | `https://${string}`;
type APIURLTemplate = `api://${string}`;

// todo why cant use straight string for persistable here
// const getValidatorPluginsFor = <
//   TKey extends Persistable,
//   TTableKeys extends string = string
// >(
//   key: TKey
// ): { [k in TTableKeys]: ss.Struct<any, unknown> } => {
//   const val = Object.fromEntries(
//     PLUGINS.filter(
//       ({ validators }) => validators && validators[key] !== undefined
//     )
//       .map(({ validators }) => {
//         const safeKeyValidator = validators![key]!;

//         return Object.entries(safeKeyValidator);
//       })
//       .flat()
//     // TODO no cast if possible
//   ) as { [k in TTableKeys]: ss.Struct<any, unknown> };
//   console.log("TEST123-validator", val);
//   return val;
// };
// export const getEntryLinePluginsFor = <
//   TKey extends Persistable,
//   TTableKeys extends string = string
// >(
//   key: TKey
// ): { [k in TTableKeys]: EntryRowType & { child: EntryRowComponent } } =>
//   Object.fromEntries(
//     PLUGINS.filter(
//       ({ entryLines }) => entryLines && entryLines[key] !== undefined
//     )
//       .map(({ entryLines }) => {
//         const safeKeyEntryLines = entryLines![key]!;
//         console.log("TEST123-entry", Object.entries(safeKeyEntryLines));
//         return Object.entries(safeKeyEntryLines);
//       })
//       .flat()
//   );
const isValidAPIURL = (
  validationString: string
): validationString is APIURLTemplate => validationString.startsWith("api://");
const isValidURL = (validationString: string): validationString is URL =>
  validationString.startsWith("http://") ||
  validationString.startsWith("https://");
const isValidURLTemplate = (
  validationString: string
): validationString is URLTemplate =>
  validationString.startsWith("*http://") ||
  validationString.startsWith("*https://");
const LowerCaseValidator = () =>
  ss.refine(
    ss.string(),
    "lowercase-string",
    (val) => val.toLowerCase() === val
  );

export const URLValidator = () =>
  ss.refine<BrandedString<"URL">, any>(ss.string() as any, "url", isValidURL);
// TODO
const APIURLValidator = () =>
  ss.refine<APIURLTemplate, any>(ss.string() as any, "api-url", isValidAPIURL);
const URLTemplateValidator = (): ss.Struct<any, any> =>
  ss.refine<URLTemplate, any>(
    ss.string() as any,
    "urlTemplate",
    isValidURLTemplate
  );
export const DictURLValidator: () => ss.Struct<
  APIURLTemplate | URLTemplate | BrandedString<"URL">
> = () => ss.union([URLTemplateValidator(), APIURLValidator(), URLValidator()]);
export const NumberInListValidator = <TNum extends Readonly<number[]>>(
  numbers: TNum
) =>
  ss.refine<TNum[number], null>(
    ss.number() as ss.Struct<TNum[number], null>,
    "number-in-list",
    (val) => numbers.includes(val)
  );
export const StringInListValidator = <TString extends Readonly<string[]>>(
  strings: TString
) =>
  ss.refine<TString[number], null>(
    ss.string() as ss.Struct<TString[number], null>,
    "string-in-list",
    (val) => strings.includes(val)
  );
const BooleanNumberValidator = NumberInListValidator([0, 1] as const);

// TODO refine this?
// const TimestampValidator = () => ss.number();
const TimestampStringValidator = ss.refine(
  ss.string(),
  "timestamp-string-yyyy-mm-dd hh:mm:ss",
  (val) =>
    new RegExp(
      "[0-9][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9] [0-2][0-9]:[0-5][0-9]:[0-5][0-9]"
    ).test(val)
);
// TODO valid reference key id
const archivedtextsID = brandedNumber("archivedtextsID" as const);
export const languagesID = brandedNumber("languagesID" as const);
const sentencesID = brandedNumber("sentencesID" as const);
const settingsID = brandedString("settingsID" as const);
export const settingsKeys = [
  "dbversion",
  "showallwords",
  "currentlanguage",
  "lastscorecalc",
  "set-text-h-frameheight-no-audio",
  "set-text-h-frameheight-with-audio",
  "set-text-l-framewidth-percent",
  "set-text-r-frameheight-percent",
  "set-test-h-frameheight",
  "set-test-l-framewidth-percent",
  "set-test-r-frameheight-percent",
  "set-test-main-frame-waiting-time",
  "set-test-edit-frame-waiting-time",
  "set-test-sentence-count",
  "set-term-sentence-count",
  "set-archivedtexts-per-page",
  "set-texts-per-page",
  "set-terms-per-page",
  "set-tags-per-page",
  "set-show-text-word-counts",
  "set-term-translation-delimiters",
  "set-mobile-display-mode",
  "set-similar-terms-count",
  "currenttext",
] as const;

const tagID = brandedNumber("tagsID" as const);
const tag2ID = brandedNumber("tags2ID" as const);
const textitemID = brandedNumber("textitemsID" as const);
const textID = brandedNumber("textsID" as const);
const texttagID = brandedNumber("texttagsID" as const);
const wordID = brandedNumber("wordsID" as const);
const wordtagID = brandedNumber("wordtagsID" as const);
export type ArchivedTextID = typeof archivedtextsID.TYPE;
export type LanguagesID = typeof languagesID.TYPE;
export type SentencesID = typeof sentencesID.TYPE;
export type SettingsID = typeof settingsID.TYPE;
export type TagsID = typeof tagID.TYPE;
export type Tags2ID = typeof tag2ID.TYPE;
export type TextItemsID = typeof textitemID.TYPE;
export type TextsID = typeof textID.TYPE;
export type TextTagsID = typeof texttagID.TYPE;
export type WordsID = typeof wordID.TYPE;
export type WordTagsID = typeof wordtagID.TYPE;
export const Tag2ListValidator = ss.array(ss.string());

// TODO nullable, max lengths, unsigned vs signed
export const ArchivedTextsWithTagsValidator = ss.object({
  // AtID: int(11) unsigned NOT NULL AUTO_INCREMENT,
  // PRIMARY KEY (`AtID`),
  AtID: archivedtextsID,
  // AtLgID: int(11) unsigned NOT NULL,
  // KEY `AtLgID` (`AtLgID`)
  AtLgID: languagesID,
  // AtTitle: varchar(200) NOT NULL,
  AtTitle: ss.nonempty(ss.string()),
  // AtText: text NOT NULL,
  AtText: ss.nonempty(ss.string()),
  // AtAnnotatedText: longtext NOT NULL,
  AtAnnotatedText: ss.nonempty(ss.string()),
  // AtAudioURI: varchar(200) DEFAULT NULL,
  AtAudioURI: ss.optional(URLValidator()),
  // AtSourceURI: varchar(1000) DEFAULT NULL,
  AtSourceURI: ss.optional(URLValidator()),
  taglist: Tag2ListValidator,
  // ...getValidatorPluginsFor(Persistable.archivedtexts),
});

export const ArchivedTextsValidator = ss.omit(ArchivedTextsWithTagsValidator, [
  "taglist",
]);

export const ArchTextTagsValidator = ss.object({
  // AgAtID: int(11) unsigned NOT NULL,
  // KEY `AgAtID` (`AgAtID`),
  AgAtID: archivedtextsID,
  // AgT2ID: int(11) unsigned NOT NULL,
  // KEY `AgT2ID` (`AgT2ID`)
  AgT2ID: tag2ID,
  // KEY (`AgAtID`,`AgT2ID`),
  // ...getValidatorPluginsFor(Persistable.archivedtexts),
});

export const textSizes = [100, 150, 200, 250] as const;
export type TextSize = (typeof textSizes)[number];
export const LanguagesValidator = ss.object({
  // LgID: int(11) unsigned NOT NULL AUTO_INCREMENT,
  // KEY (`LgID`),
  LgID: languagesID,
  // LgName: varchar(40) NOT NULL,
  // UNIQUE KEY `LgName` (`LgName`)
  // TODO no duplicates
  LgName: ss.size(ss.string(), 1, 40),
  // LgDict1URI: varchar(200) NOT NULL,
  LgDict1URI: ss.nonempty(DictURLValidator()),
  // LgDict2URI: varchar(200) DEFAULT NULL,
  LgDict2URI: ss.optional(DictURLValidator()),
  // LgGoogleTranslateURI: varchar(200) DEFAULT NULL,
  LgGoogleTranslateURI: ss.optional(DictURLValidator()),
  // LgExportTemplate: varchar(1000) DEFAULT NULL,
  LgExportTemplate: ss.optional(ss.string()),
  // LgTextSize: int(5) unsigned NOT NULL DEFAULT '100',
  LgTextSize: NumberInListValidator(textSizes),
  // LgCharacterSubstitutions: varchar(500) NOT NULL,
  LgCharacterSubstitutions: ss.string(),
  // LgRegexpSplitSentences: varchar(500) NOT NULL,
  LgRegexpSplitSentences: ss.nonempty(ss.string()),
  // LgExceptionsSplitSentences: varchar(500) NOT NULL,
  LgExceptionsSplitSentences: ss.string(),
  // LgRegexpWordCharacters: varchar(500) NOT NULL,
  LgRegexpWordCharacters: ss.nonempty(ss.string()),
  // LgRemoveSpaces: int(1) unsigned NOT NULL DEFAULT '0',
  LgRemoveSpaces: BooleanNumberValidator,
  // LgSplitEachChar: int(1) unsigned NOT NULL DEFAULT '0',
  LgSplitEachChar: BooleanNumberValidator,
  // LgRightToLeft: int(1) unsigned NOT NULL DEFAULT '0',
  LgRightToLeft: BooleanNumberValidator,
  // ...getValidatorPluginsFor<
  //   Persistable.languages,
  //   // TODO dont specify
  //   "LgTatoebaSourceKey" | "LgTatoebaTargetKey"
  // >(Persistable.languages),
});
export type DictURITemplateType =
  (typeof LanguagesValidator.TYPE)["LgDict1URI"];
export const LanguageValidatorNoID = ss.omit(LanguagesValidator, ["LgID"]);
export const SentenceValidator = ss.object({
  // SeID: int(11) unsigned NOT NULL AUTO_INCREMENT,
  // PRIMARY KEY (`SeID`),
  SeID: sentencesID,
  // SeLgID: int(11) unsigned NOT NULL,
  // KEY `SeLgID` (`SeLgID`),
  SeLgID: languagesID,
  // SeTxID: int(11) unsigned NOT NULL,
  // KEY `SeTxID` (`SeTxID`),
  SeTxID: textID,
  // SeOrder: int(11) unsigned NOT NULL,
  // KEY `SeOrder` (`SeOrder`)
  SeOrder: ss.number(),
  // SeText: text,
  SeText: ss.nonempty(ss.string()),
  // ...getValidatorPluginsFor(Persistable.sentences),
});

// TODO import Settings type
export const SettingsValidator = ss.object({
  // StKey: varchar(40) NOT NULL,
  // PRIMARY KEY (`StKey`)
  StKey: settingsID,
  // StValue: varchar(40) DEFAULT NULL,
  StValue: ss.nonempty(ss.string()),

  // this  adds a column to ****EVERY**** settings entry
  // ...getValidatorPluginsFor(Persistable.settings),
});

export const TagsValidator = ss.object({
  // TgID: int(11) unsigned NOT NULL AUTO_INCREMENT,
  // PRIMARY KEY (`TgID`),
  TgID: tagID,
  // TgText: varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  // UNIQUE KEY `TgText` (`TgText`)
  TgText: ss.nonempty(ss.string()),
  // TgComment: varchar(200) NOT NULL DEFAULT '',
  TgComment: ss.optional(ss.string()),
  // ...getValidatorPluginsFor(Persistable.tags),
});

export const Tags2Validator = ss.object({
  // T2ID: int(11) unsigned NOT NULL AUTO_INCREMENT,
  // PRIMARY KEY (`T2ID`),
  T2ID: tag2ID,
  // T2Text: varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  // UNIQUE KEY `T2Text` (`T2Text`)
  T2Text: ss.nonempty(ss.string()),
  // T2Comment: varchar(200) NOT NULL DEFAULT '',
  T2Comment: ss.optional(ss.string()),
  // ...getValidatorPluginsFor(Persistable.tags2),
});

export const TextItemsValidator = ss.object({
  // TiID: int(11) unsigned NOT NULL AUTO_INCREMENT,
  // KEY (`TiID`),
  TiID: textitemID,
  // TiLgID: int(11) unsigned NOT NULL,
  // KEY `TiLgID` (`TiLgID`),
  TiLgID: languagesID,
  // TiTxID: int(11) unsigned NOT NULL,
  // KEY `TiTxID` (`TiTxID`),
  TiTxID: textID,
  // TiSeID: int(11) unsigned NOT NULL,
  // KEY `TiSeID` (`TiSeID`),
  TiSeID: sentencesID,
  // TiOrder: int(11) unsigned NOT NULL,
  // KEY `TiOrder` (`TiOrder`),
  TiOrder: ss.number(),
  // TiWordCount: int(1) unsigned NOT NULL,
  TiWordCount: ss.number(),
  // TiText: string,
  // TiText: varchar(250) NOT NULL,
  TiText: ss.nonempty(ss.string()),
  // TiTextLC: varchar(250) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  // KEY `TiTextLC` (`TiTextLC`),
  TiTextLC: ss.nonempty(LowerCaseValidator()),
  // TiIsNotWord: tinyint(1) NOT NULL,
  // KEY `TiIsNotWord` (`TiIsNotWord`)
  TiIsNotWord: NumberInListValidator([0, 1] as const),
  // TODO
  // TiAudioSeconds: ss.optional(ss.number()),
  // ...getValidatorPluginsFor(Persistable.textitems),
});
// TODO
// export const Tag2ListValidator = ss.array(TagsValidator);

export const TextsWithTagsValidator = ss.object({
  // TxID: int(11) unsigned NOT NULL AUTO_INCREMENT,
  // PRIMARY KEY (`TxID`),
  TxID: textID,
  // TxLgID: int(11) unsigned NOT NULL,
  // KEY `TxLgID` (`TxLgID`)
  TxLgID: languagesID,
  // TxTitle: varchar(200) NOT NULL,
  TxTitle: ss.nonempty(ss.string()),
  // TxText: text NOT NULL,
  // TODO max 65,000 bytes
  TxText: ss.nonempty(ss.string()),
  // TxAnnotatedText: longtext NOT NULL,
  TxAnnotatedText: ss.string(),
  // TxAudioURI: varchar(200) DEFAULT NULL,
  TxAudioURI: ss.optional(URLValidator()),
  // TxSourceURI: varchar(1000) DEFAULT NULL,
  TxSourceURI: ss.optional(URLValidator()),
  taglist: Tag2ListValidator,
  // ...getValidatorPluginsFor(Persistable.texts),
});
export const TextsValidator = ss.omit(TextsWithTagsValidator, ["taglist"]);
export const Tags2NoIDValidator = ss.omit(Tags2Validator, ["T2ID"]);
export const TextsValidatorNoID = ss.omit(TextsValidator, ["TxID"]);
export const CheckTextsValidator = ss.pick(TextsValidator, [
  "TxLgID",
  "TxText",
]);

export const TextTagsValidator = ss.object({
  // TtTxID: int(11) unsigned NOT NULL,
  // KEY `TtTxID` (`TtTxID`),
  TtTxID: textID,
  // TtT2ID: int(11) unsigned NOT NULL,
  // KEY `TtT2ID` (`TtT2ID`)
  TtT2ID: tag2ID,
  // KEY (`TtTxID`,`TtT2ID`),
  // ...getValidatorPluginsFor(Persistable.texttags),
});

export const TagListValidator = ss.array(ss.string());
// export const TagListValidator = ss.array(TagsValidator);

export const WordsWithTagsValidator = ss.object({
  // WoID: int(11) unsigned NOT NULL AUTO_INCREMENT,
  // PRIMARY KEY (`WoID`),
  WoID: wordID,
  // WoLgID: int(11) unsigned NOT NULL,
  // KEY `WoLgID` (`WoLgID`),
  WoLgID: languagesID,
  // WoText: varchar(250) NOT NULL,
  WoText: ss.nonempty(ss.string()),
  // WoTextLC: varchar(250) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  // KEY `WoTextLC` (`WoTextLC`),
  WoTextLC: ss.nonempty(LowerCaseValidator()),
  // WoStatus: tinyint(4) NOT NULL,
  // KEY `WoStatus` (`WoStatus`),
  WoStatus: NumberInListValidator([0, 1, 2, 3, 4, 5, 98, 99] as const),
  // WoTranslation: varchar(500) NOT NULL DEFAULT '*',
  // KEY `WoTranslation` (`WoTranslation`(333)),
  WoTranslation: ss.string(),
  // WoRomanization: varchar(100) DEFAULT NULL,
  WoRomanization: ss.optional(ss.string()),
  // WoSentence: varchar(1000) DEFAULT NULL,
  WoSentence: ss.optional(ss.string()),
  // WoCreated: timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  // KEY `WoCreated` (`WoCreated`),
  WoCreated: TimestampStringValidator,
  // TODO make into unix timestamp ms
  // WoCreated: TimestampValidator(),
  // WoStatusChanged: timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  // KEY `WoStatusChanged` (`WoStatusChanged`),
  WoStatusChanged: TimestampStringValidator,
  // WoTodayScore: double NOT NULL DEFAULT '0',
  // KEY `WoTodayScore` (`WoTodayScore`),
  WoTodayScore: ss.number(),
  // WoTomorrowScore: double NOT NULL DEFAULT '0',
  // KEY `WoTomorrowScore` (`WoTomorrowScore`),
  WoTomorrowScore: ss.number(),
  // WoRandom: double NOT NULL DEFAULT '0',
  // KEY `WoRandom` (`WoRandom`)
  WoRandom: ss.number(),
  taglist: TagListValidator,
  // UNIQUE KEY `WoLgIDTextLC` (`WoLgID`,`WoTextLC`),
  // ...getValidatorPluginsFor(Persistable.words),
});

// TODO should be reversed & should be able to add to object, union/intersection dont seem to do what i expect
export const WordsValidator = ss.omit(WordsWithTagsValidator, ["taglist"]);

// TODO maybe these should be validated?
export const EditWordsValidator = ss.omit(WordsWithTagsValidator, [
  "WoCreated",
  "WoTodayScore",
  "WoTomorrowScore",
  "WoRandom",
]);
export const WordsValidatorNoID = ss.omit(WordsValidator, ["WoID"]);

export const WordTagsValidator = ss.object({
  // WtWoID: int(11) unsigned NOT NULL,
  // KEY `WtWoID` (`WtWoID`)
  WtWoID: wordID,
  // WtTgID: int(11) unsigned NOT NULL,
  // KEY `WtTgID` (`WtTgID`),
  WtTgID: tagID,
  // KEY (`WtWoID`,`WtTgID`),
  // ...getValidatorPluginsFor(Persistable.wordtags),
});

export const SettingsObjValidator = ss.object({
  dbversion: ss.string(),
  showallwords: NumberInListValidator([0, 1] as const),
  currenttext: textID,
  uilanguage: StringInListValidator(I18NLanguages),
  currentlanguage: ss.optional(languagesID),
  lastscorecalc: ss.number(),
  "set-text-h-frameheight-no-audio": NumericalSettingInRangeValidator(
    "set-text-h-frameheight-no-audio"
  ),
  "set-text-h-frameheight-with-audio": NumericalSettingInRangeValidator(
    "set-text-h-frameheight-with-audio"
  ),
  "set-text-l-framewidth-percent": NumericalSettingInRangeValidator(
    "set-text-l-framewidth-percent"
  ),
  "set-text-r-frameheight-percent": NumericalSettingInRangeValidator(
    "set-text-r-frameheight-percent"
  ),
  "set-test-h-frameheight": NumericalSettingInRangeValidator(
    "set-test-h-frameheight"
  ),
  "set-test-l-framewidth-percent": NumericalSettingInRangeValidator(
    "set-test-l-framewidth-percent"
  ),
  "set-test-r-frameheight-percent": NumericalSettingInRangeValidator(
    "set-test-r-frameheight-percent"
  ),
  "set-test-main-frame-waiting-time": NumericalSettingInRangeValidator(
    "set-test-main-frame-waiting-time"
  ),
  "set-test-edit-frame-waiting-time": NumericalSettingInRangeValidator(
    "set-test-edit-frame-waiting-time"
  ),
  // TODO
  "set-test-sentence-count": ss.number(),
  // TODO
  "set-term-sentence-count": ss.number(),
  "set-archivedtexts-per-page": NumericalSettingInRangeValidator(
    "set-archivedtexts-per-page"
  ),
  "set-texts-per-page": NumericalSettingInRangeValidator("set-texts-per-page"),
  "set-terms-per-page": NumericalSettingInRangeValidator("set-terms-per-page"),
  "set-tags-per-page": NumericalSettingInRangeValidator("set-tags-per-page"),
  // TODO
  "set-show-text-word-counts": ss.number(),
  "set-mobile-display-mode": NumberInListValidator([0, 1, 2] as const),
  "set-similar-terms-count": NumericalSettingInRangeValidator(
    "set-similar-terms-count"
  ),
  "set-text-visit-statuses-via-key": NumberInListValidator([
    1, 2, 3, 4, 5, 12, 13, 14, 15, 23, 24, 25, 34, 35, 45, 599,
  ] as const),
  "set-term-translation-delimiters": ss.string(),
  // TODO differentiate from every entry
  // ...getValidatorPluginsFor(Persistable.settings),
});

// TODO check magics
export const csvFileValidator = ss.object({
  file: ss.any(),
  fileName: ss.refine(ss.string(), "ends-with-csv", (val) =>
    val.endsWith(".csv")
  ),
  fileType: ss.refine(ss.string(), "is-text-csv", (val) => val === "text/csv"),
});
/**
 *
 * @param s
 */

export function containsCharacterOutsideBasicMultilingualPlane(s: string) {
  return /[\uD800-\uDFFF]/.test(s);
}
