import { buildSentences } from 'lwt-common';
import { AddNewTextType } from 'lwt-schemas';
import { dataService, parseNumMap, useData } from 'lwt-state';
import {
  Header,
  LanguageDropdown,
  RequiredLineButton,
  TextTagsAutocomplete,
} from 'lwt-ui-kit';
import { useState } from 'react';
import * as ss from 'superstruct';
import { TagListValidator } from '../../data/validators';
import { useFormInput } from '../../hooks/useFormInput';
import { useInternalNavigate } from '../../hooks/useInternalNav';
import { LongTextVerify } from './LongTextImportVerify.component';

export default function ImportLongText({
  onSetVerify,
}: {
  onSetVerify: (verify: AddNewTextType[]) => void;
}): JSX.Element {
  // TODO custom eslint hook to make sure in & out are same len? avoid hanging params
  const [{ languages, activeLanguageID }] = useData([
    'languages',
    'activeLanguageID',
  ]);
  const navigate = useInternalNavigate();
  const validator = ss.object({
    TxText: ss.string(),
    TxLgID: ss.number(),
    TxTitle: ss.string(),
    maxSent: ss.number(),
    taglist: TagListValidator,
  });
  const {
    Input: TxInput,
    refMap,
    setDirty,
    onSubmit,
    TextArea,
  } = useFormInput({ validator });
  return (
    <>
      <Header title="Long Text Import" />
      <form>
        <table className="tab3" cellSpacing={0} cellPadding={5}>
          <tbody>
            <tr>
              <td className="td1 right">Language:</td>
              <td className="td1">
                <LanguageDropdown
                  defaultValue={activeLanguageID || undefined}
                  onChange={(val) => dataService.setActiveLanguage(val)}
                  dropdownRef={refMap.TxLgID}
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
                  maxLength={200}
                  size={60}
                  isRequired
                />
              </td>
            </tr>
            <tr>
              <td className="td1 right">Text:</td>
              <td className="td1">
                {/* TODO validate one not both specified (XOR) */}
                Either specify a <b>File to upload</b>
                :
                <br />
                <input name="file" type="file" />
                <br />
                <br />
                <b>Or</b> paste a text from the clipboard (and do <b>NOT</b>{' '}
                specify file):
                <br />
                <TextArea
                  className="checkoutsidebmp"
                  errorName="Upload"
                  entryKey="Upload"
                  cols={60}
                  rows={15}
                />
                <p className="smallgray">
                  If the text is too long, the import may not be possible.
                  <br />
                  Current upload limits (in bytes):
                  <br />
                  {/* TODO maybe have this limited if using localstorage? */}
                  <b>post_max_size = 8M / upload_max_filesize = 2M</b>
                  <br />
                  If needed, increase in <br />
                  "" <br />
                  and restart server.
                </p>
              </td>
            </tr>
            <tr>
              <td className="td1 right">
                NEWLINES and
                <br />
                Paragraphs:
              </td>
              <td className="td1">
                <select
                  name="paragraph_handling"
                  defaultValue="1"
                  onChange={() => {
                    // TODO
                  }}
                >
                  <option value="1">ONE NEWLINE: Paragraph ends</option>
                  <option value="2">
                    TWO NEWLINEs: Paragraph ends. Single NEWLINE converted to
                    SPACE
                  </option>
                </select>
                <RequiredLineButton />
              </td>
            </tr>
            <tr>
              <td className="td1 right">
                Maximum
                <br />
                Sentences
                <br />
                per Text:
              </td>
              <td className="td1">
                <TxInput
                  className="notempty posintnumber"
                  errorName="Maximum Sentences per Text"
                  entryKey="maxSent"
                  default
                  maxLength={3}
                  isRequired
                  size={3}
                />
                <br />
                <span className="smallgray">
                  Values higher than 100 may slow down text display.
                  <br />
                  Very low values (&lt; 5) may result in too many texts.
                  <br />
                  The maximum number of new texts must not exceed 980.
                  <br />A single new text will never exceed the length of 65,000
                  bytes.
                </span>
              </td>
            </tr>
            <tr>
              <td className="td1 right">Source URI:</td>
              <td className="td1">
                <TxInput
                  className="checkurl checkoutsidebmp"
                  errorName="Source URI"
                  entryKey="TxSourceURI"
                  maxLength={1000}
                  size={60}
                />
              </td>
            </tr>
            <tr>
              <td className="td1 right">Tags:</td>
              <td className="td1">
                <TextTagsAutocomplete
                  ref={refMap.taglist}
                  onChange={setDirty}
                />
              </td>
            </tr>
            <tr>
              <td className="td1 right" colSpan={2}>
                <input
                  type="button"
                  value="Cancel"
                  onClick={() => {
                    navigate('/');
                  }}
                />
                &nbsp; | &nbsp;
                <input
                  type="button"
                  value="NEXT STEP: Check the Texts"
                  onClick={() => {
                    console.log('LONGIMPORT', refMap.TxText.current);

                    onSubmit(
                      { TxLgID: parseNumMap, maxSent: parseNumMap },
                      ({ TxText, TxLgID, TxTitle, maxSent }) => {
                        // TODO
                        // console.log(TxLgID);
                        const splitTexts = buildSentences(
                          TxText,
                          languages.find((lang) => lang.LgID === TxLgID)!
                        );
                        console.log(splitTexts);
                        const numTexts = Math.ceil(splitTexts.length / maxSent);
                        // TODO split sentences only maxSent # of sentences long
                        onSetVerify(
                          new Array(numTexts).fill(0).map((_, ii) => {
                            const sentences = splitTexts.slice(
                              ii * maxSent,
                              (ii + 1) * maxSent
                            );
                            return {
                              TxText: sentences
                                .map((val) => val.SeText)
                                .join(' ')
                                .replace(new RegExp('¶', 'g'), '\n'),
                              TxLgID,
                              TxTitle: `${TxTitle} [${ii + 1}/${numTexts}]`,
                            };
                          })
                        );
                      }
                    );
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      <>
        <p className="smallgray">
          Import of a <b>single text</b>, max. 65,000 bytes long, with optional
          audio:
        </p>
        <p>
          <input
            type="button"
            value="Standard Text Import"
            onClick={() => navigate('/edit_texts?new=1')}
          />{' '}
        </p>

        <ul
          className="ui-autocomplete ui-front ui-menu ui-widget ui-widget-content ui-corner-all"
          id="ui-id-1"
          tabIndex={0}
          style={{ display: 'none' }}
        ></ul>
      </>
    </>
  );
}

export function LongText() {
  const [verifying, setVerifying] = useState<AddNewTextType[] | null>(null);
  const isVerify = verifying !== null;
  return (
    <>
      {isVerify ? (
        <LongTextVerify
          verifying={verifying}
          onCancelVerify={() => {
            setVerifying(null);
          }}
        />
      ) : (
        <ImportLongText onSetVerify={setVerifying} />
      )}
    </>
  );
}
