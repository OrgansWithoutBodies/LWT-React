import { check_dupl_lang } from 'lwt-common';
import { dataService, languagePreValidateMap, useData } from 'lwt-state';
import { A, Header, Icon, SelectBoolean } from 'lwt-ui-kit';
import { openInNewWindow } from '../../../../../../LWT-Common/src/utils/linkHelpers';
import { Persistable } from '../../../../shared/Persistable';
import { LanguagesID, LanguagesValidator } from '../../data/validators';
import { useFormInput } from '../../hooks/useFormInput';
import { useInternalNavigate } from '../../hooks/useInternalNav';
import { PluginEntries } from '../../plugins/PluginEntries';
import { TextSizeSelect } from './NewLanguage';

export function EditLanguage({ chgID }: { chgID: LanguagesID }) {
  const [{ languages }] = useData(['languages']);
  const changingLang = languages.find(({ LgID }) => LgID === chgID);
  if (!changingLang) {
    throw new Error('Invalid Change ID!');
  }
  console.log('TEST123-');
  const validator = LanguagesValidator;
  const navigator = useInternalNavigate();
  const {
    Input: LgInput,
    refMap,
    onSubmit,
  } = useFormInput({
    entry: changingLang,
    validator,
  });

  return (
    <>
      <Header title="My Languages" />
      <h4>
        Edit Language
        <A target="_blank" href="/info#howtolang">
          <Icon src="question-frame" title="Help" />
        </A>
      </h4>
      <form>
        <LgInput type="hidden" entryKey="LgID" fixed />
        <table className="tab1" cellSpacing={0} cellPadding={5}>
          <tr>
            <td className="td1 right">Study Language "L2":</td>
            <td className="td1">
              <LgInput
                className="notempty setfocus checkoutsidebmp"
                errorName="Study Language"
                entryKey="LgName"
                maxLength={40}
                size={40}
                default
                isRequired
              />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Dictionary 1 URI:</td>
            <td className="td1">
              <LgInput
                className="notempty checkdicturl checkoutsidebmp"
                entryKey="LgDict1URI"
                default
                maxLength={200}
                size={60}
                isRequired
                errorName="Dictionary 1 URI"
              />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Dictionary 2 URI:</td>
            <td className="td1">
              <LgInput
                className="checkdicturl checkoutsidebmp"
                entryKey="LgDict2URI"
                default
                maxLength={200}
                size={60}
                errorName="Dictionary 2 URI"
              />
            </td>
          </tr>
          <tr>
            <td className="td1 right">GoogleTranslate URI:</td>
            <td className="td1">
              <LgInput
                default
                className="checkdicturl checkoutsidebmp"
                entryKey="LgGoogleTranslateURI"
                maxLength={200}
                size={60}
                errorName="GoogleTranslate URI"
              />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Text Size:</td>
            <td className="td1">
              <TextSizeSelect entryKey="LgTextSize" refMap={refMap} />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Character Substitutions:</td>
            <td className="td1">
              <LgInput
                className="checkoutsidebmp"
                errorName="Character Substitutions"
                entryKey="LgCharacterSubstitutions"
                default
                maxLength={500}
                size={60}
              />
            </td>
          </tr>
          <tr>
            <td className="td1 right">RegExp Split Sentences:</td>
            <td className="td1">
              <LgInput
                className="notempty checkoutsidebmp"
                entryKey="LgRegexpSplitSentences"
                default
                maxLength={500}
                size={60}
                errorName="RegExp Split Sentences"
                isRequired
              />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Exceptions Split Sentences:</td>
            <td className="td1">
              <LgInput
                className="checkoutsidebmp"
                errorName="Exceptions Split Sentences"
                entryKey="LgExceptionsSplitSentences"
                default
                maxLength={500}
                size={60}
              />
            </td>
          </tr>
          <tr>
            <td className="td1 right">RegExp Word Characters:</td>
            <td className="td1">
              <LgInput
                className="notempty checkoutsidebmp"
                errorName="RegExp Word Characters"
                entryKey="LgRegexpWordCharacters"
                default
                maxLength={500}
                size={60}
                isRequired
              />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Make each character a word:</td>
            <td className="td1">
              <SelectBoolean
                entryKey="LgSplitEachChar"
                entry={changingLang}
                refMap={refMap}
              />
              (e.g. for Chinese, Japanese, etc.)
            </td>
          </tr>
          <tr>
            <td className="td1 right">Remove spaces:</td>
            <td className="td1">
              <SelectBoolean
                entryKey="LgRemoveSpaces"
                entry={changingLang}
                refMap={refMap}
              />
              (e.g. for Chinese, Japanese, etc.)
            </td>
          </tr>
          <tr>
            <td className="td1 right">Right-To-Left Script:</td>
            <td className="td1">
              <SelectBoolean
                entryKey="LgRightToLeft"
                entry={changingLang}
                refMap={refMap}
              />
              (e.g. for Arabic, Hebrew, Farsi, Urdu, etc.)
            </td>
          </tr>
          <tr>
            <td className="td1 right">
              Export Template
              <Icon
                src="question-frame"
                title="Help"
                className="click"
                onClick={() => {
                  openInNewWindow('/info_export_template');
                }}
              />
              :
            </td>
            <td className="td1">
              <LgInput
                className="checkoutsidebmp"
                errorName="Export Template"
                entryKey="LgExportTemplate"
                default
                maxLength={1000}
                size={60}
              />
            </td>
          </tr>
          <PluginEntries
            persistable={Persistable.languages}
            refMap={refMap}
            InputComponent={LgInput}
          />
          <tr>
            <td className="td1 right" colSpan={2}>
              <input
                type="button"
                value="Cancel"
                onClick={() => {
                  navigator('/edit_languages');
                }}
              />
              <input
                type="button"
                value="Change"
                onClick={() => {
                  // TODO
                  check_dupl_lang();
                  onSubmit(languagePreValidateMap, (value) => {
                    dataService.editLanguage(value);
                    navigator('/edit_languages');
                  });
                }}
              />
            </td>
          </tr>
        </table>
        <p className="smallgray">
          <b>Warning:</b> Changing certain language settings (e.g. RegExp Word
          Characters, etc.)
          <br />
          may cause partial or complete loss of improved annotated texts!
        </p>
      </form>
    </>
  );
}
