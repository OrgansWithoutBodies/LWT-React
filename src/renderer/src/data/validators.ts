import * as ss from 'superstruct';
import { Persistable } from '../../../shared/Persistable';
import { EntryRowType } from '../pages/Language/NewLanguage';
import { EntryRowComponent } from '../Plugin';
import { PLUGINS } from '../plugins';
import { Language } from '../utils/parseMySqlDump';
import { brandedNumber, brandedString, BrandedString } from './branding';

type URL = `http://${string}` | `https://${string}`;
type URLTemplate = `http://${string}` | `https://${string}`;
type APIURLTemplate = `api://${string}`;

// todo why cant use straight string for persistable here
const getValidatorPluginsFor = <
  TKey extends Persistable,
  TTableKeys extends string = string
>(
  key: TKey
): { [k in TTableKeys]: ss.Struct<any, unknown> } => {
  const val = Object.fromEntries(
    PLUGINS.filter(
      ({ validators }) => validators && validators[key] !== undefined
    )
      .map(({ validators }) => {
        const safeKeyValidator = validators[key]!;

        return Object.entries(safeKeyValidator);
      })
      .flat()
  );
  console.log('TEST123-validator', val);
  return val;
};
export const getEntryLinePluginsFor = <
  TKey extends Persistable,
  TTableKeys extends string = string
>(
  key: TKey
): { [k in TTableKeys]: EntryRowType & { child: EntryRowComponent } } =>
  Object.fromEntries(
    PLUGINS.filter(
      ({ entryLines }) => entryLines && entryLines[key] !== undefined
    )
      .map(({ entryLines }) => {
        const safeKeyEntryLines = entryLines![key]!;
        console.log('TEST123-entry', Object.entries(safeKeyEntryLines));
        return Object.entries(safeKeyEntryLines);
      })
      .flat()
  );
const isValidAPIURL = (
  validationString: string
): validationString is APIURLTemplate => validationString.startsWith('api://');
const isValidURL = (validationString: string): validationString is URL =>
  validationString.startsWith('http://') ||
  validationString.startsWith('https://');
const isValidURLTemplate = (
  validationString: string
): validationString is URLTemplate =>
  validationString.startsWith('*http://') ||
  validationString.startsWith('*https://');

const URLValidator = () =>
  ss.string() && ss.define<BrandedString<'URL'>>('url', isValidURL);
// TODO
const APIURLValidator = () =>
  ss.string() && ss.define<APIURLTemplate>('api-url', isValidAPIURL);
const URLTemplateValidator = (): ss.Struct<any, any> =>
  ss.string() && ss.define('urlTemplate', isValidURLTemplate);
const DictURLValidator: ss.Struct<
  APIURLTemplate | URLTemplate | BrandedString<'URL'>
> = ss.union([URLTemplateValidator(), APIURLValidator(), URLValidator()]);
export const NumberInListValidator = <TNum extends Readonly<number[]>>(
  numbers: TNum
) =>
  ss.refine<TNum[number], null>(
    ss.number() as ss.Struct<TNum[number], null>,
    'number-in-list',
    (val) => numbers.includes(val)
  );
export const StringInListValidator = <TString extends Readonly<string[]>>(
  strings: TString
) =>
  ss.refine<TString[number], null>(
    ss.string() as ss.Struct<TString[number], null>,
    'string-in-list',
    (val) => strings.includes(val)
  );
const BooleanNumberValidator = NumberInListValidator([0, 1] as const);

