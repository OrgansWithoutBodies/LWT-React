import { Icon } from '../Icon';
import { useData } from '../data/useAkita';
import { Header } from './Header';

export function EditLanguage({ chgID }: { chgID: number }) {
  const [{ languages }] = useData(['languages']);
  const changingLang = languages.find(({ LgID }) => {
    return LgID === chgID;
  });
  return (
    <>
      <Header title={''} />
      <h4>
        Edit Language
        <a target="_blank" href="info.htm#howtolang">
          <Icon src="question-frame" title="Help" />
        </a>
      </h4>
      <script
        type="text/javascript"
        src="js/unloadformcheck.js"
        charSet="utf-8"
      ></script>
      <form
        className="validate"
        // action={<?php echo $_SERVER['PHP_SELF']; ?>}
        method="post"
        onSubmit="return check_dupl_lang(
      <?php echo $_REQUEST['chg']; ?>
      );"
      >
        <input type="hidden" name="LgID" value={chgID} />
        <table className="tab1" cellSpacing={0} cellPadding={5}>
          <tr>
            <td className="td1 right">Study Language "L2":</td>
            <td className="td1">
              <input
                type="text"
                className="notempty setfocus checkoutsidebmp"
                data_info="Study Language"
                name="LgName"
                id="LgName"
                value={changingLang?.LgName}
                maxlength={40}
                size={40}
              />
              <Icon src="status-busy" title="Field must not be empty" />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Dictionary 1 URI:</td>
            <td className="td1">
              <input
                type="text"
                className="notempty checkdicturl checkoutsidebmp"
                name="LgDict1URI"
                value={changingLang?.LgDict1URI}
                maxLength={200}
                size={60}
                data_info="Dictionary 1 URI"
              />
              <Icon src="status-busy" title="Field must not be empty" />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Dictionary 2 URI:</td>
            <td className="td1">
              <input
                type="text"
                className="checkdicturl checkoutsidebmp"
                name="LgDict2URI"
                value={changingLang?.LgDict2URI}
                maxLength={200}
                size={60}
                data_info="Dictionary 2 URI"
              />
            </td>
          </tr>
          <tr>
            <td className="td1 right">GoogleTranslate URI:</td>
            <td className="td1">
              <input
                type="text"
                className="checkdicturl checkoutsidebmp"
                name="LgGoogleTranslateURI"
                value={changingLang?.LgGoogleTranslateURI}
                maxLength={200}
                size={60}
                data_info="GoogleTranslate URI"
              />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Text Size:</td>
            <td className="td1">
              <select name="LgTextSize">
                {/* <?php echo get_languagessize_selectoptions($record['LgTextSize']); ?> */}
              </select>
            </td>
          </tr>
          <tr>
            <td className="td1 right">Character Substitutions:</td>
            <td className="td1">
              <input
                type="text"
                className="checkoutsidebmp"
                data_info="Character Substitutions"
                name="LgCharacterSubstitutions"
                value={changingLang?.LgCharacterSubstitutions}
                maxlength={500}
                size={60}
              />
            </td>
          </tr>
          <tr>
            <td className="td1 right">RegExp Split Sentences:</td>
            <td className="td1">
              <input
                type="text"
                className="notempty checkoutsidebmp"
                name="LgRegexpSplitSentences"
                value={changingLang?.LgRegexpSplitSentences}
                maxLength={500}
                size={60}
                data_info="RegExp Split Sentences"
              />
              <Icon src="status-busy" title="Field must not be empty" />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Exceptions Split Sentences:</td>
            <td className="td1">
              <input
                type="text"
                className="checkoutsidebmp"
                data_info="Exceptions Split Sentences"
                name="LgExceptionsSplitSentences"
                value={changingLang?.LgExceptionsSplitSentences}
                maxlength={500}
                size={60}
              />
            </td>
          </tr>
          <tr>
            <td className="td1 right">RegExp Word Characters:</td>
            <td className="td1">
              <input
                type="text"
                className="notempty checkoutsidebmp"
                data_info="RegExp Word Characters"
                name="LgRegexpWordCharacters"
                value={changingLang?.LgRegexpWordCharacters}
                maxlength={500}
                size={60}
              />
              <Icon src="status-busy" title="Field must not be empty" />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Make each character a word:</td>
            <td className="td1">
              <select name="LgSplitEachChar">
                {/* <?php echo get_yesno_selectoptions($record['LgSplitEachChar']); ?> */}
              </select>
              (e.g. for Chinese, Japanese, etc.)
            </td>
          </tr>
          <tr>
            <td className="td1 right">Remove spaces:</td>
            <td className="td1">
              <select name="LgRemoveSpaces">
                {/* <?php echo get_yesno_selectoptions($record['LgRemoveSpaces']); ?> */}
              </select>
              (e.g. for Chinese, Japanese, etc.)
            </td>
          </tr>
          <tr>
            <td className="td1 right">Right-To-Left Script:</td>
            <td className="td1">
              <select name="LgRightToLeft">
                {/* <?php echo get_yesno_selectoptions($record['LgRightToLeft']); ?> */}
              </select>
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
                onClick="oewin('info_export_template.htm');"
              />
              :
            </td>
            <td className="td1">
              <input
                type="text"
                className="checkoutsidebmp"
                data_info="Export Template"
                name="LgExportTemplate"
                value={changingLang?.LgExportTemplate}
                maxlength={1000}
                size={60}
              />
            </td>
          </tr>
          <tr>
            <td className="td1 right" colSpan={2}>
              <input
                type="button"
                value="Cancel"
                onClick="{resetDirty(); location.href='edit_languages.php';}"
              />
              <input type="submit" name="op" value="Change" />
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
