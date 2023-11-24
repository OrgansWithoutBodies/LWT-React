import { dataService } from '../data/data.service';
import { useData } from '../data/useAkita';
import { A } from '../nav/InternalLink';
import { useInternalNavigate } from '../nav/useInternalNav';
import { LanguageDropdown } from '../ui-kit/LanguageDropdown';
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
  const navigate = useInternalNavigate();
  return (
    <>
      {languages.length === 0 && (
        <table className="tab3" cellSpacing={0} cellPadding={5}>
          <tr>
            <th className="th1">
              Hint: The database seems to be empty.
              <br />
              <A href="/install_demo">You may install the LWT demo database,</A>
              <br />
              or
              <br />
              <A href="/edit_languages?new=1">
                define the first language you want to learn.
              </A>
            </th>
          </tr>
        </table>
      )}
      <div>
        <div>
          <div>
            Language:
            <LanguageDropdown
              onChange={(val) => {
                console.log(val);
                dataService.setActiveLanguage(val);
              }}
              defaultValue={
                activeLanguageId !== null ? activeLanguageId : undefined
              }
            />
          </div>
          {activeLanguage && (
            <div>
              {/* TODO */}
              My last Text (in
              {' ' + activeLanguage.LgName})
            </div>
          )}
        </div>

        <ul>
          <li>
            <A href="/edit_texts">My Texts</A>
          </li>
          <li>
            <A href="/edit_archivedtexts">My Text Archive</A>
          </li>
          <li>
            <A href="/edit_texttags">My Text Tags</A> <br />
            <br />
          </li>
          <li>
            <A href="/edit_languages">My Languages</A> <br />
            <br />
          </li>
          <li>
            <A href="/edit_words">My Terms (Words and Expressions)</A>
          </li>
          <li>
            <A href="/edit_tags">My Term Tags</A> <br />
            <br />
          </li>
          <li>
            <A href="/statistics">My Statistics</A> <br />
            <br />
          </li>
          <li>
            <A href="/check_text">Check a Text</A>
          </li>
          <li>
            <A href="/long_text_import">Long Text Import</A>
          </li>
          <li>
            <A href="/upload_words">Import Terms</A>
          </li>
          <li>
            <A href="/backup_restore">Backup/Restore/Empty Database</A>
            <br />
            <br />
          </li>
          <li>
            <A href="/settings">Settings/Preferences</A>

            <br />
            <br />
          </li>
          <li>
            <A href="/info">Help/Information</A>
          </li>
          {/* TODO */}
          {/* <li>
            <a href="/mobile">Mobile LWT (Experimental)</a>
          </li> */}
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
                </a>
                is free and unencumbered software released
                <br />
                into the
                <a
                  href="https://en.wikipedia.org/wiki/Public_domain_software"
                  target="_blank"
                >
                  PUBLIC DOMAIN
                </a>
                . LWT React Port is as well. Feel free
                <a href="http://unlicense.org/" target="_blank">
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
                {/* TODO server url & type? */}: <i>lwt</i> on
                <i>{dbBackend}</i> /
                <span
                  title="Manage Table Sets"
                  // TODO
                  onClick={() => {
                    navigate('/table_set_management');
                  }}
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
