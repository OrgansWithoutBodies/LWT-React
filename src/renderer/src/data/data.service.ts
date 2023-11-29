import { StrengthMap } from '../pages/AddNewTermTooltip';
import { splitCheckText } from '../pages/utils';
import {
  ACTIVE_LANGUAGE_LOCAL_STORAGE_KEY,
  createDemoDBInitialState,
  DataState,
  dataStore,
  DataStore,
  MyPersistanceHandles,
} from './data.storage';
import { Persistable } from './Persistable';

import {
  AddNewTextType,
  AddNewWordType,
  LanguageNoId,
  Languages,
  Tags,
  Tags2,
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
  private persistChange(key: keyof DataState, insertVal: any) {
    // assume insert instead of wholly recreate when given the option
    if (MyPersistanceHandles['insert']) {
      const { insert: inserter } = MyPersistanceHandles;
      // TODO return val - rn these can get out of sync
      inserter(key, insertVal);
    } else {
      const { set: setter } = MyPersistanceHandles;

      const { [key]: value } = this.dataStore.getValue();
      setter(key, value);
    }
  }
  // These are saved in DB
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
    this.persistChange('languages', language);
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
    this.persistChange('languages');
  }
  public deleteArchivedText(textId: ArchivedTextsId) {
    this.dataStore.update((state) => {
      return {
        ...state,
        archivedtexts: state.archivedtexts.filter(
          (language) => language.AtID !== textId
        ),
      };
    });
    this.persistChange('archivedtexts');
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
    this.persistChange('texts');
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
    this.persistChange('tags');
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
    this.persistChange('tags');
  }
  public editLanguage(chgId: LanguagesId, newData: Languages) {
    window.alert('TODO-editLanguage' + chgId);
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
    this.persistChange('tags2');
  }
  public deleteText(textId: TextsId) {
    this.dataStore.update((state) => {
      return {
        ...state,
        notificationMessage: { txt: `Removed Text Tag id=${textId}` },
        texts: state.texts.filter((text) => text.TxID !== textId),
      };
    });
    this.persistChange('texts');
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
    this.persistChange('words');
  }
  public deleteTerm(termId: WordsId) {
    this.dataStore.update((state) => {
      return {
        ...state,
        words: state.words.filter((word) => word.WoID !== termId),
      };
    });
    this.persistChange('words');
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
    this.persistChange('words');
  }
  public addTagToTerm(tagId: TagsId, termId: WordsId) {
    this.dataStore.update((state) => ({
      ...state,
      wordtags: [...state.wordtags, { WtTgID: tagId, WtWoID: termId }],
    }));
    this.persistChange('wordtags');
  }
  public deleteTermTag(tagId: TagsId) {
    this.dataStore.update(({ wordtags, tags, ...rest }) => {
      return {
        ...rest,
        wordtags: wordtags.filter(({ WtTgID }) => {
          return WtTgID !== tagId;
        }),
        tags: tags.filter(({ TgID }) => {
          return TgID !== tagId;
        }),
      };
    });
    this.persistChange('wordtags');
    this.persistChange('tags');
  }

  public addTagToText(tagId: Tags2Id, textId: TextsId) {
    this.dataStore.update((state) => ({
      ...state,
      texttags: [...state.texttags, { TtT2ID: tagId, TtTxID: textId }],
    }));
    this.persistChange('texttags');
  }
  public deleteTextTag(tagId: Tags2Id) {
    this.dataStore.update(({ texttags, archtexttags, tags2, ...rest }) => {
      return {
        ...rest,
        texttags: texttags.filter(({ TtT2ID }) => {
          return TtT2ID !== tagId;
        }),
        archtexttags: archtexttags.filter(({ AgT2ID }) => {
          return AgT2ID !== tagId;
        }),
        tags2: tags2.filter(({ T2ID }) => {
          return T2ID !== tagId;
        }),
      };
    });
    // TODO persist multiple at a time
    this.persistChange('tags2');
    this.persistChange('texttags');
    this.persistChange('archtexttags');
  }

  public addLongText(longTextForm: LongTextForm) {
    window.alert('TODO ADDLONGTEXT');
  }
  public addMultipleTerms(terms: Words[]) {
    this.dataStore.update((state) => {
      const ids = state.words.map((word) => word.WoID);
      const maxId = Math.max(...ids) + 1;
      if (IDIsUnique(maxId, ids)) {
        return {
          ...state,
          words: [
            ...state.words,
            ...terms.map((word, ii) => {
              return {
                ...word,
                WoID: maxId + ii,
                // TODO
                WoStatusChanged: Date.now(),
                WoTodayScore: 0,
                WoTomorrowScore: 0,
                // TODO ? whats this
                WoRandom: 0,
              };
            }),
          ],
        };
      }
    });
    this.persistChange('words');
  }

  public restoreFromBackup(file: File) {
    window.alert('TODO RESTORING FROM BACKUP ' + file.name);
    // import { Gunzip } from 'browserify-zlib';
    const reader = new FileReader();
    const buffer: string[] = [];
    reader.onload = async (e) => {
      const text = e.target.result;
      // Gunzip.ungzip(text, function (err, dezipped) {
      //   console.log(dezipped.toString());
      // });
      //     // decompression chunk ready, add it to the buffer
      //     buffer.push(data.toString());
      //   })
      //   .on('end', function () {
      //     // response and decompression complete, join the buffer and return
      //     console.log(buffer.join(''));
      //   }).

      // console.log(text);
      // alert(text);
    };
    const text = reader.readAsText(file);
    console.log('TEST123', text);
  }

  public downloadBackup() {
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
    serializeJsonToSQL({
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
    window.alert('TODO DOWNLOADING BACKUP');
  }
  public emptyDatabase() {
    this.dataStore.update((state) => {
      return {
        settings: state.settings,
        activeLanguageId: null,
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
      };
    });

    this.persistChange('settings');
    this.persistChange('activeLanguageId');
    this.persistChange('archivedtexts');
    this.persistChange('archtexttags');
    this.persistChange('languages');
    this.persistChange('parsedTexts');
    this.persistChange('sentences');
    this.persistChange('tags2');
    this.persistChange('tags');
    this.persistChange('textitems');
    this.persistChange('texts');
    this.persistChange('texttags');
    this.persistChange('words');
    this.persistChange('wordtags');
  }

  public installDemoDatabase() {
    // TODO persist this better
    this.dataStore.update(() => createDemoDBInitialState());

    this.persistChange('settings');
    this.persistChange('activeLanguageId');
    this.persistChange('archivedtexts');
    this.persistChange('archtexttags');
    this.persistChange('languages');
    this.persistChange('parsedTexts');
    this.persistChange('sentences');
    this.persistChange('tags2');
    this.persistChange('tags');
    this.persistChange('textitems');
    this.persistChange('texts');
    this.persistChange('texttags');
    this.persistChange('words');
    this.persistChange('wordtags');
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
    this.persistChange('archivedtexts');
    this.persistChange('texts');
  }
  public unarchiveText() {
    window.alert('TODO UNARCHIVETEXT');
  }

  public setViewerSettings() {
    window.alert('TODO SETVIEWERSETTINGS');
  }

  public reparseText(textId: TextsId) {
    const { texts, languages } = this.dataStore.getValue();
    const parsingText = texts.find(({ TxID }) => {
      return TxID === textId;
    });
    const parsingLanguage = languages.find(({ LgID }) => {
      return LgID === parsingText?.TxLgID;
    });
    const parsedText = splitCheckText(parsingText?.TxText, parsingLanguage, -1);
    this.dataStore.update(({ parsedTexts, ...rest }) => {
      return { ...rest, parsedTexts: { ...parsedTexts, [textId]: parsedText } };
    });
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

  // These are only needed locally afaict
  public setActiveLanguage(langId: LanguagesId | null) {
    localStorage.setItem(ACTIVE_LANGUAGE_LOCAL_STORAGE_KEY, `${langId}`);
    this.dataStore.update((state) => {
      return { ...state, activeLanguageId: langId };
    });
  }

  constructor(private dataStore: DataStore) {
    this.getInitialAsync();
  }

  private async getInitialAsync() {
    const { getAsync: persistGetter } = MyPersistanceHandles;
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
export function serializeJsonToSQL(
  data: Pick<
    DataState,
    // | 'activeLanguageId'
    | 'archivedtexts'
    | 'archtexttags'
    | 'languages'
    | 'sentences'
    | 'tags'
    | 'tags2'
    | 'textitems'
    | 'texts'
    | 'texttags'
    | 'words'
    | 'wordtags'
    | 'settings'
  >
) {
  const serializedData = Object.fromEntries(
    Object.keys(data).map((key) => {
      return [
        key,

        data[key as keyof typeof data].map((val) =>
          Object.fromEntries(
            (Object.keys(val) as (keyof typeof val)[]).map((entryKey) =>
              val[entryKey] === null
                ? [entryKey, 'NULL']
                : [entryKey, `'${val[entryKey]}'`.replace('\n', '\\n')]
            )
          )
        ),
      ];
    })
  );
  const sqlFileString = `-- lwt-backup--- /ensures that this can be imported via Restore/ 
  -- 
  -- --------------------------------------------------------------
  -- "Learning with Texts" (LWT) is free and unencumbered software 
  -- released into the PUBLIC DOMAIN.
  -- 
  -- Anyone is free to copy, modify, publish, use, compile, sell, or
  -- distribute this software, either in source code form or as a
  -- compiled binary, for any purpose, commercial or non-commercial,
  -- and by any means.
  -- 
  -- In jurisdictions that recognize copyright laws, the author or
  -- authors of this software dedicate any and all copyright
  -- interest in the software to the public domain. We make this
  -- dedication for the benefit of the public at large and to the 
  -- detriment of our heirs and successors. We intend this 
  -- dedication to be an overt act of relinquishment in perpetuity
  -- of all present and future rights to this software under
  -- copyright law.
  -- 
  -- THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  -- EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE 
  -- WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE
  -- AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS BE LIABLE 
  -- FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
  -- OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN 
  -- CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
  -- THE SOFTWARE.
  -- 
  -- For more information, please refer to [http://unlicense.org/].
  -- --------------------------------------------------------------
  -- 
  -- --------------------------------------------------------------
  -- Installing an LWT demo database
  -- --------------------------------------------------------------
  
  DROP TABLE IF EXISTS archivedtexts;
  CREATE TABLE \`archivedtexts\` (   \`AtID\` int(11) unsigned NOT NULL AUTO_INCREMENT,   \`AtLgID\` int(11) unsigned NOT NULL,   \`AtTitle\` varchar(200) NOT NULL,   \`AtText\` text NOT NULL,   \`AtAnnotatedText\` longtext NOT NULL,   \`AtAudioURI\` varchar(200) DEFAULT NULL,   \`AtSourceURI\` varchar(1000) DEFAULT NULL,   PRIMARY KEY (\`AtID\`),   KEY \`AtLgID\` (\`AtLgID\`) ) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
  // TODO better serialize
${serializedData.archivedtexts
  .map((entry) => {
    return `  INSERT INTO archivedtexts VALUES(${entry.AtID},${entry.AtLgID},${entry.AtTitle},${entry.AtText},${entry.AtAnnotatedText},${entry.AtAudioURI},${entry.AtSourceURI});\n`;
  })
  .join('')}
  
  DROP TABLE IF EXISTS archtexttags;
  CREATE TABLE \`archtexttags\` (   \`AgAtID\` int(11) unsigned NOT NULL,   \`AgT2ID\` int(11) unsigned NOT NULL,   PRIMARY KEY (\`AgAtID\`,\`AgT2ID\`),   KEY \`AgAtID\` (\`AgAtID\`),   KEY \`AgT2ID\` (\`AgT2ID\`) ) ENGINE=MyISAM DEFAULT CHARSET=utf8;
${serializedData.archtexttags
  .map((entry) => {
    return `  INSERT INTO archtexttags VALUES(${entry.AgAtID},${entry.AgT2ID});\n`;
  })
  .join('')}
  
  DROP TABLE IF EXISTS languages;
  CREATE TABLE \`languages\` (   \`LgID\` int(11) unsigned NOT NULL AUTO_INCREMENT,   \`LgName\` varchar(40) NOT NULL,   \`LgDict1URI\` varchar(200) NOT NULL,   \`LgDict2URI\` varchar(200) DEFAULT NULL,   \`LgGoogleTranslateURI\` varchar(200) DEFAULT NULL,   \`LgExportTemplate\` varchar(1000) DEFAULT NULL,   \`LgTextSize\` int(5) unsigned NOT NULL DEFAULT '100',   \`LgCharacterSubstitutions\` varchar(500) NOT NULL,   \`LgRegexpSplitSentences\` varchar(500) NOT NULL,   \`LgExceptionsSplitSentences\` varchar(500) NOT NULL,   \`LgRegexpWordCharacters\` varchar(500) NOT NULL,   \`LgRemoveSpaces\` int(1) unsigned NOT NULL DEFAULT '0',   \`LgSplitEachChar\` int(1) unsigned NOT NULL DEFAULT '0',   \`LgRightToLeft\` int(1) unsigned NOT NULL DEFAULT '0',   PRIMARY KEY (\`LgID\`),   UNIQUE KEY \`LgName\` (\`LgName\`) ) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
${serializedData.languages.map(
  (lang) =>
    `  languages INTO languages VALUES(${lang.LgID},${lang.LgName},${lang.LgDict1URI},${lang.LgDict2URI},${lang.LgGoogleTranslateURI},${lang.LgExportTemplate},${lang.LgTextSize},${lang.LgCharacterSubstitutions},${lang.LgRegexpSplitSentences},${lang.LgExceptionsSplitSentences},${lang.LgRegexpWordCharacters},${lang.LgRemoveSpaces},${lang.LgSplitEachChar},${lang.LgRightToLeft});\n`
)}
  
  DROP TABLE IF EXISTS sentences;
  CREATE TABLE \`sentences\` (   \`SeID\` int(11) unsigned NOT NULL AUTO_INCREMENT,   \`SeLgID\` int(11) unsigned NOT NULL,   \`SeTxID\` int(11) unsigned NOT NULL,   \`SeOrder\` int(11) unsigned NOT NULL,   \`SeText\` text,   PRIMARY KEY (\`SeID\`),   KEY \`SeLgID\` (\`SeLgID\`),   KEY \`SeTxID\` (\`SeTxID\`),   KEY \`SeOrder\` (\`SeOrder\`) ) ENGINE=MyISAM AUTO_INCREMENT=357 DEFAULT CHARSET=utf8;
${serializedData.sentences
  .map((entry) => {
    return `  INSERT INTO wordtags VALUES(
    ${entry.SeID},${entry.SeLgID},${entry.SeTxID},${entry.SeOrder},${entry.SeText});\n`;
  })
  .join('')}
  
  DROP TABLE IF EXISTS settings;
  CREATE TABLE \`settings\` (   \`StKey\` varchar(40) NOT NULL,   \`StValue\` varchar(40) DEFAULT NULL,   PRIMARY KEY (\`StKey\`) ) ENGINE=MyISAM DEFAULT CHARSET=utf8;
${serializedData.settings
  .map((entry) => {
    return `  INSERT INTO settings VALUES(${entry.StKey},${entry.StValue});\n`;
  })
  .join('')}
  
  DROP TABLE IF EXISTS tags;
  CREATE TABLE \`tags\` (   \`TgID\` int(11) unsigned NOT NULL AUTO_INCREMENT,   \`TgText\` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,   \`TgComment\` varchar(200) NOT NULL DEFAULT '',   PRIMARY KEY (\`TgID\`),   UNIQUE KEY \`TgText\` (\`TgText\`) ) ENGINE=MyISAM AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;
${serializedData.tags
  .map((entry) => {
    return `  INSERT INTO tags VALUES(${entry.TgID},${entry.TgText}${entry.TgComment});\n`;
  })
  .join('')}
  
  DROP TABLE IF EXISTS tags2;
  CREATE TABLE \`tags2\` (   \`T2ID\` int(11) unsigned NOT NULL AUTO_INCREMENT,   \`T2Text\` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,   \`T2Comment\` varchar(200) NOT NULL DEFAULT '',   PRIMARY KEY (\`T2ID\`),   UNIQUE KEY \`T2Text\` (\`T2Text\`) ) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
${serializedData.tags2
  .map((entry) => {
    return `  INSERT INTO tags2 VALUES(${entry.T2ID},${entry.T2Text}${entry.T2Comment});\n`;
  })
  .join('')}
  
  DROP TABLE IF EXISTS textitems;
  CREATE TABLE \`textitems\` (   \`TiID\` int(11) unsigned NOT NULL AUTO_INCREMENT,   \`TiLgID\` int(11) unsigned NOT NULL,   \`TiTxID\` int(11) unsigned NOT NULL,   \`TiSeID\` int(11) unsigned NOT NULL,   \`TiOrder\` int(11) unsigned NOT NULL,   \`TiWordCount\` int(1) unsigned NOT NULL,   \`TiText\` varchar(250) NOT NULL,   \`TiTextLC\` varchar(250) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,   \`TiIsNotWord\` tinyint(1) NOT NULL,   PRIMARY KEY (\`TiID\`),   KEY \`TiLgID\` (\`TiLgID\`),   KEY \`TiTxID\` (\`TiTxID\`),   KEY \`TiSeID\` (\`TiSeID\`),   KEY \`TiOrder\` (\`TiOrder\`),   KEY \`TiTextLC\` (\`TiTextLC\`),   KEY \`TiIsNotWord\` (\`TiIsNotWord\`) ) ENGINE=MyISAM AUTO_INCREMENT=12761 DEFAULT CHARSET=utf8;
${serializedData.textitems
  .map((entry) => {
    return `  INSERT INTO textitems VALUES(${entry.TiID},${entry.TiLgID},${entry.TiTxID},${entry.TiSeID},${entry.TiOrder},${entry.TiWordCount},${entry.TiText},${entry.TiTextLC},${entry.TiIsNotWord});\n`;
  })
  .join('')}
  
  DROP TABLE IF EXISTS texts;
  CREATE TABLE \`texts\` (   \`TxID\` int(11) unsigned NOT NULL AUTO_INCREMENT,   \`TxLgID\` int(11) unsigned NOT NULL,   \`TxTitle\` varchar(200) NOT NULL,   \`TxText\` text NOT NULL,   \`TxAnnotatedText\` longtext NOT NULL,   \`TxAudioURI\` varchar(200) DEFAULT NULL,   \`TxSourceURI\` varchar(1000) DEFAULT NULL,   PRIMARY KEY (\`TxID\`),   KEY \`TxLgID\` (\`TxLgID\`) ) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
${serializedData.texts
  .map((entry) => {
    return `  INSERT INTO texts VALUES(${entry.TxID},${entry.TxLgID},${entry.TxTitle},${entry.TxText},${entry.TxAnnotatedText},${entry.TxAudioURI},${entry.TxSourceURI});\n`;
  })
  .join('')}
  INSERT INTO texts VALUES('1','1','Mon premier don du sang','Bonjour Manon.\nBonjour.\nAlors, je crois qu’il y a pas longtemps, là, vous avez fait une bonne action ?\nOui. \nOn peut dire ça comme ça. Qu’est-ce que vous avez fait, alors ?\nAlors, j’ai fait mon premier don du sang. Donc c’est à dire que on va dans une... Un organisme spécialisé vient dans l’IUT, dans notre université pour... pour prendre notre sang pour les malades de l’hôpital qui en ont besoin...\nOui, voilà, en cas d’accident par exemple, etc...\nEn cas d’accident ou en cas d’anémie ...\nOui, oui. D’accord. Et alors, donc, c’était la première fois que vous le faisiez ?\nC’est la première fois et ça m’a marquée parce que j’ai... j’ai très peur des piqures en temps habituel.\nAh bon !\nVoilà. J’en ai... j’en fais très rarement, le plus rarement possible...\nOui ?\n... pour... pour éviter ça au maximum. Et puis...\nOui, et là, c’est pas une petite piqure ! Ça dure un moment, en fait !\nAh non, ça dure quinze – vingt minutes.\nAh, d’accord.\nIls prennent... je sais plus combien de litres de sang. Ah, c’est beaucoup.\nOui, oui. D’accord.\nOuais, ouais, ouais.\nEt donc vous avez franchi le pas.\nVoilà.\nMais pourquoi, alors ?\nParce que je pense que c’est important d’aider les autres, surtout que j’ai appris que j’ai un sang assez rare.\nAh oui ? C’est vrai ?\nOuais.\nPourquoi ? C’est quoi ?\nA négatif.\nAh, d’accord. Oui, oui. Moi, c’est pareil.\nC’est un sang... Ah, c’est vrai ?\nOui, oui.\nAssez rare, donc voilà, les gens, si ils en ont besoin. Et puis si un jour, moi j’en ai besoin, je serai contente que d’autres en donnent. Donc voilà.\nOui, oui. D’accord.\nEn attendant, je fais ça.\nOui, oui, bien sûr. Et alors, comment ça se passe concrètement? Donc vous êtes allée... Donc ils sont venus à l’IUT, là. Ils installent tout bien comme il faut, et alors vous y allez et puis...\nOn y va, ils nous de ... Ils nous posent quelques questions par rapport à notre hygiène de vie évidemment, pour... pour les maladies, tout ça, si on n’a pas eu... été malades, pour les médicaments dans le sang, tout ça. Et puis après, ils vous installent sur une... sur une table, allongé, et ils vous... ils vous piquent et...\nEt on attend.\nEt on attend, 15 ou 20 minutes.\nOui, d’accord. Et le temps n’est pas trop long ? On se sent pas un peu bizarre ou...?\nOn se sent bizarre, mais ils sont vraiment à côté de nous pour... pour justement qu’on... qu’on reste éveillé en quelque sorte, et qu’on reste actif pour pas justement qu’on parte... un peu à...\nOui, à se poser des questions, tout ça, et puis se sentir affaibli ou quelque chose.\nVoilà. Donc ils sont vraiment à côté de nous, à nous parler, à nous faire rigoler pour voir si on est toujours conscient, finalement.\nAh oui, d’accord.\nOui, oui. Voilà.\nOui, oui, oui. Et après, alors, à la fin, qu’est-ce qui se passe ?\nA la fin, ils vous enlèvent la piqure. Et d’ailleurs, c’est là que je me suis évanouie !\nCarrément ?\nOuais.\nAh bon, d’accord !\nOui, oui. Ils ont dû... Ils ont dû me mettre les pieds en l’air. Ils ont... Ils ont bien rigolé parce que justement, ils... ils ont vu que quand je suis partie, justement, c’est quand ils ont enlevé la piqure, je souriais et quand je suis... quand je me suis... quand j’ai repris conscience, ils m’ont dit que c’était la... la première fois qu’ils avaient vu quelqu’un partir...\nEn souriant ?\n...en souriant.\nAh bon, d’accord. Alors vous êtes très spéciale !\nVoilà.\nAh oui ? Et alors, donc... mais vous vous êtes évanouie carrément ?\nAh oui, carrément ! J’ai perdu conscience pendant... bon pas longtemps, hein, peut-être une ou deux minutes, le temps que... que ça revienne. Je pense que c’était un...\nUn étourdissement ?\n... un trop-plein... trop-plein d’émotions en fait.\nAh d’accord !\nD’être contente et à la fois d’avoir eu peur.\nAh bon !\nTout ça, ouais.\nVous êtes à ce point sensible...\nAh oui, oui, vraiment.\n... émotive.\nOuais.\nD’accord. Et alors, qu’est-ce qu’ils ont fait, eux ? Ils vous ont... quoi ? Je sais pas... tapé sur les joues ?\nNon, non, ils ont été très calmes, apparemment, d’après ce que j’ai entendu.\nIl faut placer dans une bonne position, quoi. C’est ça ?\nVoilà, ils ont juste relevé mes pieds. Et ils m’ont... Ils m’ont mis un... un coton imbibé de... de quelque chose. Je sais pas ce que c’était. Ça... ça sentait l’eucalyptus.\nAh oui, oui. Pour un peu vous...\nPour un peu...\n... stimuler.\nOuais, voilà.\nD’accord. Bon bah c’est sympa ! J’espère que tout le monde se... s’évanouit pas après les... les prises de sang comme ça ! Et il y a pas à manger aussi un peu, non ? C’est ça ?\nVoilà, et après ils nous... ils nous donnent ce qu’on veut: un... un gâteau ou un verre de... de soda..\nOuais, ouais, pour reconstituer...\n... un truc bien sucré.\nOuais d’accord, pour se reconstituer les forces.\nPour repartir, voilà.\nD’accord. Bon bah c’est bien, alors, d’avoir fait ça. Est-ce que vous recommencerez, alors ?\nOui, oui. Il faut attendre trois mois. Donc je l’ai fait en février et je compte bien le faire en juin, là, ouais.\nAh bon d’accord. Et alors, vous comptez vous évanouir à nouveau ?\nNon, je vais essayer... je vais essayer de me retenir.\nD’accord.\nJe vais leur expliquer que je suis un peu émotive. Et...\nUn peu, oui. Hm, hm. Mais peut-être que la deuxième fois, comme vous saurez déjà comment ça se passe, ce sera moins...\nOui, je pense.\n... moins stressant.\nJe... je pars avec moins d’appréhension, en tout cas, pour la deuxième fois.\nOui, d’accord. Bon, bah, c’est bien, alors, d’avoir fait ça.\nOui.\nD’accord. Bah très bien pour les... pour les gens à qui ça va servir. Merci Manon.','','https://learning-with-texts.sourceforge.io/media/dondusang.mp3','http://francebienvenue1.wordpress.com/2011/06/18/generosite/');
  
  DROP TABLE IF EXISTS texttags;
  CREATE TABLE \`texttags\` (   \`TtTxID\` int(11) unsigned NOT NULL,   \`TtT2ID\` int(11) unsigned NOT NULL,   PRIMARY KEY (\`TtTxID\`,\`TtT2ID\`),   KEY \`TtTxID\` (\`TtTxID\`),   KEY \`TtT2ID\` (\`TtT2ID\`) ) ENGINE=MyISAM DEFAULT CHARSET=utf8;
${serializedData.texttags
  .map((entry) => {
    return `  INSERT INTO texttags VALUES(${entry.TtTxID},${entry.TtT2ID});\n`;
  })
  .join('')}
  
  DROP TABLE IF EXISTS words;
  CREATE TABLE \`words\` (   \`WoID\` int(11) unsigned NOT NULL AUTO_INCREMENT,   \`WoLgID\` int(11) unsigned NOT NULL,   \`WoText\` varchar(250) NOT NULL,   \`WoTextLC\` varchar(250) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,   \`WoStatus\` tinyint(4) NOT NULL,   \`WoTranslation\` varchar(500) NOT NULL DEFAULT '*',   \`WoRomanization\` varchar(100) DEFAULT NULL,   \`WoSentence\` varchar(1000) DEFAULT NULL,   \`WoCreated\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,   \`WoStatusChanged\` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',   \`WoTodayScore\` double NOT NULL DEFAULT '0',   \`WoTomorrowScore\` double NOT NULL DEFAULT '0',   \`WoRandom\` double NOT NULL DEFAULT '0',   PRIMARY KEY (\`WoID\`),   UNIQUE KEY \`WoLgIDTextLC\` (\`WoLgID\`,\`WoTextLC\`),   KEY \`WoLgID\` (\`WoLgID\`),   KEY \`WoStatus\` (\`WoStatus\`),   KEY \`WoTextLC\` (\`WoTextLC\`),   KEY \`WoTranslation\` (\`WoTranslation\`(333)),   KEY \`WoCreated\` (\`WoCreated\`),   KEY \`WoStatusChanged\` (\`WoStatusChanged\`),   KEY \`WoTodayScore\` (\`WoTodayScore\`),   KEY \`WoTomorrowScore\` (\`WoTomorrowScore\`),   KEY \`WoRandom\` (\`WoRandom\`) ) ENGINE=MyISAM AUTO_INCREMENT=221 DEFAULT CHARSET=utf8;
${serializedData.words
  .map((entry) => {
    return `  INSERT INTO words VALUES(${entry.WoID},${entry.WoLgID},${entry.WoText},${entry.WoTextLC},${entry.WoStatus},${entry.WoTranslation},${entry.WoRomanization},${entry.WoSentence},${entry.WoCreated},${entry.WoStatusChanged},${entry.WoTodayScore},${entry.WoTomorrowScore},${entry.WoRandom});\n`;
  })
  .join('')}
  
  DROP TABLE IF EXISTS wordtags;
  CREATE TABLE \`wordtags\` (   \`WtWoID\` int(11) unsigned NOT NULL,   \`WtTgID\` int(11) unsigned NOT NULL,   PRIMARY KEY (\`WtWoID\`,\`WtTgID\`),   KEY \`WtTgID\` (\`WtTgID\`),   KEY \`WtWoID\` (\`WtWoID\`) ) ENGINE=MyISAM DEFAULT CHARSET=utf8;
${serializedData.wordtags
  .map((entry) => {
    return `  INSERT INTO wordtags VALUES(${entry.WtWoID},${entry.WtTgID});\n`;
  })
  .join('')}`;
  console.log(sqlFileString);
  window.alert('TODO download file');
}
