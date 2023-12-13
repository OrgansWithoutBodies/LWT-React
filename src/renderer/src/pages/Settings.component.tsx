import * as ss from 'superstruct';
import { Persistable } from '../../../shared/Persistable';
import { dataService } from '../data/data.service';
import { useData } from '../data/useAkita';
import { SettingsObjValidator } from '../data/validators';
import { CheckAndSubmit } from '../forms/Forms';
import { useFormInput } from '../hooks/useFormInput';
import { useInternalNavigate } from '../hooks/useInternalNav';
import { Header } from '../ui-kit/Header';
import { RequiredLineButton } from '../ui-kit/Icon';
import { PluginEntries, SelectBoolean } from './EditLanguage.component';
import { resetDirty } from './Sorting';
import { settingsPrevalidateMap } from './preValidateMaps';
// TODO abstract this out into a nested settings component

const validator = ss.omit(SettingsObjValidator, [
  'currentlanguage',
  'currenttext',
  'dbversion',
  'lastscorecalc',
  'showallwords',
]);
// TODO these should be able to be raw strings w \n instead of jsx elements
const CategoryJSXLookup = {
  Counts: () => (
    <>
      Text, Term &
      <br />
      Tag Tables
    </>
  ),
  ReadTexts: () => (
    <>
      Read Text
      <br />
      Screen
    </>
  ),
  FrameSetDisplayMode: () => {},
  Reading: () => {},
  TestScreen: () => {},
  TermTranslations: () => {},
  Testing: () => {},
  TermSentenceGeneration: () => {},
  SimilarTerms: () => {},
  // ...PLUGINS.settingsGroups:
};
const SettingsLayout: Record<
  keyof typeof validator.TYPE,
  {
    category: keyof typeof CategoryJSXLookup;
    description?: () => JSX.Element;
    suffix?: string;
    inputType: 'dropdown' | 'text' | 'number';
    dropdownOptions?: { key: string; val: string }[];
  }
> = {
  'set-archivedtexts-per-page': {
    category: 'Counts',
    suffix: '',
    inputType: 'dropdown',
  },
  'set-mobile-display-mode': {
    category: 'FrameSetDisplayMode',
    suffix: '',
    inputType: 'dropdown',
  },
  'set-show-text-word-counts': {
    category: 'Counts',
    suffix: '',
    inputType: 'dropdown',
  },
  'set-similar-terms-count': {
    category: 'SimilarTerms',
    suffix: '',
    inputType: 'dropdown',
  },
  'set-tags-per-page': {
    category: 'Counts',
    suffix: '',
    inputType: 'dropdown',
  },
  'set-term-sentence-count': {
    category: 'Counts',
    suffix: '',
    inputType: 'dropdown',
  },
  'set-term-translation-delimiters': {
    category: 'TermTranslations',
    suffix: '',
    inputType: 'dropdown',
  },
  'set-terms-per-page': {
    category: 'Counts',
    suffix: '',
    inputType: 'dropdown',
  },
  'set-test-edit-frame-waiting-time': {
    category: 'TestScreen',
    suffix: '',
    inputType: 'dropdown',
  },
  'set-test-h-frameheight': {
    category: 'TestScreen',
    suffix: '',
    inputType: 'dropdown',
  },
  'set-test-l-framewidth-percent': {
    category: 'TestScreen',
    suffix: '',
    inputType: 'dropdown',
  },
  'set-test-main-frame-waiting-time': {
    category: 'TestScreen',
    suffix: '',
    inputType: 'dropdown',
  },
  'set-test-r-frameheight-percent': {
    category: 'TestScreen',
    suffix: '',
    inputType: 'dropdown',
  },
  'set-test-sentence-count': {
    category: 'Testing',
    suffix: '',
    inputType: 'dropdown',
  },
  'set-text-h-frameheight-no-audio': {
    category: 'ReadTexts',
    suffix: '',
    inputType: 'dropdown',
  },
  'set-text-h-frameheight-with-audio': {
    category: 'ReadTexts',
    suffix: '',
    inputType: 'dropdown',
  },
  'set-text-l-framewidth-percent': {
    category: 'ReadTexts',
    suffix: '',
    inputType: 'dropdown',
  },
  'set-text-r-frameheight-percent': {
    category: 'ReadTexts',
    suffix: '',
    inputType: 'dropdown',
  },
  'set-text-visit-statuses-via-key': {
    category: 'Reading',
    suffix: '',
    inputType: 'dropdown',
  },
  'set-texts-per-page': {
    category: 'Counts',
    suffix: '',
    inputType: 'dropdown',
  },
  // ...PLUGINS.settings:
};
const DEFAULT_SETTINGS = {
  'set-text-h-frameheight-no-audio': 140,
  'set-text-h-frameheight-with-audio': 200,
  'set-text-l-framewidth-percent': 50,
  'set-text-r-frameheight-percent': 50,
  'set-test-h-frameheight': 140,
  'set-test-l-framewidth-percent': 50,
  'set-test-r-frameheight-percent': 50,
  'set-test-main-frame-waiting-time': 0,
  'set-test-edit-frame-waiting-time': 500,
  'set-similar-terms-count': 0,
  'set-term-translation-delimiters': '/;|',
  'set-texts-per-page': 10,
  'set-archivedtexts-per-page': 100,
  'set-terms-per-page': 100,
  'set-tags-per-page': 100,
};

