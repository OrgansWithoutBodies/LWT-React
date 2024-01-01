import { maskTermInSentence } from 'lwt-common';
import {
  Language,
  LanguagesID,
  NumericalStrength,
  TextItem,
  TextsID,
  Word,
  WordsID,
  get_status_abbr,
} from 'lwt-schemas';
import { dataService, useData } from 'lwt-state';
import {
  FourFramePage,
  Header,
  Icon,
  Loader,
  PrevNextLinks,
  useI18N,
  useTick,
  useUpdateActiveText,
} from 'lwt-ui-kit';
import { useState } from 'react';
import { PLUGINS } from '../../plugins';
import { APITranslateTerm } from '../../plugins/deepl.plugin';
import { TranslationAPI } from '../API/APITranslation.component';
import { RunTestForWord } from '../OverlibComponents';
import { IFramePane, Modality } from '../Reader/ReaderPage.component';
import { EditWordPane } from '../Term/AddNewWordPane';
import { FilterArgs, filterAndSortTexts } from '../Text/Library.component';

//   const currenttag2 = validateTextTag(
//     processSessParam('tag2', 'currenttexttag2', '', 0),
//     currentlang
//   );
//   const currenttag12 = processSessParam('tag12', 'currenttexttag12', '', 0);
//   if (currenttag1 === '' && currenttag2 === '') const wh_tag = '';
//   else {
//     if (currenttag1 !== '') {
//       if (currenttag1 === -1) {
//         const wh_tag1 = 'group_concat(TtT2ID) IS NULL';
//       } else {
//         const wh_tag1 =
//           "concat('/',group_concat(TtT2ID separator '/'),'/') like '%/";
//         // . currenttag1 .
//         ("/%'");
//       }
//     }
//     if (currenttag2 !== '') {
//       if (currenttag2 === -1) {
//         const wh_tag2 = 'group_concat(TtT2ID) IS NULL';
//       } else {
//         const wh_tag2 =
//           "concat('/',group_concat(TtT2ID separator '/'),'/') like '%/";
//         // . currenttag2 .
//         ("/%'");
//       }
//     }
//     if (currenttag1 !== '' && currenttag2 === '') {
//       const wh_tag = ' having (';
//       // . wh_tag1 .
//       (') ');
//     } else if (currenttag2 !== '' && currenttag1 === '') {
//       const wh_tag = ' having (';
//       // . wh_tag2 .
//       (') ');
//     } else {
//       const wh_tag = ' having (('(
//         //  . wh_tag1 .
//         currenttag12 ? ') AND (' : ') OR ('
//       );
//       // . wh_tag2 .
//       (')) ');
//     }
//   }
//   const currentsort = processDBParam('sort', 'currenttextsort', '1', 1);
//   const sorts = array('TxTitle', 'TxID desc', 'TxID');
//   const lsorts = count(sorts);
//   if (currentsort < 1) const currentsort = 1;
//   if (currentsort > lsorts) const currentsort = lsorts;
//   if (onlyann) {
//     const sql =
//       'select TxID from ((texts left JOIN texttags ON TxID = TtTxID) left join tags2 on T2ID = TtT2ID), languages where LgID = TxLgID AND LENGTH(TxAnnotatedText) > 0 ';
//     //  . wh_lang . wh_query .
//     // ' group by TxID '
//     //  . wh_tag .
//     // ' order by '
//     //  . sorts[currentsort - 1];
//   } else {
//     const sql =
//       'select TxID from ((texts left JOIN texttags ON TxID = TtTxID) left join tags2 on T2ID = TtT2ID), languages where LgID = TxLgID ';
//     // . wh_lang . wh_query .
//     // ' group by TxID '
//     // . wh_tag .
//     // ' order by '
//     // . sorts[currentsort - 1];
//   }
//   const list = array(0);
//   while ((record = mysqli_fetch_assoc(res))) {
//     array_push(list, record['TxID'] + 0);
//   }
//   array_push(list, 0);
//   const listlen = count(list);
//   for (let i = 1; i < listlen - 1; i++) {
//     if (list[i] === textid) {
//       if (list[i - 1] !== 0) {
//         const title = tohtml(getTextTitle(list[i - 1]));
//         const prev = (
//           <>
//             <a href={`${url}${list[i - 1]}`} target="_top">
//               <img
//                 src="icn/navigation-180-button.png"
//                 title="Previous Text: ' . title . '"
//                 alt="Previous Text: ' . title . '"
//               />
//             </a>
//           </>
//         );
//       } else
//         const prev = (
//           <>
//             <img
//               src="icn/navigation-180-button-light.png"
//               title="No Previous Text"
//               alt="No Previous Text"
//             />
//           </>
//         );
//       if (list[i + 1] !== 0) {
//         const title = tohtml(getTextTitle(list[i + 1]));
//         const next = (
//           <>
//             <a href={`${url}${list[i + 1]}`} target="_top">
//               <img
//                 src="icn/navigation-000-button.png"
//                 title="Next Text: ' . title . '"
//                 alt="Next Text: ' . title . '"
//               />
//             </a>
//           </>
//         );
//       } else {
//         const next = (
//           <>
//             <img
//               src="icn/navigation-000-button-light.png"
//               title="No Next Text"
//               alt="No Next Text"
//             />
//           </>
//         );
//       } // return add . prev . ' ' . next;
//     }
//   }
//   // return add . '<Icon src="navigation-180-button-light.png" title="No Previous Text" alt="No Previous Text" /> <img src="icn/navigation-000-button-light" title="No Next Text" />';
// }

