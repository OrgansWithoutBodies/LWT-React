import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { TRefMap } from "./Forms";

export type FormTextAreaProps<
  TKey extends string,
  TData extends Record<TKey, any>
> = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "defaultValue" | "ref" | "name"
> & {
  entryKey: TKey;
  // TODO need refmap if fixed entry?
  refMap: TRefMap<TData>;
  isRequired?: boolean;
  defaultEntry?: Partial<TData>;
  fixedEntry?: Partial<TData>;
  errorName?: string;
  formErrors?: {
    [key in TKey]?: string;
  };
};

export type FormInputParams<
  TKey extends string,
  TData extends Record<TKey, any>
> = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "defaultValue" | "ref" | "name"
> & {
  entryKey: TKey;
  // TODO need refmap if fixed entry?
  refMap: TRefMap<TData>;
  isRequired?: boolean;
  defaultEntry?: TData;
  fixedEntry?: TData;
  errorName?: string;
  formErrors?: {
    [key in TKey]?: string;
  };
};
export type FormInputComponentParams<
  TKey extends string,
  TData extends Record<TKey, any>
> = Omit<
  FormInputParams<TKey, TData>,
  "refMap" | "defaultEntry" | "fixedEntry" | "type"
> & {
  type?: string;
  fixed?: boolean;
  default?: boolean;
};
export type FormTextAreaComponentParams<
  TKey extends string,
  TData extends Record<TKey, any>
> = Omit<
  FormTextAreaProps<TKey, TData>,
  "refMap" | "defaultEntry" | "fixedEntry"
> & {
  fixed?: boolean;
  default?: boolean;
};
export type FormInputComponent<
  TKey extends string = string,
  TData extends Record<TKey, any> = Record<TKey, any>
> = (args: FormInputComponentParams<TKey, TData>) => JSX.Element;
