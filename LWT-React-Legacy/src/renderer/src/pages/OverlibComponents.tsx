import { confirmDelete, getDirTag } from 'lwt-common';
import { APITranslateTerm } from 'lwt-plugins';
import {
  Language,
  NumericalStrength,
  Text,
  TextItem,
  Word,
  WordsID,
  getStatusAbbr,
  getStatusName,
} from 'lwt-schemas';
import { A, Icon, useI18N } from 'lwt-ui-kit';
import {
  DictionaryLinks,
  KnownTermLines,
  LanguageDictionaryDataTempHack,
} from './Term/DictionaryLinks';
import { WordKnownTermLines } from './limitedTypes';
import {
  EscapeHtmlChars2,
  MW29,
  escapeHtmlChars,
} from './readerTesterEventHandlers';

/**
 *
 * @param LgDict1URI
 * @param LgDict2URI
 * @param LgGoogleTranslateURI
 * @param hints
 * @param TxID
 * @param TiOrder
 * @param txt
 * @param WoID
 * @param mw29
 * @param LgRightToLeft
 * @param ann
 */

/**
 *
 */
export function RunOverlibStatus99({
  lang,
  hints,
  TxID,
  TiOrder,
  txt,
  WoID,
  mw29,
  LgRightToLeft: LgRightToLeft,
  ann,
  onSetEditingWord,
  onDeleteWord,
  setTranslateAPIParams,
  setIFrameURL,
  onSetNewWord,
}: Pick<TextItem, 'TiOrder'> &
  Pick<Word, 'WoID'> &
  Pick<Language, 'LgRightToLeft'> &
  Pick<Text, 'TxID'> & {
    lang: LanguageDictionaryDataTempHack;
    hints: string;
    txt: any;
    WoID: WordsID;
    mw29: MW29;
    ann: any;
    onSetEditingWord: (params: EditWordParams) => void;
    onDeleteWord: (params: Pick<EditWordParams, 'TxID' | 'WoID'>) => void;

    setTranslateAPIParams: (
      vals: (APITranslateTerm<string, string> & { apiKey: string }) | null
    ) => void;
    setIFrameURL: (url: string | null) => void;
    onSetNewWord: (
      params: Pick<Text, 'TxID'> & Pick<TextItem, 'TiOrder'> & { txt: string }
    ) => void;
  }) {
  return (
    <>
      <b> {EscapeHtmlChars2(hints, ann)} </b>
      <br />{' '}
      {
        <MakeOverlibLinkNewWord
          onSetEditingWord={() =>
            onSetEditingWord({
              TxID,
              TiOrder,
              WoID,
            })
          }
        />
      }{' '}
      |{' '}
      {
        <MakeOverlibLinkDeleteWord
          onDeleteWord={() => onDeleteWord({ TxID, WoID })}
        />
      }{' '}
      {
        <MakeOverlibLinkNewMultiword
          TxID={TxID}
          TiOrder={TiOrder}
          mw29={mw29}
          onSetNewWordWithText={({ txt }) =>
            onSetNewWord({ txt, TxID, TiOrder })
          }
          LgRightToLeft={LgRightToLeft}
        />
      }{' '}
      <br />{' '}
      {
        <MakeOverlibLinkWb
          sentenceString="TODO"
          langDictData={lang}
          wordString={txt}
          TxID={TxID}
          TiOrder={TiOrder}
          setTranslateAPIParams={setTranslateAPIParams}
          setIFrameURL={setIFrameURL}
        />
      }
    </>
  );
  // CAPTION,
  // 'Word'
}
/**
 *
 * @param LgDict1URI
 * @param LgDict2URI
 * @param LgGoogleTranslateURI
 * @param hints
 * @param TxID
 * @param TiOrder
 * @param txt
 * @param WoID
 * @param stat
 * @param mw29
 * @param LgRightToLeft
 * @param ann
 */

/**
 *
 */
