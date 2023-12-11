import { useState } from 'react';
import Modal from 'react-modal';
import { dataService } from '../data/data.service';
import { TextSize } from '../data/type';
import { LanguageValidatorNoId } from '../data/validators';
import { LANGDEFS } from '../data/wizardData';
import { TRefMap } from '../forms/Forms';
import { useFormInput } from '../hooks/useFormInput';
import { useInternalNavigate } from '../hooks/useInternalNav';
import { Header } from '../ui-kit/Header';
import { Icon } from '../ui-kit/Icon';
import { SelectBoolean } from './EditLanguage.component';
import { resetDirty } from './Sorting';
import NewLanguageWizard from './Wizard.component';
import { openInNewWindow } from './openInNewWindow';
import { languageNoIdPreValidateMap } from './preValidateMaps';
import { check_dupl_lang } from './utils';

/**
 *
 */
export function NewLanguage() {
  // languages type map
  const [wizardOpen, setWizardOpen] = useState<boolean>(false);
  const navigator = useInternalNavigate();
  const validator = LanguageValidatorNoId;

  const defaultLgForm = {
    LgRegexpWordCharacters: 'a-zA-ZÀ-ÖØ-öø-ȳ',
    LgExportTemplate: 'y\tt\n',
    LgExceptionsSplitSentences: 'Mr.|Dr.|[A-Z].|Vd.|Vds.',
    LgRegexpSplitSentences: '.!?:;"',
    LgGoogleTranslateURI:
      '*http://translate.google.com/?ie=UTF-8&sl=••&tl=••&text=###',
    LgCharacterSubstitutions: "´='|`='|’='|‘='|...=…|..=‥",
  };
  const {
    refMap,
    Input: LgInput,
    onSubmit,
  } = useFormInput({
    validator,
    entry: defaultLgForm,
  });
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
        {/* TODO */}
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
                  isRequired
                  errorName="Study Language"
                />
              </td>
            </tr>
            <tr>
              <td className="td1 right backlightyellow">Dictionary 1 URI:</td>
              <td className="td1">
                <LgInput
                  type="text"
                  className="checkdicturl notempty checkoutsidebmp"
                  entryKey="LgDict1URI"
                  isRequired
                  maxLength={200}
                  errorName="Dictionary 1 URI"
                  size={60}
                />
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
                  errorName="Dictionary 2 URI"
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
                  errorName="GoogleTranslate URI"
                />
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
                  errorName="Character Substitutions"
                />
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
                  isRequired
                  errorName="RegExp Split Sentences"
                />
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
                  isRequired
                  errorName="Exceptions Split Sentences"
                />
              </td>
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
                  isRequired
                  size={60}
                  errorName="RegExp Word Characters"
                />
              </td>
            </tr>
            <tr>
              <td className="td1 right backlightyellow">
                Make each character a word:
              </td>
              <td className="td1">
                <SelectBoolean
                  refMap={refMap}
                  entryKey={'LgSplitEachChar'}
                  entry={{ LgSplitEachChar: 0 }}
                />
                (e.g. for Chinese, Japanese, etc.)
              </td>
            </tr>
            <tr>
              <td className="td1 right backlightyellow">Remove spaces:</td>
              <td className="td1">
                <SelectBoolean
                  refMap={refMap}
                  entryKey={'LgRemoveSpaces'}
                  entry={{ LgRemoveSpaces: 0 }}
                />
                (e.g. for Chinese, Japanese, etc.)
              </td>
            </tr>
            <tr>
              <td className="td1 right backlightyellow">
                Right-To-Left Script:
              </td>
              <td className="td1">
                <SelectBoolean
                  refMap={refMap}
                  entryKey={'LgRightToLeft'}
                  entry={{ LgRightToLeft: 0 }}
                />
                (e.g. for Arabic, Hebrew, Farsi, Urdu, etc.)
              </td>
            </tr>
            <tr>
              <td className="td1 right">
                Export Template
                <Icon
                  className="click"
                  src="question-frame"
                  title="Help"
                  onClick={() => {
                    openInNewWindow('info_export_template');
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
                errorName="Export Template"
              </td>
            </tr>
            {/* {TODO rows for plugins here} */}
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
                    onSubmit(languageNoIdPreValidateMap, (value) => {
                      dataService.addLanguage(value);
                      navigator('/edit_languages');
                    });
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
            console.log('TEST123', { refMap });
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

/**
 *
 */
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