/**
 * TODO maybe move towards handling all filter stuff in state so we don't need to pass in args?
 * TODO use in print_text, print_impr_text,do_text_header,do_test_header,display_impr_text_header
 */
export function usePreviousAndNextTextLinks({
  textid,
  onlyAnn,
  // TODO whats this
  // add,
  tag1,
  tag2,
  tag12,
  sorting,
  query,
}: {
  textid: TextsID;
  // add: boolean;
} & FilterArgs): PrevNextLinks {
  const [{ texttags, textDetails, textsHashmap: textTitleHashmap }] = useData([
    'texttags',
    'textDetails',
    'textsHashmap',
  ]);
  const list: TextsID[] = filterAndSortTexts({
    texttags,
    textDetails,
    tag1,
    tag2,
    tag12,
    sorting,
    query,
    onlyAnn,
  }).map((val) => val.TxID);
  const indexForThisEntry = list.indexOf(textid);
  const prevIndex = indexForThisEntry - 1;
  const nextIndex = indexForThisEntry + 1;
  const prev: PrevNextLinks['prev'] =
    list[prevIndex] !== undefined
      ? {
          textID: list[prevIndex],
          title: textTitleHashmap[list[prevIndex]].TxTitle,
        }
      : { fallback: 'No Previous Text' };
  const next: PrevNextLinks['next'] =
    nextIndex > 0 && list[nextIndex] !== undefined
      ? {
          title: textTitleHashmap[list[nextIndex]].TxTitle,
          textID: list[nextIndex],
        }
      : { fallback: 'No Next Text' };
  return { prev, next };
}

/**
 *
 */
