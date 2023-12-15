import { dataQuery } from '../data/data.query';
import { dataService } from '../data/data.service';
import { SubscribedQueryKeys, useAkita } from './useAkita';

// TODO token registration
export const useData = (queryTerms: SubscribedQueryKeys<typeof dataQuery>) =>
  useAkita(dataQuery, dataService, queryTerms);
