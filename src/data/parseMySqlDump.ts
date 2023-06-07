// INSERT INTO {} VALUES(...{}...)
import * as ss from 'superstruct';

import {
  ArchivedTextsValidator,
  ArchTextTagsValidator,
  LanguagesValidator,
  LanguagesValidatorNoId,
  SentencesValidator,
  SettingsValidator,
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

export type ArchivedTexts = typeof ArchivedTextsValidator.TYPE;
export type ArchTextTags = typeof ArchTextTagsValidator.TYPE;

export type Languages = typeof LanguagesValidator.TYPE;
export type LanguageNoId = typeof LanguagesValidatorNoId.TYPE;

export type Sentences = typeof SentencesValidator.TYPE;
export type Settings = typeof SettingsValidator.TYPE;
export type Tags = typeof TagsValidator.TYPE;
export type Tags2 = typeof Tags2Validator.TYPE;
export type TextItems = typeof TextItemsValidator.TYPE;

export type Texts = typeof TextsValidator.TYPE;
export type TextsNoId = typeof TextsValidatorNoId.TYPE;

export type TextTags = typeof TextTagsValidator.TYPE;

export type Words = typeof WordsValidator.TYPE;
export type WordsNoId = typeof WordsValidatorNoId.TYPE;

export type WordTags = typeof WordTagsValidator.TYPE;

export const AddNewWordValidator = ss.omit(WordsValidatorNoId, [
  'WoStatusChanged',
  'WoTodayScore',
  'WoTomorrowScore',
  'WoRandom',
]);
export type AddNewWordType = typeof AddNewWordValidator.TYPE;

export const AddNewTextValidator = ss.omit(TextsValidatorNoId, [
  'TxAnnotatedText',
]);
export type AddNewTextType = typeof AddNewTextValidator.TYPE;

export const AddNewLanguageValidator = ss.omit(LanguagesValidatorNoId, []);
export type AddNewLanguageType = typeof AddNewLanguageValidator.TYPE;

// TODO tsoa to generate openapi from these schemas?