export function TesterTable({
  language,
  words: words,
  onSetEditingWord,
}: {
  language: Language;
  words: Word[];
  onSetEditingWord: (id: WordsID) => void;
}) {
  // TODO;
  // BETWEEN 1 AND 5 AND WoTranslation !== \'\' AND WoTranslation !== \'*\'
  const [showEdit, setShowEdit] = useState(true);
  const [showStatus, setShowStatus] = useState(true);
  const [showTerm, setShowTerm] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [showRomanization, setShowRomanization] = useState(true);
  const [showSentence, setShowSentence] = useState(true);
  return (
    <>
      <p>
        <input
          checked={showEdit}
          onChange={({ target: { checked: value } }) => setShowEdit(value)}
          type="checkbox"
          id="cbEdit"
        />{' '}
        Edit
        <input
          checked={showStatus}
          onChange={({ target: { checked: value } }) => setShowStatus(value)}
          type="checkbox"
          id="cbStatus"
        />{' '}
        Status
        <input
          checked={showTerm}
          onChange={({ target: { checked: value } }) => setShowTerm(value)}
          type="checkbox"
          id="cbTerm"
        />{' '}
        Term
        <input
          checked={showTranslation}
          onChange={({ target: { checked: value } }) =>
            setShowTranslation(value)
          }
          type="checkbox"
          id="cbTrans"
        />{' '}
        Translation
        <input
          checked={showRomanization}
          onChange={({ target: { checked: value } }) =>
            setShowRomanization(value)
          }
          type="checkbox"
          id="cbRom"
        />{' '}
        Romanization
        <input
          checked={showSentence}
          onChange={({ target: { checked: value } }) => setShowSentence(value)}
          type="checkbox"
          id="cbSentence"
        />{' '}
        Sentence
      </p>

      <table
        className="sortable tab1"
        style={{ width: 'auto' }}
        cellSpacing={0}
        cellPadding={5}
      >
        <tr>
          {showEdit && <th className="th1">Ed</th>}
          {showStatus && <th className="th1 clickable">Status</th>}
          {showTerm && <th className="th1 clickable">Term</th>}
          {showTranslation && <th className="th1 clickable">Translation</th>}
          {showRomanization && <th className="th1 clickable">Romanization</th>}
          {showSentence && <th className="th1 clickable">Sentence</th>}
        </tr>
        {/* <?php
    
        sql = 'SELECT DISTINCT WoID, WoText, WoTranslation, WoRomanization, WoSentence, WoStatus, WoTodayScore As Score FROM ' . testsql . ' AND WoStatus BETWEEN 1 AND 5 AND WoTranslation !== \'\' AND WoTranslation !== \'*\' order by WoTodayScore, WoRandom*RAND()';
        if (debug)
            echo sql;
        res = do_mysqli_query(sql);
        while (record = mysqli_fetch_assoc(res)) {
            sent = tohtml(repl_tab_nl(record["WoSentence"]));
            sent1 = str_replace("{", ' <b>[', str_replace(
                "}",
                ']</b> ',
                mask_term_in_sentence(sent, regexword)
            )
            );
            ?> */}
        {words.map((word) => (
          <tr>
            {showEdit && (
              <td className="td1 center" style={{ whiteSpace: 'nowrap' }}>
                <a
                  onClick={() => onSetEditingWord(word.WoID)}
                  href="edit_tword?wid=<?php echo record['WoID']; ?>"
                  target="ro"
                >
                  <Icon src="sticky-note--pencil" title="Edit Term" />
                </a>
              </td>
            )}
            {showStatus && (
              <td className="td1 center" style={{ whiteSpace: 'nowrap' }}>
                <span id={`STAT${word.WoID}`}>
                  <MakeStatusControlsTestTableRow
                    WoID={word.WoID}
                    // TODO Today or tomorrow
                    score={word.WoTodayScore}
                    status={word.WoStatus}
                    onChangeTableStatus={({ WoID, plusminus }) => {
                      // const
                      dataService.nudgeTermStrength(WoID, plusminus);
                    }}
                  />
                </span>
              </td>
            )}
            {showTerm && (
              <td
                className="td1 center"
                style={{ fontSize: language.LgTextSize }}
              >
                {/* <?php echo span1; ?> */}
                <span id="TERM<?php echo record['WoID']; ?>">
                  {word.WoText}
                </span>
                {/* <?php echo span2; ?> */}
              </td>
            )}
            {showTranslation && (
              <td className="td1 center">
                <span id={`TRAN${word.WoID}`}>{word.WoTranslation}</span>
              </td>
            )}
            {showRomanization && (
              <td className="td1 center">
                <span id={`ROMA${word.WoID}`}>{word.WoRomanization}</span>
              </td>
            )}
            {showSentence && (
              <td className="td1 center">
                {/* <?php echo span1; ?> */}
                <span id="SENT<?php echo record['WoID']; ?>">
                  {word.WoSentence}
                  {/* <?php echo sent1; ?> */}
                </span>
                {/* <?php echo span2; ?> */}
              </td>
            )}
          </tr>
        ))}
      </table>
    </>
  );
}
/**
 *
 * @param score
 * @param status
 * @param WoID
 */
