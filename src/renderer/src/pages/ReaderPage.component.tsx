import { useEffect, useRef, useState } from 'react';
import SplitPane from 'react-split-pane';
import { useThemeColors } from '../App';
import { LanguagesId, TextsId } from '../data/validators';
import { useData } from '../hooks/useAkita';
import { useTick } from '../hooks/useTimer';
import { PLUGINS } from '../plugins';
import { APITranslateTerm } from '../plugins/deepl.plugin';
import { Header } from '../ui-kit/Header';
import { Icon } from '../ui-kit/Icon';
import { Language, Word } from '../utils/parseMySqlDump';
import { TranslationAPI } from './IO/APITranslation.component';
import { Loader } from './Loader';
import { Reader } from './Reader.component';
import { RunTestForWord } from './RunTestForWord';
import { AddNewWordPane } from './Term/AddNewWordPane';
import { TextToDoCount } from './TextToDoCount';
import { owin } from './translateSentence2';

// TODO
//  confirmation screen
//  details screen

function ShowAllMessage({ $showAll }: { $showAll: 0 | 1 }) {
  <p>
    <span id="waiting">
      <img src="icn/waiting.gif" alt="Please wait" title="Please wait" />
      &nbsp;&nbsp;Please wait ...
    </span>
    {$showAll === 1 ? (
      <>
        <p>
          <b>
            <i>Show All</i>
          </b>{' '}
          is set to <b>ON</b>.<br />
          <br />
          ALL terms are now shown, and all multi-word terms are shown as
          superscripts before the first word. The superscript indicates the
          number of words in the multi-word term.
          <br />
          <br />
          To concentrate more on the multi-word terms and to display them
          without superscript, set <i>Show All</i> to OFF.
        </p>
      </>
    ) : (
      <>
        <p>
          <b>
            <i>Show All</i>
          </b>{' '}
          is set to <b>OFF</b>.<br />
          <br />
          Multi-word terms now hide single words and shorter or overlapping
          multi-word terms. The creation and deletion of multi-word terms can be
          a bit slow in long texts.
          <br />
          <br />
          To manipulate ALL terms, set <i>Show All</i> to ON.
        </p>
      </>
    )}
  </p>;
}
/**
 *
 */
function IFramePane({ url }: { url: string | null }) {
  console.log('TEST123-IFRAME', url);
  const [loading, setLoading] = useState<boolean>(false);
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  useEffect(() => {
    const frame = frameRef.current;
    const loadHandler = () => {
      setLoading(false);
    };
    setLoading(true);
    frame.addEventListener('load', loadHandler);

    return () => {
      frame.removeEventListener('load', loadHandler);
    };
  }, [url]);

  const colors = useThemeColors();
  // https://stackoverflow.com/questions/23616226/insert-html-with-react-variable-statements-jsx
  // dictionary pane
  // const frameRef = useRef<HTMLIFrameElement | null>(null);
  // useEffect(() => {
  //   const frame = frameRef.current;
  //   // if (!frame) {
  //   //   return;
  //   // }
  //   console.log('TEST123-frame-addListener', { frame });
  //   function loadHandler() {
  //     console.log('TEST123-loaded', frame?.contentWindow);
  //     console.log(
  //       'TEST123-select',
  //       frame?.contentWindow?.document.getSelection()
  //     );
  //     frame.contentWindow.addEventListener('click', (e) => {
  //       console.log('TEST123-click', e.target);
  //     });
  //   }
  //   frame.addEventListener('load', loadHandler);
  //   return () => frame.removeEventListener('load', loadHandler);
  // }, []);

  return (
    <div
      style={{ height: '100%', width: '100%', backgroundColor: colors.lum6 }}
    >
      {loading && <Loader height={'50%'} width={'50%'} />}
      {
        <iframe
          name="ru"
          src={url || undefined}
          width={'100%'}
          height={'100%'}
          ref={frameRef}
        />
      }
    </div>
  );
}
// TODO I Know All

/**
 *
 */
