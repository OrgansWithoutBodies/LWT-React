import { Query } from "@datorama/akita";
import { pick } from "rambdax";
import { Observable, ObservedValueOf } from "rxjs";

import { useEffect, useState } from "react";

type StateShapeDefault = object;
export type SubscribedQueryKeys<TQuery extends Query<StateShapeDefault>> =
  (keyof TQuery)[];
export type LiteralQueryState<
  TQuery extends Query<StateShapeDefault>,
  Keys extends SubscribedQueryKeys<TQuery>
> = { readonly [key in Keys[number]]: ObservedValueOf<TQuery[key]> };

/**
 *
 * @param query
 * @param service
 * @param queryTerms
 */
export function useAkita<
  TState extends {},
  TQuery extends Query<TState>,
  TService
>(
  query: TQuery,
  service: TService,
  queryTerms: SubscribedQueryKeys<TQuery>
): [LiteralQueryState<TQuery, typeof queryTerms>, TService] {
  const [retrievedQueryTerms, setRetrievedQueryTerms] = useState<
    LiteralQueryState<TQuery, typeof queryTerms>
  >(
    () =>
      pick(queryTerms, query.getValue()) as unknown as LiteralQueryState<
        TQuery,
        typeof queryTerms
      >
  );
  useEffect(() => {
    const subscriptions = queryTerms.map((term) => {
      // TODO no any
      const retrievedQueryObservable = query[term] as Observable<any>;

      return retrievedQueryObservable.subscribe({
        next(observedValue) {
          setRetrievedQueryTerms((s) => ({ ...s, [term]: observedValue }));
        },
      });
    });
    return () =>
      subscriptions.forEach((subscription) => subscription.unsubscribe());
  }, []);

  return [retrievedQueryTerms, service];
}
