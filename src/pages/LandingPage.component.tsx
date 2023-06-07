import React, { useContext } from 'react';
import { useData } from '../data/useAkita';
import { useAppContext } from '../useContext';

export function LandingPage() {
  const {
    releaseDate,
    dbBackend,
    versionNumber,
    dbVersion,
    server,
    serverVersion,
    frontend,
    frontendVersion,
    frontendSource,
  } = useAppContext();
  const [{ languages, activeLanguageId, activeLanguage }] = useData([
    'languages',
    'activeLanguageId',
    'activeLanguage',
  ]);
  return (
    <>
      <div>
        <div>
          <div>Language:</div>
          {activeLanguage && (
            <div>
              My last Text (in
              {' ' + activeLanguage.LgName})
            </div>
          )}
        </div>

        <ul>
          <li>
            <a href="edit_texts.php">My Texts</a>
          </li>
          <li>
            <a href="edit_archivedtexts.php">My Text Archive</a>
          </li>
          <li>
            <a href="edit_texttags.php">My Text Tags</a> <br />
            <br />
          </li>
          <li>
            <a href="edit_languages.php">My Languages</a> <br />
            <br />
          </li>
          <li>
            <a href="edit_words.php">My Terms (Words and Expressions)</a>
          </li>
          <li>
            <a href="edit_tags.php">My Term Tags</a> <br />
            <br />
          </li>
          <li>
            <a href="statistics.php">My Statistics</a> <br />
            <br />
          </li>
          <li>
            <a href="check_text.php">Check a Text</a>
          </li>
          <li>
            <a href="long_text_import.php">Long Text Import</a>
          </li>
          <li>
            <a href="upload_words.php">Import Terms</a>
          </li>
          <li>
            <a href="backup_restore.php">Backup/Restore/Empty Database</a>
            <br />
            <br />
          </li>
          <li>
            <a href="settings.php">Settings/Preferences</a>

            <br />
            <br />
          </li>
          <li>
            <a href="info.htm">Help/Information</a>
          </li>
          <li>
            <a href="mobile.php">Mobile LWT (Experimental)</a>
          </li>
        </ul>
      </div>

      <p className="smallgray graydotted">&nbsp;</p>
      <table>
        <tbody>
          <tr>
            <td className="width50px">
              <a target="_blank" href="http://unlicense.org/">
                <img
                  alt="Public Domain"
                  title="Public Domain"
                  src="img/public_domain.png"
                />
              </a>
            </td>
            <td>
              <p className="small">
                <a
                  href="https://sourceforge.net/projects/learning-with-texts/"
                  target="_blank"
                >
                  "Learning with Texts" (LWT)
                </a>{' '}
                is free and unencumbered software released
                <br />
                into the
                <a
                  href="https://en.wikipedia.org/wiki/Public_domain_software"
                  target="_blank"
                >
                  {' '}
                  PUBLIC DOMAIN
                </a>
                . LWT React Port is as well. Feel free
                <a href="http://unlicense.org/" target="_blank">
                  {' '}
                  More information and detailed Unlicense ...
                </a>
                <br />
                This is LWT-React Version {versionNumber} ({releaseDate})
                <br />
                <a
                  href="https://en.wikipedia.org/wiki/Database"
                  target="_blank"
                >
                  Database
                </a>
                {/* TODO server url & type? */}: <i>lwt</i> on{' '}
                <i>{dbBackend}</i> /
                <span
                  title="Manage Table Sets"
                  // TODO
                  // onClick="location.href='table_set_management.php';"
                  className="click"
                >
                  <i>Default</i> Table Set
                  {/* TODO table set size */}
                  {/* $mb = get_first_value("SELECT round(sum(data_length+index_length)/1024/1024,1) as value FROM information_schema.TABLES where table_schema = " . convert_string_to_sqlsyntax($dbname) . " and table_name in (" .
	"CONCAT(" . $p . ",'archivedtexts')," .
	"CONCAT(" . $p . ",'archtexttags')," .
	"CONCAT(" . $p . ",'languages')," .
	"CONCAT(" . $p . ",'sentences')," .
	"CONCAT(" . $p . ",'settings')," .
	"CONCAT(" . $p . ",'tags')," .
	"CONCAT(" . $p . ",'tags2')," .
	"CONCAT(" . $p . ",'textitems')," .
	"CONCAT(" . $p . ",'texts')," .
	"CONCAT(" . $p . ",'texttags')," .
	"CONCAT(" . $p . ",'words')," .
	"CONCAT(" . $p . ",'wordtags'))");
if (! isset($mb)) $mb = '0.0';
 */}
                </span>
                / Size: 94.5 MB
                <br />
                <a href="https://en.wikipedia.org/wiki/Front-end_web_development">
                  Frontend:
                </a>
                {/* TODO get react version programmatically */}
                &nbsp;&nbsp;
                <a
                  href="https://en.wikipedia.org/wiki/React_(JavaScript_library)"
                  target="_blank"
                >
                  {frontend}/{frontendVersion}
                </a>
                <br />
                <a
                  href="https://en.wikipedia.org/wiki/Web_server"
                  target="_blank"
                >
                  Web Server
                </a>
                {/* TODO server url & type? */}: <i>{'test'}</i> / Server
                Software:
                <a
                  href="https://en.wikipedia.org/wiki/Apache_HTTP_Server"
                  target="_blank"
                >
                  {server}/{serverVersion}
                </a>
                &nbsp;&nbsp;
                {/* TODO get db backend & version programmatically */}
                <a href="https://en.wikipedia.org/wiki/MySQL" target="_blank">
                  {dbBackend}/{dbVersion}
                </a>
                &nbsp;&nbsp;
                <br />
                <a href={frontendSource}>LWT React source</a>
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
