import { over } from 'rambdax';
import { WordsID } from '../data/validators';
import { A } from '../nav/InternalLink';
import { APITranslateTerm } from '../plugins/deepl.plugin';
import { Icon } from '../ui-kit/Icon';
import { Language, Text, TextItem, Word } from '../utils/parseMySqlDump';
import { NumericalStrength, getStatusAbbr, getStatusName } from './StrengthMap';
import {
  DictionaryLinks,
  KnownTermLines,
  LanguageDictionaryDataTempHack,
} from './Term/DictionaryLinks';
import { WordKnownTermLines } from './Term/limitedTypes';
import { prepare_textdata_js } from './translateSentence2';

type MW29 = [number, number, number, number, number, number, number, number];
/**
 *
 * @param word
 * @param language
 * @param onEditWord
 * @param setTranslateAPIParams
 * @param setIFrameURL
 */
function onTestWordClick(
  word: Word,
  language: Language,
  onEditWord: (woID: WordsID) => void,
  setTranslateAPIParams: (
    vals: (APITranslateTerm<string, string> & { apiKey: string }) | null
  ) => void,
  setIFrameURL: (url: string | null) => void
) {
  // TODO
  // SOLUTION = <?php echo prepare_textdata_js ( testtype==1 ? ( nosent ? (traLgDict1URIns) : (' [' . trans . '] ')) : save ); ?>;
  const OPENED = 0;
  // TODO
  // WoID = <?php echo WoID; ?>;
  const onClickWord = () =>
    WordClickEventDoTestTest({
      word,
      language,
      data_todo: -1,
      setTranslateAPIParams,
      setIFrameURL,
    });
  const onKeyDown: React.EventHandler<React.KeyboardEvent> = (e) =>
    keydown_event_do_test_test(e, OPENED, word, onEditWord);
  return { onClickWord, onKeyDown };
}

/**
 *
 */
export function cClick() {
  if (olLoaded) {
    runHook('hideObject', FREPLACE, over);
    o3_showingsticky = 0;
  }
  return false;
}
/**
 *
 * @param e
 * @param OPENED
 * @param onEditWord
 */
function keydown_event_do_test_test(
  e: React.KeyboardEvent,
  OPENED: 0 | 1,
  { WoID }: Word,
  onEditWord: (woID: WordsID) => void
) {
  if (e.key === ' ' && OPENED === 0) {
    // space : show sol.
    // TODO
    // $('.word').click();

    cClick();
    // window.parent.frames.ro.location.href =
    `show_word?WoID=${WoID}&ann=`;
    OPENED = 1;
    return false;
  }
  if (OPENED === 0) return true;
  if (e.key === 'ArrowUp') {
    // up : status+1
    // const stchange=1
    return false;
  }
  if (e.key === 'ArrowDown') {
    // down : status-1
    // TODO
    // const stchange=-1;
    return false;
  }
  if (e.key === 'Escape') {
    // esc : dont change status
    // TODO still advance?
    return false;
  }
  for (let i = 1; i <= 5; i++) {
    // TODO
    if (e.which === 48 + i || e.which === 96 + i) {
      // 1,.. : status=i
      // const status=i
      return false;
    }
  }
  if (e.key === 'i') {
    // I : status=98
    // const status=98
    return false;
  }
  if (e.key === 'w') {
    // W : status=99
    // const status=99
    return false;
  }
  if (e.key === 'e') {
    // E : EDIT
    onEditWord(WoID);
    // window.parent.frames.ro.location.href = `edit_tword?WoID=${WoID}`;
    return false;
  }
  return true;
}

/**
 *
 */
function WordClickEventDoTestTest({
  language,
  word,
  data_todo,
  setTranslateAPIParams,
  setIFrameURL,
}: { language: Language; word: WordKnownTermLines } & {
  data_todo: number;
  setTranslateAPIParams: (
    vals: (APITranslateTerm<string, string> & { apiKey: string }) | null
  ) => void;
  setIFrameURL: (url: string | null) => void;
}) {
  <RunOverlibTest
    word={word}
    lang={language}
    todo={data_todo}
    setTranslateAPIParams={setTranslateAPIParams}
    setIFrameURL={setIFrameURL}
  />;
  // TODO
  const SOLUTION = prepare_textdata_js(
    testtype === 1
      ? nosent
        ? word.WoTranslation
        : ` [${word.WoTranslation}] `
      : save
  );
  $('.todo').text(SOLUTION);
  return false;
}

