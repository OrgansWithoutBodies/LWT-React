import { Languages } from '../data/parseMySqlDump';
import { useData } from '../data/useAkita';
import { Header } from './Header';
const CAKSlices = [
  'Today',
  'Yesterday',
  'Last 7 d',
  'Last 30 d',
  'Last 365 d',
  'All Time',
] as const;
type CAKMap = Record<typeof CAKSlices[number], () => number>;
function CAKRow({ language }: { language: Languages }): JSX.Element {
  return <></>;
}
// (Terms created (C), Terms changed status = Activity (A), Terms set to "Known" (K))
// table that takes a
function CAKTable({ rows, map }: { rows: any; map: CAKMap }): JSX.Element {
  return <></>;
}
export function StatisticsComponent(): JSX.Element {
  const [{ languages }] = useData(['languages']);
  return (
    <>
      <Header title="My Statistics" />

      <p>&nbsp;</p>
      <h4>
        Breakdown by Language and Term Status
        <br />
        (Click on numbers to see the list of terms)
      </h4>
      <table className="tab3" cellSpacing="0" cellPadding={5}>
        <tbody>
          <tr>
            <th className="th1">Language</th>
            <th className="th1">
              Total
              <br />
            </th>
            <th className="th1">
              Active
              <br />
              (1..5)
            </th>
            <th className="th1">
              Learning
              <br />
              (1..4)
            </th>
            <th className="th1">
              Unknown
              <br />
              (1)
            </th>
            <th className="th1">
              Learning
              <br />
              (2)
            </th>
            <th className="th1">
              Learning
              <br />
              (3)
            </th>
            <th className="th1">
              Learning
              <br />
              (4)
            </th>
            <th className="th1">
              Learned
              <br />
              (5)
            </th>
            <th className="th1">
              Well
              <br />
              Known
              <br />
              (99)
            </th>
            <th className="th1">
              Known
              <br />
              (5+99)
            </th>
            <th className="th1">
              Ign.
              <br />
              (98)
            </th>
          </tr>
          {languages.map((language) => {
            return (
              <>
                <tr>
                  <td className="td1">{language.LgName}</td>
                  <td className="td1 center">
                    <a href="edit_words?page=1&amp;text=&amp;query=&amp;filterlang=10&amp;status=&amp;tag12=0&amp;tag2=&amp;tag1=">
                      <b>TODO</b>
                    </a>
                  </td>
                  <td className="td1 center">
                    <a href="edit_words?page=1&amp;text=&amp;query=&amp;filterlang=10&amp;status=15&amp;tag12=0&amp;tag2=&amp;tag1=">
                      <b>TODO</b>
                    </a>
                  </td>
                  <td className="td1 center">
                    <a href="edit_words?page=1&amp;text=&amp;query=&amp;filterlang=10&amp;status=14&amp;tag12=0&amp;tag2=&amp;tag1=">
                      <b>TODO</b>
                    </a>
                  </td>
                  <td className="td1 center">
                    <span className="status1">
                      &nbsp;
                      <a href="edit_words?page=1&amp;text=&amp;query=&amp;filterlang=10&amp;status=1&amp;tag12=0&amp;tag2=&amp;tag1=">
                        TODO
                      </a>
                      &nbsp;
                    </span>
                  </td>
                  <td className="td1 center">
                    <span className="status2">
                      &nbsp;
                      <a href="edit_words?page=1&amp;text=&amp;query=&amp;filterlang=10&amp;status=2&amp;tag12=0&amp;tag2=&amp;tag1=">
                        0
                      </a>
                      &nbsp;
                    </span>
                  </td>
                  <td className="td1 center">
                    <span className="status3">
                      &nbsp;
                      <a href="edit_words?page=1&amp;text=&amp;query=&amp;filterlang=10&amp;status=3&amp;tag12=0&amp;tag2=&amp;tag1=">
                        0
                      </a>
                      &nbsp;
                    </span>
                  </td>
                  <td className="td1 center">
                    <span className="status4">
                      &nbsp;
                      <a href="edit_words?page=1&amp;text=&amp;query=&amp;filterlang=10&amp;status=4&amp;tag12=0&amp;tag2=&amp;tag1=">
                        0
                      </a>
                      &nbsp;
                    </span>
                  </td>
                  <td className="td1 center">
                    <span className="status5">
                      &nbsp;
                      <a href="edit_words?page=1&amp;text=&amp;query=&amp;filterlang=10&amp;status=5&amp;tag12=0&amp;tag2=&amp;tag1=">
                        0
                      </a>
                      &nbsp;
                    </span>
                  </td>
                  <td className="td1 center">
                    <span className="status99">
                      &nbsp;
                      <a href="edit_words?page=1&amp;text=&amp;query=&amp;filterlang=10&amp;status=99&amp;tag12=0&amp;tag2=&amp;tag1=">
                        0
                      </a>
                      &nbsp;
                    </span>
                  </td>
                  <td className="td1 center">
                    <span className="status5stat">
                      &nbsp;
                      <a href="edit_words?page=1&amp;text=&amp;query=&amp;filterlang=10&amp;status=599&amp;tag12=0&amp;tag2=&amp;tag1=">
                        <b>0</b>
                      </a>
                      &nbsp;
                    </span>
                  </td>
                  <td className="td1 center">
                    <span className="status98">
                      &nbsp;
                      <a href="edit_words?page=1&amp;text=&amp;query=&amp;filterlang=10&amp;status=98&amp;tag12=0&amp;tag2=&amp;tag1=">
                        <b>0</b>
                      </a>
                      &nbsp;
                    </span>
                  </td>
                </tr>
              </>
            );
          })}
        </tbody>
      </table>

      <h4>
        Breakdown by Language and Time Range
        <br />
        (Terms created (C), Terms changed status = Activity (A), Terms set to
        "Known" (K))
      </h4>
      <table className="tab3" cellSpacing="0" cellPadding={5}>
        <tbody>
          <tr>
            <th className="th1" rowSpan={2}>
              Language
            </th>
            <th className="th1" colSpan={3}>
              Today
            </th>
            <th className="th1" colSpan={3}>
              Yesterday
            </th>
            <th className="th1" colSpan={3}>
              Last 7 d
            </th>
            <th className="th1" colSpan={3}>
              Last 30 d
            </th>
            <th className="th1" colSpan={3}>
              Last 365 d
            </th>
            <th className="th1" colSpan={3}>
              All Time
            </th>
          </tr>
          <tr>
            <th className="th1">C</th>
            <th className="th1">A</th>
            <th className="th1">K</th>
            <th className="th1">C</th>
            <th className="th1">A</th>
            <th className="th1">K</th>
            <th className="th1">C</th>
            <th className="th1">A</th>
            <th className="th1">K</th>
            <th className="th1">C</th>
            <th className="th1">A</th>
            <th className="th1">K</th>
            <th className="th1">C</th>
            <th className="th1">A</th>
            <th className="th1">K</th>
            <th className="th1">C</th>
            <th className="th1">A</th>
            <th className="th1">K</th>
          </tr>
          {languages.map((language) => {
            return (
              <>
                <tr>
                  <td className="td1">{language.LgName}</td>
                  <td className="td1 center">
                    <span className="status1">&nbsp;0&nbsp;</span>
                  </td>
                  <td className="td1 center">
                    <span className="status3">&nbsp;0&nbsp;</span>
                  </td>
                  <td className="td1 center">
                    <span className="status5stat">&nbsp;0&nbsp;</span>
                  </td>
                  <td className="td1 center">
                    <span className="status1">&nbsp;0&nbsp;</span>
                  </td>
                  <td className="td1 center">
                    <span className="status3">&nbsp;0&nbsp;</span>
                  </td>
                  <td className="td1 center">
                    <span className="status5stat">&nbsp;0&nbsp;</span>
                  </td>
                  <td className="td1 center">
                    <span className="status1">&nbsp;0&nbsp;</span>
                  </td>
                  <td className="td1 center">
                    <span className="status3">&nbsp;0&nbsp;</span>
                  </td>
                  <td className="td1 center">
                    <span className="status5stat">&nbsp;0&nbsp;</span>
                  </td>
                  <td className="td1 center">
                    <span className="status1">&nbsp;0&nbsp;</span>
                  </td>
                  <td className="td1 center">
                    <span className="status3">&nbsp;0&nbsp;</span>
                  </td>
                  <td className="td1 center">
                    <span className="status5stat">&nbsp;0&nbsp;</span>
                  </td>
                  <td className="td1 center">
                    <span className="status1">&nbsp;TODO&nbsp;</span>
                  </td>
                  <td className="td1 center">
                    <span className="status3">&nbsp;TODO&nbsp;</span>
                  </td>
                  <td className="td1 center">
                    <span className="status5stat">&nbsp;0&nbsp;</span>
                  </td>
                  <td className="td1 center">
                    <span className="status1">&nbsp;TODO&nbsp;</span>
                  </td>
                  <td className="td1 center">
                    <span className="status3">&nbsp;TODO&nbsp;</span>
                  </td>
                  <td className="td1 center">
                    <span className="status5stat">&nbsp;0&nbsp;</span>
                  </td>
                </tr>
              </>
            );
          })}
          <tr>
            <th className="th1">
              <b>TOTAL</b>
            </th>
            <th className="th1 center">
              <span className="status1">&nbsp;0&nbsp;</span>
            </th>
            <th className="th1 center">
              <span className="status3">&nbsp;0&nbsp;</span>
            </th>
            <th className="th1 center">
              <span className="status5stat">&nbsp;0&nbsp;</span>
            </th>
            <th className="th1 center">
              <span className="status1">&nbsp;40&nbsp;</span>
            </th>
            <th className="th1 center">
              <span className="status3">&nbsp;47&nbsp;</span>
            </th>
            <th className="th1 center">
              <span className="status5stat">&nbsp;0&nbsp;</span>
            </th>
            <th className="th1 center">
              <span className="status1">&nbsp;40&nbsp;</span>
            </th>
            <th className="th1 center">
              <span className="status3">&nbsp;47&nbsp;</span>
            </th>
            <th className="th1 center">
              <span className="status5stat">&nbsp;0&nbsp;</span>
            </th>
            <th className="th1 center">
              <span className="status1">&nbsp;108&nbsp;</span>
            </th>
            <th className="th1 center">
              <span className="status3">&nbsp;186&nbsp;</span>
            </th>
            <th className="th1 center">
              <span className="status5stat">&nbsp;0&nbsp;</span>
            </th>
            <th className="th1 center">
              <span className="status1">&nbsp;19143&nbsp;</span>
            </th>
            <th className="th1 center">
              <span className="status3">&nbsp;19143&nbsp;</span>
            </th>
            <th className="th1 center">
              <span className="status5stat">&nbsp;89&nbsp;</span>
            </th>
            <th className="th1 center">
              <span className="status1">&nbsp;19258&nbsp;</span>
            </th>
            <th className="th1 center">
              <span className="status3">&nbsp;19258&nbsp;</span>
            </th>
            <th className="th1 center">
              <span className="status5stat">&nbsp;134&nbsp;</span>
            </th>
          </tr>
        </tbody>
      </table>
      <p>
        <input
          type="button"
          value="<< Back"
          // onClick="location.href='index';"
        />
      </p>
    </>
  );
}

