import type { TRefMap } from 'lwt-forms';
import type { EntryRowType } from 'lwt-schemas';
import { DataQuery, LiteralQueryState } from 'lwt-state';
import { FormInputComponent, InternalPaths } from 'lwt-ui-kit';
import { Struct } from 'superstruct';
import { Persistable } from '../../shared/Persistable';
import { GenericRetrievalAPI } from './plugins/deepl.plugin';

export type EntryRowComponent = (args: {
  refMap: TRefMap<string>;
  Component: FormInputComponent;
}) => JSX.Element;

// TODO make literals pass through
// TODO less adhoc
type PluginHandler = 'mediaPlayerTimeUpdate';
export type Plugin<
  TValidatorKeys extends string = string,
  TSource extends string = string,
  TTarget extends string = string,
  TPaths extends string = string
> = {
  pluginHandlers?: Record<
    PluginHandler,
    (
      val: any,
      context: {
        query: LiteralQueryState<
          DataQuery,
          (keyof DataQuery & TValidatorKeys)[]
        >;
      }
    ) => void
  >;
  pluginName: string;
  validators?: {
    [key in Persistable]?: Record<TValidatorKeys, Struct<any>>;
  };
  entryLines?: {
    [key in Persistable]?: Record<
      TValidatorKeys,
      EntryRowType & { child: EntryRowComponent }
    >;
  };
  routes?: Record<TPaths, () => JSX.Element>;
  service?: Record<string, (...args: any[]) => Promise<unknown>>;
  api?: GenericRetrievalAPI<TSource, TTarget>;
  icons?: string[];
  importMethods?: Record<string, (...args: any[]) => Promise<unknown>>;

  landingPageLinks?: Readonly<
    ({ link: TPaths | InternalPaths; label: string } | null)[]
  >;
};
