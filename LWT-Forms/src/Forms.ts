// import { identityMap } from 'lwt-state';
import { useRef } from "react";
import * as ss from "superstruct";
// import { ObjectSchema } from "superstruct/dist/utils";

export const identityMap = (val: string) => val;

// export function Form<TSchema extends ObjectSchema>({
//   validator,
//   formData,
// }: {
//   validator: TSchema;
//   formData: any;
// }) {
//   // TODO
//   // for each member of formData, check against ss validator - if doesnt match raise flag on that part of schema.
//   //   debounce input/allow to only check on submit
//   validator;
// }
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
  validator: ss.Struct<{ [key in keyof TForm]: any }>,
  defaultValues?: { [key in keyof TForm]: any }
): TRefMap<TForm> {
  // TODO no any
  const values = Object.keys(
    validator.schema as any
  ) as (keyof (typeof validator)["TYPE"])[];
  const buildInitialValue = (key: keyof (typeof validator)["TYPE"]) => {
    if (defaultValues && defaultValues[key]) {
      return { value: defaultValues[key] };
      // return null;
    }
    return null;
  };
  const individualRefs = Object.fromEntries(
    values.map((key) => [
      key,
      useRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null>(
        // TODO no any
        buildInitialValue(key) as any
      ),
    ])
  ) as TRefMap<TForm>;
  individualRefs.clearAll = () => {
    values.forEach((val) => (individualRefs[val].current.value = ""));
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
    (key) => (refMap[key as keyof TForm].current.value = "")
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
      .filter((val) => (omit === null || val !== omit) && val !== "clearAll")
      .map((refKey) => [
        refKey,
        // TODO no cast if possible
        (preValidateMap[refKey as keyof TForm] || identityMap)(
          refMap[refKey].current?.value,
          refMap
        ),
      ])
  );
  console.log("TEST123-CHECKSUBMIT", values);

  const [validationErrors, postValidationObj] = ss
    // TODO no any
    .omit(validator as any, [omit as any])
    .validate(values);

  if (!validationErrors && postValidationObj) {
    // TODO ifTakeValidated returns then we take that as a success otherwise a failure & dont reset
    // TODO no any
    takeValidatedObject(postValidationObj as any);
    // TODO reset to default values
    ResetForm(refMap);
  } else if (validationErrors) {
    console.log("validationErrors", {
      [validationErrors.path[0] as keyof TForm]: validationErrors.message,
    });

    onFormErrors({
      [validationErrors.path[0] as keyof TForm]: validationErrors.message,
      // TODO no any
    } as any);
  }
}
