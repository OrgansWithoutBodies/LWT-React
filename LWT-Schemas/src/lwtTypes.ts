// INSERT INTO {} VALUES(...{}...)
import * as ss from "superstruct";

import {
  ArchivedTextsValidator,
  ArchTextTagsValidator,
  LanguagesValidator,
  LanguageValidatorNoID,
  SentenceValidator,
  SettingsValidator,
  Tags2NoIDValidator,
  Tags2Validator,
  TagsValidator,
  TextItemsValidator,
  TextsValidator,
  TextsValidatorNoID,
  TextsWithTagsValidator,
  TextTagsValidator,
  WordsValidator,
  WordsValidatorNoID,
  WordsWithTagsValidator,
  WordTagsValidator,
} from "./validators";

export type ArchivedText = typeof ArchivedTextsValidator.TYPE;
export type ArchTextTag = typeof ArchTextTagsValidator.TYPE;

export type Language = typeof LanguagesValidator.TYPE;
export type LanguageNoID = typeof LanguageValidatorNoID.TYPE;

export type Sentence = typeof SentenceValidator.TYPE;
export type SettingItem = typeof SettingsValidator.TYPE;
export type Tag = typeof TagsValidator.TYPE;
export type Tag2 = typeof Tags2Validator.TYPE;
export type Tag2NoID = typeof Tags2NoIDValidator.TYPE;
export type TextItem = typeof TextItemsValidator.TYPE;

export type Text = typeof TextsValidator.TYPE;
export type TextNoID = typeof TextsValidatorNoID.TYPE;

export type TextTag = typeof TextTagsValidator.TYPE;

export type Word = typeof WordsValidator.TYPE;
export type WordNoID = typeof WordsValidatorNoID.TYPE;

export type WordTag = typeof WordTagsValidator.TYPE;
export const AddNewWordValidator = ss.omit(WordsWithTagsValidator, [
  "WoID",
  "WoTodayScore",
  "WoTomorrowScore",
  "WoRandom",
  "WoTextLC",
]);

export type AddNewWordType = typeof AddNewWordValidator.TYPE;

export const AddNewTextValidator = ss.omit(TextsValidatorNoID, [
  "TxAnnotatedText",
]);
export const AddNewTextWithTagsValidator = ss.omit(TextsWithTagsValidator, [
  "TxAnnotatedText",
  "TxID",
]);
export type AddNewTextType = typeof AddNewTextValidator.TYPE;

export const AddNewLanguageValidator = ss.omit(LanguageValidatorNoID, []);
export type AddNewLanguageType = typeof AddNewLanguageValidator.TYPE;

// TODO tsoa to generate openapi from these schemas?

export interface LWTData {
  archivedtexts: ArchivedText[];
  archtexttags: ArchTextTag[];
  languages: Language[];
  sentences: Sentence[];
  settings: SettingItem[];
  tags: Tag[];
  tags2: Tag2[];
  textitems: TextItem[];
  texts: Text[];
  texttags: TextTag[];
  words: Word[];
  wordtags: WordTag[];
}
export type LWTDataKeys = keyof LWTData;
export type LWTDataVal = LWTData[keyof LWTData][number];
// TODO dedupe with tableIDLookup
export type IDMap = {
  archivedtexts: "AtID";
  archtexttags: null;
  languages: "LgID";
  sentences: "SeID";
  // settings: 'StID';
  settings: null;
  tags: "TgID";
  tags2: "T2ID";
  textitems: "TiID";
  texts: "TxID";
  texttags: null;
  words: "WoID";
  wordtags: null;
};

export type IDKeyOf<TKey extends keyof LWTData> = IDMap[TKey];
export type IDValOf<TKey extends keyof LWTData> =
  IDKeyOf<TKey> extends keyof LWTData[TKey][number]
    ? LWTData[TKey][number][IDKeyOf<TKey>]
    : null;
