import { AxiosResponse } from "axios";
import * as ss from "superstruct";
import { Plugin } from "../..";
import { TatoebaEntryLine } from "./Tatoeba.plugin.entryline";
import { TatoebaOpenAPIWrapper } from "./TatoebaAPI";

export const TatoebaPlugin = {
  validators: {
    languages: {
      LgTatoebaSourceKey: ss.optional(ss.string()),
      LgTatoebaTargetKey: ss.optional(ss.string()),
    },
  } as const,
  entryLines: {
    languages: {
      LgTatoebaSourceKey: {
        // TODO i18n text
        headerText: "Tatoeba Key (L2)" as any,
        child: TatoebaEntryLine,
      },
      LgTatoebaTargetKey: {
        headerText: "Tatoeba Key (L1)" as any,
        child: TatoebaEntryLine,
      },
    },
  },
  service: {
    // private TatoebaAPI: TatoebaOpenAPIWrapper;

    getTatoebaSentence: async (langKey: string, word: string) => {
      // TODO during construction:
      const TatoebaAPI = new TatoebaOpenAPIWrapper();
      const tatoebaData = await TatoebaAPI.getPath("/unstable/sentences", {
        lang: langKey,
        q: word,
      });
      console.log("TATOEBA", tatoebaData.data);
    },
  },
  api: {
    // https://tatoeba.org/en/sentences/search?query=test standard page
    apiHomePage: "https://tatoeba.org",
    apiName: "Tatoeba Sentence Service",
    whatsRetrievedFromAPISingular: "sentence",
    getFromAPI: async ({ sourceKey, word }) => {
      const TatoebaAPI = new TatoebaOpenAPIWrapper();
      const tatoebaData = (await TatoebaAPI.getPath("/unstable/sentences", {
        lang: sourceKey,
        q: word,
        // Tatoeba openapi spec not correct - TODO maybe contribute fix
      })) as any as AxiosResponse<{ data: { text: string }[] }>;
      return tatoebaData.data.data.map((val) => val.text);
    },
  },
  pluginName: "tatoeba",
} as Plugin;
