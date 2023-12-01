import { useState } from 'react';
import Modal from 'react-modal';
import { dataService } from '../data/data.service';
import { LanguagesValidatorNoId } from '../data/validators';
import { LANGDEFS } from '../data/wizardData';
import { CheckAndSubmit, RefMap } from '../forms/Forms';
import { useFormInput } from '../hooks/useFormInput';
import { useInternalNavigate } from '../hooks/useInternalNav';
import { Header } from '../ui-kit/Header';
import { Icon, RequiredLineButton } from '../ui-kit/Icon';
import { resetDirty } from './Sorting';
import NewLanguageWizard from './Wizard.component';
import { languagePreValidateMap } from './preValidateMaps';
import { check_dupl_lang } from './utils';

export function NewLanguage() {
  // languages type map
  // TODO form component?
  //  - map validator to row - but if row styling is different maybe difficult..
  const [wizardOpen, setWizardOpen] = useState<boolean>(false);
  const navigator = useInternalNavigate();
  const validator = LanguagesValidatorNoId;
  const refMap = RefMap<LanguageNoId>(validator);

  const defaultLgForm = {
    LgRegexpWordCharacters: 'a-zA-ZÀ-ÖØ-öø-ȳ',
    LgExportTemplate: '$y\t$t\n',
    LgExceptionsSplitSentences: 'Mr.|Dr.|[A-Z].|Vd.|Vds.',
    LgRegexpSplitSentences: '.!?:;"',
    LgGoogleTranslateURI:
      '*http://translate.google.com/?ie=UTF-8&sl=••&tl=••&text=###',
    LgCharacterSubstitutions: "´='|`='|’='|‘='|...=…|..=‥",
  };
  const LgInput = useFormInput(refMap, defaultLgForm);
  return (
    <>
      <Header title="New Language" />
      <h4>
        New Language
        <a target="_blank" href="info#howtolang">
          <Icon src="question-frame" title="Help" />
        </a>
      </h4>
      <form className="validate">
        {/* onsubmit="return check_dupl_lang(0);" */}
        <table className="tab1" cellSpacing={0} cellPadding={5}>
          <tbody>
            <tr>
              <td className="td1 center backlightyellow" colSpan={2}>
                <Icon
                  src="wizard"
                  title="Language Settings Wizard"
                  className="click"
                  onClick={() => {
                    setWizardOpen(true);
                  }}
                />
                <br />
                <span
                  className="click"
                  onClick={() => {
                    setWizardOpen(true);
                  }}
                >
                  <Icon src="arrow-000-medium" title="->" />
                  <b>Language Settings Wizard</b>
                  <Icon src="arrow-180-medium" title="<-" />
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
                <LgInput
                  type="text"
                  className="notempty setfocus checkoutsidebmp"
                  entryKey="LgName"
                  maxLength={40}
                  size={40}
                  default
                />
                {/* // data_info="Study Language" */}
                <RequiredLineButton />
              </td>
            </tr>
            <tr>
              <td className="td1 right backlightyellow">Dictionary 1 URI:</td>
              <td className="td1">
                <LgInput
                  type="text"
                  className="checkdicturl notempty checkoutsidebmp"
                  entryKey="LgDict1URI"
                  maxLength={200}
                  // data_info="Dictionary 1 URI"
                  size={60}
                />
                <RequiredLineButton />
              </td>
            </tr>
            <tr>
              <td className="td1 right">Dictionary 2 URI:</td>
              <td className="td1">
                <LgInput
                  type="text"
                  className="checkdicturl checkoutsidebmp"
                  entryKey="LgDict2URI"
                  maxLength={200}
                  // data_info="Dictionary 2 URI"
                  size={60}
                />
              </td>
            </tr>
            <tr>
              <td className="td1 right backlightyellow">
                GoogleTranslate URI:
              </td>
              <td className="td1">
                <LgInput
                  type="text"
                  className="checkdicturl checkoutsidebmp"
                  entryKey="LgGoogleTranslateURI"
                  maxLength={200}
                  size={60}
                  default
                />
                {/* // data_info="GoogleTranslate URI" */}
              </td>
            </tr>
            <tr>
              <td className="td1 right backlightyellow">Text Size:</td>
              <td className="td1">
                <TextSizeSelect refMap={refMap} entryKey="LgTextSize" />
              </td>
            </tr>
            <tr>
              <td className="td1 right">Character Substitutions:</td>
              <td className="td1">
                <LgInput
                  type="text"
                  className="checkoutsidebmp"
                  entryKey="LgCharacterSubstitutions"
                  maxLength={500}
                  size={60}
                  default
                />
                {/* // data_info="Character Substitutions" */}
              </td>
            </tr>
            <tr>
              <td className="td1 right backlightyellow">
                RegExp Split Sentences:
              </td>
              <td className="td1">
                <LgInput
                  type="text"
                  className="notempty checkoutsidebmp"
                  entryKey="LgRegexpSplitSentences"
                  default
                  maxLength={500}
                  size={60}
                />
                {/* // data_info="RegExp Split Sentences" */}
                <RequiredLineButton />
              </td>
            </tr>
            <tr>
              <td className="td1 right">Exceptions Split Sentences:</td>
              <td className="td1">
                <LgInput
                  type="text"
                  className="checkoutsidebmp"
                  entryKey="LgExceptionsSplitSentences"
                  default
                  maxLength={500}
                  size={60}
                />
              </td>
              {/* // data_info="Exceptions Split Sentences" */}
            </tr>
            <tr>
              <td className="td1 right backlightyellow">
                RegExp Word Characters:
              </td>
              <td className="td1">
                <LgInput
                  type="text"
                  className="notempty checkoutsidebmp"
                  entryKey="LgRegexpWordCharacters"
                  default
                  maxLength={500}
                  size={60}
                />
                {/* // data_info="RegExp Word Characters" */}
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
                  src="question-frame"
                  title="Help"
                  onClick={() => {
                    oewin('info_export_template');
                  }}
                />
                :
              </td>
              <td className="td1">
                <LgInput
                  type="text"
                  className="checkoutsidebmp"
                  entryKey="LgExportTemplate"
                  default
                  maxLength={1000}
                  size={60}
                />
              </td>
              {/* // data_info="Export Template" */}
            </tr>
            <tr>
              <td className="td1 right" colSpan={2}>
                <input
                  type="button"
                  value="Cancel"
                  onClick={() => {
                    resetDirty();
                    navigator('/edit_languages');
                  }}
                />
                <input
                  type="button"
                  name="op"
                  value="Save"
                  onClick={() => {
                    check_dupl_lang();
                    CheckAndSubmit(
                      refMap,
                      languagePreValidateMap,
                      validator,
                      (value) => {
                        dataService.addLanguage(value);
                        navigator('/edit_languages');
                      }
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
          <a href="info#howtolang" target="_blank">
            Please read the documentation
          </a>
          . Languages with a <b>non-Latin alphabet need special attention</b>,
          <a href="info#langsetup" target="_blank">
            see also here
          </a>
          .
        </p>
      </form>
      <Modal
        isOpen={wizardOpen}
        style={{
          content: {
            // TODO not hardcoded
            backgroundColor: 'black',
            width: '80%',
            height: '80%',
            left: '10%',
            top: '10%',
          },
        }}
        contentLabel="Wizard Modal"
        className="center"
      >
        <NewLanguageWizard
          onSuccess={(l1, l2) => {
            const originSpec = LANGDEFS[l1 as keyof typeof LANGDEFS];
            const targetSpec = LANGDEFS[l2 as keyof typeof LANGDEFS];
            refMap.LgName.current.value = l2;
            console.log(refMap.LgName.current.value, l1, l2);
            refMap.LgDict1URI.current.value = `*https://de.glosbe.com/${targetSpec.LgGlosbeKey}/${originSpec.LgGlosbeKey}/###`;
            refMap.LgGoogleTranslateURI.current.value = `*http://translate.google.com/?ie=UTF-8&sl=${targetSpec.LgGTransKey}&tl=${originSpec.LgGTransKey}&text=###`;
            refMap.LgTextSize.current.value = targetSpec.LgTextSize;
            refMap.LgRegexpWordCharacters.current.value =
              targetSpec.LgRegexpWordCharacters;
            refMap.LgRegexpSplitSentences.current.value =
              targetSpec.LgRegexpSplitSentences;

            refMap.LgSplitEachChar.current.value = targetSpec.LgSplitEachChar
              ? 1
              : 0;
            refMap.LgRemoveSpaces.current.value = targetSpec.LgRemoveSpaces
              ? 1
              : 0;
            refMap.LgRightToLeft.current.value = targetSpec.LgRightToLeft
              ? 1
              : 0;
            setWizardOpen(false);
          }}
          onExit={() => {
            setWizardOpen(false);
          }}
        />
      </Modal>
    </>
  );
}

export function TextSizeSelect<
  TData extends Record<string, unknown>,
  TKey extends keyof TData
>({
  refMap,
  entryKey,
  defaultValue = 100,
}: {
  refMap: TRefMap<TData>;
  entryKey: TKey;
  defaultValue?: TextSize;
}) {
  return (
    <select
      name={entryKey as string}
      className="notempty"
      ref={refMap[entryKey]}
      defaultValue={defaultValue}
    >
      <option value="100">100 %</option>
      <option value="150">150 %</option>
      <option value="200">200 %</option>
      <option value="250">250 %</option>
    </select>
  );
}

/**
 *
 * @param url
 */
export function oewin(url: string | URL | undefined) {
  // TODO
  window.open(
    url,
    'editwin',
    'width=800, height=600, scrollbars=yes, menubar=no, resizable=yes, status=no'
  );
}
