import { Language, LanguagesID, TextsID } from "lwt-schemas";
import { useData } from "lwt-state";

export function useValidateLang(currentlang: LanguagesID) {
  const [{ languageHashmap }] = useData(["languageHashmap"]);
  if (languageHashmap[currentlang]) {
    throw new Error("Invalid Language ID!");
  }
  return languageHashmap[currentlang];
}
export function useValidateText(currenttext: TextsID) {
  const [{ textsHashmap }] = useData(["textsHashmap"]);
  if (textsHashmap[currenttext]) {
    throw new Error("Invalid Text ID!");
  }
  return textsHashmap[currenttext];
}

export function useCheckLangDupl() {
  // Check if langname exists and its lang# != curr
  const [{ languageHashmapByName }] = useData(["languageHashmapByName"]);
  return (
    lang: Pick<Language, "LgName"> & { LgID: Language["LgID"] | null },

    onDupl: () => void
  ) => {
    if (
      languageHashmapByName[lang.LgName] &&
      (lang.LgID === null ||
        languageHashmapByName[lang.LgName].LgID !== lang.LgID)
    ) {
      alert(
        'Language "' +
          lang.LgName +
          '" exists already. Please change the language name!'
      );
      onDupl();
      return false;
    }
    return true;
  };
}
