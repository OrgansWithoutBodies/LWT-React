import { parse } from 'papaparse';
import * as ss from 'superstruct';
import { dataService } from '../data/data.service';
import { Word } from '../data/parseMySqlDump';
import { useData } from '../data/useAkita';
import {
  NumberInListValidator,
  StringInListValidator,
} from '../data/validators';
import { CheckAndSubmit, TRefMap, parseNumMap } from '../forms/Forms';
import { useFormInput } from '../hooks/useFormInput';
import { useInternalNavigate } from '../hooks/useInternalNav';
import { Header } from '../ui-kit/Header';
import { RequiredLineButton } from '../ui-kit/Icon';
import { SelectBoolean } from './EditLanguage.component';
import { GetWordstatusSelectoptions } from './PrintText.component';
import { StrengthMap } from './StrengthMap';
import { ColumnImportMode, TermName } from './TermName';

export function UploadWords() {
  const [{ languages }] = useData(['languages']);
  const navigator = useInternalNavigate();
  // TODO check magics
  const fileValidator = ss.object({
    file: ss.any(),
    fileName: ss.refine(ss.string(), 'ends-with-csv', (val) =>
      val.endsWith('.csv')
    ),
    fileType: ss.refine(
      ss.string(),
      'is-text-csv',
      (val) => val === 'text/csv'
    ),
  });
  const validator = ss.object({
    // TODO at least has term
    // columns: ss.refine(
    //   ss.nonempty(ss.array()),
    //   'no-dupes',
    //   (vals) =>
    //     ['w', 't', 'r', 's', 'g', 'x'].findIndex(
    //       (key) => vals.filter((keyVal) => keyVal !== key).length > 1
    //     ) === -1
    // ),
    columns: ss.nonempty(ss.array()),
    over: NumberInListValidator([0, 1]),
    c1: StringInListValidator(['w', 't', 'r', 's', 'g', 'x']),
    c2: StringInListValidator(['w', 't', 'r', 's', 'g', 'x']),
    c3: StringInListValidator(['w', 't', 'r', 's', 'g', 'x']),
    c4: StringInListValidator(['w', 't', 'r', 's', 'g', 'x']),
    c5: StringInListValidator(['w', 't', 'r', 's', 'g', 'x']),
    delimiter: StringInListValidator(['c', 't', 'h']),

    file: fileValidator,
    // TODO add hook callback to check if ID given exists
    WoLgID: NumberInListValidator(languages.map((val) => val.LgID)),
    // WoStatus: NumberInListValidator(
    //   Object.keys(StrengthMap).map(
    //     (strengthKey) => StrengthMap[strengthKey].classKey
    //   )
    // ),
  } as const);
  const {
    refMap,
    Input: UlInput,
    LanguageSelectInput,
  } = useFormInput({ validator });
  return (
    <>
      {/* TODO */}
      <Header title="" />
      <form encType="multipart/form-data" className="validate">
        <UlInput entryKey="columns" type="hidden" />
        <table className="tab3" cellSpacing={0} cellPadding={5}>
          <tr>
            <td className="td1 center">
              <b>Language:</b>
            </td>
            <td className="td1">
              <LanguageSelectInput entryKey="WoLgID" />
            </td>
          </tr>
          <tr>
            <td className="td1 center">
              <b>Import Data:</b>
              <br />
              <br />
              Format per line:
              <br />
              C1 D C2 D C3 D C4 D C5
              <br />
              <br />
              <b>Field Delimiter "D":</b>
              <br />
              <select name="Tab" ref={refMap.delimiter}>
                <option value="c" selected>
                  Comma "," [CSV File, LingQ]
                </option>
                <option value="t">TAB (ASCII 9) [TSV File]</option>
                <option value="h">Hash "#" [Direct Input]</option>
              </select>
              <br />
              <br />
              <b>Column Assignment:</b>
              <br />
              "C1":{' '}
              <select ref={refMap.c1} name="Col1">
                <option value="w" selected>
                  Term
                </option>
                <option value="t">Translation</option>
                <option value="r">Romanization</option>
                <option value="s">Sentence</option>
                <option value="g">Tag List</option>
                <option value="x">Don't import</option>
              </select>
              <br />
              "C2":{' '}
              <select ref={refMap.c2} name="Col2">
                <option value="w">Term</option>
                <option value="t" selected>
                  Translation
                </option>
                <option value="r">Romanization</option>
                <option value="s">Sentence</option>
                <option value="g">Tag List</option>
                <option value="x">Don't import</option>
              </select>
              <br />
              "C3":{' '}
              <select ref={refMap.c3} name="Col3">
                <option value="w">Term</option>
                <option value="t">Translation</option>
                <option value="r">Romanization</option>
                <option value="s">Sentence</option>
                <option value="g">Tag List</option>
                <option value="x" selected>
                  Don't import
                </option>
              </select>
              <br />
              "C4":{' '}
              <select ref={refMap.c4} name="Col4">
                <option value="w">Term</option>
                <option value="t">Translation</option>
                <option value="r">Romanization</option>
                <option value="s">Sentence</option>
                <option value="g">Tag List</option>
                <option value="x" selected>
                  Don't import
                </option>
              </select>
              <br />
              "C5":{' '}
              <select ref={refMap.c5} name="Col5">
                <option value="w">Term</option>
                <option value="t">Translation</option>
                <option value="r">Romanization</option>
                <option value="s">Sentence</option>
                <option value="g">Tag List</option>
                <option value="x" selected>
                  Don't import
                </option>
              </select>
              <br />
              <br />
              <b>
                overwrite existent
                <br />
                terms
              </b>
              :
              <SelectBoolean
                entry={{ over: 1 }}
                entryKey={'over'}
                refMap={refMap}
              />
              <br />
              <br />
              <b>Important:</b>
              <br />
              You must specify the term.
              <br />
              Translation, romanization, <br />
              sentence and tag list
              <br />
              are optional. The tag list <br />
              must be separated either
              <br />
              by spaces or commas.
            </td>
            <td className="td1">
              Either specify a <b>File to upload</b>
              :
              <br />
              <UlInput entryKey="file" type="file" />
              <br />
              <br />
              <b>Or</b> type in or paste from clipboard (do
              <b>NOT</b> specify file):
              <br />
              {/* TODO bring into forminput, take data into account */}
              <textarea
                className="checkoutsidebmp"
                errorName="Upload"
                name="Upload"
                cols={60}
                rows={25}
              />
            </td>
          </tr>
          <tr>
            <td className="td1 center">
              <b>Status</b> for all uploaded terms:
            </td>
            <td className="td1">
              <select
                ref={refMap.WoStatus}
                className="notempty"
                name="WoStatus"
              >
                {Object.keys(StrengthMap)
                  .filter((val) => val !== '0')
                  .map((key) => (
                    <option value={StrengthMap[key].classKey}>
                      {StrengthMap[key].status} [{key}]
                    </option>
                  ))}
                {/* TODO */}
                <GetWordstatusSelectoptions
                  v={null}
                  all={false}
                  not9899={false}
                />
              </select>{' '}
              <RequiredLineButton />
            </td>
          </tr>
          <tr>
            <td className="td1 center" colSpan={2}>
              <span className="red2">
                A DATABASE{' '}
                <input
                  type="button"
                  value="BACKUP"
                  onClickCapture={() => navigator('/backup_restore')}
                />{' '}
                MAY BE ADVISABLE!
                <br />
                PLEASE DOUBLE-CHECK EVERYTHING!
              </span>
              <br />
              <input
                type="button"
                value="&lt;&lt; Back"
                onClickCapture={() => navigator('/')}
              />{' '}
              &nbsp; &nbsp; &nbsp; | &nbsp; &nbsp; &nbsp;{' '}
              <input
                type="button"
                name="op"
                value="Import"
                onClick={async () => {
                  if (
                    !window.confirm(
                      'Did you double-check everything?\nAre you sure?'
                    )
                  ) {
                    return;
                  }
                  CheckAndSubmit(
                    refMap,
                    {
                      columns: (_, refMap) => [
                        refMap.c1.current.value,
                        refMap.c2.current.value,
                        refMap.c3.current.value,
                        refMap.c4.current.value,
                        refMap.c5.current.value,
                      ],
                      WoLgID: parseNumMap,
                      over: parseNumMap,
                      WoStatus: parseNumMap,
                      file: (_, { file }) => ({
                        // TODO this object confuses error handling - compound path
                        file: file.current.files[0] || false,
                        fileName: file.current.files[0]?.name,
                        fileType: file.current.files[0]?.type,
                      }),
                    },
                    validator,
                    async (value) => {
                      const parsedTerms = await parseTermsFromCSV(
                        value,
                        refMap
                      );
                      dataService.addMultipleTerms(parsedTerms);
                    }
                  );
                }}
              />
            </td>
          </tr>
        </table>
      </form>

      <p>
        Sentences should contain the term in curly brackets {'"... {term} ..."'}
        .
        <br />
        If not, such sentences can be automatically created later with the{' '}
        <br />
        "Set Term Sentences" action in the{' '}
        <input
          type="button"
          value="My Texts"
          onClick={() => navigator('/edit_texts')}
        />{' '}
        screen.
      </p>
    </>
  );
}
const delimiterMap = { c: ',', t: '\t', h: '#' };
/**
 *
 * @param refMap
 */