export function RunOverlibStatus1To5({
  lang,
  hints,
  TxID,
  TiOrder,
  txt,
  WoID,
  stat,
  mw29,
  LgRightToLeft: LgRightToLeft,
  ann,
  onDeleteWord,
  onSetEditingWord,
  onSetEditingNewWord,
  onSetWordStatus,
  setTranslateAPIParams,
  setIFrameURL,
}: EditWordParams &
  Pick<Language, 'LgRightToLeft'> & {
    onSetEditingWord: (params: EditWordParams) => void;
    onSetWordStatus: (params: EditWordParams & Pick<Word, 'WoStatus'>) => void;
    onSetEditingNewWord: (
      params: Pick<EditWordParams, 'TiOrder' | 'TxID'> & { txt: string }
    ) => void;
    onDeleteWord: (params: Pick<EditWordParams, 'TxID' | 'WoID'>) => void;
    setTranslateAPIParams: (
      vals: (APITranslateTerm<string, string> & { apiKey: string }) | null
    ) => void;
    setIFrameURL: (url: string | null) => void;
    lang: LanguageDictionaryDataTempHack;
    hints: string;
    txt: string;
    stat: Word['WoStatus'];
    mw29: MW29;
    ann: any;
  }) {
  const defaultOnSetEditWord = () => onSetEditingWord({ TxID, TiOrder, WoID });
  return (
    <>
      <b> {EscapeHtmlChars2(hints, ann)} </b>
      <br />{' '}
      {
        <MakeOverlibLinkChangeStatusAll
          onSetWordStatus={({ WoStatus: settingStatus }) =>
            onSetWordStatus({ WoStatus: settingStatus, TxID, TiOrder, WoID })
          }
          oldstat={stat}
        />
      }{' '}
      <br />{' '}
      {<MakeOverlibLinkEditWord onSetEditingWord={defaultOnSetEditWord} />} |{' '}
      {
        <MakeOverlibLinkDeleteWord
          onDeleteWord={() => onDeleteWord({ TxID, WoID })}
        />
      }{' '}
      {
        <MakeOverlibLinkNewMultiword
          TxID={TxID}
          TiOrder={TiOrder}
          mw29={mw29}
          LgRightToLeft={LgRightToLeft}
          onSetNewWordWithText={({ txt }) =>
            onSetEditingNewWord({ txt, TxID, TiOrder })
          }
        />
      }{' '}
      <br />{' '}
      {
        <MakeOverlibLinkWb
          sentenceString="TODO"
          langDictData={lang}
          wordString={txt}
          TxID={TxID}
          TiOrder={TiOrder}
          setTranslateAPIParams={setTranslateAPIParams}
          setIFrameURL={setIFrameURL}
        />
      }
    </>
  );
  // CAPTION,
  // MakeOverlibLinkEditWordTitle({
  //   onSetEditingWord: defaultOnSetEditWord,
  //   text: 'Word &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;',
  // })
}
/**
 *
 * @param LgDict1URI
 * @param LgDict2URI
 * @param LgGoogleTranslateURI
 * @param hints
 * @param TxID
 * @param TiOrder
 * @param txt
 * @param mw29
 * @param LgRightToLeft
 */

/**
 *
 */
