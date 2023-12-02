import { useMemo } from 'react';
import { TRefMap } from '../forms/Forms';
import { FormInput } from '../pages/buildFormInput';

/**
 *
 * @param refMap
 * @param entry
 */
export function useFormInput<
  TKey extends string,
  TData extends Record<TKey, any>
>(
  refMap: TRefMap<TData>,
  entry?: Partial<TData>,
  formErrors?: {
    [key in TKey]?: string;
  }
) {
  // TODO useFormContext? for shared without build
  // memo to avoid retriggering

  const ReturnedComponent = useMemo(
    () =>
      function (
        args: Omit<
          Parameters<typeof FormInput>[0],
          'refMap' | 'defaultEntry' | 'fixedEntry'
        > & {
          fixed?: boolean;
          default?: boolean;
        }
      ) {
        return (
          <FormInput
            {...args}
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
  const onSubmit = (preValidateMap, onValidatedData) =>
    CheckAndSubmit(
      refMap,
      preValidateMap,
      validator,
      onValidatedData,
      null,
      (errors) => {
        console.log('TEST123-terms', errors);
        setFormErrors(errors);
      }
    );
  return ReturnedComponent;
  // return { Input: ReturnedComponent, onSubmit };
}
