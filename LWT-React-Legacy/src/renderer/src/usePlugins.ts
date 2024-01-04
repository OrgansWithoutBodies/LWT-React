import { LWTContainer } from 'lwt-persist';
import { Plugin, PluginsListToken } from 'lwt-plugins';

const PLUGINS = LWTContainer.resolve<Plugin[]>(PluginsListToken);
export const usePlugins = () => PLUGINS;
