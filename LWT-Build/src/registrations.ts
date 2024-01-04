import {
  LWTContainer,
  PersistanceStrategy,
  PersistanceStrategyToken,
} from "lwt-persist";
import { localStoragePersistanceStrategy } from "lwt-persist/local-storage";
import { AppVariables } from "./meta";

switch (AppVariables.persistMethod) {
  // case PersistanceStrategy.ElectronSqlite:
  //   console.log("TEST123 REGISTERING SQLITE");
  //   LWTContainer.register(PersistanceStrategyToken, {
  //     useValue: electronSqlitePersistanceStrategy,
  //   });
  case PersistanceStrategy.LocalStorage:
    console.log("TEST123 REGISTERING LOCALSTORAGE");
    LWTContainer.register(PersistanceStrategyToken, {
      useValue: localStoragePersistanceStrategy,
    });
}
console.log("TEST123 REGISTERING");
// Server requirements: persist data, REST-compliant w openapi schema, backup/restore from backup, tableSize endpoint,parse sentences?