export function MakeStatusControlsTestTableRow({
  score,
  status,
  WoID,
  onChangeTableStatus,
}: Pick<Word, 'WoID'> & {
  score: number;
  status: NumericalStrength;
  onChangeTableStatus: (
    args: Pick<Word, 'WoID'> & { plusminus: 'plus' | 'minus' }
  ) => void;
}) {
  return (
    <>
      {status === 98 ? (
        <></>
      ) : status >= 1 ? (
        <Icon
          src="minus"
          className="click"
          title="-"
          onClick={() => onChangeTableStatus({ WoID, plusminus: 'minus' })}
        />
      ) : (
        <Icon src="placeholder" title="-" />
      )}{' '}
      {score < 0 ? (
        <span className="red2">get_status_abbr(status)</span>
      ) : (
        <>{get_status_abbr(status)}</>
      )}{' '}
      {status === 99 ? (
        <></>
      ) : (
        <>
          {' '}
          {status <= 5 || status === 98 ? (
            <Icon
              src="plus"
              className="click"
              title="+"
              onClick={() => onChangeTableStatus({ WoID, plusminus: 'plus' })}
            />
          ) : (
            <Icon src="placeholder" title="-" />
          )}
        </>
      )}
    </>
  );
}
/**
 *
 */
export function Tester({
  modality,
  setTranslateAPIParams,
  setIFrameURL,
}: {
  modality: Modality;
  setTranslateAPIParams: (
    vals: (APITranslateTerm<string, string> & { apiKey: string }) | null
  ) => void;
  setIFrameURL: (url: string | null) => void;
}) {
  const [testingWord, setTestingWord] = useState<Word | null>(null);
  const [numCorrect, setNumCorrect] = useState(0);
  const [numWrong, setNumWrong] = useState(0);
  const [numNotTested, setNumNotTested] = useState(10);
  //
  const [{ languages }] = useData(['languages']);
  const { tick } = useTick(1000);
  const totalTests = numWrong + numCorrect + numNotTested;
  const l_notyet = Math.round(numNotTested * 100);
  const b_notyet = l_notyet === 0 ? '' : 'borderl';
  const l_wrong = Math.round(numWrong * 100);
  const b_wrong = l_wrong === 0 ? '' : 'borderl';
  const l_correct = Math.round(numCorrect * 100);
  const b_correct = l_correct === 0 ? 'borderr' : 'borderl borderr';

  const foundLanguage =
    testingWord && languages.find((lang) => lang.LgID === testingWord?.WoLgID);
  return (
    <>
      {foundLanguage && (
        <RunTestForWord
          word={testingWord}
          // language={foundLanguage}
          setTranslateAPIParams={setTranslateAPIParams}
          setIFrameURL={setIFrameURL}
          lang={foundLanguage}
          // TODO
          todo={0}
          onSetTestStatus={(word) => {
            console.log(word);
          }}
          onNudgeTestStatus={({ WoID, plusminus }) => {
            console.log(WoID, plusminus);
            throw new Error('Function not implemented.');
          }}
        />
      )}
      <div id="footer">
        <Icon src="clock" title="Elapsed Time" />
        <span id="timer" title="Elapsed Time">
          {tick}
        </span>
        &nbsp; &nbsp; &nbsp;
        <Icon
          className={b_notyet}
          src="test_notyet"
          title="Not yet tested"
          height={10}
          width={l_notyet}
        />
        <Icon
          className={b_wrong}
          src="test_wrong"
          title="Wrong"
          height={10}
          width={l_wrong}
        />
        <Icon
          className={b_correct}
          src="test_correct"
          title="Correct"
          height={10}
          width={l_correct}
        />
        &nbsp; &nbsp; &nbsp;
        <span title="Total number of tests">{totalTests}</span>=
        <span className="todosty" title="Not yet tested">
          {numNotTested}
        </span>
        +
        <span className="donewrongsty" title="Wrong">
          {numWrong}
        </span>
        +
        <span className="doneoksty" title="Correct">
          {numCorrect}
        </span>
      </div>
    </>
  );
}
/**
 *
 */

/**
 *
 */
