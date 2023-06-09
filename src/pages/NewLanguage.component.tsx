import React, { RefObject, useRef } from 'react';
import * as ss from 'superstruct';
import { dataService } from '../data/data.service';
import { Languages } from '../data/parseMySqlDump';
import { LanguagesValidator, LanguagesValidatorNoId } from '../data/validators';
import { LangDef } from '../data/wizardData';
import {
  RefMap,
  CheckAndSubmit,
  emptyToNullMap,
  parseNumMap,
  ResetForm,
} from './Forms';
import { Icon, RequiredLineButton } from '../Icon';
// TODO table component?
// TODO map LangDef to Languages
type LanguageNoId = Omit<Languages, 'LgID'>;
export function NewLanguage() {
  // languages type map
  // TODO form component?
  //  - map validator to row - but if row styling is different maybe difficult..
  const preValidateMap: {
    [key in keyof LanguageNoId]?: (value: string) => any | null;
  } = {
    LgTextSize: parseNumMap,
    LgRemoveSpaces: parseNumMap,
    LgSplitEachChar: parseNumMap,
    LgRightToLeft: parseNumMap,
    LgDict2URI: emptyToNullMap,
  };
  console.log('TEST123', LanguagesValidatorNoId.schema);
  const validator = LanguagesValidatorNoId;
  const refMap = RefMap<LanguageNoId>(validator);
  return (
    <>
      <h4>
        New Language
        <a target="_blank" href="info.htm#howtolang">
          <Icon iconName="question-frame" title="Help" alt="Help" />
        </a>
      </h4>
      <form className="validate">
        {/* onsubmit="return check_dupl_lang(0);" */}
        <table className="tab1" cellSpacing={0} cellPadding={5}>
          <tbody>
            <tr>
              <td className="td1 center backlightyellow" colSpan={2}>
                <Icon
                  iconName="wizard"
                  title="Language Settings Wizard"
                  alt="Language Settings Wizard"
                  className="click"
                />
                {/* onClick="window.open('select_lang_pair.php', 'wizard', 'width=400, height=400, scrollbars=yes, menubar=no, resizable=yes, status=no');" */}
                <br />
                <span className="click">
                  {/* click="window.open('select_lang_pair.php', 'wizard', 'width=400, height=400, scrollbars=yes, menubar=no, resizable=yes, status=no');" */}
                  <Icon iconName="arrow-000-medium" title="->" alt="->" />
                  <b>Language Settings Wizard</b>
                  <Icon iconName="arrow-180-medium" title="<-" alt="<-" />
                </span>
                <br />
                <span className="smallgray">
                  Select your native (L1) and study (L2) languages, and let the
                  wizard set all marked language settings!
                  <br />
                  (You can adjust the settings afterwards.)
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <table className="tab1" cellSpacing={0} cellPadding={5}>
          <tbody>
            <tr>
              <td className="td1 right backlightyellow">
                Study Language "L2":
              </td>
              <td className="td1">
                <input
                  ref={refMap.LgName}
                  type="text"
                  className="notempty setfocus checkoutsidebmp"
                  name="LgName"
                  id="LgName"
                  defaultValue=""
                  maxLength={40}
                  size={40}
                />
                {/* data_info="Study Language" */}
                <RequiredLineButton />
              </td>
            </tr>
            <tr>
              <td className="td1 right backlightyellow">Dictionary 1 URI:</td>
              <td className="td1">
                <input
                  ref={refMap.LgDict1URI}
                  type="text"
                  className="checkdicturl notempty checkoutsidebmp"
                  name="LgDict1URI"
                  defaultValue=""
                  maxLength={200}
                  size={60}
                />
                {/* data_info="Dictionary 1 URI" */}
                <RequiredLineButton />
              </td>
            </tr>
            <tr>
              <td className="td1 right">Dictionary 2 URI:</td>
              <td className="td1">
                <input
                  type="text"
                  className="checkdicturl checkoutsidebmp"
                  name="LgDict2URI"
                  ref={refMap.LgDict2URI}
                  defaultValue=""
                  maxLength={200}
                  size={60}
                />
              </td>
              {/* data_info="Dictionary 2 URI" */}
            </tr>
            <tr>
              <td className="td1 right backlightyellow">
                GoogleTranslate URI:
              </td>
              <td className="td1">
                <input
                  ref={refMap.LgGoogleTranslateURI}
                  type="text"
                  className="checkdicturl checkoutsidebmp"
                  name="LgGoogleTranslateURI"
                  defaultValue="*http://translate.google.com/?ie=UTF-8&amp;sl=••&amp;tl=••&amp;text=###"
                  maxLength={200}
                  size={60}
                />
                {/* data_info="GoogleTranslate URI" */}
              </td>
            </tr>
            <tr>
              <td className="td1 right backlightyellow">Text Size:</td>
              <td className="td1">
                <select
                  name="LgTextSize"
                  className="notempty"
                  ref={refMap.LgTextSize}
                >
                  <option value="100">100 %</option>
                  <option value="150">150 %</option>
                  {/* selected */}
                  <option value="200">200 %</option>
                  <option value="250">250 %</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="td1 right">Character Substitutions:</td>
              <td className="td1">
                <input
                  type="text"
                  ref={refMap.LgCharacterSubstitutions}
                  className="checkoutsidebmp"
                  name="LgCharacterSubstitutions"
                  defaultValue="´='|`='|’='|‘='|...=…|..=‥"
                  maxLength={500}
                  size={60}
                />
                {/* data_info="Character Substitutions" */}
              </td>
            </tr>
            <tr>
              <td className="td1 right backlightyellow">
                RegExp Split Sentences:
              </td>
              <td className="td1">
                <input
                  type="text"
                  ref={refMap.LgRegexpSplitSentences}
                  className="notempty checkoutsidebmp"
                  name="LgRegexpSplitSentences"
                  defaultValue=".!?:;"
                  maxLength={500}
                  size={60}
                />
                {/* data_info="RegExp Split Sentences" */}
                <RequiredLineButton />
              </td>
            </tr>
            <tr>
              <td className="td1 right">Exceptions Split Sentences:</td>
              <td className="td1">
                <input
                  type="text"
                  ref={refMap.LgExceptionsSplitSentences}
                  className="checkoutsidebmp"
                  name="LgExceptionsSplitSentences"
                  defaultValue="Mr.|Dr.|[A-Z].|Vd.|Vds."
                  maxLength={500}
                  size={60}
                />
              </td>
              {/* data_info="Exceptions Split Sentences" */}
            </tr>
            <tr>
              <td className="td1 right backlightyellow">
                RegExp Word Characters:
              </td>
              <td className="td1">
                <input
                  type="text"
                  className="notempty checkoutsidebmp"
                  name="LgRegexpWordCharacters"
                  ref={refMap.LgRegexpWordCharacters}
                  defaultValue="a-zA-ZÀ-ÖØ-öø-ȳ"
                  maxLength={500}
                  size={60}
                />
                {/* data_info="RegExp Word Characters" */}
                <RequiredLineButton />
              </td>
            </tr>
            <tr>
              <td className="td1 right backlightyellow">
                Make each character a word:
              </td>
              <td className="td1">
                <select name="LgSplitEachChar" ref={refMap.LgSplitEachChar}>
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
                (e.g. for Chinese, Japanese, etc.)
              </td>
              {/* selected */}
            </tr>
            <tr>
              <td className="td1 right backlightyellow">Remove spaces:</td>
              <td className="td1">
                <select name="LgRemoveSpaces" ref={refMap.LgRemoveSpaces}>
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
                (e.g. for Chinese, Japanese, etc.)
              </td>
              {/* selected */}
            </tr>
            <tr>
              <td className="td1 right backlightyellow">
                Right-To-Left Script:
              </td>
              <td className="td1">
                <select ref={refMap.LgRightToLeft} name="LgRightToLeft">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
                (e.g. for Arabic, Hebrew, Farsi, Urdu, etc.)
              </td>
              {/* selected */}
            </tr>
            <tr>
              <td className="td1 right">
                Export Template
                <Icon
                  className="click"
                  iconName="question-frame"
                  title="Help"
                  alt="Help"
                />
                :{/* onClick="oewin('info_export_template.htm');" */}
              </td>
              <td className="td1">
                <input
                  type="text"
                  className="checkoutsidebmp"
                  name="LgExportTemplate"
                  ref={refMap.LgExportTemplate}
                  defaultValue="$y\t$t\n"
                  maxLength={1000}
                  size={60}
                />
              </td>
              {/* data_info="Export Template" */}
            </tr>
            <tr>
              <td className="td1 right" colSpan={2}>
                <input
                  type="button"
                  value="Cancel"
                  onClick={() => ResetForm(refMap)}
                />
                {/* onClick="{resetDirty(); location.href='edit_languages.php';}" */}
                <input
                  type="button"
                  name="op"
                  value="Save"
                  onClick={() => {
                    CheckAndSubmit(refMap, preValidateMap, validator, (value) =>
                      dataService.addLanguage(value)
                    );
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <p className="smallgray">
          <b>Important:</b>
          <br />
          The placeholders "••" for the from/sl and dest/tl language codes in
          the URIs must be <b>replaced</b> by the actual source and target
          language codes!
          <br />
          <a href="info.htm#howtolang" target="_blank">
            Please read the documentation
          </a>
          . Languages with a <b>non-Latin alphabet need special attention</b>,
          <a href="info.htm#langsetup" target="_blank">
            see also here
          </a>
          .
        </p>
      </form>
    </>
  );
}
