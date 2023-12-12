import { useState } from 'react';
import { dataService } from '../data/data.service';
import { AddNewTextValidator, Text } from '../data/parseMySqlDump';
import { useData } from '../data/useAkita';
import { CheckAndSubmit, ResetForm } from '../forms/Forms';
import { useFormInput } from '../hooks/useFormInput';
import { useInternalNavigate } from '../hooks/useInternalNav';
import { Header } from '../ui-kit/Header';
import { Icon, RequiredLineButton } from '../ui-kit/Icon';
import { LanguageDropdown } from '../ui-kit/LanguageDropdown';
import { OnCheckText, TextChecker } from './CheckText';
import { do_ajax_update_media_select } from './SelectMediaPath';
import { textNoIdPrevalidateMap } from './preValidateMaps';

export function ImportShortTextPage() {
  const [checkingText, setCheckingText] = useState<null | Text>(null);
  return (
    <>
      {checkingText ? (
        <TextChecker potentialText={checkingText} />
      ) : (
        <ImportShortText onCheckText={setCheckingText} />
      )}
    </>
  );
}
/**
 *
 */
export function ImportShortText({
  onCheckText,
}: {
  onCheckText: OnCheckText;
}): JSX.Element {
  const [{ activeLanguage }] = useData(['activeLanguage']);
  const validator = AddNewTextValidator;

  const { Input: TxInput, refMap, onSubmit } = useFormInput({ validator });

  const navigator = useInternalNavigate();
  return (
    <>
      <Header
        title={activeLanguage ? `My ${activeLanguage.LgName} Texts` : ''}
      />

      <p>&nbsp;</p>
      <h4>
        New Text
        <a target="_blank" href="info#howtotext">
          <Icon src="question-frame" title="Help" />
        </a>
      </h4>
      <form className="validate">
        <table className="tab3" cellSpacing={0} cellPadding={5}>
          <tbody>
            <tr>
              <td className="td1 right">Language:</td>
              <td className="td1">
                <LanguageDropdown
                  dropdownRef={refMap.TxLgID}
                  defaultValue={
                    activeLanguage ? activeLanguage.LgID : undefined
                  }
                  onChange={(val) => dataService.setActiveLanguage(val)}
                />
                <RequiredLineButton />
              </td>
            </tr>
            <tr>
              <td className="td1 right">Title:</td>
              <td className="td1">
                <TxInput
                  type="text"
                  className="notempty checkoutsidebmp"
                  errorName="Title"
                  entryKey="TxTitle"
                  default
                  maxLength={200}
                  size={60}
                  isRequired
                />
              </td>
            </tr>
            <tr>
              <td className="td1 right">
                Text:
                <br />
                <br />
                (max.
                <br />
                65,000
                <br />
                bytes)
              </td>
              <td className="td1">
                <textarea
                  name="TxText"
                  ref={refMap.TxText}
                  className="notempty checkbytes checkoutsidebmp"
                  // TODO move these to validators
                  maxLength={65000}
                  errorName="Text"
                  cols={60}
                  rows={20}
                />
                <RequiredLineButton />
              </td>
            </tr>
            <tr>
              <td className="td1 right">Source URI:</td>
              <td className="td1">
                <TxInput
                  type="text"
                  className="checkurl checkoutsidebmp"
                  errorName="Source URI"
                  entryKey="TxSourceURI"
                  default
                  maxLength={1000}
                  size={60}
                />
              </td>
            </tr>
            <tr>
              <td className="td1 right">Tags:</td>
              <td className="td1">
                <ul
                  id="texttags"
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
                      size={20}
                      className="ui-widget-content ui-autocomplete-input"
                      autoComplete="off"
                    />
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <td className="td1 right">Audio-URI:</td>
              <td className="td1">
                <TxInput
                  type="text"
                  className="checkoutsidebmp"
                  errorName="Audio-URI"
                  entryKey="TxAudioURI"
                  default
                  maxLength={200}
                  size={60}
                />
                <span id="mediaselect">
                  <br />
                  or choose a file in ".../lwt/media" (only mp3, ogg, wav files
                  shown): <br />
                  [Directory ".../lwt/media" does not yet exist.] &nbsp; &nbsp;
                  <span className="click" onClick={do_ajax_update_media_select}>
                    <Icon
                      src="arrow-circle-135"
                      title="Refresh Media Selection"
                    />
                    Refresh
                  </span>
                </span>
              </td>
            </tr>
            <tr>
              <td className="td1 right" colSpan={2}>
                <input
                  type="button"
                  value="Cancel"
                  onClick={() => {
                    ResetForm(refMap);
                    navigator('/edit_texts');
                  }}
                />
                <input
                  type="button"
                  value="Check"
                  onClick={() => {
                    onSubmit(textNoIdPrevalidateMap, (value) => {
                      onCheckText(value);
                    });
                  }}
                />
                <input
                  type="button"
                  value="Save"
                  onClick={() => {
                    onSubmit(textNoIdPrevalidateMap, (value) => {
                      const textId = dataService.addText(value);
                      if (textId !== null) {
                        dataService.reparseText(textId);
                        navigator('/edit_texts');
                      }
                      // todo something if null?
                    });
                  }}
                />
                <input
                  type="button"
                  name="op"
                  value="Save and Open"
                  onClick={() => {
                    CheckAndSubmit(
                      refMap,
                      textNoIdPrevalidateMap,
                      validator,
                      (value) => {
                        const textId = dataService.addText(value);
                        if (textId !== null) {
                          dataService.reparseText(textId);
                          navigator(`/do_text?start=${textId}`);
                        }
                      }
                    );
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </form>

      <p className="smallgray">
        Import of a <b>long text</b>, without audio, with splitting it up into
        smaller texts:
      </p>
      <p>
        <input
          type="button"
          value="Long Text Import"
          onClick={() => navigator('/long_text_import')}
        />
      </p>

      <ul
        className="ui-autocomplete ui-front ui-menu ui-widget ui-widget-content ui-corner-all"
        id="ui-id-1"
        tabIndex={0}
      />
    </>
  );
}
