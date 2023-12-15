import { over } from 'rambdax';
import { WordsId } from '../data/validators';
import { A } from '../nav/InternalLink';
import { Icon } from '../ui-kit/Icon';
import { Language, Word } from '../utils/parseMySqlDump';
import { NumericalStrength, getStatusAbbr, getStatusName } from './StrengthMap';
import { DictionaryLinks, KnownTermLines } from './Term/DictionaryLinks';
import {
  LanguageDictionaryData,
  WordKnownTermLines,
} from './Term/limitedTypes';
import { prepare_textdata_js } from './translateSentence2';

/**
 *
 * @param word
 * @param language
 * @param onEditWord
 */
function onTestWordClick(
  word: Word,
  language: Language,
  onEditWord: (woID: WordsId) => void
) {
  // TODO
  // SOLUTION = <?php echo prepare_textdata_js ( testtype==1 ? ( nosent ? (trawBlink1ns) : (' [' . trans . '] ')) : save ); ?>;
  const OPENED = 0;
  // TODO
  // WoID = <?php echo wid; ?>;
  const onClickWord = () =>
    word_click_event_do_test_test({ word, language, data_todo: -1 });
  const onKeyDown: React.EventHandler<React.KeyboardEvent> = (e) =>
    keydown_event_do_test_test(e, OPENED, word, onEditWord);
  return { onClickWord, onKeyDown };
}

function cClick() {
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
  onEditWord: (woID: WordsId) => void
) {
  if (e.key === ' ' && OPENED === 0) {
    // space : show sol.
    // TODO
    // $('.word').click();

    cClick();
    // window.parent.frames.ro.location.href =
    `show_word?wid=${WoID}&ann=`;
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
    // window.parent.frames.ro.location.href = `edit_tword?wid=${WoID}`;
    return false;
  }
  return true;
}

function word_click_event_do_test_test({
  language,
  word,
  data_todo,
}: { language: Language; word: WordKnownTermLines } & {
  data_todo: number;
}) {
  <RunOverlibTest word={word} lang={language} todo={data_todo} />;
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

function RunOverlibTest(
  {
    lang,
    word,
    todo,
  }: {
    lang: LanguageDictionaryData;
    word: WordKnownTermLines;
    todo: number;
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

      <A href={`/edit_tword?wid=${WoID}`} target="ro">
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
 * @param wid
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
 * @param wid
 * @param oldstat
 * @param newstat
 */
function MakeOverlibLinkChangeStatusTest2({
  WoID: WoID,
  oldstat,
  newstat,
}: {
  WoID: WordsId;
  oldstat: NumericalStrength;
  newstat: NumericalStrength;
}): JSX.Element {
  return oldstat === newstat ? (
    <a href={`set_test_status?wid=${WoID}&status=${newstat}`} target="ro">
      <span title={getStatusName(newstat)}>[◆]</span>
    </a>
  ) : (
    <a href={`set_test_status?wid=${WoID}&status=${newstat}`} target="ro">
      <span title={getStatusName(newstat)}>[{getStatusAbbr(newstat)}]</span>
    </a>
  );
}
/**
 *
 * @param s
 */
export function escape_html_chars(s: string) {
  return s
    .replace(/&/g, '%AMP%')
    .replace(/</g, '&#060;')
    .replace(/>/g, '&#062;')
    .replace(/"/g, '&#034;')
    .replace(/'/g, '&#039;')
    .replace(/%AMP%/g, '&#038;')
    .replace(/\x0d/g, '<br />');
}
/**
 *
 * @param word
 * @param trans
 * @param roman
 * @param status
 */
export function makeTooltipTitle({
  WoText: WoText,
  WoRomanization: WoRomanization,
  WoTranslation: WoTranslation,
  WoStatus: WoStatus,
}: Word) {
  const nl = '\x0d';
  let title = WoText;
  if (title !== '') {
    title = '▶ ' + title;
  }
  if (WoRomanization !== '' && WoRomanization !== undefined) {
    if (title !== '') {
      title += nl;
    }
    title += `▶ ${WoRomanization}`;
  }
  if (WoTranslation !== '' && WoTranslation !== '*') {
    if (title !== '') {
      title += nl;
    }
    title += `▶ ${WoTranslation}`;
  }
  if (title !== '') {
    title += nl;
  }
  title += `▶ ${getStatusName(WoStatus)} [${getStatusAbbr(WoStatus)}]`;
  return title;
}
export function MakeOverlibLinkChangeStatusTest({
  WoID: WoID,
  plusminus,
  text,
}: {
  WoID: WordsId;
  plusminus: 'plus' | 'minus';
  text: string | JSX.Element;
}) {
  return (
    <a href={`set_test_status?wid=${WoID}&stchange=${plusminus}`} target="ro">
      {text}
    </a>
  );
}
