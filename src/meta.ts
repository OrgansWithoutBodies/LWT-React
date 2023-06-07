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

  dbBackend: 'SQLite' | 'MySQL' | 'Postgres';
  dbVersion: string;

  server: string;
  serverVersion: string;

  frontend: string;
  frontendVersion: string;
  frontendSource: string;

  // TODO sync up text to audio
  // TODO download audio from youtube
  // TODO can get wizard data from google sheet
  wizardDataUri: string;
};
export const AppVariables: TAppContext = {
  versionNumber: 'LEGACY-0.0.0',
  releaseDate: 'January 99 2023',
  styleVariant: 'dark',

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
