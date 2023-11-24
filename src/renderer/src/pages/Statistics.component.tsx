import { Languages } from '../data/parseMySqlDump';
import { useData } from '../data/useAkita';
import { A } from '../nav/InternalLink';
import { InternalPaths, useInternalNavigate } from '../nav/useInternalNav';
import { Header } from './Header';
const CAKSlices = [
  'Today',
  'Yesterday',
  'Last 7 d',
  'Last 30 d',
  'Last 365 d',
  'All Time',
] as const;
type CAKMap = Record<(typeof CAKSlices)[number], () => number>;
function CAKRow({ language }: { language: Languages }): JSX.Element {
  return <></>;
}
// (Terms created (C), Terms changed status = Activity (A), Terms set to "Known" (K))
// table that takes a
function CAKTable({ rows, map }: { rows: any; map: CAKMap }): JSX.Element {
  return <></>;
}
export function StatisticsComponent(): JSX.Element {
  const [{ languages, languageStatusStatistics }] = useData([
    'languages',
    'languageStatusStatistics',
  ]);

  const periods = [
    'Today',
    'Yesterday',
    'Last 7 d',
    'Last 30 d',
    'Last 365 d',
    'All Time',
  ];
  console.log('TEST123', languageStatusStatistics);
  return (
    <>
      <Header title="My Statistics" />

      <p>&nbsp;</p>
      <h4>
        Breakdown by Language and Term Status
        <br />
        (Click on numbers to see the list of terms)
      </h4>
      <table className="tab3" cellSpacing={0} cellPadding={5}>
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
          {languageStatusStatistics &&
            languages.map((language) => {
              const statuses = [
                //               15
                // ,14
                1, 2, 3, 4, 5, 99, 599, 98,
              ];

              return (
                <>
                  <tr>
                    <td className="td1">{language.LgName}</td>
                    <td className="td1 center">
                      <A href={`/edit_words?filterlang=${language.LgID}`}>
                        <b>
                          {languageStatusStatistics[language.LgID]['total']}
                        </b>
                      </A>
                    </td>
                    <td className="td1 center">
                      <A
                        href={`/edit_words?filterlang=${
                          language.LgID
                        }&status=${15}`}
                      >
                        <b> {languageStatusStatistics[language.LgID][15]}</b>
                      </A>
                    </td>
                    <td className="td1 center">
                      <A
                        href={`/edit_words?filterlang=${
                          language.LgID
                        }&status=${14}`}
                      >
                        <b>{languageStatusStatistics[language.LgID][14]}</b>
                      </A>
                    </td>
                    {languageStatusStatistics &&
                      statuses.map((statusVal) => {
                        return (
                          <td className="td1 center">
                            <span className={`status${statusVal}`}>
                              &nbsp;
                              <A
                                href={`/edit_words?filterlang=${language.LgID}&status=${statusVal}`}
                              >
                                {
                                  languageStatusStatistics[language.LgID][
                                    statusVal
                                  ]
                                }
                              </A>
                              &nbsp;
                            </span>
                          </td>
                        );
                      })}
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
      <table className="tab3" cellSpacing={0} cellPadding={5}>
        <tbody>
          <tr>
            <th className="th1" rowSpan={2}>
              Language
            </th>
            {periods.map((period) => {
              return (
                <th className="th1" colSpan={3}>
                  {period}
                </th>
              );
            })}
          </tr>
          <tr>
            {periods.map(() => {
              return (
                <>
                  <th className="th1">C</th>
                  <th className="th1">A</th>
                  <th className="th1">K</th>
                </>
              );
            })}
          </tr>
          {languages.map((language) => {
            return (
              <>
                <tr>
                  <td className="td1">{language.LgName}</td>
                  <td className="td1 center">
                    <span className="status1">&nbsp;TODO&nbsp;</span>
                  </td>
                  <td className="td1 center">
                    <span className="status3">&nbsp;TODO&nbsp;</span>
                  </td>
                  <td className="td1 center">
                    <span className="status5stat">&nbsp;TODO&nbsp;</span>
                  </td>
                  <td className="td1 center">
                    <span className="status1">&nbsp;TODO&nbsp;</span>
                  </td>
                  <td className="td1 center">
                    <span className="status3">&nbsp;TODO&nbsp;</span>
                  </td>
                  <td className="td1 center">
                    <span className="status5stat">&nbsp;TODO&nbsp;</span>
                  </td>
                  <td className="td1 center">
                    <span className="status1">&nbsp;TODO&nbsp;</span>
                  </td>
                  <td className="td1 center">
                    <span className="status3">&nbsp;TODO&nbsp;</span>
                  </td>
                  <td className="td1 center">
                    <span className="status5stat">&nbsp;TODO&nbsp;</span>
                  </td>
                  <td className="td1 center">
                    <span className="status1">&nbsp;TODO&nbsp;</span>
                  </td>
                  <td className="td1 center">
                    <span className="status3">&nbsp;TODO&nbsp;</span>
                  </td>
                  <td className="td1 center">
                    <span className="status5stat">&nbsp;TODO&nbsp;</span>
                  </td>
                  <td className="td1 center">
                    <span className="status1">&nbsp;TODO&nbsp;</span>
                  </td>
                  <td className="td1 center">
                    <span className="status3">&nbsp;TODO&nbsp;</span>
                  </td>
                  <td className="td1 center">
                    <span className="status5stat">&nbsp;TODO&nbsp;</span>
                  </td>
                  <td className="td1 center">
                    <span className="status1">&nbsp;TODO&nbsp;</span>
                  </td>
                  <td className="td1 center">
                    <span className="status3">&nbsp;TODO&nbsp;</span>
                  </td>
                  <td className="td1 center">
                    <span className="status5stat">&nbsp;TODO&nbsp;</span>
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
              <span className="status1">&nbsp;TODO&nbsp;</span>
            </th>
            <th className="th1 center">
              <span className="status3">&nbsp;TODO&nbsp;</span>
            </th>
            <th className="th1 center">
              <span className="status5stat">&nbsp;TODO&nbsp;</span>
            </th>
            <th className="th1 center">
              <span className="status1">&nbsp;TODO&nbsp;</span>
            </th>
            <th className="th1 center">
              <span className="status3">&nbsp;47&nbsp;</span>
            </th>
            <th className="th1 center">
              <span className="status5stat">&nbsp;TODO&nbsp;</span>
            </th>
            <th className="th1 center">
              <span className="status1">&nbsp;TODO&nbsp;</span>
            </th>
            <th className="th1 center">
              <span className="status3">&nbsp;TODO&nbsp;</span>
            </th>
            <th className="th1 center">
              <span className="status5stat">&nbsp;TODO&nbsp;</span>
            </th>
            <th className="th1 center">
              <span className="status1">&nbsp;TODO&nbsp;</span>
            </th>
            <th className="th1 center">
              <span className="status3">&nbsp;TODO&nbsp;</span>
            </th>
            <th className="th1 center">
              <span className="status5stat">&nbsp;TODO&nbsp;</span>
            </th>
            <th className="th1 center">
              <span className="status1">&nbsp;TODO&nbsp;</span>
            </th>
            <th className="th1 center">
              <span className="status3">&nbsp;TODO&nbsp;</span>
            </th>
            <th className="th1 center">
              <span className="status5stat">&nbsp;TODO&nbsp;</span>
            </th>
            <th className="th1 center">
              <span className="status1">&nbsp;TODO&nbsp;</span>
            </th>
            <th className="th1 center">
              <span className="status3">&nbsp;TODO&nbsp;</span>
            </th>
            <th className="th1 center">
              <span className="status5stat">&nbsp;TODO&nbsp;</span>
            </th>
          </tr>
        </tbody>
      </table>
      <p>
        <NavigateButton value={'<< Back'} navigateTo={RouterPage.HOME} />
      </p>
    </>
  );
}
enum RouterPage {
  HOME = '/',
}
export function NavigateButton({
  value,
  navigateTo,
}: {
  value: string;
  navigateTo: InternalPaths;
}) {
  const navigate = useInternalNavigate();

  return (
    <input
      type="button"
      value={value}
      onClick={() => {
        navigate(navigateTo);
      }}
    />
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
