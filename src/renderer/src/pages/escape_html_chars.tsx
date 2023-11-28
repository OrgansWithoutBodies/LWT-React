import {
  createTheDictLink,
  make_overlib_link_change_status_test,
} from './ReaderPage.component';

function onWordClick() {
  const WBLINK1 = '<?php echo $wb1; ?>';
  const WBLINK2 = '<?php echo $wb2; ?>';
  const WBLINK3 = '<?php echo $wb3; ?>';
  // SOLUTION = <?php echo prepare_textdata_js ( $testtype==1 ? ( $nosent ? ($traWBLINK1ns) : (' [' . $trans . '] ')) : $save ); ?>;
  const OPENED = 0;
  // WID = <?php echo $wid; ?>;
  $(document).ready(function () {
    $(document).keydown(keydown_event_do_test_test);
    $('.word').click(word_click_event_do_test_test);
  });
}
enum KeyStatus {
  'SPACE' = 32,
  'ESC' = 27,
  'UP' = 38,
  'DOWN' = 40,
  'E' = 69,
  'I' = 73,
  'W' = 87,
  // '' = 48,
  // '' = 96,
}
function keydown_event_do_test_test(e: KeyboardEvent) {
  // TODO update 'which' pattern
  if (e.which == 32 && OPENED == 0) {
    // space : show sol.
    $('.word').click();
    cClick();
    window.parent.frames['ro'].location.href =
      'show_word.php?wid=' + $('.word').attr('data_wid') + '&ann=';
    OPENED = 1;
    return false;
  }
  if (OPENED == 0) return true;
  if (e.which == 38) {
    // up : status+1
    window.parent.frames['ro'].location.href =
      'set_test_status.php?wid=' + WID + '&stchange=1';
    return false;
  }
  if (e.which == 40) {
    // down : status-1
    window.parent.frames['ro'].location.href =
      'set_test_status.php?wid=' + WID + '&stchange=-1';
    return false;
  }
  if (e.which == 27) {
    // esc : dont change status
    window.parent.frames['ro'].location.href =
      'set_test_status.php?wid=' +
      WID +
      '&status=' +
      $('.word').attr('data_status');
    return false;
  }
  for (var i = 1; i <= 5; i++) {
    if (e.which == 48 + i || e.which == 96 + i) {
      // 1,.. : status=i
      window.parent.frames['ro'].location.href =
        'set_test_status.php?wid=' + WID + '&status=' + i;
      return false;
    }
  }
  if (e.which == 73) {
    // I : status=98
    window.parent.frames['ro'].location.href =
      'set_test_status.php?wid=' + WID + '&status=98';
    return false;
  }
  if (e.which == 87) {
    // W : status=99
    window.parent.frames['ro'].location.href =
      'set_test_status.php?wid=' + WID + '&status=99';
    return false;
  }
  if (e.which == 69) {
    // E : EDIT
    window.parent.frames['ro'].location.href = 'edit_tword.php?wid=' + WID;
    return false;
  }
  return true;
}
function word_click_event_do_test_test(this: any) {
  // $wb1 = isset($record['LgDict1URI']) ? $record['LgDict1URI'] : "";
  // $wb2 = isset($record['LgDict2URI']) ? $record['LgDict2URI'] : "";
  // $wb3 = isset($record['LgGoogleTranslateURI']) ? $record['LgGoogleTranslateURI'] : "";
  run_overlib_test(
    WBLINK1,
    WBLINK2,
    WBLINK3,
    $(this).attr('data_wid'),
    $(this).attr('data_text'),
    $(this).attr('data_trans'),
    $(this).attr('data_rom'),
    $(this).attr('data_status'),
    $(this).attr('data_sent'),
    $(this).attr('data_todo')
  );
  $('.todo').text(SOLUTION);
  return false;
}
function run_overlib_test(
  wblink1: string,
  wblink2: string,
  wblink3: string,
  wid: string,
  txt: string,
  trans: any,
  roman: any,
  stat: string | number,
  sent: string,
  todo: number
  // oldstat: undefined
) {
  const s = parseInt(stat, 10);
  let c = s + 1;
  if (c > 5) c = 5;
  let w = s - 1;
  if (w < 1) w = 1;
  let cc = stat + ' ▶ ' + c;
  if (c == s) cc = c;
  let ww = stat + ' ▶ ' + w;
  if (w == s) ww = w;
  return overlib(
    (todo == 1
      ? '<center><hr noshade size=1 /><b>' +
        (stat >= 1 && stat <= 5
          ? make_overlib_link_change_status_test(
              wid,
              1,
              '<img src=\x22icn/thumb-up.png\x22 title=\x22Got it!\x22 alt=\x22Got it!\x22 /> Got it! [' +
                cc +
                ']'
            ) +
            '<hr noshade size=1 />' +
            make_overlib_link_change_status_test(
              wid,
              -1,
              '<img src=\x22icn/thumb.png\x22 title=\x22Oops!\x22 alt=\x22Oops!\x22 /> Oops! [' +
                ww +
                ']'
            ) +
            '<hr noshade size=1 />'
          : '') +
        make_overlib_link_change_status_alltest(wid, stat) +
        '</b></center><hr noshade size=1 />'
      : '') +
      '<b>' +
      escape_html_chars(make_tooltip(txt, trans, roman, stat)) +
      '</b><br />' +
      ' <a href=\x22edit_tword.php?wid=' +
      wid +
      '\x22 target=\x22ro\x22>Edit term</a><br />' +
      createTheDictLink(wblink1, txt, 'Dict1', 'Lookup Term: ') +
      createTheDictLink(wblink2, txt, 'Dict2', '') +
      createTheDictLink(wblink3, txt, 'GTr', '') +
      createTheDictLink(wblink3, sent, 'GTr', '<br />Lookup Sentence:'),
    CAPTION,
    'Got it?'
  );
}
function make_overlib_link_change_status_alltest(wid: any, oldstat: any) {
  let result = '';
  for (let newstat = 1; newstat <= 5; newstat++)
    result += make_overlib_link_change_status_test2(wid, oldstat, newstat);
  result += make_overlib_link_change_status_test2(wid, oldstat, 99);
  result += make_overlib_link_change_status_test2(wid, oldstat, 98);
  return result;
}
function make_overlib_link_change_status_test2(
  wid: string,
  oldstat: any,
  newstat: string | number
) {
  if (oldstat == newstat) {
    return (
      ' <a href=\x22set_test_status.php?wid=' +
      wid +
      '&amp;status=' +
      newstat +
      '\x22 target=\x22ro\x22><span title=\x22' +
      getStatusName(newstat) +
      '\x22>[◆]</span></a> '
    );
  } else {
    return (
      ' <a href=\x22set_test_status.php?wid=' +
      wid +
      '&amp;status=' +
      newstat +
      '\x22 target=\x22ro\x22><span title=\x22' +
      getStatusName(newstat) +
      '\x22>[' +
      getStatusAbbr(newstat) +
      ']</span></a> '
    );
  }
}
// todo STATUSES comes from her e
// function get_wordstatus_radiooptions($v)
// {
// 	if (!isset($v))
// 		$v = 1;
// 	$r = "";
// 	$statuses = get_statuses();
// 	foreach ($statuses as $n => $status) {
// 		$r .= '<span class="status' . $n . '" title="' . tohtml($status["name"]) . '">';
// 		$r .= '&nbsp;<input type="radio" name="WoStatus" value="' . $n . '"';
// 		if ($v == $n)
// 			$r .= ' checked="checked"';
// 		$r .= ' />' . tohtml($status["abbr"]) . "&nbsp;</span> ";
// 	}
// 	return $r;
// }
function getStatusName(status: string | number) {
  return STATUSES[status] ? STATUSES[status]['name'] : 'Unknown';
}
function getStatusAbbr(status: string | number) {
  return STATUSES[status] ? STATUSES[status]['abbr'] : '?';
}
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
export function make_tooltip(
  word: any,
  trans: string,
  roman: string,
  status: any
) {
  const nl = '\x0d';
  let title = word;
  // if (title != '' ) title = '▶ ' + title;
  if (roman != '') {
    if (title != '') title += nl;
    title += '▶ ' + roman;
  }
  if (trans != '' && trans != '*') {
    if (title != '') title += nl;
    title += '▶ ' + trans;
  }
  if (title != '') title += nl;
  title += '▶ ' + getStatusName(status) + ' [' + getStatusAbbr(status) + ']';
  return title;
}
