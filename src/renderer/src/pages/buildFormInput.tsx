import { InputHTMLAttributes, useMemo } from 'react';
import { useData } from '../data/useAkita';
import { WordsId } from '../data/validators';
import { TRefMap } from './Forms';

export function WordTagsSelectDropdown({ wordID }: { wordID: WordsId }) {
  const [{ wordtags, tags }] = useData(['wordtags', 'tags']);
  return (
    <ul id="termtags">
      {wordtags
        .filter(({ WtWoID }) => {
          return WtWoID === wordID;
        })
        .map((tag) => {
          return (
            <li>
              {
                // TODO better lookup very inefficient
                tags.find(({ TgID }) => {
                  return tag.WtTgID === TgID;
                })!.TgText
              }
            </li>
          );
        })}
    </ul>
  );
}

export function buildFormInput<
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
      ) => {
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
  return ReturnedComponent;
}
export function FormInput<
  TKey extends string,
  TData extends Record<TKey, any>
>({
  // TODO nonoptional add dot
  // TODO errorlines
  // TODO onChange
  // TODO probably best to just pass validator in here & build refmap here
  // TODO data_info for more informative text in error fields
  // TODO partial input & make sure key matches partial
  entryKey,
  refMap,
  defaultEntry,
  fixedEntry,
  ...nativeProps
}: Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'defaultValue' | 'id' | 'ref' | 'name'
> & {
  entryKey: TKey;
  // TODO need refmap if fixed entry?
  refMap: TRefMap<TData>;
  defaultEntry?: TData;
  fixedEntry?: TData;
}) {
  // TODO dynamically add constraint to validator here? or just hardcode
  // const { maxLength } = nativeProps;
  if (fixedEntry && defaultEntry) {
    throw new Error("Can't have fixed and default set!");
  }
  return (
    <input
      defaultValue={
        defaultEntry === undefined ? undefined : defaultEntry[entryKey]
      }
      value={fixedEntry === undefined ? undefined : fixedEntry[entryKey]}
      name={entryKey}
      ref={refMap[entryKey]}
      {...nativeProps}
    />
  );
}
