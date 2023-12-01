import { useState } from 'react';
import * as ss from 'superstruct';
import { dataService } from '../data/data.service';
import { Texts } from '../data/parseMySqlDump';
import { useData } from '../data/useAkita';
import { CheckAndSubmit, RefMap, parseNumMap } from '../forms/Forms';
import { useFormInput } from '../hooks/useFormInput';
import { useInternalNavigate } from '../hooks/useInternalNav';
import { Header } from '../ui-kit/Header';
import { RequiredLineButton } from '../ui-kit/Icon';
import { LanguageDropdown } from '../ui-kit/LanguageDropdown';
import { LongTextVerify } from './LongTextImportVerify.component';
import { resetDirty } from './Sorting';
import { splitCheckText } from './utils';

export default function ImportLongText({
  onSetVerify,
}: {
  onSetVerify: (verify: LongTextType) => void;
}): JSX.Element {
  const [{ languages, tags, texts, activeLanguageId }] = useData([
    'languages',
    'tags',
    'texts',
    'activeLanguageId',
  ]);
  const navigate = useInternalNavigate();
  const validator = ss.object({
    TxText: ss.string(),
    TxLgID: ss.number(),
    TxTitle: ss.string(),
  });
  const refMap = RefMap(validator);
  const TxInput = useFormInput(refMap);

  return (
    <>
      <Header title="Import Long Text" />
      <table className="tab3" cellSpacing={0} cellPadding={5}>
        <tbody>
          <tr>
            <td className="td1 right">Language:</td>
            <td className="td1">
              <LanguageDropdown
                defaultValue={activeLanguageId || undefined}
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
                type="text"
                className="notempty checkoutsidebmp"
                // data_info="Title"
                entryKey="TxTitle"
                maxLength={200}
                size={60}
              />
              <RequiredLineButton />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Text:</td>
            <td className="td1">
              {/* TODO validate one not both specified (XOR) */}
              Either specify a <b>File to upload</b>
              :
              <br />
              <input name="thefile" type="file" />
              <br />
              <br />
              <b>Or</b> paste a text from the clipboard (and do
              <b>NOT</b>
              specify file):
              <br />
              <textarea
                className="checkoutsidebmp"
                ref={refMap.TxText}
                // data_info="Upload"
                name="Upload"
                cols={60}
                rows={15}
              />
              <p className="smallgray">
                If the text is too long, the import may not be possible.
                <br />
                Current upload limits (in bytes):
                <br />
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
              <input
                type="text"
                className="notempty posintnumber"
                // data_info="Maximum Sentences per Text"
                name="maxsent"
                value="50"
                maxLength={3}
                size={3}
              />
              <RequiredLineButton />
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
                type="text"
                className="checkurl checkoutsidebmp"
                // data_info="Source URI"
                entryKey="TxSourceURI"
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
            <td className="td1 right" colSpan={2}>
              <input
                type="button"
                value="Cancel"
                onClick={() => {
                  resetDirty();
                  navigate('/');
                }}
              />
              &nbsp; | &nbsp;
              <input
                type="button"
                value="NEXT STEP: Check the Texts"
                onClick={() => {
                  console.log('LONGIMPORT', refMap.TxText.current);

                  CheckAndSubmit(
                    refMap,
                    { TxLgID: parseNumMap },
                    validator,
                    ({ TxText, TxLgID, TxTitle }) => {
                      // TODO
                      // console.log(TxLgID);
                      const splitTexts = splitCheckText(
                        TxText,
                        languages.find((lang) => lang.LgID === TxLgID)!,
                        -2
                      ) as string[];
                      console.log(splitTexts);
                      onSetVerify(
                        splitTexts.map((text, ii) => ({
                          TxText: text,
                          TxLgID,
                          TxTitle: `${TxTitle} [${ii + 1}/${
                            splitTexts.length
                          }]`,
                        }))
                      );
                    }
                  );
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
      {/* </form> */}
    </>
  );
}
// TODO flesh out
export type LongTextType = Pick<Texts, 'TxText' | 'TxLgID' | 'TxTitle'>[];

export function LongText() {
  const [verifying, setVerifying] = useState<LongTextType | null>(null);
  const isVerify = verifying !== null;
  return (
    <>
      {isVerify ? (
        <LongTextVerify verifying={verifying} />
      ) : (
        <ImportLongText onSetVerify={setVerifying} />
      )}
    </>
  );
}
{
  /* <p class="smallgray">Import of a <b>single text</b>, max. 65,000 bytes long, with optional audio:</p><p><input type="button" value="Standard Text Import" onClick="location.href='edit_texts?new=1';"> </p>

<ul class="ui-autocomplete ui-front ui-menu ui-widget ui-widget-content ui-corner-all" id="ui-id-1" tabIndex={0} style="display: none;"></ul> </>
} */
}
