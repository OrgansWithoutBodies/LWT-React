import { useMemo, useState } from 'react';
import * as ss from 'superstruct';
import { CheckAndSubmit, RefMap, TRefMap } from '../forms/Forms';
import { FormInput, FormLineError, FormTextArea } from '../pages/IO/FormInput';
import { RequiredLineButton } from '../ui-kit/Icon';
import { LanguageDropdown } from '../ui-kit/LanguageDropdown';

export type FormInputComponentParams = Omit<
  Parameters<typeof FormInput>[0],
  'refMap' | 'defaultEntry' | 'fixedEntry' | 'type'
> & {
  type?: string;
  fixed?: boolean;
  default?: boolean;
};
export type FormTextAreaComponentParams = Omit<
  Parameters<typeof FormTextArea>[0],
  'refMap' | 'defaultEntry' | 'fixedEntry'
> & {
  fixed?: boolean;
  default?: boolean;
};
export type FormInputComponent = (
  args: FormInputComponentParams
) => JSX.Element;
/**
 *
 * @param refMap
 * @param entry
 */
export function useFormInput<
  TKey extends string,
  TData extends Record<TKey, any>
>({
  validator,
  entry,
}: // formErrors,
{
  validator: ss.Struct<{ [key in keyof TData]: any }>;
  entry?: Partial<TData>;
  // formErrors?: {
  //   [key in TKey]?: string;
  // };
}) {
  // TODO useFormContext? for shared without build
  // memo to avoid retriggering
  const refMap = RefMap(validator);

  const [formErrors, setFormErrors] = useState<{
    [key in keyof typeof validator.TYPE]?: string;
  }>({});

  const TextArea = useMemo(
    () =>
      function (args: FormTextAreaComponentParams) {
        return (
          <FormTextArea
            {...args}
            type={args.type === undefined ? 'text' : args.type}
            refMap={refMap}
            formErrors={formErrors}
            fixedEntry={
              entry && args.fixed && entry[args.entryKey] ? entry : undefined
            }
            defaultEntry={
              entry && args.default && entry[args.entryKey] ? entry : undefined
            }
          />
        );
      },
    [
      ...Object.values(entry || {}),
      // TODO right now this deletes data on error
      formErrors,
      // ...Object.values(formErrors ? formErrors : {}),
    ]
  );
  const ReturnedComponent = useMemo(
    () =>
      function (args: FormInputComponentParams) {
        return (
          <FormInput
            {...args}
            type={args.type === undefined ? 'text' : args.type}
            refMap={refMap}
            formErrors={formErrors}
            fixedEntry={
              entry && args.fixed && entry[args.entryKey] ? entry : undefined
            }
            defaultEntry={
              entry && args.default && entry[args.entryKey] ? entry : undefined
            }
          />
        );
      },
    [
      ...Object.values(entry || {}),
      // TODO right now this deletes data on error
      formErrors,
      // ...Object.values(formErrors ? formErrors : {}),
    ]
  );
  const onSubmit = (
    preValidateMap: {
      [key in keyof TData]?: (
        value: string,
        refMap: TRefMap<TData>
      ) => any | null;
    },
    onValidatedData: (value: { [key in keyof TData]: any }) => void,
    omit: keyof TData | null = null
  ) =>
    CheckAndSubmit(
      refMap,
      preValidateMap,
      validator,
      onValidatedData,
      omit,
      (errors) => {
        setFormErrors(errors);
      }
    );
  const LanguageSelectInput = useMemo(
    () =>
      ({
        entryKey,
        errorName,
        isRequired = false,
      }: {
        entryKey: TKey;
        isRequired?: boolean;
        errorName?: string;
      }) =>
        (
          <>
            <LanguageDropdown dropdownRef={refMap[entryKey]} />
            {isRequired && <RequiredLineButton />}
            <br />
            {formErrors && formErrors[entryKey] && (
              <FormLineError<TKey>
                errorName={errorName}
                entryKey={entryKey}
                formError={formErrors[entryKey]}
              />
            )}
          </>
        ),
    [...Object.values(entry || {}), formErrors]
  );
  console.log(formErrors);
  return {
    Input: ReturnedComponent,
    TextArea,
    onSubmit,
    refMap,
    formErrors,

    LanguageSelectInput,
  };
}
