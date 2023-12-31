import {
  Language,
  Sentence,
  Text,
  TextItem,
  TextsID,
  Word,
  getStatusAbbr,
  getStatusName,
} from 'lwt-schemas';
import { useData } from 'lwt-state';
import { useSettingWithDefault } from 'lwt-ui-kit';
import { APITranslateTerm } from '../plugins/deepl.plugin';
import { prepare_textdata_js } from '../utils/windowFunctions';
import {
  EditWordParams,
  RunOverlibMultiword,
  RunOverlibStatus1To5,
  RunOverlibStatus98,
  RunOverlibStatus99,
  RunOverlibStatusUnknown,
  RunTestForWord,
} from './OverlibComponents';
import { get_position_from_id } from './Reader/ReaderPage.component';
import { LanguageDictionaryDataTempHack } from './Term/DictionaryLinks';
import { WordKnownTermLines } from './limitedTypes';

type ArrV8<T> = [T, T, T, T, T, T, T, T];
export type ArrV10<T = number> = [T, T, T, T, T, T, T, T, T, T];
export type MW29 = ArrV8<string | undefined>;
/**
 *
 * @param word
 * @param language
 * @param onEditWord
 * @param setTranslateAPIParams
 * @param setIFrameURL
 */
export function onTestWordClick(
  word: Word,
  language: Language,
  onEditWord: WordIDHandler,
  onShowWord: WordIDHandler,
  setTranslateAPIParams: (
    vals: (APITranslateTerm<string, string> & { apiKey: string }) | null
  ) => void,
  setIFrameURL: (url: string | null) => void,
  onSetTodoText: (val: string) => void,
  onSetTestStatus: SetTestStatus,
  onNudgeTestStatus: NudgeTestStatus,
  sentence: Pick<Sentence, 'SeID'>,
  modality?: Modalities
) {
  // TODO
  // SOLUTION = <?php echo prepare_textdata_js ( testtype==1 ? ( nosent ? (traLgDict1URIns) : (' [' . trans . '] ')) : save ); ?>;
  const OPENED = 0;
  // TODO
  // WoID = <?php echo WoID; ?>;
  const onClickWord = () =>
    WordClickEventDoTestTest({
      onSetTodoText,
      word,
      language,
      todo: -1,
      sentence,
      setTranslateAPIParams,
      setIFrameURL,
      modality,
      onSetTestStatus,
    });
  const onKeyDown: React.EventHandler<React.KeyboardEvent> = (e) =>
    onTestKeydown(
      e,
      OPENED,
      word,
      onEditWord,
      onNudgeTestStatus,
      onSetTestStatus,
      onShowWord
    );
  return { onClickWord, onKeyDown };
}

// TODO does this do anything
export function cClick() {
  // if (olLoaded) {
  //   runHook('hideObject', FREPLACE, over);
  //   o3_showingsticky = 0;
  // }
  // return false;
}
type SetTestStatus = (
  args: Pick<Word, 'WoID' | 'WoStatus'>
  //  & { plusminus: 'plus' | 'minus' }
) => void;
type NudgeTestStatus = (
  args: Pick<Word, 'WoID'> & { plusminus: 'plus' | 'minus' }
) => void;

type WordIDHandler = (args: Pick<Word, 'WoID'>) => void;

/**
 *
 * @param e
 * @param OPENED
 * @param onEditWord
 * @param onNudgeTestStatus
 * @param onSetTestStatus
 * @param onShowWord
 */