// $ct = get_first_value('select count(WoID) as value from ' . $tbpref . 'words where WoLgID = ' . $lang . ' and WoStatus in (1,2,3,4,5,99) and cast(WoCreated as date) = curdate()');
// $at = get_first_value('select count(WoID) as value from ' . $tbpref . 'words where WoLgID = ' . $lang . ' and WoStatus in (1,2,3,4,5,99) and cast(WoStatusChanged as date) = curdate()');
// $kt = get_first_value('select count(WoID) as value from ' . $tbpref . 'words where WoLgID = ' . $lang . ' and WoStatus in (5,99) and cast(WoStatusChanged as date) = curdate()');

// $cy = get_first_value('select count(WoID) as value from ' . $tbpref . 'words where WoLgID = ' . $lang . ' and WoStatus in (1,2,3,4,5,99) and cast(WoCreated as date) = subdate(curdate(), \'1 day\')');
// $ay = get_first_value('select count(WoID) as value from ' . $tbpref . 'words where WoLgID = ' . $lang . ' and WoStatus in (1,2,3,4,5,99) and cast(WoStatusChanged as date) = subdate(curdate(), \'1 day\')');
// $ky = get_first_value('select count(WoID) as value from ' . $tbpref . 'words where WoLgID = ' . $lang . ' and WoStatus in (5,99) and cast(WoStatusChanged as date) = subdate(curdate(), \'1 day\')');

