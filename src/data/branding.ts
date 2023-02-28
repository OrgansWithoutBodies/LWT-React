import * as ss from 'superstruct';
export type BrandedString<TBrand extends string> = string & { __brand: TBrand };
export type BrandedNumber<TBrand extends string> = number & { __brand: TBrand };

export function brandedString<BrandName extends string>(
  brandName: BrandName,
  refiner?: (value: string) => boolean
): ss.Struct<BrandedString<BrandName>> {
  const refinedType = refiner
    ? ss.refine(ss.string(), `branded-string-${brandName}-refinement`, refiner)
    : ss.string();
  return ss.define<BrandedString<BrandName>>(
    `branded-string-${brandName}`,
    (v) => refinedType.is(v)
  );
}
export function brandedNumber<BrandName extends string>(
  brandName: BrandName,
  refiner?: (value: number) => boolean
): ss.Struct<BrandedNumber<BrandName>> {
  const refinedType = refiner
    ? ss.refine(ss.number(), `branded-number-${brandName}-refinement`, refiner)
    : ss.number();
  return ss.define<BrandedNumber<BrandName>>(
    `branded-number-${brandName}`,
    (v) => refinedType.is(v)
  );
}
