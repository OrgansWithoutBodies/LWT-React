import { DataState } from '../data/data.storage';

/**
 *
 * @param data
 */
export function serializeJsonToSQL(
  data: Pick<
    DataState,
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
  // TODO better serialize
  const serializedData = Object.fromEntries(
    Object.keys(data).map((key) => [
      key,

      data[key as keyof typeof data].map((val) =>
        Object.fromEntries(
          (Object.keys(val) as (keyof typeof val)[]).map((entryKey) =>
            val[entryKey] === null
              ? [entryKey, 'NULL']
              : [entryKey, JSON.stringify(val[entryKey])]
          )
        )
      ),
    ])
  );
  console.log(serializedData);
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
  ${serializedData.archivedtexts
    .map(
      (entry) =>
        `  INSERT INTO archivedtexts VALUES(${entry.AtID},${entry.AtLgID},${entry.AtTitle},${entry.AtText},${entry.AtAnnotatedText},${entry.AtAudioURI},${entry.AtSourceURI});\n`
    )
    .join('')}
  
  DROP TABLE IF EXISTS archtexttags;
  CREATE TABLE \`archtexttags\` (   \`AgAtID\` int(11) unsigned NOT NULL,   \`AgT2ID\` int(11) unsigned NOT NULL,   PRIMARY KEY (\`AgAtID\`,\`AgT2ID\`),   KEY \`AgAtID\` (\`AgAtID\`),   KEY \`AgT2ID\` (\`AgT2ID\`) ) ENGINE=MyISAM DEFAULT CHARSET=utf8;
${serializedData.archtexttags
  .map(
    (entry) =>
      `  INSERT INTO archtexttags VALUES(${entry.AgAtID},${entry.AgT2ID});\n`
  )
  .join('')}
  
  DROP TABLE IF EXISTS languages;
  CREATE TABLE \`languages\` (   \`LgID\` int(11) unsigned NOT NULL AUTO_INCREMENT,   \`LgName\` varchar(40) NOT NULL,   \`LgDict1URI\` varchar(200) NOT NULL,   \`LgDict2URI\` varchar(200) DEFAULT NULL,   \`LgGoogleTranslateURI\` varchar(200) DEFAULT NULL,   \`LgExportTemplate\` varchar(1000) DEFAULT NULL,   \`LgTextSize\` int(5) unsigned NOT NULL DEFAULT '100',   \`LgCharacterSubstitutions\` varchar(500) NOT NULL,   \`LgRegexpSplitSentences\` varchar(500) NOT NULL,   \`LgExceptionsSplitSentences\` varchar(500) NOT NULL,   \`LgRegexpWordCharacters\` varchar(500) NOT NULL,   \`LgRemoveSpaces\` int(1) unsigned NOT NULL DEFAULT '0',   \`LgSplitEachChar\` int(1) unsigned NOT NULL DEFAULT '0',   \`LgRightToLeft\` int(1) unsigned NOT NULL DEFAULT '0',   PRIMARY KEY (\`LgID\`),   UNIQUE KEY \`LgName\` (\`LgName\`) ) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
${serializedData.languages.map(
  (lang) =>
    `  INSERT INTO languages VALUES(${lang.LgID},${lang.LgName},${lang.LgDict1URI},${lang.LgDict2URI},${lang.LgGoogleTranslateURI},${lang.LgExportTemplate},${lang.LgTextSize},${lang.LgCharacterSubstitutions},${lang.LgRegexpSplitSentences},${lang.LgExceptionsSplitSentences},${lang.LgRegexpWordCharacters},${lang.LgRemoveSpaces},${lang.LgSplitEachChar},${lang.LgRightToLeft});\n`
)}
  
  DROP TABLE IF EXISTS sentences;
  CREATE TABLE \`sentences\` (   \`SeID\` int(11) unsigned NOT NULL AUTO_INCREMENT,   \`SeLgID\` int(11) unsigned NOT NULL,   \`SeTxID\` int(11) unsigned NOT NULL,   \`SeOrder\` int(11) unsigned NOT NULL,   \`SeText\` text,   PRIMARY KEY (\`SeID\`),   KEY \`SeLgID\` (\`SeLgID\`),   KEY \`SeTxID\` (\`SeTxID\`),   KEY \`SeOrder\` (\`SeOrder\`) ) ENGINE=MyISAM AUTO_INCREMENT=357 DEFAULT CHARSET=utf8;
${serializedData.sentences
  .map(
    (entry) => `  INSERT INTO wordtags VALUES(
    ${entry.SeID},${entry.SeLgID},${entry.SeTxID},${entry.SeOrder},${entry.SeText});\n`
  )
  .join('')}
  
  DROP TABLE IF EXISTS settings;
  CREATE TABLE \`settings\` (   \`StKey\` varchar(40) NOT NULL,   \`StValue\` varchar(40) DEFAULT NULL,   PRIMARY KEY (\`StKey\`) ) ENGINE=MyISAM DEFAULT CHARSET=utf8;
${serializedData.settings
  .map(
    (entry) =>
      `  INSERT INTO settings VALUES(${entry.StKey},${entry.StValue});\n`
  )
  .join('')}
  
  DROP TABLE IF EXISTS tags;
  CREATE TABLE \`tags\` (   \`TgID\` int(11) unsigned NOT NULL AUTO_INCREMENT,   \`TgText\` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,   \`TgComment\` varchar(200) NOT NULL DEFAULT '',   PRIMARY KEY (\`TgID\`),   UNIQUE KEY \`TgText\` (\`TgText\`) ) ENGINE=MyISAM AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;
${serializedData.tags
  .map(
    (entry) =>
      `  INSERT INTO tags VALUES(${entry.TgID},${entry.TgText}${entry.TgComment});\n`
  )
  .join('')}
  
  DROP TABLE IF EXISTS tags2;
  CREATE TABLE \`tags2\` (   \`T2ID\` int(11) unsigned NOT NULL AUTO_INCREMENT,   \`T2Text\` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,   \`T2Comment\` varchar(200) NOT NULL DEFAULT '',   PRIMARY KEY (\`T2ID\`),   UNIQUE KEY \`T2Text\` (\`T2Text\`) ) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
${serializedData.tags2
  .map(
    (entry) =>
      `  INSERT INTO tags2 VALUES(${entry.T2ID},${entry.T2Text}${entry.T2Comment});\n`
  )
  .join('')}
  
  DROP TABLE IF EXISTS textitems;
  CREATE TABLE \`textitems\` (   \`TiID\` int(11) unsigned NOT NULL AUTO_INCREMENT,   \`TiLgID\` int(11) unsigned NOT NULL,   \`TiTxID\` int(11) unsigned NOT NULL,   \`TiSeID\` int(11) unsigned NOT NULL,   \`TiOrder\` int(11) unsigned NOT NULL,   \`TiWordCount\` int(1) unsigned NOT NULL,   \`TiText\` varchar(250) NOT NULL,   \`TiTextLC\` varchar(250) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,   \`TiIsNotWord\` tinyint(1) NOT NULL,   PRIMARY KEY (\`TiID\`),   KEY \`TiLgID\` (\`TiLgID\`),   KEY \`TiTxID\` (\`TiTxID\`),   KEY \`TiSeID\` (\`TiSeID\`),   KEY \`TiOrder\` (\`TiOrder\`),   KEY \`TiTextLC\` (\`TiTextLC\`),   KEY \`TiIsNotWord\` (\`TiIsNotWord\`) ) ENGINE=MyISAM AUTO_INCREMENT=12761 DEFAULT CHARSET=utf8;
${serializedData.textitems
  .map(
    (entry) =>
      `  INSERT INTO textitems VALUES(${entry.TiID},${entry.TiLgID},${entry.TiTxID},${entry.TiSeID},${entry.TiOrder},${entry.TiWordCount},${entry.TiText},${entry.TiTextLC},${entry.TiIsNotWord});\n`
  )
  .join('')}
  
  DROP TABLE IF EXISTS texts;
  CREATE TABLE \`texts\` (   \`TxID\` int(11) unsigned NOT NULL AUTO_INCREMENT,   \`TxLgID\` int(11) unsigned NOT NULL,   \`TxTitle\` varchar(200) NOT NULL,   \`TxText\` text NOT NULL,   \`TxAnnotatedText\` longtext NOT NULL,   \`TxAudioURI\` varchar(200) DEFAULT NULL,   \`TxSourceURI\` varchar(1000) DEFAULT NULL,   PRIMARY KEY (\`TxID\`),   KEY \`TxLgID\` (\`TxLgID\`) ) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
${serializedData.texts
  .map(
    (entry) =>
      `  INSERT INTO texts VALUES(${entry.TxID},${entry.TxLgID},${entry.TxTitle},${entry.TxText},${entry.TxAnnotatedText},${entry.TxAudioURI},${entry.TxSourceURI});\n`
  )
  .join('')}
  
  DROP TABLE IF EXISTS texttags;
  CREATE TABLE \`texttags\` (   \`TtTxID\` int(11) unsigned NOT NULL,   \`TtT2ID\` int(11) unsigned NOT NULL,   PRIMARY KEY (\`TtTxID\`,\`TtT2ID\`),   KEY \`TtTxID\` (\`TtTxID\`),   KEY \`TtT2ID\` (\`TtT2ID\`) ) ENGINE=MyISAM DEFAULT CHARSET=utf8;
${serializedData.texttags
  .map(
    (entry) =>
      `  INSERT INTO texttags VALUES(${entry.TtTxID},${entry.TtT2ID});\n`
  )
  .join('')}
  
  DROP TABLE IF EXISTS words;
  CREATE TABLE \`words\` (   \`WoID\` int(11) unsigned NOT NULL AUTO_INCREMENT,   \`WoLgID\` int(11) unsigned NOT NULL,   \`WoText\` varchar(250) NOT NULL,   \`WoTextLC\` varchar(250) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,   \`WoStatus\` tinyint(4) NOT NULL,   \`WoTranslation\` varchar(500) NOT NULL DEFAULT '*',   \`WoRomanization\` varchar(100) DEFAULT NULL,   \`WoSentence\` varchar(1000) DEFAULT NULL,   \`WoCreated\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,   \`WoStatusChanged\` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',   \`WoTodayScore\` double NOT NULL DEFAULT '0',   \`WoTomorrowScore\` double NOT NULL DEFAULT '0',   \`WoRandom\` double NOT NULL DEFAULT '0',   PRIMARY KEY (\`WoID\`),   UNIQUE KEY \`WoLgIDTextLC\` (\`WoLgID\`,\`WoTextLC\`),   KEY \`WoLgID\` (\`WoLgID\`),   KEY \`WoStatus\` (\`WoStatus\`),   KEY \`WoTextLC\` (\`WoTextLC\`),   KEY \`WoTranslation\` (\`WoTranslation\`(333)),   KEY \`WoCreated\` (\`WoCreated\`),   KEY \`WoStatusChanged\` (\`WoStatusChanged\`),   KEY \`WoTodayScore\` (\`WoTodayScore\`),   KEY \`WoTomorrowScore\` (\`WoTomorrowScore\`),   KEY \`WoRandom\` (\`WoRandom\`) ) ENGINE=MyISAM AUTO_INCREMENT=221 DEFAULT CHARSET=utf8;
${serializedData.words
  .map(
    (entry) =>
      `  INSERT INTO words VALUES(${entry.WoID},${entry.WoLgID},${entry.WoText},${entry.WoTextLC},${entry.WoStatus},${entry.WoTranslation},${entry.WoRomanization},${entry.WoSentence},${entry.WoCreated},${entry.WoStatusChanged},${entry.WoTodayScore},${entry.WoTomorrowScore},${entry.WoRandom});\n`
  )
  .join('')}
  
  DROP TABLE IF EXISTS wordtags;
  CREATE TABLE \`wordtags\` (   \`WtWoID\` int(11) unsigned NOT NULL,   \`WtTgID\` int(11) unsigned NOT NULL,   PRIMARY KEY (\`WtWoID\`,\`WtTgID\`),   KEY \`WtTgID\` (\`WtTgID\`),   KEY \`WtWoID\` (\`WtWoID\`) ) ENGINE=MyISAM DEFAULT CHARSET=utf8;
${serializedData.wordtags
  .map(
    (entry) =>
      `  INSERT INTO wordtags VALUES(${entry.WtWoID},${entry.WtTgID});\n`
  )
  .join('')}`;
  console.log(sqlFileString);
  return sqlFileString;
}