export function ReaderPage({ textId }: { textId: TextsId }) {
  const [{ texts, settings }] = useData(['texts', 'settings']);
  const {
    ['set-text-l-framewidth-percent']: lFrameWidthPerc,
    ['set-text-r-frameheight-percent']: rFrameHeightPerc,
    ['set-text-h-frameheight-no-audio']: setTextHFrameheightNoAudio,
    ['set-text-h-frameheight-with-audio']: setTextHFrameheightWithAudio,
  } = settings;
  console.log({
    rFrameHeightPerc,
    lFrameWidthPerc,
    setTextHFrameheightNoAudio,
    setTextHFrameheightWithAudio,
  });
  const [activeWord, setActiveWord] = useState<
    Word | { newWord: string } | null
  >(null);
  const [iFrameURL, setIFrameURL] = useState<string | null>(null);
  const [translateAPIParams, setTranslateAPIParams] = useState<
    (APITranslateTerm<string, string> & { apiKey: string }) | null
  >(null);
  const text = texts.find((text) => text.TxID === textId);
  const activeText =
    activeWord === null
      ? null
      : 'newWord' in activeWord
      ? activeWord.newWord
      : activeWord.WoText;
  if (!text) {
    return <></>;
  }
  const availableAPIPlugins = Object.fromEntries(
    PLUGINS.filter((val) => val.api !== undefined).map((plugin) => [
      plugin.pluginName,
      plugin.api!,
    ])
  );
  const currentlyActiveAPI = translateAPIParams
    ? availableAPIPlugins[translateAPIParams?.apiKey]
    : null;
  console.log(
    'TEST123-reader',
    availableAPIPlugins,
    currentlyActiveAPI,
    PLUGINS
  );
  if (!currentlyActiveAPI && translateAPIParams) {
    throw new Error('Invalid API Plugin Specified!');
  }
  return (
    <SplitPane
      split="vertical"
      minSize={50}
      defaultSize={`${lFrameWidthPerc}%`}
    >
      <SplitPane
        style={{ overflowWrap: 'break-word' }}
        split="horizontal"
        minSize={50}
        defaultSize={`${rFrameHeightPerc}%`}
      >
        <>
          <Header
            title={`READ ▶ ${text.TxTitle}`}
            readerProps={{
              // TODO getPreviousAndNextTextLinks
              nextTextID: 'Test1',
              prevTextString: 'test2',
              langID: text.TxLgID,
              textID: text.TxID,
            }}
          />
          <table className="width99pc">
            <tr>
              <td
                className="center"
                colSpan={7}
                style={{ whiteSpace: 'nowrap', padding: '2px 5px 5px 5px' }}
              >
                TO DO:{' '}
                <span id="learnstatus">
                  <TextToDoCount text={text} />
                </span>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span
                  title="[Show All] = ON: ALL terms are shown, and all multi-word terms are shown as superscripts before the first word. The superscript indicates the number of words in the multi-word term. 
[Show All] = OFF: Multi-word terms now hide single words and shorter or overlapping multi-word terms."
                >
                  {/* TODO Show All */}
                  Show All&nbsp;
                  <input
                    type="checkbox"
                    id="showallwords"
                    // TODO
                    ref={null}
                  />
                </span>
                <span id="thetextid" className="hide">
                  {text.TxID}
                </span>
              </td>
            </tr>

            {text.TxAudioURI && <AudioPlayer audioURI={text.TxAudioURI} />}
          </table>
        </>
        <Reader
          activeId={textId}
          setActiveWord={setActiveWord}
          activeWord={activeWord}
          setIFrameURL={setIFrameURL}
          setTranslateAPIParams={setTranslateAPIParams}
        />
      </SplitPane>
      <SplitPane
        split="horizontal"
        minSize={50}
        defaultSize={`${rFrameHeightPerc}%`}
      >
        {activeWord && activeText ? (
          <AddNewWordPane
            word={activeText}
            existingTerm={'WoID' in activeWord ? activeWord : undefined}
            langId={text.TxLgID}
            onClearActiveWord={() => setActiveWord(null)}
            setIFrameURL={setIFrameURL}
            setTranslateAPIParams={setTranslateAPIParams}
          />
        ) : (
          <></>
        )}
        {translateAPIParams && currentlyActiveAPI ? (
          <TranslationAPI
            onAcceptLine={(data) =>
              console.log('TEST123-ACCEPTING TRANSLATION: ', data)
            }
            api={currentlyActiveAPI}
            sourceKey={translateAPIParams.sourceKey}
            targetKey={translateAPIParams.targetKey}
            word={translateAPIParams.word}
          />
        ) : (
          <IFramePane url={iFrameURL} />
        )}
      </SplitPane>
    </SplitPane>
  );
}
type Modality = 0 | 1 | 2 | 3 | 4 | 5 | 'table' | null;

