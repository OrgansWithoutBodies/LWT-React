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
      frontendVersion: VersionNumber;
      releaseDate: `${FullMonthName} ${number} ${number}`;
    }
  | {
      frontendVersion: 'NEXT';
      releaseDate: 'א_0';
    };

export type TAppContext = AppVersion & {
  dbBackend: 'SQLite' | 'MySQL' | 'Postgres';
  dbVersion: string;

  electronBuildTarget: 'Linux' | 'Windows' | 'OSX' | 'Android' | 'iOS';
  isMobile: boolean;
  styleVariant: StyleVariant;

  pluginsEnabled: boolean;

  persistMethod: PersistanceStrategy;

  devMode: boolean;

  restURL: string;
  server: string;
  serverVersion: string;

  frontend: 'LWT-React';
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
  if (import.meta.env[LWT_ENV_VARS.disablePlugins] === 'true') {
    return false;
  }
  return true;
}
function GetDevModeFromEnv() {
  if (import.meta.env[LWT_ENV_VARS.devMode] === 'true') {
    return true;
  }
  return false;
}
export const AppVariables: TAppContext = {
  versionNumber: 'LEGACY-0.0.0-PRE-ALPHA-DEMO',
  releaseDate: 'November 30 2023',
  // Prob dont need to be an env var
  styleVariant: 'dark',

  pluginsEnabled: GetPluginsEnabledFromEnv(),

  isMobile: false,
  persistMethod: GetPersistFromEnv(),

  dbBackend: 'SQLite',
  dbVersion: '1.0.0',

  restURL: 'TODO',

  devMode: GetDevModeFromEnv(),

  server: 'NOSERVER',
  serverVersion: '1.0.0',

  frontend: 'LWT-React',
  frontendVersion: 'LEGACY-0.0.0-PRE-ALPHA-DEMO',
  frontendSource: 'https://github.com/OrgansWithoutBodies/LWT-React',

  wizardDataUri: '',
} as const;
console.log('STARTING APP WITH VARIABLES: ', AppVariables);
// Server requirements: persist data, REST-compliant w openapi schema, backup/restore from backup, tableSize endpoint,parse sentences?
