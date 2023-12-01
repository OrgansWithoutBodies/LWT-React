import { Gzip } from 'browserify-zlib';

import { Persistable } from '../../../shared/Persistable';
import { StrengthMap } from '../pages/StrengthMap';
import { splitCheckText } from '../pages/utils';
import {
  createDemoDBInitialState,
  DataState,
  dataStore,
  DataStore,
  MyPersistanceHandles,
} from './data.storage';
import { downloadTextFile } from './downloadTxtFile';

import { TatoebaOpenAPIWrapper, ThreeLetterString } from '../pages/TatoebaAPI';
import {
  AddNewTextType,
  AddNewWordType,
  LanguageNoId,
  Languages,
  Tags,
  Tags2,
  Words,
} from './parseMySqlDump';
import { serializeJsonToSQL } from './serializeJsonToSQL';
import Settings from './settings';
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

export enum CRUD {
  Create,
  Read,
  Update,
  Delete,
}
// TODO most of these are actually just identical C.UD operations - formalize that
// TODO sometimes with a callback to add more object keys (maybe best handled in form submission?)
/**
 *
 * @param id
 * @param existingIds
 */
function IDIsUnique<TBrand extends number>(
  id: number,
  existingIds: TBrand[]
): id is TBrand {
  return !existingIds.includes(id as any);
}
export class DataService {
  private TatoebaAPI: TatoebaOpenAPIWrapper;

  // TODO maybe just a drop handler? test if any faster
  private persistEmpty() {
    // assume insert instead of wholly recreate when given the option
    if (MyPersistanceHandles.empty) {
      const { empty: emptyer } = MyPersistanceHandles;

      emptyer();
    }
  }

  // TODO maybe not as good of an abstraction? just pass in a callback for getting data into the insert?
  private persistSet(key: keyof DataState) {
    // assume insert instead of wholly recreate when given the option
    if (MyPersistanceHandles.set) {
      const { set: setter } = MyPersistanceHandles;

      const { [key]: value } = this.dataStore.getValue();
      setter(key, value);
    }
  }

  private async persistInsert(key: keyof DataState, insertVal: any) {
    if (MyPersistanceHandles.insert) {
      const { insert: inserter } = MyPersistanceHandles;
      const insertedVal = await inserter(key, insertVal);
      return insertedVal;
    }
  }

  private async persistUpdate(key: keyof DataState, updatedVal: any) {
    if (MyPersistanceHandles.update) {
      console.log('UPDATING', key, updatedVal);
      const { update: updater } = MyPersistanceHandles;
      await updater(key, updatedVal);
    }
  }

  private async persistDelete(key: keyof DataState, deleteID: any) {
    if (MyPersistanceHandles.delete) {
      const { delete: deleter } = MyPersistanceHandles;
      await deleter(key, deleteID);
    }
  }
  // =================

  public addLanguage(language: LanguageNoId) {
    this.dataStore.update((state) => {
      const ids = state.languages.map((lang) => lang.LgID);
      const maxId = Math.max(...ids) + 1;
      return {
        ...state,
        notificationMessage: { txt: `Added New Language ${language.LgName}` },
        languages: [
          ...state.languages,
          {
            ...language,
            LgID: maxId,
          },
        ],
      };
    });

    this.persistSet('languages');
    this.persistInsert('languages', language);
  }

  public deleteLanguage(langId: LanguagesId) {
    this.dataStore.update((state) => ({
      ...state,
      languages: state.languages.filter((language) => language.LgID !== langId),
    }));

    this.persistSet('languages');
    this.persistDelete('languages', langId);
  }

  public deleteArchivedText(textId: ArchivedTextsId) {
    this.dataStore.update((state) => ({
      ...state,
      archivedtexts: state.archivedtexts.filter(
        (language) => language.AtID !== textId
      ),
    }));
    this.persistSet('archivedtexts');
    this.persistDelete('archivedtexts', textId);
  }

