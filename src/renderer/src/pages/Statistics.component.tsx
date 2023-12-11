import { Word } from '../data/parseMySqlDump';
import { useData } from '../data/useAkita';
import { LanguagesId } from '../data/validators';
import { InternalPaths, useInternalNavigate } from '../hooks/useInternalNav';
import { A } from '../nav/InternalLink';
import { Header } from '../ui-kit/Header';

// const CAKSlices = [
//   'Today',
//   'Yesterday',
//   'Last 7 d',
//   'Last 30 d',
//   'Last 365 d',
//   'All Time',
// ] as const;
// type CAKMap = Record<(typeof CAKSlices)[number], () => number>;
const ONE_DAY_IN_HOURS = 24;
const ONE_HOUR_IN_MINUTES = 60;
const ONE_MINUTE_IN_SECONDS = 60;
const ONE_SECOND_IN_MS = 1000;
const ONE_DAY_IN_MS =
  ONE_DAY_IN_HOURS *
  ONE_HOUR_IN_MINUTES *
  ONE_MINUTE_IN_SECONDS *
  ONE_SECOND_IN_MS;

/**
 *
 */
export function StatisticsComponent(): JSX.Element {
  const [{ words, languages, languageStatusStatistics }] = useData([
    'languages',
    'languageStatusStatistics',
    'words',
  ]);
  const currentTime = new Date().getTime();
  const emptyLanguageMap = Object.fromEntries(
    languages.map((val) => [val.LgID, 0])
  );
  const wordsMadeInLast1Days: Record<LanguagesId, number> = getWordsInLastNMS({
    words,
    emptyLanguageMap,
    currentTime,
    interval: 1 * ONE_DAY_IN_MS,
  });
  const wordsMadeInLast2Days: Record<LanguagesId, number> = getWordsInLastNMS({
    words,
    emptyLanguageMap,
    currentTime,
    interval: 2 * ONE_DAY_IN_MS,
  });
  const wordsMadeInLast7Days: Record<LanguagesId, number> = getWordsInLastNMS({
    words,
    emptyLanguageMap,
    currentTime,
    interval: 7 * ONE_DAY_IN_MS,
  });
  const wordsMadeInLast30Days: Record<LanguagesId, number> = getWordsInLastNMS({
    words,
    emptyLanguageMap,
    currentTime,
    interval: 30 * ONE_DAY_IN_MS,
  });
  const wordsMadeInLast365Days: Record<LanguagesId, number> = getWordsInLastNMS(
    {
      words,
      emptyLanguageMap,
      currentTime,
      interval: 365 * ONE_DAY_IN_MS,
    }
  );
  const wordsMadeInAllTime: Record<LanguagesId, number> = getWordsInLastNMS({
    words,
    emptyLanguageMap,
    currentTime,
  });
  //

  const wordsStatusChangedInLast1Days: Record<LanguagesId, number> =
    getWordsInLastNMS({
      words,
      emptyLanguageMap,
      currentTime,
      interval: 1 * ONE_DAY_IN_MS,
      createdKey: 'WoStatusChanged',
    });
  const wordsStatusChangedInLast2Days: Record<LanguagesId, number> =
    getWordsInLastNMS({
      words,
      emptyLanguageMap,
      currentTime,
      interval: 2 * ONE_DAY_IN_MS,
      createdKey: 'WoStatusChanged',
    });
  const wordsStatusChangedInLast7Days: Record<LanguagesId, number> =
    getWordsInLastNMS({
      words,
      emptyLanguageMap,
      currentTime,
      interval: 7 * ONE_DAY_IN_MS,
      createdKey: 'WoStatusChanged',
    });
  const wordsStatusChangedInLast30Days: Record<LanguagesId, number> =
    getWordsInLastNMS({
      words,
      emptyLanguageMap,
      currentTime,
      interval: 30 * ONE_DAY_IN_MS,
      createdKey: 'WoStatusChanged',
    });
  const wordsStatusChangedInLast365Days: Record<LanguagesId, number> =
    getWordsInLastNMS({
      words,
      emptyLanguageMap,
      currentTime,
      interval: 365 * ONE_DAY_IN_MS,
      createdKey: 'WoStatusChanged',
    });
  const wordsStatusChangedInAllTime: Record<LanguagesId, number> =
    getWordsInLastNMS({
      words,
      emptyLanguageMap,
      currentTime,
      createdKey: 'WoStatusChanged',
    });

  //
  const wordsMarkedWellKnownInLast1Days: Record<LanguagesId, number> =
    getWordsInLastNMS({
      words,
      emptyLanguageMap,
      currentTime,
      interval: 1 * ONE_DAY_IN_MS,
      createdKey: 'WoStatusChanged',
      statuses: [5, 99],
    });
  const wordsMarkedWellKnownInLast2Days: Record<LanguagesId, number> =
    getWordsInLastNMS({
      words,
      emptyLanguageMap,
      currentTime,
      interval: 2 * ONE_DAY_IN_MS,
      createdKey: 'WoStatusChanged',
      statuses: [5, 99],
    });
  const wordsMarkedWellKnownInLast7Days: Record<LanguagesId, number> =
    getWordsInLastNMS({
      words,
      emptyLanguageMap,
      currentTime,
      interval: 7 * ONE_DAY_IN_MS,
      createdKey: 'WoStatusChanged',
      statuses: [5, 99],
    });
  const wordsMarkedWellKnownInLast30Days: Record<LanguagesId, number> =
    getWordsInLastNMS({
      words,
      emptyLanguageMap,
      currentTime,
      interval: 30 * ONE_DAY_IN_MS,
      createdKey: 'WoStatusChanged',
      statuses: [5, 99],
    });
  const wordsMarkedWellKnownInLast365Days: Record<LanguagesId, number> =
    getWordsInLastNMS({
      words,
      emptyLanguageMap,
      currentTime,
      interval: 365 * ONE_DAY_IN_MS,
      createdKey: 'WoStatusChanged',
      statuses: [5, 99],
    });
  const wordsMarkedWellKnownInAllTime: Record<LanguagesId, number> =
    getWordsInLastNMS({
      words,
      emptyLanguageMap,
      currentTime,
      createdKey: 'WoStatusChanged',
      statuses: [5, 99],
    });

  const periods = [
    'Today',
    'Yesterday',
    'Last 7 d',
    'Last 30 d',
    'Last 365 d',
    'All Time',
  ];
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
              ] as const;

              return (
                <tr>
                  <td className="td1">{language.LgName}</td>
                  <td className="td1 center">
                    <A href={`/edit_words?filterlang=${language.LgID}`}>
                      <b>{languageStatusStatistics[language.LgID].total}</b>
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
                    statuses.map((statusVal) => (
                      <td className="td1 center">
                        <span className={`status${statusVal}`}>
                          &nbsp;
                          <A
                            href={`/edit_words?filterlang=${language.LgID}&status=${statusVal}`}
                          >
                            {languageStatusStatistics[language.LgID][statusVal]}
                          </A>
                          &nbsp;
                        </span>
                      </td>
                    ))}
                </tr>
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
            {periods.map((period) => (
              <th className="th1" colSpan={3}>
                {period}
              </th>
            ))}
          </tr>
          <tr>
            {periods.map(() => (
              <>
                <th className="th1">C</th>
                <th className="th1">A</th>
                <th className="th1">K</th>
              </>
            ))}
          </tr>
          {languages.map((language) => (
            <tr>
              <td className="td1">{language.LgName}</td>
              <td className="td1 center">
                <span className="status1">
                  &nbsp;{wordsMadeInLast1Days[language.LgID]}&nbsp;
                </span>
              </td>
              <td className="td1 center">
                <span className="status3">
                  &nbsp;{wordsStatusChangedInLast1Days[language.LgID]}&nbsp;
                </span>
              </td>
              <td className="td1 center">
                <span className="status5stat">
                  &nbsp;{wordsMarkedWellKnownInLast1Days[language.LgID]}&nbsp;
                </span>
              </td>
              <td className="td1 center">
                <span className="status1">
                  &nbsp;{wordsMadeInLast2Days[language.LgID]}&nbsp;
                </span>
              </td>
              <td className="td1 center">
                <span className="status3">
                  &nbsp;{wordsStatusChangedInLast2Days[language.LgID]}&nbsp;
                </span>
              </td>
              <td className="td1 center">
                <span className="status5stat">
                  &nbsp;{wordsMarkedWellKnownInLast2Days[language.LgID]}&nbsp;
                </span>
              </td>
              <td className="td1 center">
                <span className="status1">
                  &nbsp;{wordsMadeInLast7Days[language.LgID]}&nbsp;
                </span>
              </td>
              <td className="td1 center">
                <span className="status3">
                  &nbsp;{wordsStatusChangedInLast7Days[language.LgID]}&nbsp;
                </span>
              </td>
              <td className="td1 center">
                <span className="status5stat">
                  &nbsp;{wordsMarkedWellKnownInLast7Days[language.LgID]}&nbsp;
                </span>
              </td>
              <td className="td1 center">
                <span className="status1">
                  &nbsp;{wordsMadeInLast30Days[language.LgID]}&nbsp;
                </span>
              </td>
              <td className="td1 center">
                <span className="status3">
                  &nbsp;{wordsStatusChangedInLast30Days[language.LgID]}&nbsp;
                </span>
              </td>
              <td className="td1 center">
                <span className="status5stat">
                  {' '}
                  &nbsp;{wordsMarkedWellKnownInLast30Days[language.LgID]}&nbsp;
                </span>
              </td>
              <td className="td1 center">
                <span className="status1">
                  &nbsp;{wordsMadeInLast365Days[language.LgID]}&nbsp;
                </span>
              </td>
              <td className="td1 center">
                <span className="status3">
                  &nbsp;{wordsStatusChangedInLast365Days[language.LgID]}&nbsp;
                </span>
              </td>
              <td className="td1 center">
                <span className="status5stat">
                  {' '}
                  &nbsp;{wordsMarkedWellKnownInLast365Days[language.LgID]}&nbsp;
                </span>
              </td>
              <td className="td1 center">
                <span className="status1">
                  &nbsp;{wordsMadeInAllTime[language.LgID]}&nbsp;
                </span>
              </td>
              <td className="td1 center">
                <span className="status3">
                  &nbsp;{wordsStatusChangedInAllTime[language.LgID]}&nbsp;
                </span>
              </td>
              <td className="td1 center">
                <span className="status5stat">
                  &nbsp;{wordsMarkedWellKnownInAllTime[language.LgID]}&nbsp;
                </span>
              </td>
            </tr>
          ))}
          <tr>
            <th className="th1">
              <b>TOTAL</b>
            </th>
            <th className="th1 center">
              <span className="status1">
                &nbsp;
                {Object.values(wordsMarkedWellKnownInLast365Days).reduce(
                  (prev, curr) => prev + curr,
                  0
                )}
                &nbsp;
              </span>
            </th>
            <th className="th1 center">
              <span className="status3">
                &nbsp;
                {Object.values(wordsMarkedWellKnownInLast365Days).reduce(
                  (prev, curr) => prev + curr,
                  0
                )}
                &nbsp;
              </span>
            </th>
            <th className="th1 center">
              <span className="status5stat">
                &nbsp;
                {Object.values(wordsMarkedWellKnownInLast365Days).reduce(
                  (prev, curr) => prev + curr,
                  0
                )}
                &nbsp;
              </span>
            </th>
            <th className="th1 center">
              <span className="status1">
                &nbsp;
                {Object.values(wordsMarkedWellKnownInLast365Days).reduce(
                  (prev, curr) => prev + curr,
                  0
                )}
                &nbsp;
              </span>
            </th>
            <th className="th1 center">
              <span className="status3">
                &nbsp;
                {Object.values(wordsMarkedWellKnownInLast365Days).reduce(
                  (prev, curr) => prev + curr,
                  0
                )}
                &nbsp;
              </span>
            </th>
            <th className="th1 center">
              <span className="status5stat">
                &nbsp;
                {Object.values(wordsMarkedWellKnownInLast365Days).reduce(
                  (prev, curr) => prev + curr,
                  0
                )}
                &nbsp;
              </span>
            </th>
            <th className="th1 center">
              <span className="status1">
                &nbsp;
                {Object.values(wordsMarkedWellKnownInLast365Days).reduce(
                  (prev, curr) => prev + curr,
                  0
                )}
                &nbsp;
              </span>
            </th>
            <th className="th1 center">
              <span className="status3">
                &nbsp;
                {Object.values(wordsMarkedWellKnownInLast365Days).reduce(
                  (prev, curr) => prev + curr,
                  0
                )}
                &nbsp;
              </span>
            </th>
            <th className="th1 center">
              <span className="status5stat">
                &nbsp;
                {Object.values(wordsMarkedWellKnownInLast365Days).reduce(
                  (prev, curr) => prev + curr,
                  0
                )}
                &nbsp;
              </span>
            </th>
            <th className="th1 center">
              <span className="status1">
                &nbsp;
                {Object.values(wordsMarkedWellKnownInLast365Days).reduce(
                  (prev, curr) => prev + curr,
                  0
                )}
                &nbsp;
              </span>
            </th>
            <th className="th1 center">
              <span className="status3">
                &nbsp;
                {Object.values(wordsMarkedWellKnownInLast365Days).reduce(
                  (prev, curr) => prev + curr,
                  0
                )}
                &nbsp;
              </span>
            </th>
            <th className="th1 center">
              <span className="status5stat">
                &nbsp;
                {Object.values(wordsMarkedWellKnownInLast365Days).reduce(
                  (prev, curr) => prev + curr,
                  0
                )}
                &nbsp;
              </span>
            </th>
            <th className="th1 center">
              <span className="status1">
                &nbsp;
                {Object.values(wordsMarkedWellKnownInLast365Days).reduce(
                  (prev, curr) => prev + curr,
                  0
                )}
                &nbsp;
              </span>
            </th>
            <th className="th1 center">
              <span className="status3">
                &nbsp;
                {Object.values(wordsMarkedWellKnownInLast365Days).reduce(
                  (prev, curr) => prev + curr,
                  0
                )}
                &nbsp;
              </span>
            </th>
            <th className="th1 center">
              <span className="status5stat">
                &nbsp;
                {Object.values(wordsMarkedWellKnownInLast365Days).reduce(
                  (prev, curr) => prev + curr,
                  0
                )}
                &nbsp;
              </span>
            </th>
            <th className="th1 center">
              <span className="status1">
                &nbsp;
                {Object.values(wordsMarkedWellKnownInLast365Days).reduce(
                  (prev, curr) => prev + curr,
                  0
                )}
                &nbsp;
              </span>
            </th>
            <th className="th1 center">
              <span className="status3">
                &nbsp;
                {Object.values(wordsMarkedWellKnownInLast365Days).reduce(
                  (prev, curr) => prev + curr,
                  0
                )}
                &nbsp;
              </span>
            </th>
            <th className="th1 center">
              <span className="status5stat">
                &nbsp;
                {Object.values(wordsMarkedWellKnownInLast365Days).reduce(
                  (prev, curr) => prev + curr,
                  0
                )}
                &nbsp;
              </span>
            </th>
          </tr>
        </tbody>
      </table>
      <p>
        <NavigateButton value="<< Back" navigateTo={RouterPage.HOME} />
      </p>
    </>
  );
}
enum RouterPage {
  HOME = '/',
}

/**
 *
 */
export function getWordsInLastNMS({
  words,
  currentTime,
  emptyLanguageMap,
  interval = null,
  statuses = null,
  createdKey = 'WoCreated',
}: {
  words: Word[];
  currentTime: number;
  interval?: number | null;
  createdKey?: 'WoCreated' | 'WoStatusChanged';
  statuses?: Word['WoStatus'][] | null;
  emptyLanguageMap: Record<LanguagesId, number>;
}): Record<LanguagesId, number> {
  return words.reduce(
    (prev, curr) => ({
      ...prev,
      [curr.WoLgID]:
        (interval === null ||
          currentTime - Date.parse(curr[createdKey]) < interval) &&
        (statuses === null || statuses.includes(curr.WoStatus))
          ? prev[curr.WoLgID] + 1
          : prev[curr.WoLgID],
    }),
    emptyLanguageMap
  );
}

/**
 *
 */
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