export function RunOverlibStatusUnknown({
  lang,
  hints,
  TxID,
  TiOrder,
  txt,
  mw29,
  LgRightToLeft: LgRightToLeft,
  setTranslateAPIParams,
  setIFrameURL,
  onSetNewWord,
  onInsertIgnoreWord,
}: Pick<Language, 'LgRightToLeft'> &
  Pick<Text, 'TxID'> &
  Pick<TextItem, 'TiOrder'> & {
    lang: LanguageDictionaryDataTempHack;
    mw29: MW29;
    hints: string;
    txt: any;
    setTranslateAPIParams: (
      vals: (APITranslateTerm<string, string> & { apiKey: string }) | null
    ) => void;
    setIFrameURL: (url: string | null) => void;
    onInsertIgnoreWord: (
      args: Pick<Text, 'TxID'> & Pick<TextItem, 'TiOrder'>
    ) => void;
    onSetNewWord: (
      params: Pick<Text, 'TxID'> & Pick<TextItem, 'TiOrder'> & { txt: string }
    ) => void;
  }) {
  return (
    <>
      <b> {escapeHtmlChars(hints)} </b>
      <br /> <MakeOverlibLinkWellknownWord TxID={TxID} TiOrder={TiOrder} />{' '}
      <br />{' '}
      {
        <MakeOverlibLinkIgnoreWord
          onInsertIgnoreWord={() => onInsertIgnoreWord({ TxID, TiOrder })}
        />
      }{' '}
      <MakeOverlibLinkNewMultiword
        TxID={TxID}
        TiOrder={TiOrder}
        mw29={mw29}
        LgRightToLeft={LgRightToLeft}
        onSetNewWordWithText={({ txt: newText }) =>
          onSetNewWord({ txt: newText, TxID, TiOrder })
        }
      />{' '}
      <br />{' '}
      <MakeOverlibLinkWb
        sentenceString="TODO"
        langDictData={lang}
        wordString={txt}
        TxID={TxID}
        TiOrder={TiOrder}
        setTranslateAPIParams={setTranslateAPIParams}
        setIFrameURL={setIFrameURL}
      />
    </>
  );
  // TODO
  // CAPTION,
  // 'New Word'
}
/**
 *
 * @param LgDict1URI
 * @param LgDict2URI
 * @param LgGoogleTranslateURI
 * @param hints
 * @param TxID
 * @param TiOrder
 * @param txt
 * @param WoID
 * @param stat
 * @param wcnt
 * @param ann
 */

/**
 *
 */
export function RunOverlibMultiword({
  langDictData: langDictData,
  hints,
  TxID,
  TiOrder,
  txt,
  WoID,
  WoStatus: WoStatus,
  // TODO
  // wcnt,
  onSetDeleteMultiWord,
  onSetEditingWord,
  onSetWordStatus,
  ann,
  setTranslateAPIParams,
  setIFrameURL,
}: Pick<Word, 'WoStatus'> &
  EditWordParams & {
    langDictData: LanguageDictionaryDataTempHack;
    hints: string;
    txt: string;

    wcnt: number;
    onSetDeleteMultiWord: (
      params: Pick<EditWordParams, 'WoID' | 'TxID'>
    ) => void;
    onSetWordStatus: (args: Pick<Word, 'WoStatus' | 'WoID'>) => void;

    onSetEditingWord: (params: EditWordParams) => void;

    setTranslateAPIParams: (
      vals: (APITranslateTerm<string, string> & { apiKey: string }) | null
    ) => void;
    setIFrameURL: (url: string | null) => void;
    ann: string;
  }) {
  return (
    <>
      <b> {EscapeHtmlChars2(hints, ann)} </b>
      <br />{' '}
      <MakeOverlibLinkChangeStatusAll
        oldstat={WoStatus}
        onSetWordStatus={({ WoStatus: settingStatus }) =>
          onSetWordStatus({ WoStatus: settingStatus, WoID })
        }
      />{' '}
      <br />
      <MakeOverlibLinkEditWord
        onSetEditingWord={() => onSetEditingWord({ TxID, WoID, TiOrder })}
      />
      |{' '}
      <MakeOverlibLinkDeleteMultiword
        onSetDeleteMultiWord={() =>
          onSetDeleteMultiWord({
            TxID,
            WoID,
          })
        }
      />{' '}
      <br />{' '}
      <MakeOverlibLinkWb
        sentenceString="TODO"
        langDictData={langDictData}
        wordString={txt}
        TxID={TxID}
        TiOrder={TiOrder}
        setTranslateAPIParams={setTranslateAPIParams}
        setIFrameURL={setIFrameURL}
      />
    </>
  );
  // TODO
  // CAPTION,
  // <MakeOverlibLinkEditWordTitle
  //   text={`${wcnt}-Word-Expression`}
  //   onSetEditingWord={() => onSetEditingWord({ TxID, TiOrder, WoID })}
  // />
}
/**
 *
 * @param TxID
 * @param TiOrder
 * @param WoID
 * @param oldstat
 */
