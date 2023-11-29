"use strict";
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("api", {
  sql: {
    insert: async (key, dataEntry) => {
      if (key === "languages") {
        return await ipcRenderer.invoke(`backend-plugin-insert`, {
          key,
          dataEntry
        });
      }
    },
    // set:async()=>{},
    get: async (key, data) => {
      if ([
        "languages",
        "texts",
        "words",
        "wordtags",
        "archivedtexts",
        "archtexttags",
        "tags",
        "tags2",
        "textitems",
        "texttags"
      ].includes(key)) {
        return await ipcRenderer.invoke(`backend-plugin-get`, { key, data });
      }
    }
  }
});
