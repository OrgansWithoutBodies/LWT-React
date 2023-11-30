import { useMemo } from 'react';
import { TRefMap } from './Forms';
import { FormInput } from './buildFormInput';

export function useFormInput<
  TKey extends string,
  TData extends Record<TKey, any>
>(refMap: TRefMap<TData>, entry?: Partial<TData>) {
  // TODO useFormContext? for shared without build
  // memo to avoid retriggering
  const ReturnedComponent = useMemo(
    () =>
      (
        args: Omit<
          Parameters<typeof FormInput>[0],
          'refMap' | 'defaultEntry' | 'fixedEntry'
        > & { fixed?: boolean; default?: boolean }
      ) =>
        (
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
        ),
    Object.values(entry || {})
  );
  return ReturnedComponent;
}
