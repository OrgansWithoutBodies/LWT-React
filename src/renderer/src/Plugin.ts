import { Struct } from 'superstruct';
import { Persistable } from '../../shared/Persistable';
import type { TRefMap } from './forms/Forms';
import { FormInputComponent } from './hooks/useFormInput';
import { InternalPaths } from './hooks/useInternalNav';
import { GenericTranslationAPI } from './plugins/deepl.plugin';
import type { EntryRowType } from './ui-kit/EntryRow';

export type EntryRowComponent = (args: {
  refMap: TRefMap<string>;
  Component: FormInputComponent;
}) => JSX.Element;

// TODO make literals pass through
// TODO less adhoc

export type Plugin<
  TValidatorKeys extends string = string,
  TSource extends string = string,
  TTarget extends string = string,
  TPaths extends string = string
> = {
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
  api?: GenericTranslationAPI<TSource, TTarget>;
  importMethods?: Record<string, (...args: any[]) => Promise<unknown>>;

  landingPageLinks?: Readonly<
    ({ link: TPaths | InternalPaths; label: string } | null)[]
  >;
};