export function TesterPage({
  langID: langID,
  textID: textID,
}: {
  textID: TextsID | null;
  langID: LanguagesID | null;
}) {
  const [{ texts, words, languageHashmap, textitems }] = useData([
    'texts',
    'words',
    'languageHashmap',
    'textitems',
  ]);

  useUpdateActiveText({ txID: textID });

  const t = useI18N();
  const [activeWord, setActiveWord] = useState<string | null>();
  // TODO can be multiple texts?
  const [translateAPIParams, setTranslateAPIParams] = useState<
    (APITranslateTerm<string, string> & { apiKey: string }) | null
  >(null);
  const text =
    textID !== null
      ? texts.find((text) => text.TxID === textID)
      : texts.find((text) => text.TxLgID === langID);
  const [iFrameURL, setIFrameURL] = useState<string | null>(null);

  const [testModality, setTestModality] = useState<Modality | null>(null);
  if (!text) {
    return <></>;
  }
  if (languageHashmap === undefined) {
    return <Loader />;
  }
  const language = languageHashmap[langID ? langID : text.TxLgID];
  // TODO might be no text & only specified language?
  if (!language) {
    return <></>;
  }
  const tableWords = getWordsForTextItems({
    words,
    textitems,
    languageID: language.LgID,
    textID: text.TxID,
  });

  const availableAPIPlugins = Object.fromEntries(
    PLUGINS.filter((val) => val.api !== undefined).map((plugin) => [
      plugin.pluginName,
      plugin.api!,
    ])
  );
  const currentlyActiveAPI = translateAPIParams
    ? availableAPIPlugins[translateAPIParams?.apiKey]
    : null;
  return (
    <FourFramePage
      frameSizes={{
        lFrameWidthPercKey: 'set-test-l-framewidth-percent',
        hFrameHeightKey: 'set-test-h-frameheight',
        rFrameHeightPercKey: 'set-test-r-frameheight-percent',
      }}
      URFrame={() =>
        activeWord ? (
          <EditWordPane
            // TODO
            chgID={
              words.find(
                ({ WoTextLC, WoLgID }) =>
                  activeWord.toLowerCase() === WoTextLC &&
                  WoLgID === language.LgID
              )?.WoID
            }
            langID={text.TxLgID}
            onClearActiveWord={() => setActiveWord(null)}
            setIFrameURL={setIFrameURL}
            setTranslateAPIParams={setTranslateAPIParams}
          />
        ) : (
          <></>
        )
      }
      BLFrame={() =>
        testModality === null ? (
          <></>
        ) : testModality === 'table' ? (
          <TesterTable
            language={language}
            words={tableWords}
            onSetEditingWord={(id) => setActiveWord(id)}
          />
        ) : (
          <Tester
            modality={testModality}
            setTranslateAPIParams={setTranslateAPIParams}
            setIFrameURL={setIFrameURL}
          />
        )
      }
      ULFrame={() => (
        <>
          <Header title={`TEST ▶ ${text.TxTitle} (Due: TODO of TODO)` as any} />

          <p style={{ marginBottom: 0 }}>
            <input
              type="button"
              value="..[L2].."
              // TODO difference between onClick & onClick?
              onClick={() => setTestModality(1)}
            />
            <input
              type="button"
              value="..[L1].."
              onClick={() => setTestModality(2)}
            />
            <input
              type="button"
              value="..[••].."
              onClick={() => setTestModality(3)}
            />{' '}
            &nbsp; | &nbsp;
            <input
              type="button"
              value="[L2]"
              onClick={() => setTestModality(4)}
            />
            <input
              type="button"
              value="[L1]"
              onClick={() => setTestModality(5)}
            />{' '}
            &nbsp; | &nbsp;
            <input
              type="button"
              value={t('Table')}
              onClick={() => setTestModality('table')}
            />
          </p>
        </>
      )}
      BRFrame={() =>
        translateAPIParams && currentlyActiveAPI ? (
          <TranslationAPI
            onAcceptLine={(data) =>
              console.log('TODO-TEST123-ACCEPTING TRANSLATION: ', data)
            }
            api={currentlyActiveAPI}
            sourceKey={translateAPIParams.sourceKey}
            targetKey={translateAPIParams.targetKey}
            word={translateAPIParams.word}
          />
        ) : (
          <IFramePane url={iFrameURL} />
        )
      }
    />
  );
}

/**
 *
 */
