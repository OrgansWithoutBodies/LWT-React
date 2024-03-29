import { useSearchParams } from "react-router-dom";
import { headerValuesTemp } from "../headerValues";

/**
 *
 * @param pageKey
 */
export function useInternalParams<
  TPageKey extends keyof typeof headerValuesTemp,
  TPageParams extends (typeof headerValuesTemp)[TPageKey]["params"][number]
>(pageKey: TPageKey): Record<TPageParams, string | null> {
  const [searchParams] = useSearchParams();
  return Object.fromEntries(
    headerValuesTemp[pageKey].params.map(
      (val) => [val, searchParams.get(val)] as [TPageParams, string | null]
    )
    // TODO no cast
  ) as Record<TPageParams, string | null>;
}
