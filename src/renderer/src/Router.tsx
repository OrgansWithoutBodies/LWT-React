import { Library } from './pages/Library.component';

type RouterType = { children: JSX.Element[] };
type Page = { url: string; name: string; component: JSX.Element };
function Blank(): JSX.Element {
  return <></>;
}

const PAGES: Page[] = [
  {
    url: '/',
    name: 'dashboard',
    component: (
      <Library
        currentPage={0}
        query={null}
        filterTag1={null}
        filterTag2={null}
      />
    ),
  },
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
        {leftPages.map((page) => <RouterTab name={page.name} float="left" />)}
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
        {rightPages.map((page) => <RouterTab name={page.name} float="right" />)}
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
