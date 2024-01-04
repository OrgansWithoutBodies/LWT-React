import { AppVariables, useAppContext } from 'lwt-build';
import { PersistanceStrategy } from 'lwt-persist';

export function FooterInfo() {
  const {
    releaseDate,
    dbBackend,
    dbVersion,
    server,
    serverVersion,
    frontend,
    frontendVersion,
    frontendSource,
  } = useAppContext();
  return (
    <>
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
                This is LWT-React Version {frontendVersion} (Released:{' '}
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
                <i>{dbBackend}</i>
                {/* mb = get_first_value("SELECT round(sum(data_length+index_length)/1024/1024,1) as value FROM information_schema.TABLES where table_schema = " . (dbname) . " and table_name in (" .
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
                {/* TODO */}
                {/* / Size: 94.5 MB */}
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
    </>
  );
}
