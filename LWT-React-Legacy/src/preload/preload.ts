import { LWTData, Persistable } from 'lwt-schemas';

const { contextBridge, ipcRenderer } = require('electron');

const sqlAPI = {
  sql: {
    insert: async (key: Persistable, dataEntry: LWTData[typeof key]) => {
      if (isValidKey(key)) {
        return await ipcRenderer.invoke('backend-plugin-insert', {
          key,
          dataEntry,
        });
      }
    },
    update: async (key: Persistable, dataEntry: LWTData[typeof key]) => {
      if (isValidKey(key)) {
        return await ipcRenderer.invoke('backend-plugin-update', {
          key,
          dataEntry,
        });
      }
    },
    delete: async (key: Persistable, deleteID: LWTData[typeof key]) => {
      if (isValidKey(key)) {
        console.log('TEST123-deleting', deleteID);
        return await ipcRenderer.invoke('backend-plugin-delete', {
          key,
          deleteID,
        });
      }
    },
    // set:async()=>{},
    get: async (key: Persistable, data: LWTData[typeof key]) => {
      if (isValidKey(key)) {
        return await ipcRenderer.invoke('backend-plugin-get', { key, data });
      }
    },
    empty: async () => await ipcRenderer.invoke('backend-plugin-empty'),
  },
};
declare global {
  interface Window {
    api: typeof sqlAPI;
  }
}
contextBridge.exposeInMainWorld('api', sqlAPI);
/**
 *
 * @param key
 */
function isValidKey(key: Persistable) {
  return Object.values(Persistable).includes(key);
}
