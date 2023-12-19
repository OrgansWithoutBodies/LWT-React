import { useData } from '../renderer/src/hooks/useData';
import { UIString, i18NLanguageLookups } from './strings';

export function I18N({ i: stringToTranslate }: { i: UIString }) {
  const [{ uiLanguage }] = useData(['uiLanguage']);
  if (!uiLanguage) {
    return <></>;
  }
  console.log('TEST123-i18n', uiLanguage, i18NLanguageLookups);
  const str =
    i18NLanguageLookups[uiLanguage][stringToTranslate] || stringToTranslate;
  return (
    <>
      {str.split('\n').map((val, index) => (
        <>
          {index > 0 && <br />}
          {val}
        </>
      ))}
    </>
  );
}

export function useI18N() {
  const [{ uiLanguage }] = useData(['uiLanguage']);
  if (!uiLanguage) {
    return (val) => val;
  }
  const lookup = i18NLanguageLookups[uiLanguage];
  return (val: UIString) => lookup[val] || val;
}
