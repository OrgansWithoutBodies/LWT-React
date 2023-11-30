// Call: glosbe_api.php?from=...&dest=...&phrase=...
//       ... from=L2 language code (see Glosbe)
//       ... dest=L1 language code (see Glosbe)
//       ... phrase=... word or expression to be translated by
//                      Glosbe API (see http://glosbe.com/a-api)

import { Icon } from '../ui-kit/Icon';

// Call Glosbe Translation API, analyze and present JSON results
// for easily filling the "new word form"

// $from = trim(stripTheSlashesIfNeeded($_REQUEST["from"]));
// $dest = trim(stripTheSlashesIfNeeded($_REQUEST["dest"]));
// $destorig = $dest;
// $phrase = mb_strtolower(trim(stripTheSlashesIfNeeded($_REQUEST["phrase"])), 'UTF-8');
// $ok = FALSE;

// $titletext = '<a href="http://glosbe.com/' . $from . '/' . $dest . '/' . $phrase . '">Glosbe Dictionary (' . tohtml($from) . "-" . tohtml($dest) . "):  &nbsp; <span class="red2">" . tohtml($phrase) . "</span></a>";
// echo '<h3>' . $titletext . '</h3>';
// echo '<p>(Click on <img src="icn/tick-button.png" title="Choose" alt="Choose" /> to copy word(s) into above term)<br />&nbsp;</p>';
export function GlosbeAPI({
  from,
  dest,
  phrase,
}: {
  from: string;
  dest: string;
  phrase: string;
}) {
  const glosbe_data = `http://glosbe.com/gapi/translate?from=${from}&dest=${dest}&format=json&phrase=${phrase}`;

  const data = json_decode(glosbe_data, true);
  if (data['phrase']) {
    const ok = data['phrase'] == phrase && data['tuc'];
  }
  return (
    <>
      <h3>
        <a href={`http://glosbe.com/${from}/${dest}/${phrase}`}>
          Glosbe Dictionary ({from}-{dest}): &nbsp;{' '}
          <span className="red2">{phrase}</span>
        </a>
      </h3>
      <p>
        (Click on <Icon src="tick-button" title="Choose" /> to copy word(s) into
        above term)
        <br />
        &nbsp;
      </p>
    </>
  );
}
function addTranslation(s) {
  let w = window.parent.frames['ro'];
  if (typeof w == 'undefined') w = window.opener;
  if (typeof w == 'undefined') {
    alert('Translation can not be copied!');
    return;
  }
  const c = w.document.forms[0].WoTranslation;
  if (typeof c != 'object') {
    alert('Translation can not be copied!');
    return;
  }
  const oldValue = c.value;
  if (oldValue.trim() == '') {
    c.value = s;
    w.makeDirty();
  } else {
    if (oldValue.indexOf(s) == -1) {
      c.value = oldValue + ' / ' + s;
      w.makeDirty();
    } else {
      if (
        confirm(
          '"' + s + '" seems already to exist as a translation.\nInsert anyway?'
        )
      ) {
        c.value = oldValue + ' / ' + s;
        w.makeDirty();
      }
    }
  }
}

// if ($from != '' && $dest != '' && $phrase != '') {

// 	$glosbe_data =

// 	if(! ($glosbe_data === FALSE)) {

// 		$data = json_decode ($glosbe_data, true);
// 		if ( isset($data['phrase']) ) {
// 			$ok = (($data['phrase'] == $phrase) && (isset($data['tuc'])));
// 		}

// 	}

// }

// if ( $ok ) {

// 	if (count($data['tuc']) > 0) {

// 		$i = 0;

