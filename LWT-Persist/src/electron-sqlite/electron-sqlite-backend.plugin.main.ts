import { PersistenceHandles } from "lwt-persist";
import path from "path";
import * as sql from "sqlite";
import { deleteEntry, emptyDB, getEntries, updateEntry } from "../sqlHelpers";

const { Database } = require("sqlite3");

// https://github.com/nylas/electron-RxDB
// https://chamaradodandeniya.wordpress.com/2020/02/02/how-to-create-cross-platform-desktop-app-using-electron-react-and-sqllite/
// https://www.freecodecamp.org/news/creating-an-electron-app-using-angular-and-sqlite3-24ca7d892810/
export const dbLoc = path.join(__dirname, "..", "..", "lwt.db");

export const tbpref = "";

const isSingleObject = <TObj extends object>(
  val: TObj | TObj[],
  tableKey: string
): val is TObj => tableKey in val;
/**
 *
 * @param entry
 * @param tableKey
 */
function insertEntry<TKeys extends string, TObj extends Record<TKeys, any>>(
  entry: TObj | TObj[],
  tableKey: TKeys
) {
  const safeEntries = isSingleObject(entry, tableKey) ? [entry] : entry;
  const safeSingleEntry = safeEntries[0];
  // TODO finish multiple
  const entryKeys = Object.keys(safeSingleEntry).filter(
    // TODO no cast
    (val) => safeSingleEntry[val as TKeys] !== undefined
  );
  const insertQuery = `INSERT INTO 
  ${tbpref}${tableKey}(
    ${entryKeys.join(", ")}
    ) 
    values(
    ${entryKeys.map((val) => `$${val}`).join(", ")}
    		);`;
  sql
    .open({
      filename: dbLoc,
      driver: Database,
    })
    .then(async (db) => {
      await db
        .run(
          insertQuery,
          Object.fromEntries(
            entryKeys.map((key) => {
              // console.log("TEST123-entrykey", key, entry[key]);
              // TODO no cast
              return [`$${key}`, safeSingleEntry[key as TKeys]];
            })
          ),
          () => {}
        )
        // TODO
        .catch((err) => console.log("ERR", err))
        .then((val) => console.log("TEST123-SUCCESS-INSERT", val));
    });
}

export const BackendPlugin: PersistenceHandles = {
  get: (key) => {
    if (isValidKey(key)) {
      // TODO no any
      return getEntries(key, ["*"]) as any;
    }

    throw new Error(`Unimplemented! ${key}`);
  },
  init: async () => {
    return await initDB();
  },
  update: (key, newEntry) => {
    console.log("TEST123-backendupdate");
    if (isValidKey(key)) {
      // TODO no any
      return updateEntry(key as any, newEntry) as any;
    }
  },
  delete: (key, delID) => {
    if (isValidKey(key)) {
      return deleteEntry(key, delID);
    }
  },
  set: () => {},
  empty: () => emptyDB(),
  insert: (key, val) => {
    if (isValidKey(key)) {
      // TODO no any
      return insertEntry(val, key) as any;
    }

    throw new Error(`Unimplemented! ${key}`);
  },
};

// TODO dedupe with IDMap
export const tableIDLookup = {
  languages: "LgID",
  texts: "TxID",
  words: "WoID",
  // TODO non primary key
  wordtags: null,
  archivedtexts: "AtID",
  archtexttags: "AgAtID",
  tags: "TgID",
  tags2: "T2ID",
  settings: "StKey",
  textitems: "TiID",
  texttags: null,
} as const;
/**
 *
 * @param key
 */
function isValidKey(key: string): key is keyof typeof tableIDLookup {
  return Object.keys(tableIDLookup).includes(key);
}

