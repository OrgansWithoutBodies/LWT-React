// import { Gzip } from 'browserify-zlib';
import demoDB from '../demo_db.json';

import { Persistable } from '../../../shared/Persistable';
import type { NumericalStrength } from '../pages/StrengthMap';
import { downloadBackupFile } from '../utils/downloadTxtFile';
import { makeScoreRandomInsertUpdate, splitCheckText } from '../utils/utils';
import {
  DataState,
  DataStore,
  MyPersistanceHandles,
  dataStore,
} from './data.storage';

import { TatoebaOpenAPIWrapper } from '../plugins/TatoebaAPI';
import { serializeJsonToSQL } from '../utils/exports/serializeJsonToSQL';
import type {
  AddNewTextType,
  AddNewWordType,
  ArchivedText,
  Language,
  LanguageNoID,
  Sentence,
  Tag,
  Tag2NoID,
  Word,
} from '../utils/parseMySqlDump';
import { getCurrentTimeAsString } from './preValidateMaps';
import type { Settings } from './settings';
import {
  ArchivedTextID,
  LanguagesID,
  SentencesID,
  SettingsID,
  Tags2ID,
  TagsID,
  TextItemsID,
  TextsID,
  WordsID,
} from './validators';

export enum CRUD {
  Create,
  Read,
  Update,
  Delete,
}
// TODO most of these are actually just identical C.UD operations - formalize that
// TODO sometimes with a callback to add more object keys (maybe best handled in form submission?)
// TODO don't need to duplicate updates if we just retrigger the query observable on persist?
/**
 *
 * @param id
 * @param existingIDs
 */
