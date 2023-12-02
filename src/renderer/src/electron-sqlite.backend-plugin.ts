import * as sql from 'sqlite';
import sqlite3 from 'sqlite3';
import {
  PersistedValueGetter,
  PersistedValueSetter,
} from './data/PersistedValueGetter';
import { Language } from './data/parseMySqlDump';

type PersistenceStrategyPlugin = {
  get: PersistedValueGetter;
  // TODO be able to just insert?
  set: PersistedValueSetter;
};
const tbpref = '';
const fileName = './db.sql';

function updateLanguage() {}

function getLanguages() {
  sql
    .open({
      filename: '/tmp/database.db',
      driver: sqlite3.Database,
    })
    .then(async (db) => {
      const res = await db.get<
        Pick<Language, 'LgID' | 'LgName' | 'LgExportTemplate'>
      >(
        `select LgID, LgName, LgExportTemplate from ${tbpref}languages order by LgName`
      );
      console.log(res);
    });
}
export const BackendPlugin: PersistenceStrategyPlugin = {
  get: (val) => {
    switch (val) {
      case 'languages':
        getLanguages();
    }
  },
  set: () => {},
};
