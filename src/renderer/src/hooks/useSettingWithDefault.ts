import { SettingSpec, Settings, settingSpec } from '../data/settings';
import { useData } from './useData';

// TODO return type wrong here
// TODO maybe this should just be default behavior of query...
export function useSettingWithDefault(
  keys: (keyof SettingSpec)[]
): Pick<Settings, (typeof keys)[number]> {
  const [{ settings }] = useData(['settings']);
  const settingsWithDefaul = Object.fromEntries(
    keys.map((key) =>
      settings[key] !== undefined
        ? [key, settings[key]]
        : [key, settingSpec[key]['default']]
    )
  );
  return settingsWithDefaul;
}
