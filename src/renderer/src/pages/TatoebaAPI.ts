import axios, { AxiosResponse } from 'axios';
import { paths as TatoebaPaths } from '../../../shared/apis/out/tatoeba.openapi';

type TatoebaOpenAPI = TatoebaPaths;
type TatoebaGetSentencePath =
  TatoebaOpenAPI['/unstable/sentences']['parameters']['query'];
//   type TatoebaAPIReqParamKeys=keyofTatoebaAPIQueryParamObjects['query']

export const TATOEBA_API_BASE_URL_NO_SLASH =
  'https://api.dev.tatoeba.org' as const;

export interface AxiosOpenAPIWrapper<
  TKey extends string,
  TPathInterface extends Record<
    TKey,
    {
      parameters:
        | { query: Record<string, unknown> }
        | { path: Record<string, unknown> };
    }
  >
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

class BaseOpenAPIWrapper {
  public wrapperAPIUrl: string | null = null;

  constructor(wrapperAPIUrl: string) {
    this.wrapperAPIUrl = wrapperAPIUrl;
  }
}
export class TatoebaOpenAPIWrapper
  extends BaseOpenAPIWrapper
  implements AxiosOpenAPIWrapper<keyof TatoebaPaths, TatoebaPaths>
{
  constructor() {
    super(TATOEBA_API_BASE_URL_NO_SLASH);
  }
  getPath: <TKey extends keyof TatoebaPaths>(
    path: TKey,
    queryParams: TatoebaPaths[TKey]['parameters'] extends { query: any }
      ? {
          [key in keyof TatoebaPaths[TKey]['parameters']['query']]: TatoebaPaths[TKey]['parameters']['query'][key];
        }
      : never
  ) => Promise<AxiosResponse> = (path, queryParams) => {
    const getURL = `${this.wrapperAPIUrl}${path}?${Object.keys(queryParams)
      .map((queryKey) => `${queryKey}=${queryParams[queryKey]}`)
      .join('&')}`;

    return axios.get(getURL);
  };
}

type RomanCharLowercase =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z';

type TwoLetterString = `${RomanCharLowercase}${RomanCharLowercase}`;
export type ThreeLetterString =
  `${RomanCharLowercase}${RomanCharLowercase}${RomanCharLowercase}`;
// type WordBool = 'yes' | 'no';
// type TatoebaAPIReqParams = {
//   from: string;
//   page?: number;
//   list?: number;
//   has_audio?: WordBool;
//   native?: string;
//   orphans?: WordBool;
//   query?: string;
//   sort?: string;
//   sort_reverse?: string;
//   tags?: string;
//   to?: string;
//   trans_filter?: 'limit';
//   trans_has_audio?: string;
//   trans_link?: string;
//   trans_orphan?: string;
//   trans_to?: string;
//   trans_unapproved?: string;
//   trans_user?: string;
//   unapproved?: string;
//   user?: string;
// };
