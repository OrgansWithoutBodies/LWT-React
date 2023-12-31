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

// // -------------------------------------------------------------

// function validateTag(currenttag, currentlang)
// {
// 	global tbpref;
// 	if (currenttag !== '' && currenttag !== -1) {
// 		if (currentlang === '')
// 			sql = "select (" . currenttag . " in (select TgID from " . tbpref . "words, " . tbpref . "tags, " . tbpref . "wordtags where TgID = WtTgID and WtWoID = WoID group by TgID order by TgText)) as value";
// 		else
// 			sql = "select (" . currenttag . " in (select TgID from " . tbpref . "words, " . tbpref . "tags, " . tbpref . "wordtags where TgID = WtTgID and WtWoID = WoID and WoLgID = " . currentlang . " group by TgID order by TgText)) as value";
// 		r = get_first_value(sql);
// 		if (r === 0)
// 			currenttag = '';
// 	}
// 	return currenttag;
// }

// // -------------------------------------------------------------

// function validateArchTextTag(currenttag, currentlang)
// {
// 	global tbpref;
// 	if (currenttag !== '' && currenttag !== -1) {
// 		if (currentlang === '')
// 			sql = "select (" . currenttag . " in (select T2ID from " . tbpref . "archivedtexts, " . tbpref . "tags2, " . tbpref . "archtexttags where T2ID = AgT2ID and AgAtID = AtID group by T2ID order by T2Text)) as value";
// 		else
// 			sql = "select (" . currenttag . " in (select T2ID from " . tbpref . "archivedtexts, " . tbpref . "tags2, " . tbpref . "archtexttags where T2ID = AgT2ID and AgAtID = AtID and AtLgID = " . currentlang . " group by T2ID order by T2Text)) as value";
// 		r = get_first_value(sql);
// 		if (r === 0)
// 			currenttag = '';
// 	}
// 	return currenttag;
// }

// // -------------------------------------------------------------

// function validateTextTag(currenttag, currentlang)
// {
// 	global tbpref;
// 	if (currenttag !== '' && currenttag !== -1) {
// 		if (currentlang === '')
// 			sql = "select (" . currenttag . " in (select T2ID from " . tbpref . "texts, " . tbpref . "tags2, " . tbpref . "texttags where T2ID = TtT2ID and TtTxID = TxID group by T2ID order by T2Text)) as value";
// 		else
// 			sql = "select (" . currenttag . " in (select T2ID from " . tbpref . "texts, " . tbpref . "tags2, " . tbpref . "texttags where T2ID = TtT2ID and TtTxID = TxID and TxLgID = " . currentlang . " group by T2ID order by T2Text)) as value";
// 		r = get_first_value(sql);
// 		if (r === 0)
// 			currenttag = '';
// 	}
// 	return currenttag;
// }