function onTestKeydown(
  e: React.KeyboardEvent,
  OPENED: 0 | 1,
  { WoID }: Word,
  onEditWord: WordIDHandler,
  onNudgeTestStatus: NudgeTestStatus,
  onSetTestStatus: SetTestStatus,
  onShowWord: WordIDHandler
) {
  if (e.key === ' ' && OPENED === 0) {
    // space : show sol.
    // TODO
    // $('.word').click();

    cClick();
    // window.parent.frames.ro.location.href =
    // `show_word?WoID=${WoID}&ann=`;
    onShowWord({ WoID });
    // TODO setOPENED
    OPENED = 1;
    return false;
  }
  if (OPENED === 0) return true;
  if (e.key === 'ArrowUp') {
    // up : status+1
    onNudgeTestStatus({ WoID, plusminus: 'plus' });
    return false;
  }
  if (e.key === 'ArrowDown') {
    // down : status-1
    onNudgeTestStatus({ WoID, plusminus: 'minus' });
    return false;
  }
  if (e.key === 'Escape') {
    // esc : dont change status
    // TODO still advance?
    return false;
  }
  ([1, 2, 3, 4, 5] as const).map((i) => {
    // TODO account for numpad diff?
    if (Number.parseInt(e.key) === i) {
      // 1,.. : status=i
      // TODO dont need to specify WoID every time bring into parent call
      onSetTestStatus({
        WoID,
        WoStatus: i,
      });
      return false;
    }
  });
  if (e.key === 'i') {
    // I : status=98
    onSetTestStatus({
      WoID,
      WoStatus: 98,
    });
    return false;
  }
  if (e.key === 'w') {
    // W : status=99
    onSetTestStatus({
      WoID,
      WoStatus: 99,
    });
    return false;
  }
  if (e.key === 'e') {
    // E : EDIT
    onEditWord({ WoID });
    return false;
  }
  return true;
}

type Modalities = 1 | 2 | 3 | 4 | 5;
// TODO null means table?
// type Modalities =null| 1 | 2 | 3 | 4 | 5;