// TODO refine this?
const TimestampValidator = () => ss.number();
const TimestampStringValidator = ss.refine(
  ss.string(),
  'timestamp-string-yyyy-mm-dd hh:mm:ss',
  (val) =>
    new RegExp(
      '[0-9][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9] [0-2][0-9]:[0-5][0-9]:[0-5][0-9]'
    ).test(val)
);
// TODO valid reference key id
const archivedtextsId = brandedNumber('archivedtextsId' as const);
export const languagesId = brandedNumber('languagesId' as const);
const sentencesId = brandedNumber('sentencesId' as const);
const settingsId = brandedString('settingsId' as const);
export const settingsKeys = [
  'dbversion',
  'showallwords',
  'currentlanguage',
  'lastscorecalc',
  'set-text-h-frameheight-no-audio',
  'set-text-h-frameheight-with-audio',
  'set-text-l-framewidth-percent',
  'set-text-r-frameheight-percent',
  'set-test-h-frameheight',
  'set-test-l-framewidth-percent',
  'set-test-r-frameheight-percent',
  'set-test-main-frame-waiting-time',
  'set-test-edit-frame-waiting-time',
  'set-test-sentence-count',
  'set-term-sentence-count',
  'set-archivedtexts-per-page',
  'set-texts-per-page',
  'set-terms-per-page',
  'set-tags-per-page',
  'set-show-text-word-counts',
  'set-term-translation-delimiters',
  'set-mobile-display-mode',
  'set-similar-terms-count',
  'currenttext',
] as const;

const tagId = brandedNumber('tagsId' as const);
const tag2Id = brandedNumber('tags2Id' as const);
const textitemId = brandedNumber('textitemsId' as const);
const textId = brandedNumber('textsId' as const);
const texttagId = brandedNumber('texttagsId' as const);
const wordId = brandedNumber('wordsId' as const);
const wordtagId = brandedNumber('wordtagsId' as const);
export type ArchivedTextId = typeof archivedtextsId.TYPE;
export type LanguagesId = typeof languagesId.TYPE;
export type SentencesId = typeof sentencesId.TYPE;
export type SettingsId = typeof settingsId.TYPE;
export type TagsId = typeof tagId.TYPE;
export type Tags2Id = typeof tag2Id.TYPE;
export type TextItemsId = typeof textitemId.TYPE;
export type TextsId = typeof textId.TYPE;
export type TextTagsId = typeof texttagId.TYPE;
export type WordsId = typeof wordId.TYPE;
export type WordTagsId = typeof wordtagId.TYPE;
// TODO nullable, max lengths, unsigned vs signed
export const ArchivedTextsValidator = ss.object({
  // AtID: int(11) unsigned NOT NULL AUTO_INCREMENT,
  // PRIMARY KEY (`AtID`),
  AtID: archivedtextsId,
  // AtLgID: int(11) unsigned NOT NULL,
  // KEY `AtLgID` (`AtLgID`)
  AtLgID: languagesId,
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
  ...getValidatorPluginsFor(Persistable.archivedtexts),
});

export const ArchTextTagsValidator = ss.object({
  // AgAtID: int(11) unsigned NOT NULL,
  // KEY `AgAtID` (`AgAtID`),
  AgAtID: archivedtextsId,
  // AgT2ID: int(11) unsigned NOT NULL,
  // KEY `AgT2ID` (`AgT2ID`)
  AgT2ID: tag2Id,
  // KEY (`AgAtID`,`AgT2ID`),
  ...getValidatorPluginsFor(Persistable.archivedtexts),
});

export const textSizes = [100, 150, 200, 250] as const;
export const LanguagesValidator = ss.object({
  // LgID: int(11) unsigned NOT NULL AUTO_INCREMENT,
  // KEY (`LgID`),
  LgID: languagesId,
  // LgName: varchar(40) NOT NULL,
  // UNIQUE KEY `LgName` (`LgName`)
  // TODO no duplicates
  LgName: ss.size(ss.string(), 1, 40),
  // LgDict1URI: varchar(200) NOT NULL,
  LgDict1URI: ss.nonempty(DictURLValidator),
  // LgDict2URI: varchar(200) DEFAULT NULL,
  LgDict2URI: ss.optional(DictURLValidator),
  // LgGoogleTranslateURI: varchar(200) DEFAULT NULL,
  LgGoogleTranslateURI: ss.optional(DictURLValidator),
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
  ...getValidatorPluginsFor<Persistable.languages, 'LgTatoebaKey'>(
    Persistable.languages
  ),
});
export type DictURITemplateType =
  (typeof LanguagesValidator.TYPE)['LgDict1URI'];
