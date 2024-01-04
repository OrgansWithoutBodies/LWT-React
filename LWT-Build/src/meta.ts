import { PersistanceStrategy } from "lwt-persist";
import { StyleVariant } from "lwt-style";

type VersionNumber =
  | `${number}.${number}.${number}${`-${string}` | ""}`
  | `LEGACY-${number}.${number}.${number}${`-${string}` | ""}`;
type FullMonthName =
  | "January"
  | "February"
  | "March"
  | "April"
  | "May"
  | "June"
  | "July"
  | "August"
  | "September"
  | "October"
  | "November"
  | "December";
type AppVersion = {
  frontendVersion: VersionNumber;
  releaseDate: `${FullMonthName} ${number} ${number}`;
};

export interface TAppContext extends AppVersion {
  dbBackend: "SQLite" | "MySQL" | "Postgres";
  dbVersion: string;

  electronBuildTarget: "Linux" | "Windows" | "OSX" | "Android" | "iOS";
  isMobile: boolean;
  styleVariant: StyleVariant;

  pluginsEnabled: boolean;

  persistMethod: PersistanceStrategy;

  devMode: boolean;

  restURL: string;
  server: string;
  serverVersion: string;

  frontend: "LWT-React";
  frontendSource: string;

  // TODO can get wizard data from google sheet
  wizardDataCsvUri: string;
  i18nCsvURI: string;
}
enum LWT_ENV_VARS {
  devMode = "VITE_LWT_DEV_MODE",
  disablePlugins = "VITE_LWT_DISABLE_PLUGINS",
  persistMethod = "VITE_LWT_PERSIST",
  isMobile = "VITE_LWT_MOBILE",
  // These should probably be dynamic variables?
  restURL = "VITE_LWT_REST_URL",
  wizardDataCsvUri = "VITE_LWT_WIZARD_URL",
  i18nCsvURI = "VITE_LWT_I18N_URL",
}

function GetPersistFromEnv() {
  switch (import.meta.env[LWT_ENV_VARS.persistMethod]) {
    case "REST":
      return PersistanceStrategy.RestAPI;
    case "LOCALSTORAGE":
      return PersistanceStrategy.LocalStorage;
    case "SQLITE":
      return PersistanceStrategy.ElectronSqlite;
    default:
      return PersistanceStrategy.ElectronSqlite;
    // throw new Error('INVALID PERSISTANCE STRATEGY');
  }
}

function GetPluginsEnabledFromEnv() {
  if (import.meta.env[LWT_ENV_VARS.disablePlugins] === "true") {
    return false;
  }
  return true;
}

function GetDevModeFromEnv() {
  if (import.meta.env[LWT_ENV_VARS.devMode] === "true") {
    return true;
  }
  return false;
}
/**
 *
 * @param val
 */
function GetFromEnv(val: LWT_ENV_VARS) {
  return import.meta.env[val];
}
export const AppVariables: TAppContext = {
  releaseDate: "November 30 2023",
  // Prob dont need to be an env var
  styleVariant: "dark",

  pluginsEnabled: GetPluginsEnabledFromEnv(),

  isMobile: false,
  persistMethod: GetPersistFromEnv(),

  dbBackend: "SQLite",
  dbVersion: "1.0.0",

  electronBuildTarget: "Linux",

  devMode: GetDevModeFromEnv(),

  server: "NOSERVER",
  serverVersion: "1.0.0",

  frontend: "LWT-React",
  frontendVersion: "LEGACY-0.0.0-PRE-ALPHA-DEMO",
  frontendSource: "https://github.com/OrgansWithoutBodies/LWT-React",

  restURL: GetFromEnv(LWT_ENV_VARS.restURL),
  // TODO automatically get rest of vars from env
  i18nCsvURI: GetFromEnv(LWT_ENV_VARS.i18nCsvURI),
  wizardDataCsvUri: GetFromEnv(LWT_ENV_VARS.wizardDataCsvUri),
} as const;
console.log("STARTING APP WITH VARIABLES: ", AppVariables);

import { LWTContainer, PersistanceStrategyToken } from "lwt-persist";

switch (AppVariables.persistMethod) {
  case PersistanceStrategy.ElectronSqlite:
    console.log("TEST123 REGISTERING SQLITE");
    const { electronSqlitePersistanceStrategy } = await import(
      "lwt-persist/electron-sqlite"
    );
    LWTContainer.register(PersistanceStrategyToken, {
      useValue: electronSqlitePersistanceStrategy,
    });
    break;
  case PersistanceStrategy.LocalStorage:
    const { localStoragePersistanceStrategy } = await import(
      "lwt-persist/local-storage"
    );
    console.log(
      "TEST123 REGISTERING LOCALSTORAGE",
      localStoragePersistanceStrategy
    );

    LWTContainer.register(PersistanceStrategyToken, {
      useValue: localStoragePersistanceStrategy,
    });
    break;
  case PersistanceStrategy.RestAPI:
    throw new Error("Unimplemented Persistance Strategy!");
}
// Server requirements: persist data, REST-compliant w openapi schema, backup/restore from backup, tableSize endpoint,parse sentences?
