// INSERT INTO {} VALUES(...{}...)
import * as ss from 'superstruct';

import {
  ArchivedTextsValidator,
  ArchTextTagsValidator,
  LanguagesValidator,
  LanguageValidatorNoId,
  SentenceValidator,
  SettingsValidator,
  Tags2NoIdValidator,
  Tags2Validator,
  TagsValidator,
  TextItemsValidator,
  TextsValidator,
  TextsValidatorNoId,
  TextTagsValidator,
  WordsValidator,
  WordsValidatorNoId,
  WordTagsValidator,
} from './validators';

export type ArchivedText = typeof ArchivedTextsValidator.TYPE;
export type ArchTextTag = typeof ArchTextTagsValidator.TYPE;

export type Language = typeof LanguagesValidator.TYPE;
export type LanguageNoId = typeof LanguageValidatorNoId.TYPE;

export type Sentence = typeof SentenceValidator.TYPE;
export type Settings = typeof SettingsValidator.TYPE;
export type Tag = typeof TagsValidator.TYPE;
export type Tag2 = typeof Tags2Validator.TYPE;
export type Tag2NoId = typeof Tags2NoIdValidator.TYPE;
export type TextItem = typeof TextItemsValidator.TYPE;

export type Text = typeof TextsValidator.TYPE;
export type TextNoId = typeof TextsValidatorNoId.TYPE;

export type TextTag = typeof TextTagsValidator.TYPE;

export type Word = typeof WordsValidator.TYPE;
export type WordNoId = typeof WordsValidatorNoId.TYPE;

export type WordTag = typeof WordTagsValidator.TYPE;

export const AddNewWordValidator = ss.omit(WordsValidator, [
  'WoID',
  'WoTodayScore',
  'WoTomorrowScore',
  'WoRandom',
  'WoTextLC',
]);
export type AddNewWordType = typeof AddNewWordValidator.TYPE;

export const AddNewTextValidator = ss.omit(TextsValidatorNoId, [
  'TxAnnotatedText',
]);
export type AddNewTextType = typeof AddNewTextValidator.TYPE;

export const AddNewLanguageValidator = ss.omit(LanguageValidatorNoId, []);
export type AddNewLanguageType = typeof AddNewLanguageValidator.TYPE;

// TODO tsoa to generate openapi from these schemas?
