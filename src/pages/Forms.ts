import { useRef } from 'react';
import { ObjectSchema } from 'superstruct/dist/utils';
import * as ss from 'superstruct';

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
const identityMap = (val: string) => val;

export const parseNumMap = (value: string) => Number.parseInt(value, 10);
export const emptyToNullMap = (value: string) =>
  value === '' ? undefined : value;
export const binaryMap = (val: '0' | '1') => (val === '0' ? true : false);

function CheckErrors<TForm extends {}>(
  keyChanged: keyof TForm,
  refMap: TRefMap<TForm>,
  setFieldError: (val: boolean) => void,
  validator: ss.Struct<Record<keyof TForm, any>>
) {
  const error = ss
    .pick(validator, [keyChanged])
    .validate({ [keyChanged]: refMap[keyChanged].current.value })[0];
  console.log('TEST123-Val', keyChanged, refMap[keyChanged], error);
  if (!error) {
    return setFieldError(false);
  }
  return setFieldError(true);
}
// HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

export type TRefMap<TForm> = Record<keyof TForm, React.MutableRefObject<any>>;
export function RefMap<TForm>(
  validator: ss.Struct<{ [key in keyof TForm]: any }>
): TRefMap<TForm> {
  const values = Object.keys(validator.schema);
  return Object.fromEntries(
    values.map((key) => [
      key,
      useRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(),
    ])
  ) as Record<
    keyof TForm,
    React.MutableRefObject<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  >;
}
// TODO can pass in default values to reset to
export function ResetForm<TForm>(refMap: TRefMap<TForm>) {
  Object.keys(refMap).forEach(
    (key) => (refMap[key as keyof TForm].current.value = '')
  );
}

export function CheckAndSubmit<TForm>(
  refMap: TRefMap<TForm>,
  preValidateMap: {
    [key in keyof TForm]?: (value: string) => any | null;
  },
  validator: ss.Struct<{ [key in keyof TForm]: any }>,
  takeValidatedObject: (value: { [key in keyof TForm]: any }) => void
) {
  const values = Object.fromEntries(
    (Object.keys(refMap) as (keyof typeof refMap)[]).map((refKey) => {
      return [
        refKey,
        (preValidateMap[refKey] || identityMap)(refMap[refKey].current?.value),
      ];
    })
  );

  const [validationErrors, postValidationObj] = validator.validate(values);

  console.log('TEST123', validationErrors, postValidationObj);
  if (!validationErrors && postValidationObj) {
    takeValidatedObject(postValidationObj);
    // TODO reset form on valid/show success msg
    ResetForm(refMap);
  }
}
