import { AxiosResponse } from 'axios';

export type PathInterface<
  TKey extends string,
  TQueryParams extends Record<string, unknown> = Record<string, unknown>
> = {
  [key in TKey]: {
    parameters: {
      query?: TQueryParams;
      path?: Record<string, unknown>;
    };
  };
};

export interface AxiosOpenAPIWrapper<
  TKey extends string,
  TPathInterface extends PathInterface<TKey>
> {
  getPath: <TKey extends keyof TPathInterface>(
    path: TKey,
    queryParams: TPathInterface[TKey]['parameters'] extends { query: any }
      ? {
          [key in keyof TPathInterface[TKey]['parameters']['query']]: TPathInterface[TKey]['parameters']['query'][key];
        }
      : never
  ) => Promise<AxiosResponse<any>>;
}
export class BaseOpenAPIWrapper {
  public wrapperAPIUrl: string | null = null;

  constructor(wrapperAPIUrl: string) {
    this.wrapperAPIUrl = wrapperAPIUrl;
  }
}