/**
 *
 */
function RunOverlibTest(
  {
    lang,
    word,
    todo,
    setTranslateAPIParams,
    setIFrameURL,
  }: {
    lang: LanguageDictionaryDataTempHack;
    word: WordKnownTermLines;
    todo: number;
    setTranslateAPIParams: (
      vals: (APITranslateTerm<string, string> & { apiKey: string }) | null
    ) => void;
    setIFrameURL: (url: string | null) => void;
  } // oldstat: undefined
) {
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
            <hr noshade size={1} />
            <b>
              {WoStatus >= 1 && WoStatus <= 5 ? (
                <>
                  <MakeOverlibLinkChangeStatusTest
                    WoID={WoID}
                    plusminus="plus"
                    text={
                      <>
                        <Icon src="thumb-up" title="Got it!" /> Got it! [${cc}]
                      </>
                    }
                  />

                  <hr noshade size={1} />
                  <MakeOverlibLinkChangeStatusTest
                    WoID={WoID}
                    plusminus="minus"
                    text={
                      <>
                        <Icon src="thumb" title="Oops!" /> Oops! [${ww}]
                      </>
                    }
                  />
                  <hr noshade size={1} />
                </>
              ) : (
                <></>
              )}
              <MakeOverlibLinkChangeStatusAlltest word={word} />
            </b>
          </center>
          <hr noshade size={1} />
        </>
      ) : (
        <></>
      )}
      <>
        <b>
          <KnownTermLines word={word} tags={[]} />
        </b>
        <br />
      </>

      <A href={`/edit_tword?WoID=${WoID}`} target="ro">
        Edit term
      </A>
      <br />
      <DictionaryLinks
        lang={lang}
        sentenceString={''}
        wordString={word.WoText}
        setTranslateAPIParams={setTranslateAPIParams}
        setIFrameURL={setIFrameURL}
      />
      {/* CAPTION, */}
      {/* 'Got it?' */}
    </>
  );
}
/**
 *
 * @param WoID
 * @param oldstat
 */
export function MakeOverlibLinkChangeStatusAlltest({
  word: { WoID, WoStatus: oldstat },
}: {
  word: Pick<Word, 'WoID' | 'WoStatus'>;
}): JSX.Element {
  return (
    <>
      {[1, 2, 3, 4, 5].map((newstat) => (
        <MakeOverlibLinkChangeStatusTest2
          WoID={WoID}
          oldstat={oldstat}
          newstat={newstat as NumericalStrength}
        />
      ))}
      <MakeOverlibLinkChangeStatusTest2
        WoID={WoID}
        oldstat={oldstat}
        newstat={99}
      />
      <MakeOverlibLinkChangeStatusTest2
        WoID={WoID}
        oldstat={oldstat}
        newstat={98}
      />
    </>
  );
}
/**
 *
 * @param WoID
 * @param oldstat
 * @param newstat
 */
function MakeOverlibLinkChangeStatusTest2({
  WoID: WoID,
  oldstat,
  newstat,
}: {
  WoID: WordsID;
  oldstat: NumericalStrength;
  newstat: NumericalStrength;
}): JSX.Element {
  return oldstat === newstat ? (
    <a href={`set_test_status?WoID=${WoID}&status=${newstat}`} target="ro">
      <span title={getStatusName(newstat)}>[◆]</span>
    </a>
  ) : (
    <a href={`set_test_status?WoID=${WoID}&status=${newstat}`} target="ro">
      <span title={getStatusName(newstat)}>[{getStatusAbbr(newstat)}]</span>
    </a>
  );
}
/**
 *
 * @param s
 */
