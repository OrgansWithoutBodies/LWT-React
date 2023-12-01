import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { AppVariables } from './meta';
import { LandingPage } from './pages/LandingPage.component';

import { useData } from './data/useAkita';
import { AppContext, useAppContext } from './hooks/useContext';
import { BackupScreen } from './pages/Backups.component';
import { CheckText } from './pages/CheckText';
import { InfoPage } from './pages/Info.component';
import { LongText } from './pages/LongTextImport.component';
import { SettingsComponent } from './pages/Settings.component';
import { StatisticsComponent } from './pages/Statistics.component';
import { createColors } from './styles';
import {
  AddNewWordWrapper,
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

declare global {
  interface NumberConstructor {
    parseInt<TNum extends number = number>(
      string: string,
      radix?: number
    ): TNum;
  }
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
  const [{ notificationMessageDisplay, notificationMessage }] = useData([
    'notificationMessageDisplay',
    'notificationMessage',
  ]);
  console.log('msg', { notificationMessage });
  //   const notifyMessage = `Success: Demo Database restored - 385 queries - 385 successful
  // (12/12 tables dropped/created, 355 records added), 0 failed.`;
  return (
    <AppContext.Provider value={AppVariables}>
      <GlobalStyle />
      {notificationMessage && (
        <p
          id="hide3"
          className="msgblue"
          style={{
            display: notificationMessageDisplay === 0 ? 'none' : undefined,
            maxHeight: 100,
            height: `${notificationMessageDisplay}%`,
          }}
        >
          +++ {notificationMessage?.txt} +++
        </p>
      )}
      <Router>
        {/*
all_words_wellknown
delete_mword
delete_word
display_impr_text_header
display_impr_text_text
display_impr_text
do_test_header
do_test_table
do_test_test
do_test
do_text_header
do_text_text
do_text
edit_archivedtexts
edit_languages
// TODO
edit_mword
edit_tword
edit_word
glosbe_api
inline_edit
insert_word_ignore
insert_word_wellknown
// TODO
install_demo
long_text_import
mobile
new_word
print_impr_text
print_text
save_setting_redirect
select_lang_pair
set_test_status
set_text_mode
set_word_status
show_word
simterms.inc
start
table_set_management
trans
*/}

        {/* A <Routes> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Routes>
          {/* TODO 404 page */}
          <Route path="/" element={<LandingPage />} />
          {/* <Route path="/select_lang_pair" element={<NewLanguageWizard />} /> */}
          <Route path="/index" element={<LandingPage />} />
          <Route path="/check_text" element={<CheckText />} />
          <Route path="/backup_restore" element={<BackupScreen />} />
          <Route path="/info" element={<InfoPage />} />
          <Route path="/edit_words" element={<TermsWrapper />} />
          <Route path="/edit_texts" element={<LibraryWrapper />} />
          {/* TODO */}
          {/* <Route path="/upload_words" element={<LibraryWrapper />} /> */}
          <Route
            path="/edit_archivedtexts"
            element={<EditArchivedTextsWrapper />}
          />
          <Route path="/edit_tags" element={<EditTagsWrapper />} />
          <Route path="/edit_texttags" element={<EditTextTagsWrapper />} />
          <Route path="/edit_languages" element={<LanguagesWrapper />} />
          <Route path="/long_text_import" element={<LongText />} />
          <Route path="/statistics" element={<StatisticsComponent />} />
          <Route path="/new_word" element={<AddNewWordWrapper />} />
          <Route path="/settings" element={<SettingsComponent />} />
          <Route path="/do_text" element={<ReaderWrapper />} />
          <Route path="/do_test" element={<TestWrapper />} />
          <Route path="/print_text" element={<PrintTextWrapper />} />
          <Route path="/upload_words" element={<UploadWordsWrapper />} />
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

// TODO typewise enforce conditional (typeguard?)

export function Switch({
  on,
  children,
}: { on: boolean } & React.PropsWithChildren) {
  const [firstChild, secondChild] = React.Children.toArray(children);
  return on ? secondChild : firstChild;
}
export default App;
