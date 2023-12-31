export function makeHash<
  TKey extends string,
  TBrand extends number | string,
  TObj extends {
    [key in TKey]: TBrand;
  }
>(vals: TObj[], key: TKey): { [k: string]: TObj } {
  return Object.fromEntries(
    vals.map((val) => [val[key], val] as [TBrand, TObj])
  );
}
