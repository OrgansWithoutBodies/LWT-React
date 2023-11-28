import * as ss from 'superstruct';
import { brandedNumber, brandedString, BrandedString } from './branding';
type URL = `http://${string}` | `https://${string}`;
type URLTemplate = `http://${string}` | `https://${string}`;

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
const URLTemplateValidator = (): ss.Struct<any, any> =>
  ss.string() && ss.define('urlTemplate', isValidURLTemplate);

const NumberInListValidator = <TNum extends Readonly<number[]>>(
  numbers: TNum
) =>
  ss.refine<TNum[number], null>(
    ss.number() as ss.Struct<TNum[number], null>,
    'Zero or One',
    (val) => numbers.includes(val)
  );
const BooleanNumberValidator = NumberInListValidator([0, 1] as const);

const TimestampValidator = () => ss.number();
// TODO valid reference key id
const archivedtextsId = brandedNumber('archivedtextsId' as const);
const archtexttagsId = brandedNumber('archtexttagsId' as const);
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
const tagsId = brandedNumber('tagsId' as const);
const tags2Id = brandedNumber('tags2Id' as const);
const textitemsId = brandedNumber('textitemsId' as const);
const textsId = brandedNumber('textsId' as const);
const texttagsId = brandedNumber('texttagsId' as const);
const wordsId = brandedNumber('wordsId' as const);
const wordtagsId = brandedNumber('wordtagsId' as const);
export type ArchivedTextsId = typeof archivedtextsId.TYPE;
export type ArchTextTagsId = typeof archtexttagsId.TYPE;
export type LanguagesId = typeof languagesId.TYPE;
export type SentencesId = typeof sentencesId.TYPE;
export type SettingsId = typeof settingsId.TYPE;
export type TagsId = typeof tagsId.TYPE;
export type Tags2Id = typeof tags2Id.TYPE;
export type TextItemsId = typeof textitemsId.TYPE;
export type TextsId = typeof textsId.TYPE;
export type TextTagsId = typeof texttagsId.TYPE;
export type WordsId = typeof wordsId.TYPE;
export type WordTagsId = typeof wordtagsId.TYPE;
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
});

export const ArchTextTagsValidator = ss.object({
  // AgAtID: int(11) unsigned NOT NULL,
  // KEY `AgAtID` (`AgAtID`),
  AgAtID: archtexttagsId,
  // AgT2ID: int(11) unsigned NOT NULL,
  // KEY `AgT2ID` (`AgT2ID`)
  AgT2ID: tags2Id,
  // KEY (`AgAtID`,`AgT2ID`),
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
  LgDict1URI: ss.nonempty(URLTemplateValidator()),
  // LgDict2URI: varchar(200) DEFAULT NULL,
  LgDict2URI: ss.optional(URLTemplateValidator()),
  // LgGoogleTranslateURI: varchar(200) DEFAULT NULL,
  LgGoogleTranslateURI: ss.optional(URLTemplateValidator()),
  // LgExportTemplate: varchar(1000) DEFAULT NULL,
  LgExportTemplate: ss.optional(ss.string()),
  // LgTextSize: int(5) unsigned NOT NULL DEFAULT '100',
  LgTextSize: NumberInListValidator(textSizes),
  // LgCharacterSubstitutions: varchar(500) NOT NULL,
  LgCharacterSubstitutions: ss.nonempty(ss.string()),
  // LgRegexpSplitSentences: varchar(500) NOT NULL,
  LgRegexpSplitSentences: ss.nonempty(ss.string()),
  // LgExceptionsSplitSentences: varchar(500) NOT NULL,
  LgExceptionsSplitSentences: ss.nonempty(ss.string()),
  // LgRegexpWordCharacters: varchar(500) NOT NULL,
  LgRegexpWordCharacters: ss.nonempty(ss.string()),
  // LgRemoveSpaces: int(1) unsigned NOT NULL DEFAULT '0',
  LgRemoveSpaces: BooleanNumberValidator,
  // LgSplitEachChar: int(1) unsigned NOT NULL DEFAULT '0',
  LgSplitEachChar: BooleanNumberValidator,
  // LgRightToLeft: int(1) unsigned NOT NULL DEFAULT '0',
  LgRightToLeft: BooleanNumberValidator,
});
export const LanguagesValidatorNoId = ss.omit(LanguagesValidator, ['LgID']);
export const SentencesValidator = ss.object({
  // SeID: int(11) unsigned NOT NULL AUTO_INCREMENT,
  // PRIMARY KEY (`SeID`),
  SeID: sentencesId,
  // SeLgID: int(11) unsigned NOT NULL,
  // KEY `SeLgID` (`SeLgID`),
  SeLgID: languagesId,
  // SeTxID: int(11) unsigned NOT NULL,
  // KEY `SeTxID` (`SeTxID`),
  SeTxID: textsId,
  // SeOrder: int(11) unsigned NOT NULL,
  // KEY `SeOrder` (`SeOrder`)
  SeOrder: ss.number(),
  // SeText: text,
  SeText: ss.nonempty(ss.string()),
});
// TODO import Settings type
export const SettingsValidator = ss.object({
  // StKey: varchar(40) NOT NULL,
  // PRIMARY KEY (`StKey`)
  StKey: settingsId,
  // StValue: varchar(40) DEFAULT NULL,
  StValue: ss.nonempty(ss.string()),
});

