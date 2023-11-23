import { BackupScreen } from './pages/Backups.component';
import { LandingPage } from './pages/LandingPage.component';
import { LanguagesPage } from './pages/Languages.component';
import { Library } from './pages/Library.component';
import ImportLongText from './pages/LongTextImport.component';
import { LongTextVerify } from './pages/LongTextImportVerify.component';
import { NewLanguage } from './pages/NewLanguage.component';
import { SettingsComponent } from './pages/Settings.component';
import { StatisticsComponent } from './pages/Statistics.component';
import { Terms } from './pages/Terms.component';
import { ImportShortText } from './pages/TextImport';
import NewLanguageWizard from './pages/Wizard.component';

type RouterType = { children: JSX.Element[] };
type Page = { url: string; name: string; component: JSX.Element };
function Blank(): JSX.Element {
  return <></>;
}
// TODO use this component
const ScreenUrlMap: { url: string; component: JSX.Element }[] = [
  { url: '/', component: <LandingPage /> },
  { url: '/languages', component: <LanguagesPage /> },
  { url: '/texts', component: <Library /> },
  { url: '/words', component: <Terms /> },
  // TODO
  { url: '/words/new', component: <Terms /> },
  { url: '/languages/new', component: <NewLanguage /> },
  { url: '/languages/new', component: <NewLanguageWizard /> },
  { url: '/texts/new/long', component: <ImportLongText /> },
  { url: '/texts/new/short', component: <ImportShortText /> },
  { url: '/texts/new/long/verify', component: <LongTextVerify /> },
  { url: '/settings', component: <SettingsComponent /> },
  { url: '/statistics', component: <StatisticsComponent /> },
  { url: '/backup', component: <BackupScreen /> },
  // {
  //   url: '/texts/read/{activeId}',
  // component: ({ activeId: TextsId }) => <Reader activeId={activeId} />,
  // args: ['activeId'],
  // },
];
const PAGES: Page[] = [
  { url: '/', name: 'dashboard', component: <Library /> },
  { url: '/langs', name: 'languages', component: <Blank /> },
  { url: '/read', name: 'reader', component: <Blank /> },
];
const RIGHTPAGES: Page[] = [
  { url: '/logout', name: 'logout', component: <Blank /> },
  { url: '/settings', name: 'settings', component: <Blank /> },
];
export function RouterTab({
  name,
  float,
}: {
  name: string;
  float: string;
}): JSX.Element {
  return (
    <li
      style={{
        borderRight: '1px solid #bbb',
      }}
    >
      <span
        style={{
          // float,
          display: 'block',
          padding: 8,
          color: 'white',
          backgroundColor: 'red',
        }}
      >
        {name}
      </span>
    </li>
  );
}
export function RouterBar({
  leftPages,
  rightPages,
}: {
  leftPages: Page[];
  rightPages: Page[];
}): JSX.Element {
  return (
    <div
      style={{
        position: 'fixed',
        width: '100%',
        backgroundColor: 'green',
        // float: 'left',
      }}
    >
      <ul
        style={{
          listStyleType: 'none',
          margin: 0,
          padding: 0,
          paddingTop: 5,
          top: 0,

          // float: 'right',
        }}
      >
        {leftPages.map((page) => {
          return <RouterTab name={page.name} float="left" />;
        })}
      </ul>
      <ul
        style={{
          listStyleType: 'none',
          margin: 0,
          padding: 0,
          paddingTop: 5,
          top: 0,
        }}
      >
        {rightPages.map((page) => {
          return <RouterTab name={page.name} float="right" />;
        })}
      </ul>
    </div>
  );
}
export function Router({ children }: RouterType): JSX.Element {
  return (
    <>
      <RouterBar leftPages={PAGES} rightPages={RIGHTPAGES} />
      {children}
    </>
  );
}
