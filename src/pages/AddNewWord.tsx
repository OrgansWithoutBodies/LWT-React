import { useState } from 'react';
import * as ss from 'superstruct';
import { RequiredLineButton } from '../Icon';
import { dataService } from '../data/data.service';
import { AddNewWordType, AddNewWordValidator } from '../data/parseMySqlDump';
import { useData } from '../data/useAkita';
import { LanguagesId, WordsValidatorNoId } from '../data/validators';
import { CheckAndSubmit, RefMap, TRefMap, parseNumMap } from './Forms';

let STATUSES = {
  1: { abbr: '1', name: 'Learning' },
  2: { abbr: '2', name: 'Learning' },
  3: { abbr: '3', name: 'Learning' },
  4: { abbr: '4', name: 'Learning' },
  5: { abbr: '5', name: 'Learned' },
  99: { abbr: 'WKn', name: 'Well Known' },
  98: { abbr: 'Ign', name: 'Ignored' },
};
function CheckErrors(
  keyChanged: keyof AddNewWordType,
  refMap: TRefMap<AddNewWordType>,
  setFieldError: (val: boolean) => void
) {
  const error = ss
    .pick(WordsValidatorNoId, [keyChanged])
    .validate({ [keyChanged]: refMap[keyChanged].current.value })[0];
  console.log('TEST123-Val', keyChanged, refMap[keyChanged], error);
  if (!error) {
    return setFieldError(false);
  }
  return setFieldError(true);
}
type SetBoolean = (value: boolean) => void;
export function AddNewWord({
  word,
  langId,
  isEdit = false,
}: {
  word?: string;
  isEdit?: boolean;
  langId: LanguagesId;
}): JSX.Element {
  // TODO reset form on new word
  // TODO verify dialog on change
  const validator = AddNewWordValidator;
  const refMap = RefMap<AddNewWordType>(validator);
  const [{ languages }] = useData(['languages']);
  // TODO hashmap here avoid lookup
  const langString = languages.find((lang) => lang.LgID === langId)?.LgName;
  console.log(languages, langId);
  const [FormState, setFormState] = useState<{
    [key in keyof AddNewWordType]?: any;
  }>({});
  const [FormErrors, setFormErrors] = useState<{
    [key in keyof AddNewWordType]?: boolean;
  }>({ WoText: false });
  const setFormErrorLine =
    (key: keyof AddNewWordType): SetBoolean =>
    (value) =>
      setFormErrors({ ...FormErrors, [key]: value });
  console.log('TEST123-form', FormErrors);
  return (
    <>
      <form
        name="newword"
        className="validate"
        action="/edit_word"
        method="post"
      >
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
          value={langId}
        />
        <input
          type="hidden"
          name="WoTextLC"
          ref={refMap.WoTextLC}
          value={word}
        />
        <input type="hidden" name="tid" value="11" />
        <input type="hidden" name="ord" value="7" />

        <table className="tab2" cellSpacing="0" cellPadding={5}>
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
                <input
                  className="notempty checkoutsidebmp"
                  // data_info="New Term"
                  type="text"
                  name="WoText"
                  id="wordfield"
                  ref={refMap.WoText}
                  value={word}
                  defaultValue={FormState.WoText}
                  onChange={() =>
                    CheckErrors('WoText', refMap, setFormErrorLine('WoText'))
                  }
                  size={35}
                />
                <RequiredLineButton />
              </td>
            </tr>
            {FormErrors.WoText && (
              <tr title="Only change uppercase/lowercase!">
                <td style={{ color: 'red' }}>ERROR</td>
                <td></td>
              </tr>
            )}
            <tr>
              <td className="td1 right">Translation:</td>
              <td className="td1">
                <textarea
                  name="WoTranslation"
                  value={FormState.WoTranslation}
                  ref={refMap.WoTranslation}
                  onChange={() =>
                    CheckErrors(
                      'WoTranslation',
                      refMap,
                      setFormErrorLine('WoTranslation')
                    )
                  }
                  className="setfocus textarea-noreturn checklength checkoutsidebmp"
                  // data_maxlength="500"
                  // data_info="Translation"
                  cols={35}
                  rows={3}
                ></textarea>
              </td>
            </tr>
            {FormErrors.WoTranslation && (
              <tr title="Only change uppercase/lowercase!">
                <td style={{ color: 'red' }}>ERROR</td>
                <td></td>
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
                    ></span>
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
                <input
                  type="text"
                  className="checkoutsidebmp"
                  // data_info="Romanization"
                  onChange={(event) =>
                    handleFormChange('WoRomanization', event.target.value)
                  }
                  name="WoRomanization"
                  ref={refMap.WoRomanization}
                  value={FormState.WoRomanization}
                  maxLength={100}
                  size={35}
                />
              </td>
            </tr>
            {FormErrors.WoRomanization && (
              <tr title="Only change uppercase/lowercase!">
                <td style={{ color: 'red' }}>ERROR</td>
                <td></td>
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
                  // data_maxlength="1000"
                  // data_info="Sentence"
                  cols={35}
                  rows={3}
                  ref={refMap.WoSentence}
                ></textarea>
              </td>
            </tr>
            <tr>
              <td className="td1 right">Status:</td>
              <td className="td1">
                <span className="status1" title="Learning">
                  &nbsp;
                  <input
                    type="radio"
                    name="WoStatus"
                    value="1"
                    checked
                    ref={refMap.WoStatus}
                  />
                  1&nbsp;
                </span>
                <span className="status2" title="Learning">
                  &nbsp;
                  <input type="radio" name="WoStatus" value="2" />
                  2&nbsp;
                </span>
                <span className="status3" title="Learning">
                  &nbsp;
                  <input type="radio" name="WoStatus" value="3" />
                  3&nbsp;
                </span>
                <span className="status4" title="Learning">
                  &nbsp;
                  <input type="radio" name="WoStatus" value="4" />
                  4&nbsp;
                </span>
                <span className="status5" title="Learned">
                  &nbsp;
                  <input type="radio" name="WoStatus" value="5" />
                  5&nbsp;
                </span>
                <span className="status99" title="Well Known">
                  &nbsp;
                  <input type="radio" name="WoStatus" value="99" />
                  WKn&nbsp;
                </span>
                <span className="status98" title="Ignored">
                  &nbsp;
                  <input type="radio" name="WoStatus" value="98" />
                  Ign&nbsp;
                </span>
              </td>
            </tr>
            <tr>
              <td className="td1 right" colSpan={2}>
                <script type="text/javascript"></script>
                Lookup Term:
                <a
                  // TODO custom dict
                  href="https://dict.naver.com/linedict/zhendict/dict.html#/cnen/search?query=%E5%AE%AA"
                  target="ru"
                >
                  Dict1
                </a>
                <a
                  // TODO custom dict
                  href="http://chinesedictionary.mobi/?handler=QueryWorddict&mwdqb=%E5%AE%AA"
                  target="ru"
                >
                  Dict2
                </a>
                <span
                  className="click"
                  onClick="owin('http://translate.google.com/?ie=UTF-8&sl=zh&tl=en&text=%E5%AE%AA');"
                >
                  GTr
                </span>
                | Sent.:
                <span
                  className="click"
                  onClick="translateSentence2('http://translate.google.com/?ie=UTF-8&sl=zh&tl=en&text=###',document.forms[0].WoSentence);"
                >
                  GTr
                </span>
                &nbsp; &nbsp; &nbsp;
                <input
                  type="button"
                  name="op"
                  value="Save"
                  onClick={() => {
                    CheckAndSubmit(
                      refMap,
                      { WoStatus: parseNumMap },
                      validator,
                      (value) => dataService.addTerm(value)
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
          onClick="do_ajax_show_sentences(2, '宪', 'document.forms[\'newword\'].WoSentence');"
        >
          <img
            src="icn/sticky-notes-stack.png"
            title="Show Sentences"
            alt="Show Sentences"
          />
          Show Sentences
        </span>
      </div>
      <ul
        className="ui-autocomplete ui-front ui-menu ui-widget ui-widget-content ui-corner-all"
        id="ui-id-1"
        tabIndex={0}
        // style="display: none"
      ></ul>
    </>
  );
}