export function getWordsForTextItems({
  words,
  textitems,
  languageID,
  textID,
}: {
  words: Word[];
  textitems: TextItem[];
  languageID: LanguagesID;
  textID: TextsID;
}) {
  const wordLookupKeyedByTextLC = Object.fromEntries(
    words
      .filter((word) => word.WoLgID === languageID)
      .map((val) => [val.WoTextLC, val])
  );
  const tableWords = textitems
    .filter(
      (ti) =>
        ti.TiTxID === textID &&
        ti.TiLgID === languageID &&
        ti.TiIsNotWord === 0 &&
        wordLookupKeyedByTextLC[ti.TiTextLC]
    )
    .map((ti) => wordLookupKeyedByTextLC[ti.TiTextLC]);
  return tableWords;
}
// TODO
// p = '';

// if (isset($_REQUEST['selection']) && isset($_SESSION['testsql'])) {
// 	testsql = $_SESSION['testsql'];
// } elseif (isset($_REQUEST['lang'])) {
// 	testsql = ' ' . tbpref . 'words where WoLgID = ' . $_REQUEST['lang'] . ' ';
// } elseif (isset($_REQUEST['text'])) {
// 	testsql = ' ' . tbpref . 'words, ' . tbpref . 'textitems where TiLgID = WoLgID and TiTextLC = WoTextLC and TiTxID = ' . $_REQUEST['text'] . ' ';
// } else
// 	my_die("do_test_test.php called with wrong parameters");

// testtype = getreq('type') + 0;
// if (testtype < 1)
// 	testtype = 1;
// if (testtype > 5)
// 	testtype = 5;
// nosent = 0;
// if (testtype > 3) {
// 	testtype = testtype - 3;
// 	nosent = 1;
// }

// totaltests = $_SESSION['testtotal'];
// wrong = $_SESSION['testwrong'];
// correct = $_SESSION['testcorrect'];

// pagestart_nobody('', 'html, body { width:100%; height:100%; } html {display:table;} body { display:table-cell; vertical-align:middle; } #body { max-width:95%; margin:0 auto; }');

// cntlang = get_first_value('select count(distinct WoLgID) as value from ' . testsql);
// if (cntlang > 1) {
// 	echo '<p>Sorry - The selected terms are in ' . cntlang . ' languages, but tests are only possible in one language at a time.</p>';
// 	pageend();
// 	exit();
// }

// ?>
// <div id="body">
// 	<?php

// 	count = get_first_value('SELECT count(distinct WoID) as value FROM ' . testsql . ' AND WoStatus BETWEEN 1 AND 5 AND WoTranslation != \'\' AND WoTranslation != \'*\' AND WoTodayScore < 0');
// 	if (debug)
// 		echo 'DEBUG - COUNT TO TEST: ' . count . '<br />';
// 	notyettested = count;

// 	if (count <= 0) {

// 		count2 = get_first_value('SELECT count(distinct WoID) as value FROM ' . testsql . ' AND WoStatus BETWEEN 1 AND 5 AND WoTranslation != \'\' AND WoTranslation != \'*\' AND WoTomorrowScore < 0');

// 		echo '<p class="center"><img src="img/ok.png" alt="Done!" /><br /><br /><span class="red2">Nothing ' . (totaltests ? 'more ' : '') . 'to test here!<br /><br />Tomorrow you\'ll find here ' . count2 . ' test' . (count2 == 1 ? '' : 's') . '!</span></p></div>';
// 		count = 0;

// 	} else {

// 		lang = get_first_value('select WoLgID as value from ' . testsql . ' limit 1');

// 		sql = 'select LgName, LgDict1URI, LgDict2URI, LgGoogleTranslateURI, LgTextSize, LgRemoveSpaces, LgRegexpWordCharacters, LgRightToLeft from ' . tbpref . 'languages where LgID = ' . lang;
// 		res = do_mysqli_query(sql);
// 		record = mysqli_fetch_assoc(res);
// 		wb1 = isset(record['LgDict1URI']) ? record['LgDict1URI'] : "";
// 		wb2 = isset(record['LgDict2URI']) ? record['LgDict2URI'] : "";
// 		wb3 = isset(record['LgGoogleTranslateURI']) ? record['LgGoogleTranslateURI'] : "";
// 		textsize = record['LgTextSize'];
// 		removeSpaces = record['LgRemoveSpaces'];
// 		regexword = record['LgRegexpWordCharacters'];
// 		rtlScript = record['LgRightToLeft'];
// 		langname = record['LgName'];
// 		mysqli_free_result(res);

// 		// Find the next word to test