// $cw = get_first_value('select count(WoID) as value from ' . $tbpref . 'words where WoLgID = ' . $lang . ' and WoStatus in (1,2,3,4,5,99) and cast(WoCreated as date) between subdate(curdate(), \'6 day\') and curdate()');
// $aw = get_first_value('select count(WoID) as value from ' . $tbpref . 'words where WoLgID = ' . $lang . ' and WoStatus in (1,2,3,4,5,99) and cast(WoStatusChanged as date) between subdate(curdate(), \'6 day\') and curdate()');
// $kw = get_first_value('select count(WoID) as value from ' . $tbpref . 'words where WoLgID = ' . $lang . ' and WoStatus in (5,99) and cast(WoStatusChanged as date) between subdate(curdate(), \'6 day\') and curdate()');

// $cm = get_first_value('select count(WoID) as value from ' . $tbpref . 'words where WoLgID = ' . $lang . ' and WoStatus in (1,2,3,4,5,99) and cast(WoCreated as date) between subdate(curdate(), \'29 day\') and curdate()');
// $am = get_first_value('select count(WoID) as value from ' . $tbpref . 'words where WoLgID = ' . $lang . ' and WoStatus in (1,2,3,4,5,99) and cast(WoStatusChanged as date) between subdate(curdate(), \'29 day\') and curdate()');
// $km = get_first_value('select count(WoID) as value from ' . $tbpref . 'words where WoLgID = ' . $lang . ' and WoStatus in (5,99) and cast(WoStatusChanged as date) between subdate(curdate(), \'29 day\') and curdate()');

