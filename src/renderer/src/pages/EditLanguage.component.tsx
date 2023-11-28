import { dataService } from '../data/data.service';
import { useData } from '../data/useAkita';
import { LanguagesId, LanguagesValidator } from '../data/validators';
import { useInternalNavigate } from '../nav/useInternalNav';
import { Icon, RequiredLineButton } from '../ui-kit/Icon';
import { CheckAndSubmit, RefMap, TRefMap } from './Forms';
import { Header } from './Header';
import {
  TextSizeSelect,
  languagePreValidateMap,
  oewin,
} from './NewLanguage.component';
import { resetDirty } from './Terms.component';
import { buildFormInput } from './buildFormInput';
import { check_dupl_lang } from './utils';

export function EditLanguage({ chgID }: { chgID: LanguagesId }) {
  const [{ languages }] = useData(['languages']);
  const changingLang = languages.find(({ LgID }) => {
    return LgID === chgID;
  });
  if (!changingLang) {
    throw new Error('Invalid Change ID!');
  }
  const validator = LanguagesValidator;
  const navigator = useInternalNavigate();
  const refMap = RefMap(validator);
  const LgInput = buildFormInput(refMap, changingLang);

  return (
    <>
      <Header title={'TODO'} />
      <h4>
        Edit Language
        <a target="_blank" href="info.htm#howtolang">
          <Icon src="question-frame" title="Help" />
        </a>
      </h4>
      <form className="validate">
        <LgInput type="hidden" entryKey="LgID" fixed />
        <table className="tab1" cellSpacing={0} cellPadding={5}>
          <tr>
            <td className="td1 right">Study Language "L2":</td>
            <td className="td1">
              <LgInput
                type="text"
                className="notempty setfocus checkoutsidebmp"
                // data_info="Study Language"
                entryKey="LgName"
                maxLength={40}
                size={40}
                default
              />
              <RequiredLineButton />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Dictionary 1 URI:</td>
            <td className="td1">
              <LgInput
                type="text"
                className="notempty checkdicturl checkoutsidebmp"
                entryKey="LgDict1URI"
                default
                maxLength={200}
                size={60}
                // data_info="Dictionary 1 URI"
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
                default
                maxLength={200}
                size={60}
                // data_info="Dictionary 2 URI"
              />
            </td>
          </tr>
          <tr>
            <td className="td1 right">GoogleTranslate URI:</td>
            <td className="td1">
              <LgInput
                default
                type="text"
                className="checkdicturl checkoutsidebmp"
                entryKey="LgGoogleTranslateURI"
                maxLength={200}
                size={60}
                // data_info="GoogleTranslate URI"
              />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Text Size:</td>
            <td className="td1">
              <TextSizeSelect entryKey={'LgTextSize'} refMap={refMap} />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Character Substitutions:</td>
            <td className="td1">
              <LgInput
                type="text"
                className="checkoutsidebmp"
                // data_info="Character Substitutions"
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
                type="text"
                className="notempty checkoutsidebmp"
                entryKey="LgRegexpSplitSentences"
                default
                maxLength={500}
                size={60}
                // data_info="RegExp Split Sentences"
              />
              <RequiredLineButton />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Exceptions Split Sentences:</td>
            <td className="td1">
              <LgInput
                type="text"
                className="checkoutsidebmp"
                // data_info="Exceptions Split Sentences"
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
                type="text"
                className="notempty checkoutsidebmp"
                // data_info="RegExp Word Characters"
                entryKey="LgRegexpWordCharacters"
                default
                maxLength={500}
                size={60}
              />
              <RequiredLineButton />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Make each character a word:</td>
            <td className="td1">
              <SelectBoolean
                selKey={'LgSplitEachChar'}
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
                selKey={'LgRemoveSpaces'}
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
                selKey={'LgRightToLeft'}
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
                  oewin('info_export_template.htm');
                }}
              />
              :
            </td>
            <td className="td1">
              <LgInput
                type="text"
                className="checkoutsidebmp"
                // data_info="Export Template"
                entryKey="LgExportTemplate"
                default
                maxLength={1000}
                size={60}
              />
            </td>
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
                value="Change"
                onClick={() => {
                  check_dupl_lang();
                  CheckAndSubmit(
                    refMap,
                    languagePreValidateMap,
                    validator,
                    (value) => {
                      dataService.editLanguage(chgID, value);
                      navigator('/edit_words');
                    }
                  );
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
function SelectBoolean<
  TSelKey extends string,
  TEntry extends Record<TSelKey, 0 | 1>
>({
  entry,
  selKey,
  refMap,
}: {
  entry: TEntry;
  selKey: TSelKey;
  refMap: TRefMap<TEntry>;
}) {
  const entryVal = entry[selKey];
  return (
    <select ref={refMap[selKey]} name={selKey}>
      <option value={0} selected={entryVal === 0}>
        No
      </option>
      <option value={1} selected={entryVal === 1}>
        Yes
      </option>
    </select>
  );
}
