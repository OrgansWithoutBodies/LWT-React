import { Struct } from 'superstruct';
import { Persistable } from '../../shared/Persistable';
import { TatoebaPlugin } from './data/tatoeba.plugin';

// TODO make literals pass through
type Plugin<TValidatorKeys extends string = string> = {
  validators: {
    [key in Persistable]?: Record<TValidatorKeys, Struct<any>>;
  };
  service: Record<string, (...args: any[]) => Promise<unknown>>;
  /**
   * templates: {
   *    R
   * };
   */
};

export const PLUGINS: Readonly<Plugin[]> = [
  //
  TatoebaPlugin,
  //   OtherPlugin,
] as const;
