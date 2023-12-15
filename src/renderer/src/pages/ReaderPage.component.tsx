import { useEffect, useRef, useState } from 'react';
import SplitPane from 'react-split-pane';
import { dataService } from '../data/data.service';
import { LanguagesID, TextsID } from '../data/validators';
import { useData } from '../hooks/useData';
import { useThemeColors } from '../hooks/useThemeColors';
import { useTick } from '../hooks/useTimer';
import { useUpdateActiveText } from '../hooks/useUpdateActiveText';
import { A } from '../nav/InternalLink';
import { PLUGINS } from '../plugins';
import { APITranslateTerm } from '../plugins/deepl.plugin';
import { Header } from '../ui-kit/Header';
import { Icon } from '../ui-kit/Icon';
import { Language, Text, TextItem, Word } from '../utils/parseMySqlDump';
import { TranslationAPI } from './IO/APITranslation.component';
import { Loader } from './Loader';
import { Reader } from './Reader.component';
import { get_status_abbr } from './SelectOptions';
import { AddNewWordPane } from './Term/AddNewWordPane';
import {
  DictionaryLinks,
  LanguageDictionaryDataTempHack,
} from './Term/DictionaryLinks';
import { LanguageDictionaryData } from './Term/limitedTypes';
import { TextToDoCount } from './TextToDoCount';
import {
  MakeOverlibLinkChangeStatusAlltest,
  MakeOverlibLinkChangeStatusTest,
  RunOverlibMultiword,
  RunOverlibStatus1To5,
  RunOverlibStatus98,
  RunOverlibStatus99,
  RunOverlibStatusUnknown,
  cClick,
  makeTooltipTitleObj,
  makeTooltipTitleString,
} from './escape_html_chars';
import { owin } from './translateSentence2';

// TODO
//  confirmation screen
//  details screen

/**
 *
 * @param text
 * @param newVal
 * @param onShowChanged
 */
function showallwordsClick(
  text: TextsID,
  newVal: 0 | 1,
  onShowChanged: (args: { text: TextsID; mode: 0 | 1 }) => void
) {
  dataService.setSettings({ showallwords: newVal });
  onShowChanged({ text, mode: newVal });
}
/**
 *
 */