// 		pass = 0;
// 		num = 0;
// 		while (pass < 2) {
// 			pass++;
// 			sql = 'SELECT DISTINCT WoID, WoText, WoTextLC, WoTranslation, WoRomanization, WoSentence, (ifnull(WoSentence,\'\') not like concat(\'%{\',WoText,\'}%\')) as notvalid, WoStatus, DATEDIFF( NOW( ), WoStatusChanged ) AS Days, WoTodayScore AS Score FROM ' . testsql . ' AND WoStatus BETWEEN 1 AND 5 AND WoTranslation != \'\' AND WoTranslation != \'*\' AND WoTodayScore < 0 ' . (pass == 1 ? 'AND WoRandom > RAND()' : '') . ' order by WoTodayScore, WoRandom LIMIT 1';
// 			if (debug)
// 				echo 'DEBUG TEST-SQL: ' . sql . '<br />';
// 			res = do_mysqli_query(sql);
// 			record = mysqli_fetch_assoc(res);
// 			if (record) {
// 				num = 1;
// 				wid = record['WoID'];
// 				word = record['WoText'];
// 				wordlc = record['WoTextLC'];
// 				trans = repl_tab_nl(record['WoTranslation']) . getWordTagList(wid, ' ', 1, 0);
// 				roman = record['WoRomanization'];
// 				sent = repl_tab_nl(record['WoSentence']);
// 				notvalid = record['notvalid'];
// 				status = record['WoStatus'];
// 				days = record['Days'];
// 				score = record['Score'];
// 				pass = 2;
// 			}
// 			mysqli_free_result(res);
// 		}

// 		if (num == 0) {

// 			// should not occur but...
// 			echo '<p class="center"><img src="img/ok.png" alt="Done!" /><br /><br /><span class="red2">Nothing to test here!</span></p></div>';
// 			count = 0;

// 		} else {

// 			if (nosent) {  // No sent. mode 4+5
// 				num = 0;
// 				notvalid = 1;
// 			} else { // nosent == FALSE, mode 1-3
// 				pass = 0;
// 				sentexcl = '';
// 				while (pass < 3) {
// 					pass++;
// 					if (debug)
// 						echo "DEBUG search sent: pass: pass <br />";
// 					sql = 'SELECT DISTINCT SeID FROM ' . tbpref . 'sentences, ' . tbpref . 'textitems WHERE TiTextLC = ' . convert_string_to_sqlsyntax(wordlc) . sentexcl . ' AND SeID = TiSeID AND SeLgID = ' . lang . ' order by rand() limit 1';
// 					res = do_mysqli_query(sql);
// 					record = mysqli_fetch_assoc(res);
// 					if (record) {  // random sent found
// 						num = 1;
// 						seid = record['SeID'];
// 						if (AreUnknownWordsInSentence(seid)) {
// 							if (debug)
// 								echo "DEBUG sent: seid has unknown words<br />";
// 							sentexcl = ' AND SeID != ' . seid . ' ';
// 							num = 0;
// 							// not yet found, num == 0 (unknown words in sent)
// 						} else {
// 							// echo ' OK ';
// 							sent = getSentence(seid, wordlc, (int) getSettingWithDefault('set-test-sentence-count'));
// 							sent = sent[1];
// 							if (debug)
// 								echo "DEBUG sent: seid OK: sent <br />";
// 							pass = 3;
// 							// found, num == 1
// 						}
// 					} else {  // no random sent found
// 						num = 0;
// 						pass = 3;
// 						if (debug)
// 							echo "DEBUG no random sent found<br />";
// 						// no sent. take term sent. num == 0
// 					}
// 					mysqli_free_result(res);
// 				} // while ( pass < 3 )
// 			}  // nosent == FALSE

// 			if (num == 0) {
// 				// take term sent. if valid
// 				if (notvalid)
// 					sent = '{' . word . '}';
// 				if (debug)
// 					echo "DEBUG not found, use sent = sent<br />";
// 			}

// 			cleansent = trim(str_replace("{", '', str_replace("}", '', sent)));
// 			// echo cleansent;

// 			echo '<p ' . (rtlScript ? 'dir="rtl"' : '') . ' style="' . (removeSpaces ? 'word-break:break-all;' : '') . 'font-size:' . textsize . '%;line-height: 1.4; text-align:center; margin-bottom:300px;">';
// 			l = mb_strlen(sent, 'utf-8');
// 			r = '';
// 			save = '';
// 			on = 0;

