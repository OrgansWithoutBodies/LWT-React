import { InputHTMLAttributes } from 'react';
import { useData } from '../data/useAkita';
import { WordsId } from '../data/validators';
import { TRefMap } from '../forms/Forms';
import { AppVariables } from '../meta';
import { VariantMap } from '../styles';

export function WordTagsSelectDropdown({ wordID }: { wordID: WordsId }) {
  const [{ wordtags, tags }] = useData(['wordtags', 'tags']);
  return (
    <ul id="termtags">
      {wordtags
        .filter(({ WtWoID }) => WtWoID === wordID)
        .map((tag) => (
          <li>
            {
              // TODO better lookup very inefficient
              tags.find(({ TgID }) => tag.WtTgID === TgID)!.TgText
            }
          </li>
        ))}
    </ul>
  );
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
  formErrors,
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
  formErrors?: {
    [key in TKey]?: string;
  };
}) {
  // TODO dynamically add constraint to validator here? or just hardcode
  // const { maxLength } = nativeProps;
  if (fixedEntry && defaultEntry) {
    throw new Error("Can't have fixed and default set!");
  }
  console.log('TEST123-errors', formErrors);

  return (
    <>
      <input
        defaultValue={
          defaultEntry === undefined ? undefined : defaultEntry[entryKey]
        }
        value={fixedEntry === undefined ? undefined : fixedEntry[entryKey]}
        name={entryKey}
        ref={refMap[entryKey]}
        {...nativeProps}
      />
      <br />
      {formErrors && (
        <span
          style={{
            color: VariantMap[AppVariables.styleVariant].highlightColor1,
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: '90%',
          }}
        >
          {formErrors[entryKey]}
        </span>
      )}
    </>
  );
}