/**
 *
 */
export function TesterPage({
  langId,
  textId,
}: {
  textId: TextsId | null;
  langId: LanguagesId | null;
}) {
  const [{ texts, words, languages, textitems }] = useData([
    'texts',
    'words',
    'languages',
    'textitems',
  ]);

  const [activeWord, setActiveWord] = useState<string | null>();
  // TODO can be multiple texts?
  const text =
    textId !== null
      ? texts.find((text) => text.TxID === textId)
      : texts.find((text) => text.TxLgID === langId);

  const [testModality, setTestModality] = useState<Modality>(null);
  const language = languages.find(
    (val) => val.LgID === (langId ? langId : text.TxLgID)
  );
  // TODO might be no text & only specified language?
  if (!text) {
    return <></>;
  }
  if (!language) {
    return <></>;
  }
  const wordLookupKeyedByTextLC = Object.fromEntries(
    words
      .filter((word) => word.WoLgID === language.LgID)
      .map((val) => [val.WoTextLC, val])
  );
  const tableWords = textitems
    .filter(
      (ti) =>
        ti.TiTxID === text.TxID &&
        ti.TiLgID === language.LgID &&
        ti.TiIsNotWord === 0 &&
        wordLookupKeyedByTextLC[ti.TiTextLC]
    )
    .map((ti) => wordLookupKeyedByTextLC[ti.TiTextLC]);
  console.log('TEST123-table', tableWords);
  return (
    <SplitPane split="vertical" minSize={50} defaultSize="55%">
      <SplitPane
        style={{ overflowWrap: 'break-word' }}
        split="horizontal"
        minSize={50}
        defaultSize="20%"
      >
        <>
          <Header title="" />
          <p style={{ marginBottom: 0 }}>
            <input
              type="button"
              value="..[L2].."
              onClickCapture={() => setTestModality(1)}
            />
            <input
              type="button"
              value="..[L1].."
              onClickCapture={() => setTestModality(2)}
            />
            <input
              type="button"
              value="..[••].."
              onClickCapture={() => setTestModality(3)}
            />{' '}
            &nbsp; | &nbsp;
            <input
              type="button"
              value="[L2]"
              onClickCapture={() => setTestModality(4)}
            />
            <input
              type="button"
              value="[L1]"
              onClickCapture={() => setTestModality(5)}
            />{' '}
            &nbsp; | &nbsp;
            <input
              type="button"
              value="Table"
              onClickCapture={() => setTestModality('table')}
            />
          </p>
        </>
        {testModality === null ? (
          <></>
        ) : testModality === 'table' ? (
          <TesterTable language={language} words={tableWords} />
        ) : (
          <Tester modality={testModality} />
        )}
      </SplitPane>
      <SplitPane split="horizontal" minSize={50} defaultSize="60%">
        {/* TODO RHS panes */}
        {activeWord ? (
          <AddNewWordPane
            word={activeWord}
            langId={text.TxLgID}
            existingTerm={words.find(({ WoText }) => activeWord === WoText)}
          />
        ) : (
          <></>
        )}
        <IFramePane />
      </SplitPane>
    </SplitPane>
  );
}

/**
 *
 * @param wid
 * @param plusminus
 * @param text
 */
export function MakeOverlibLinkChangeStatusTest({
  wid,
  plusminus,
  text,
}: {
  wid: number;
  plusminus: 'plus' | 'minus';
  text: string | JSX.Element;
}) {
  return (
    <a href={`set_test_status?wid=${wid}&stchange=${plusminus}`} target="ro">
      {text}
    </a>
  );
}

