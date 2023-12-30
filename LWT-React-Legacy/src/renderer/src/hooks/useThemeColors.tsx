import { useAppContext } from 'lwt-build';
import { VariantMap } from '../styles';

export function useThemeColors() {
  const { styleVariant } = useAppContext();
  return VariantMap[styleVariant];
}
