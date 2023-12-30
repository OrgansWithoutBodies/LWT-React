import { SettingSpec, SettingsObject, settingSpec } from "lwt-schemas";
import { useData } from "lwt-state";

// TODO return type wrong here
// TODO maybe this should just be default behavior of query...
export function useSettingWithDefault(
  keys: (keyof SettingSpec)[]
): Pick<SettingsObject, (typeof keys)[number]> {
  const [{ settings }] = useData(["settings"]);
  const settingsWithDefault = Object.fromEntries(
    keys.map((key) =>
      settings[key] !== undefined
        ? [key, settings[key]]
        : [key, settingSpec[key]["default"]]
    )
  );
  return settingsWithDefault as Pick<SettingsObject, (typeof keys)[number]>;
}
