import { parse } from 'papaparse';
import * as ss from 'superstruct';
import { dataService } from '../data/data.service';
import { Words } from '../data/parseMySqlDump';
import {
  NumberInListValidator,
  StringInListValidator,
  languagesId,
} from '../data/validators';
import { CheckAndSubmit, RefMap, TRefMap, parseNumMap } from '../forms/Forms';
import { useInternalNavigate } from '../hooks/useInternalNav';
import { Header } from '../ui-kit/Header';
import { RequiredLineButton } from '../ui-kit/Icon';
import { LanguageDropdown } from '../ui-kit/LanguageDropdown';
import { StrengthMap } from './StrengthMap';
import { ColumnImportMode, TermName } from './TermName';

export function UploadWords() {
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
    // TODO at least has term, no dupes
    columns: ss.nonempty(ss.array()),
    c1: StringInListValidator(['w', 't', 'r', 's', 'g', 'x']),
    c2: StringInListValidator(['w', 't', 'r', 's', 'g', 'x']),
    c3: StringInListValidator(['w', 't', 'r', 's', 'g', 'x']),
    c4: StringInListValidator(['w', 't', 'r', 's', 'g', 'x']),
    c5: StringInListValidator(['w', 't', 'r', 's', 'g', 'x']),
    delimiter: StringInListValidator(['c', 't', 'h']),

    file: fileValidator,
    // TODO add hook callback to check if ID given exists
    WoLgID: languagesId,
    WoStatus: NumberInListValidator(
      Object.keys(StrengthMap).map(
        (strengthKey) => StrengthMap[strengthKey].classKey
      )
    ),
  } as const);
  const refMap = RefMap(validator);
  return (
    <>
      {/* TODO */}
      <Header title="" />
      <form encType="multipart/form-data" className="validate">
        <input ref={refMap.columns} name="columns" type="hidden" />
        <table className="tab3" cellSpacing={0} cellPadding={5}>
          <tr>
            <td className="td1 center">
              <b>Language:</b>
            </td>
            <td className="td1">
              <LanguageDropdown dropdownRef={refMap.WoLgID} />
              <RequiredLineButton />
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
                Overwrite existent
                <br />
                terms
              </b>
              :
              <select name="Over">
                {/* TODO */}
                <option value="0" selected>
                  No
                </option>
                <option value="1">Yes</option>
              </select>
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
              <input ref={refMap.file} name="thefile" type="file" />
              <br />
              <br />
              <b>Or</b> type in or paste from clipboard (do
              <b>NOT</b> specify file):
              <br />
              <textarea
                // TODO
                className="checkoutsidebmp"
                // data_info="Upload"
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
                {/* <?php echo get_wordstatus_selectoptions(NULL,false,false); ?> */}
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
                      WoStatus: parseNumMap,
                      file: (_, { file }) => {
                        return {
                          file: file.current.files[0],
                          fileName: file.current.files[0].name,
                          fileType: file.current.files[0].type,
                        };
                      },
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
        colIndsToCareAbout.map(([ind, colKey]) => {
          return [ColumnImportMode[colKey]['termParam'], row[ind]] as [
            (typeof ColumnImportMode)[keyof typeof ColumnImportMode]['termParam'],
            Words[(typeof ColumnImportMode)[keyof typeof ColumnImportMode]['termParam']]
          ];
        })
      );
      return {
        ...term,
        WoLgID: value.WoLgID,
        WoStatus: value.WoStatus,
      } as Words;
    });
  return parsedTerms;
}
// function get_wordstatus_selectoptions($v, $all, $not9899, $off = true)
// {
// 	if (!isset($v)) {
// 		if ($all)
// 			$v = "";
// 		else
// 			$v = 1;
// 	}
// 	$r = "";
// 	if ($all && $off) {
// 		$r .= "<option value=\"\"" . get_selected($v, '');
// 		$r .= ">[Filter off]</option>";
// 	}
// 	$statuses = get_statuses();
// 	foreach ($statuses as $n => $status) {
// 		if ($not9899 && ($n == 98 || $n == 99))
// 			continue;
// 		$r .= "<option value =\"" . $n . "\"" . get_selected($v, $n);
// 		$r .= ">" . tohtml($status['name']) . " [" .
// 			tohtml($status['abbr']) . "]</option>";
// 	}
// 	if ($all) {
// 		$r .= '<option disabled="disabled">--------</option>';
// 		$status_1_name = tohtml($statuses[1]["name"]);
// 		$status_1_abbr = tohtml($statuses[1]["abbr"]);
// 		$r .= "<option value=\"12\"" . get_selected($v, 12);
// 		$r .= ">" . $status_1_name . " [" . $status_1_abbr . ".." .
// 			tohtml($statuses[2]["abbr"]) . "]</option>";
// 		$r .= "<option value=\"13\"" . get_selected($v, 13);
// 		$r .= ">" . $status_1_name . " [" . $status_1_abbr . ".." .
// 			tohtml($statuses[3]["abbr"]) . "]</option>";
// 		$r .= "<option value=\"14\"" . get_selected($v, 14);
// 		$r .= ">" . $status_1_name . " [" . $status_1_abbr . ".." .
// 			tohtml($statuses[4]["abbr"]) . "]</option>";
// 		$r .= "<option value=\"15\"" . get_selected($v, 15);
// 		$r .= ">Learning/-ed [" . $status_1_abbr . ".." .
// 			tohtml($statuses[5]["abbr"]) . "]</option>";
// 		$r .= '<option disabled="disabled">--------</option>';
// 		$status_2_name = tohtml($statuses[2]["name"]);
// 		$status_2_abbr = tohtml($statuses[2]["abbr"]);
// 		$r .= "<option value=\"23\"" . get_selected($v, 23);
// 		$r .= ">" . $status_2_name . " [" . $status_2_abbr . ".." .
// 			tohtml($statuses[3]["abbr"]) . "]</option>";
// 		$r .= "<option value=\"24\"" . get_selected($v, 24);
// 		$r .= ">" . $status_2_name . " [" . $status_2_abbr . ".." .
// 			tohtml($statuses[4]["abbr"]) . "]</option>";
// 		$r .= "<option value=\"25\"" . get_selected($v, 25);
// 		$r .= ">Learning/-ed [" . $status_2_abbr . ".." .
// 			tohtml($statuses[5]["abbr"]) . "]</option>";
// 		$r .= '<option disabled="disabled">--------</option>';
// 		$status_3_name = tohtml($statuses[3]["name"]);
// 		$status_3_abbr = tohtml($statuses[3]["abbr"]);
// 		$r .= "<option value=\"34\"" . get_selected($v, 34);
// 		$r .= ">" . $status_3_name . " [" . $status_3_abbr . ".." .
// 			tohtml($statuses[4]["abbr"]) . "]</option>";
// 		$r .= "<option value=\"35\"" . get_selected($v, 35);
// 		$r .= ">Learning/-ed [" . $status_3_abbr . ".." .
// 			tohtml($statuses[5]["abbr"]) . "]</option>";
// 		$r .= '<option disabled="disabled">--------</option>';
// 		$r .= "<option value=\"45\"" . get_selected($v, 45);
// 		$r .= ">Learning/-ed [" . tohtml($statuses[4]["abbr"]) . ".." .
// 			tohtml($statuses[5]["abbr"]) . "]</option>";
// 		$r .= '<option disabled="disabled">--------</option>';
// 		$r .= "<option value=\"599\"" . get_selected($v, 599);
// 		$r .= ">All known [" . tohtml($statuses[5]["abbr"]) . "+" .
// 			tohtml($statuses[99]["abbr"]) . "]</option>";
// 	}
// 	return $r;
// }