export const LanguageValidatorNoId = ss.omit(LanguagesValidator, ['LgID']);
export const SentenceValidator = ss.object({
  // SeID: int(11) unsigned NOT NULL AUTO_INCREMENT,
  // PRIMARY KEY (`SeID`),
  SeID: sentencesId,
  // SeLgID: int(11) unsigned NOT NULL,
  // KEY `SeLgID` (`SeLgID`),
  SeLgID: languagesId,
  // SeTxID: int(11) unsigned NOT NULL,
  // KEY `SeTxID` (`SeTxID`),
  SeTxID: textId,
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
  StKey: settingsId,
  // StValue: varchar(40) DEFAULT NULL,
  StValue: ss.nonempty(ss.string()),

  // this  adds a column to ****EVERY**** settings entry
  // ...getValidatorPluginsFor(Persistable.settings),
});

export const TagsValidator = ss.object({
  // TgID: int(11) unsigned NOT NULL AUTO_INCREMENT,
  // PRIMARY KEY (`TgID`),
  TgID: tagId,
  // TgText: varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  // UNIQUE KEY `TgText` (`TgText`)
  TgText: ss.nonempty(ss.string()),
  // TgComment: varchar(200) NOT NULL DEFAULT '',
  TgComment: ss.optional(ss.string()),
  ...getValidatorPluginsFor(Persistable.tags),
});

export const Tags2Validator = ss.object({
  // T2ID: int(11) unsigned NOT NULL AUTO_INCREMENT,
  // PRIMARY KEY (`T2ID`),
  T2ID: tag2Id,
  // T2Text: varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  // UNIQUE KEY `T2Text` (`T2Text`)
  T2Text: ss.nonempty(ss.string()),
  // T2Comment: varchar(200) NOT NULL DEFAULT '',
  T2Comment: ss.optional(ss.string()),
  ...getValidatorPluginsFor(Persistable.tags2),
});

export const TextItemsValidator = ss.object({
  // TiID: int(11) unsigned NOT NULL AUTO_INCREMENT,
  // KEY (`TiID`),
  TiID: textitemId,
  // TiLgID: int(11) unsigned NOT NULL,
  // KEY `TiLgID` (`TiLgID`),
  TiLgID: languagesId,
  // TiTxID: int(11) unsigned NOT NULL,
  // KEY `TiTxID` (`TiTxID`),
  TiTxID: textId,
  // TiSeID: int(11) unsigned NOT NULL,
  // KEY `TiSeID` (`TiSeID`),
  TiSeID: sentencesId,
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
  // TODO check isLowerCase
  TiTextLC: ss.nonempty(ss.string()),
  // TiIsNotWord: tinyint(1) NOT NULL,
  // KEY `TiIsNotWord` (`TiIsNotWord`)
  TiIsNotWord: NumberInListValidator([0, 1] as const),
  ...getValidatorPluginsFor(Persistable.textitems),
});

export const TextsValidator = ss.object({
  // TxID: int(11) unsigned NOT NULL AUTO_INCREMENT,
  // PRIMARY KEY (`TxID`),
  TxID: textId,
  // TxLgID: int(11) unsigned NOT NULL,
  // KEY `TxLgID` (`TxLgID`)
  TxLgID: languagesId,
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
  ...getValidatorPluginsFor(Persistable.texts),
});
export const Tags2NoIdValidator = ss.omit(Tags2Validator, ['T2ID']);
export const TextsValidatorNoId = ss.omit(TextsValidator, ['TxID']);
export const CheckTextsValidator = ss.pick(TextsValidator, [
  'TxLgID',
  'TxText',
]);

export const TextTagsValidator = ss.object({
  // TtTxID: int(11) unsigned NOT NULL,
  // KEY `TtTxID` (`TtTxID`),
  TtTxID: textId,
  // TtT2ID: int(11) unsigned NOT NULL,
  // KEY `TtT2ID` (`TtT2ID`)
  TtT2ID: tag2Id,
  // KEY (`TtTxID`,`TtT2ID`),
  ...getValidatorPluginsFor(Persistable.texttags),
});

