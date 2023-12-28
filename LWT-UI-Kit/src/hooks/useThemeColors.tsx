import { useAppContext } from "lwt-build";
import { VariantMap } from "lwt-style";

export function useThemeColors() {
  const { styleVariant } = useAppContext();
  return VariantMap[styleVariant];
}