export function escapeHtmlChars(s: string) {
  return s
    .replace(/&/g, '%AMP%')
    .replace(/</g, '&#060;')
    .replace(/>/g, '&#062;')
    .replace(/"/g, '&#034;')
    .replace(/'/g, '&#039;')
    .replace(/%AMP%/g, '&#038;');
  // .replace(/\x0d/g, <br />);
}

export const makeTooltipTitleString = (obj: TooltipTitleObject) => {
  const nl = '\x0d';
  return [obj.title, obj.romanization, obj.translation, obj.status]
    .filter((val) => val !== undefined)
    .map((val) => '▶' + val)
    .join(nl);
};
type TooltipTitleObject = {
  title?: string;
  romanization?: string;
  translation?: string;
  status?: string;
};
/**
 *
 * @param word
 * @param trans
 * @param roman
 * @param status
 */
export function makeTooltipTitleObj({
  WoText: WoText,
  WoRomanization: WoRomanization,
  WoTranslation: WoTranslation,
  WoStatus: WoStatus,
}: Partial<
  Pick<Word, 'WoStatus' | 'WoText' | 'WoRomanization' | 'WoTranslation'>
>) {
  const tooltipObj: TooltipTitleObject = {
    title: WoText === '' ? undefined : WoText,
    romanization: WoRomanization === '' ? undefined : WoRomanization,
    translation:
      WoTranslation === '' || WoTranslation === '*' ? undefined : WoTranslation,
    status: `${getStatusName(WoStatus)} [${getStatusAbbr(WoStatus)}]`,
  };
  return tooltipObj;
}
/**
 *
 */
export function MakeOverlibLinkChangeStatusTest({
  WoID: WoID,
  plusminus,
  text,
}: {
  WoID: WordsID;
  plusminus: 'plus' | 'minus';
  text: string | JSX.Element;
}) {
  return (
    // TODO onSetStatus?
    <a href={`set_test_status?WoID=${WoID}&stchange=${plusminus}`} target="ro">
      {text}
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
 * @param mw2
 * @param mw3
 * @param mw4
 * @param mw5
 * @param mw6
 * @param mw7
 * @param mw8
 * @param mw9
 * @param rtl
 * @param ann
 */
export function RunOverlibStatus98({
  lang,
  hints,
  TxID,
  TiOrder,
  txt,
  WoID,
  mw29,
  rtl,
  ann,
}: {
  lang: LanguageDictionaryDataTempHack;
  hints: any;
  TxID: Text['TxID'];
  TiOrder: TextItem['TiOrder'];
  txt: any;
  WoID: WordsID;
  mw29: MW29;
  rtl: any;
  ann: any;
}) {
  return overlib(
    <>
      <b> EscapeHtmlChars2(hints, ann) </b>
      <br />
      {MakeOverlibLinkNewWord({
        txid: TxID,
        torder: TiOrder,
        wid: WoID,
      })}{' '}
      | {MakeOverlibLinkDeleteWord({ txid: TxID, wid: WoID })}
      {MakeOverlibLinkNewMultiword({
        txid: TxID,
        torder: TiOrder,
        mw29,
        rtl,
      })}{' '}
      <br />{' '}
      {MakeOverlibLinkWb({
        lang,
        txt,
        TxID,
        TiOrder,
      })}
    </>,
    CAPTION,
    'Word'
  );
}

/**
 *
 * @param title
 * @param ann
 */
function EscapeHtmlChars2(title: any, ann: string) {
  if (ann !== '') {
    const ann2 = EscapeHtmlChars(ann);
    return EscapeHtmlChars(title).replace(
      ann2,
      <span style="color:red"> + ann2 + </span>
    );
  } else return EscapeHtmlChars(title);
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
 * @param mw2
 * @param mw3
 * @param mw4
 * @param mw5
 * @param mw6
 * @param mw7
 * @param mw8
 * @param mw9
 * @param rtl
 * @param ann
 */
export function RunOverlibStatus99({
  lang,
  hints,
  TxID,
  TiOrder,
  txt,
  WoID,
  mw29,
  rtl,
  ann,
}: {
  lang: LanguageDictionaryDataTempHack;
  hints: any;
  TxID: Text['TxID'];
  TiOrder: TextItem['TiOrder'];
  txt: any;
  WoID: WordsID;
  mw29: MW29;
  rtl: any;
  ann: any;
}) {
  return overlib(
    <>
      <b> {EscapeHtmlChars2(hints, ann)} </b>
      <br />{' '}
      {MakeOverlibLinkNewWord({
        txid: TxID,
        torder: TiOrder,
        wid: WoID,
      })}{' '}
      | {MakeOverlibLinkDeleteWord({ txid: TxID, wid: WoID })}{' '}
      {MakeOverlibLinkNewMultiword({
        txid: TxID,
        torder: TiOrder,
        mw29,
        rtl,
      })}{' '}
      <br /> {MakeOverlibLinkWb({ lang, txt, TxID, TiOrder })}
    </>,
    CAPTION,
    'Word'
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
 * @param stat
 * @param mw2
 * @param mw3
 * @param mw4
 * @param mw5
 * @param mw6
 * @param mw7
 * @param mw8
 * @param mw9
 * @param rtl
 * @param ann
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
  rtl,
  ann,
}: {
  lang: LanguageDictionaryDataTempHack;
  hints: any;
  TxID: Text['TxID'];
  TiOrder: TextItem['TiOrder'];
  txt: any;
  WoID: WordsID;
  stat: any;
  mw29: MW29;
  rtl: any;
  ann: any;
}) {
  return overlib(
    <>
      <b> {EscapeHtmlChars2(hints, ann)} </b>
      <br />{' '}
      {MakeOverlibLinkChangeStatusAll({
        TxID,
        TiOrder,
        WoID,
        oldstat: stat,
      })}{' '}
      <br /> {MakeOverlibLinkEditWord(TxID, TiOrder, WoID)} |{' '}
      {MakeOverlibLinkDeleteWord({ txid: TxID, wid: WoID })}{' '}
      {MakeOverlibLinkNewMultiword({
        txid: TxID,
        torder: TiOrder,
        mw29,
        rtl,
      })}{' '}
      <br />{' '}
      {MakeOverlibLinkWb({
        lang,
        txt,
        TxID,
        TiOrder,
      })}
    </>,
    CAPTION,
    MakeOverlibLinkEditWordTitle({
      text: 'Word &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;',
      TxID,
      TiOrder,
      WoID,
    })
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
 * @param mw2
 * @param mw3
 * @param mw4
 * @param mw5
 * @param mw6
 * @param mw7
 * @param mw8
 * @param mw9
 * @param rtl
 */
export function RunOverlibStatusUnknown({
  lang,
  hints,
  TxID,
  TiOrder,
  txt,
  mw29,
  rtl,
}: {
  lang: LanguageDictionaryDataTempHack;
  hints: string;
  TxID: Text['TxID'];
  TiOrder: TextItem['TiOrder'];
  txt: any;
  mw29: MW29;
  rtl: any;
}) {
  return overlib(
    <>
      <b> {escapeHtmlChars(hints)} </b>
      <br /> {MakeOverlibLinkWellknownWord(TxID, TiOrder)} <br />{' '}
      {MakeOverlibLinkIgnoreWord(TxID, TiOrder)}{' '}
      {MakeOverlibLinkNewMultiword({
        txid: TxID,
        torder: TiOrder,
        mw29,
        rtl,
      })}{' '}
      <br />{' '}
      {MakeOverlibLinkWb({
        lang,
        txt,
        TxID,
        TiOrder,
      })}
    </>,
    CAPTION,
    'New Word'
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
 * @param stat
 * @param wcnt
 * @param ann
 */
export function RunOverlibMultiword({
  lang,
  hints,
  TxID,
  TiOrder,
  txt,
  WoID,
  stat,
  wcnt,
  ann,
}: {
  lang: LanguageDictionaryDataTempHack;
  hints: any;
  TxID: Text['TxID'];
  TiOrder: TextItem['TiOrder'];
  txt: any;
  WoID: WordsID;
  stat: any;
  wcnt: string;
  ann: any;
}) {
  return overlib(
    <>
      <b> {EscapeHtmlChars2(hints, ann)} </b>
      <br />{' '}
      {MakeOverlibLinkChangeStatusAll({
        TxID,
        TiOrder,
        WoID,
        oldstat: stat,
      })}{' '}
      <br /> {MakeOverlibLinkEditMultiword({ TxID, TiOrder, WoID })} |{' '}
      {MakeOverlibLinkDeleteMultiword(TxID, WoID)} <br />{' '}
      {MakeOverlibLinkWb({
        lang,
        txt,
        TxID,
        TiOrder,
      })}
    </>,
    CAPTION,
    MakeOverlibLinkEditMultiwordTitle({
      text: wcnt.trim() + '-Word-Expression',
      TxID,
      TiOrder,
      WoID,
    })
  );
}

/**
 *
 * @param TxID
 * @param TiOrder
 * @param WoID
 * @param oldstat
 */
function MakeOverlibLinkChangeStatusAll({
  TxID,
  TiOrder,
  WoID,
  oldstat,
}: {
  TxID: Text['TxID'];
  TiOrder: TextItem['TiOrder'];
  WoID: WordsID;
  oldstat: any;
}) {
  let result = 'St: ';
  for (let newstat = 1; newstat <= 5; newstat++)
    result += MakeOverlibLinkChangeStatus({
      TxID,
      TiOrder,
      WoID,
      oldstat,
      newstat,
    });
  result += MakeOverlibLinkChangeStatus({
    TxID,
    TiOrder,
    WoID,
    oldstat,
    newstat: 99,
  });
  result += MakeOverlibLinkChangeStatus({
    TxID,
    TiOrder,
    WoID,
    oldstat,
    newstat: 98,
  });
  return result;
}

/**
 *
 * @param text
 * @param TxID
 * @param TiOrder
 * @param WoID
 */
function MakeOverlibLinkEditMultiwordTitle({
  text,
  TxID,
  TiOrder,
  WoID,
}: {
  text: string;
  TxID: Text['TxID'];
  TiOrder: TextItem['TiOrder'];
  WoID: WordsID;
}) {
  return (
    <a
      style="color:yellow"
      href={`edit_mword?tid=${TxID}&ord=${TiOrder}&WoID=${WoID}`}
      target="ro"
    >
      {' '}
      text{' '}
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
function MakeOverlibLinkWb({
  lang,
  txt,
  TxID,
  TiOrder,
}: {
  lang: LanguageDictionaryDataTempHack;
  txt: any;
  TxID: Text['TxID'];
  TiOrder: TextItem['TiOrder'];
}) {
  return (
    <>
      {TiOrder < 1 || TxID < 1 ? (
        <></>
      ) : (
        <DictionaryLinks
          lang={lang}
          sentenceString={''}
          wordString={''}
          setTranslateAPIParams={function (
            vals: (APITranslateTerm<string, string> & { apiKey: string }) | null
          ): void {
            throw new Error('Function not implemented.');
          }}
          setIFrameURL={function (url: string | null): void {
            throw new Error('Function not implemented.');
          }}
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
  TxID,
  TiOrder,
  WoID,
  oldstat,
  newstat,
}: {
  TxID: Text['TxID'];
  TiOrder: TextItem['TiOrder'];
  WoID: WordsID;
  oldstat: number | undefined;
  newstat: string | number | undefined;
}) {
  if (oldstat === newstat) {
    return <span title={getStatusName(oldstat)}>◆</span>;
  } else {
    return (
      <a
        href={`set_word_status?tid=${TxID}&ord=${TiOrder}&WoID=${WoID}&status=${newstat}`}
        target="ro"
      >
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
function MakeOverlibLinkEditWordTitle({
  text,
  TxID,
  TiOrder,
  WoID,
}: {
  text: string;
  TxID: Text['TxID'];
  TiOrder: TextItem['TiOrder'];
  WoID: WordsID;
}) {
  return (
    <a
      style="color:yellow"
      href={`edit_word?tid=${TxID}&ord=${TiOrder}&WoID=${WoID}`}
      target="ro"
    >
      ' {text}{' '}
    </a>
  );
}

/**
 *
 * @param TxID
 * @param TiOrder
 * @param WoID
 */
function MakeOverlibLinkEditMultiword({
  TxID,
  TiOrder,
  WoID,
}: {
  TxID: Text['TxID'];
  TiOrder: TextItem['TiOrder'];
  WoID: WordsID;
}) {
  return (
    <a href={`edit_mword?tid=${TxID}&ord=${TiOrder}&WoID=${WoID}`} target="ro">
      Edit term
    </a>
  );
}
/**
 *
 * @param TiOrder
 * @param TxID
 * @param url
 * @param txt
 */
function createSentLookupLink({
  TiOrder,
  TxID,
  url,
  txt,
}: {
  TiOrder: TextItem['TiOrder'];
  TxID: Text['TxID'];
  url: string;
  txt: string;
}) {
  // const url = url.trim();
  // const txt = txt.trim();
  let r = '';
  if (url !== '' && txt !== '') {
    if (url.substr(0, 8) === '*http://' || url.substr(0, 9) === '*https://') {
      r = (
        <span
          class="click"
          onclick={() =>
            owin("owin('trans?x=1&i=" + TiOrder + '&t=' + TxID + "');")
          }
        >
          {txt}
        </span>
      );
    } else if (
      url.substr(0, 7) === 'http://' ||
      url.substr(0, 8) === 'https://'
    ) {
      r = (
        <a href={`trans?x=1&i=${TiOrder}&t=${TxID}`} target="ru">
          {' '}
          txt{' '}
        </a>
      );
    }
  }
  return r;
}

/**
 *
 * @param TxID
 * @param WoID
 */
function MakeOverlibLinkDeleteMultiword(TxID: Text['TxID'], WoID: WordsID) {
  return (
    <a
      onclick="return confirmDelete();"
      href={`delete_mword?WoID=${WoID}&tid=${TxID}`}
      target="ro"
    >
      Delete term
    </a>
  );
}

/**
 *
 * @param txid
 * @param torder
 * @param wid
 */
function MakeOverlibLinkNewWord({
  txid,
  torder,
  wid,
}: {
  txid: string;
  torder: string;
  wid: string;
}) {
  return (
    <a href={`edit_word?tid=${txid}&ord=${torder}&wid=${wid}`} target="ro">
      Learn term
    </a>
  );
}
/**
 *
 * @param txid
 * @param wid
 */
function MakeOverlibLinkDeleteWord({
  txid,
  wid,
}: {
  txid: string;
  wid: string;
}) {
  return (
    <a
      onclick="return confirmDelete();"
      href={`delete_word?wid=${wid}&tid=${txid}`}
      target="ro"
    >
      Delete term
    </a>
  );
}

/**
 *
 * @param txid
 * @param torder
 * @param mw2
 * @param mw3
 * @param mw4
 * @param mw5
 * @param mw6
 * @param mw7
 * @param mw8
 * @param mw9
 * @param rtl
 */
function MakeOverlibLinkNewMultiword({
  txid,
  torder,
  mw29,
  rtl,
}: {
  txid: any;
  torder: any;
  mw2: string;
  mw3: string;
  mw4: string;
  mw5: string;
  mw6: string;
  mw7: string;
  mw8: string;
  mw9: string;
  rtl: any;
}) {
  if (
    mw2 === '' &&
    mw3 === '' &&
    mw4 === '' &&
    mw5 === '' &&
    mw6 === '' &&
    mw7 === '' &&
    mw8 === '' &&
    mw9 === ''
  )
    return '';
  if (rtl)
    return (
      <>
        <br />
        Expr: '{' '}
        {mw9 !== ''
          ? MakeOverlibLinkCreateEditMultiwordRtl({
              len: 9,
              txid,
              torder,
              txt: mw9,
            }) + ' '
          : ''}{' '}
        {mw8 !== ''
          ? MakeOverlibLinkCreateEditMultiwordRtl({
              len: 8,
              txid,
              torder,
              txt: mw8,
            }) + ' '
          : ''}{' '}
        {mw7 !== ''
          ? MakeOverlibLinkCreateEditMultiwordRtl({
              len: 7,
              txid,
              torder,
              txt: mw7,
            }) + ' '
          : ''}{' '}
        {mw6 !== ''
          ? MakeOverlibLinkCreateEditMultiwordRtl({
              len: 6,
              txid,
              torder,
              txt: mw6,
            }) + ' '
          : ''}{' '}
        {mw5 !== ''
          ? MakeOverlibLinkCreateEditMultiwordRtl({
              len: 5,
              txid,
              torder,
              txt: mw5,
            }) + ' '
          : ''}{' '}
        {mw4 !== ''
          ? MakeOverlibLinkCreateEditMultiwordRtl({
              len: 4,
              txid,
              torder,
              txt: mw4,
            }) + ' '
          : ''}{' '}
        {mw3 !== ''
          ? MakeOverlibLinkCreateEditMultiwordRtl({
              len: 3,
              txid,
              torder,
              txt: mw3,
            }) + ' '
          : ''}{' '}
        {mw2 !== ''
          ? MakeOverlibLinkCreateEditMultiwordRtl({
              len: 2,
              txid,
              torder,
              txt: mw2,
            })
          : ''}
      </>
    );
  else
    return (
      <>
        <br />
        Expr: '{' '}
        {mw2 !== ''
          ? MakeOverlibLinkCreateEditMultiword({
              len: 2,
              txid,
              torder,
              txt: mw2,
            }) + ' '
          : ''}{' '}
        {mw3 !== ''
          ? MakeOverlibLinkCreateEditMultiword({
              len: 3,
              txid,
              torder,
              txt: mw3,
            }) + ' '
          : ''}{' '}
        {mw4 !== ''
          ? MakeOverlibLinkCreateEditMultiword({
              len: 4,
              txid,
              torder,
              txt: mw4,
            }) + ' '
          : ''}{' '}
        {mw5 !== ''
          ? MakeOverlibLinkCreateEditMultiword({
              len: 5,
              txid,
              torder,
              txt: mw5,
            }) + ' '
          : ''}{' '}
        {mw6 !== ''
          ? MakeOverlibLinkCreateEditMultiword({
              len: 6,
              txid,
              torder,
              txt: mw6,
            }) + ' '
          : ''}{' '}
        {mw7 !== ''
          ? MakeOverlibLinkCreateEditMultiword({
              len: 7,
              txid,
              torder,
              txt: mw7,
            }) + ' '
          : ''}{' '}
        {mw8 !== ''
          ? MakeOverlibLinkCreateEditMultiword({
              len: 8,
              txid,
              torder,
              txt: mw8,
            }) + ' '
          : ''}{' '}
        {mw9 !== ''
          ? MakeOverlibLinkCreateEditMultiword({
              len: 9,
              txid,
              torder,
              txt: mw9,
            })
          : ''}
      </>
    );
}

/**
 *
 * @param len
 * @param txid
 * @param torder
 * @param txt
 */
function MakeOverlibLinkCreateEditMultiword({
  len,
  txid,
  torder,
  txt,
}: {
  len: string | number;
  txid: string;
  torder: string;
  txt: string;
}) {
  return (
    <a href={`edit_mword?tid=${txid}&ord=${torder}&txt=${txt}`} target="ro">
      {' '}
      len '..' escape_html_chars(txt.substr(-2).trim()){' '}
    </a>
  );
}

/**
 *
 * @param len
 * @param txid
 * @param torder
 * @param txt
 */
function MakeOverlibLinkCreateEditMultiwordRtl({
  len,
  txid,
  torder,
  txt,
}: {
  len: string | number;
  txid: string;
  torder: string;
  txt: string;
}) {
  return (
    <a
      dir="rtl"
      href={`edit_mword?tid=${txid}&ord=${torder}&txt=${txt}`}
      target="ro"
    >
      {' '}
      len '..' escape_html_chars(txt.substr(-2).trim()){' '}
    </a>
  );
}
