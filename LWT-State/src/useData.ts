import { dataQuery, dataService } from "lwt-state";
import { SubscribedQueryKeys, useAkita } from "./useAkita";

// TODO token registration
export const useData = (queryTerms: SubscribedQueryKeys<typeof dataQuery>) =>
  useAkita(dataQuery, dataService, queryTerms);