function ShowAllMessage({ showAll: showAll }: { showAll: 0 | 1 }) {
  return (
    <p>
      <span id="waiting">
        <img src="icn/waiting.gif" alt="Please wait" title="Please wait" />
        &nbsp;&nbsp;Please wait ...
      </span>
      {showAll === 1 ? (
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
            multi-word terms. The creation and deletion of multi-word terms can
            be a bit slow in long texts.
            <br />
            <br />
            To manipulate ALL terms, set <i>Show All</i> to ON.
          </p>
        </>
      )}
    </p>
  );
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
    if (!frame) {
      return () => {};
    }
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
export function ReaderPage({
  textID: textID,
}: // onShowChanged,
{
  textID: TextsID;
  // onShowChanged: (args: { text: TextsID; mode: 0 | 1 }) => void;
}) {
  const [{ texts, settings }] = useData(['texts', 'settings']);
  const {
    ['set-text-l-framewidth-percent']: lFrameWidthPerc,
    ['set-text-r-frameheight-percent']: rFrameHeightPerc,
    // TODO use
    ['set-text-visit-statuses-via-key']: ADDFILTER,
    ['set-text-h-frameheight-no-audio']: setTextHFrameheightNoAudio,
    ['set-text-h-frameheight-with-audio']: setTextHFrameheightWithAudio,
  } = settings;

  // ANN_ARRAY = <?php echo annotation_to_json($ann); ?>;
  // TEXTPOS = -1;
  // OPENED = 0;
  // TODO
  // $(document).ready(function () {
  //   $('.word').each(word_each_do_text_text);
  //   $('.mword').each(mword_each_do_text_text);
  // });
  // TODO
  // useEffect(() => {
  //   // TODO getTextItem from current item?
  //   const onKeyDown = (e) => keydown_event_do_text_text(e, { textItem, word });
  //   document.addEventListener('keydown', onKeyDown);
  //   return () => {
  //     document.removeEventListener('keydown', onKeyDown);
  //   };
  // }, []);
  useUpdateActiveText(textID);

  const [activeWord, setActiveWord] = useState<
    | (Word & Pick<TextItem, 'TiSeID'>)
    | ({ newWord: string } & Pick<TextItem, 'TiSeID'>)
    | null
  >(null);
  // TODO bad pattern
  const [showAll, setShowAll] = useState<boolean>(false);
  const [showChanged, setShowChanged] = useState<{
    text: TextsID;
    mode: 0 | 1;
  } | null>(null);
  const [iFrameURL, setIFrameURL] = useState<string | null>(null);
  const [translateAPIParams, setTranslateAPIParams] = useState<
    (APITranslateTerm<string, string> & { apiKey: string }) | null
  >(null);
  const text = texts.find((text) => text.TxID === textID);
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
                  Show All&nbsp;
                  <input
                    type="checkbox"
                    id="showallwords"
                    onClick={({ target: { value } }) => {
                      // showallwordsClick(text.TxID, val, setShowChanged)
                      // TODO
                      setShowAll(value);
                    }}
                    // TODO
                    // ref={null}
                  />
                </span>
                {/* TODO deprecate */}
                <span id="thetextid" className="hide">
                  {text.TxID}
                </span>
              </td>
            </tr>

            {text.TxAudioURI && <AudioPlayer audioURI={text.TxAudioURI} />}
          </table>
        </>
        <Reader
          activeID={textID}
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
            langID={text.TxLgID}
            onClearActiveWord={() => setActiveWord(null)}
            setIFrameURL={setIFrameURL}
            setTranslateAPIParams={setTranslateAPIParams}
          />
        ) : showChanged ? (
          <>
            <ShowAllMessage showAll={showChanged.mode} />
          </>
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
  langID: langID,
  textID: textID,
}: {
  textID: TextsID | null;
  langID: LanguagesID | null;
}) {
  const [{ texts, words, languages, textitems }] = useData([
    'texts',
    'words',
    'languages',
    'textitems',
  ]);
  useUpdateActiveText(textID);

  const [activeWord, setActiveWord] = useState<string | null>();
  // TODO can be multiple texts?
  const text =
    textID !== null
      ? texts.find((text) => text.TxID === textID)
      : texts.find((text) => text.TxLgID === langID);

  const [testModality, setTestModality] = useState<Modality>(null);
  const language = languages.find(
    (val) => val.LgID === (langID ? langID : text.TxLgID)
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
          <Header title={`TEST ▶ ${text.TxTitle} (Due: TODO of TODO)`} />

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
            langID={text.TxLgID}
            existingTerm={words.find(({ WoText }) => activeWord === WoText)}
            onClearActiveWord={function (): void {
              throw new Error('Function not implemented.');
            }}
            setIFrameURL={function (url: string | null): void {
              throw new Error('Function not implemented.');
            }}
            setTranslateAPIParams={function (
              vals:
                | (APITranslateTerm<string, string> & { apiKey: string })
                | null
            ): void {
              throw new Error('Function not implemented.');
            }}
          />
        ) : (
          <></>
        )}
        <IFramePane url={null} />
      </SplitPane>
    </SplitPane>
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

/**
 *
 */