/**
 *
 */
export function SettingsComponent(): JSX.Element {
  const [{ settings }] = useData(['settings']);
  const navigate = useInternalNavigate();
  // const validator = ss.array(SettingsValidator);
  // TODO use
  SettingsLayout;
  const { Input: StInput, refMap } = useFormInput({
    validator,
    entry: { ...DEFAULT_SETTINGS, ...settings },
  });
  return (
    <>
      <Header title="Settings/Preferences" />
      <p>&nbsp;</p>
      <form className="validate" action="/settings" method="post">
        <table className="tab3" cellSpacing={0} cellPadding={5}>
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
                <StInput
                  className="notempty posintnumber right setfocus"
                  entryKey="set-text-h-frameheight-no-audio"
                  errorName="Height of left top frame without audioplayer"
                  maxLength={3}
                  size={3}
                  default
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
                <StInput
                  className="notempty posintnumber right"
                  entryKey="set-text-h-frameheight-with-audio"
                  errorName="Height of left top frame with audioplayer"
                  default
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
                <StInput
                  className="notempty posintnumber right"
                  entryKey="set-text-l-framewidth-percent"
                  errorName="Width of left frames"
                  default
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
                <StInput
                  className="notempty posintnumber right"
                  entryKey="set-text-r-frameheight-percent"
                  errorName="Height of right top frame"
                  default
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
                <StInput
                  className="notempty posintnumber right"
                  entryKey="set-test-h-frameheight"
                  errorName="Height of left top frame"
                  default
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
                <StInput
                  className="notempty posintnumber right"
                  entryKey="set-test-l-framewidth-percent"
                  errorName="Width of left frames"
                  default
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
                <StInput
                  className="notempty posintnumber right"
                  entryKey="set-test-r-frameheight-percent"
                  errorName="Height of right top frame"
                  default
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
                <StInput
                  className="notempty zeroposintnumber right"
                  entryKey="set-test-main-frame-waiting-time"
                  errorName="Waiting time after assessment to display next test"
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
                <StInput
                  className="notempty zeroposintnumber right"
                  entryKey="set-test-edit-frame-waiting-time"
                  errorName="Waiting Time to clear the message/edit frame"
                  default
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
                <select
                  name="set-mobile-display-mode"
                  ref={refMap['set-mobile-display-mode']}
                >
                  {/* TODO deprecate? */}
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
                <select
                  ref={refMap['set-text-visit-statuses-via-key']}
                  name="set-text-visit-statuses-via-key"
                >
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
                <select
                  name="set-test-sentence-count"
                  ref={refMap['set-test-sentence-count']}
                  className="notempty"
                >
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
                <select
                  name="set-term-sentence-count"
                  ref={refMap['set-term-sentence-count']}
                  className="notempty"
                >
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
                <StInput
                  className="notempty zeroposintnumber right"
                  entryKey="set-similar-terms-count"
                  errorName="Similar terms to be displayed while adding/editing a term"
                  default
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
                <StInput
                  className="notempty center"
                  entryKey="set-term-translation-delimiters"
                  default
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
                <StInput
                  className="notempty posintnumber right"
                  entryKey="set-texts-per-page"
                  errorName="Texts per Page"
                  default
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
                <SelectBoolean
                  refMap={refMap}
                  entryKey={'set-show-text-word-counts'}
                  entry={{ 'set-show-text-word-counts': 1 }}
                />
              </td>
              <td className="td1 center">
                <RequiredLineButton />
              </td>
            </tr>

            <tr>
              <td className="td1 center">Archived Texts per Page</td>
              <td className="td1 center">
                <StInput
                  className="notempty posintnumber right"
                  entryKey="set-archivedtexts-per-page"
                  errorName="Archived Texts per Page"
                  default
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
                <StInput
                  className="notempty posintnumber right"
                  entryKey="set-terms-per-page"
                  errorName="Terms per Page"
                  default
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
                <StInput
                  className="notempty posintnumber right"
                  entryKey="set-tags-per-page"
                  errorName="Tags per Page"
                  default
                  maxLength={4}
                  size={4}
                />
              </td>
              <td className="td1 center">
                <RequiredLineButton />
              </td>
            </tr>
            <PluginEntries
              persistable={Persistable.settings}
              refMap={refMap}
              InputComponent={StInput}
            />
            <tr>
              <td className="td1 right" colSpan={4}>
                <input
                  type="button"
                  value="<< Back"
                  onClick={() => {
                    resetDirty();
                    navigate('/');
                  }}
                />
                &nbsp; &nbsp; | &nbsp; &nbsp;
                <input
                  type="button"
                  value="Reset all settings to default"
                  onClick={() => {
                    resetDirty();
                    // TODO verify window
                    dataService.installDefaultSettings();
                    navigate('/');
                  }}
                />
                &nbsp; &nbsp; | &nbsp; &nbsp;
                <input
                  type="button"
                  value="Save"
                  onClick={() => {
                    CheckAndSubmit(
                      refMap,
                      settingsPrevalidateMap,
                      validator,
                      (val) => {
                        console.log(val);
                        // if (false) {
                        dataService.setSettings(val);
                        // }
                      }
                    );
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </>
  );
}
