import { Plugin } from "lwt-plugins";

export const AnkiPlugin: Plugin = {
  importMethods: { ankiImport: async () => {} },
  pluginName: "anki",
};