export const WordsValidator = ss.object({
  // WoID: int(11) unsigned NOT NULL AUTO_INCREMENT,
  // PRIMARY KEY (`WoID`),
  WoID: wordId,
  // WoLgID: int(11) unsigned NOT NULL,
  // KEY `WoLgID` (`WoLgID`),
  WoLgID: languagesId,
  // WoText: varchar(250) NOT NULL,
  WoText: ss.nonempty(ss.string()),
  // WoTextLC: varchar(250) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  // KEY `WoTextLC` (`WoTextLC`),
  WoTextLC: ss.nonempty(ss.string()),
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
  // UNIQUE KEY `WoLgIDTextLC` (`WoLgID`,`WoTextLC`),
  ...getValidatorPluginsFor(Persistable.words),
});
// TODO maybe these should be validated?
export const EditWordsValidator = ss.omit(WordsValidator, [
  'WoCreated',
  'WoTodayScore',
  'WoTomorrowScore',
  'WoRandom',
]);
export const WordsValidatorNoId = ss.omit(WordsValidator, ['WoID']);

export const WordTagsValidator = ss.object({
  // WtWoID: int(11) unsigned NOT NULL,
  // KEY `WtWoID` (`WtWoID`)
  WtWoID: wordId,
  // WtTgID: int(11) unsigned NOT NULL,
  // KEY `WtTgID` (`WtTgID`),
  WtTgID: tagId,
  // KEY (`WtWoID`,`WtTgID`),
  ...getValidatorPluginsFor(Persistable.wordtags),
});
export const SettingsObjValidator = ss.object({
  dbversion: ss.string(),
  showallwords: NumberInListValidator([0, 1]),
  currenttext: textId,
  currentlanguage: ss.optional(languagesId),
  lastscorecalc: ss.number(),
  'set-text-h-frameheight-no-audio': ss.number(),
  'set-text-h-frameheight-with-audio': ss.number(),
  'set-text-l-framewidth-percent': ss.number(),
  'set-text-r-frameheight-percent': ss.number(),
  'set-test-h-frameheight': ss.number(),
  'set-test-l-framewidth-percent': ss.number(),
  'set-test-r-frameheight-percent': ss.number(),
  'set-test-main-frame-waiting-time': ss.number(),
  'set-test-edit-frame-waiting-time': ss.number(),
  'set-test-sentence-count': ss.number(),
  'set-term-sentence-count': ss.number(),
  'set-archivedtexts-per-page': ss.number(),
  'set-texts-per-page': ss.number(),
  'set-terms-per-page': ss.number(),
  'set-tags-per-page': ss.number(),
  'set-show-text-word-counts': ss.number(),
  'set-mobile-display-mode': NumberInListValidator([0, 1, 2]),
  'set-similar-terms-count': ss.number(),
  'set-text-visit-statuses-via-key': NumberInListValidator([
    1, 2, 3, 4, 5, 12, 13, 14, 15, 23, 24, 25, 34, 35, 45, 599,
  ]),
  'set-term-translation-delimiters': ss.string(),
  // TODO differentiate from every entry
  ...getValidatorPluginsFor(Persistable.settings),
});

// TODO check magics
const csvFileValidator = ss.object({
  file: ss.any(),
  fileName: ss.refine(ss.string(), 'ends-with-csv', (val) =>
    val.endsWith('.csv')
  ),
  fileType: ss.refine(ss.string(), 'is-text-csv', (val) => val === 'text/csv'),
});
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
      ss.array(
        ss.string(
          StringInListValidator(['w', 't', 'r', 's', 'g', 'x'] as const)
        )
      )
    ),
    over: NumberInListValidator([0, 1]),
    c1: StringInListValidator(['w', 't', 'r', 's', 'g', 'x'] as const),
    c2: StringInListValidator(['w', 't', 'r', 's', 'g', 'x'] as const),
    c3: StringInListValidator(['w', 't', 'r', 's', 'g', 'x'] as const),
    c4: StringInListValidator(['w', 't', 'r', 's', 'g', 'x'] as const),
    c5: StringInListValidator(['w', 't', 'r', 's', 'g', 'x'] as const),
    delimiter: StringInListValidator(['c', 't', 'h'] as const),
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
