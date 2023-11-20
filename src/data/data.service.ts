import { StrengthMap } from '../pages/AddNewTermTooltip';
import { dataStore, DataStore } from './data.storage';

import {
  AddNewTextType,
  AddNewWordType,
  LanguageNoId,
  Words,
} from './parseMySqlDump';
import { TermStrengthOrUnknown } from './type';
import {
  ArchivedTextsId,
  LanguagesId,
  Tags2Id,
  TagsId,
  TextsId,
  WordsId,
} from './validators';
type LongTextForm = {};

function IDIsUnique<TBrand extends number>(
  id: number,
  existingIds: TBrand[]
): id is TBrand {
  return !existingIds.includes(id as any);
}
export class DataService {
  // These are saved in DB
  public addLanguage(language: LanguageNoId) {
    this.dataStore.update((state) => {
      const ids = state.languages.map((lang) => lang.LgID);
      const maxId = Math.max(...ids) + 1;
      if (IDIsUnique(maxId, ids)) {
        return {
          ...state,
          languages: [
            ...state.languages,
            {
              ...language,
              LgID: maxId,
            },
          ],
        };
      }
    });
    [];
  }
  public deleteLanguage(langId: LanguagesId) {
    this.dataStore.update((state) => {
      return {
        ...state,
        languages: state.languages.filter(
          (language) => language.LgID !== langId
        ),
      };
    });
  }

  public addText(text: AddNewTextType) {
    this.dataStore.update((state) => {
      const ids = state.texts.map((text) => text.TxID);
      const maxId = Math.max(...ids) + 1;
      if (IDIsUnique(maxId, ids)) {
        return {
          ...state,
          texts: [
            ...state.texts,
            {
              ...text,
              TxID: maxId,
              // TODO
              TxAnnotatedText: '',
            },
          ],
        };
      }
    });
  }
  public deleteText(textId: TextsId) {
    this.dataStore.update((state) => {
      return {
        ...state,
        texts: state.texts.filter((text) => text.TxID !== textId),
      };
    });
  }

  public addTerm(word: AddNewWordType) {
    this.dataStore.update((state) => {
      const ids = state.words.map((word) => word.WoID);
      const maxId = Math.max(...ids) + 1;
      if (IDIsUnique(maxId, ids)) {
        return {
          ...state,
          words: [
            ...state.words,
            {
              ...word,
              WoID: maxId,
              // TODO
              WoStatusChanged: new Date().toTimeString(),
              WoTodayScore: 0,
              WoTomorrowScore: 0,
              // TODO ? whats this
              WoRandom: 0,
            },
          ],
        };
      }
    });
  }
  public deleteTerm(termId: WordsId) {
    this.dataStore.update((state) => {
      return {
        ...state,
        words: state.words.filter((word) => word.WoID !== termId),
      };
    });
  }

  public changeTermStrength(
    termId: WordsId,
    termStrength: TermStrengthOrUnknown
  ) {
    const { words } = this.dataStore.getValue();
    const wordIndex = words.findIndex((word) => word.WoID === termId);
    if (wordIndex === -1) {
      return;
    }
    const word = words[wordIndex];
    const updatedWord: Words = {
      ...word,
      WoStatus: StrengthMap[termStrength].classKey,
    };
    const newWords = [...words];
    newWords[wordIndex] = updatedWord;
    this.dataStore.update((state) => ({ ...state, words: newWords }));
  }
  public addTagToTerm(tagId: TagsId, termId: WordsId) {
    this.dataStore.update((state) => ({
      ...state,
      wordtags: [...state.wordtags, { WtTgID: tagId, WtWoID: termId }],
    }));
  }
  public deleteTagFromTerm() {
    window.alert('TODO DELETETAGFROMTERM');
  }

  public addTagToText(tagId: Tags2Id, textId: TextsId) {
    this.dataStore.update((state) => ({
      ...state,
      texttags: [...state.texttags, { TtT2ID: tagId, TtTxID: textId }],
    }));
  }
  public deleteTagFromText() {
    window.alert('TODO DELETETAGFROMTEXT');
  }