/**
 *
 */
export function Tester({ modality }: { modality: Modality }) {
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
        <RunTestForWord word={testingWord} language={foundLanguage} />
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

// TODO
/**
 *
 * @param u
 * @param w
 * @param t
 * @param b
 */
export function CreateTheDictLink({
  u,
  w,
  t,
  b,
}: {
  u: string;
  w: string;
  t: string;
  b: string;
}): JSX.Element {
  const url = u.trim();
  const trm = w.trim();
  const txt = t.trim();
  const txtbefore = b.trim();
  if (url !== '' && txt !== '') {
    if (url.substr(0, 1) === '*') {
      return (
        <>
          {txtbefore}{' '}
          <span
            className="click"
            onClick={() =>
              owin(createTheDictUrl(url.substring(1), escape_apostrophes(trm)))
            }
          >
            {txt}
          </span>
        </>
      );
    } else {
      return (
        <>
          {txtbefore}{' '}
          <a href={`${createTheDictUrl(url, trm)}`} target="ru">
            {txt}
          </a>
        </>
      );
    }
  }
  return <></>;
}

/**
 *
 * @param u
 * @param w
 */
function createTheDictUrl(u: string, w: string) {
  const url = u.trim();
  const trm = w.trim();
  const r = `trans?x=2&i=${escape(u)}&t=${w}`;
  return r;
}

/**
 *
 * @param s
 */
function escape_apostrophes(s: string) {
  return s.replace(/'/g, "\\'");
}
/**
 *
 */
function AudioPlayer({ audioURI }: { audioURI: string }) {
  // TODO
  return <></>;
}

// TODO deprecate?
// function getPreviousAndNextTextLinks(textid, url, onlyann, add) {
//   const currentlang = validateLang(
//     processDBParam('filterlang', 'currentlanguage', '', 0)
//   );
//   const wh_lang = currentlang !== '' ? ' and TxLgID='.currentlang : '';

//   const currentquery = processSessParam('query', 'currenttextquery', '', 0);
//   const wh_query = (
//     str_replace('*', '%', mb_strtolower(currentquery, 'UTF-8'))
//   );
//   const wh_query = currentquery !== '' ? ' and TxTitle like '.wh_query : '';

//   const currenttag1 = validateTextTag(
//     processSessParam('tag1', 'currenttexttag1', '', 0),
//     currentlang
//   );
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
export function TesterTable({
  language,
  words: words,
}: {
  language: Language;
  words: Word[];
}) {
  // TODO;
  // BETWEEN 1 AND 5 AND WoTranslation !== \'\' AND WoTranslation !== \'*\'
  return (
    <>
      <p>
        <input
          type="checkbox"
          id="cbEdit"
          //  <?php echo get_checked($currenttabletestsetting1); ?>
        />{' '}
        Edit
        <input
          type="checkbox"
          id="cbStatus"
          //  <?php echo get_checked($currenttabletestsetting2); ?>
        />{' '}
        Status
        <input
          type="checkbox"
          id="cbTerm"
          //  <?php echo get_checked($currenttabletestsetting3); ?>
        />{' '}
        Term
        <input
          type="checkbox"
          id="cbTrans"
          //  <?php echo get_checked($currenttabletestsetting4); ?>
        />{' '}
        Translation
        <input
          type="checkbox"
          id="cbRom"
          //  <?php echo get_checked($currenttabletestsetting5); ?>
        />{' '}
        Romanization
        <input
          type="checkbox"
          id="cbSentence"
          //  <?php echo get_checked($currenttabletestsetting6); ?>
        />{' '}
        Sentence
      </p>

      <table
        class="sortable tab1"
        style={{ width: 'auto' }}
        cellspacing="0"
        cellpadding="5"
      >
        <tr>
          <th className="th1">Ed</th>
          <th className="th1 clickable">Status</th>
          <th className="th1 clickable">Term</th>
          <th className="th1 clickable">Translation</th>
          <th className="th1 clickable">Romanization</th>
          <th className="th1 clickable">Sentence</th>
        </tr>
        {/* <?php

	$sql = 'SELECT DISTINCT WoID, WoText, WoTranslation, WoRomanization, WoSentence, WoStatus, WoTodayScore As Score FROM ' . $testsql . ' AND WoStatus BETWEEN 1 AND 5 AND WoTranslation !== \'\' AND WoTranslation !== \'*\' order by WoTodayScore, WoRandom*RAND()';
	if ($debug)
		echo $sql;
	$res = do_mysqli_query($sql);
	while ($record = mysqli_fetch_assoc($res)) {
		$sent = tohtml(repl_tab_nl($record["WoSentence"]));
		$sent1 = str_replace("{", ' <b>[', str_replace(
			"}",
			']</b> ',
			mask_term_in_sentence($sent, $regexword)
		)
		);
		?> */}
        {words.map((word) => (
          <tr>
            <td className="td1 center" nowrap="nowrap">
              <a
                href="edit_tword.php?wid=<?php echo $record['WoID']; ?>"
                target="ro"
              >
                <Icon src="sticky-note--pencil" title="Edit Term" />
              </a>
            </td>
            <td className="td1 center" nowrap="nowrap">
              <span id="STAT<?php echo $record['WoID']; ?>">
                {/* <?php echo make_status_controls_test_table($record['Score'], $record['WoStatus'], $record['WoID']); ?> */}
              </span>
            </td>
            <td
              className="td1 center"
              style={{ fontSize: language.LgTextSize }}
            >
              {/* <?php echo $span1; ?> */}
              <span id="TERM<?php echo $record['WoID']; ?>">
                {word.WoText}
                {/* <?php echo tohtml($record['WoText']); ?> */}
              </span>
              {/* <?php echo $span2; ?> */}
            </td>
            <td className="td1 center">
              <span id="TRAN<?php echo $record['WoID']; ?>">
                {/* <?php echo tohtml($record['WoTranslation']); ?> */}
                {word.WoTranslation}
              </span>
            </td>
            <td className="td1 center">
              <span id="ROMA<?php echo $record['WoID']; ?>">
                {word.WoRomanization}
                {/* <?php echo tohtml($record['WoRomanization']); ?> */}
              </span>
            </td>
            <td className="td1 center">
              {/* <?php echo $span1; ?> */}
              <span id="SENT<?php echo $record['WoID']; ?>">
                {/* {word.WoRomanization} */}
                {/* <?php echo $sent1; ?> */}
              </span>
              {/* <?php echo $span2; ?> */}
            </td>
          </tr>
        ))}
      </table>
    </>
  );
}
function make_status_controls_test_table($score, $status, $wordid) {
  if ($score < 0) $score = '<span class="red2">';
  // . get_status_abbr($status) .
  //  '</span>';
  else $score = get_status_abbr($status);

  return (
    <>
      {$status === 98 ? (
        <></>
      ) : $status >= 1 ? (
        <img
          src="icn/minus.png"
          className="click"
          title="-"
          alt="-"
          onClick="changeTableTestStatus(' . $wordid . ',false);"
        />
      ) : (
        <Icon src="placeholder" title="" />
      )}{' '}
      {$score < 0 ? (
        <span className="red2">get_status_abbr($status)</span>
      ) : (
        <>{get_status_abbr($status)}</>
      )}{' '}
      {$status === 99 ? (
        <></>
      ) : (
        <>
          {' '}
          {$status <= 5 || $status === 98 ? (
            <img
              src="icn/plus.png"
              className="click"
              title="+"
              alt="+"
              onclick="changeTableTestStatus(' . $wordid . ',true);"
            />
          ) : (
            <Icon src="placeholder" title="" />
          )}
        </>
      )}
      ;
    </>
  );
}

// TODO
{
  // pagestart_nobody('', 'html, body { margin:3px; padding:0; }');
  /* <p class="center">&nbsp;<br />Sorry - No terms to display or to test at this time.</p> */
  // '<p>Sorry - The selected terms are in ' . $cntlang . ' languages, but tests are only possible in one language at a time.</p>
}
