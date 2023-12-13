import { over } from 'rambdax';
import { WordsId } from '../data/validators';
import { A } from '../nav/InternalLink';
import { Icon } from '../ui-kit/Icon';
import { Language, Word } from '../utils/parseMySqlDump';
import {
  CreateTheDictLink,
  MakeOverlibLinkChangeStatusTest,
} from './ReaderPage.component';
import { NumericalStrength, getStatusAbbr, getStatusName } from './StrengthMap';
import { prepare_textdata_js } from './translateSentence2';

/**
 *
 * @param word
 * @param language
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
  const onClickWord = () => word_click_event_do_test_test(language);
  const onKeyDown: React.EventHandler<KeyboardEvent> = (e) =>
    keydown_event_do_test_test(e, OPENED, word, onEditWord);
  return { onClickWord, onKeyDown };
}
enum KeyStatus {
  'SPACE' = 32,
  'ESC' = 27,
  'UP' = 38,
  'DOWN' = 40,
  'E' = 69,
  'I' = 73,
  'W' = 87,
  // TODO
  // '' = 48,
  // '' = 96,
}

/**
 *
 */
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
 */
function keydown_event_do_test_test(
  e: KeyboardEvent,
  OPENED: 0 | 1,
  { WoID }: Word,
  onEditWord: (woID: WordsId) => void
) {
  // TODO update 'which' pattern
  if (e.which === 32 && OPENED === 0) {
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
  if (e.which === 38) {
    // up : status+1
    // const stchange=1
    return false;
  }
  if (e.which === 40) {
    // down : status-1
    // TODO
    // const stchange=-1;
    return false;
  }
  if (e.which === 27) {
    // esc : dont change status
    // TODO still advance?
    return false;
  }
  for (let i = 1; i <= 5; i++) {
    if (e.which === 48 + i || e.which === 96 + i) {
      // 1,.. : status=i
      // const status=i
      return false;
    }
  }
  if (e.which === 73) {
    // I : status=98
    // const status=98
    return false;
  }
  if (e.which === 87) {
    // W : status=99
    // const status=99
    return false;
  }
  if (e.which === 69) {
    // E : EDIT
    onEditWord(WoID);
    // window.parent.frames.ro.location.href = `edit_tword?wid=${WoID}`;
    return false;
  }
  return true;
}

/**
 *
 */
function word_click_event_do_test_test({
  LgDict1URI: wBlink1,
  LgDict2URI: wBlink2,
  LgGoogleTranslateURI: wBlink3,
  data_wid,
  data_text,
  data_trans,
  data_rom,
  data_status,
  data_sent,
  data_todo,
}: Language & {
  data_wid: string;
  data_text: string;
  data_trans: string;
  data_rom: string;
  data_status: NumericalStrength;
  data_sent: string;
  data_todo: string;
}) {
  <RunOverlibTest
    wBlink1={wBlink1}
    wBlink2={wBlink2}
    wBlink3={wBlink3}
    data_wid={data_wid}
    data_text={data_text}
    data_trans={data_trans}
    data_rom={data_rom}
    data_status={data_status}
    data_sent={data_sent}
    data_todo={data_todo}
  />;
  // TODO
  const SOLUTION = prepare_textdata_js(
    $testtype === 1 ? ($nosent ? $trans : ` [${trans}] `) : $save
  );
  $('.todo').text(SOLUTION);
  return false;
}
/**
 *
 * @param wBlink1
 * @param wBlink2
 * @param wBlink3
 * @param wid
 * @param txt
 * @param trans
 * @param roman
 * @param stat
 * @param sent
 * @param todo
 */
function RunOverlibTest(
  {
    wBlink1,
    wBlink2,
    wBlink3,
    wid,
    txt,
    trans,
    roman,
    stat,
    sent,
    todo,
  }: {
    wBlink1: string;
    wBlink2: string;
    wBlink3: string;
    wid: number;
    txt: string;
    trans: string;
    roman: string;
    stat: NumericalStrength;
    sent: string;
    todo: number;
  } // oldstat: undefined
) {
  let c = stat + 1;
  if (c > 5) c = 5;
  let w = stat - 1;
  if (w < 1) w = 1;
  let cc = `${stat} ▶ ${c}`;
  if (c === stat) cc = c;
  let ww = `${stat} ▶ ${w}`;
  if (w === stat) ww = w;
  return (
    <>
      {todo === 1 ? (
        <>
          <center>
            <hr noshade size={1} />
            <b>
              {stat >= 1 && stat <= 5 ? (
                <>
                  <MakeOverlibLinkChangeStatusTest
                    wid={wid}
                    stat={1}
                    txt={
                      <>
                        <Icon src="thumb-up" title="Got it!" /> Got it! [${cc}]
                      </>
                    }
                  />

                  <hr noshade size={1} />
                  <MakeOverlibLinkChangeStatusTest
                    wid={wid}
                    stat={-1}
                    txt={
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
              <MakeOverlibLinkChangeStatusAlltest wid stat />
            </b>
          </center>
          <hr noshade size={1} />
        </>
      ) : (
        <></>
      )}
      <>
        <b>{escape_html_chars(make_tooltip(txt, trans, roman, stat))}</b>
        <br />
      </>

      <A href={`/edit_tword?wid=${wid}`} target="ro">
        Edit term
      </A>
      <br />
      <CreateTheDictLink u={wBlink1} w={txt} t={'Dict1'} b={'Lookup Term: '} />
      <CreateTheDictLink u={wBlink2} w={txt} t={'Dict2'} b={''} />
      <CreateTheDictLink u={wBlink3} w={txt} t={'GTr'} b={''} />
      <CreateTheDictLink
        u={wBlink3}
        w={sent}
        t={'GTr'}
        b={'<br />Lookup Sentence:'}
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
export function MakeOverlibLinkChangeStatusAlltest(
  wid: string,
  oldstat: NumericalStrength
): JSX.Element {
  return (
    <>
      {[1, 2, 3, 4, 5].map((newstat) => (
        <MakeOverlibLinkChangeStatusTest2
          wid={wid}
          oldstat={oldstat}
          newstat={newstat as NumericalStrength}
        />
      ))}
      <MakeOverlibLinkChangeStatusTest2
        wid={wid}
        oldstat={oldstat}
        newstat={99}
      />
      <MakeOverlibLinkChangeStatusTest2
        wid={wid}
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
  wid,
  oldstat,
  newstat,
}: {
  wid: string;
  oldstat: NumericalStrength;
  newstat: NumericalStrength;
}): JSX.Element {
  return oldstat === newstat ? (
    <a href={`set_test_status?wid=${wid}&status=${newstat}`} target="ro">
      <span title={getStatusName(newstat)}>[◆]</span>
    </a>
  ) : (
    <a href={`set_test_status?wid=${wid}&status=${newstat}`} target="ro">
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
export function make_tooltip(
  word: string,
  trans: string,
  roman: string | undefined,
  status: NumericalStrength
) {
  const nl = '\x0d';
  let title = word;
  if (title !== '') title = '▶ ' + title;
  if (roman !== '' && roman !== undefined) {
    if (title !== '') title += nl;
    title += `▶ ${roman}`;
  }
  if (trans !== '' && trans !== '*') {
    if (title !== '') title += nl;
    title += `▶ ${trans}`;
  }
  if (title !== '') title += nl;
  title += `▶ ${getStatusName(status)} [${getStatusAbbr(status)}]`;
  return title;
}
