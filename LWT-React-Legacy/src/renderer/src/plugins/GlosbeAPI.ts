// TODO seems this is deprecated
import axios, { AxiosResponse } from 'axios';
import {
  AxiosOpenAPIWrapper,
  BaseOpenAPIWrapper,
} from '../pages/API/BaseOpenAPIWrapper';
import { GlosbeKeys } from './GlosbeKeys';
export type GlosbeLangKeyShortString = keyof typeof GlosbeKeys;

const GLOSBE_API_BASE_URL_NO_SLASH = `http://glosbe.com`;

interface GlosbePaths {
  '/gapi/translate': {
    parameters: {
      query: {
        from: GlosbeLangKeyShortString;
        dest: GlosbeLangKeyShortString;
        phrase: string;
        format: 'json';
      };
    };
  };
}
export class GlosbeOpenAPIWrapper
  extends BaseOpenAPIWrapper
  implements AxiosOpenAPIWrapper<keyof GlosbePaths, GlosbePaths>
{
  constructor() {
    super(GLOSBE_API_BASE_URL_NO_SLASH);
  }

  getPath: <TKey extends keyof GlosbePaths>(
    path: TKey,
    queryParams: GlosbePaths[TKey]['parameters'] extends { query: any }
      ? {
          [key in keyof GlosbePaths[TKey]['parameters']['query']]: GlosbePaths[TKey]['parameters']['query'][key];
        }
      : never
    // TODO default vals
  ) => Promise<AxiosResponse> = (path, queryParams) => {
    if (!this.wrapperAPIUrl) {
      throw new Error('Base URL hasnt been set!');
    }
    const getURL = `${this.wrapperAPIUrl}${path}?${Object.keys(queryParams)
      .map((queryKey) => `${queryKey}=${queryParams[queryKey]}`)
      .join('&')}`;

    return axios.get(getURL);
  };
}