function MakeOverlibLinkChangeStatusAll({
  oldstat,
  onSetWordStatus,
}: {
  oldstat: Word['WoStatus'];
  onSetWordStatus: (args: Pick<Word, 'WoStatus'>) => void;
}) {
  return (
    <>
      {([1, 2, 3, 4, 5, 99, 98] as const).map((newstat) => (
        <MakeOverlibLinkChangeStatus
          oldstat={oldstat}
          newstat={newstat}
          onSetWordStatus={() => onSetWordStatus({ WoStatus: newstat })}
        />
      ))}
    </>
  );
}
/**
 *
 * @param text
 * @param TxID
 * @param TiOrder
 * @param WoID
 */
export function MakeOverlibLinkEditMultiwordTitle({
  text,
  TxID,
  TiOrder,
  WoID,
  onEditWord,
}: EditWordParams & {
  text: string;
  onEditWord: (params: EditWordParams) => void;
}) {
  return (
    <a
      style={{ color: 'yellow' }}
      onClick={() => onEditWord({ TxID, TiOrder, WoID })}
      href={`edit_mword?tid=${TxID}&ord=${TiOrder}&WoID=${WoID}`}
      target="ro"
    >
      {text}
    </a>
  );
}
/**
 *
 * @param LgDict1URI
 * @param LgDict2URI
 * @param LgGoogleTranslateURI
 * @param txt
 * @param TxID
 * @param TiOrder
 */
export function MakeOverlibLinkWb({
  langDictData: langDictData,
  wordString: wordString,
  TxID,
  TiOrder,
  setTranslateAPIParams,
  setIFrameURL,
  sentenceString,
}: {
  langDictData: LanguageDictionaryDataTempHack;
  wordString: string;
  sentenceString: string;
  TxID: Text['TxID'];
  TiOrder: TextItem['TiOrder'];
  setTranslateAPIParams: (
    vals: (APITranslateTerm<string, string> & { apiKey: string }) | null
  ) => void;
  setIFrameURL: (url: string | null) => void;
}) {
  return (
    <>
      {TiOrder < 1 || TxID < 1 ? (
        <></>
      ) : (
        <DictionaryLinks
          langDictData={langDictData}
          sentenceString={sentenceString}
          wordString={wordString}
          // TODO bring these into single param since theyre coupled so tight
          setTranslateAPIParams={setTranslateAPIParams}
          setIFrameURL={setIFrameURL}
        />
      )}
    </>
  );
}
/**
 *
 * @param TxID
 * @param TiOrder
 * @param WoID
 * @param oldstat
 * @param newstat
 */
function MakeOverlibLinkChangeStatus({
  oldstat,
  newstat,
  onSetWordStatus,
}: {
  oldstat: Word['WoStatus'];
  newstat: Word['WoStatus'];
  onSetWordStatus: () => void;
}) {
  if (oldstat === newstat) {
    return <span title={getStatusName(oldstat)}>◆</span>;
  } else {
    return (
      <a onClick={() => onSetWordStatus()} target="ro">
        <span title={getStatusName(newstat)}>[{getStatusAbbr(newstat)}]</span>
      </a>
    );
  }
}
/**
 *
 * @param text
 * @param TxID
 * @param TiOrder
 * @param WoID
 */
export function MakeOverlibLinkEditWordTitle({
  text,
  onSetEditingWord: onSetEditingWord,
}: {
  onSetEditingWord: () => void;
  text: string;
}) {
  return (
    <a
      style={{ color: 'yellow' }}
      onClick={() => onSetEditingWord()}
      target="ro"
    >
      {text}
    </a>
  );
}
/**
 *
 * @param TxID
 * @param TiOrder
 * @param WoID
 */
