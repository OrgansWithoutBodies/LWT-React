import * as ss from 'superstruct';
import { Plugin } from '../Plugin';

import {
  DeeplOpenAPIWrapper,
  DeeplSourceKeys,
  DeeplTargetKeys,
} from '../pages/DeeplAPI';

export interface APITranslateTerm<
  TSource extends string,
  TTarget extends string
> {
  sourceKey: TSource;
  targetKey: TTarget;
  word: string;
}
export interface GenericTranslationAPI<
  TSource extends string,
  TTarget extends string
> {
  apiName: string;
  apiHomePage: string;
  getTranslations: (
    args: APITranslateTerm<TSource, TTarget>
  ) => Promise<string[]>;
  // TODO?
  // getSentences: (
  //   args: APITranslateTerm<TSource, TTarget>
  // ) => Promise<string[]>;
}
export const DeeplPlugin: Plugin<string, DeeplSourceKeys, DeeplTargetKeys> = {
  pluginName: 'deepl',
  validators: {
    languages: {
      LgDeeplKey: ss.optional(ss.string()),
    },
    settings: {
      'plugin-deepl:auth-key': ss.optional(ss.string()),
    },
  } as const,

  // api?: {
  api: {
    apiName: 'DeepL',
    apiHomePage: 'https://deepl.com',
    getTranslations: async ({ targetKey, sourceKey, word }) => {
      // TODO auth
      const DeeplAPI = new DeeplOpenAPIWrapper();
      const DeeplData = await DeeplAPI.postPath('/translate', {
        text: [word],
        target_lang: targetKey,
        source_lang: sourceKey,
      });
      console.log('Deepl', DeeplData.data);
      if (!DeeplData.data.translations) {
        // TODO
        return ['FAILURE'];
      }
      return DeeplData.data.translations.map((trans) => trans.text!);
    },
  },
};
