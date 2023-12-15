import { useState } from 'react';
import { dataService } from '../../data/data.service';
import { textNoIDPrevalidateMap } from '../../data/preValidateMaps';
import { ResetForm } from '../../forms/Forms';
import { useData } from '../../hooks/useData';
import { useFormInput } from '../../hooks/useFormInput';
import { useInternalNavigate } from '../../hooks/useInternalNav';
import { Header } from '../../ui-kit/Header';
import { Icon, RequiredLineButton } from '../../ui-kit/Icon';
import { LanguageDropdown } from '../../ui-kit/LanguageDropdown';
import { TextTagsSelectList } from '../../ui-kit/WordTagsSelectDropdown';
import { AddNewTextValidator } from '../../utils/parseMySqlDump';
import { do_ajax_update_media_select } from '../SelectMediaPath';
import { CheckTextType, OnCheckText, TextChecker } from './CheckText';

export function ImportShortTextPage() {
  const [checkingText, setCheckingText] = useState<null | CheckTextType>(null);
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

export function ImportShortText({
  onCheckText,
}: {
  onCheckText: OnCheckText;
}): JSX.Element {
  const [{ activeLanguage }] = useData(['activeLanguage']);
  const validator = AddNewTextValidator;

  const {
    Input: TxInput,
    refMap,
    onSubmit,
    TextArea,
  } = useFormInput({ validator });

  const navigator = useInternalNavigate();
  return (
    <>
      <Header
        title={`My ${activeLanguage ? `${activeLanguage.LgName} ` : ''}Texts`}
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
                <TextArea
                  entryKey="TxText"
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
                <TextTagsSelectList />
              </td>
            </tr>
            <tr>
              <td className="td1 right">Audio-URI:</td>
              <td className="td1">
                <TxInput
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
                    onSubmit(textNoIDPrevalidateMap, (value) => {
                      onCheckText(value);
                    });
                  }}
                />
                <input
                  type="button"
                  value="Save"
                  onClick={() => {
                    onSubmit(textNoIDPrevalidateMap, (value) => {
                      const textID = dataService.addText(value);
                      if (textID !== null) {
                        dataService.reparseText(textID);
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
                    onSubmit(textNoIDPrevalidateMap, (value) => {
                      const textID = dataService.addText(value);
                      if (textID !== null) {
                        dataService.reparseText(textID);
                        navigator(`/do_text?start=${textID}`);
                      }
                    });
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
