import { VariantMap } from '../styles';
import { useAppContext } from './useContext';

export function useThemeColors() {
  const { styleVariant } = useAppContext();
  return VariantMap[styleVariant];
}