function MakeOverlibLinkEditWord({
  onSetEditingWord: onSetEditingWord,
}: {
  onSetEditingWord: () => void;
}) {
  return (
    <a onClick={() => onSetEditingWord()} target="ro">
      Edit term
    </a>
  );
}
/**
 *
 * @param TxID
 * @param WoID
 */
function MakeOverlibLinkDeleteMultiword({
  onSetDeleteMultiWord,
}: {
  onSetDeleteMultiWord: () => void;
}) {
  return (
    <a
      onClick={() => {
        if (confirmDelete()) {
          onSetDeleteMultiWord();
        }
      }}
      // onclick="return confirmDelete();"
      target="ro"
    >
      Delete term
    </a>
  );
}

export type EditWordParams = Pick<Word, 'WoID'> &
  Pick<TextItem, 'TiOrder'> &
  Pick<Text, 'TxID'>;
/**
 *
 * @param TxID
 * @param TiOrder
 * @param WoID
 */
export function MakeOverlibLinkNewWord({
  onSetEditingWord,
}: {
  onSetEditingWord: () => void;
}) {
  return (
    <a onClick={() => onSetEditingWord()} target="ro">
      Learn term
    </a>
  );
}
/**
 *
 * @param TxID
 * @param WoID
 * TODO dedupe with DeleteMultiWord
 */
export function MakeOverlibLinkDeleteWord({
  onDeleteWord,
}: {
  onDeleteWord: () => void;
}) {
  return (
    <a onClick={() => confirmDelete() && onDeleteWord()} target="ro">
      Delete term
    </a>
  );
}
/**
 *
 * @param TxID
 * @param TiOrder
 * @param mw29
 * @param LgRightToLeft
 */
export function MakeOverlibLinkNewMultiword({
  TxID,
  TiOrder,
  mw29,
  LgRightToLeft: LgRightToLeft,
  onSetNewWordWithText: onSetNewWordWithText,
}: Pick<TextItem, 'TiOrder'> &
  Pick<Text, 'TxID'> &
  Pick<Language, 'LgRightToLeft'> & {
    mw29: MW29;
    onSetNewWordWithText: (params: { txt: string }) => void;
  }) {
  if (
    mw29[0] === undefined &&
    mw29[1] === undefined &&
    mw29[2] === undefined &&
    mw29[3] === undefined &&
    mw29[4] === undefined &&
    mw29[5] === undefined &&
    mw29[6] === undefined &&
    mw29[7] === undefined
  ) {
    return <></>;
  }
  return (
    <>
      <br />
      Expr: '{' '}
      {/* TODO dedupe this - each textItem is only ever a given wordcount */}
      {mw29[7] !== undefined
        ? (
            <MakeOverlibLinkCreateEditMultiword
              len={9}
              onSetNewWord={() => {
                // TODO dedupe specifying txt twice here by pulling down into function?
                onSetNewWordWithText({ txt: mw29[7]! });
              }}
              txt={mw29[7]}
              LgRightToLeft={LgRightToLeft}
              TxID={TxID}
              TiOrder={TiOrder}
            />
          ) + ' '
        : ''}{' '}
      {mw29[6] !== undefined ? (
        <MakeOverlibLinkCreateEditMultiword
          len={8}
          TxID={TxID}
          TiOrder={TiOrder}
          onSetNewWord={() => {
            onSetNewWordWithText({ txt: mw29[6]! });
          }}
          txt={mw29[6]}
          LgRightToLeft={LgRightToLeft}
        />
      ) : (
        ''
      )}{' '}
      {mw29[5] !== undefined ? (
        <MakeOverlibLinkCreateEditMultiword
          len={7}
          TxID={TxID}
          TiOrder={TiOrder}
          onSetNewWord={() => {
            onSetNewWordWithText({ txt: mw29[5]! });
          }}
          txt={mw29[5]}
          LgRightToLeft={LgRightToLeft}
        />
      ) : (
        ''
      )}{' '}
      {mw29[4] !== undefined ? (
        <MakeOverlibLinkCreateEditMultiword
          len={6}
          TxID={TxID}
          TiOrder={TiOrder}
          onSetNewWord={() => {
            onSetNewWordWithText({ txt: mw29[4]! });
          }}
          txt={mw29[4]}
          LgRightToLeft={LgRightToLeft}
        />
      ) : (
        ''
      )}{' '}
      {mw29[3] !== undefined ? (
        <MakeOverlibLinkCreateEditMultiword
          len={5}
          TxID={TxID}
          TiOrder={TiOrder}
          onSetNewWord={() => {
            onSetNewWordWithText({ txt: mw29[3]! });
          }}
          txt={mw29[3]}
          LgRightToLeft={LgRightToLeft}
        />
      ) : (
        ''
      )}{' '}
      {mw29[2] !== undefined ? (
        <MakeOverlibLinkCreateEditMultiword
          len={4}
          TxID={TxID}
          TiOrder={TiOrder}
          onSetNewWord={() => {
            onSetNewWordWithText({ txt: mw29[2]! });
          }}
          txt={mw29[2]}
          LgRightToLeft={LgRightToLeft}
        />
      ) : (
        ''
      )}{' '}
      {mw29[1] !== undefined ? (
        <MakeOverlibLinkCreateEditMultiword
          len={3}
          TxID={TxID}
          TiOrder={TiOrder}
          onSetNewWord={() => {
            onSetNewWordWithText({ txt: mw29[1]! });
          }}
          txt={mw29[1]}
          LgRightToLeft={LgRightToLeft}
        />
      ) : (
        ''
      )}{' '}
      {mw29[0] !== undefined ? (
        <MakeOverlibLinkCreateEditMultiword
          len={2}
          TxID={TxID}
          TiOrder={TiOrder}
          onSetNewWord={() => {
            onSetNewWordWithText({ txt: mw29[0]! });
          }}
          txt={mw29[0]}
          LgRightToLeft={LgRightToLeft}
        />
      ) : (
        ''
      )}
    </>
  );
}
/**
 *
 * @param len
 * @param TxID
 * @param TiOrder
 * @param txt
 */
