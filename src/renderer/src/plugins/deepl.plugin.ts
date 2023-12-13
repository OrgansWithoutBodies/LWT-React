import * as ss from 'superstruct';
import { Plugin } from '../Plugin';

import {
  DeeplOpenAPIWrapper,
  DeeplSourceKeys,
  DeeplTargetKeys,
} from './DeeplAPI';
import {
  DeepLLanguageEntryLine,
  DeepLSettingEntryLine,
} from './deepl.plugin.entryline';

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
    args: APITranslateTerm<TSource, TTarget> & { apiKey?: string }
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
  entryLines: {
    settings: {
      'plugin-deepl:auth-key': {
        headerText: 'DeepL Auth\nKey',
        headerDir: 'center',
        child: DeepLSettingEntryLine,
      },
    },
    languages: {
      LgDeeplKey: {
        headerText: 'DeepL Key',
        child: DeepLLanguageEntryLine,
      },
    },
  },

  api: {
    apiName: 'DeepL',
    apiHomePage: 'https://deepl.com',
    getTranslations: async ({ targetKey, sourceKey, word, apiKey }) => {
      // TODO auth
      if (!apiKey) {
        throw new Error('DeepL API Needs an API Key!');
      }
      const DeeplAPI = new DeeplOpenAPIWrapper(apiKey);
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