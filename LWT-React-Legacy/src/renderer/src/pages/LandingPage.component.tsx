import { AppVariables } from 'lwt-build';
import { dataService, useData } from 'lwt-state';
import {
  A,
  DevModeGate,
  Icon,
  InternalPaths,
  LanguageDropdown,
  useI18N,
} from 'lwt-ui-kit';
import { FooterInfo } from '../../../../../LWT-UI-Kit/src/FooterInfo';
import { usePlugins } from '../usePlugins';
import { getGoogleSheets } from '../utils/parsers/getGoogleSheets';

/**
 *
 */
export function LandingPage() {
  const [{ languages, activeLanguageID }] = useData([
    'languages',
    'activeLanguageID',
    'activeLanguage',
    'settings',
    'texts',
  ]);
  const PLUGINS = usePlugins();

  const t = useI18N();
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
    // TODO?
    // { link: '/mobile', label: 'Mobile LWT (Experimental)' },
    // TODO typing
    ...(pluginLinks as any),
  ];

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
              {/* TODO show this from lwt_react_info plugin */}
              <A href={'/lwt_react_info' as any}>React Port docs</A>!
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
            {t('Language')}:{' '}
            <LanguageDropdown
              onChange={(val) => {
                console.log(val);
                dataService.setActiveLanguage(val);
              }}
              defaultValue={
                activeLanguageID !== null ? activeLanguageID : undefined
              }
            />
          </div>
          <CurrentText />
        </div>

        <ul>
          {linkLayout.map((layoutLine, ii) =>
            layoutLine === null ? (
              <p key={`null-${ii}`}>
                <br />
                <br />
              </p>
            ) : (
              <li key={layoutLine.label}>
                <A href={layoutLine.link}>{layoutLine.label}</A>
              </li>
            )
          )}
        </ul>
      </div>

      <FooterInfo />
      <DevModeGate>
        <input
          type="button"
          onClick={() =>
            getGoogleSheets({
              spreadsheetID: '1Eh_lrLXFD5a2ePktWG1mI6B7mBGJLGTv7VlAfsn3PGo',
              sheetID: '0',
            })
          }
          value="Google Sheet"
        />
      </DevModeGate>
    </>
  );
}

/**
 *
 */
export function CurrentText() {
  const [{ settings, languages, texts }] = useData([
    'settings',
    'languages',
    'texts',
  ]);
  const currentTextID = settings['currenttext'];
  if (!currentTextID) {
    return <></>;
  }
  const currentText = texts.find((val) => val.TxID === currentTextID);
  if (!currentText) {
    return <></>;
    // throw new Error('Invalid Active Text ID!');
  }
  const language = languages.find((val) => val.LgID === currentText.TxLgID);
  if (!language) {
    throw new Error('Invalid Language for Active Text!');
  }
  return (
    <ul>
      <li>
        My last Text (in {language.LgName}):
        <br /> <i>{currentText.TxTitle}</i>
        <br />
        <A href={`/do_text?start=${currentText.TxID}`}>
          <Icon src="book-open-bookmark" title="Read" />
          &nbsp;Read
        </A>
        &nbsp; &nbsp;
        <A href={`/do_test?text=${currentText.TxID}`}>
          <Icon src="question-balloon" title="Test" />
          &nbsp;Test
        </A>
        &nbsp; &nbsp;
        <A href={`/print_text?text=${currentText.TxID}`}>
          <Icon src="printer" title="Print" />
          &nbsp;Print
        </A>
        {currentText.TxAnnotatedText.length > 0 && (
          <>
            &nbsp; &nbsp;
            <A href={`/print_impr_text?text=${currentText.TxID}`}>
              <Icon src="tick" title="Improved Annotated Text" />
              &nbsp;Ann. Text
            </A>
          </>
        )}
      </li>
    </ul>
  );
}