function IDIsUnique<TBrand extends number>(
  id: number,
  existingIDs: TBrand[]
): id is TBrand {
  return !existingIDs.includes(id as any);
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
      console.log('TEST123-SETTING', value, key);
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

  public addLanguage(language: LanguageNoID) {
    this.dataStore.update((state) => {
      const ids = state.languages.map((lang) => lang.LgID);
      const maxID = (Math.max(...ids) + 1) as LanguagesID;
      return {
        ...state,
        notificationMessage: { txt: `Added New Language ${language.LgName}` },
        languages: [
          ...state.languages,
          {
            ...language,
            LgID: maxID,
          },
        ],
      };
    });

    this.persistSet('languages');
    this.persistInsert('languages', language);
  }

  public deleteLanguage(langID: LanguagesID) {
    this.dataStore.update((state) => ({
      ...state,
      languages: state.languages.filter((language) => language.LgID !== langID),
    }));

    this.persistSet('languages');
    this.persistDelete('languages', langID);
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
  public deleteArchivedText(textID: ArchivedTextID) {
    this.dataStore.update((state) => ({
      ...state,
      archivedtexts: state.archivedtexts.filter(
        (language) => language.AtID !== textID
      ),
    }));
    this.persistSet('archivedtexts');
    this.persistDelete('archivedtexts', textID);
  }

  public addText(text: AddNewTextType) {
    let maxID = null;
    this.dataStore.update((state) => {
      const ids = state.texts.map((text) => text.TxID);
      maxID = (Math.max(...ids) + 1) as TextsID;
      return {
        ...state,
        notificationMessage: { txt: `Added New Text ${text.TxTitle}` },
        texts: [
          ...state.texts,
          {
            ...text,
            TxID: maxID,
            // TODO
            TxAnnotatedText: '',
          },
        ],
      };
    });
    this.persistSet('texts');
    this.persistInsert('texts', text);
    return maxID;
  }

  public addTag(tag: Omit<Tag, 'TgID'>) {
    let maxID = null;
    this.dataStore.update((state) => {
      const ids = state.tags.map((tag) => tag.TgID);
      maxID = (Math.max(...ids) + 1) as TagsID;
      return {
        ...state,
        notificationMessage: { txt: `Added New Tag ${tag.TgText}` },
        tags: [
          ...state.tags,
          {
            ...tag,
            TgID: maxID,
          },
        ],
      };
    });
    this.persistSet('tags');
    this.persistInsert('tags', tag);
    if (maxID === null) {
      throw new Error('Error during tag creation or persist');
    }
    return maxID as TagsID;
  }

  public editTag(chgID: TagsID, tag: Tag) {
    this.dataStore.update((state) => {
      const ids = state.tags.map((tag) => tag.TgID);
      const maxID = (Math.max(...ids) + 1) as TagsID;
      return {
        ...state,
        notificationMessage: { txt: `Edited Tag ${tag.TgText}` },
        tags: [
          ...state.tags,
          {
            ...tag,
            TgID: maxID,
          },
        ],
      };
    });
    this.persistSet('tags');
    this.persistUpdate('tags', tag);
  }
  public editArchivedText(text: ArchivedText) {
    this.dataStore.update((state) => {
      const editedTextIndex = state.archivedtexts.findIndex(
        (val) => val.AtID === text.AtID
      );
      const mutableArchivedTexts = state.archivedtexts;
      mutableArchivedTexts[editedTextIndex] = text;
      return {
        ...state,
        notificationMessage: { txt: `Edited Archived Text ${text.AtTitle}` },
        archivedtexts: mutableArchivedTexts,
      };
    });
    this.persistSet('words');
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
    this.dataStore.update(({ languages: immutableLanguages, ...rest }) => {
      const languages = [...immutableLanguages];
      const idOfExistingValue = languages.findIndex(
        (lang) => lang.LgID === newData.LgID
      );

      languages[idOfExistingValue] = newData;
      return {
        ...rest,
        notificationMessage: { txt: `Edited Language ${newData.LgName}` },
        languages,
      };
    });
    this.persistSet('languages');
    this.persistUpdate('languages', newData);
  }

  public addTextTag(tag: Tag2NoID) {
    let maxID = -1 as Tags2ID;
    this.dataStore.update((state) => {
      const ids = state.tags2.map((tag) => tag.T2ID);
      maxID = (Math.max(...ids) + 1) as Tags2ID;
      return {
        ...state,
        notificationMessage: { txt: `Added New Text Tag ${tag.T2Text}` },
        tags2: [
          ...state.tags2,
          {
            ...tag,
            T2ID: maxID,
          },
        ],
      };
    });
    this.persistSet('tags2');
    this.persistInsert('tags2', tag);
    return maxID;
  }

  public deleteText(textID: TextsID) {
    this.dataStore.update((state) => ({
      ...state,
      notificationMessage: { txt: `Removed Text id=${textID}` },
      texts: state.texts.filter((text) => text.TxID !== textID),
    }));
    this.persistSet('texts');
    this.persistDelete('texts', textID);
  }
  // TODO this can really act as the only function
  public deleteMultipleTexts(textIDs: TextsID[]) {
    this.dataStore.update((state) => ({
      ...state,
      notificationMessage: {
        txt: `Removed ${textIDs.length} Text${textIDs.length === 1 ? '' : 's'}`,
      },
      texts: state.texts.filter((text) => !textIDs.includes(text.TxID)),
    }));
    this.persistSet('texts');
    this.persistDelete('texts', textIDs);
  }
  public deleteMultipleArchivedTexts(textIDs: ArchivedTextID[]) {
    this.dataStore.update((state) => ({
      ...state,
      notificationMessage: {
        txt: `Removed ${textIDs.length} Archived Text${
          textIDs.length === 1 ? '' : 's'
        }`,
      },
      archivedtexts: state.archivedtexts.filter(
        (text) => !textIDs.includes(text.AtID)
      ),
    }));
    this.persistSet('texts');
    this.persistDelete('texts', textIDs);
  }

  public addTerm(word: AddNewWordType) {
    this.dataStore.update((state) => {
      const ids = state.words.map((word) => word.WoID);
      const maxID = (Math.max(...ids) + 1) as WordsID;
      if (IDIsUnique(maxID, ids)) {
        return {
          ...state,
          notificationMessage: { txt: `Added New Word ${word.WoText}` },
          words: [
            ...state.words,
            {
              ...word,
              WoTextLC: word.WoText.toLowerCase(),
              WoID: maxID,
              ...makeScoreRandomInsertUpdate({ word }),
            },
          ],
        };
      }
    });
    this.persistSet('words');
    this.persistInsert('words', word);
    console.log('TEST123-added word', word, this.dataStore.getValue().words);
  }

  public deleteTerm(termID: WordsID) {
    this.dataStore.update((state) => ({
      ...state,
      notificationMessage: { txt: `Removed Term id=${termID}` },
      words: state.words.filter((word) => word.WoID !== termID),
    }));
    this.persistSet('words');
    this.persistDelete('words', termID);
  }

  public addTagToTerm(tagID: TagsID, termID: WordsID) {
    this.dataStore.update((state) => ({
      ...state,
      notificationMessage: { txt: 'Added Tag To Term' },
      wordtags: [...state.wordtags, { WtTgID: tagID, WtWoID: termID }],
    }));
    this.persistSet('wordtags');
    // TODO
  }
  public setTermTextUppercase(termIDs: WordsID[]) {
    this.dataStore.update((state) => ({
      ...state,
      notificationMessage: { txt: `Made ${termIDs.length} terms uppercase` },
      words: state.words.map((word) =>
        termIDs.includes(word.WoID)
          ? { ...word, WoText: word.WoTextLC.toUpperCase() }
          : word
      ),
    }));
    this.persistSet('words');
  }
  public setTermTextLowercase(termIDs: WordsID[]) {
    this.dataStore.update((state) => ({
      ...state,
      notificationMessage: { txt: `Made ${termIDs.length} terms lowercase` },
      words: state.words.map((word) =>
        termIDs.includes(word.WoID) ? { ...word, WoText: word.WoTextLC } : word
      ),
    }));
    this.persistSet('words');
  }
  public addPotentiallyNewTagToTerms(tagString: string, termIDs: WordsID[]) {
    this.dataStore.update((state) => {
      const foundTag = state.tags.find((val) => val.TgText === tagString);
      const tagID = foundTag
        ? foundTag.TgID
        : this.addTag({ TgText: tagString });
      return {
        ...state,
        notificationMessage: { txt: 'Added Tag To Term' },
        wordtags: [
          ...state.wordtags,
          ...termIDs.map((termID) => ({ WtTgID: tagID, WtWoID: termID })),
        ],
      };
    });
    this.persistSet('wordtags');
    // TODO
  }

  public deleteTermTag(tagID: TagsID) {
    this.dataStore.update(({ wordtags, tags, ...rest }) => ({
      ...rest,
      notificationMessage: { txt: 'Deleted Term Tag' },

      wordtags: wordtags.filter(({ WtTgID }) => WtTgID !== tagID),
      tags: tags.filter(({ TgID }) => TgID !== tagID),
    }));
    // TODO persist deletes
    this.persistSet('wordtags');
    this.persistSet('tags');
  }

  public addTagToText(tagID: Tags2ID, textID: TextsID) {
    this.dataStore.update((state) => ({
      ...state,
      notificationMessage: { txt: 'Added Tag to Text' },
      texttags: [...state.texttags, { TtT2ID: tagID, TtTxID: textID }],
    }));
    this.persistSet('texttags');
  }
  public addTagToMultipleTexts(tagString: string, textIDs: TextsID[]) {
    this.dataStore.update((state) => {
      const foundTag = state.tags2.find(
        (tag) => tag.T2Text === tagString.trim()
      );
      const tagID =
        foundTag === undefined
          ? this.addTextTag({ T2Text: tagString })
          : foundTag.T2ID;
      return {
        ...state,
        notificationMessage: { txt: 'Added Tag to Text' },
        texttags: [
          ...state.texttags,
          ...textIDs.map((TtTxID) => ({ TtT2ID: tagID, TtTxID })),
        ],
      };
    });
    this.persistSet('texttags');
  }

  public deleteTextTag(tagID: Tags2ID) {
    this.dataStore.update(({ texttags, archtexttags, tags2, ...rest }) => ({
      ...rest,
      texttags: texttags.filter(({ TtT2ID }) => TtT2ID !== tagID),
      notificationMessage: { txt: 'Deleted Text Tag' },
      archtexttags: archtexttags.filter(({ AgT2ID }) => AgT2ID !== tagID),
      tags2: tags2.filter(({ T2ID }) => T2ID !== tagID),
    }));
    // TODO persist multiple at a time
    this.persistSet('tags2');
    this.persistSet('texttags');
    this.persistSet('archtexttags');
  }

  public deleteMultipleTextTags(tagIDs: Tags2ID[]) {
    this.dataStore.update(({ texttags, archtexttags, tags2, ...rest }) => ({
      ...rest,
      texttags: texttags.filter(({ TtT2ID }) => !tagIDs.includes(TtT2ID)),
      notificationMessage: {
        txt: `Deleted ${tagIDs.length} Text Tag${
          tagIDs.length === 1 ? '' : 's'
        }`,
      },
      archtexttags: archtexttags.filter(
        ({ AgT2ID }) => !tagIDs.includes(AgT2ID)
      ),
      tags2: tags2.filter(({ T2ID }) => !tagIDs.includes(T2ID)),
    }));
    // TODO persist multiple at a time
    this.persistSet('tags2');
    this.persistSet('texttags');
    this.persistSet('archtexttags');
  }

  public deleteMultipleTermTags(tagIDs: TagsID[]) {
    this.dataStore.update(({ wordtags, tags, ...rest }) => ({
      ...rest,
      wordtags: wordtags.filter(({ WtTgID }) => !tagIDs.includes(WtTgID)),
      notificationMessage: {
        txt: `Deleted ${tagIDs.length} Text Tag${
          tagIDs.length === 1 ? '' : 's'
        }`,
      },
      tags: tags.filter(({ TgID }) => !tagIDs.includes(TgID)),
    }));
    this.persistSet('tags');
    this.persistSet('wordtags');
  }

  public addMultipleTexts(texts: AddNewTextType[]) {
    // TODO insertmany
    texts.forEach((text) => {
      this.addText(text);
    });
  }

  public addMultipleTags(tagList: string[]) {
    const uniqueTags = [...new Set(tagList)];
    const ids = this.dataStore.getValue().tags.map((tag) => tag.TgID);
    const maxID = (Math.max(...ids) + 1) as TagsID;
    if (IDIsUnique(maxID, ids)) {
      const newTagList = uniqueTags.map((tagText, ii) => ({
        TgID: (maxID + ii) as TagsID,
        TgText: tagText,
      }));
      this.dataStore.update((state) => ({
        ...state,
        notificationMessage: { txt: `Added ${uniqueTags.length} Tags` },
        tags: [...state.tags, ...newTagList],
      }));
      this.persistSet('tags');
      console.log('TEST123-addedtags', newTagList, uniqueTags);
      return newTagList;
    }
    return null;
  }

  public addMultipleTerms(terms: AddNewWordType[]) {
    const termsHashMapKeyedByText = this.dataStore
      .getValue()
      .tags.map((val) => [val.TgText, val] as [string, Tag]);
    const mappedTerms = terms.map((word) => ({
      ...word,
      // TODO move these to prevalidate?
      WoStatusChanged: getCurrentTimeAsString(),
      // TODO make sure to do this on edit
      WoTextLC: word.WoText.toLowerCase(),
      ...makeScoreRandomInsertUpdate({ word }),
    }));
    console.log(
      'TEST123-tags',
      terms.map((val) => val.taglist)
    );
    const newTags = terms
      .map((val) =>
        val.taglist.filter((tag) => termsHashMapKeyedByText[tag] === undefined)
      )
      .flat();
    this.addMultipleTags(newTags);
    this.dataStore.update((state) => {
      const ids = state.words.map((word) => word.WoID);
      const tagIDHashmapByText: Record<string, TagsID> = Object.fromEntries(
        state.tags.map((tag) => [tag.TgText, tag.TgID])
      );
      console.log('TEST123-tagIDHashmapByText', tagIDHashmapByText);
      const maxID = (Math.max(...ids) + 1) as WordsID;
      if (IDIsUnique(maxID, ids)) {
        return {
          ...state,
          notificationMessage: { txt: `Added ${terms.length} Terms` },
          wordtags: [
            ...state.wordtags,
            ...mappedTerms
              .map((val, ii) => {
                return val.taglist.map((tag) => ({
                  WtTgID: tagIDHashmapByText[tag]!,
                  WtWoID: (maxID + ii) as WordsID,
                }));
              })
              .flat(),
          ],
          // TODO mapping twice not ideal here
          words: [
            ...state.words,
            ...mappedTerms.map((word, ii) => ({
              ...word,
              WoID: (maxID + ii) as WordsID,
            })),
          ],
          // tags:
        };
      }
    });

    // TODO multiple insert
    this.persistSet('words');
    this.persistSet('wordtags');
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
        // TODO
        // const parsedData = {};
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
                // TODO
                // const entryColRegex = new RegExp('(.*),');
                // entryVal[1].split();
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

    // TODO
    // Gzip();
    // deflate((serializedData as string))
    downloadBackupFile(serializedData, backupType);
  }

  public emptyDatabase() {
    this.dataStore.update((state) => ({
      notificationMessage: { txt: 'Emptied Database!' },
      settings: state.settings,
      archivedtexts: [],
      archtexttags: [],
      languages: [],
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
    this.persistSet('sentences');
    this.persistSet('tags2');
    this.persistSet('tags');
    this.persistSet('textitems');
    this.persistSet('texts');
    this.persistSet('texttags');
    this.persistSet('words');
    this.persistSet('wordtags');

    Object.keys(demoDB).forEach((fieldName) => {
      // TODO
      this.persistDelete(fieldName);
      this.persistInsert(fieldName, demoDB[fieldName]);
    });
  }

  public archiveText(archID: TextsID) {
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
        notificationMessage: { txt: `Archived Text ${toArchive.TxTitle}` },
        archivedtexts: [
          ...archivedtexts,
          {
            AtAnnotatedText: toArchive.TxAnnotatedText,
            AtAudioURI: toArchive.TxAudioURI,
            AtID: toArchive.TxID as any as ArchivedTextID,
            AtLgID: toArchive.TxLgID,
            AtSourceURI: toArchive.TxSourceURI,
            AtText: toArchive.TxText,
            AtTitle: toArchive.TxTitle,
          },
        ],
      };
    });

    if (
      this.dataStore
        .getValue()
        .settings.find(
          (val) =>
            val.StKey === 'currenttext' &&
            (val.StValue as any as TextsID) === archID
        ) !== undefined
    ) {
      this.setActiveText(null);
    }
    this.persistSet('archivedtexts');
    this.persistSet('texts');
  }

  public unarchiveText(unarchID: ArchivedTextID) {
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
        notificationMessage: { txt: `Unarchived Text ${toArchive.AtTitle}` },
        texts: [
          ...texts,
          {
            TxAnnotatedText: toArchive.AtAnnotatedText,
            TxAudioURI: toArchive.AtAudioURI,
            TxID: toArchive.AtID as any as TextsID,
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
  public unarchiveMultipleTexts(textIDs: ArchivedTextID[]) {
    // TODO updateMany
    textIDs.forEach((textID) => this.unarchiveText(textID));
  }
  public archiveMultipleTexts(textIDs: TextsID[]) {
    // TODO updateMany
    textIDs.forEach((textID) => this.archiveText(textID));
  }

  public setSettings(settings: Partial<Settings>) {
    console.log('TEST123-settings', settings);
    const changingKeys = Object.keys(settings);
    // sorta hacky work around to make more verbose
    const isSingleSetting = changingKeys.length === 1;
    this.dataStore.update(({ settings: oldSettings, ...state }) => ({
      ...state,
      notificationMessage: {
        txt: isSingleSetting
          ? `Updated Setting ${changingKeys[0]}`
          : // TODO pretty name
            // : ${settings[changingKeys[0]]}`
            'Updated Settings',
      },
      settings: Object.entries({
        ...Object.fromEntries(
          oldSettings.map((val) => [val.StKey, val.StValue])
        ),
        ...settings,
      }).map(([key, val]) => ({
        StKey: key as SettingsID,
        StValue: val as any,
      })),
    }));
    this.persistSet('settings');
    Object.entries(settings).forEach(async ([key, val]) => {
      await this.persistDelete('settings', key);
      await this.persistInsert('settings', { StKey: key, StValue: val });
    });
  }

  public reparseText(textID: TextsID) {
    const { texts, languages, sentences, textitems } =
      this.dataStore.getValue();
    const filteredSentences = sentences.filter((val) => val.SeTxID !== textID);
    const filteredTextItems = textitems.filter((val) => val.TiTxID !== textID);
    const parsingText = texts.find(({ TxID }) => TxID === textID);
    if (!parsingText) {
      return;
    }
    const parsingLanguage = languages.find(
      ({ LgID }) => LgID === parsingText.TxLgID
    );
    if (!parsingLanguage) {
      return;
    }
    const maxSentenceID = filteredSentences.reduce(
      (prev, curr) => (prev > curr.SeID ? prev : curr.SeID),
      -1 as SentencesID
    );
    const maxTextItemID = filteredTextItems.reduce(
      (prev, curr) => (prev > curr.TiID ? prev : curr.TiID),
      -1 as TextItemsID
    );
    const { symbolList: parsedTextItems, sArray: parsedSentences } =
      splitCheckText(
        parsingText,
        parsingLanguage,
        (maxSentenceID + 1) as SentencesID,
        (maxTextItemID + 1) as TextItemsID
      );
    this.dataStore.update(({ ...rest }) => ({
      ...rest,
      notificationMessage: { txt: `parsed text: ${parsingText?.TxTitle}` },
      textitems: [...filteredTextItems, ...parsedTextItems],
      sentences: [...filteredSentences, ...parsedSentences],
    }));
    this.persistSet('sentences');
    this.persistSet('textitems');
  }

  public reparseAllTextsForLanguage(langID: LanguagesID) {
    const { texts } = this.dataStore.getValue();
    texts
      .filter((text) => text.TxLgID === langID)
      .forEach((text) => {
        this.reparseText(text.TxID);
      });
  }

  public setActiveLanguage(langID: LanguagesID | undefined | null) {
    this.setSettings({
      currentlanguage:
        langID === undefined || langID === null ? undefined : langID,
    });
  }
  public setActiveText(textID: TextsID | null) {
    this.setSettings({
      currenttext: textID === null ? undefined : textID,
    });
  }

  public updateTermStrength(wordID: WordsID, newStrength: NumericalStrength) {
    const word = this.dataStore
      .getValue()
      .words.find((val) => val.WoID === wordID);
    if (!word) {
      return;
    }
    this.editTerm({
      ...word,
      WoStatus: newStrength,
      WoStatusChanged: getCurrentTimeAsString(),
    });
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
    // const { languages } = this.dataStore.getValue();
    // languages.forEach((lang) => {
    //   this.reparseAllTextsForLanguage(lang.LgID);
    // });
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
