import { useEffect, useState } from 'react';
import SplitPane from 'react-split-pane';
import { Words } from '../data/parseMySqlDump';
import { useData } from '../data/useAkita';
import { LanguagesId, TextsId } from '../data/validators';
import { Header } from '../ui-kit/Header';
import { Icon } from '../ui-kit/Icon';
import { AddNewWordPane } from './AddNewWordPane';
import { Reader } from './Reader.component';
import { escape_html_chars, make_tooltip } from './escape_html_chars';

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
    Words | { newWord: string } | null
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
        {/* TODO Show All */}
        {/* TODO audio */}
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
export function make_overlib_link_change_status_test(
  wid: string,
  plusminus: string,
  text: string
) {
  return ` <a href=\x22set_test_status.php?wid=${wid}&amp;stchange=${plusminus}\x22 target=\x22ro\x22>${text}</a> `;
}

export function Tester({ modality }: { modality: Modality }) {
  const [testingWord, setTestingWord] = useState<Words | null>(null);
  const [numCorrect, setNumCorrect] = useState(0);
  const [numWrong, setNumWrong] = useState(0);
  const [numNotTested, setNumNotTested] = useState(10);
  //

  const timer = useTimer(1000);
  const totalTests = numWrong + numCorrect + numNotTested;
  const l_notyet = Math.round(numNotTested * 100);
  const b_notyet = l_notyet == 0 ? '' : 'borderl';
  const l_wrong = Math.round(numWrong * 100);
  const b_wrong = l_wrong == 0 ? '' : 'borderl';
  const l_correct = Math.round(numCorrect * 100);
  const b_correct = l_correct == 0 ? 'borderr' : 'borderl borderr';

  return (
    <>
      {testingWord && <RunTestForWord word={testingWord} />}
      <div id="footer">
        <Icon src="clock" title="Elapsed Time" />
        <span id="timer" title="Elapsed Time">
          {timer}
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
 * @param intervalInMs
 */
function useTimer(intervalInMs: number) {
  const [time, setTime] = useState(0);
  useEffect(() => {
    const interval = setInterval(
      () => setTime(new Date().getTime() - time),
      intervalInMs
    );
    return () => {
      clearInterval(interval);
    };
  }, []);
  return time;
}

function RunTestForWord({ word: { WoStatus: status } }: { word: Words }) {
  return (
    <>
      <center>
        <hr size={1} />
        {status >= 1 && status <= 5 && (
          <>
            {/* make_overlib_link_change_status_test */}
            <Icon src="thumb-up" title="Got it!" /> Got it! [
            {`${status} ▶ ${status + 1}`}
            ]
            <hr size={1} />
            {/* make_overlib_link_change_status_test */}
            <Icon src="thumb" title="Oops!" /> Oops! [
            {`${status} ▶ ${status - 1}`}
            ]
            <hr size={1} />
            <b>{/* make_overlib_link_change_status_alltest(wid,stat) */}</b>
            <br />
            {/* // </center> */}
          </>
        )}
      </center>
      <hr size={1} />
      <b>{escape_html_chars(make_tooltip(txt, trans, roman, stat))}</b>
      <br />
      <a href="edit_tword.php?wid=" target="ro">
        Edit term
      </a>
      <br />
      {createTheDictLink(wblink1, txt, 'Dict1', 'Lookup Term: ')}
      {createTheDictLink(wblink2, txt, 'Dict2', '')}
      {createTheDictLink(wblink3, txt, 'GTr', '')}
      {/* TODO */}
      {/* createTheDictLink(wblink3,sent,'GTr','
      <br />
      Lookup Sentence:'), */}
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
export function createTheDictLink(u: string, w: string, t: string, b: string) {
  const url = u.trim();
  const trm = w.trim();
  const txt = t.trim();
  const txtbefore = b.trim();
  let r = '';
  if (url != '' && txt != '') {
    if (url.substr(0, 1) == '*') {
      r = ` ${txtbefore} <span class=\x22click\x22 onclick=\x22owin('${createTheDictUrl(
        url.substring(1),
        escape_apostrophes(trm)
      )}');\x22>${txt}</span> `;
    } else {
      r = ` ${txtbefore} <a href=\x22${createTheDictUrl(
        url,
        trm
      )}\x22 target=\x22ru\x22>${txt}</a> `;
    }
  }
  return r;
}

/**
 *
 * @param u
 * @param w
 */
function createTheDictUrl(u: string, w: string) {
  const url = u.trim();
  const trm = w.trim();
  const r = `trans.php?x=2&i=${escape(u)}&t=${w}`;
  return r;
}

/**
 *
 * @param s
 */
function escape_apostrophes(s: string) {
  return s.replace(/'/g, "\\'");
}