function MakeOverlibLinkCreateEditMultiword({
  len,
  txt,
  onSetNewWord,
  LgRightToLeft = 0,
}: Partial<Pick<Language, 'LgRightToLeft'>> & {
  len: number;
  TxID: Text['TxID'];
  TiOrder: TextItem['TiOrder'];
  txt: string;
  onSetNewWord: () => void;
}) {
  return (
    <a
      {...getDirTag({ LgRightToLeft })}
      onClick={() => onSetNewWord()}
      target="ro"
    >
      {' '}
      {len}..{escapeHtmlChars(txt.substr(-2).trim())}{' '}
    </a>
  );
}
/**
 * TODO dedupe with UnknownTermLines
 */
function MakeOverlibLinkWellknownWord({
  TxID: txid,
  TiOrder: torder,
}: Pick<Text, 'TxID'> & Pick<TextItem, 'TiOrder'>) {
  return (
    <a href={`insert_word_wellknown.php?tid=${txid}&ord=${torder}`} target="ro">
      I know this term well
    </a>
  );
}
/**
 *
 * @param txid
 * @param torder
 */
function MakeOverlibLinkIgnoreWord({
  onInsertIgnoreWord,
}: {
  onInsertIgnoreWord: () => void;
}) {
  return (
    <a onClick={() => onInsertIgnoreWord()} target="ro">
      Ignore this term
    </a>
  );
}
/**
 *
 * @param LgDict1URI
 * @param LgDict2URI
 * @param LgGoogleTranslateURI
 * @param hints
 * @param TxID
 * @param TiOrder
 * @param txt
 * @param WoID
 * @param mw29
 * @param LgRightToLeft
 * @param ann
 */

/**
 *
 */
