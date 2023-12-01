import { Struct } from 'superstruct';
import { Persistable } from '../../shared/Persistable';
import { TatoebaPlugin } from './data/tatoeba.plugin';
import { AppVariables } from './meta';

// TODO make literals pass through
type Plugin<TValidatorKeys extends string = string> = {
  validators: {
    [key in Persistable]?: Record<TValidatorKeys, Struct<any>>;
  };
  service: Record<string, (...args: any[]) => Promise<unknown>>;
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
  TatoebaPlugin,
  //   OtherPlugin,
] as const;

export const PLUGINS: Readonly<Plugin[]> = AppVariables.pluginsEnabled
  ? plugins
  : [];