  public addLongText(longTextForm: LongTextForm) {
    window.alert('TODO ADDLONGTEXT');
  }
  public addMultipleTerms() {
    window.alert('TODO ADDMULTIPLETERMS');
  }

  public restoreFromBackup() {
    window.alert('TODO RESTORING FROM BACKUP');
  }
  public downloadBackup() {
    window.alert('TODO DOWNLOADING BACKUP');
  }
  public emptyDatabase() {
    window.alert('TODO EMPTYING DB');
  }
  public installDemoDatabase() {
    window.alert('TODO INSTALLING DEMO');
  }

  public archiveText(archID: TextsId) {
    // TODO hashmap
    /**
     * 	$message3 = runsql('delete from ' . $tbpref . 'textitems where TiTxID = ' . $_REQUEST['arch'], 
		"Text items deleted");
	$message2 = runsql('delete from ' . $tbpref . 'sentences where SeTxID = ' . $_REQUEST['arch'], 
		"Sentences deleted");
	$message4 = runsql('insert into ' . $tbpref . 'archivedtexts (AtLgID, AtTitle, AtText, AtAnnotatedText, AtAudioURI, AtSourceURI) select TxLgID, TxTitle, TxText, TxAnnotatedText, TxAudioURI, TxSourceURI from ' . $tbpref . 'texts where TxID = ' . $_REQUEST['arch'], "Archived Texts saved");
	$id = get_last_key();
	runsql('insert into ' . $tbpref . 'archtexttags (AgAtID, AgT2ID) select ' . $id . ', TtT2ID from ' . $tbpref . 'texttags where TtTxID = ' . $_REQUEST['arch'], "");	
	$message1 = runsql('delete from ' . $tbpref . 'texts where TxID = ' . $_REQUEST['arch'], "Texts deleted");
	$message = $message4 . " / " . $message1 . " / " . $message2 . " / " . $message3;
	adjust_autoincr('texts','TxID');
	adjust_autoincr('sentences','SeID');
	adjust_autoincr('textitems','TiID');
	runsql("DELETE " . $tbpref . "texttags FROM (" . $tbpref . "texttags LEFT JOIN " . $tbpref . "texts on TtTxID = TxID) WHERE TxID IS NULL",'')
     */
    this.dataStore.update(({ texts, archivedtexts, ...state }) => {
      const archIndex = texts.findIndex((text) => {
        return text.TxID === archID;
      });
      const toArchive = texts[archIndex];
      console.log('TEST123', toArchive, archIndex, texts, archID);
      const poppedTexts = [
        ...texts.slice(0, archIndex),
        ...texts.slice(archIndex + 1),
      ];
      return {
        ...state,
        texts: poppedTexts,
        archivedtexts: [
          ...archivedtexts,
          {
            AtAnnotatedText: toArchive.TxAnnotatedText,
            AtAudioURI: toArchive.TxAudioURI,
            AtID: toArchive.TxID as any as ArchivedTextsId,
            AtLgID: toArchive.TxLgID,
            AtSourceURI: toArchive.TxSourceURI,
            AtText: toArchive.TxText,
            AtTitle: toArchive.TxTitle,
          },
        ],
      };
    });
  }
  public unarchiveText() {
    window.alert('TODO UNARCHIVETEXT');
  }

  public setViewerSettings() {
    window.alert('TODO SETVIEWERSETTINGS');
  }

  public reparseText(textId: TextsId) {
    window.alert('TODO REPARSETEXT');
  }
  public reparseAllTextsForLanguage(langId: LanguagesId) {
    const { texts } = this.dataStore.getValue();
    texts
      .filter((text) => {
        return text.TxLgID === langId;
      })
      .forEach((text) => {
        this.reparseText(text.TxID);
      });
  }

  // These are only needed locally
  public setActiveLanguage(langId: LanguagesId | null) {
    this.dataStore.update((state) => {
      return { ...state, activeLanguageId: langId };
    });
  }

  constructor(private dataStore: DataStore) {}
}

export const dataService = new DataService(dataStore);