export function RunOverlibStatus98({
  lang,
  hints,
  TxID,
  TiOrder,
  txt,
  WoID,
  mw29,
  LgRightToLeft,
  ann,
  setTranslateAPIParams,
  setIFrameURL,
  onSetNewWord,
  onSetEditingWord,
  // TODO
  // onSetTestStatus,
  onDeleteWord,
}: EditWordParams &
  Pick<Language, 'LgRightToLeft'> & {
    lang: LanguageDictionaryDataTempHack;
    hints: string;
    txt: string;
    mw29: MW29;

    ann: string;
    setTranslateAPIParams: (
      vals: (APITranslateTerm<string, string> & { apiKey: string }) | null
    ) => void;
    onSetNewWord: (
      params: Pick<Text, 'TxID'> & Pick<TextItem, 'TiOrder'> & { txt: string }
    ) => void;
    setIFrameURL: (url: string | null) => void;
    onSetEditingWord: (params: EditWordParams) => void;
    onDeleteWord: (params: Pick<EditWordParams, 'TxID' | 'WoID'>) => void;
    onSetTestStatus: (args: {
      WoID: WordsID;
      plusminus: 'plus' | 'minus';
    }) => void;
  }) {
  return (
    <>
      <b> {EscapeHtmlChars2(hints, ann)} </b>
      <br />
      {
        <MakeOverlibLinkNewWord
          onSetEditingWord={() =>
            onSetEditingWord({
              TxID,
              TiOrder,
              WoID,
            })
          }
        />
      }{' '}
      |{' '}
      {
        <MakeOverlibLinkDeleteWord
          onDeleteWord={() => onDeleteWord({ TxID, WoID })}
        />
      }
      {
        <MakeOverlibLinkNewMultiword
          TxID={TxID}
          TiOrder={TiOrder}
          mw29={mw29}
          LgRightToLeft={LgRightToLeft}
          onSetNewWordWithText={({ txt }) =>
            onSetNewWord({ txt, TxID, TiOrder })
          }
        />
      }{' '}
      <br />{' '}
      {
        <MakeOverlibLinkWb
          sentenceString="TODO"
          langDictData={lang}
          wordString={txt}
          TxID={TxID}
          TiOrder={TiOrder}
          setTranslateAPIParams={setTranslateAPIParams}
          setIFrameURL={setIFrameURL}
        />
      }
    </>
  );
  // TODO
  // CAPTION,
  // 'Word'
}

/**
 *
 */
export function MakeOverlibLinkChangeStatusTest({
  onSetTestStatus,
  children,
}: React.PropsWithChildren<{
  onSetTestStatus: () => void;
}>) {
  return (
    <a onClick={() => onSetTestStatus()} target="ro">
      {children}
    </a>
  );
}
/**
 *
 * @param WoID
 * @param oldstat
 * @param newstat
 */
export function MakeOverlibLinkChangeStatusTest2({
  WoID,
  oldstat,
  newstat,
  onSetTestStatus,
}: {
  WoID: WordsID;
  oldstat: NumericalStrength;
  newstat: NumericalStrength;
  onSetTestStatus: (args: Pick<Word, 'WoID' | 'WoStatus'>) => void;
}): JSX.Element {
  return oldstat === newstat ? (
    <a
      href={`set_test_status?WoID=${WoID}&status=${newstat}`}
      onClick={() => onSetTestStatus({ WoID, WoStatus: newstat })}
      target="ro"
    >
      <span title={getStatusName(newstat)}>[◆]</span>
    </a>
  ) : (
    <a
      href={`set_test_status?WoID=${WoID}&status=${newstat}`}
      onClick={() => onSetTestStatus({ WoID, WoStatus: newstat })}
      target="ro"
    >
      <span title={getStatusName(newstat)}>[{getStatusAbbr(newstat)}]</span>
    </a>
  );
}
/**
 *
 * @param WoID
 * @param oldstat
 */