function WordClickEventDoTestTest({
  language,
  word: { WoTextLC: WoTextLC, ...word },
  todo,
  setTranslateAPIParams,
  setIFrameURL,
  sentence: { SeID: SeID },
  onSetTestStatus,
  modality: modality = 1,
  onSetTodoText,
}: {
  language: Language;
  word: WordKnownTermLines & Pick<Word, 'WoTextLC'>;
  sentence: Pick<Sentence, 'SeID'>;
} & {
  modality?: Modalities;
  todo: number;
  setTranslateAPIParams: (
    vals: (APITranslateTerm<string, string> & { apiKey: string }) | null
  ) => void;
  onSetTodoText: (todo: string) => void;
  setIFrameURL: (url: string | null) => void;
  onSetTestStatus: SetTestStatus;
}) {
  const { ['set-test-sentence-count']: testSentenceCount } =
    useSettingWithDefault(['set-test-sentence-count']);

  if (false) {
    return (
      // TODO shouldnt return components
      <RunTestForWord
        word={word}
        lang={language}
        todo={todo}
        setTranslateAPIParams={setTranslateAPIParams}
        setIFrameURL={setIFrameURL}
        onNudgeTestStatus={onSetTestStatus}
      />
    );
  }
  const usingTestType =
    modality > 3
      ? Math.max(1, Math.min(5, modality)) - 3
      : Math.max(1, Math.min(5, modality));
  // TODO this is a terrible pattern - just basically using symmetry of
  // ...L2... ...L1... ...**... | L2 L1
  // Where last two elements are just first two elements but in a sentence
  const nosent = modality > 3 ? 1 : 0;

  const sent = getSentence(SeID, WoTextLC, testSentenceCount);
  let save = '';
  let on = 0;
  let c = '';
  // for i in sent
  for (let i = 0; i < sent.length; i++) {
    c = sent.substring(i, 1);
    on = c == '{' ? 1 : 0;
    save = c !== '}' && c == '{' && on ? c : '';
  }
  const SOLUTION = prepare_textdata_js(
    usingTestType === 1
      ? nosent
        ? word.WoTranslation
        : ` [${word.WoTranslation}] `
      : save
  );
  onSetTodoText(SOLUTION);

  return false;
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
 * @param title
 * @param ann
 */
export function EscapeHtmlChars2(title: string, ann: string) {
  // This is if one translation is marked as selected in annotation
  if (ann !== '') {
    const ann2 = escapeHtmlChars(ann);
    return escapeHtmlChars(title).replace(
      ann2,
      // TODO shouldnt return components
      <span style={{ color: 'red' }}>{ann2}</span>
    );
  } else return escapeHtmlChars(title);
}
/**
 *
 * @param e
 */
export function onTextKeydown(
  e: KeyboardEvent,
  {
    text: { TxID },
    textItem: { TiOrder: TiOrder },
    word: { WoID: WoID },
    onSetWordStatus,
    onSetEditWord,
    onSetShowingWord,
    ann: ann,
    onSetAudioPosition,
    ADDFILTER,
    onSetKWordMarked,
    onSetUWordMarked,
  }: {
    ann: string;
    text: Pick<Text, 'TxID'>;
    textItem: Pick<TextItem, 'TiOrder'>;
    word: Pick<Word, 'WoID'>;
    onSetWordStatus: (params: EditWordParams & Pick<Word, 'WoStatus'>) => void;
    onSetEditWord: (params: EditWordParams) => void;
    onSetAudioPosition: (params: number) => void;
    onSetShowingWord: (params: Pick<Word, 'WoID'> & { ann: string }) => void;
    onSetKWordMarked: (val: boolean) => void;
    onSetUWordMarked: (val: boolean) => void;
    ADDFILTER: number;
  }
) {
  let TEXTPOS = -1;

  if (e.key === 'Escape') {
    // esc = reset all
    TEXTPOS = -1;
    // TODO
    // onEscape()
    onSetKWordMarked(false);
    onSetUWordMarked(false);
    cClick();
    return false;
  }

  if (e.key === 'Return') {
    // return = edit next unknown word
    // TODO
    // onReturn()
    onSetUWordMarked(false);
    const unknownwordlist = $('span.status0.word:not(.hide):first');
    if (unknownwordlist.size() === 0) return false;
    window.scrollTo({ axis: 'y', offset: -150 });
    onSetUWordMarked(true);
    // TODO .click()
    cClick();
    return false;
  }

  // TODO whats this for
  const knownwordlist = $(
    'span.word:not(.hide):not(.status0)' +
      ADDFILTER +
      ',span.mword:not(.hide)' +
      ADDFILTER
  );
  const l_knownwordlist = knownwordlist.size();
  // console.log(knownwordlist);
  if (l_knownwordlist === 0) return true;
  const usingAnn = ann !== undefined ? ann : '';

  // the following only for a non-zero known words list
  if (e.which === 36) {
    // home : known word navigation -> first
    onSetKWordMarked(false);
    TEXTPOS = 0;
    curr = knownwordlist.eq(TEXTPOS);
    onSetKWordMarked(true);
    window.scrollTo(curr, { axis: 'y', offset: -150 });
    onSetShowingWord({ WoID, ann: encodeURIComponent(usingAnn) });
    return false;
  }
  if (e.which === 35) {
    // end : known word navigation -> last
    onSetKWordMarked(false);
    TEXTPOS = l_knownwordlist - 1;
    curr = knownwordlist.eq(TEXTPOS);
    // TODO only curr
    onSetKWordMarked(true);
    window.scrollTo(curr, { axis: 'y', offset: -150 });
    let ann = '';
    onSetShowingWord({ WoID, ann: encodeURIComponent(usingAnn) });

    return false;
  }
  if (e.key === 'LeftArrow') {
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
    onSetKWordMarked(true);
    // TODO scrollTo
    window.scrollTo(curr, { axis: 'y', offset: -150 });
    onSetShowingWord({ WoID, ann: encodeURIComponent(usingAnn) });
    return false;
  }
  if (e.key === ' ' || e.key === 'RightArrow') {
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
    onSetKWordMarked(true);

    window.scrollTo(curr, { axis: 'y', offset: -150 });
    onSetShowingWord({ WoID, ann: encodeURIComponent(usingAnn) });

    return false;
  }

  if (TEXTPOS < 0 || TEXTPOS >= l_knownwordlist) {
    return true;
  }
  let curr = knownwordlist.eq(TEXTPOS);

  // the following only with valid pos.
  for (let i = 1; i <= 5; i++) {
    // TODO
    if (e.which === 48 + i || e.which === 96 + i) {
      // 1,.. : status=i
      onSetWordStatus({
        WoID,
        TxID,
        TiOrder,
        WoStatus: i as 1 | 2 | 3 | 4 | 5,
      });
      return false;
    }
  }
  if (e.key === 'I') {
    // I : status=98
    onSetWordStatus({ WoID, TxID, TiOrder, WoStatus: 98 });
    return false;
  }
  if (e.key === 'W') {
    // W : status=99
    onSetWordStatus({ WoID, TxID, TiOrder, WoStatus: 99 });
    return false;
  }
  if (e.key === 'A') {
    // A : set audio pos.
    let p = pos;
    const t = parseInt($('#totalcharcount').text(), 10);
    if (t === 0) return true;
    p = (100 * (p - 5)) / t;
    if (p < 0) {
      p = 0;
    }
    onSetAudioPosition(p);
    return false;
  }
  if (e.key === 'E') {
    //  E : EDIT
    if (curr.has('.mword'))
      // is multiword TODO make sure no difference
      onSetEditWord({ WoID, TxID, TiOrder });
    else {
      onSetEditWord({ WoID, TxID, TiOrder });
    }
    return false;
  }

  return true;
}

export function MwordClickEventDoTextText({
  word: { WoStatus: status, WoID: wid },
  langDictData: langDictData,
  textItem: { TiOrder: TiOrder, TiText: text, TiWordCount: code },
  ann = '',
  mw,
  TxID,
  title,
}: {
  word: Pick<Word, 'WoStatus' | 'WoID'>;
  langDictData: LanguageDictionaryDataTempHack;
  textItem: Pick<TextItem, 'TiOrder' | 'TiText' | 'TiWordCount'>;
  TxID: TextsID;
  ann?: string;
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
  title: string;
}) {
  if (status !== undefined) {
    <RunOverlibMultiword
      langDictData={langDictData}
      TxID={TxID}
      ann={ann}
      TiOrder={TiOrder}
      hints={title}
      txt={text}
      WoID={wid}
      WoStatus={status}
      wcnt={code}
      onSetEditingWord={() => {
        // TODO
      }}
      onSetDeleteMultiWord={() => {
        // TODO
      }}
      onSetWordStatus={() => {
        // TODO
      }}
      setTranslateAPIParams={() => {
        // TODO
      }}
      setIFrameURL={() => {
        // TODO
      }}
    />;
  }
  return false;
}

export function WordClickEventDoTextText({
  word: { WoStatus: WoStatus, WoID: WoID },
  language: { LgRightToLeft: LgRightToLeft, ...lang },
  textItem: { TiOrder },
  ann,
  mw,
  TxID,
  title,
  setIFrameURL,
  onSetNewWord,
  setTranslateAPIParams,
  onSetEditingWord,
  onDeleteWord,
  onInsertIgnoreWord,
  onSetWordStatus,
  onSetEditingNewWord,
}: {
  word: Pick<Word, 'WoStatus' | 'WoID'>;
  language: LanguageDictionaryDataTempHack & Pick<Language, 'LgRightToLeft'>;
  textItem: Pick<TextItem, 'TiOrder'>;
  TxID: TextsID;
  ann?: string;
  mw: ArrV10;
  title: string;
  setIFrameURL: (url: string | null) => void;
  onDeleteWord: (args: Pick<Word, 'WoID'>) => void;
  setTranslateAPIParams: (
    vals: (APITranslateTerm<string, string> & { apiKey: string }) | null
  ) => void;
  onSetNewWord: (
    params: Pick<Text, 'TxID'> & Pick<TextItem, 'TiOrder'> & { txt: string }
  ) => void;
  onInsertIgnoreWord: (
    args: Pick<Text, 'TxID'> & Pick<TextItem, 'TiOrder'>
  ) => void;
  onSetWordStatus: (params: EditWordParams & Pick<Word, 'WoStatus'>) => void;
  onSetEditingNewWord: (
    params: Pick<EditWordParams, 'TiOrder' | 'TxID'> & { txt: string }
  ) => void;
  onSetEditingWord: (
    params: Pick<EditWordParams, 'TxID' | 'TiOrder'> &
      Partial<Pick<EditWordParams, 'WoID'>>
  ) => void;
}) {
  // TODO
  const usingAnn = ann !== undefined ? ann : '';
  const mw29 = mw.slice(2, 9) as MW29;
  const text = 'TODO';
  if (WoStatus < 1) {
    <RunOverlibStatusUnknown
      lang={lang}
      hints={title}
      TxID={TxID}
      TiOrder={TiOrder}
      txt={text}
      mw29={mw29}
      LgRightToLeft={LgRightToLeft}
      setTranslateAPIParams={setTranslateAPIParams}
      setIFrameURL={setIFrameURL}
      onInsertIgnoreWord={onInsertIgnoreWord}
      onSetNewWord={onSetNewWord}
    />;
    onSetEditingWord({ TxID, TiOrder });
  } else if (WoStatus === 99)
    <RunOverlibStatus99
      lang={lang}
      hints={title}
      TxID={TxID}
      TiOrder={TiOrder}
      txt={text}
      WoID={WoID}
      mw29={mw29}
      onSetEditingWord={onSetEditingWord}
      onDeleteWord={() => onDeleteWord({ WoID })}
      LgRightToLeft={LgRightToLeft}
      ann={usingAnn}
      setIFrameURL={setIFrameURL}
      setTranslateAPIParams={setTranslateAPIParams}
      onSetNewWord={onSetNewWord}
    />;
  else if (WoStatus === 98)
    <RunOverlibStatus98
      lang={lang}
      hints={title}
      TxID={TxID}
      TiOrder={TiOrder}
      txt={text}
      WoID={WoID}
      onSetEditingWord={onSetEditingWord}
      mw29={mw29}
      onDeleteWord={() => onDeleteWord({ WoID })}
      LgRightToLeft={LgRightToLeft}
      ann={usingAnn}
      setTranslateAPIParams={setTranslateAPIParams}
      setIFrameURL={setIFrameURL}
      onSetNewWord={onSetNewWord}
    />;
  else
    <RunOverlibStatus1To5
      lang={lang}
      hints={title}
      TxID={TxID}
      TiOrder={TiOrder}
      txt={text}
      WoID={WoID}
      stat={WoStatus}
      mw29={mw29}
      onSetEditingNewWord={onSetEditingNewWord}
      onSetWordStatus={onSetWordStatus}
      LgRightToLeft={LgRightToLeft}
      setIFrameURL={setIFrameURL}
      setTranslateAPIParams={setTranslateAPIParams}
      ann={usingAnn}
      onSetEditingWord={onSetEditingWord}
      onDeleteWord={() => onDeleteWord({ WoID })}
    />;
  return false;
}
/**
 *
 * @param i
 * @param word
 * @param annArray
 * @param setDataAnn
 * @param setTitle
 */

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
} // function annotation_to_json(ann) {
//   if (ann === '') return '{}';
//   arr = array();
//   items = preg_split('/[\n]/u', ann);
//   arr = items.map((item) => {
//     vals = preg_split('/[\t]/u', item);
//     if (count(vals) > 3 && vals[0] >= 0 && vals[2] > 0) {
//       arr[vals[0] - 1] = array(vals[1], vals[2], vals[3]);
//     }
//   });
//   return json_encode(arr);
// }
/**
 *
 * @param i
 * @param word
 * @param annArray
 * @param setTitle
 * @param setAnnotation
 */

