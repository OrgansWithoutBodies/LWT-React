import { IDValOf, Language, LanguagesID, Persistable } from "lwt-schemas";
import * as sql from "sqlite";
import {
  dbLoc,
  tableIDLookup,
  tbpref,
} from "./electron-sqlite/electron-sqlite-backend.plugin.main";
const { Database } = require("sqlite3");

/**
 *
 * @param lgID
 */
export function countTextsForLanguage(lgID: LanguagesID) {
  `select count(TxID) as value from ${tbpref}texts where TxLgID=${lgID}`;
}
/**
 *
 * @param lgID
 */
export function countArchivedTextsForLanguage(lgID: LanguagesID) {
  `select count(AtID) as value from ${tbpref}archivedtexts where AtLgID=${lgID}`;
}
/**
 *
 * @param lgID
 */
export function countWordsForLanguage(lgID: LanguagesID) {
  `select count(WoID) as value from ${tbpref}words where WoLgID=${lgID}`;
}
/**
 *
 * @param tableName
 * @param columnKeys
 */
export async function getEntries(tableName: string, columnKeys: string[]) {
  return await sql
    .open({
      filename: dbLoc,
      driver: Database,
    })
    .then(async (db) => {
      const res = await db.all<
        Pick<Language, "LgID" | "LgName" | "LgExportTemplate">[]
      >(
        `SELECT ${columnKeys.join(",")} FROM ${tbpref}${tableName};`
        // TODO ORDER BY LgName
      );
      return res;
    });
}
/**
 *
 * @param tableName
 * @param deleteID
 */
export async function deleteEntry<TTable extends keyof typeof tableIDLookup>(
  tableName: TTable,
  deleteID: IDValOf<TTable>
) {
  console.log("TEST123-delete", tableName, deleteID);
  return await sql
    .open({
      filename: dbLoc,
      driver: Database,
    })
    .then(async (db) => {
      if (tableIDLookup[tableName] === null) {
        return;
      }
      await db.exec(`DELETE FROM ${tbpref}${tableName};`);
      // return res;
    });
}

export async function emptyDB() {
  return await sql
    .open({
      filename: dbLoc,
      driver: Database,
    })
    .then(async (db) => {
      await db.exec(
        Object.keys(Persistable)
          .filter((val) => val !== "settings")
          .map((val) => `DELETE FROM ${tbpref}${val};`)
          .join("\n")
      );
    });
}
/**
 *
 * @param tableName
 * @param updateVal
 */
export async function updateEntry(
  tableName: keyof typeof tableIDLookup,
  updateVal: Record<string, string>
) {
  const tableID = tableIDLookup[tableName];
  return await sql
    .open({
      filename: dbLoc,
      driver: Database,
    })
    .then(async (db) => {
      if (tableIDLookup[tableName] === null) {
        return;
      }
      const sqlStr = `UPDATE ${tbpref}${tableName} SET ${Object.keys(updateVal)
        .filter((val) => val !== tableID)
        .map((key) => `${key} = ${updateVal[key]}`)} WHERE ${tableID} == '${
        updateVal[tableID!]
      }';`;
      console.log(sqlStr);
      await db.exec(sqlStr);
    });
}