// 		echo "<p>\n";
// 		foreach ($data['tuc'] as &$value) {
// 			$word = '';
// 			if (isset($value['phrase'])) {
// 				if (isset($value['phrase']['text']))
// 					$word = $value['phrase']['text'];
// 			} else if (isset($value['meanings'])) {
// 				if (isset($value['meanings'][0]['text']))
// 					$word = "(" . $value['meanings'][0]['text'] . ")";
// 			}
// 			if ($word != '') {
// 				$word = trim(strip_tags($word));
// 				echo '<span class="click" onclick="addTranslation(' . prepare_textdata_js($word) . ');"><img src="icn/tick-button.png" title="Copy" alt="Copy" /> &nbsp; ' . $word . '</span><br />' . "\n";
// 				$i++;
// 			}
// 		}
// 		echo "</p>";
// 		if ($i) {
// 		echo '<p>&nbsp;<br/>' . $i . ' translation' . ($i==1 ? '' : 's') . ' retrieved via <a href="http://glosbe.com/a-api" target="_blank">Glosbe API</a>.</p>';
// 		}

// 	} else {

// 		echo '<p>No translations found (' . tohtml($from) . '-' . tohtml($dest) . ').</p>';

// 		if ($dest != "en" && $from != "en") {

// 			$ok = FALSE;

// 			$dest = "en";
// 			$titletext = '<a href="http://glosbe.com/' . $from . '/' . $dest . '/' . $phrase . '">Glosbe Dictionary (' . tohtml($from) . "-" . tohtml($dest) . "):  &nbsp; <span class="red2">" . tohtml($phrase) . "</span></a>";
// 			echo '<hr /><p>&nbsp;</p><h3>' . $titletext . '</h3>';

// 			$glosbe_data = file_get_contents('http://glosbe.com/gapi/translate?from=' . urlencode($from) . '&dest=' . urlencode($dest) . '&format=json&phrase=' . urlencode($phrase));

// 			if(! ($glosbe_data === FALSE)) {

// 				$data = json_decode ($glosbe_data, true);
// 				if ( isset($data['phrase']) ) {
// 					$ok = (($data['phrase'] == $phrase) && (isset($data['tuc'])));
// 				}

// 			}

// 			if ( $ok ) {

// 				if (count($data['tuc']) > 0) {

// 					$i = 0;

// 					echo "<p>&nbsp;<br />\n";
// 					foreach ($data['tuc'] as &$value) {
// 						$word = '';
// 						if (isset($value['phrase'])) {
// 							if (isset($value['phrase']['text']))
// 								$word = $value['phrase']['text'];
// 						} else if (isset($value['meanings'])) {
// 							if (isset($value['meanings'][0]['text']))
// 								$word = "(" . $value['meanings'][0]['text'] . ")";
// 						}
// 						if ($word != '') {
// 							$word = trim(strip_tags($word));
// 							echo '<span class="click" onclick="addTranslation(' . prepare_textdata_js($word) . ');"><img src="icn/tick-button.png" title="Copy" alt="Copy" /> &nbsp; ' . $word . '</span><br />' . "\n";
// 							$i++;
// 						}
// 					}
// 					echo "</p>";
// 					if ($i) {
// 					echo '<p>&nbsp;<br/>' . $i . ' translation' . ($i==1 ? '' : 's') . ' retrieved via <a href="http://glosbe.com/a-api" target="_blank">Glosbe API</a>.</p>';
// 					}

// 				} else {

// 					echo '<p>&nbsp;<br/>No translations found (' . tohtml($from) . '-' . tohtml($dest) . ').</p>';

// 				}

// 			} else {

// 				echo '<p>&nbsp;<br/>Retrieval error (' . tohtml($from) . '-' . tohtml($dest) . '). Possible reason: There is a limit of Glosbe API calls that may be done from one IP address in a fixed period of time, to prevent from abuse.</p>';

// 			}
// 		}

// 	}

// } else {

// 	echo '<p>Retrieval error (' . tohtml($from) . '-' . tohtml($dest) . '). Possible reason: There is a limit of Glosbe API calls that may be done from one IP address in a fixed period of time, to prevent from abuse.</p>';

// }

// echo '&nbsp;<hr />&nbsp;<form action="glosbe_api.php" method="get">Unhappy?<br/>Change term:
// <input type="text" name="phrase" maxlength="250" size="15" value="' . tohtml($phrase) . '">
// <input type="hidden" name="from" value="' . tohtml($from) . '">
// <input type="hidden" name="dest" value="' . tohtml($destorig) . '">
// <input type="submit" value="Translate via Glosbe">
// </form>';

// pageend();

// ?>