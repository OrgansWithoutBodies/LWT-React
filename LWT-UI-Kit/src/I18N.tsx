import { AppVariables } from "lwt-build";
import { UIString, i18NLanguageLookups } from "lwt-i18n";
import { useData } from "lwt-state";

export function I18N({ i: stringToTranslate }: { i: UIString }) {
  const [{ uiLanguage }] = useData(["uiLanguage"]);
  const { devMode } = AppVariables;
  if (!uiLanguage) {
    return <></>;
  }
  const stringExists =
    i18NLanguageLookups[uiLanguage][stringToTranslate] !== undefined &&
    i18NLanguageLookups[uiLanguage][stringToTranslate] !== "";
  const str =
    i18NLanguageLookups[uiLanguage][stringToTranslate] || stringToTranslate;
  return (
    <>
      {str.split("\n").map((val, index) => (
        <span key={index}>
          {index > 0 && <br />}
          <span style={{ color: stringExists || !devMode ? undefined : "red" }}>
            {val}
          </span>
        </span>
      ))}
    </>
  );
}

export function useI18N() {
  const [{ uiLanguage }] = useData(["uiLanguage"]);
  if (!uiLanguage) {
    return (val: UIString) => val;
  }
  const { devMode } = AppVariables;
  const lookup = i18NLanguageLookups[uiLanguage];
  return (val: UIString) => (!devMode ? val : lookup[val] || `!!${val}`);
}
