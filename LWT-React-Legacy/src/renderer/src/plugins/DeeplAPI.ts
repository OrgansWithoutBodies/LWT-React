import axios, { AxiosResponse } from 'axios';
import {
  components as DeeplComponents,
  paths as DeeplPaths,
} from '../../../shared/apis/out/deepl.openapi';
import {
  AxiosOpenAPIWrapper,
  BaseOpenAPIWrapper,
} from '../pages/API/BaseOpenAPIWrapper';

// type DeeplOpenAPI = DeeplPaths;
// type DeeplTranslatePath = DeeplOpenAPI['/translate']['post'];
export type DeeplSourceKeys = DeeplComponents['schemas']['SourceLanguage'];
export type DeeplTargetKeys = DeeplComponents['schemas']['TargetLanguage'];
type PostObject = {
  post: {
    requestBody: { content: { 'application/json': Record<string, any> } };
    responses: Record<AxiosResponse['status'], any>;
  };
};
//   type DeeplAPIReqParamKeys=keyof DeeplAPIQueryParamObjects['query']

export type PathStartingWithSlash = `/${string}`;
export const deepl_API_BASE_URL_NO_SLASH =
  'https://api-free.deepl.com/v2' as const;

// TODO auth key
export class DeeplOpenAPIWrapper
  extends BaseOpenAPIWrapper
  implements AxiosOpenAPIWrapper<keyof DeeplPaths, DeeplPaths>
{
  constructor(public authorizationKey: string) {
    super(deepl_API_BASE_URL_NO_SLASH);
  }

  // getPath: <TKey extends keyof DeeplPaths>(
  //   path: TKey,
  //   queryParams: DeeplPaths[TKey]['parameters'] extends { query: any }
  //     ? {
  //         [key in keyof DeeplPaths[TKey]['parameters']['query']]: DeeplPaths[TKey]['parameters']['query'][key];
  //       }
  //     : never
  // ) => Promise<AxiosResponse> = (path, queryParams) => {
  //   const getURL = `${this.wrapperAPIUrl}${path}?${Object.keys(queryParams)
  //     .map((queryKey) => `${queryKey}=${queryParams[queryKey]}`)
  //     .join('&')}`;

  //   return axios.get(getURL);
  // };
  postPath: <TKey extends keyof DeeplPaths>(
    path: TKey,
    postParams: DeeplPaths[TKey] extends PostObject
      ? {
          [key in keyof DeeplPaths[TKey]['post']['requestBody']['content']['application/json']]: DeeplPaths[TKey]['post']['requestBody']['content']['application/json'][key];
        }
      : never
  ) => Promise<
    DeeplPaths[TKey] extends PostObject
      ? AxiosResponse<
          DeeplPaths[TKey]['post']['responses'][200]['content']['application/json']
        >
      : AxiosResponse
  > = (path, postParams) => {
    const postURL = `${this.wrapperAPIUrl}${path}`;

    return axios.post(postURL, postParams, {
      headers: { Authorization: this.authorizationKey },
    });
  };
}
