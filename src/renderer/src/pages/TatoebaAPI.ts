import axios, { AxiosResponse } from 'axios';
import { paths as TatoebaPaths } from '../../../shared/apis/out/tatoeba.openapi';
import { AxiosOpenAPIWrapper, BaseOpenAPIWrapper } from './BaseOpenAPIWrapper';

type TatoebaOpenAPI = TatoebaPaths;
type TatoebaGetSentencePath =
  TatoebaOpenAPI['/unstable/sentences']['parameters']['query'];
//   type TatoebaAPIReqParamKeys=keyofTatoebaAPIQueryParamObjects['query']

export type PathStartingWithSlash = `/${string}`;
export const TATOEBA_API_BASE_URL_NO_SLASH =
  'https://api.dev.tatoeba.org' as const;

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
  ) => Promise<AxiosResponse<TatoebaPaths[TKey]['get']['responses'][200]>> = (
    path,
    queryParams
  ) => {
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
