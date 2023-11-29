"use strict";
var Persistable = /* @__PURE__ */ ((Persistable2) => {
  Persistable2["languages"] = "languages";
  Persistable2["texts"] = "texts";
  Persistable2["words"] = "words";
  Persistable2["wordtags"] = "wordtags";
  Persistable2["archivedtexts"] = "archivedtexts";
  Persistable2["archtexttags"] = "archtexttags";
  Persistable2["tags"] = "tags";
  Persistable2["tags2"] = "tags2";
  Persistable2["textitems"] = "textitems";
  Persistable2["texttags"] = "texttags";
  Persistable2["settings"] = "settings";
  return Persistable2;
})(Persistable || {});
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("api", {
  sql: {
    insert: async (key, dataEntry) => {
      if (isValidKey(key)) {
        return await ipcRenderer.invoke(`backend-plugin-insert`, {
          key,
          dataEntry
        });
      }
    },
    update: async (key, dataEntry) => {
      if (isValidKey(key)) {
        return await ipcRenderer.invoke(`backend-plugin-update`, {
          key,
          dataEntry
        });
      }
    },
    delete: async (key, deleteId) => {
      if (isValidKey(key)) {
        console.log("TEST123-deleting", deleteId);
        return await ipcRenderer.invoke(`backend-plugin-delete`, {
          key,
          deleteId
        });
      }
    },
    // set:async()=>{},
    get: async (key, data) => {
      if (isValidKey(key)) {
        return await ipcRenderer.invoke(`backend-plugin-get`, { key, data });
      }
    },
    empty: async () => {
      return await ipcRenderer.invoke(`backend-plugin-empty`);
    }
  }
});
function isValidKey(key) {
  return Object.keys(Persistable).includes(key);
}
