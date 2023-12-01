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
>(refMap: TRefMap<TData>, entry?: Partial<TData>) {
  // TODO useFormContext? for shared without build
  // memo to avoid retriggering
  const ReturnedComponent = useMemo(
    () =>
      function (
        args: Omit<
          Parameters<typeof FormInput>[0],
          'refMap' | 'defaultEntry' | 'fixedEntry'
        > & { fixed?: boolean; default?: boolean }
      ) {
        return (
          <FormInput
            {...args}
            refMap={refMap}
            fixedEntry={
              entry && args.fixed && entry[args.entryKey] ? entry : undefined
            }
            defaultEntry={
              entry && args.default && entry[args.entryKey] ? entry : undefined
            }
          />
        );
      },
    Object.values(entry || {})
  );
  const SubmitComponent = useMemo(
    () =>
      function (
        args: Omit<
          Parameters<typeof FormInput>[0],
          'refMap' | 'defaultEntry' | 'fixedEntry'
        > & { fixed?: boolean; default?: boolean }
      ) {
        return (
          <input
            {...args}
            fixedEntry={
              entry && args.fixed && entry[args.entryKey] ? entry : undefined
            }
            defaultEntry={
              entry && args.default && entry[args.entryKey] ? entry : undefined
            }
          />
        );
      },
    Object.values(entry || {})
  );
  return ReturnedComponent;
  // return { Input: ReturnedComponent, Submit: SubmitComponent };
}
