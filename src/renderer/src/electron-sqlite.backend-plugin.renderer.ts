import { Persistable } from './data/Persistable';
import {
  PersistedValueGetter,
  PersistedValueInserter,
  PersistedValueSetter,
} from './data/PersistedValueGetter';
// TODO what a name lol
type PersistenceStrategyPlugin = {
  get: PersistedValueGetter;
  set: PersistedValueSetter;
  // TODO be able to just insert?
  insert?: PersistedValueInserter;
};

export const BackendPlugin: PersistenceStrategyPlugin = {
  getAsync: async (key) => {
    if (key === 'activeLanguageId') {
      return null;
    }
    const val = await window.api.sql.get(key);
    return val;
    // return window.api.sql.
    // return [];
  },
  get: (key) => {
    if (key === 'activeLanguageId') {
      return null;
    }
    console.log('GETTING', key);
    return [];
  },
  set: async (key, val) => {
    const retVal = await window.api.sql.set(key, val);
  },
  // set: () => {},
  insert: async (key, val) => {
    if (Object.keys(Persistable).includes(key)) {
      return await window.api.sql.insert(key, val);
    }
    // case 'texts':
    //   return insertLanguage(val);
    // case 'words':
    //   return insertLanguage(val);
    // case 'wordtags':
    //   return insertLanguage(val);
    // case 'archivedtexts':
    //   return insertLanguage(val);
    // case 'archtexttags':
    //   return insertLanguage(val);
    // case 'tags':
    //   return insertLanguage(val);
    // case 'tags2':
    //   return insertLanguage(val);
    // case 'textitems':
    //   return insertLanguage(val);
    // case 'texttags':
    //   return insertLanguage(val);
    // throw new Error(`Unimplemented! ${key}`);
  },
  //   }
  // },
};
