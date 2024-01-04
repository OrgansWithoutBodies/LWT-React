import { AxiosResponse } from 'axios';

type ResponseCode =
  | 200
  | 400
  | 401
  | 403
  | 404
  | 413
  | 415
  | 429
  | 456
  | 500
  | 503
  | 529;

export type PathInterface<
  TKey extends string,
  TQueryParams extends Record<string, unknown> = Record<string, unknown>
> = {
  [key in TKey]: {
    parameters?: {
      query?: TQueryParams;
      path?: Record<string, unknown>;
    };
    get?: {
      responses: {
        [key in ResponseCode]?: {
          content:
            | {
                'application/json'?:
                  | Record<string, unknown>
                  | Record<string, unknown>[];
                'text/tab-separated-values'?: unknown;
              }
            | never;
        };
      };
    };
    post?: {
      parameters?: {
        query?: TQueryParams;
        path?: Record<string, unknown>;
      };
      requestBody?: {
        content: {
          'application/json'?: Record<string, unknown>;
          'multipart/form-data'?: Record<string, unknown>;
        };
      };
    };
  };
};

export interface AxiosOpenAPIWrapper<
  TKey extends string,
  TPathInterface extends PathInterface<TKey>
> {
  getPath?: <TKey extends keyof TPathInterface>(
    path: TKey,
    queryParams: TPathInterface[TKey]['parameters'] extends { query: any }
      ? {
          [key in keyof TPathInterface[TKey]['parameters']['query']]: TPathInterface[TKey]['parameters']['query'][key];
        }
      : never
  ) => Promise<AxiosResponse<any>>;
  postPath?: <TKey extends keyof TPathInterface>(
    path: TKey,
    postParams: TPathInterface[TKey]['parameters'] extends { query: any }
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