/**
 *
 * @param word
 * @param annArray
 * @param setTitle
 * @param setAnnotation
 */
export function WordEachDoTextText(
  word: Pick<
    Word,
    'WoText' | 'WoTranslation' | 'WoRomanization' | 'WoStatus'
  > & { WoID?: Word['WoID'] },
  { TiOrder: TiOrder }: Pick<TextItem, 'TiOrder'>,
  annArray: string[],
  setTitle: (val: string) => void,
  setAnnotation: (val: string) => void
) {
  setTitle(makeTooltipTitleString(makeTooltipTitleObj(word)));
  const wid = word.WoID;
  if (wid !== undefined) {
    const order = TiOrder;
    if (order in annArray) {
      if (wid === annArray[order][1]) {
        setAnnotation(annArray[order][2]);
      }
    }
  }
}

export function WordDblclickEventDoTextText({
  totalcharcount,
  pos,
  onSetAudioPosition: onSetAudioPosition,
}: {
  totalcharcount: number;
  pos: number;
  onSetAudioPosition: (val: number) => void;
}) {
  const t = totalcharcount;
  if (t === 0) {
    return;
  }
  const p = Math.max(0, (100 * (pos - 5)) / t);
  onSetAudioPosition(p);
}
function getSentence(SeID: Sentence['SeID'], wordlc: Word['WoTextLC'], mode) {
  // global tbpref;
  const [{ sentences, textitems }] = useData(['sentences', 'textitems']);
  const sentence = sentences.find((val) => val.SeID === SeID);
  if (!sentence) {
    throw new Error('Invalid Sentence ID!');
  }
  const seidlist = [sentence.SeID];
  if (mode > 1) {
    const prevseid = sentences
      .filter(
        (val) =>
          val.SeID < SeID &&
          val.SeTxID === sentence.SeTxID &&
          !['¶', ''].includes(val.SeText.trim())
      )
      // TODO check sort direction
      .sort((a, b) => (a.SeID > b.SeID ? 1 : -1))[0];
    if (prevseid) {
      seidlist.push(prevseid.SeID);
    }
    if (mode > 2) {
      const nextseid = sentences
        .filter(
          (val) =>
            val.SeID > SeID &&
            val.SeTxID === sentence.SeTxID &&
            !['¶', ''].includes(val.SeText.trim())
        )
        // TODO check sort direction
        .sort((a, b) => (a.SeID > b.SeID ? -1 : 1))[0];
      if (nextseid) {
        seidlist.push(nextseid.SeID);
      }
    }
  }
  const record2 = textitems
    .filter(
      (val) => seidlist.includes(val.TiSeID) && val.TiTxID === sentence.SeTxID
    )
    .sort((a, b) => (a.TiOrder > b.TiOrder ? 1 : -1))
    .sort((a, b) => (a.TiWordCount > b.TiWordCount ? -1 : 1));

  let sejs = '';
  let se = '';
  let notfound = 1;
  let jump = 0;
  record2.forEach((val) => {
    if (val['TiIsNotWord'] == 1) {
      jump--;
    }
    if (jump < 0) {
      sejs = `${sejs}${val['TiText']}`;
      se = `${se}${val['TiText']}`;
    } else {
      if (jump - 1 < 0) {
        if (notfound) {
          if (val['TiTextLC'] == wordlc) {
            sejs += '{';
            se += '<b>';
            sejs += val['TiText'];
            // se += tohtml(val['TiText']);
            se += val['TiText'];
            sejs += '}';
            se += '</b>';
            notfound = 0;
            jump = (val['TiWordCount'] - 1) * 2;
          }
        }
        if (val['TiWordCount'] == 1) {
          if (notfound) {
            sejs += val['TiText'];
            // se += tohtml(val['TiText']);
            se += val['TiText'];
            jump = 0;
          } else {
            notfound = 1;
          }
        }
      } else {
        if (val['TiWordCount'] == 1) jump--;
      }
    }
  });
  // }
  return [se, sejs];
  // [0]=html, word in bold
  // [1]=text, word in {}
}
