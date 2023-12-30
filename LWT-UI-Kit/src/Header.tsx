import { AppVariables } from "lwt-build";
import { I18NLanguages, SuppportedI18NLanguages, UIString } from "lwt-i18n";
import { LanguagesID, TextsID } from "lwt-schemas";
import { dataService, useData } from "lwt-state";
import { useLocation } from "react-router-dom";
import { DevModeGate } from "./DevModeGate";
import { I18N, useI18N } from "./I18N";
import { Icon } from "./Icon";
import { headerValues } from "./headerValues";
import { InternalPaths, useInternalNavigate } from "./hooks/useInternalNav";
import { A } from "./nav/InternalLink";

// TODO Header is the same on all crud ops of a given
export function Header({
  // TODO deprecate?
  title,
  link = "/",
  TitleDecoration: TitleDecoration,
  readerProps = undefined,
}: {
  title: UIString;
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
  const t = useI18N();

  const [{ settings }] = useData(["settings"]);
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
            if (val.target.value === "") {
              return;
            }
            // TODO validate?
            // TODO no cast if possible
            navigate(`/${val.target.value}` as InternalPaths);
          }}
        >
          <option disabled>[Menu]</option>
          {Object.keys(headerValues).map((key) => {
            const headerKey = key as keyof typeof headerValues;
            return (
              <option
                value={headerValues[headerKey]}
                selected={location.pathname === `/${headerValues[headerKey]}`}
              >
                {t(headerKey)}
              </option>
            );
          })}
        </select>
        {readerProps && (
          <>
            &nbsp; | &nbsp;
            <A href={`/do_text?start=${readerProps.prevTextID}`} target="_top">
              <Icon
                src="navigation-180-button"
                title={`Previous Text: ${readerProps.prevTextString}` as any}
              />
            </A>
            <A href={`/do_text?start=${readerProps.nextTextID}`} target="_top">
              <Icon
                src="navigation-000-button"
                title={`Next Text: ${readerProps.nextTextString}` as any}
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
              // onClick={()=>{setNewWord}}
              // href={`/new_word?text=${readerProps.textID}&lang=${readerProps.langID}`}
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
              {t(title)}
              {AppVariables.devMode && (
                <>
                  {" "}
                  <span className="red">DEBUG</span>
                </>
              )}
              {TitleDecoration && <TitleDecoration />}
            </h3>
          </tr>
        </tbody>
      </table>
      <DevModeGate>
        <I18N i="UI Language" />:{" "}
        <select
          onChange={({ target: { value } }) =>
            dataService.setUILanguage(value as SuppportedI18NLanguages)
          }
        >
          {I18NLanguages.map((lang) => (
            <option value={lang} selected={settings.uilanguage === lang}>
              {lang}
            </option>
          ))}
        </select>
      </DevModeGate>
      {/* <h3>READ&nbsp;▶</h3></td><td className="width99pc"><h3>一中三宪 <A href="https://zh.wikipedia.org/wiki/%E4%B8%80%E4%B8%AD%E4%B8%89%E6%86%B2" target="_blank"><Icon iconName="chain" title="Text Source" /></A></h3> */}
    </>
  );
}
// @TODO
// TO DO:  369
//     Show All
