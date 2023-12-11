import { over } from 'rambdax';
import { Language, Word } from '../data/parseMySqlDump';
import { A } from '../nav/InternalLink';
import { Icon } from '../ui-kit/Icon';
import { NumericalStrength } from './AddNewTermTooltip';
import {
  CreateTheDictLink,
  MakeOverlibLinkChangeStatusTest,
} from './ReaderPage.component';
import { StrengthMapNumericalKey } from './StrengthMap';
import { prepare_textdata_js } from './translateSentence2';

/**
 *
 * @param word
 * @param language
 */
export function onWordClick(word: Word, language: Language) {
  // TODO
  // SOLUTION = <?php echo prepare_textdata_js ( testtype==1 ? ( nosent ? (trawBlink1ns) : (' [' . trans . '] ')) : save ); ?>;
  const OPENED = 0;
  // TODO
  // WoID = <?php echo wid; ?>;
  const onClickWord = () => word_click_event_do_test_test(language);
  const onKeyDown = (e) => keydown_event_do_test_test(e, OPENED, word);
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
  { WoID }: Word
) {
  // TODO update 'which' pattern
  if (e.which == 32 && OPENED == 0) {
    // space : show sol.
    $('.word').click();

    cClick();
    window.parent.frames.ro.location.href = `show_word?wid=${$('.word').attr(
      'data_wid'
    )}&ann=`;
    OPENED = 1;
    return false;
  }
  if (OPENED == 0) return true;
  if (e.which == 38) {
    // up : status+1
    window.parent.frames.ro.location.href = `set_test_status?wid=${WoID}&stchange=1`;
    return false;
  }
  if (e.which == 40) {
    // down : status-1
    window.parent.frames.ro.location.href = `set_test_status?wid=${WoID}&stchange=-1`;
    return false;
  }
  if (e.which == 27) {
    // esc : dont change status
    window.parent.frames.ro.location.href = `set_test_status?wid=${WoID}&status=${$(
      '.word'
    ).attr('data_status')}`;
    return false;
  }
  for (let i = 1; i <= 5; i++) {
    if (e.which == 48 + i || e.which == 96 + i) {
      // 1,.. : status=i
      window.parent.frames.ro.location.href = `set_test_status?wid=${WoID}&status=${i}`;
      return false;
    }
  }
  if (e.which == 73) {
    // I : status=98
    window.parent.frames.ro.location.href = `set_test_status?wid=${WoID}&status=98`;
    return false;
  }
  if (e.which == 87) {
    // W : status=99
    window.parent.frames.ro.location.href = `set_test_status?wid=${WoID}&status=99`;
    return false;
  }
  if (e.which == 69) {
    // E : EDIT
    window.parent.frames.ro.location.href = `edit_tword?wid=${WoID}`;
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
  run_overlib_test(
    wBlink1,
    wBlink2,
    wBlink3,
    data_wid,
    data_text,
    data_trans,
    data_rom,
    data_status,
    data_sent,
    data_todo
  );
  // TODO
  const SOLUTION = prepare_textdata_js(
    $testtype == 1 ? ($nosent ? $trans : ` [${trans}] `) : $save
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
function run_overlib_test(
  wBlink1: string,
  wBlink2: string,
  wBlink3: string,
  wid: string,
  txt: string,
  trans: string,
  roman: string,
  stat: NumericalStrength,
  sent: string,
  todo: number
  // oldstat: undefined
) {
  let c = stat + 1;
  if (c > 5) c = 5;
  let w = stat - 1;
  if (w < 1) w = 1;
  let cc = `${stat} ▶ ${c}`;
  if (c == stat) cc = c;
  let ww = `${stat} ▶ ${w}`;
  if (w == stat) ww = w;
  overlib;
  return (
    <>
      {todo == 1 ? (
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
function MakeOverlibLinkChangeStatusAlltest(
  wid: string,
  oldstat: NumericalStrength
) {
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
  if (oldstat == newstat) {
    return (
      <a href={`set_test_status?wid=${wid}&status=${newstat}`} target="ro">
        <span title={getStatusName(newstat)}>[◆]</span>
      </a>
    );
  }
  return (
    <a href={`set_test_status?wid=${wid}&status=${newstat}`} target="ro">
      <span title={getStatusName(newstat)}>[{getStatusAbbr(newstat)}]</span>
    </a>
  );
}
// todo STATUSES comes from her e
// function get_wordstatus_radiooptions(v)
// {
// 	if (!isset(v))
// 		v = 1;
// 	r = "";
// 	statuses = get_statuses();
// 	foreach (statuses as n => status) {
// 		r .= '<span class="status' . n . '" title="' . tohtml(status["name"]) . '">';
// 		r .= '&nbsp;<input type="radio" name="WoStatus" value="' . n . '"';
// 		if (v == n)
// 			r .= ' checked="checked"';
// 		r .= ' />' . tohtml(status["abbr"]) . "&nbsp;</span> ";
// 	}
// 	return r;
// }
/**
 *
 * @param status
 */
function getStatusName(status: NumericalStrength) {
  return StrengthMapNumericalKey[status]
    ? StrengthMapNumericalKey[status].name
    : 'Unknown';
}
/**
 *
 * @param status
 */
function getStatusAbbr(status: NumericalStrength) {
  return StrengthMapNumericalKey[status]
    ? StrengthMapNumericalKey[status].abbr
    : '?';
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
  if (title != '') title = '▶ ' + title;
  if (roman != '' && roman !== undefined) {
    if (title != '') title += nl;
    title += `▶ ${roman}`;
  }
  if (trans != '' && trans != '*') {
    if (title != '') title += nl;
    title += `▶ ${trans}`;
  }
  if (title != '') title += nl;
  title += `▶ ${getStatusName(status)} [${getStatusAbbr(status)}]`;
  return title;
}
