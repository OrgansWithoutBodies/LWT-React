// function selectmediapathoptions(dir)
// {
// 	is_windows = ("WIN" == strtoupper(substr(PHP_OS, 0, 3)));
// 	mediadir = scandir(dir);
// 	r = '<option disabled="disabled">-- Directory: ' . tohtml(dir) . ' --</option>';
// 	foreach (mediadir as entry) {
// 		if (is_windows)
// 			entry = mb_convert_encoding(entry, 'UTF-8', 'ISO-8859-1');
// 		if (substr(entry, 0, 1) != '.') {
// 			if (!is_dir(dir . '/' . entry)) {
// 				ex = substr(entry, -4);
// 				if (
// 					(strcasecmp(ex, '.mp3') == 0) ||
// 					(strcasecmp(ex, '.ogg') == 0) ||
// 					(strcasecmp(ex, '.wav') == 0)
// 				)
// 					r += '<option value="' . tohtml(dir . '/' . entry) . '">' . tohtml(dir . '/' . entry) . '</option>';
// 			}
// 		}
// 	}
// 	foreach (mediadir as entry) {
// 		if (substr(entry, 0, 1) != '.') {
// 			if (is_dir(dir . '/' . entry))
// 				r += selectmediapathoptions(dir . '/' . entry);
// 		}
// 	}
// 	return r;
// }

// TODO
/**
 *
 */
export function do_ajax_update_media_select() {
  // $('#mediaselect').html('&nbsp; <img src="icn/waiting2.gif" />');
  // $.post('ajax_update_media_select.php',
  // 	function(data) { $('#mediaselect').html(data); }
  // );
}

/**
 *
 */
export function SelectMediaPath({ f }: { f: string }) {
  const exists = true;
  return (
    <>
      <br /> or choose a file in ".../'.basename(getcwd()).; '/media" (only mp3,
      ogg, wav files shown):{' '}
      {exists ? (
        <>
          {is_dir('media') ? (
            <></>
          ) : (
            <>
              <br />
              [Error: ".../{basename(getcwd())}/media" exists, but it is not a
              directory.]
            </>
          )}
        </>
      ) : (
        <>
          <br />
          [Directory ".../{basename(getcwd())}/media" does not yet exist.]
        </>
      )}
    </>
  );
  // exists = file_exists('media');
  // if (exists) {
  //   if (is_dir('media'))
  //     msg = '';

  //   else
  //     msg = '<br />[Error: ".../'.basename(getcwd()).; '/media" exists, but it is not a directory.]';
  // } else {
  //   msg = '<br />[Directory ".../'.basename(getcwd()).; '/media" does not yet exist.]';
  // }
  // r = '<br /> or choose a file in ".../'.basename(getcwd()).; '/media" (only mp3, ogg, wav files shown): '.msg;
  // if (msg == '') {
  //   r += '<br /><select name="Dir" onchange="{val=this.form.Dir.options[this.form.Dir.selectedIndex].value; if (val != \'\') this.form.'.f.; '.value = val; this.form.Dir.value=\'\';}">';
  //   r += '<option value="">[Choose...]</option>';
  //   r += selectmediapathoptions('media');
  //   r += '</select> ';
  // }
  // r += ' &nbsp; &nbsp; <span class="click" onClick="do_ajax_update_media_select();"><Icon src="arrow-circle-135" title="Refresh Media Selection" /> Refresh</span>';
  // return r;
}