export function MakeOverlibLinkChangeStatusAlltest({
  onSetTestStatus,
  word: { WoID, WoStatus: oldstat },
}: {
  word: Pick<Word, 'WoID' | 'WoStatus'>;
  onSetTestStatus: (args: Pick<Word, 'WoStatus'>) => void;
}): JSX.Element {
  return (
    <>
      {([1, 2, 3, 4, 5, 99, 98] as const).map((newstat) => (
        <MakeOverlibLinkChangeStatusTest2
          WoID={WoID}
          oldstat={oldstat}
          newstat={newstat}
          onSetTestStatus={() => onSetTestStatus({ WoStatus: newstat })}
        />
      ))}
    </>
  );
}

/**
 *
 */
export function RunTestForWord(
  {
    lang,
    word,
    todo,
    setTranslateAPIParams,
    setIFrameURL,
    onSetTestStatus,
    onNudgeTestStatus,
  }: {
    lang: LanguageDictionaryDataTempHack;
    word: WordKnownTermLines;
    todo: number;
    setTranslateAPIParams: (
      vals: (APITranslateTerm<string, string> & { apiKey: string }) | null
    ) => void;
    setIFrameURL: (url: string | null) => void;
    onSetTestStatus: (args: Pick<Word, 'WoID' | 'WoStatus'>) => void;

    onNudgeTestStatus: (args: {
      WoID: WordsID;
      plusminus: 'plus' | 'minus';
    }) => void;
  } // oldstat: undefined
) {
  const t = useI18N();
  const { WoStatus, WoID } = word;
  const c = Math.min(5, WoStatus + 1);
  const w = Math.max(1, WoStatus - 1);
  const cc = c === WoStatus ? `${c}` : `${WoStatus} ▶ ${c}`;
  const ww = w === WoStatus ? `${w}` : `${WoStatus} ▶ ${w}`;
  if (!word) {
    throw new Error('Invalid WordID');
  }
  return (
    <>
      {todo === 1 ? (
        <>
          <center>
            {/* TODO size here */}
            <hr className="noshade" />
            <b>
              {WoStatus >= 1 && WoStatus <= 5 ? (
                <>
                  <MakeOverlibLinkChangeStatusTest
                    onSetTestStatus={() =>
                      onNudgeTestStatus({ WoID, plusminus: 'plus' })
                    }
                  >
                    <>
                      <Icon src="thumb-up" title="Got it!" /> {t('Got it!')} [
                      {cc}]
                    </>
                  </MakeOverlibLinkChangeStatusTest>
                  <hr className="noshade" />
                  <MakeOverlibLinkChangeStatusTest
                    onSetTestStatus={() =>
                      onNudgeTestStatus({ WoID, plusminus: 'minus' })
                    }
                  >
                    <>
                      <Icon src="thumb" title="Oops!" /> {t('Oops!')} [{ww}]
                    </>
                  </MakeOverlibLinkChangeStatusTest>
                  <hr className="noshade" />
                </>
              ) : (
                <></>
              )}
              <MakeOverlibLinkChangeStatusAlltest
                onSetTestStatus={({ WoStatus: settingStatus }) =>
                  onSetTestStatus({ WoID, WoStatus: settingStatus })
                }
                word={word}
              />
            </b>
          </center>
          <hr className="noshade" />
        </>
      ) : (
        <></>
      )}
      <>
        <b>
          {/* TODO */}
          {/* <b>{escape_html_chars(makeTooltipTitle(text, trans, roman, stat))}</b> */}

          <KnownTermLines word={word} tags={[]} />
        </b>
        <br />
      </>
      {/* TODO onEdit */}

      <A href={`/edit_tword?WoID=${WoID}`} target="ro">
        Edit term
      </A>
      <br />
      <DictionaryLinks
        langDictData={lang}
        sentenceString={''}
        wordString={word.WoText}
        setTranslateAPIParams={setTranslateAPIParams}
        setIFrameURL={setIFrameURL}
        breakSent
      />
      {/* CAPTION, */}
      {/* 'Got it?' */}
    </>
  );
}