// sent.map((thisSent)=>{
/**
 *
 * @param sent
 * @param wid
 * @param trans
 * @param word
 * @param roman
 * @param cleansent
 * @param regexword
 * @param testtype
 */
export function sentenceTester(
  sent: string,
  wid: WordsID,
  trans: Word['WoTranslation'],
  word: Word['WoText'],
  roman: Word['WoRomanization'],
  cleansent: string,
  regexword: Language['LgRegexpWordCharacters'],
  testtype: Modality
) {
  for (let i = 0; i < sent.length; i++) {
    // go thru sent
    const c = sent.substring(i, i + 1);
    if (c == '}') {
      <span
        style={{ wordBreak: 'normal' }}
        className={`click todo todosty word wsty word${wid}`}
        data_wid={wid}
        data_trans={trans}
        data_text={word}
        data_rom={roman}
        data_sent={cleansent}
        data_status="' . status . '"
        data_todo="1"
        title={testtype === 3 ? trans : undefined}
      >
        {
          testtype === 2 ? (
            nosent ? (
              trans
            ) : (
              <span dir="ltr">{trans}</span>
            )
          ) : testtype === 3 ? (
            maskTermInSentence(`{${save}}`, regexword)
              .replace('}', ']')
              .replace('{', '[')
          ) : (
            save
          )
          // 						);
          // 					else
          // 						r .= tohtml(save);
          // 					r .= '</span> ';
          // 					on = 0;
          // 				} elseif (c == '{') {
          // 					on = 1;
          // 					save = '';
          // 				} else {
          // 					if (on)
          // 						save .= c;
          // 					else
          // 						r .= tohtml(c);
          // 				}
          // 			} // for: go thru sent

          // 			echo r;  // Show Sentence
        }
      </span>;
      // 		}
    }
  }
  // 		?>

  const WBLINK1 = wb1;
  const WBLINK2 = wb2;
  const WBLINK3 = wb3;
  const SOLUTION = prepare_textdata_js(
    testtype == 1 ? (nosent ? trans : ` [${trans}] `) : save
  );
  const OPENED = 0;
  const WID = wid;
  // $(document).ready(function () {
  // 	$(document).keydown(keydown_event_do_test_test);
  // 	$('.word').click(word_click_event_do_test_test);
  // });

  // 		</p>
  // 	</div>

  // 	<?php

  // 	}

  // 	wrong = $_SESSION['testwrong'];
  // 	correct = $_SESSION['testcorrect'];
  // 	totaltests = wrong + correct + notyettested;
  // 	totaltestsdiv = 1;
  // 	if (totaltests > 0)
  // 		totaltestsdiv = 1.0 / totaltests;
  // 	l_notyet = round((notyettested * totaltestsdiv) * 100, 0);
  // 	b_notyet = (l_notyet == 0) ? '' : 'borderl';
  // 	l_wrong = round((wrong * totaltestsdiv) * 100, 0);
  // 	b_wrong = (l_wrong == 0) ? '' : 'borderl';
  // 	l_correct = round((correct * totaltestsdiv) * 100, 0);
  // 	b_correct = (l_correct == 0) ? 'borderr' : 'borderl borderr';

  // 	?>

  $(document).ready(function () {
    window.parent.frames['ru'].location.href = 'empty.htm';
    waittime = getSettingWithDefault('set-test-edit-frame-waiting-time') + 0;
    if (waittime <= 0) {
      window.parent.frames['ro'].location.href = 'empty.htm';
    } else {
      setTimeout(
        "window.parent.frames['ro'].location.href='empty.htm';",
        waittime
      );
    }

    new CountUp(time(), $_SESSION['teststart'], 'timer', count ? 0 : 1);
  });
}

// if ($oldstatus == $status)
// 	echo '<p>Status ' . get_colored_status_msg($status) . ' not changed.</p>';
// else
// 	echo '<p>Status changed from ' . get_colored_status_msg($oldstatus) . ' to ' . get_colored_status_msg($status) . '.</p>';

// echo "<p>Old score was " . $oldscore . ", new score is now " . $newscore . ".</p>";
