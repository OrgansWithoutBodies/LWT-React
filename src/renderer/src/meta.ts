import { PersistanceStrategy } from './data/PersistedValueGetter';
import { StyleVariant } from './styles';

type VersionNumber =
  | `${number}.${number}.${number}`
  | `LEGACY-${number}.${number}.${number}`;
type FullMonthName =
  | 'January'
  | 'February'
  | 'March'
  | 'April'
  | 'May'
  | 'June'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December';
type AppVersion =
  | {
      versionNumber: VersionNumber;
      releaseDate: `${FullMonthName} ${number} ${number}`;
    }
  | {
      versionNumber: 'NEXT';
      releaseDate: `א_0`;
    };

export type TAppContext = AppVersion & {
  styleVariant: StyleVariant;

  persistMethod: PersistanceStrategy;
  isMobile: boolean;

  dbBackend: 'SQLite' | 'MySQL' | 'Postgres';
  dbVersion: string;

  server: string;
  serverVersion: string;

  frontend: 'React';
  frontendVersion: string;
  frontendSource: string;

  // TODO can get wizard data from google sheet
  wizardDataUri: string;
};
export const AppVariables: TAppContext = {
  versionNumber: 'LEGACY-0.0.0',
  releaseDate: 'November 31 2023',
  styleVariant: 'dark',

  isMobile: false,
  persistMethod: PersistanceStrategy.LocalStorage,

  dbBackend: 'SQLite',
  dbVersion: '1.0.0',

  server: 'NOSERVER',
  serverVersion: '1.0.0',

  frontend: 'React',
  frontendVersion: '17.0.2',
  frontendSource: 'http://github.com',

  wizardDataUri: '',
} as const;

// Server requirements: persist data, REST-compliant w openapi schema, backup/restore from backup, tableSize endpoint,parse sentences?

// TODO have rust, django, maybe next server?
