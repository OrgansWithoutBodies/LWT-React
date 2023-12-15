import path from 'path';
import * as sql from 'sqlite';
import { LanguagesID } from '../renderer/src/data/validators';
import {
  PersistedValueEmptyer,
  PersistedValueGetter,
  PersistedValueInserter,
  PersistedValueSetter,
} from '../renderer/src/persist/PersistedValueGetter.types';
import { Language } from '../renderer/src/utils/parseMySqlDump';
import { Persistable } from '../shared/Persistable';

const { Database, OPEN_CREATE } = require('sqlite3');

// https://github.com/nylas/electron-RxDB
// https://chamaradodandeniya.wordpress.com/2020/02/02/how-to-create-cross-platform-desktop-app-using-electron-react-and-sqllite/
// https://www.freecodecamp.org/news/creating-an-electron-app-using-angular-and-sqlite3-24ca7d892810/
const dbLoc = path.join(__dirname, '..', '..', 'lwt.db');

type PersistenceStrategyPlugin = {
  get: PersistedValueGetter;
  set: PersistedValueSetter;
  // TODO be able to just insert?
  insert?: PersistedValueInserter;
  update?: PersistedValueInserter;
  delete?: PersistedValueInserter;
  empty?: PersistedValueEmptyer;
};
const tbpref = '';

/**
 *
 * @param entry
 * @param tableKey
 */
function insertEntry(entry: object | object[], tableKey: string) {
  const safeEntries: object[] = tableKey in entry ? [entry] : entry;
  const safeSingleEntry = safeEntries[0];
  // TODO finish multiple
  const entryKeys = Object.keys(safeSingleEntry).filter(
    (val) => safeSingleEntry[val] !== undefined
  );
  const insertQuery = `INSERT INTO 
  ${tbpref}${tableKey}(
    ${entryKeys.join(', ')}
    ) 
    values(
    ${entryKeys.map((val) => `$${val}`).join(', ')}
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
              console.log('TEST123-entrykey', key, entry[key]);
              return [`$${key}`, safeSingleEntry[key]];
            })
          ),
          () => {}
        )
        // TODO
        .catch((err) => console.log('ERR', err))
        .then((val) => console.log('TEST123-SUCCESS-INSERT', val));
    });
}

/**
 *
 * @param lgID
 */
function countTextsForLanguage(lgID: LanguagesID) {
  `select count(TxID) as value from ${tbpref}texts where TxLgID=${lgID}`;
}
/**
 *
 * @param lgID
 */
function countArchivedTextsForLanguage(lgID: LanguagesID) {
  `select count(AtID) as value from ${tbpref}archivedtexts where AtLgID=${lgID}`;
}
/**
 *
 * @param lgID
 */
function countWordsForLanguage(lgID: LanguagesID) {
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
        Pick<Language, 'LgID' | 'LgName' | 'LgExportTemplate'>[]
      >(
        `SELECT ${columnKeys.join(',')} FROM ${tbpref}${tableName};`
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
export async function deleteEntry(tableName: string, deleteID: number) {
  console.log('TEST123-delete', tableName, deleteID);
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
          .filter((val) => val !== 'settings')
          .map((val) => `DELETE FROM ${tbpref}${val};`)
          .join('\n')
      );
    });
}
/**
 *
 * @param tableName
 * @param updateVal
 */
export async function updateEntry(
  tableName: string,
  updateVal: Record<string, string>
) {
  console.log('TEST123-update', tableName, updateVal);
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
        updateVal[tableID]
      }';`;
      console.log(sqlStr);
      await db.exec(sqlStr);
      // return res;
    });
}
export const BackendPlugin: PersistenceStrategyPlugin = {
  get: (key) => {
    if (isValidKey(key)) {
      return getEntries(key, ['*']);
    }

    throw new Error(`Unimplemented! ${key}`);
  },
  init: async () => {
    await initDB();
  },
  update: (key, newEntry) => {
    console.log('TEST123-backendupdate');
    if (isValidKey(key)) {
      return updateEntry(key, newEntry);
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
      return insertEntry(val, key);
    }

    throw new Error(`Unimplemented! ${key}`);
  },
};

const tableIDLookup = {
  languages: 'LgID',
  texts: 'TxID',
  words: 'WoID',
  // TODO non primary key
  wordtags: null,
  archivedtexts: 'AtID',
  archtexttags: 'AgAtID',
  tags: 'TgID',
  tags2: 'T2ID',
  settings: 'StKey',
  textitems: 'TiID',
  texttags: null,
} as const;
/**
 *
 * @param key
 */
function isValidKey(key: string) {
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
      console.log('MAINTHREAD', db);
      await Promise.all(creationStrings.map((create) => db.exec(create)));
    });
}