export const TagsValidator = ss.object({
  // TgID: int(11) unsigned NOT NULL AUTO_INCREMENT,
  // PRIMARY KEY (`TgID`),
  TgID: tagsId,
  // TgText: varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  // UNIQUE KEY `TgText` (`TgText`)
  TgText: ss.nonempty(ss.string()),
  // TgComment: varchar(200) NOT NULL DEFAULT '',
  TgComment: ss.optional(ss.string()),
});

export const Tags2Validator = ss.object({
  // T2ID: int(11) unsigned NOT NULL AUTO_INCREMENT,
  // PRIMARY KEY (`T2ID`),
  T2ID: tags2Id,
  // T2Text: varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  // UNIQUE KEY `T2Text` (`T2Text`)
  T2Text: ss.nonempty(ss.string()),
  // T2Comment: varchar(200) NOT NULL DEFAULT '',
  T2Comment: ss.optional(ss.string()),
});

export const TextItemsValidator = ss.object({
  // TiID: int(11) unsigned NOT NULL AUTO_INCREMENT,
  // KEY (`TiID`),
  TiID: textitemsId,
  // TiLgID: int(11) unsigned NOT NULL,
  // KEY `TiLgID` (`TiLgID`),
  TiLgID: languagesId,
  // TiTxID: int(11) unsigned NOT NULL,
  // KEY `TiTxID` (`TiTxID`),
  TiTxID: textsId,
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
  TiTextLC: ss.nonempty(ss.string()),
  // TiIsNotWord: tinyint(1) NOT NULL,
  // KEY `TiIsNotWord` (`TiIsNotWord`)
  TiIsNotWord: ss.number(),
});

export const TextsValidator = ss.object({
  // TxID: int(11) unsigned NOT NULL AUTO_INCREMENT,
  // PRIMARY KEY (`TxID`),
  TxID: textsId,
  // TxLgID: int(11) unsigned NOT NULL,
  // KEY `TxLgID` (`TxLgID`)
  TxLgID: languagesId,
  // TxTitle: varchar(200) NOT NULL,
  TxTitle: ss.nonempty(ss.string()),
  // TxText: text NOT NULL,
  // TODO max 65,000 bytes
  TxText: ss.nonempty(ss.string()),
  // TxAnnotatedText: longtext NOT NULL,
  TxAnnotatedText: ss.nonempty(ss.string()),
  // TxAudioURI: varchar(200) DEFAULT NULL,
  TxAudioURI: ss.optional(URLValidator()),
  // TxSourceURI: varchar(1000) DEFAULT NULL,
  TxSourceURI: ss.optional(URLValidator()),
});
export const TextsValidatorNoId = ss.omit(TextsValidator, ['TxID']);

export const TextTagsValidator = ss.object({
  // TtTxID: int(11) unsigned NOT NULL,
  // KEY `TtTxID` (`TtTxID`),
  TtTxID: textsId,
  // TtT2ID: int(11) unsigned NOT NULL,
  // KEY `TtT2ID` (`TtT2ID`)
  TtT2ID: tags2Id,
  // KEY (`TtTxID`,`TtT2ID`),
});

export const WordsValidator = ss.object({
  // WoID: int(11) unsigned NOT NULL AUTO_INCREMENT,
  // PRIMARY KEY (`WoID`),
  WoID: wordsId,
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
  WoStatus: ss.enums([0, 1, 2, 3, 4, 5, 98, 99]),
  // WoTranslation: varchar(500) NOT NULL DEFAULT '*',
  // KEY `WoTranslation` (`WoTranslation`(333)),
  WoTranslation: ss.nonempty(ss.string()),
  // WoRomanization: varchar(100) DEFAULT NULL,
  WoRomanization: ss.optional(ss.string()),
  // WoSentence: varchar(1000) DEFAULT NULL,
  WoSentence: ss.optional(ss.string()),
  // WoCreated: timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  // KEY `WoCreated` (`WoCreated`),
  WoCreated: TimestampValidator(),
  // TODO make into unix timestamp ms
  // WoCreated: TimestampValidator(),
  // WoStatusChanged: timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  // KEY `WoStatusChanged` (`WoStatusChanged`),
  WoStatusChanged: TimestampValidator(),
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
});
export const WordsValidatorNoId = ss.omit(WordsValidator, ['WoID']);

export const WordTagsValidator = ss.object({
  // WtWoID: int(11) unsigned NOT NULL,
  // KEY `WtWoID` (`WtWoID`)
  WtWoID: wordsId,
  // WtTgID: int(11) unsigned NOT NULL,
  // KEY `WtTgID` (`WtTgID`),
  WtTgID: tagsId,
  // KEY (`WtWoID`,`WtTgID`),
});
