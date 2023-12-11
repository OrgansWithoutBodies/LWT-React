import { InputHTMLAttributes } from 'react';
import { TRefMap } from '../forms/Forms';
import { AppVariables } from '../meta';
import { VariantMap } from '../styles';
import { RequiredLineButton } from '../ui-kit/Icon';

/**
 *
 */
export function FormInput<
  TKey extends string,
  TData extends Record<TKey, any>
>({
  // TODO onChange
  // TODO partial input & make sure key matches partial
  entryKey,
  refMap,
  defaultEntry,
  fixedEntry,
  formErrors,
  errorName,
  isRequired = false,
  ...nativeProps
}: Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'defaultValue' | 'ref' | 'name'
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
}) {
  // TODO dynamically add constraint to validator here? or just hardcode
  // const { maxLength } = nativeProps;
  if (fixedEntry && defaultEntry) {
    throw new Error("Can't have fixed and default set!");
  }
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
  );
}
/**
 *
 */
export function FormLineError<TKey extends string>({
  errorName,
  entryKey,
  formError,
}: {
  errorName: string | undefined;
  entryKey: TKey;
  formError: string;
}) {
  const firstBreak = formError.indexOf('--');

  return (
    <>
      {
        <span
          style={{
            color: VariantMap[AppVariables.styleVariant].highlightColor1,
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: '90%',
          }}
        >
          Error in {errorName || entryKey}: {formError.slice(firstBreak + 3)}
        </span>
      }
    </>
  );
}
