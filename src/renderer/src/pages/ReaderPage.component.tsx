import { useState } from 'react';
import SplitPane from 'react-split-pane';
import { Language, Word } from '../data/parseMySqlDump';
import { useData } from '../data/useAkita';
import { LanguagesId, TextsId } from '../data/validators';
import { A } from '../nav/InternalLink';
import { Header } from '../ui-kit/Header';
import { Icon } from '../ui-kit/Icon';
import { AddNewWordPane } from './AddNewWordPane';
import { Reader } from './Reader.component';
import { owin } from './translateSentence2';
import { useTick } from './useTimer';

// TODO
//  confirmation screen
//  details screen

function Pane3() {
  // https://stackoverflow.com/questions/23616226/insert-html-with-react-variable-statements-jsx
  // dictionary pane
  return (
    <div style={{ backgroundColor: 'yellow', width: '100%', height: '100%' }}>
      TEST1
    </div>
  );
}
// TODO I Know All

export function ReaderPage({ textId }: { textId: TextsId }) {
  const [{ texts, words }] = useData(['texts', 'words']);

  const [activeWord, setActiveWord] = useState<
    Word | { newWord: string } | null
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
  return (
    <SplitPane split="vertical" minSize={50} defaultSize="55%">
      <SplitPane
        style={{ overflowWrap: 'break-word' }}
        split="horizontal"
        minSize={50}
        defaultSize="20%"
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
                  {/* TODO */}
                  {/* <?php echo texttodocount2($_REQUEST['text']); ?> */}
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
                    // TODO
                    // <?php echo get_checked($showAll); ?>
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
        {/* TODO Show All */}
        <Reader
          activeId={textId}
          setActiveWord={setActiveWord}
          activeWord={activeWord}
        />
      </SplitPane>
      <SplitPane split="horizontal" minSize={50} defaultSize="60%">
        {activeWord && 'newWord' in activeWord ? (
          <AddNewWordPane
            word={activeText}
            langId={text.TxLgID}
            // TODO horribly inefficient
            existingTerm={words.find(({ WoText }) => activeText === WoText)}
          />
        ) : (
          <></>
        )}
        <Pane3 />
      </SplitPane>
    </SplitPane>
  );
}
type Modality = 0 | 1 | 2 | 3 | 4 | 5 | 'table' | null;

export function TesterPage({
  langId,
  textId,
}: {
  textId: TextsId | null;
  langId: LanguagesId | null;
}) {
  const [{ texts, words }] = useData(['texts', 'words']);

  const [activeWord, setActiveWord] = useState<string | null>();

  // TODO
  const text =
    textId !== null
      ? texts.find((text) => text.TxID === textId)
      : texts.find((text) => text.TxLgID === langId);

  const [testModality, setTestModality] = useState<Modality>(null);
  if (!text) {
    return <></>;
  }
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
        {testModality === null ? <></> : <Tester modality={testModality} />}
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
        <Pane3 />
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
  const b_notyet = l_notyet == 0 ? '' : 'borderl';
  const l_wrong = Math.round(numWrong * 100);
  const b_wrong = l_wrong == 0 ? '' : 'borderl';
  const l_correct = Math.round(numCorrect * 100);
  const b_correct = l_correct == 0 ? 'borderr' : 'borderl borderr';

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

function RunTestForWord({
  word: {
    WoTranslation: trans,
    WoStatus: status,
    WoID,
    WoRomanization: roman,
    WoText: text,
  },
  language: {
    LgDict1URI: wblink1,
    LgDict2URI: wblink2,
    LgGoogleTranslateURI: wblink3,
  },
}: {
  word: Word;
  language: Language;
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
        {status >= 1 && status <= 5 && (
          <>
            {/* TODO values here */}
            <MakeOverlibLinkChangeStatusTest
              wid={0}
              plusminus={'plus'}
              text={''}
            />
            <Icon src="thumb-up" title="Got it!" /> Got it! [
            {`${status} ▶ ${status + 1}`}
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
              wid={0}
              plusminus={'plus'}
              text={''}
            />
            <Icon src="thumb" title="Oops!" /> Oops! [
            {`${status} ▶ ${status - 1}`}
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
            <b>{/* make_overlib_link_change_status_alltest(wid,stat) */}</b>
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
      {/* <b>{escape_html_chars(make_tooltip(text, trans, roman, stat))}</b> */}
      <br />
      <A ref={`/edit_tword?wid=${WoID}`} target="ro">
        Edit term
      </A>
      <br />

      <CreateTheDictLink u={wblink1} w={text} t={'Dict1'} b={'Lookup Term: '} />
      <CreateTheDictLink u={wblink2} w={text} t={'Dict2'} b={''} />
      <CreateTheDictLink u={wblink3} w={Set} t={'GTr'} b={''} />
      <br />
      {/* Lookup Sentence:'), */}
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
  if (url != '' && txt != '') {
    if (url.substr(0, 1) == '*') {
      return (
        <>
          {txtbefore}{' '}
          <span
            className="click"
            onClick={() =>
              owin(
                `${createTheDictUrl(url.substring(1), escape_apostrophes(trm))}`
              )
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
function AudioPlayer({ audioURI }: { audioURI: string }) {
  return <></>;
}
