import { LanguagesID, LanguagesValidator, Persistable } from 'lwt-schemas';
import { dataService, languagePreValidateMap, useData } from 'lwt-state';
import {
  A,
  EntryRow,
  Header,
  Icon,
  SelectBoolean,
  useCheckLangDupl,
  useFormInput,
  useI18N,
  useInternalNavigate,
} from 'lwt-ui-kit';
import { PluginEntries } from '../../PluginEntries';
import { TextSizeSelect } from './NewLanguage';

export function EditLanguage({ chgID }: { chgID: LanguagesID }) {
  const [{ languages }] = useData(['languages']);
  const changingLang = languages.find(({ LgID }) => LgID === chgID);
  if (!changingLang) {
    throw new Error('Invalid Change ID!');
  }
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
  const t = useI18N();
  const check_dupl_lang = useCheckLangDupl();
  return (
    <>
      <Header title="My Languages" />
      <h4>
        {t('Edit Language')}
        <A target="_blank" href="/info#howtolang">
          <Icon src="question-frame" title="Help" />
        </A>
      </h4>
      <form>
        <LgInput type="hidden" entryKey="LgID" fixed />
        <table className="tab1" cellSpacing={0} cellPadding={5}>
          <EntryRow headerText='Study Language "L2"'>
            <LgInput
              className="notempty setfocus checkoutsidebmp"
              errorName="Study Language"
              entryKey="LgName"
              maxLength={40}
              size={40}
              default
              isRequired
            />
          </EntryRow>
          <EntryRow headerText="Dictionary 1 URI">
            <LgInput
              className="notempty checkdicturl checkoutsidebmp"
              entryKey="LgDict1URI"
              default
              maxLength={200}
              size={60}
              isRequired
              errorName="Dictionary 1 URI"
            />
          </EntryRow>
          <EntryRow headerText="Dictionary 2 URI">
            <LgInput
              className="checkdicturl checkoutsidebmp"
              entryKey="LgDict2URI"
              default
              maxLength={200}
              size={60}
              errorName="Dictionary 2 URI"
            />
          </EntryRow>
          <EntryRow headerText="GoogleTranslate URI">
            <LgInput
              default
              className="checkdicturl checkoutsidebmp"
              entryKey="LgGoogleTranslateURI"
              maxLength={200}
              size={60}
              errorName="GoogleTranslate URI"
            />
          </EntryRow>
          <EntryRow headerText="Text Size">
            <TextSizeSelect entryKey="LgTextSize" refMap={refMap} />
          </EntryRow>
          <EntryRow headerText="Character Substitutions">
            <LgInput
              className="checkoutsidebmp"
              errorName="Character Substitutions"
              entryKey="LgCharacterSubstitutions"
              default
              maxLength={500}
              size={60}
            />
          </EntryRow>
          <EntryRow headerText={'RegExp Split Sentences'}>
            <LgInput
              className="notempty checkoutsidebmp"
              entryKey="LgRegexpSplitSentences"
              default
              maxLength={500}
              size={60}
              errorName="RegExp Split Sentences"
              isRequired
            />
          </EntryRow>
          <EntryRow headerText={'Exceptions Split Sentences'}>
            <LgInput
              className="checkoutsidebmp"
              errorName="Exceptions Split Sentences"
              entryKey="LgExceptionsSplitSentences"
              default
              maxLength={500}
              size={60}
            />
          </EntryRow>
          <EntryRow headerText={'Word Characters'}>
            <LgInput
              className="notempty checkoutsidebmp"
              errorName="RegExp Word Characters"
              entryKey="LgRegexpWordCharacters"
              default
              maxLength={500}
              size={60}
              isRequired
            />
          </EntryRow>
          <EntryRow headerText="Make each character a word">
            <>
              <SelectBoolean
                entryKey="LgSplitEachChar"
                entry={changingLang}
                refMap={refMap}
              />
              (e.g. for Chinese, Japanese, etc.)
            </>
          </EntryRow>
          <EntryRow headerText="Remove spaces">
            <>
              <SelectBoolean
                entryKey="LgRemoveSpaces"
                entry={changingLang}
                refMap={refMap}
              />
              (e.g. for Chinese, Japanese, etc.)
            </>
          </EntryRow>
          <EntryRow headerText={'Right-To-Left Script'}>
            <>
              <SelectBoolean
                entryKey="LgRightToLeft"
                entry={changingLang}
                refMap={refMap}
              />
              (e.g. for Arabic, Hebrew, Farsi, Urdu, etc.)
            </>
          </EntryRow>
          <EntryRow
            headerText="Export Template"
            headerInfoLink="/info_export_template"
          >
            <LgInput
              className="checkoutsidebmp"
              errorName="Export Template"
              entryKey="LgExportTemplate"
              default
              maxLength={1000}
              size={60}
            />
          </EntryRow>
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
                  onSubmit(languagePreValidateMap, (value, refMap) => {
                    if (
                      check_dupl_lang(
                        { LgID: value.LgID, LgName: value.LgName },
                        () => refMap.LgName.current.focus()
                      )
                    ) {
                      dataService.editLanguage(value);
                      navigator('/edit_languages');
                    }
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
