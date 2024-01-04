export interface GenericRetrievalAPI<
  TSource extends string,
  TTarget extends string
> {
  apiName: string;
  apiHomePage: string;
  whatsRetrievedFromAPISingular: string;

  getFromAPI: (
    args: APITranslateTerm<TSource, TTarget> & { apiKey?: string }
  ) => Promise<string[]>;
}
export interface APITranslateTerm<
  TSource extends string,
  TTarget extends string
> {
  sourceKey: TSource;
  targetKey: TTarget;
  word: string;
}
