import { useState } from 'react';
import * as ss from 'superstruct';
import { dataService } from '../data/data.service';
import {
  AddNewWordType,
  AddNewWordValidator,
  Words,
} from '../data/parseMySqlDump';
import { useData } from '../data/useAkita';
import { LanguagesId, WordsValidatorNoId } from '../data/validators';
import { CheckAndSubmit, RefMap, TRefMap } from '../forms/Forms';
import { useFormInput } from '../hooks/useFormInput';
import { useInternalNavigate } from '../hooks/useInternalNav';
import { Icon, RequiredLineButton } from '../ui-kit/Icon';
import { FormInput } from './buildFormInput';
import { wordPrevalidateMap } from './preValidateMaps';
import { owin, translateSentence2 } from './translateSentence2';

/**
 * This is only called from inside the reader, rly more of a pane than a component
 */
export function AddNewWordPane({
  word,
  langId,
  existingTerm = undefined,
}: {
  word?: string;
  existingTerm?: Words;
  langId: LanguagesId;
}): JSX.Element {
  // TODO reset form on new word
  // TODO verify dialog on change
  const validator = AddNewWordValidator;
  const refMap = RefMap<AddNewWordType>(validator);
  const [{ languages }] = useData(['languages']);
  const navigator = useInternalNavigate();
  // TODO hashmap here avoid lookup
  const lang = languages.find((lang) => lang.LgID === langId);
  const [FormErrors, setFormErrors] = useState<{
    [key in keyof AddNewWordType]?: boolean;
  }>({ WoText: false });
  const setFormErrorLine =
    (key: keyof AddNewWordType): SetBoolean =>
    (value) =>
      setFormErrors({ ...FormErrors, [key]: value });
  const WoInput = useFormInput(refMap, { WoText: word || '' });
  const isEdit = existingTerm !== undefined;
  const termStatus = isEdit ? `${existingTerm.WoStatus}` : '1';

  if (!lang) {
    throw new Error('Incorrect Language Set!');
  }
  const langString = lang.LgName;
  return (
    <>
      <form name="newword" className="validate">
        <input type="hidden" name="fromAnn" value="" />
        <input
          type="hidden"
          name="WoLgID"
          ref={refMap.WoLgID}
          id="langfield"
          value={langId}
        />
        <input
          type="hidden"
          name="WoCreated"
          ref={refMap.WoCreated}
          id="langfield"
          // TODO add creation val
          value={langId}
        />
        <input
          type="hidden"
          name="WoTextLC"
          ref={refMap.WoTextLC}
          // value={word?.toLowerCase()}
        />
        {/* TODO what are these */}
        <input type="hidden" name="tid" value="11" />
        <input type="hidden" name="ord" value="7" />

        <table className="tab2" cellSpacing={0} cellPadding={5}>
          <tbody>
            <tr>
              <td className="td1 right">Language:</td>
              <td className="td1">{langString}</td>
            </tr>
            <tr title="Only change uppercase/lowercase!">
              <td className="td1 right">
                <b>{isEdit ? 'Edit' : 'New'} Term:</b>
              </td>
              <td className="td1">
                <WoInput
                  className="notempty checkoutsidebmp"
                  // data_info="New Term"
                  type="text"
                  entryKey="WoText"
                  // id="wordfield"
                  // value={word}
                  default
                  // defaultEntry={FormState}
                  onChange={() =>
                    // TODO bring into buildFormInput
                    CheckErrors('WoText', refMap, setFormErrorLine('WoText'))
                  }
                  size={35}
                />
                <RequiredLineButton />
              </td>
            </tr>
            {/* TODO bring logic into formlines */}
            {FormErrors.WoText && (
              <tr title="Only change uppercase/lowercase!">
                <td style={{ color: 'red' }}>ERROR</td>
                <td />
              </tr>
            )}
            <tr>
              <td className="td1 right">Translation:</td>
              <td className="td1">
                <textarea
                  name="WoTranslation"
                  // value={FormState.WoTranslation}
                  ref={refMap.WoTranslation}
                  onChange={() =>
                    CheckErrors(
                      'WoTranslation',
                      refMap,
                      setFormErrorLine('WoTranslation')
                    )
                  }
                  className="setfocus textarea-noreturn checklength checkoutsidebmp"
                  maxLength={500}
                  // data_info="Translation"
                  cols={35}
                  rows={3}
                />
              </td>
            </tr>
            {FormErrors.WoTranslation && (
              <tr title="Only change uppercase/lowercase!">
                <td style={{ color: 'red' }}>ERROR</td>
                <td />
              </tr>
            )}
            <tr>
              <td className="td1 right">Tags:</td>
              <td className="td1">
                <ul
                  id="termtags"
                  className="tagit ui-widget ui-widget-content ui-corner-all"
                >
                  <li className="tagit-new">
                    <span
                      role="status"
                      aria-live="polite"
                      className="ui-helper-hidden-accessible"
                    />
                    <input
                      type="text"
                      maxLength={20}
                      onChange={(event) =>
                        handleFormChange('WoTranslation', event.target.value)
                      }
                      size={20}
                      className="ui-widget-content ui-autocomplete-input"
                      autoComplete="off"
                    />
                  </li>
                </ul>
              </td>
            </tr>
            {/* {FormErrors.wotags && (
              <tr title="Only change uppercase/lowercase!">
                <td style={{ color: 'red' }}>ERROR</td>
                <td></td>
              </tr>
            )} */}
            <tr>
              <td className="td1 right">Romaniz.:</td>
              <td className="td1">
                <FormInput
                  type="text"
                  className="checkoutsidebmp"
                  // data_info="Romanization"
                  entryKey="WoRomanization"
                  refMap={refMap}
                  maxLength={100}
                  size={35}
                />
              </td>
            </tr>
            {FormErrors.WoRomanization && (
              <tr title="Only change uppercase/lowercase!">
                <td style={{ color: 'red' }}>ERROR</td>
                <td />
              </tr>
            )}
            <tr>
              <td className="td1 right">
                Sentence
                <br />
                Term in :
              </td>
              <td className="td1">
                <textarea
                  name="WoSentence"
                  className="textarea-noreturn checklength checkoutsidebmp"
                  maxLength={1000}
                  // data_info="Sentence"
                  cols={35}
                  rows={3}
                  ref={refMap.WoSentence}
                />
              </td>
            </tr>
            <tr>
              <td className="td1 right">Status:</td>
              <td className="td1">
                <StatusRadioButtons termStatus={termStatus} refMap={refMap} />
              </td>
            </tr>
            <tr>
              <td className="td1 right" colSpan={2}>
                <script type="text/javascript" />
                Lookup Term:
                {/* external link */}
                <a
                  href={replaceTemplate(lang.LgDict1URI, word)}
                  // TODO whats this
                  target="ru"
                >
                  Dict1
                </a>
                {/* TODO */}
                {/* external link */}
                <a href={replaceTemplate(lang.LgDict2URI, word)} target="ru">
                  Dict2
                </a>
                <span
                  className="click"
                  onClick={() => {
                    owin(replaceTemplate(lang.LgGoogleTranslateURI, word));
                  }}
                >
                  GTr
                </span>
                | Sent.:
                <span
                  className="click"
                  onClick={() => {
                    // TODO
                    // replaceTemplate(lang.LgGoogleTranslateURI, word)
                    translateSentence2(
                      // TODO url
                      `http://translate.google.com/?ie=UTF-8&sl=${lang.LgGoogleTranslateURI}&tl=en&text=###`,
                      refMap.WoSentence.current
                    );
                  }}
                >
                  GTr
                </span>
                &nbsp; &nbsp; &nbsp;
                <input
                  type="button"
                  value="Save"
                  onClick={() => {
                    CheckAndSubmit(
                      refMap,
                      wordPrevalidateMap,
                      validator,
                      (value) => {
                        dataService.addTerm(value);
                        navigator('/edit_words');
                      }
                    );
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      <div id="exsent">
        <span
          className="click"
          onClick={() => {
            do_ajax_show_sentences(
              // TODO values
              2,
              '宪',
              "document.forms['newword'].WoSentence"
            );
          }}
        >
          <Icon src="sticky-notes-stack" title="Show Sentences" />
          Show Sentences
        </span>
      </div>
      <ul
        className="ui-autocomplete ui-front ui-menu ui-widget ui-widget-content ui-corner-all"
        id="ui-id-1"
        tabIndex={0}
      />
    </>
  );
}

/**
 *
 * @param templateStr
 * @param word
 */
function replaceTemplate(templateStr: string, word: string): string {
  // TODO could start with *
  return templateStr.replace('###', word);
}

/**
 *
 * @param keyChanged
 * @param refMap
 * @param setFieldError
 */
export function CheckErrors(
  keyChanged: keyof AddNewWordType,
  refMap: TRefMap<AddNewWordType>,
  setFieldError: (val: boolean) => void
) {
  const error = ss
    .pick(WordsValidatorNoId, [keyChanged])
    .validate({ [keyChanged]: refMap[keyChanged].current.value })[0];
  if (!error) {
    return setFieldError(false);
  }
  return setFieldError(true);
}
type SetBoolean = (value: boolean) => void;
/**
 * This is only called from inside the reader, rly more of a pane than a component
 */

export function StatusRadioButtons({
  termStatus,
  refMap,
}: {
  termStatus: string;
  refMap: TRefMap<AddNewWordType>;
}) {
  return (
    <>
      <span className="status1" title="Learning">
        &nbsp;
        <input
          type="radio"
          name="WoStatus"
          value="1"
          defaultChecked={termStatus === '1'}
          ref={refMap.WoStatus}
        />
        1&nbsp;
      </span>
      <span className="status2" title="Learning">
        &nbsp;
        <input
          type="radio"
          name="WoStatus"
          defaultChecked={termStatus === '2'}
          value="2"
        />
        2&nbsp;
      </span>
      <span className="status3" title="Learning">
        &nbsp;
        <input
          type="radio"
          name="WoStatus"
          defaultChecked={termStatus === '3'}
          value="3"
        />
        3&nbsp;
      </span>
      <span className="status4" title="Learning">
        &nbsp;
        <input
          type="radio"
          name="WoStatus"
          defaultChecked={termStatus === '4'}
          value="4"
        />
        4&nbsp;
      </span>
      <span className="status5" title="Learned">
        &nbsp;
        <input
          type="radio"
          name="WoStatus"
          defaultChecked={termStatus === '5'}
          value="5"
        />
        5&nbsp;
      </span>
      <span className="status99" title="Well Known">
        &nbsp;
        <input
          type="radio"
          name="WoStatus"
          defaultChecked={termStatus === '99'}
          value="99"
        />
        WKn&nbsp;
      </span>
      <span className="status98" title="Ignored">
        &nbsp;
        <input
          type="radio"
          name="WoStatus"
          value="98"
          defaultChecked={termStatus === '98'}
        />
        Ign&nbsp;
      </span>
    </>
  );
}

/* TODO get sentences */

function SentencesForWord({ word }: { word: Words }) {
  return (
    <>
      <p>
        <b>
          Sentences in active texts with <i>{word.WoTextLC}</i>
        </b>
      </p>
      <p>
        (Click on <Icon src="tick-button" title="Choose" /> to copy sentence
        into above term)
      </p>
      <p>
        <span
          className="click"
          // TODO
          onClick="{' . $jsctlname . '.value=' . prepare_textdata_js($sent[1]) . '; makeDirty();}"
        >
          <Icon src="tick-button" title="Choose" />
        </span>{' '}
        &nbsp;
        {/* TODO */}
        ' . $sent[0] . '
        <br />
      </p>
    </>
  );
}
/**
 *
 * @param lang
 * @param word
 * @param ctl
 */
export function do_ajax_show_sentences(lang: any, word: any, ctl: any): void {
  // ('#exsent').html('<img src="icn/waiting2.gif" />');
  console.log(lang, word, ctl);
  // post(
  //   'ajax_show_sentences.php',
  //   { lang: lang, word: word, ctl: ctl },
  //   function (data: any) {
  //     ('#exsent').html(data);
  //   }
  // );
}

// function get20Sentences($lang, $wordlc, $jsctlname, $mode)
// {
// 	global $tbpref;
// 	$r = '<p><b>Sentences in active texts with <i>' . tohtml($wordlc) . '</i></b></p><p>(Click on <img src="icn/tick-button.png" title="Choose" alt="Choose" /> to copy sentence into above term)</p>';
// 	$sql = 'SELECT DISTINCT SeID, SeText FROM ' . $tbpref . 'sentences, ' . $tbpref . 'textitems WHERE TiTextLC = ' . convert_string_to_sqlsyntax($wordlc) . ' AND SeID = TiSeID AND SeLgID = ' . $lang . ' order by CHAR_LENGTH(SeText), SeText limit 0,20';
// 	$res = do_mysqli_query($sql);
// 	$r .= '<p>';
// 	$last = '';
// 	while ($record = mysqli_fetch_assoc($res)) {
// 		if ($last != $record['SeText']) {
// 			$sent = getSentence($record['SeID'], $wordlc, $mode);
// 			$r .= '<span class="click" onclick="{' . $jsctlname . '.value=' . prepare_textdata_js($sent[1]) . '; makeDirty();}"><img src="icn/tick-button.png" title="Choose" alt="Choose" /></span> &nbsp;' . $sent[0] . '<br />';
// 		}
// 		$last = $record['SeText'];
// 	}
// 	mysqli_free_result($res);
// 	$r .= '</p>';
// 	return $r;
// }
