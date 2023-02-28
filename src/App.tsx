import React, { createContext, useContext } from 'react';
import { createGlobalStyle } from 'styled-components';
import ReactDOM from 'react-dom';
import { useData } from './data/useAkita';
import { AppVariables, TAppContext } from './meta';
import { BackupScreen } from './pages/Backups.component';
import { LandingPage } from './pages/LandingPage.component';
import { LanguagesPage } from './pages/Languages.component';

import { Library } from './pages/Library.component';
import ImportLongText from './pages/LongTextImport.component';
import { LongTextVerify } from './pages/LongTextImportVerify.component';
import { NewLanguage } from './pages/NewLanguage.component';
import { Reader } from './pages/Reader.component';
import { ReaderPage } from './pages/ReaderPage.component';
import { SettingsComponent } from './pages/Settings.component';
import { StatisticsComponent } from './pages/Statistics.component';
import { Terms } from './pages/Terms.component';
import { ImportShortText } from './pages/TextImport';
import NewLanguageWizard from './pages/Wizard.component';
import { Router } from './Router';
import { createColors } from './styles';
import { AppContext, setupAppContext, useAppContext } from './useContext';

function GlobalStyle(): JSX.Element {
  const { styleVariant } = useAppContext();
  const style = createColors(styleVariant);
  const StyleHeader = createGlobalStyle(style);
  return <StyleHeader />;
}
export function App(): JSX.Element {
  // TODO useTheme/'tailwind-esque'?
  const [{ textsForActiveLanguage }] = useData(['textsForActiveLanguage']);

  return (
    <AppContext.Provider value={AppVariables}>
      <GlobalStyle />
      {/* TODO router */}
      <>
        <LanguagesPage />
        <LandingPage />
        <Library />
        <Terms />
        <NewLanguage />
        <ImportLongText />
        <NewLanguageWizard />
        <SettingsComponent />
        <ImportShortText />
        <LongTextVerify />
        <StatisticsComponent />
        <BackupScreen />
        {textsForActiveLanguage && textsForActiveLanguage[0] && (
          <ReaderPage textId={textsForActiveLanguage[0].TxID} />
        )}
      </>
    </AppContext.Provider>
  );
}

export function startApplication(): void {
  ReactDOM.render(<App />, document.getElementById('root'));
}
