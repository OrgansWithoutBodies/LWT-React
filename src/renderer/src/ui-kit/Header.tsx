import { useLocation } from 'react-router-dom';
import { LanguagesID, TextsID } from '../data/validators';
import { InternalPaths, useInternalNavigate } from '../hooks/useInternalNav';
import { AppVariables } from '../meta';
import { A } from '../nav/InternalLink';
import { Icon } from './Icon';
import { headerValues } from './headerValues';

// TODO Header is the same on all crud ops of a given
export function Header({
  // TODO deprecate?
  title,
  link = '/',
  TitleDecoration: TitleDecoration,
  readerProps = undefined,
}: {
  title: string;
  TitleDecoration?: () => JSX.Element;
  link?: InternalPaths;
  readerProps?: {
    prevTextID: TextsID;
    nextTextID: TextsID;

    prevTextString: string;
    nextTextString: string;

    textID: TextsID;
    langID: LanguagesID;
  };
}) {
  const logoSize = 48;
  const navigate = useInternalNavigate();
  const location = useLocation();
  return (
    <>
      <h4>
        <A href={link} target="_top">
          <img
            className="lwtlogo"
            src="img/lwt_icon.svg"
            title="LWT - Current Table Set: Default Table Set"
            alt="LWT - Current Table Set: Default Table Set"
            width={logoSize}
            height={logoSize}
          />
          LWT
        </A>
        &nbsp; | &nbsp;
        <select
          id="quickmenu"
          onChange={(val) => {
            if (val.target.value === '') {
              return;
            }
            // TODO validate?
            // TODO no cast if possible
            navigate(`/${val.target.value}` as InternalPaths);
          }}
        >
          <option disabled>[Menu]</option>
          {Object.keys(headerValues).map((key) => (
            <option
              value={headerValues[key]}
              selected={location.pathname === `/${headerValues[key]}`}
            >
              {key}
            </option>
          ))}
        </select>
        {readerProps && (
          <>
            &nbsp; | &nbsp;
            <A href={`/do_text?start=${readerProps.prevTextID}`} target="_top">
              <Icon
                src="navigation-180-button"
                title={`Previous Text: ${readerProps.prevTextString}`}
              />
            </A>
            <A href={`/do_text?start=${readerProps.nextTextID}`} target="_top">
              <Icon
                src="navigation-000-button"
                title={`Next Text: ${readerProps.nextTextString}`}
              />
            </A>
            &nbsp; | &nbsp;
            <A href={`/do_test?text=${readerProps.textID}`} target="_top">
              <Icon src="question-balloon" title="Test" />
            </A>
            &nbsp;
            <A href={`/print_text?text=${readerProps.textID}`} target="_top">
              <Icon src="printer" title="Print" />
              &nbsp;
            </A>
            <A target="_top" href={`/edit_texts?chg=${readerProps.textID}`}>
              <Icon src="document--pencil" title="Edit Text" />
            </A>
            &nbsp; | &nbsp;
            <A
              href={`/new_word?text=${readerProps.textID}&lang=${readerProps.langID}`}
              target="ro"
            >
              <Icon src="sticky-note--plus" title="New Term" />
            </A>
          </>
        )}
      </h4>
      <table>
        <tbody>
          <tr>
            <h3>
              {title}
              {AppVariables.devMode && (
                <>
                  {' '}
                  <span className="red">DEBUG</span>
                </>
              )}
              {TitleDecoration && <TitleDecoration />}
            </h3>
          </tr>
        </tbody>
      </table>
      {/* <h3>READ&nbsp;▶</h3></td><td className="width99pc"><h3>一中三宪 <A href="https://zh.wikipedia.org/wiki/%E4%B8%80%E4%B8%AD%E4%B8%89%E6%86%B2" target="_blank"><Icon iconName="chain" title="Text Source" /></A></h3> */}
    </>
  );
}
// @TODO
// TO DO:  369
//     Show All