async function parseTermsFromCSV(
  value: { [x: string]: any },
  refMap: TRefMap<{ [x: string]: any }>
) {
  const fileBlob = value.file.file;
  console.log('blob', fileBlob);
  const stringdata = await fileBlob?.text();
  const delimiterVal = delimiterMap[value.delimiter];
  const data = parse<string[]>(stringdata!, { delimiter: delimiterVal });
  const colVals = value.columns;
  const colIndsToCareAbout = colVals.reduce(
    (prev, curr, currInd) =>
      curr !== 'x'
        ? [...prev, [currInd, curr] as [number, Exclude<TermName, 'x'>]]
        : prev,
    [] as [number, Exclude<TermName, 'x'>][]
  );
  const parsedTerms = data.data
    .filter(
      (row) =>
        !(
          (row[0] === undefined || row[0] === '') &&
          (row[1] === undefined || row[1] === '') &&
          (row[2] === undefined || row[2] === '') &&
          (row[3] === undefined || row[3] === '') &&
          (row[4] === undefined || row[4] === '')
        )
    )
    .map((row, ii) => {
      const term = Object.fromEntries(
        colIndsToCareAbout.map(
          ([ind, colKey]) =>
            [ColumnImportMode[colKey]['termParam'], row[ind]] as [
              (typeof ColumnImportMode)[keyof typeof ColumnImportMode]['termParam'],
              Word[(typeof ColumnImportMode)[keyof typeof ColumnImportMode]['termParam']]
            ]
        )
      );
      return {
        ...term,
        WoLgID: value.WoLgID,
        WoStatus: value.WoStatus,
      } as Word;
    });
  return parsedTerms;
}
