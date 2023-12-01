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
      releaseDate: 'א_0';
    };

export type TAppContext = AppVersion & {
  dbBackend: 'SQLite' | 'MySQL' | 'Postgres';
  dbVersion: string;

  isMobile: boolean;
  styleVariant: StyleVariant;

  pluginsEnabled: boolean;

  persistMethod: PersistanceStrategy;

  restURL: string;
  server: string;
  serverVersion: string;

  frontend: 'React';
  frontendVersion: string;
  frontendSource: string;

  // TODO can get wizard data from google sheet
  wizardDataUri: string;
};
enum LWT_ENV_VARS {
  devMode = 'VITE_LWT_DEV_MODE',
  disablePlugins = 'VITE_LWT_DISABLE_PLUGINS',
  persistMethod = 'VITE_LWT_PERSIST',
  isMobile = 'VITE_LWT_MOBILE',
  // These should probably be dynamic variables?
  restURL = 'VITE_LWT_REST_URL',
  wizardURL = 'VITE_LWT_WIZARD_URL',
}

function GetPersistFromEnv() {
  switch (import.meta.env[LWT_ENV_VARS.persistMethod]) {
    case 'REST':
      return PersistanceStrategy.RestAPI;
    case 'LOCALSTORAGE':
      return PersistanceStrategy.LocalStorage;
    case 'SQLITE':
      return PersistanceStrategy.ElectronSqlite;
    default:
      return PersistanceStrategy.ElectronSqlite;
    // throw new Error('INVALID PERSISTANCE STRATEGY');
  }
}
function GetPluginsEnabledFromEnv() {
  console.log('TEST123-disabled', import.meta.env);
  if (import.meta.env[LWT_ENV_VARS.disablePlugins] === 'true') {
    return false;
  }
  return true;
}
export const AppVariables: TAppContext = {
  versionNumber: 'LEGACY-0.0.0',
  releaseDate: 'November 31 2023',
  // Prob dont need to be an env var
  styleVariant: 'dark',

  pluginsEnabled: GetPluginsEnabledFromEnv(),

  isMobile: false,
  persistMethod: GetPersistFromEnv(),

  dbBackend: 'SQLite',
  dbVersion: '1.0.0',

  restURL: 'TODO',

  server: 'NOSERVER',
  serverVersion: '1.0.0',

  frontend: 'React',
  frontendVersion: '17.0.2',
  frontendSource: 'http://github.com',

  wizardDataUri: '',
} as const;

// Server requirements: persist data, REST-compliant w openapi schema, backup/restore from backup, tableSize endpoint,parse sentences?
