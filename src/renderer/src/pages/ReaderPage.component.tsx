import { useEffect, useState } from 'react';
import SplitPane from 'react-split-pane';
import { Icon } from '../Icon';
import { Words } from '../data/parseMySqlDump';
import { useData } from '../data/useAkita';
import { LanguagesId, TextsId } from '../data/validators';
import { AddNewWord } from './AddNewWord';
import { Header } from './Header';
import { Reader } from './Reader.component';

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
    <>
      <SplitPane split="vertical" minSize={50} defaultSize={'55%'}>
        <SplitPane
          style={{ overflowWrap: 'break-word' }}
          split="horizontal"
          minSize={50}
          defaultSize={'20%'}
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
        <SplitPane split="horizontal" minSize={50} defaultSize={'60%'}>
          {activeWord && 'newWord' in activeWord ? (
            <AddNewWord
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
    </>
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
    <>
      <SplitPane split="vertical" minSize={50} defaultSize={'55%'}>
        <SplitPane
          style={{ overflowWrap: 'break-word' }}
          split="horizontal"
          minSize={50}
          defaultSize={'20%'}
        >
          <>
            <Header title={''} />
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
        <SplitPane split="horizontal" minSize={50} defaultSize={'60%'}>
          {/* TODO RHS panes */}
          {activeWord ? (
            <AddNewWord
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
    </>
  );
}

export function Tester({ modality }: { modality: Modality }) {
  const [numCorrect, setNumCorrect] = useState(0);
  const [numWrong, setNumWrong] = useState(0);
  const [numNotTested, setNumNotTested] = useState(10);
  //
  const [secondsSinceStart, setSecondsSinceStart] = useState<number>(0);

  useEffect(() => {});
  const totalTests = numWrong + numCorrect + numNotTested;
  const l_notyet = Math.round(numNotTested * 100);
  const b_notyet = l_notyet == 0 ? '' : 'borderl';
  const l_wrong = Math.round(numWrong * 100);
  const b_wrong = l_wrong == 0 ? '' : 'borderl';
  const l_correct = Math.round(numCorrect * 100);
  const b_correct = l_correct == 0 ? 'borderr' : 'borderl borderr';

  return (
    <>
      <div id="footer">
        <Icon src="clock" title="Elapsed Time" />
        <span id="timer" title="Elapsed Time"></span>
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
