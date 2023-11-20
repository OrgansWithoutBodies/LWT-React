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
import { UploadWords } from './UploadWords.component';
import { dataService } from './data/data.service';
import { useData } from './data/useAkita';
import { TextsId } from './data/validators';
import { AddNewWord } from './pages/AddNewWord';
import { BackupScreen } from './pages/Backups.component';
import { CheckText } from './pages/CheckText';
import { EditArchivedTexts } from './pages/EditArchived.component';
import { EditLanguage } from './pages/EditLanguage.component';
import { DisplayTags, NewTag } from './pages/EditTags';
import { DisplayTextTags, EditTextTag, NewTextTag } from './pages/EditTextTags';
import { InfoPage } from './pages/Info';
import { LanguagesPage } from './pages/Languages.component';
import { EditText, Library } from './pages/Library.component';
import ImportLongText from './pages/LongTextImport.component';
import { NewLanguage } from './pages/NewLanguage.component';
import { PrintText } from './pages/PrintText.component';
import { ReaderPage, TesterPage } from './pages/ReaderPage.component';
import { SettingsComponent } from './pages/Settings.component';
import { StatisticsComponent } from './pages/Statistics.component';
import { ChangeTerm, Terms } from './pages/Terms.component';
import { ImportShortText } from './pages/TextImport';
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
          <Route path="/long_text_import" element={<ImportLongText />} />
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

export function Switch({
  on,
  children,
}: { on: boolean } & React.PropsWithChildren) {
  const [firstChild, secondChild] = React.Children.toArray(children);
  return on ? secondChild : firstChild;
}
export default App;
function TermsWrapper() {
  const [{ activeLanguageId }] = useData(['activeLanguageId']);
  const [searchParams] = useSearchParams();
  // TODO add wrapper for hook to break out params easier/integrate w controller
  const chgID = searchParams.get('chg');
  const sort = searchParams.get('sort');
  const status = searchParams.get('status');
  const page = searchParams.get('page');
  // TODO just set active lang here?
  const filterlang = searchParams.get('filterlang');

  return (
    <Switch on={chgID !== null}>
      <Terms
        filterlang={
          filterlang !== null ? Number.parseInt(filterlang) : activeLanguageId
        }
        pageNum={page !== null ? Number.parseInt(page) : 1}
        sort={sort ? Number.parseInt(sort) : null}
        status={status ? Number.parseInt(status) : null}
        textFilter={0}
      />
      <ChangeTerm chgID={Number.parseInt(chgID)} />
      {/* <Terms
        pageNum={0}
        sort={Number.parseInt(sort)}
        status={Number.parseInt(status)}
      /> */}
    </Switch>
  );
}
function UploadWordsWrapper() {
  return (
    <>
      <UploadWords />
    </>
  );
}
function PrintTextWrapper() {
  const [searchParams] = useSearchParams();
  const text = searchParams.get('text');
  return (
    <>
      <PrintText textID={Number.parseInt(text)} />
    </>
  );
}
function LanguagesWrapper() {
  const [searchParams] = useSearchParams();
  const isNew = searchParams.get('new') === '1';
  const chgID = searchParams.get('chg');
  const refreshID = searchParams.get('refresh');

  if (refreshID !== null) {
    dataService.reparseText(Number.parseInt(refreshID) as TextsId);
  }
  return (
    <Switch on={isNew}>
      <Switch on={chgID !== null}>
        <LanguagesPage />
        <EditLanguage chgID={Number.parseInt(chgID)} />
      </Switch>
      <NewLanguage />
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
  const archID = searchParams.get('arch');
  const page = searchParams.get('page');
  const query = searchParams.get('query');
  const refreshID = searchParams.get('refresh');
  const filterTag1 = searchParams.get('tag1');
  const filterTag2 = searchParams.get('tag2');
  const isNew = searchParams.get('new') === '1';

  // TODO
  // const [, { archiveText, reparseAllTextsForLanguage }] = useData([]);
  if (archID !== null) {
    dataService.archiveText(Number.parseInt(archID) as TextsId);
  }
  if (refreshID !== null) {
    dataService.reparseText(Number.parseInt(refreshID) as TextsId);
  }
  console.log('new', isNew);
  return (
    <Switch on={isNew}>
      <Switch on={chgID !== null}>
        <Library
          currentPage={page !== null ? Number.parseInt(page) : 1}
          query={query}
          filterTag1={filterTag1 !== null ? Number.parseInt(filterTag1) : null}
          filterTag2={filterTag2 !== null ? Number.parseInt(filterTag2) : null}
        />
        <EditText chgID={Number.parseInt(chgID)} />
      </Switch>
      <ImportShortText />
    </Switch>
  );
}
function EditArchivedTextsWrapper() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const page = searchParams.get('page');
  return (
    <EditArchivedTexts
      query={query || ''}
      currentPage={page !== null ? Number.parseInt(page) : 1}
    />
  );
}
function EditTextTagsWrapper() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const isNew = searchParams.get('new') === '1';
  const chgID = searchParams.get('chg');

  return (
    <Switch on={isNew}>
      <Switch on={chgID !== null}>
        <DisplayTextTags query={query || ''} />
        <EditTextTag chgID={Number.parseInt(chgID)} />
      </Switch>
      <NewTextTag />
    </Switch>
  );
}
function EditTagsWrapper() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const isNew = searchParams.get('new') === '1';
  const page = searchParams.get('page');

  return (
    <Switch on={isNew}>
      <DisplayTags
        query={query || ''}
        currentPage={page !== null ? Number.parseInt(page) : 1}
      />
      <NewTag />
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
  const sanitizedParam = Number.parseInt(textID);
  console.log('TEST123-start', sanitizedParam);
  return <TesterPage textId={sanitizedParam} />;
}