export async function initDB() {
  const creationStrings = [
    `CREATE TABLE IF NOT EXISTS archivedtexts (   
       AtID INTEGER PRIMARY KEY AUTOINCREMENT,
       AtLgID int(11) NOT NULL,
       AtTitle varchar(200) NOT NULL,
       AtText text NOT NULL,
       AtAnnotatedText longtext NOT NULL,
       AtAudioURI varchar(200),
       AtSourceURI varchar(1000) );`,
    //  AUTOINCREMENT=2
    `CREATE TABLE IF NOT EXISTS archtexttags (   
       AgAtID int(11) NOT NULL,
       AgT2ID int(11) NOT NULL,
       PRIMARY KEY (AgAtID,AgT2ID));`,

    //  KEY AgAtID (AgAtID),
    //  KEY AgT2ID (AgT2ID)
    `CREATE TABLE IF NOT EXISTS languages (   
       LgID INTEGER PRIMARY KEY AUTOINCREMENT,
       LgName varchar(40) NOT NULL UNIQUE,
       LgDict1URI varchar(200) NOT NULL,
       LgDict2URI varchar(200),
       LgGoogleTranslateURI varchar(200),
       LgExportTemplate varchar(1000),
       LgTextSize int(5) NOT NULL DEFAULT '100',
       LgCharacterSubstitutions varchar(500) NOT NULL,
       LgRegexpSplitSentences varchar(500) NOT NULL,
       LgExceptionsSplitSentences varchar(500) NOT NULL,
       LgRegexpWordCharacters varchar(500) NOT NULL,
       LgRemoveSpaces int(1) NOT NULL DEFAULT '0',
       LgSplitEachChar int(1) NOT NULL DEFAULT '0',
       LgRightToLeft int(1) NOT NULL DEFAULT '0');`,
    //  AUTOINCREMENT=9
    `CREATE TABLE IF NOT EXISTS sentences (   
       SeID INTEGER PRIMARY KEY AUTOINCREMENT,
       SeLgID int(11) NOT NULL,
       SeTxID int(11) NOT NULL,
       SeOrder int(11) NOT NULL,
       SeText text);`,
    //  KEY SeLgID (SeLgID),
    //  KEY SeTxID (SeTxID),
    //  KEY SeOrder (SeOrder)
    //  AUTOINCREMENT=357
    `CREATE TABLE IF NOT EXISTS settings (   
       StKey varchar(40) PRIMARY KEY  NOT NULL,
       StValue varchar(40)
       );`,
    `CREATE TABLE IF NOT EXISTS tags (   
       TgID INTEGER PRIMARY KEY AUTOINCREMENT,
       TgText varchar(20) COLLATE BINARY NOT NULL UNIQUE,
       TgComment varchar(200) NOT NULL DEFAULT ''
       );`,
    //  AUTOINCREMENT=29
    `CREATE TABLE IF NOT EXISTS tags2 (   
       T2ID INTEGER PRIMARY KEY AUTOINCREMENT,
       T2Text varchar(20) COLLATE BINARY NOT NULL UNIQUE,
       T2Comment varchar(200) NOT NULL DEFAULT ''
       );`,
    //  AUTOINCREMENT=10
    `CREATE TABLE IF NOT EXISTS textitems (   
       TiID INTEGER PRIMARY KEY AUTOINCREMENT,
       TiLgID int(11) NOT NULL,
       TiTxID int(11) NOT NULL,
       TiSeID int(11) NOT NULL,
       TiOrder int(11) NOT NULL,
       TiWordCount int(1) NOT NULL,
       TiText varchar(250) NOT NULL,
       TiTextLC varchar(250) COLLATE BINARY NOT NULL,
       TiIsNotWord tinyint(1) NOT NULL
       );`,
    //  KEY TiLgID (TiLgID),
    //  KEY TiTxID (TiTxID),
    //  KEY TiSeID (TiSeID),
    //  KEY TiOrder (TiOrder),
    //  KEY TiTextLC (TiTextLC),
    //  KEY TiIsNotWord (TiIsNotWord)
    //  AUTOINCREMENT=12761
    `CREATE TABLE IF NOT EXISTS texts (   
       TxID INTEGER PRIMARY KEY AUTOINCREMENT,
       TxLgID int(11) NOT NULL,
       TxTitle varchar(200) NOT NULL,
       TxText text NOT NULL,
       TxAnnotatedText longtext NOT NULL,
       TxAudioURI varchar(200),
       TxSourceURI varchar(1000)
       );`,
    //  KEY TxLgID (TxLgID),
    //  AUTOINCREMENT=10
    `CREATE TABLE IF NOT EXISTS texttags (   
       TtTxID int(11) NOT NULL,
       TtT2ID int(11) NOT NULL,
       PRIMARY KEY (TtTxID,TtT2ID)
       );`,
    //  KEY TtTxID (TtTxID),
    //  KEY TtT2ID (TtT2ID)
    `CREATE TABLE IF NOT EXISTS words (   
       WoID INTEGER PRIMARY KEY AUTOINCREMENT,
       WoLgID int(11) NOT NULL,
       WoText varchar(250) NOT NULL,
       WoTextLC varchar(250) COLLATE BINARY NOT NULL,
       WoStatus tinyint(4) NOT NULL,
       WoTranslation varchar(500) NOT NULL DEFAULT '*',
       WoRomanization varchar(100),
       WoSentence varchar(1000),
       WoCreated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
       WoStatusChanged timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
       WoTodayScore double NOT NULL DEFAULT '0',
       WoTomorrowScore double NOT NULL DEFAULT '0',
       WoRandom double NOT NULL DEFAULT '0'
       );`,
    //  UNIQUE KEY WoLgIDTextLC (WoLgID,WoTextLC)
    //  KEY WoLgID (WoLgID),
    //  KEY WoStatus (WoStatus),
    //  KEY WoTextLC (WoTextLC),
    //  KEY WoTranslation (WoTranslation(333)),
    //  KEY WoCreated (WoCreated),
    //  KEY WoStatusChanged (WoStatusChanged),
    //  KEY WoTodayScore (WoTodayScore),
    //  KEY WoTomorrowScore (WoTomorrowScore),
    //  KEY WoRandom (WoRandom)
    //  AUTOINCREMENT=221
    `CREATE TABLE IF NOT EXISTS wordtags (   
       WtWoID int(11) NOT NULL,
       WtTgID int(11) NOT NULL
       );`,
    //  PRIMARY KEY (WtWoID,WtTgID)
    //  KEY WtTgID (WtTgID),
    //  KEY WtWoID (WtWoID)
  ];
  await sql
    .open({
      filename: dbLoc,
      driver: Database,
    })
    .then(async (db) => {
      console.log("MAINTHREAD", db);
      await Promise.all(creationStrings.map((create) => db.exec(create)));
      return Promise.resolve(true);
    })
    .catch(() => Promise.resolve(false));
  return Promise.resolve(false);
}
