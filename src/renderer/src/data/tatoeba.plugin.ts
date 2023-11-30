import * as ss from 'superstruct';
import { TatoebaOpenAPIWrapper, ThreeLetterString } from '../pages/TatoebaAPI';

export const TatoebaPlugin = {
  validators: {
    languages: {
      LgTatoebaKey: ss.optional(ss.string()),
    },
  } as const,
  service: {
    getTatoebaSentence: async (langKey: ThreeLetterString, word: string) => {
      const TatoebaAPI = new TatoebaOpenAPIWrapper();
      const tatoebaData = await TatoebaAPI.getPath('/unstable/sentences', {
        lang: langKey,
        q: word,
      });
      console.log('TATOEBA', tatoebaData.data);
    },
  },
};
