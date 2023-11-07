import {
  Route,
  BrowserRouter as Router,
  Routes,
  useSearchParams,
} from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { useData } from './data/useAkita';
import { AppVariables } from './meta';
import { LandingPage } from './pages/LandingPage.component';

import React from 'react';
import { EditTags } from './pages/EditTags';
import { LanguagesPage } from './pages/Languages.component';
import { Library } from './pages/Library.component';
import ImportLongText from './pages/LongTextImport.component';
import { LongTextVerify } from './pages/LongTextImportVerify.component';
import { NewLanguage } from './pages/NewLanguage.component';
import { Reader } from './pages/Reader.component';
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
  const [{ textsForActiveLanguage }] = useData(['textsForActiveLanguage']);

  return (
    <AppContext.Provider value={AppVariables}>
      <GlobalStyle />
      <Router>
        {/* <div> */}
        {/* <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/users">Users</Link>
              </li>
            </ul>
          </nav> */}

        {/* ajax_add_term_transl
ajax_chg_term_status
ajax_edit_impr_text
ajax_save_impr_text
ajax_save_setting
ajax_show_sentences
ajax_show_similar_terms
ajax_update_media_select
ajax_word_counts
all_words_wellknown
backup_restore
check_text
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
edit_tags
edit_texts
edit_texttags
edit_tword
edit_word
edit_words
glosbe_api
index
inline_edit
insert_word_ignore
insert_word_wellknown
install_demo
langdefs.inc
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
settings.inc
settings
show_word
simterms.inc
start
statistics
table_set_management
trans
upload_words
utilities.inc
wp_logincheck.inc
wp_lwt_start
wp_lwt_stop */}

        {/* A <Routes> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/index" element={<LandingPage />} />
          <Route path="/edit_words" element={<TermsWrapper />} />
          <Route path="/edit_texts" element={<LibraryWrapper />} />
          <Route path="/edit_tags" element={<EditTags />} />
          <Route path="/edit_languages" element={<LanguagesWrapper />} />
          <Route path="/long_text_import" element={<ImportLongText />} />
          <Route path="/check_text" element={<LongTextVerify />} />
          <Route path="/statistics" element={<StatisticsComponent />} />
          <Route path="/settings" element={<SettingsComponent />} />
          <Route path="/do_text" element={<ReaderWrapper />} />
        </Routes>
      </Router>
      <>
        {/* 
        <NewLanguageWizard />
        <ImportShortText />
        <LongTextVerify />
        <BackupScreen /> 
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
  return <Reader activeId={sanitizedParam} />;
}
