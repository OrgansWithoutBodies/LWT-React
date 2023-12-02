import { PersistanceStrategy } from '../data/PersistedValueGetter';
import { dataService } from '../data/data.service';
import { useData } from '../data/useAkita';
import { useAppContext } from '../hooks/useContext';
import { InternalPaths, useInternalNavigate } from '../hooks/useInternalNav';
import { AppVariables } from '../meta';
import { A } from '../nav/InternalLink';
import { PLUGINS } from '../plugins';
import { LanguageDropdown } from '../ui-kit/LanguageDropdown';
import { GlosbeAPI } from './GlosbeAPI.component';

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
  console.log('LANGS', languages);
  const pluginLinks = PLUGINS.filter(
    ({ landingPageLinks }) => landingPageLinks !== undefined
  )
    .map((plugin) => plugin.landingPageLinks!)
    .flat();
  const linkLayout: ({ link: InternalPaths; label: string } | null)[] = [
    { link: '/edit_texts', label: 'My Texts' },
    { link: '/edit_archivedtexts', label: 'My Text Archive' },
    { link: '/edit_texttags', label: 'My Text Tags' },
    { link: '/edit_languages', label: 'My Languages' },
    null,
    { link: '/edit_words', label: 'My Terms (Words and Expressions)' },
    { link: '/edit_tags', label: 'My Term Tags' },
    null,
    { link: '/statistics', label: 'My Statistics' },
    null,
    { link: '/check_text', label: 'Check a Text' },
    { link: '/long_text_import', label: 'Long Text Import' },
    { link: '/upload_words', label: 'Import Terms' },
    { link: '/backup_restore', label: 'Backup/Restore/Empty Database' },
    null,
    { link: '/settings', label: 'Settings/Preferences' },
    null,
    { link: '/info', label: 'Help/Information' },
    // TODO
    // { link: '/mobile', label: 'Mobile LWT (Experimental)' },
    ...pluginLinks,
  ];

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
              <br />
              <br />
              If you've never used LWT before, check out the{' '}
              <A href="/info">original docs</A> - and check out the{' '}
              <A href="/lwt_react_info">React Port docs</A>!
            </th>
          </tr>
        </table>
      )}
      {AppVariables.frontendVersion === 'LEGACY-0.0.0-PRE-ALPHA-DEMO' && (
        <table className="tab3" cellSpacing={0} cellPadding={5}>
          <tr>
            <th className="th1">
              <span style={{ fontSize: 20 }}>
                <A>Howdy! 🤠</A> Welcome to a pre-alpha demo release of
                LWT-React!
              </span>
              <br />
              <br />
              Watch your step as there are still bugs & unimplemented features,
              some known - some unknown!
              <br />
              <br />
              Let V know if you run into any problems!
              <br />
              <br />
              <span style={{ fontSize: 10 }}>
                (If you don't have V's contact....how did you find this 🤨)
              </span>
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
              {` ${activeLanguage.LgName}`})
            </div>
          )}
        </div>

        <ul>
          {linkLayout.map((layoutLine) =>
            layoutLine === null ? (
              <>
                <br />
                <br />
              </>
            ) : (
              <li>
                <A href={layoutLine.link}>{layoutLine.label}</A>
              </li>
            )
          )}
        </ul>
      </div>

      <p className="smallgray graydotted">&nbsp;</p>
      <table>
        <tbody>
          <tr>
            <td className="width50px">
              {/* TODO invalid url */}
              <a target="_blank" href="http://unlicense.org/" rel="noreferrer">
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
                  rel="noreferrer"
                >
                  "Learning with Texts" (LWT)
                </a>{' '}
                is free and unencumbered software released
                <br />
                into the
                <a
                  href="https://en.wikipedia.org/wiki/Public_domain_software"
                  target="_blank"
                  rel="noreferrer"
                >
                  PUBLIC DOMAIN
                </a>
                . LWT React Port is as well. Clone, modify, go wild. Learn more
                languages, help more learn more languages.
                <br />
                <a
                  href="http://unlicense.org/"
                  target="_blank"
                  rel="noreferrer"
                >
                  More information and detailed Unlicense ...
                </a>
                <br />
                This is LWT-React Version {versionNumber} (Released:{' '}
                {releaseDate}
                )
                <br />
                <a
                  href="https://en.wikipedia.org/wiki/Database"
                  target="_blank"
                  rel="noreferrer"
                >
                  Database
                </a>
                {/* TODO server url & type? */}:<i>lwt</i> on
                <i>{dbBackend}</i> /
                <span
                  title="Manage Table Sets"
                  onClick={() => {
                    // TODO
                    // navigate('/table_set_management');
                  }}
                  className="click"
                >
                  <i>Default</i> Table Set
                  {/* TODO table set size */}
                  {/* mb = get_first_value("SELECT round(sum(data_length+index_length)/1024/1024,1) as value FROM information_schema.TABLES where table_schema = " . convert_string_to_sqlsyntax(dbname) . " and table_name in (" .
	"CONCAT(" . p . ",'archivedtexts')," .
	"CONCAT(" . p . ",'archtexttags')," .
	"CONCAT(" . p . ",'languages')," .
	"CONCAT(" . p . ",'sentences')," .
	"CONCAT(" . p . ",'settings')," .
	"CONCAT(" . p . ",'tags')," .
	"CONCAT(" . p . ",'tags2')," .
	"CONCAT(" . p . ",'textitems')," .
	"CONCAT(" . p . ",'texts')," .
	"CONCAT(" . p . ",'texttags')," .
	"CONCAT(" . p . ",'words')," .
	"CONCAT(" . p . ",'wordtags'))");
if (! isset(mb)) mb = '0.0';
 */}
                </span>
                {/* TODO */}
                / Size: 94.5 MB
                <br />
                <b>Persistence strategy: </b>
                {PersistanceStrategy[AppVariables.persistMethod]}
                <br />
                <a href="https://en.wikipedia.org/wiki/Front-end_web_development">
                  Frontend:
                </a>
                {/* TODO get react version programmatically */}
                &nbsp;&nbsp;
                <a
                  href="https://en.wikipedia.org/wiki/React_(JavaScript_library)"
                  target="_blank"
                  rel="noreferrer"
                >
                  {frontend}/{frontendVersion}
                </a>
                <br />
                <a
                  href="https://en.wikipedia.org/wiki/Web_server"
                  target="_blank"
                  rel="noreferrer"
                >
                  Web Server
                </a>
                {/* TODO server url & type? */}:<i>test</i> / Server Software:
                <a
                  href="https://en.wikipedia.org/wiki/Apache_HTTP_Server"
                  target="_blank"
                  rel="noreferrer"
                >
                  {server}/{serverVersion}
                </a>
                &nbsp;&nbsp;
                {/* TODO get db backend & version programmatically */}
                <a
                  href="https://en.wikipedia.org/wiki/MySQL"
                  target="_blank"
                  rel="noreferrer"
                >
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
      {AppVariables.devMode && false && (
        <>
          <GlosbeAPI from={'en'} dest={'de'} phrase={'test'} />
          <button
            onClick={() => {
              dataService.getTatoebaSentence('eng', 'test');
            }}
          >
            TEST TATOEBA
          </button>
          <button
            onClick={() => {
              dataService.getTatoebaSentence('eng', 'test');
            }}
          >
            TEST TATOEBA
          </button>
        </>
      )}
    </>
  );
}
