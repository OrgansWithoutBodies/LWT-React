import { LWTContainer } from "lwt-persist";
import { registeredPlugins } from "./plugins";

export * from "./GenericRetrievalAPI";
export * from "./Plugin";

export const PluginsListToken = Symbol("Plugins");

LWTContainer.register(PluginsListToken, {
  useValue: registeredPlugins,
});
