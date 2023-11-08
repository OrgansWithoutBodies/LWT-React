import { RequiredLineButton } from '../Icon';
import { useData } from '../data/useAkita';
import { Header } from './Header';

// TODO abstract this out into a nested settings component
export function SettingsComponent(): JSX.Element {
  const [{ settings }, { setViewerSettings }] = useData(['settings']);
  return (
    <>
      <Header title="Settings/Preferences" />
      <p>&nbsp;</p>
      <form className="validate" action="/settings" method="post">
        <table className="tab3" cellSpacing="0" cellPadding={5}>
          <tbody>
            <tr>
              <th className="th1">Group</th>
              <th className="th1">Description</th>
              <th className="th1" colSpan={2}>
                Value
              </th>
            </tr>

            <tr>
              <th className="th1 center" rowSpan={4}>
                Read Text
                <br />
                Screen
              </th>
              <td className="td1 center">
                Height of left top frame
                <br />
                <b>without</b> audioplayer
              </td>
              <td className="td1 center">
                <input
                  className="notempty posintnumber right setfocus"
                  type="text"
                  name="set-text-h-frameheight-no-audio"
                  // data_info="Height of left top frame without audioplayer"
                  value={140}
                  maxLength={3}
                  size={3}
                />
                <br />
                Pixel
              </td>
              <td className="td1 center">
                <RequiredLineButton />
              </td>
            </tr>

            <tr>
              <td className="td1 center">
                Height of left top frame
                <br />
                <b>with</b> audioplayer
              </td>
              <td className="td1 center">
                <input
                  className="notempty posintnumber right"
                  type="text"
                  name="set-text-h-frameheight-with-audio"
                  // data_info="Height of left top frame with audioplayer"
                  value="200"
                  maxLength={3}
                  size={3}
                />
                <br />
                Pixel
              </td>
              <td className="td1 center">
                <RequiredLineButton />
              </td>
            </tr>

            <tr>
              <td className="td1 center">Width of left frames</td>
              <td className="td1 center">
                <input
                  className="notempty posintnumber right"
                  type="text"
                  name="set-text-l-framewidth-percent"
                  // data_info="Width of left frames"
                  value="50"
                  maxLength={2}
                  size={2}
                />
                <br />
                Percent
              </td>
              <td className="td1 center">
                <RequiredLineButton />
              </td>
            </tr>

            <tr>
              <td className="td1 center">Height of right top frame</td>
              <td className="td1 center">
                <input
                  className="notempty posintnumber right"
                  type="text"
                  name="set-text-r-frameheight-percent"
                  // data_info="Height of right top frame"
                  value="50"
                  maxLength={2}
                  size={2}
                />
                <br />
                Percent
              </td>
              <td className="td1 center">
                <RequiredLineButton />
              </td>
            </tr>

            <tr>
              <th className="th1 center middle" rowSpan={5}>
                Test
                <br />
                Screen
              </th>
              <td className="td1 center">Height of left top frame</td>
              <td className="td1 center">
                <input
                  className="notempty posintnumber right"
                  type="text"
                  name="set-test-h-frameheight"
                  // data_info="Height of left top frame"
                  value="140"
                  maxLength={3}
                  size={3}
                />
                <br />
                Pixel
              </td>
              <td className="td1 center">
                <RequiredLineButton />
              </td>
            </tr>

            <tr>
              <td className="td1 center">Width of left frames</td>
              <td className="td1 center">
                <input
                  className="notempty posintnumber right"
                  type="text"
                  name="set-test-l-framewidth-percent"
                  // data_info="Width of left frames"
                  value="50"
                  maxLength={2}
                  size={2}
                />
                <br />
                Percent
              </td>
              <td className="td1 center">
                <RequiredLineButton />
              </td>
            </tr>

            <tr>
              <td className="td1 center">Height of right top frame</td>
              <td className="td1 center">
                <input
                  className="notempty posintnumber right"
                  type="text"
                  name="set-test-r-frameheight-percent"
                  // data_info="Height of right top frame"
                  value="50"
                  maxLength={2}
                  size={2}
                />
                <br />
                Percent
              </td>
              <td className="td1 center">
                <RequiredLineButton />
              </td>
            </tr>

            <tr>
              <td className="td1 center">
                Waiting time after assessment
                <br />
                to display next test
                <br />
              </td>
              <td className="td1 center">
                <input
                  className="notempty zeroposintnumber right"
                  type="text"
                  name="set-test-main-frame-waiting-time"
                  // data_info="Waiting time after assessment to display next test"
                  value="0"
                  maxLength={4}
                  size={4}
                />
                <br />
                Milliseconds
              </td>
              <td className="td1 center">
                <RequiredLineButton />
              </td>
            </tr>

            <tr>
              <td className="td1 center">
                Waiting Time <br />
                to clear the message/edit frame
              </td>
              <td className="td1 center">
                <input
                  className="notempty zeroposintnumber right"
                  type="text"
                  name="set-test-edit-frame-waiting-time"
                  // data_info="Waiting Time to clear the message/edit frame"
                  value="500"
                  maxLength={8}
                  size={8}
                />
                <br />
                Milliseconds
              </td>
              <td className="td1 center">
                <RequiredLineButton />
              </td>
            </tr>

            <tr>
              <th className="th1 center">
                Frame Set
                <br />
                Display Mode
              </th>
              <td className="td1 center">
                Select how frame sets are
                <br />
                displayed on different devices
              </td>
              <td className="td1 center">
                <select name="set-mobile-display-mode">
                  <option value="0" selected>
                    Auto
                  </option>
                  <option value="1">Force Non-Mobile</option>
                  <option value="2">Force Mobile</option>
                </select>
              </td>
              <td className="td1 center">
                <RequiredLineButton />
              </td>
            </tr>

            <tr>
              <th className="th1 center">Reading</th>
              <td className="td1 center">
                Visit only saved terms with status(es)...
                <br />
                (via keystrokes RIGHT, SPACE, LEFT, etc.)
              </td>
              <td className="td1 center">
                <select name="set-text-visit-statuses-via-key">
                  <option value="" selected>
                    [Filter off]
                  </option>
                  <option value="1">Learning [1]</option>
                  <option value="2">Learning [2]</option>
                  <option value="3">Learning [3]</option>
                  <option value="4">Learning [4]</option>
                  <option value="5">Learned [5]</option>
                  <option disabled>--------</option>
                  <option value="12">Learning [1..2]</option>
                  <option value="13">Learning [1..3]</option>
                  <option value="14">Learning [1..4]</option>
                  <option value="15">Learning/-ed [1..5]</option>
                  <option disabled>--------</option>
                  <option value="23">Learning [2..3]</option>
                  <option value="24">Learning [2..4]</option>
                  <option value="25">Learning/-ed [2..5]</option>
                  <option disabled>--------</option>
                  <option value="34">Learning [3..4]</option>
                  <option value="35">Learning/-ed [3..5]</option>
                  <option disabled>--------</option>
                  <option value="45">Learning/-ed [4..5]</option>
                  <option disabled>--------</option>
                  <option value="599">All known [5+WKn]</option>
                </select>
              </td>
              <td className="td1 center">
                <RequiredLineButton />
              </td>
            </tr>

            <tr>
              <th className="th1 center">Testing</th>
              <td className="td1 center">
                Number of sentences <br />
                displayed from text, if available
              </td>
              <td className="td1 center">
                <select name="set-test-sentence-count" className="notempty">
                  <option value="1" selected>
                    Just ONE
                  </option>
                  <option value="2">TWO (+previous)</option>
                  <option value="3">THREE (+previous,+next)</option>
                </select>
              </td>
              <td className="td1 center">
                <RequiredLineButton />
              </td>
            </tr>

            <tr>
              <th className="th1 center">
                Term Sentence
                <br />
                Generation
              </th>
              <td className="td1 center">
                Number of sentences <br />
                generated from text, if available
              </td>
              <td className="td1 center">
                <select name="set-term-sentence-count" className="notempty">
                  <option value="1" selected>
                    Just ONE
                  </option>
                  <option value="2">TWO (+previous)</option>
                  <option value="3">THREE (+previous,+next)</option>
                </select>
              </td>
              <td className="td1 center">
                <RequiredLineButton />
              </td>
            </tr>

            <tr>
              <th className="th1 center">
                Similar
                <br />
                Terms
              </th>
              <td className="td1 center">
                Similar terms to be displayed
                <br />
                while adding/editing a term
              </td>
              <td className="td1 center">
                <input
                  className="notempty zeroposintnumber right"
                  type="text"
                  name="set-similar-terms-count"
                  // data_info="Similar terms to be displayed while adding/editing a term"
                  value="0"
                  maxLength={1}
                  size={1}
                />
              </td>
              <td className="td1 center">
                <RequiredLineButton />
              </td>
            </tr>

            <tr>
              <th className="th1 center">
                Term
                <br />
                Translations
              </th>
              <td className="td1 center">
                List of characters that
                <br />
                delimit different translations
                <br />
                (used in annotation selection)
              </td>
              <td className="td1 center">
                <input
                  className="notempty center"
                  type="text"
                  name="set-term-translation-delimiters"
                  value="/;|"
                  maxLength={8}
                  size={8}
                />
              </td>
              <td className="td1 center">
                <RequiredLineButton />
              </td>
            </tr>

            <tr>
              <th className="th1 center" rowSpan={5}>
                Text, Term &
                <br />
                Tag Tables
              </th>
              <td className="td1 center">Texts per Page</td>
              <td className="td1 center">
                <input
                  className="notempty posintnumber right"
                  type="text"
                  name="set-texts-per-page"
                  // data_info="Texts per Page"
                  value="10"
                  maxLength={4}
                  size={4}
                />
              </td>
              <td className="td1 center">
                <RequiredLineButton />
              </td>
            </tr>

            <tr>
              <td className="td1 center">
                Show Word Counts of Texts immediately
                <br />(<b>"No"</b> loads a long text table faster)
              </td>
              <td className="td1 center">
                <select name="set-show-text-word-counts" className="notempty">
                  <option value="0">No</option>
                  <option value="1" selected>
                    Yes
                  </option>
                </select>
              </td>
              <td className="td1 center">
                <RequiredLineButton />
              </td>
            </tr>

            <tr>
              <td className="td1 center">Archived Texts per Page</td>
              <td className="td1 center">
                <input
                  className="notempty posintnumber right"
                  type="text"
                  name="set-archivedtexts-per-page"
                  // data_info="Archived Texts per Page"
                  value="100"
                  maxLength={4}
                  size={4}
                />
              </td>
              <td className="td1 center">
                <RequiredLineButton />
              </td>
            </tr>

            <tr>
              <td className="td1 center">Terms per Page</td>
              <td className="td1 center">
                <input
                  className="notempty posintnumber right"
                  type="text"
                  name="set-terms-per-page"
                  // data_info="Terms per Page"
                  value="100"
                  maxLength={4}
                  size={4}
                />
              </td>
              <td className="td1 center">
                <RequiredLineButton />
              </td>
            </tr>

            <tr>
              <td className="td1 center">Tags per Page</td>
              <td className="td1 center">
                <input
                  className="notempty posintnumber right"
                  type="text"
                  name="set-tags-per-page"
                  // data_info="Tags per Page"
                  value="100"
                  maxLength={4}
                  size={4}
                />
              </td>
              <td className="td1 center">
                <RequiredLineButton />
              </td>
            </tr>

            <tr>
              <td className="td1 right" colSpan={4}>
                <input
                  type="button"
                  value="<< Back"
                  onClick="{resetDirty(); location.href='index';}"
                />
                &nbsp; &nbsp; | &nbsp; &nbsp;
                <input
                  type="button"
                  value="Reset all settings to default"
                  onClick="{resetDirty(); location.href='settings?op=reset';}"
                />
                &nbsp; &nbsp; | &nbsp; &nbsp;
                <input type="submit" name="op" value="Save" />
              </td>
            </tr>
          </tbody>
        </table>
      </form>{' '}
    </>
  );
}
