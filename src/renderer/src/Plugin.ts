import { Struct } from 'superstruct';
import { Persistable } from '../../shared/Persistable';
import { GenericTranslationAPI } from './data/deepl.plugin';
import { TRefMap } from './forms/Forms';
import { FormInputComponent } from './hooks/useFormInput';
import { InternalPaths } from './hooks/useInternalNav';
import type { EntryRowType } from './pages/NewLanguage';

export type EntryRowComponent = (args: {
  refMap: TRefMap<string>;
  Component: FormInputComponent;
}) => JSX.Element;

// TODO make literals pass through
// TODO less adhoc

export type Plugin<
  TValidatorKeys extends string = string,
  TSource extends string = string,
  TTarget extends string = string
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
  routes?: Record<InternalPaths, () => JSX.Element>;
  service?: Record<string, (...args: any[]) => Promise<unknown>>;
  api?: GenericTranslationAPI<TSource, TTarget>;
  importMethods?: Record<string, (...args: any[]) => Promise<unknown>>;

  landingPageLinks?: ({ link: InternalPaths; label: string } | null)[];
};