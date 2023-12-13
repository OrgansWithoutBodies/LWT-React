import * as ss from 'superstruct';
import { Plugin } from '../Plugin';
import { TatoebaOpenAPIWrapper } from '../pages/TatoebaAPI';
import { TatoebaEntryLine } from './Tatoeba.plugin.entryline';

export const TatoebaPlugin: Plugin = {
  validators: {
    languages: {
      LgTatoebaKey: ss.optional(ss.string()),
    },
  } as const,
  entryLines: {
    languages: {
      LgTatoebaKey: {
        headerText: 'Tatoeba Key',
        child: TatoebaEntryLine,
        // entryKey: 'LgTatoebaKey',
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
