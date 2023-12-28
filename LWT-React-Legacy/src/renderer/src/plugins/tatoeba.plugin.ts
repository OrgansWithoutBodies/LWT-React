import * as ss from 'superstruct';
import { Plugin } from '../Plugin';
import { TatoebaEntryLine } from './Tatoeba.plugin.entryline';
import { TatoebaOpenAPIWrapper } from './TatoebaAPI';

export const TatoebaPlugin: Plugin = {
  validators: {
    languages: {
      LgTatoebaSourceKey: ss.optional(ss.string()),
      LgTatoebaTargetKey: ss.optional(ss.string()),
    },
  } as const,
  entryLines: {
    languages: {
      // TODO sourceKey vs targetKey
      LgTatoebaSourceKey: {
        headerText: 'Tatoeba Key (L2)',
        child: TatoebaEntryLine,
      },
      LgTatoebaTargetKey: {
        headerText: 'Tatoeba Key (L1)',
        child: TatoebaEntryLine,
      },
    },
  },
  service: {
    // private TatoebaAPI: TatoebaOpenAPIWrapper;
    // during construction:
    // this.TatoebaAPI = new TatoebaOpenAPIWrapper();

    getTatoebaSentence: async (langKey: ThreeLetterString, word: string) => {
      const tatoebaData = await this.TatoebaAPI.getPath('/unstable/sentences', {
        lang: langKey,
        q: word,
      });
      console.log('TATOEBA', tatoebaData.data);
    },
  },
  api: {
    // https://tatoeba.org/en/sentences/search?query=test standard page
    apiHomePage: 'https://tatoeba.org',
    apiName: 'Tatoeba Sentence Service',
    whatsRetrievedFromAPISingular: 'sentence',
    getFromAPI: async ({ sourceKey, word }) => {
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
