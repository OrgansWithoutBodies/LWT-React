import {
  CheckAndSubmit,
  FormInputComponentParams,
  FormTextAreaComponentParams,
  RefMap,
  TRefMap,
} from "lwt-forms";
import { LanguageDropdown, RequiredLineButton } from "lwt-ui-kit";
import { useEffect, useMemo, useState } from "react";
import * as ss from "superstruct";
import { FormInput, FormLineError, FormTextArea } from "../FormInput";

/**
 *
 * @param refMap
 * @param entry
 */
export function useFormInput<
  TKey extends string,
  TData extends Record<TKey, unknown>
>({
  validator,
  entry,
}: // formErrors,
{
  validator: ss.Struct<{ [key in keyof TData]: TData[key] }>;
  entry?: Partial<TData>;
  // formErrors?: {
  //   [key in TKey]?: string;
  // };
}) {
  // TODO https://v5.reactrouter.com/web/example/preventing-transitions
  function askConfirmIfDirty(event: Event) {
    if (dirty) {
      event.preventDefault();
      return "** You have unsaved changes! **";
    }
  }

  const [dirty, setDirtyState] = useState(false);
  const setDirty = () => setDirtyState(true);
  useEffect(() => {
    window.addEventListener("beforeunload", askConfirmIfDirty);
    return () => {
      window.removeEventListener("beforeunload", askConfirmIfDirty);
    };
  }, [dirty]);

  // TODO useFormContext? for shared without build
  // memo to avoid retriggering
  const refMap = RefMap<TData>(validator, entry);

  const [formErrors, setFormErrors] = useState<{
    [key in keyof typeof validator.TYPE]?: string;
  }>({});

  const TextArea = useMemo(
    () =>
      function (args: FormTextAreaComponentParams<TKey, TData>) {
        return (
          <FormTextArea<TKey, TData>
            {...args}
            entryKey={args.entryKey}
            onChange={() => setDirty()}
            refMap={refMap}
            formErrors={formErrors}
            fixedEntry={
              entry && args.fixed && entry[args.entryKey] !== undefined
                ? entry
                : undefined
            }
            defaultEntry={
              entry && args.default && entry[args.entryKey] !== undefined
                ? entry
                : undefined
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
      function (args: FormInputComponentParams<TKey, TData>) {
        return (
          <FormInput
            {...args}
            onChange={() => setDirty()}
            type={args.type === undefined ? "text" : args.type}
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
    onValidatedData: (value: TData, refMap: TRefMap<TData>) => void,
    omit: keyof TData | null = null
  ) =>
    CheckAndSubmit<TData>(
      refMap,
      preValidateMap,
      validator,
      onValidatedData,
      omit,
      (errors) => {
        setFormErrors(errors);
      }
    );
  type LanguageSelectInputProps = {
    // entryKey: TData[TKey] extends LanguagesID ? TKey : never;
    entryKey: TKey;
    isRequired?: boolean;
    errorName?: string;
  };

  const LanguageSelectInput = useMemo(
    () =>
      ({ entryKey, errorName, isRequired = false }: LanguageSelectInputProps) =>
        (
          <>
            <LanguageDropdown
              // TODO infer tkey which has a value type of LanguageID
              defaultValue={entry ? (entry[entryKey] as any) : undefined}
              onChange={() => setDirty()}
              dropdownRef={refMap[entryKey]}
            />
            {isRequired && <RequiredLineButton />}
            <br />
            {formErrors && formErrors[entryKey] !== undefined && (
              <FormLineError<TKey>
                errorName={errorName}
                entryKey={entryKey}
                // TODO why !
                formError={formErrors[entryKey]!}
              />
            )}
          </>
        ),
    [...Object.values(entry || {}), formErrors]
  );
  // TODO return a standardized SubmitButton
  return {
    Input: ReturnedComponent,
    TextArea,
    onSubmit,
    refMap,
    formErrors,
    setDirty,
    LanguageSelectInput,
  };
}