// $ca = get_first_value('select count(WoID) as value from ' . $tbpref . 'words where WoLgID = ' . $lang . ' and WoStatus in (1,2,3,4,5,99) and cast(WoCreated as date) between subdate(curdate(), \'364 day\') and curdate()');
// $aa = get_first_value('select count(WoID) as value from ' . $tbpref . 'words where WoLgID = ' . $lang . ' and WoStatus in (1,2,3,4,5,99) and cast(WoStatusChanged as date) between subdate(curdate(), \'364 day\') and curdate()');
// $ka = get_first_value('select count(WoID) as value from ' . $tbpref . 'words where WoLgID = ' . $lang . ' and WoStatus in (5,99) and cast(WoStatusChanged as date) between subdate(curdate(), \'364 day\') and curdate()');

// $call = get_first_value('select count(WoID) as value from ' . $tbpref . 'words where WoLgID = ' . $lang . ' and WoStatus in (1,2,3,4,5,99)');
// $aall = get_first_value('select count(WoID) as value from ' . $tbpref . 'words where WoLgID = ' . $lang . ' and WoStatus in (1,2,3,4,5,99)');
// $kall = get_first_value('select count(WoID) as value from ' . $tbpref . 'words where WoLgID = ' . $lang . ' and WoStatus in (5,99)');
