import { LWTReactInfo } from './LWTReactInfo';
import { Plugin } from './Plugin';
import { TatoebaPlugin } from './data/tatoeba.plugin';
import { AppVariables } from './meta';
import { LoremIpsum } from './ui-kit/LoremIpsum';

const plugins: Plugin<any, any, any>[] = [
  //
  // ChineseMeasureWordColumnPlugin,
  // UserPlugin,
  // AnkiSyncServer,
  TatoebaPlugin,
  //   OtherPlugin,
  // DeeplPlugin,
  {
    pluginName: 'lwt-react-info',
    landingPageLinks: [
      null,
      { link: '/lwt_react_info', label: 'LWT React Info' },
    ],
    routes: { '/lwt_react_info': LWTReactInfo },
  },
  {
    pluginName: 'demo-lorem-ipsum',
    landingPageLinks: [
      null,
      { link: '/lorem_ipsum', label: 'Demo Plugin Route' },
    ],
    routes: { '/lorem_ipsum': () => LoremIpsum(100) },
  },
] as const;

export const PLUGINS: Readonly<Plugin[]> = AppVariables.pluginsEnabled
  ? plugins
  : [];
