import { Persistable } from '../shared/Persistable';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  sql: {
    insert: async (key, dataEntry) => {
      if (isValidKey(key)) {
        return await ipcRenderer.invoke('backend-plugin-insert', {
          key,
          dataEntry,
        });
      }
    },
    update: async (key, dataEntry) => {
      if (isValidKey(key)) {
        return await ipcRenderer.invoke('backend-plugin-update', {
          key,
          dataEntry,
        });
      }
    },
    delete: async (key, deleteID) => {
      if (isValidKey(key)) {
        console.log('TEST123-deleting', deleteID);
        return await ipcRenderer.invoke('backend-plugin-delete', {
          key,
          deleteID,
        });
      }
    },
    // set:async()=>{},
    get: async (key, data) => {
      if (isValidKey(key)) {
        return await ipcRenderer.invoke('backend-plugin-get', { key, data });
      }
    },
    empty: async () => await ipcRenderer.invoke('backend-plugin-empty'),
  },
});
/**
 *
 * @param key
 */
function isValidKey(key: string) {
  return Object.keys(Persistable).includes(key);
}
