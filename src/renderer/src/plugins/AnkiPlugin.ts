import { Plugin } from '../Plugin';

export const AnkiPlugin: Plugin = {
  importMethods: { ankiImport: async () => {} },
  pluginName: 'anki',
};
