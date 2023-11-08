import {
  Route,
  BrowserRouter as Router,
  Routes,
  useSearchParams,
} from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { AppVariables } from './meta';
import { LandingPage } from './pages/LandingPage.component';

import React from 'react';
import { AddNewWord } from './pages/AddNewWord';
import { BackupScreen } from './pages/Backups.component';
import { EditArchivedTexts } from './pages/EditArchived.component';
import { EditTags } from './pages/EditTags';
import { EditTextTags } from './pages/EditTextTags';
import { InfoPage } from './pages/Info';
import { LanguagesPage } from './pages/Languages.component';
import { Library } from './pages/Library.component';
import ImportLongText from './pages/LongTextImport.component';
import { LongTextVerify } from './pages/LongTextImportVerify.component';
import { NewLanguage } from './pages/NewLanguage.component';
import { ReaderPage } from './pages/ReaderPage.component';
import { SettingsComponent } from './pages/Settings.component';
import { StatisticsComponent } from './pages/Statistics.component';
import { Terms } from './pages/Terms.component';
import { createColors } from './styles';
import { AppContext, useAppContext } from './useContext';

function GlobalStyle(): JSX.Element {
  const { styleVariant } = useAppContext();
  const style = createColors(styleVariant);
  const StyleHeader = createGlobalStyle(style);
  return <StyleHeader />;
}

function App(): JSX.Element {
  // TODO useTheme/'tailwind-esque'?

  return (
    <AppContext.Provider value={AppVariables}>
      <GlobalStyle />
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
edit_mword
edit_tword
edit_word
glosbe_api
inline_edit
insert_word_ignore
insert_word_wellknown
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
          <Route path="/" element={<LandingPage />} />
          <Route path="/index" element={<LandingPage />} />
          <Route path="/edit_words" element={<TermsWrapper />} />
          <Route path="/edit_texts" element={<LibraryWrapper />} />
          <Route path="/upload_words" element={<LibraryWrapper />} />
          <Route path="/edit_archivedtexts" element={<EditArchivedTexts />} />
          <Route path="/edit_tags" element={<EditTags />} />
          <Route path="/edit_texttags" element={<EditTextTags />} />
          <Route path="/info" element={<InfoPage />} />
          <Route path="/backup_restore" element={<BackupScreen />} />
          <Route path="/edit_languages" element={<LanguagesWrapper />} />
          <Route path="/long_text_import" element={<ImportLongText />} />
          <Route path="/check_text" element={<LongTextVerify />} />
          <Route path="/statistics" element={<StatisticsComponent />} />
          <Route path="/new_word" element={<AddNewWordWrapper />} />
          <Route path="/settings" element={<SettingsComponent />} />
          <Route path="/do_text" element={<ReaderWrapper />} />
          <Route path="/do_test" element={<TestWrapper />} />
        </Routes>
      </Router>
      <>
        {/* 
        <NewLanguageWizard />
        <ImportShortText />
        */}
      </>
    </AppContext.Provider>
  );
}

export function Switch({
  cond,
  children,
}: { cond: boolean } & React.PropsWithChildren) {
  const [firstChild, secondChild] = React.Children.toArray(children);
  return cond ? firstChild : secondChild;
}
export default App;
function TermsWrapper() {
  const [searchParams] = useSearchParams();
  const chgID = searchParams.get('chg');
  return (
    <Switch cond={chgID === null}>
      <Terms />
      <Terms />
    </Switch>
  );
}
function LanguagesWrapper() {
  const [searchParams] = useSearchParams();
  const isNew = searchParams.get('new');
  return (
    <Switch cond={isNew !== null && Number.parseInt(isNew) === 1}>
      <NewLanguage />
      <LanguagesPage />
    </Switch>
  );
}
function AddNewWordWrapper() {
  const [searchParams] = useSearchParams();
  const textID = searchParams.get('text');
  const langID = searchParams.get('lang');
  return <AddNewWord langId={Number.parseInt(langID)} />;
}
function LibraryWrapper() {
  const [searchParams] = useSearchParams();
  const chgID = searchParams.get('chg');
  return (
    <Switch cond={chgID === null}>
      <Library />
      <NewLanguage />
    </Switch>
  );
}
function ReaderWrapper() {
  const [searchParams] = useSearchParams();
  const start = searchParams.get('start');
  // TODO sanitize
  // TODO verify exists
  const sanitizedParam = Number.parseInt(start);
  console.log('TEST123-start', sanitizedParam);
  return <ReaderPage textId={sanitizedParam} />;
}
function TestWrapper() {
  const [searchParams] = useSearchParams();
  const textID = searchParams.get('text');
  // TODO sanitize
  // TODO verify exists
  const sanitizedParam = Number.parseInt(start);
  console.log('TEST123-start', sanitizedParam);
  return <ReaderPage textId={sanitizedParam} />;
}
