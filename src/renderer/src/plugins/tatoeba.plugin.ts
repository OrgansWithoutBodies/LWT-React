import * as ss from 'superstruct';
import { Plugin } from '../Plugin';
import { TatoebaEntryLine } from './Tatoeba.plugin.entryline';
import { TatoebaOpenAPIWrapper } from './TatoebaAPI';

export const TatoebaPlugin: Plugin = {
  validators: {
    languages: {
      LgTatoebaKey: ss.optional(ss.string()),
    },
  } as const,
  entryLines: {
    languages: {
      // TODO sourceKey vs targetKey
      LgTatoebaKey: {
        headerText: 'Tatoeba Key',
        child: TatoebaEntryLine,
      },
    },
  },
  api: {
    // https://tatoeba.org/en/sentences/search?query=test standard page
    apiHomePage: 'https://tatoeba.org',
    apiName: 'Tatoeba Sentence Service',
    getTranslations: async ({ sourceKey, word }) => {
      const TatoebaAPI = new TatoebaOpenAPIWrapper();
      const tatoebaData = await TatoebaAPI.getPath('/unstable/sentences', {
        lang: sourceKey,
        q: word,
      });
      return tatoebaData.data.data.map((val) => val.text);
    },
  },
  pluginName: 'tatoeba',
};