function RunTestForWord({
  word: { WoStatus: WoStatus, WoID, WoText: WoText },
  language,
  setTranslateAPIParams,
  setIFrameURL,
}: {
  word: Word;
  language: Language;
  setTranslateAPIParams: (
    vals: (APITranslateTerm<string, string> & { apiKey: string }) | null
  ) => void;
  setIFrameURL: (url: string | null) => void;
}) {
  return (
    <>
      <center>
        <hr
          style={{
            height: '1px',
            border: 'none',
            color: '#333',
            backgroundColor: '#333',
          }}
        />
        {WoStatus >= 1 && WoStatus <= 5 && (
          <>
            {/* TODO values here */}
            <MakeOverlibLinkChangeStatusTest
              WoID={WoID}
              plusminus={'plus'}
              text={''}
            />
            <Icon src="thumb-up" title="Got it!" /> Got it! [
            {`${WoStatus} ▶ ${WoStatus + 1}`}
            ]
            <hr
              style={{
                height: '1px',
                border: 'none',
                color: '#333',
                backgroundColor: '#333',
              }}
            />
            {/* TODO values here */}
            <MakeOverlibLinkChangeStatusTest
              WoID={WoID}
              plusminus={'plus'}
              text={''}
            />
            <Icon src="thumb" title="Oops!" /> Oops! [
            {`${WoStatus} ▶ ${WoStatus - 1}`}
            ]
            <hr
              style={{
                height: '1px',
                border: 'none',
                color: '#333',
                backgroundColor: '#333',
              }}
            />
            {/* TODO */}
            <b>
              {' '}
              <MakeOverlibLinkChangeStatusAlltest
                word={{ WoID }}
                oldstat={WoStatus}
              />
            </b>
            <br />
          </>
        )}
      </center>
      <hr
        style={{
          height: '1px',
          border: 'none',
          color: '#333',
          backgroundColor: '#333',
        }}
      />
      {/* <b>{escape_html_chars(makeTooltipTitle(text, trans, roman, stat))}</b> */}
      <br />
      <A ref={`/edit_tword?wid=${WoID}`} target="ro">
        Edit term
      </A>
      <br />
      <DictionaryLinks
        lang={language}
        sentenceString={''}
        wordString={WoText}
        setTranslateAPIParams={setTranslateAPIParams}
        setIFrameURL={setIFrameURL}
        breakSent
      />
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
/**
 *
 */
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
          //  <?php echo get_checked(currenttabletestsetting1); ?>
        />{' '}
        Edit
        <input
          type="checkbox"
          id="cbStatus"
          //  <?php echo get_checked(currenttabletestsetting2); ?>
        />{' '}
        Status
        <input
          type="checkbox"
          id="cbTerm"
          //  <?php echo get_checked(currenttabletestsetting3); ?>
        />{' '}
        Term
        <input
          type="checkbox"
          id="cbTrans"
          //  <?php echo get_checked(currenttabletestsetting4); ?>
        />{' '}
        Translation
        <input
          type="checkbox"
          id="cbRom"
          //  <?php echo get_checked(currenttabletestsetting5); ?>
        />{' '}
        Romanization
        <input
          type="checkbox"
          id="cbSentence"
          //  <?php echo get_checked(currenttabletestsetting6); ?>
        />{' '}
        Sentence
      </p>

      <table
        className="sortable tab1"
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
            <td className="td1 center" style={{ whiteSpace: 'nowrap' }}>
              <a
                href="edit_tword?wid=<?php echo record['WoID']; ?>"
                target="ro"
              >
                <Icon src="sticky-note--pencil" title="Edit Term" />
              </a>
            </td>
            <td className="td1 center" style={{ whiteSpace: 'nowrap' }}>
              <span id="STAT<?php echo record['WoID']; ?>">
                {/* <?php echo make_status_controls_test_table(record['Score'], record['WoStatus'], record['WoID']); ?> */}
              </span>
            </td>
            <td
              className="td1 center"
              style={{ fontSize: language.LgTextSize }}
            >
              {/* <?php echo span1; ?> */}
              <span id="TERM<?php echo record['WoID']; ?>">
                {word.WoText}
                {/* <?php echo tohtml(record['WoText']); ?> */}
              </span>
              {/* <?php echo span2; ?> */}
            </td>
            <td className="td1 center">
              <span id="TRAN<?php echo record['WoID']; ?>">
                {/* <?php echo tohtml(record['WoTranslation']); ?> */}
                {word.WoTranslation}
              </span>
            </td>
            <td className="td1 center">
              <span id="ROMA<?php echo record['WoID']; ?>">
                {word.WoRomanization}
                {/* <?php echo tohtml(record['WoRomanization']); ?> */}
              </span>
            </td>
            <td className="td1 center">
              {/* <?php echo span1; ?> */}
              <span id="SENT<?php echo record['WoID']; ?>">
                {/* {word.WoRomanization} */}
                {/* <?php echo sent1; ?> */}
              </span>
              {/* <?php echo span2; ?> */}
            </td>
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
 * @param wordid
 */
function MakeStatusControlsTestTable(score, status, wordid) {
  if (score < 0) score = '<span class="red2">';
  // . get_status_abbr(status) .
  //  '</span>';
  else score = get_status_abbr(status);

  return (
    <>
      {status === 98 ? (
        <></>
      ) : status >= 1 ? (
        <Icon
          src="minus"
          className="click"
          title="-"
          alt="-"
          onClick="changeTableTestStatus(' . wordid . ',false);"
        />
      ) : (
        <Icon src="placeholder" title="" />
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
              alt="+"
              onClick="changeTableTestStatus(' . wordid . ',true);"
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
  // '<p>Sorry - The selected terms are in ' . cntlang . ' languages, but tests are only possible in one language at a time.</p>
}

/**
 *
 */
export function word_dblclick_event_do_text_text({
  totalcharcount,
  data_pos,
  setPos,
}: {
  totalcharcount: number;
  data_pos: number;
  setPos: (val: number) => void;
}) {
  const t = totalcharcount;
  if (t === 0) {
    return;
  }
  const p = Math.max(0, (100 * (data_pos - 5)) / t);
  // TODO
  setPos(p);
}

// function annotation_to_json($ann) {
//   if ($ann === '') return '{}';
//   $arr = array();
//   $items = preg_split('/[\n]/u', $ann);
//   $arr = $items.map(($item) => {
//     $vals = preg_split('/[\t]/u', $item);
//     if (count($vals) > 3 && $vals[0] >= 0 && $vals[2] > 0) {
//       $arr[$vals[0] - 1] = array($vals[1], $vals[2], $vals[3]);
//     }
//   });
//   return json_encode($arr);
// }

/**
 *
 * @param i
 * @param word
 * @param annArray
 * @param setTitle
 */
export function word_each_do_text_text(
  word: Pick<
    Word,
    'WoText' | 'WoTranslation' | 'WoRomanization' | 'WoStatus'
  > & { WoID?: Word['WoID'] },
  { TiOrder: TiOrder }: Pick<TextItem, 'TiOrder'>,
  annArray: string[],
  setTitle: (val: string) => void
) {
  setTitle(makeTooltipTitleString(makeTooltipTitleObj(word)));
  const wid = word.WoID;
  if (wid !== undefined) {
    const order = TiOrder;
    if (order in annArray) {
      if (wid === annArray[order][1]) {
        $(this).attr('data_ann', annArray[order][2]);
      }
    }
  }
}

/**
 *
 * @param i
 * @param word
 * @param annArray
 * @param setDataAnn
 * @param setTitle
 */
export function MWordEachDoTextText(
  i,
  { TiOrder: TiOrder }: Pick<TextItem, 'TiOrder'>,
  word: Pick<Word, 'WoText' | 'WoRomanization' | 'WoTranslation'> &
    Partial<Pick<Word, 'WoStatus' | 'WoID'>>,
  annArray: string[],
  setDataAnn: (val: string) => void,
  setTitle: (val: string) => void
) {
  word.WoStatus;
  if (word.WoStatus !== undefined) {
    setTitle(makeTooltipTitleString(makeTooltipTitleObj(word)));
    const wid = word.WoID;
    if (wid !== undefined) {
      const order = TiOrder;
      for (let j = 2; j <= 16; j = j + 2) {
        const index = (order + j).toString();
        if (index in annArray) {
          if (wid === annArray[index][1]) {
            setDataAnn(annArray[index][2]);
            break;
          }
        }
      }
    }
  }
}
/**
 *
 */
export function WordClickEventDoTextText({
  word: { WoStatus: data_status, WoID: wid },
  language: { LgRightToLeft: RTL, ...lang },
  textItem: { TiOrder },
  data_ann,
  mw,
  TxID,
}: {
  word: Pick<Word, 'WoStatus' | 'WoID'>;
  language: LanguageDictionaryDataTempHack & Pick<Language, 'LgRightToLeft'>;
  textItem: Pick<TextItem, 'TiOrder'>;
  TxID: TextsID;
  data_ann?: string;
  mw: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
  ];
}) {
  const status = data_status;
  let ann = '';
  if (data_ann !== undefined) {
    ann = data_ann;
  }

  if (status < 1) {
    RunOverlibStatusUnknown({
      lang,
      hints: $(this).attr('title'),
      TxID,
      TiOrder,
      txt: $(this).text(),
      mw29: mw.slice(2, 9),
      rtl: RTL,
    });
    top.frames['ro'].location.href =
      'edit_word?tid=' + TxID + '&ord=' + TiOrder + '&wid=';
  } else if (status === 99)
    RunOverlibStatus99({
      lang,
      hints: $(this).attr('title'),
      TxID,
      TiOrder,
      txt: $(this).text(),
      WoID: wid,
      mw29: mw.slice(2, 9),
      rtl: RTL,
      ann,
    });
  else if (status === 98)
    RunOverlibStatus98({
      lang,
      hints: $(this).attr('title'),
      TxID,
      TiOrder,
      txt: $(this).text(),
      WoID: wid,
      mw29: mw.slice(2, 9),
      rtl: RTL,
      ann,
    });
  else
    RunOverlibStatus1To5({
      lang,
      hints: $(this).attr('title'),
      TxID,
      TiOrder,
      txt: $(this).text(),
      WoID: wid,
      stat: status,
      mw29: mw.slice(2, 9),
      rtl: RTL,
      ann,
    });
  return false;
}
/**
 *
 */
export function MwordClickEventDoTextText({
  word: { WoStatus: data_status, WoID: data_wid },
  language: lang,
  textItem: { TiOrder: TiOrder, TiText: data_text, TiWordCount: data_code },
  data_ann,
  mw,
  TxID,
}: {
  word: Pick<Word, 'WoStatus' | 'WoID'>;
  language: LanguageDictionaryData;
  textItem: Pick<TextItem, 'TiOrder' | 'TiText' | 'TiWordCount'>;
  TxID: TextsID;
  data_ann?: string;
  mw: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
  ];
}) {
  const status = data_status;
  if (status !== undefined) {
    const ann = data_ann !== undefined ? data_ann : '';
    RunOverlibMultiword({
      lang,
      hints: $(this).attr('title'),
      TxID,
      TiOrder,
      txt: data_text,
      WoID: data_wid,
      stat: status,
      wcnt: data_code,
      ann,
    });
  }
  return false;
}
/**
 *
 * @param e
 */
export function KeydownEventDoTextText(
  e: KeyboardEvent,
  {
    text: { TxID },
    textItem: { TiOrder: TiOrder },
    word: { WoID },
  }: {
    text: Pick<Text, 'TxID'>;
    textItem: Pick<TextItem, 'TiOrder'>;
    word: Pick<Word, 'WoID'>;
  }
) {
  if (e.key === 'Escape') {
    // esc = reset all
    TEXTPOS = -1;
    $('span.uwordmarked').removeClass('uwordmarked');
    $('span.kwordmarked').removeClass('kwordmarked');
    cClick();
    return false;
  }

  if (e.key === 'Return') {
    // return = edit next unknown word
    $('span.uwordmarked').removeClass('uwordmarked');
    const unknownwordlist = $('span.status0.word:not(.hide):first');
    if (unknownwordlist.size() === 0) return false;
    $(window).scrollTo(unknownwordlist, { axis: 'y', offset: -150 });
    unknownwordlist.addClass('uwordmarked').click();
    cClick();
    return false;
  }

  const knownwordlist = $(
    'span.word:not(.hide):not(.status0)' +
      ADDFILTER +
      ',span.mword:not(.hide)' +
      ADDFILTER
  );
  const l_knownwordlist = knownwordlist.size();
  // console.log(knownwordlist);
  if (l_knownwordlist === 0) return true;

  // the following only for a non-zero known words list
  if (e.which === 36) {
    // home : known word navigation -> first
    $('span.kwordmarked').removeClass('kwordmarked');
    TEXTPOS = 0;
    curr = knownwordlist.eq(TEXTPOS);
    curr.addClass('kwordmarked');
    $(window).scrollTo(curr, { axis: 'y', offset: -150 });
    let ann = '';
    if (typeof curr.attr('data_ann') !== 'undefined')
      ann = curr.attr('data_ann');
    window.parent.frames['ro'].location.href =
      'show_word?wid=' +
      curr.attr('data_wid') +
      '&ann=' +
      encodeURIComponent(ann);
    return false;
  }
  if (e.which === 35) {
    // end : known word navigation -> last
    $('span.kwordmarked').removeClass('kwordmarked');
    TEXTPOS = l_knownwordlist - 1;
    curr = knownwordlist.eq(TEXTPOS);
    curr.addClass('kwordmarked');
    $(window).scrollTo(curr, { axis: 'y', offset: -150 });
    let ann = '';
    if (typeof curr.attr('data_ann') !== 'undefined')
      ann = curr.attr('data_ann');
    window.parent.frames['ro'].location.href =
      'show_word?wid=' +
      curr.attr('data_wid') +
      '&ann=' +
      encodeURIComponent(ann);
    return false;
  }
  if (e.which === 37) {
    // left : known word navigation
    const marked = $('span.kwordmarked');
    const currid =
      marked.length === 0 ? 100000000 : get_position_from_id(marked.attr('id'));
    $('span.kwordmarked').removeClass('kwordmarked');
    // console.log(currid);
    TEXTPOS = l_knownwordlist - 1;
    for (let i = l_knownwordlist - 1; i >= 0; i--) {
      const iid = get_position_from_id(knownwordlist.eq(i).attr('id'));
      // console.log(iid);
      if (iid < currid) {
        TEXTPOS = i;
        break;
      }
    }
    // TEXTPOS--;
    // if (TEXTPOS < 0) TEXTPOS = l_knownwordlist - 1;
    curr = knownwordlist.eq(TEXTPOS);
    curr.addClass('kwordmarked');
    $(window).scrollTo(curr, { axis: 'y', offset: -150 });
    let ann = '';
    if (typeof curr.attr('data_ann') !== 'undefined')
      ann = curr.attr('data_ann');
    window.parent.frames['ro'].location.href =
      'show_word?wid=' +
      curr.attr('data_wid') +
      '&ann=' +
      encodeURIComponent(ann);
    return false;
  }
  if (e.which === 39 || e.which === 32) {
    // space /right : known word navigation
    const marked = $('span.kwordmarked');
    const currid =
      marked.length === 0 ? -1 : get_position_from_id(marked.attr('id'));
    $('span.kwordmarked').removeClass('kwordmarked');
    // console.log(currid);
    TEXTPOS = 0;
    for (let i = 0; i < l_knownwordlist; i++) {
      const iid = get_position_from_id(knownwordlist.eq(i).attr('id'));
      // console.log(iid);
      if (iid > currid) {
        TEXTPOS = i;
        break;
      }
    }
    // TEXTPOS++;
    // if (TEXTPOS >= l_knownwordlist) TEXTPOS = 0;
    curr = knownwordlist.eq(TEXTPOS);
    curr.addClass('kwordmarked');
    $(window).scrollTo(curr, { axis: 'y', offset: -150 });
    let ann = '';
    if (typeof curr.attr('data_ann') !== 'undefined')
      ann = curr.attr('data_ann');
    window.parent.frames['ro'].location.href =
      'show_word?wid=' +
      curr.attr('data_wid') +
      '&ann=' +
      encodeURIComponent(ann);
    return false;
  }

  if (TEXTPOS < 0 || TEXTPOS >= l_knownwordlist) return true;
  let curr = knownwordlist.eq(TEXTPOS);
  const wid = WoID;
  const ord = TiOrder;

  // the following only with valid pos.
  for (let i = 1; i <= 5; i++) {
    if (e.which === 48 + i || e.which === 96 + i) {
      // 1,.. : status=i
      window.parent.frames[
        'ro'
      ].location.href = `set_word_status?wid=${wid}&tid=${TxID}&ord=${ord}&status=${i}`;
      return false;
    }
  }
  if (e.which === 73) {
    // I : status=98
    window.parent.frames[
      'ro'
    ].location.href = `set_word_status?wid=${wid}&tid=${TxID}&ord=${ord}&status=98`;
    return false;
  }
  if (e.which === 87) {
    // W : status=99
    window.parent.frames[
      'ro'
    ].location.href = `set_word_status?wid=${wid}&tid=${TxID}&ord=${ord}&status=99`;
    return false;
  }
  if (e.which === 65) {
    // A : set audio pos.
    let p = curr.attr('data_pos');
    const t = parseInt($('#totalcharcount').text(), 10);
    if (t === 0) return true;
    p = (100 * (p - 5)) / t;
    if (p < 0) p = 0;
    if (typeof window.parent.frames['h'].new_pos === 'function')
      window.parent.frames['h'].new_pos(p);
    else return true;
    return false;
  }
  if (e.which === 69) {
    //  E : EDIT
    if (curr.has('.mword'))
      window.parent.frames[
        'ro'
      ].location.href = `edit_mword?wi=${wid}&ti=${TxID}&ord=${ord}`;
    else {
      window.parent.frames[
        'ro'
      ].location.href = `edit_word?wi=${wid}&ti=${TxID}&ord=${ord}`;
    }
    return false;
  }

  return true;
}
