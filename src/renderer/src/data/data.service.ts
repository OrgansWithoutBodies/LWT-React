// import { Gzip } from 'browserify-zlib';
import demoDB from '../demo_db.json';

import type { Persistable } from '../../../shared/Persistable';
import type { NumericalStrength } from '../pages/StrengthMap';
import { splitCheckText } from '../pages/utils';
import {
  DataState,
  dataStore,
  DataStore,
  MyPersistanceHandles,
} from './data.storage';
import { downloadTextFile } from './downloadTxtFile';

// import { createReadStream, createWriteStream } from 'original-fs';
import { getCurrentTimeAsString } from '../pages/preValidateMaps';
import { TatoebaOpenAPIWrapper, ThreeLetterString } from '../pages/TatoebaAPI';
import type {
  AddNewTextType,
  AddNewWordType,
  Language,
  LanguageNoId,
  Sentence,
  Tag,
  Tag2NoId,
  Word,
} from './parseMySqlDump';
import { serializeJsonToSQL } from './serializeJsonToSQL';
import type { Settings } from './settings';
import {
  ArchivedTextId,
  LanguagesId,
  SettingsId,
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
      console.log('INSERT', insertedVal);
      return insertedVal;
    }
  }

  // TODO
  // private async persistInsertMany(key: keyof DataState, insertVal: any) {
  //   if (MyPersistanceHandles.insert) {
  //     const { insert: inserter } = MyPersistanceHandles;
  //     const insertedVal = await inserter(key, insertVal);
  //     return insertedVal;
  //   }
  // }

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
      const maxId = (Math.max(...ids) + 1) as LanguagesId;
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
  /**
   * addSentences
   *
   * @param sentences
   */
  public addSentences(sentences: Sentence[]) {
    this.dataStore.update((state) => ({
      ...state,
      sentences: [...state.sentences, ...sentences],
    }));
    this.persistInsert('sentences', sentences);
    this.persistSet('sentences');
  }
  public deleteArchivedText(textId: ArchivedTextId) {
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
      maxId = (Math.max(...ids) + 1) as TextsId;
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

  public addTag(tag: Tag) {
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

  public editTag(chgId: TagsId, tag: Tag) {
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
  public editTerm(term: Word) {
    this.dataStore.update((state) => {
      const editedWordIndex = state.words.findIndex(
        (val) => val.WoID === term.WoID
      );
      const editingWord = state.words[editedWordIndex];
      const filteredWords = [
        ...state.words.slice(0, editedWordIndex),
        ...state.words.slice(editedWordIndex + 1),
      ];
      return {
        ...state,
        notificationMessage: { txt: `Edited Word ${term.WoText}` },
        words: [
          ...filteredWords,
          {
            ...editingWord,
            ...term,
          },
        ],
      };
    });
    this.persistSet('words');
  }

  public editLanguage(newData: Language) {
    window.alert(`TODO-editLanguage${newData}`);
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

  public addTextTag(tag: Tag2NoId) {
    let maxId = -1 as Tags2Id;
    this.dataStore.update((state) => {
      const ids = state.tags2.map((tag) => tag.T2ID);
      maxId = (Math.max(...ids) + 1) as Tags2Id;
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
    return maxId;
  }

  public deleteText(textId: TextsId) {
    this.dataStore.update((state) => ({
      ...state,
      notificationMessage: { txt: `Removed Text id=${textId}` },
      texts: state.texts.filter((text) => text.TxID !== textId),
    }));
    this.persistSet('texts');
    this.persistDelete('texts', textId);
  }
  // TODO this can really act as the only function
  public deleteMultipleTexts(textIds: TextsId[]) {
    this.dataStore.update((state) => ({
      ...state,
      notificationMessage: {
        txt: `Removed ${textIds.length} Text${textIds.length === 1 ? '' : 's'}`,
      },
      texts: state.texts.filter((text) => !textIds.includes(text.TxID)),
    }));
    this.persistSet('texts');
    this.persistDelete('texts', textIds);
  }
  public deleteMultipleArchivedTexts(textIds: ArchivedTextId[]) {
    this.dataStore.update((state) => ({
      ...state,
      notificationMessage: {
        txt: `Removed ${textIds.length} Archived Text${
          textIds.length === 1 ? '' : 's'
        }`,
      },
      archivedtexts: state.archivedtexts.filter(
        (text) => !textIds.includes(text.AtID)
      ),
    }));
    this.persistSet('texts');
    this.persistDelete('texts', textIds);
  }

  public addTerm(word: AddNewWordType) {
    this.dataStore.update((state) => {
      const ids = state.words.map((word) => word.WoID);
      const maxId = (Math.max(...ids) + 1) as WordsId;
      console.log('TEST123-addterm', maxId, ids);
      if (IDIsUnique(maxId, ids)) {
        return {
          ...state,
          notificationMessage: { txt: `Added New Word ${word.WoText}` },
          words: [
            ...state.words,
            {
              ...word,
              WoTextLC: word.WoText.toLowerCase(),
              WoID: maxId,
              WoTodayScore: 0,
              WoTomorrowScore: 0,
              WoRandom: 0,
            },
          ],
        };
      }
    });
    this.persistSet('words');
    this.persistInsert('words', word);
    console.log('TEST123-added word', word, this.dataStore.getValue().words);
  }

  public deleteTerm(termId: WordsId) {
    this.dataStore.update((state) => ({
      ...state,
      notificationMessage: { txt: `Removed Term id=${termId}` },
      words: state.words.filter((word) => word.WoID !== termId),
    }));
    this.persistSet('words');
    this.persistDelete('words', termId);
  }

  public addTagToTerm(tagId: TagsId, termId: WordsId) {
    this.dataStore.update((state) => ({
      ...state,
      notificationMessage: { txt: 'Added Tag To Term' },
      wordtags: [...state.wordtags, { WtTgID: tagId, WtWoID: termId }],
    }));
    this.persistSet('wordtags');
    // TODO
  }

  public deleteTermTag(tagId: TagsId) {
    this.dataStore.update(({ wordtags, tags, ...rest }) => ({
      ...rest,
      notificationMessage: { txt: 'Deleted Term Tag' },

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
      notificationMessage: { txt: 'Added Tag to Text' },
      texttags: [...state.texttags, { TtT2ID: tagId, TtTxID: textId }],
    }));
    this.persistSet('texttags');
  }
  public addTagToMultipleTexts(tagString: string, textIds: TextsId[]) {
    this.dataStore.update((state) => {
      const foundTag = state.tags2.find(
        (tag) => tag.T2Text === tagString.trim()
      );
      const tagId =
        foundTag === undefined
          ? this.addTextTag({ T2Text: tagString })
          : foundTag.T2ID;
      return {
        ...state,
        notificationMessage: { txt: 'Added Tag to Text' },
        texttags: [
          ...state.texttags,
          ...textIds.map((TtTxID) => ({ TtT2ID: tagId, TtTxID })),
        ],
      };
    });
    this.persistSet('texttags');
  }

  public deleteTextTag(tagId: Tags2Id) {
    this.dataStore.update(({ texttags, archtexttags, tags2, ...rest }) => ({
      ...rest,
      texttags: texttags.filter(({ TtT2ID }) => TtT2ID !== tagId),
      notificationMessage: { txt: 'Deleted Text Tag' },
      archtexttags: archtexttags.filter(({ AgT2ID }) => AgT2ID !== tagId),
      tags2: tags2.filter(({ T2ID }) => T2ID !== tagId),
    }));
    // TODO persist multiple at a time
    this.persistSet('tags2');
    this.persistSet('texttags');
    this.persistSet('archtexttags');
  }

  public deleteMultipleTextTags(tagIds: Tags2Id[]) {
    this.dataStore.update(({ texttags, archtexttags, tags2, ...rest }) => ({
      ...rest,
      texttags: texttags.filter(({ TtT2ID }) => !tagIds.includes(TtT2ID)),
      notificationMessage: {
        txt: `Deleted ${tagIds.length} Text Tag${
          tagIds.length === 1 ? '' : 's'
        }`,
      },
      archtexttags: archtexttags.filter(
        ({ AgT2ID }) => !tagIds.includes(AgT2ID)
      ),
      tags2: tags2.filter(({ T2ID }) => !tagIds.includes(T2ID)),
    }));
    // TODO persist multiple at a time
    this.persistSet('tags2');
    this.persistSet('texttags');
    this.persistSet('archtexttags');
  }

  public deleteMultipleTermTags(tagIds: TagsId[]) {
    this.dataStore.update(({ wordtags, tags, ...rest }) => ({
      ...rest,
      wordtags: wordtags.filter(({ WtTgID }) => !tagIds.includes(WtTgID)),
      notificationMessage: {
        txt: `Deleted ${tagIds.length} Text Tag${
          tagIds.length === 1 ? '' : 's'
        }`,
      },
      tags: tags.filter(({ TgID }) => !tagIds.includes(TgID)),
    }));
    this.persistSet('tags');
    this.persistSet('wordtags');
  }

  public addLongText(longTextForm: LongTextForm) {
    window.alert('TODO ADDLONGTEXT');
  }

  public addMultipleTerms(terms: Word[]) {
    const mappedTerms = terms.map((word) => ({
      ...word,
      // TODO move these to prevalidate?
      WoStatusChanged: getCurrentTimeAsString(),
      // TODO make sure to do this on edit
      WoTextLC: word.WoText.toLowerCase(),
      WoTodayScore: 0,
      WoTomorrowScore: 0,
      // TODO ? whats this
      WoRandom: 0,
    }));
    this.dataStore.update((state) => {
      const ids = state.words.map((word) => word.WoID);
      const maxId = (Math.max(...ids) + 1) as WordsId;
      if (IDIsUnique(maxId, ids)) {
        return {
          ...state,
          notificationMessage: { txt: `Added ${terms.length} Terms` },
          // TODO mapping twice not ideal here
          words: [
            ...state.words,
            ...mappedTerms.map((word, ii) => ({
              ...word,
              WoID: (maxId + ii) as WordsId,
            })),
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

    // Gzip();
    // deflate((serializedData as string))
    downloadTextFile(serializedData, backupType);
  }

  public emptyDatabase() {
    this.dataStore.update((state) => ({
      notificationMessage: { txt: 'Emptied Database!' },
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
  public installDefaultSettings() {
    this.dataStore.update(() => ({
      ...Object.fromEntries(
        Object.entries(demoDB).filter(([key]) => key === 'settings')
      ),
      notificationMessage: { txt: 'Installed Default Settings' },
    }));
  }

  public installDemoDatabase() {
    // TODO persist this better
    this.dataStore.update(() => ({
      ...demoDB,
      notificationMessage: { txt: 'Installed Demo DB' },
    }));

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

    Object.keys(demoDB).forEach((fieldName) => {
      this.persistDelete(fieldName);
      demoDB[fieldName];
      this.persistInsert(fieldName);
    });
  }

  public archiveText(archID: TextsId) {
    // TODO hashmap
    /**
     * 	message3 = runsql('delete from ' . tbpref . 'textitems where TiTxID = ' . $_REQUEST['arch'],
     * "Text items deleted");
     * message2 = runsql('delete from ' . tbpref . 'sentences where SeTxID = ' . $_REQUEST['arch'],
     * "Sentences deleted");
     * message4 = runsql('insert into ' . tbpref . 'archivedtexts (AtLgID, AtTitle, AtText, AtAnnotatedText, AtAudioURI, AtSourceURI) select TxLgID, TxTitle, TxText, TxAnnotatedText, TxAudioURI, TxSourceURI from ' . tbpref . 'texts where TxID = ' . $_REQUEST['arch'], "Archived Texts saved");
     * id = get_last_key();
     * runsql('insert into ' . tbpref . 'archtexttags (AgAtID, AgT2ID) select ' . id . ', TtT2ID from ' . tbpref . 'texttags where TtTxID = ' . $_REQUEST['arch'], "");
     * message1 = runsql('delete from ' . tbpref . 'texts where TxID = ' . $_REQUEST['arch'], "Texts deleted");
     * message = message4 . " / " . message1 . " / " . message2 . " / " . message3;
     * adjust_autoincr('texts','TxID');
     * adjust_autoincr('sentences','SeID');
     * adjust_autoincr('textitems','TiID');
     * runsql("DELETE " . tbpref . "texttags FROM (" . tbpref . "texttags LEFT JOIN " . tbpref . "texts on TtTxID = TxID) WHERE TxID IS NULL",'')
     */
    this.dataStore.update(({ texts, archivedtexts, ...state }) => {
      const archIndex = texts.findIndex((text) => text.TxID === archID);
      console.log('TEST123-arch', archIndex);
      const toArchive = texts[archIndex];
      const poppedTexts = [
        ...texts.slice(0, archIndex),
        ...texts.slice(archIndex + 1),
      ];
      return {
        ...state,
        texts: poppedTexts,
        notificationMessage: { txt: 'Archived Text' },
        archivedtexts: [
          ...archivedtexts,
          {
            AtAnnotatedText: toArchive.TxAnnotatedText,
            AtAudioURI: toArchive.TxAudioURI,
            AtID: toArchive.TxID as any as ArchivedTextId,
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

  public unarchiveText(unarchID: ArchivedTextId) {
    // TODO hashmap
    /**
     * 	message3 = runsql('delete from ' . tbpref . 'textitems where TiTxID = ' . $_REQUEST['arch'],
     * "Text items deleted");
     * message2 = runsql('delete from ' . tbpref . 'sentences where SeTxID = ' . $_REQUEST['arch'],
     * "Sentences deleted");
     * message4 = runsql('insert into ' . tbpref . 'archivedtexts (AtLgID, AtTitle, AtText, AtAnnotatedText, AtAudioURI, AtSourceURI) select TxLgID, TxTitle, TxText, TxAnnotatedText, TxAudioURI, TxSourceURI from ' . tbpref . 'texts where TxID = ' . $_REQUEST['arch'], "Archived Texts saved");
     * id = get_last_key();
     * runsql('insert into ' . tbpref . 'archtexttags (AgAtID, AgT2ID) select ' . id . ', TtT2ID from ' . tbpref . 'texttags where TtTxID = ' . $_REQUEST['arch'], "");
     * message1 = runsql('delete from ' . tbpref . 'texts where TxID = ' . $_REQUEST['arch'], "Texts deleted");
     * message = message4 . " / " . message1 . " / " . message2 . " / " . message3;
     * adjust_autoincr('texts','TxID');
     * adjust_autoincr('sentences','SeID');
     * adjust_autoincr('textitems','TiID');
     * runsql("DELETE " . tbpref . "texttags FROM (" . tbpref . "texttags LEFT JOIN " . tbpref . "texts on TtTxID = TxID) WHERE TxID IS NULL",'')
     */
    this.dataStore.update(({ texts, archivedtexts, ...state }) => {
      const index = archivedtexts.findIndex((text) => text.AtID === unarchID);
      const toArchive = archivedtexts[index];
      const poppedTexts = [
        ...archivedtexts.slice(0, index),
        ...archivedtexts.slice(index + 1),
      ];
      return {
        ...state,
        archivedtexts: poppedTexts,
        notificationMessage: { txt: 'Archived Text' },
        texts: [
          ...texts,
          {
            TxAnnotatedText: toArchive.AtAnnotatedText,
            TxAudioURI: toArchive.AtAudioURI,
            TxID: toArchive.AtID as any as TextsId,
            TxLgID: toArchive.AtLgID,
            TxSourceURI: toArchive.AtSourceURI,
            TxText: toArchive.AtText,
            TxTitle: toArchive.AtTitle,
          },
        ],
      };
    });
    this.persistSet('archivedtexts');
    this.persistSet('texts');
  }
  public unarchiveMultipleTexts(textIds: ArchivedTextId[]) {
    window.alert('TODO UNARCHIVETEXT');
  }

  public setSettings(settings: Partial<Settings>) {
    this.dataStore.update(({ settings: oldSettings, ...state }) => {
      const settingsAsObject = Object.fromEntries(
        oldSettings.map(({ StValue, StKey }) => [StKey, StValue])
      );
      return {
        ...state,
        // TODO setting-specific message here?
        notificationMessage: { txt: 'Updated Settings' },
        settings: Object.entries({
          ...settingsAsObject,
          ...settings,
        }).map(([key, val]) => ({ StKey: key as SettingsId, StValue: val })),
      };
    });
    this.persistSet('settings');
    Object.entries(settings).forEach(async ([key, val]) => {
      await this.persistDelete('settings', key);
      await this.persistInsert('settings', { StKey: key, StValue: val });
    });
  }

  public reparseText(textId: TextsId) {
    const { texts, languages } = this.dataStore.getValue();
    const parsingText = texts.find(({ TxID }) => TxID === textId);
    if (!parsingText) {
      return;
    }
    const parsingLanguage = languages.find(
      ({ LgID }) => LgID === parsingText.TxLgID
    );
    if (!parsingLanguage) {
      return;
    }
    const { symbolList: parsedText } = splitCheckText(
      parsingText.TxText,
      parsingLanguage
    );
    this.dataStore.update(({ parsedTexts, ...rest }) => ({
      ...rest,
      notificationMessage: { txt: `parsed text: ${parsingText?.TxTitle}` },
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

  public setActiveLanguage(langId: LanguagesId | undefined) {
    this.setSettings({ currentlanguage: langId });
  }

  public updateTermStrength(wordID: WordsId, newStrength: NumericalStrength) {
    const word = this.dataStore
      .getValue()
      .words.find((val) => val.WoID === wordID);
    console.log('TEST123-UPDATESTRENGTH', wordID, word, newStrength);
    if (!word) {
      return;
    }
    this.editTerm({ ...word, WoStatus: newStrength });
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
      this.dataStore.update((state) => ({ ...state, ...valObj }));
    });
  }
}

export const dataService = new DataService(dataStore);

// /**
//  *
//  * @param input
//  * @param output
//  */
// async function do_gzip(input, output) {
//   const gzip = createGzip();
//   const source = createReadStream(input);
//   const destination = createWriteStream(output);
//   await pipe(source, gzip, destination);
// }
