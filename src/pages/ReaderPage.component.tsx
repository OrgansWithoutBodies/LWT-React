import { useState } from 'react';
import SplitPane from 'react-split-pane';
import { useData } from '../data/useAkita';
import { TextsId } from '../data/validators';
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
  const [{ texts }] = useData(['texts']);

  const [activeWord, setActiveWord] = useState<string | null>();
  const text = texts.find((text) => text.TxID === textId);
  if (!text) {
    return <></>;
  }
  return (
    <>
      <SplitPane split="vertical" minSize={50} defaultSize={'55%'}>
        <SplitPane split="horizontal" minSize={50} defaultSize={'20%'}>
          <Header
            title={`READ ▶ ${text.TxTitle}`}
            readerProps={{ nextTextID: 'Test1', prevTextString: 'test2' }}
          />
          {/* TODO audio */}
          <Reader activeId={textId} setActiveWord={setActiveWord} />
        </SplitPane>
        <SplitPane split="horizontal" minSize={50} defaultSize={'60%'}>
          {activeWord ? (
            <AddNewWord
              word={activeWord}
              langId={text.TxLgID}
              // TODO
              // isEdit={}
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
