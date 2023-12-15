import React, { useState } from 'react';
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { AppVariables } from './meta';
import { LandingPage } from './pages/LandingPage.component';

import {
  AddNewWordWrapper,
  AnnotatedTextsWrapper,
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
import { AppContext, useAppContext } from './hooks/useContext';
import { useData } from './hooks/useData';
import { InternalPaths } from './hooks/useInternalNav';
import { useCountdown } from './hooks/useTimer';
import { BackupScreen } from './pages/IO/Backups.component';
import { InstallDemo } from './pages/IO/InstallDemo';
import { InfoPage } from './pages/Info.component';
import { InfoExportTemplate } from './pages/InfoExportTemplate';
import { SettingsComponent } from './pages/Settings.component';
import { StatisticsComponent } from './pages/Statistics.component';
import { CheckTextPage } from './pages/Text/CheckText';
import { LongText } from './pages/Text/LongTextImport.component';
import { PLUGINS } from './plugins';
import { createColors } from './styles';
import { Header } from './ui-kit/Header';

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
function NoMatch() {
  const location = useLocation();

  return (
    <div>
      <Header title={'404 - Page Not Found'} />
      <h3 className="red2" style={{ fontSize: 30 }}>
        No match for <code>{location.pathname}</code>
      </h3>
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

function GlobalStyle(): JSX.Element {
  const { styleVariant } = useAppContext();
  const style = createColors(styleVariant);
  const StyleHeader = createGlobalStyle(style);
  return <StyleHeader />;
}
function App(): JSX.Element {
  // TODO useTheme/'tailwind-esque'?
  const [{ notificationMessage }] = useData(['notificationMessage']);
  const pluginRoutes = PLUGINS.filter(
    (plugin) => plugin.routes !== undefined
  ).reduce<Record<Partial<InternalPaths>, () => JSX.Element>>(
    (prev, curr) => ({ ...prev, ...curr.routes! }),
    {} as Record<Partial<InternalPaths>, () => JSX.Element>
  );
  //   const notifyMessage = `Success: Demo Database restored - 385 queries - 385 successful
  // (12/12 tables dropped/created, 355 records added), 0 failed.`;

  const routes: { [path in InternalPaths]: () => JSX.Element } = {
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
    '/new_word': () => <AddNewWordWrapper />,
    '/settings': () => <SettingsComponent />,
    '/do_text': () => <ReaderWrapper />,
    '/do_test': () => <TestWrapper />,
    '/print_text': () => <PrintTextWrapper />,
    '/print_impr_text': () => <AnnotatedTextsWrapper />,
    '/upload_words': () => <UploadWordsWrapper />,
    '/install_demo': () => <InstallDemo />,
    '/info_export_template': () => <InfoExportTemplate />,
    // TODO
    '/display_impr_text': () => <InfoExportTemplate />,
    // TODO
    '/edit_tword': () => <InfoExportTemplate />,
    // all_words_wellknown
    // delete_mword
    // delete_word
    // display_impr_text_header
    // display_impr_text_text
    // edit_archivedtexts
    // edit_languages
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
    // table_set_management
    // trans
    // yells about multiple specs without this cast TODO
    ...(pluginRoutes as object),
    '*': () => <NoMatch />,
  };
  console.log('TEST123-landing');
  return (
    <AppContext.Provider value={AppVariables}>
      <GlobalStyle />
      {notificationMessage === null || notificationMessage === undefined ? (
        <></>
      ) : (
        <NotificationMessage notificationMessage={notificationMessage.txt} />
      )}
      <Router basename="/lwt">
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
      <>
        {/*
        <ImportShortText />
        */}
      </>
    </AppContext.Provider>
  );
}

function NotificationMessage({
  notificationMessage,
}: {
  notificationMessage: string;
}): React.ReactNode {
  const [notificationMessageDisplay, setNotificationMessageDisplay] = useState<
    null | number
  >(null);
  const isOpen = useCountdown({
    countdownInMs: 3000,
    intervalInMs: 100,
    trigger: notificationMessage,
  });

  console.log('TEST123-notif', { notificationMessage, isOpen });
  // this is needed for initial hook pass
  if (notificationMessage === undefined) {
    return <></>;
  }
  return (
    <p
      id="hide3"
      className="msgblue"
      style={{
        display: isOpen ? undefined : 'none',
        maxHeight: 100,

        // height: `${notificationMessageDisplay}%`,
      }}
    >
      +++ {notificationMessage} +++
    </p>
  );
}

export default App;
