import path from 'path';
import * as sql from 'sqlite';
import {
  PersistedValueGetter,
  PersistedValueInserter,
  PersistedValueSetter,
} from '../renderer/src/data/PersistedValueGetter';
import { Languages } from '../renderer/src/data/parseMySqlDump';
import { LanguagesId } from '../renderer/src/data/validators';
const { Database, OPEN_CREATE } = require('sqlite3');
// TODO what a name lol

// https://github.com/nylas/electron-RxDB
// https://chamaradodandeniya.wordpress.com/2020/02/02/how-to-create-cross-platform-desktop-app-using-electron-react-and-sqllite/
// https://www.freecodecamp.org/news/creating-an-electron-app-using-angular-and-sqlite3-24ca7d892810/
const dbLoc = path.join(__dirname, '..', '..', 'lwt.db');

type PersistenceStrategyPlugin = {
  get: PersistedValueGetter;
  set: PersistedValueSetter;
  // TODO be able to just insert?
  insert?: PersistedValueInserter;
};
const tbpref = '';
const fileName = './db.sql';
export function insertLanguage(
  language: Pick<
    Languages,
    | 'LgName'
    | 'LgDict1URI'
    | 'LgDict2URI'
    | 'LgGoogleTranslateURI'
    | 'LgExportTemplate'
    | 'LgTextSize'
    | 'LgCharacterSubstitutions'
    | 'LgRegexpSplitSentences'
    | 'LgExceptionsSplitSentences'
    | 'LgRegexpWordCharacters'
    | 'LgRemoveSpaces'
    | 'LgSplitEachChar'
    | 'LgRightToLeft'
  >
) {
  insertEntry(language, 'languages');
}
function insertEntry(entry: object, tableKey: string) {
  const insertQuery = `INSERT INTO 
  ${tbpref}${tableKey}(
    ${Object.keys(entry).join(', ')}
    ) 
    values(
    ${Object.keys(entry)
      .map((val) => `$${val}`)
      .join(', ')}
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
            Object.keys(entry).map((key) => [`$${key}`, entry[key]])
          ),
          (val) => console.log('TEST123-SUCCESS-INSERT', val)
        )
        .catch((err) => console.log(err))
        .then((val) => console.log('TEST123-SUCCESS-INSERT', val));
    });
  console.log(
    insertQuery,
    Object.fromEntries(
      Object.keys(entry).map((key) => [
        `$${key}`,
        entry[key] === undefined ? null : entry[key],
      ])
    )
  );
}

function countTextsForLanguage(lgID: LanguagesId) {
  `select count(TxID) as value from ${tbpref}texts where TxLgID=${lgID}`;
}
function countArchivedTextsForLanguage(lgID: LanguagesId) {
  `select count(AtID) as value from ${tbpref}archivedtexts where AtLgID=${lgID}`;
}
function countWordsForLanguage(lgID: LanguagesId) {
  `select count(WoID) as value from ${tbpref}words where WoLgID=${lgID}`;
}
export async function getLanguages() {
  return await sql
    .open({
      filename: dbLoc,
      driver: Database,
    })
    .then(async (db) => {
      await db.exec(
        `CREATE TABLE IF NOT EXISTS ${tbpref}languages (
          LgID INTEGER PRIMARY KEY AUTOINCREMENT,
          LgName varchar(40) UNIQUE NOT NULL,
          LgDict1URI varchar(200) NOT NULL,
          LgDict2URI varchar(200),
          LgGoogleTranslateURI varchar(200),
          LgExportTemplate varchar(1000),
          LgTextSize int(5)  NOT NULL DEFAULT 100,
          LgCharacterSubstitutions varchar(500) NOT NULL,
          LgRegexpSplitSentences varchar(500) NOT NULL,
          LgExceptionsSplitSentences varchar(500) NOT NULL,
          LgRegexpWordCharacters varchar(500) NOT NULL,
          LgRemoveSpaces int(1)  NOT NULL DEFAULT 0,
          LgSplitEachChar int(1)  NOT NULL DEFAULT 0,
          LgRightToLeft int(1)  NOT NULL DEFAULT 0 );`
      );
      const res = await db.all<
        Pick<Languages, 'LgID' | 'LgName' | 'LgExportTemplate'>[]
      >(
        `SELECT LgID, LgName, LgExportTemplate FROM ${tbpref}languages ORDER BY LgName;`
      );
      return res;
    });
}
export const BackendPlugin: PersistenceStrategyPlugin = {
  get: (key) => {
    switch (key) {
      case 'languages':
        return getLanguages();
      default:
        return [];
      // throw new Error(`Unimplemented! ${key}`);
    }
  },
  init: async () => {
    await initDB();
  },
  set: () => {},
  insert: (key, val) => {
    if (
      [
        'languages',
        'texts',
        'words',
        'wordtags',
        'archivedtexts',
        'archtexttags',
        'tags',
        'tags2',
        'textitems',
        'texttags',
      ].includes(key)
    ) {
      return insertEntry(val, key);
    }

    throw new Error(`Unimplemented! ${key}`);
  },
};

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
