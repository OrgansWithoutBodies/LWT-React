import { useAppContext } from '../../../../../LWT-Build/src/useContext';
import { VariantMap } from '../styles';

export function useThemeColors() {
  const { styleVariant } = useAppContext();
  return VariantMap[styleVariant];
}