  public addText(text: AddNewTextType) {
    let maxId = null;
    this.dataStore.update((state) => {
      const ids = state.texts.map((text) => text.TxID);
      maxId = Math.max(...ids) + 1;
      return {
        ...state,
        notificationMessage: { txt: `Added New Text ${text.TxTitle}` },
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
    });
    this.persistSet('texts');
    this.persistInsert('texts', text);
    return maxId;
  }

  public addTag(tag: Tags) {
    this.dataStore.update((state) => {
      const ids = state.tags.map((tag) => tag.TgID);
      const maxId = (Math.max(...ids) + 1) as TagsId;
      return {
        ...state,
        notificationMessage: { txt: `Added New Tag ${tag.TgText}` },
        tags: [
          ...state.tags,
          {
            ...tag,
            TgID: maxId,
          },
        ],
      };
    });
    this.persistSet('tags');
    this.persistInsert('tags', tag);
  }

  public editTag(chgId: TagsId, tag: Tags) {
    this.dataStore.update((state) => {
      const ids = state.tags.map((tag) => tag.TgID);
      const maxId = (Math.max(...ids) + 1) as TagsId;
      return {
        ...state,
        notificationMessage: { txt: `Edited Tag ${tag.TgText}` },
        tags: [
          ...state.tags,
          {
            ...tag,
            TgID: maxId,
          },
        ],
      };
    });
    this.persistSet('tags');
    this.persistUpdate('tags', tag);
  }

  public editLanguage(chgId: LanguagesId, newData: Languages) {
    window.alert(`TODO-editLanguage${chgId}`);
    // this.dataStore.update((state) => {
    //   const ids = state.tags.map((tag) => tag.TgID);
    //   const maxId = (Math.max(...ids) + 1) as TagsId;
    //   return {
    //     ...state,
    //     notificationMessage: { txt: `Edited Tag ${tag.TgText}` },
    //     tags: [
    //       ...state.tags,
    //       {
    //         ...tag,
    //         TgID: maxId,
    //       },
    //     ],
    //   };
    // });
    // this.persistChange('tags');
    // this.persistUpdate('tags',newData);
  }

  public addTextTag(tag: Tags2) {
    this.dataStore.update((state) => {
      const ids = state.tags2.map((tag) => tag.T2ID);
      const maxId = (Math.max(...ids) + 1) as Tags2Id;
      return {
        ...state,
        notificationMessage: { txt: `Added New Text Tag ${tag.T2Text}` },
        tags2: [
          ...state.tags2,
          {
            ...tag,
            T2ID: maxId,
          },
        ],
      };
    });
    this.persistSet('tags2');
    this.persistInsert('tags2', tag);
  }

  public deleteText(textId: TextsId) {
    this.dataStore.update((state) => ({
      ...state,
      notificationMessage: { txt: `Removed Text Tag id=${textId}` },
      texts: state.texts.filter((text) => text.TxID !== textId),
    }));
    this.persistSet('texts');
    this.persistDelete('texts', textId);
  }

  public addTerm(word: AddNewWordType) {
    this.dataStore.update((state) => {
      const ids = state.words.map((word) => word.WoID);
      const maxId = Math.max(...ids) + 1;
      if (IDIsUnique(maxId, ids)) {
        return {
          ...state,
          notificationMessage: { txt: `Added New Word ${word.WoText}` },
          words: [
            ...state.words,
            {
              ...word,
              WoID: maxId,
              // TODO
              WoStatusChanged: Date.now(),
              WoTodayScore: 0,
              WoTomorrowScore: 0,
              // TODO ? whats this
              WoRandom: 0,
            },
          ],
        };
      }
    });
    this.persistSet('words');
    this.persistInsert('words', word);
  }

  public deleteTerm(termId: WordsId) {
    this.dataStore.update((state) => ({
      ...state,
      words: state.words.filter((word) => word.WoID !== termId),
    }));
    this.persistSet('words');
    this.persistDelete('words', termId);
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
    this.persistSet('words');
    this.persistUpdate('words', updatedWord);
  }

  public addTagToTerm(tagId: TagsId, termId: WordsId) {
    this.dataStore.update((state) => ({
      ...state,
      wordtags: [...state.wordtags, { WtTgID: tagId, WtWoID: termId }],
    }));
    this.persistSet('wordtags');
    // TODO
  }

  public deleteTermTag(tagId: TagsId) {
    this.dataStore.update(({ wordtags, tags, ...rest }) => ({
      ...rest,
      wordtags: wordtags.filter(({ WtTgID }) => WtTgID !== tagId),
      tags: tags.filter(({ TgID }) => TgID !== tagId),
    }));
    // TODO persist deletes
    this.persistSet('wordtags');
    this.persistSet('tags');
  }

  public addTagToText(tagId: Tags2Id, textId: TextsId) {
    this.dataStore.update((state) => ({
      ...state,
      texttags: [...state.texttags, { TtT2ID: tagId, TtTxID: textId }],
    }));
    this.persistSet('texttags');
  }

  public deleteTextTag(tagId: Tags2Id) {
    this.dataStore.update(({ texttags, archtexttags, tags2, ...rest }) => ({
      ...rest,
      texttags: texttags.filter(({ TtT2ID }) => TtT2ID !== tagId),
      archtexttags: archtexttags.filter(({ AgT2ID }) => AgT2ID !== tagId),
      tags2: tags2.filter(({ T2ID }) => T2ID !== tagId),
    }));
    // TODO persist multiple at a time
    this.persistSet('tags2');
    this.persistSet('texttags');
    this.persistSet('archtexttags');
  }

  public addLongText(longTextForm: LongTextForm) {
    window.alert('TODO ADDLONGTEXT');
  }

  public addMultipleTerms(terms: Words[]) {
    const mappedTerms = terms.map((word, ii) => {
      if (!word.WoText) {
        console.log('TEST123-problem:', word, ii);
      }
      return {
        ...word,
        // TODO check if right
        WoStatusChanged: Date.now(),
        WoTextLC: word.WoText.toLowerCase(),
        WoTodayScore: 0,
        WoTomorrowScore: 0,
        // TODO ? whats this
        WoRandom: 0,
      };
    });
    this.dataStore.update((state) => {
      const ids = state.words.map((word) => word.WoID);
      const maxId = Math.max(...ids) + 1;
      if (IDIsUnique(maxId, ids)) {
        return {
          ...state,
          // TODO mapping twice not ideal here
          words: [
            ...state.words,
            ...mappedTerms.map((word, ii) => ({ ...word, WoID: maxId + ii })),
          ],
        };
      }
    });

    // TODO multiple insert
    this.persistSet('words');
    mappedTerms.forEach((term) => this.persistInsert('words', term));
  }

  public restoreFromBackup(file: File) {
    // window.alert('TODO RESTORING FROM BACKUP ' + file.name);
    // const reader = new FileReader();
    // const buffer: string[] = [];
    // reader.onload = async (e) => {
    //   const text = e.target.result;
    //   Gunzip.ungzip(text, function (err, dezipped) {
    //     console.log('gunzip',dezipped.toString());
    //   });
    // };
    // const text = reader.readAsText(file);
    // console.log('TEST123', text);
    const reader = new FileReader();
    const fileExt = file.name.split('.')[file.name.split('.').length - 1];
    reader.onload = (ev) => {
      const readData = ev.target?.result as string;
      if (!readData) {
        return;
      }
      if (fileExt === 'json') {
        const jsonData = JSON.parse(readData);

        console.log(jsonData);
        return;
      }
      if (fileExt === 'sql') {
        const parsedData = {};
        // TODO count how many columns in this table?
        const splitTablesRegex = new RegExp(' *CREATE TABLE `', 'g');
        const tableStrings = readData.split(splitTablesRegex).slice(1);
        tableStrings.forEach((tableVal) => {
          const tableKey = tableVal.slice(0, tableVal.indexOf('` '));
          // valid tableKey
          if (Object.keys(Persistable).includes(tableKey)) {
            const entryVals = tableVal.split('INSERT INTO').slice(1);
            if (entryVals.length > 0) {
              const entryValRegex = new RegExp(
                ` ${tableKey} VALUES\\((.*)\\);\n`
              );
              const entryVal = entryVals[0].match(entryValRegex);
              if (entryVal && entryVal?.length > 1) {
                const entryColRegex = new RegExp('(.*),');
                entryVal[1].split();
              }
            }
          }
        });
        // const tableName=
      }
    };
    reader.readAsText(file);
  }

  private serialize(backupType: 'JSON' | 'SQL') {
    const {
      archivedtexts,
      archtexttags,
      languages,
      sentences,
      settings,
      tags,
      tags2,
      textitems,
      texts,
      texttags,
      words,
      wordtags,
    } = this.dataStore.getValue();
    if (backupType === 'JSON') {
      return JSON.stringify({
        archivedtexts,
        archtexttags,
        languages,
        sentences,
        settings,
        tags,
        tags2,
        textitems,
        texts,
        texttags,
        words,
        wordtags,
      });
    }

    const serializedSql = serializeJsonToSQL({
      archivedtexts,
      archtexttags,
      languages,
      sentences,
      settings,
      tags,
      tags2,
      textitems,
      texts,
      texttags,
      words,
      wordtags,
    });
    return serializedSql;
  }

  public downloadBackup(backupType: 'JSON' | 'SQL') {
    const serializedData = this.serialize(backupType);
    console.log(backupType);

    Gzip();
    // deflate((serializedData as string))
    downloadTextFile(serializedData, backupType);
  }

  public emptyDatabase() {
    this.dataStore.update((state) => ({
      settings: state.settings,
      archivedtexts: [],
      archtexttags: [],
      languages: [],
      parsedTexts: [],
      sentences: [],
      tags2: [],
      tags: [],
      textitems: [],
      texts: [],
      texttags: [],
      words: [],
      wordtags: [],
    }));

    this.persistSet('settings');
    this.persistSet('archivedtexts');
    this.persistSet('archtexttags');
    this.persistSet('languages');
    this.persistSet('parsedTexts');
    this.persistSet('sentences');
    this.persistSet('tags2');
    this.persistSet('tags');
    this.persistSet('textitems');
    this.persistSet('texts');
    this.persistSet('texttags');
    this.persistSet('words');
    this.persistSet('wordtags');

    this.persistEmpty();
  }

  public installDemoDatabase() {
    // TODO persist this better
    this.dataStore.update(() => createDemoDBInitialState());

    // TODO drop db
    // TODO installDemo handler?
    this.persistSet('settings');
    this.persistSet('archivedtexts');
    this.persistSet('archtexttags');
    this.persistSet('languages');
    this.persistSet('parsedTexts');
    this.persistSet('sentences');
    this.persistSet('tags2');
    this.persistSet('tags');
    this.persistSet('textitems');
    this.persistSet('texts');
    this.persistSet('texttags');
    this.persistSet('words');
    this.persistSet('wordtags');
  }

  public archiveText(archID: TextsId) {
    // TODO hashmap
    /**
     * 	$message3 = runsql('delete from ' . $tbpref . 'textitems where TiTxID = ' . $_REQUEST['arch'],
     * "Text items deleted");
     * $message2 = runsql('delete from ' . $tbpref . 'sentences where SeTxID = ' . $_REQUEST['arch'],
     * "Sentences deleted");
     * $message4 = runsql('insert into ' . $tbpref . 'archivedtexts (AtLgID, AtTitle, AtText, AtAnnotatedText, AtAudioURI, AtSourceURI) select TxLgID, TxTitle, TxText, TxAnnotatedText, TxAudioURI, TxSourceURI from ' . $tbpref . 'texts where TxID = ' . $_REQUEST['arch'], "Archived Texts saved");
     * $id = get_last_key();
     * runsql('insert into ' . $tbpref . 'archtexttags (AgAtID, AgT2ID) select ' . $id . ', TtT2ID from ' . $tbpref . 'texttags where TtTxID = ' . $_REQUEST['arch'], "");
     * $message1 = runsql('delete from ' . $tbpref . 'texts where TxID = ' . $_REQUEST['arch'], "Texts deleted");
     * $message = $message4 . " / " . $message1 . " / " . $message2 . " / " . $message3;
     * adjust_autoincr('texts','TxID');
     * adjust_autoincr('sentences','SeID');
     * adjust_autoincr('textitems','TiID');
     * runsql("DELETE " . $tbpref . "texttags FROM (" . $tbpref . "texttags LEFT JOIN " . $tbpref . "texts on TtTxID = TxID) WHERE TxID IS NULL",'')
     */
    this.dataStore.update(({ texts, archivedtexts, ...state }) => {
      const archIndex = texts.findIndex((text) => text.TxID === archID);
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
    this.persistSet('archivedtexts');
    this.persistSet('texts');
  }

  public unarchiveText() {
    window.alert('TODO UNARCHIVETEXT');
  }

  public setSettings(settings: Partial<Settings>) {
    this.dataStore.update(({ settings: oldSettings, ...state }) => ({
      ...state,
      settings: Object.entries({
        ...Object.fromEntries(
          oldSettings.map(({ StValue, StKey }) => [StKey, StValue])
        ),
        ...settings,
      }).map(([key, val]) => ({ StKey: key, StValue: val })),
    }));
    Object.entries(settings).forEach(async ([key, val]) => {
      await this.persistDelete('settings', key);
      await this.persistInsert('settings', { StKey: key, StValue: val });
    });
  }

  public reparseText(textId: TextsId) {
    const { texts, languages } = this.dataStore.getValue();
    const parsingText = texts.find(({ TxID }) => TxID === textId);
    const parsingLanguage = languages.find(
      ({ LgID }) => LgID === parsingText?.TxLgID
    );
    const parsedText = splitCheckText(parsingText?.TxText, parsingLanguage, -1);
    this.dataStore.update(({ parsedTexts, ...rest }) => ({
      ...rest,
      parsedTexts: { ...parsedTexts, [textId]: parsedText },
    }));
  }

  public reparseAllTextsForLanguage(langId: LanguagesId) {
    const { texts } = this.dataStore.getValue();
    texts
      .filter((text) => text.TxLgID === langId)
      .forEach((text) => {
        this.reparseText(text.TxID);
      });
  }

  // TODO maybe make into a subclass of broader settings?
  public setActiveLanguage(langId: LanguagesId | null) {
    this.setSettings({ currentlanguage: langId });
    // this.dataStore.update(({ settings, ...state }) => {
    //   const currentLangIndex = settings.findIndex(
    //     (val) => val.StKey === 'currentlanguage'
    //   );
    //   return {
    //     ...state,
    //     settings: [
    //       ...settings.slice(0, currentLangIndex),
    //       { StKey: 'currentlanguage', StValue: langId },
    //       ...settings.slice(currentLangIndex + 1),
    //     ],
    //   };
    // });
    // this.persistSet('settings');
    // this.persistUpdate('settings', {
    //   StKey: 'currentlanguage',
    //   StValue: langId,
    // });
  }

  public async getTatoebaSentence(langKey: ThreeLetterString, word: string) {
    const tatoebaData = await this.TatoebaAPI.getPath('/unstable/sentences', {
      lang: langKey,
      q: word,
    });
    console.log('TATOEBA', tatoebaData.data);
  }

  constructor(private dataStore: DataStore) {
    this.getInitialAsync();
    const { languages } = this.dataStore.getValue();
    languages.forEach((lang) => {
      this.reparseAllTextsForLanguage(lang.LgID);
    });
    this.TatoebaAPI = new TatoebaOpenAPIWrapper();
  }

  private async getInitialAsync() {
    const { getAsync: persistGetter } = MyPersistanceHandles;
    if (!persistGetter) {
      return;
    }
    Promise.all(
      Object.keys(Persistable).map(async (key) => {
        const val = await persistGetter(key);
        return [key, val];
      })
    ).then((val) => {
      const valObj = Object.fromEntries(val);
      this.dataStore.update((state) => {
        console.log('GOTObjs', { ...state, ...valObj });
        return { ...state, ...valObj };
      });
    });
  }
}

export const dataService = new DataService(dataStore);

/**
 *
 * @param input
 * @param output
 */
async function do_gzip(input, output) {
  const gzip = createGzip();
  const source = createReadStream(input);
  const destination = createWriteStream(output);
  await pipe(source, gzip, destination);
}
