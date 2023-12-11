import { Struct } from 'superstruct';
import { Persistable } from '../../shared/Persistable';
import { LWTReactInfo } from './LWTReactInfo';
import { InternalPaths } from './hooks/useInternalNav';
import { AppVariables } from './meta';
import { LoremIpsum } from './ui-kit/LoremIpsum';

// TODO make literals pass through
export type Plugin<TValidatorKeys extends string = string> = {
  validators?: {
    [key in Persistable]?: Record<TValidatorKeys, Struct<any>>;
  };
  routes?: Record<InternalPaths, () => JSX.Element>;
  service?: Record<string, (...args: any[]) => Promise<unknown>>;
  importMethods?: Record<string, (...args: any[]) => Promise<unknown>>;
  landingPageLinks?: ({ link: InternalPaths; label: string } | null)[];
  /**
   * templates: {
   * TODO maybe have list of template slots predefined?
   *    R
   * };
   */

  // apis?
  // routes?
  // parsers?
};
const plugins = [
  //
  // ChineseMeasureWordColumnPlugin,
  // UserPlugin,
  // AnkiSyncServer,
  // TatoebaPlugin,
  //   OtherPlugin,
  {
    landingPageLinks: [
      null,
      { link: '/lwt_react_info', label: 'LWT React Info' },
    ],
    routes: { '/lwt_react_info': LWTReactInfo },
  },
  {
    landingPageLinks: [null, { link: '/test', label: 'Demo Plugin Route' }],
    routes: { '/test': () => LoremIpsum(100) },
  },
] as const;

export const PLUGINS: Readonly<Plugin[]> = AppVariables.pluginsEnabled
  ? plugins
  : [];
