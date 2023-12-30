import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';

import { AppContext, AppVariables, useAppContext } from 'lwt-build';
import { BASENAME } from 'lwt-common';
import { Header, InternalPaths } from 'lwt-ui-kit';
import { NotificationMessage } from './NotificationMessage';
import {
  AnnotatedTextsWrapper,
  DisplayImprTextWrapper,
  EditArchivedTextsWrapper,
  EditTagsWrapper,
  EditTextTagsWrapper,
  LanguagesWrapper,
  LibraryWrapper,
  PrintTextWrapper,
  ReaderWrapper,
  TermsWrapper,
  TestWrapper,
  UploadWordsWrapper,
} from './Wrappers';
import { BackupScreen } from './pages/IO/Backups.component';
import { InstallDemo } from './pages/IO/InstallDemo';
import { InfoPage } from './pages/Info.component';
import { InfoExportTemplate } from './pages/InfoExportTemplate';
import { LandingPage } from './pages/LandingPage.component';
import { SettingsComponent } from './pages/Settings.component';
import { StatisticsComponent } from './pages/Statistics.component';
import { CheckTextPage } from './pages/Text/CheckText';
import { LongText } from './pages/Text/LongTextImport.component';
import { PLUGINS } from './plugins';
import { createColors } from './styles';

declare global {
  interface NumberConstructor {
    parseInt<TNum extends number = number>(
      string: string,
      radix?: number
    ): TNum;
  }
}

/**
 * 404 Page
 */
export function NoMatch() {
  const location = useLocation();

  return (
    <div>
      <Header title={'404 - Page Not Found'} />
      <h1>Error!</h1>
      <h2 className="red3">
        No match for <code>{location.pathname}</code>
      </h2>
    </div>
  );
}

// function InternalRoute({
//   path,
//   ...args
// }: RouteProps & {
//   path: '/' | `/${keyof typeof headerValuesTemp}`;
// }): JSX.Element {
//   path;
//   // TODO useInternalParams hook called here
//   return <Route path={path} {...args} />;
// }

export function GlobalStyle(): JSX.Element {
  const { styleVariant } = useAppContext();
  const style = createColors(styleVariant);
  const StyleHeader = createGlobalStyle(style);
  return <StyleHeader />;
}

export default App;
export function App(): JSX.Element {
  // TODO useTheme/'tailwind-esque'?
  const pluginRoutes = PLUGINS.filter(
    (plugin) => plugin.routes !== undefined
  ).reduce<Record<Partial<InternalPaths>, () => JSX.Element>>(
    (prev, curr) => ({ ...prev, ...curr.routes! }),
    {} as Record<Partial<InternalPaths>, () => JSX.Element>
  );
  //   const notifyMessage = `Success: Demo Database restored - 385 queries - 385 successful
  // (12/12 tables dropped/created, 355 records added), 0 failed.`;
  const routes: {
    [path in Exclude<InternalPaths, '//'> | '*']: () => JSX.Element;
  } = {
    '/': () => <LandingPage />,
    '/index': () => <LandingPage />,
    '/check_text': () => <CheckTextPage />,
    '/backup_restore': () => <BackupScreen />,
    '/info': () => <InfoPage />,
    '/edit_words': () => <TermsWrapper />,
    '/edit_texts': () => <LibraryWrapper />,
    '/edit_archivedtexts': () => <EditArchivedTextsWrapper />,
    '/edit_tags': () => <EditTagsWrapper />,
    '/edit_texttags': () => <EditTextTagsWrapper />,
    '/edit_languages': () => <LanguagesWrapper />,
    '/long_text_import': () => <LongText />,
    '/statistics': () => <StatisticsComponent />,
    // '/new_word': () => <AddNewWordWrapper />,
    '/settings': () => <SettingsComponent />,
    '/do_text': () => <ReaderWrapper />,
    '/do_test': () => <TestWrapper />,
    '/print_text': () => <PrintTextWrapper />,
    '/print_impr_text': () => <AnnotatedTextsWrapper />,
    '/display_impr_text': () => <DisplayImprTextWrapper />,
    '/upload_words': () => <UploadWordsWrapper />,
    '/install_demo': () => <InstallDemo />,
    '/info_export_template': () => <InfoExportTemplate />,
    // TODO
    // TODO
    '/edit_tword': () => <InfoExportTemplate />,
    // all_words_wellknown
    // delete_mword
    // delete_word
    // // TODO
    // edit_mword
    // edit_tword
    // edit_word
    // glosbe_api
    // inline_edit
    // insert_word_ignore
    // insert_word_wellknown
    // mobile
    // save_setting_redirect
    // set_test_status
    // set_text_mode
    // set_word_status
    // show_word
    // simterms.inc
    // start
    // trans
    '/edit_word'(): JSX.Element {
      throw new Error('Function not implemented.');
    },
    '/edit_mword'(): JSX.Element {
      throw new Error('Function not implemented.');
    },
    // yells about multiple specs without this cast TODO
    ...(pluginRoutes as object),
    '*': () => <NoMatch />,
  };
  return (
    <AppContext.Provider value={AppVariables}>
      <GlobalStyle />
      <NotificationMessage />
      <Router basename={BASENAME}>
        {/*
         */}

        {/* A <Routes> looks through its children <Route>s and
                    renders the first one that matches the current URL. */}
        <Routes>
          {...Object.keys(routes).map((routeKey) => {
            const PathRouteElement = routes[routeKey];
            return <Route path={routeKey} element={<PathRouteElement />} />;
          })}
        </Routes>
      </Router>
    </AppContext.Provider>
  );
}
