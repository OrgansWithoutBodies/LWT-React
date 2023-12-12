import { useRef } from 'react';
import * as ss from 'superstruct';
import { ObjectSchema } from 'superstruct/dist/utils';

/**
 *
 */
export function Form<TSchema extends ObjectSchema>({
  validator,
  formData,
}: {
  validator: TSchema;
  formData: any;
}) {
  // TODO
  // for each member of formData, check against ss validator - if doesnt match raise flag on that part of schema.
  //   debounce input/allow to only check on submit
  validator;
}
// https://github.com/react-hook-form/react-hook-form/blob/master/src/useForm.ts
// export function useForm() {}
// something like this
// const {
//   register,
//   handleSubmit,
//   formState: { errors },
// } = useForm();

// return (
//   <form onSubmit={handleSubmit((data) => console.log(data))}>
//     <input {...register('firstName')} />
//     <input {...register('lastName', { required: true })} />
//     {errors.lastName && <p>Last name is required.</p>}
//     <input {...register('age', { pattern: /\d+/ })} />
//     {errors.age && <p>Please enter number for age.</p>}
//     <input type="submit" />
//   </form>
// );
export const identityMap = (val: string) => val;

export const parseNumMap = (value: string) => Number.parseInt(value, 10);
export const emptyToNullMap = (value: string) =>
  value === '' ? undefined : value;
export const binaryMap = (val: '0' | '1') => val === '0';

/**
 *
 * @param keyChanged
 * @param refMap
 * @param setFieldError
 * @param validator
 */
function CheckErrors<TForm extends {}>(
  keyChanged: keyof TForm,
  refMap: TRefMap<TForm>,
  setFieldError: (val: boolean) => void,
  validator: ss.Struct<Record<keyof TForm, any>>
) {
  const error = ss
    .pick(validator, [keyChanged])
    .validate({ [keyChanged]: refMap[keyChanged].current.value })[0];
  if (!error) {
    return setFieldError(false);
  }
  return setFieldError(true);
}
// HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

export type TRefMap<TForm> = Record<
  keyof TForm,
  React.MutableRefObject<any>
> & { clearAll: () => void };
/**
 *
 * @param validator
 */
export function RefMap<TForm>(
  validator: ss.Struct<{ [key in keyof TForm]: any }>
): TRefMap<TForm> {
  const values = Object.keys(validator.schema);
  const individualRefs = Object.fromEntries(
    values.map((key) => [
      key,
      useRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null>(
        null
      ),
    ])
  ) as TRefMap<TForm>;
  individualRefs.clearAll = () => {
    values.forEach((val) => (individualRefs[val].current.value = ''));
  };
  return individualRefs;
}
// TODO can pass in default values to reset to
/**
 *
 * @param refMap
 */
export function ResetForm<TForm>(refMap: TRefMap<TForm>) {
  Object.keys(refMap).forEach(
    (key) => (refMap[key as keyof TForm].current.value = '')
  );
}

/**
 *
 * @param refMap
 * @param preValidateMap
 * @param validator
 * @param takeValidatedObject
 * @param omit
 * @param onFormErrors
 */
export function CheckAndSubmit<TForm>(
  refMap: TRefMap<TForm>,
  preValidateMap: {
    [key in keyof TForm]?: (
      value: string,
      refMap: TRefMap<TForm>
    ) => any | null;
  },
  validator: ss.Struct<{ [key in keyof TForm]: any }>,
  takeValidatedObject: (value: { [key in keyof TForm]: any }) => void,
  omit: keyof TForm | null = null,
  onFormErrors: (errors: { [key in keyof TForm]?: string }) => void = () => {}
) {
  const values = Object.fromEntries(
    (Object.keys(refMap) as (keyof typeof refMap)[])
      .filter((val) => (omit === null || val !== omit) && val !== 'clearAll')
      .map((refKey) => [
        refKey,
        (preValidateMap[refKey] || identityMap)(
          refMap[refKey].current?.value,
          refMap
        ),
      ])
  );
  console.log(values);

  const [validationErrors, postValidationObj] = ss
    .omit(validator, [omit])
    .validate(values);

  if (!validationErrors && postValidationObj) {
    // TODO ifTakeValidated returns then we take that as a success otherwise a failure & dont reset
    takeValidatedObject(postValidationObj);
    // TODO reset to default values
    ResetForm(refMap);
  } else if (validationErrors) {
    console.log('validationErrors', {
      [validationErrors.path[0] as keyof TForm]: validationErrors.message,
    });

    onFormErrors({
      [validationErrors.path[0] as keyof TForm]: validationErrors.message,
    });
  }
}
