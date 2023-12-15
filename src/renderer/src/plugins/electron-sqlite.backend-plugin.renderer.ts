import { Persistable } from '../../../shared/Persistable';
import { PersistenceHandles } from '../persist/PersistedValueGetter.types';

export const BackendPlugin: PersistenceHandles = {
  getAsync: async (key) => {
    const val = await window.api.sql.get(key);
    return val;
    // return window.api.sql.
    // return [];
  },
  get: (key) => {
    console.log('GETTING', key);
    return [];
  },
  // set: () => {},
  insert: async (key, val) => {
    if (Object.keys(Persistable).includes(key)) {
      return await window.api.sql.insert(key, val);
    }
    // TODO uncomment when more stable
    // throw new Error(`Unimplemented! ${key}`);
  },
  update: (key, val) => {
    if (Object.keys(Persistable).includes(key)) {
      return window.api.sql.update(key, val);
    }
    // TODO uncomment when more stable
    // throw new Error(`Unimplemented! ${key}`);
  },
  delete: (key, deleteID) => {
    if (Object.keys(Persistable).includes(key)) {
      return window.api.sql.delete(key, deleteID);
    }
    // TODO uncomment when more stable
    // throw new Error(`Unimplemented! ${key}`);
  },
  empty: () => window.api.sql.empty(),
  //   }
  // },
};
