import React from 'react';
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';

import { AppVariables } from 'lwt-build';
import { useData } from 'lwt-state';
import { Header } from 'lwt-ui-kit';
import {
  AppContext,
  useAppContext,
} from '../../../../LWT-Build/src/useContext';
import {
  AddNewWordWrapper,
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
import useAnimation from './hooks/useAnimateTimer';
import { InternalPaths } from './hooks/useInternalNav';
import { useCountdown } from './hooks/useTimer';
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

// TODO
export function GoBackButton() {
  return (
    <>
      <br />
      <input
        type="button"
        value="&lt;&lt; Go back and correct &lt;&lt;"
        onClick={() => history.back()}
      />
    </>
  );
}
export function NotificationMessage(): React.ReactNode {
  const [{ notificationMessage }] = useData(['notificationMessage']);

  // const [notificationMessageDisplay, setNotificationMessageDisplay] = useState<
  //   null | number
  // >(null);

  const hangOpenMS = 3000;
  const slideMS = 1000;
  const isOpen = useCountdown({
    countdownInMs: hangOpenMS + slideMS,
    intervalInMs: 500,
    trigger: notificationMessage,
  });
  const interval = useAnimation({
    duration: slideMS,
    retrigger: isOpen,
    easingName: 'elastic',
  });
  // this is needed for initial hook pass
  if (notificationMessage === null || notificationMessage === undefined) {
    return <></>;
  }
  const messageSize = 50;
  const calcSize = (isOpening: boolean, size: number) =>
    isOpening ? size : 1 - size;
  return (
    <div
      className="msgblue"
      style={{
        position: 'fixed',
        width: '100%',
        display: interval === 1 && !isOpen ? 'none' : 'flex',
        justifyContent: 'center',
        zIndex: 999,
        alignItems: 'center',
        // top        // maxHeight: 100,
        height: messageSize,
        // TODO some reason this doesnt completely hide the div
        top: `${messageSize * calcSize(isOpen, interval) - messageSize}px`,
      }}
    >
      <span>+++ {notificationMessage.txt} +++</span>
    </div>
  );
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
    [path in InternalPaths | '*']: () => JSX.Element;
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
    '/new_word': () => <AddNewWordWrapper />,
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
  console.log('TEST123-landing');
  return (
    <AppContext.Provider value={AppVariables}>
      <GlobalStyle />
      <NotificationMessage />
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
    </AppContext.Provider>
  );
}
