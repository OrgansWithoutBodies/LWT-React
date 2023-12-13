// Call: API_api?from=...&dest=...&phrase=...
//       ... from=L2 language code (see API)
//       ... dest=L1 language code (see API)
//       ... phrase=... word or expression to be translated by
//                      API API (see http://API.com/a-api)

import { useEffect, useState } from 'react';
import { APITranslateTerm, GenericTranslationAPI } from '../data/deepl.plugin';
import { Icon } from '../ui-kit/Icon';
import { pluralize } from './EditTags';

// Call API Translation API, analyze and present JSON results
// for easily filling the "new word form"

// from = trim(stripTheSlashesIfNeeded($_REQUEST["from"]));
// dest = trim(stripTheSlashesIfNeeded($_REQUEST["dest"]));
// destorig = dest;
// phrase = mb_strtolower(trim(stripTheSlashesIfNeeded($_REQUEST["phrase"])), 'UTF-8');
// ok = FALSE;

// titletext = '<a href="http://API.com/' . from . '/' . dest . '/' . phrase . '">API Dictionary (' . tohtml(from) . "-" . tohtml(dest) . "):  &nbsp; <span class="red2">" . tohtml(phrase) . "</span></a>";
// echo '<h3>' . titletext . '</h3>';
// echo '<p>(Click on <Icon src="tick-button" title="Choose" /> to copy word(s) into above term)<br />&nbsp;</p>';

/**
 *
 */
export function TranslationAPI<TSource extends string, TTarget extends string>({
  sourceKey,
  targetKey,
  word,
  api: api,
  onAcceptLine,
}: APITranslateTerm<TSource, TTarget> & {
  api: GenericTranslationAPI<TSource, TTarget>;
  onAcceptLine: (data: string) => void;
}) {
  const [data, setData] = useState<null | string[]>(null);
  useEffect(() => {
    const setDataFromAPI = async () => {
      const APIData = await api.getTranslations({ sourceKey, targetKey, word });
      setData(APIData);
    };
    setDataFromAPI();
    return () => {};
  }, [sourceKey, targetKey, word, api]);
  if (!data) {
    return <></>;
  }
  // const ok = data.phrase == word && data.tuc !== undefined;
  const ok = true;
  if (!ok) {
    return (
      <p>
        &nbsp;
        <br />
        Retrieval error ({sourceKey}-{targetKey}). Possible reason: There is a
        limit of API API calls that may be done from one IP address in a fixed
        period of time, to prevent from abuse.
      </p>
    );
  }
  const i = data === null ? 0 : data.length;
  return (
    <>
      <h3>
        <a href={api.apiHomePage}>
          {api.apiName} API ({sourceKey}-{targetKey}
          ): &nbsp; <span className="red2">{word}</span>
        </a>
      </h3>
      <p>
        (Click on <Icon src="tick-button" title="Choose" /> to copy word(s) into
        above term)
        <br />
        &nbsp;
      </p>
      {
        <p>
          {/* {(value['phrase']&&value['phrase']['text'])&&
					word = value['phrase']['text'];
			} else if (isset(value['meanings'])) {
				if (isset(value['meanings'][0]['text']))
					word = "(" . value['meanings'][0]['text'] . ")";
			} */}
          {data &&
            data.map((val) => (
              <>
                <span className="click" onClick={() => onAcceptLine(val)}>
                  <Icon src="tick-button" title="Copy" /> &nbsp; {val}
                  {/* {trim(strip_tags(word))} */}
                </span>
                <br />
              </>
            ))}
          &nbsp;
          {/* TODO i numtranslations */}
          <br />
          {i} translation{pluralize(i)} retrieved via{' '}
          <a href={api.apiHomePage} target="_blank">
            {api.apiName} API
          </a>
          .
        </p>
      }
      <>
        &nbsp;
        <hr />
        &nbsp;
        <form action="API_api" method="get">
          Unhappy?
          <br />
          Change term:
          <input type="text" name="phrase" maxLength={250} size={15} value="" />
          {/* TODO */}
          <input type="hidden" name="from" value="" />
          <input type="hidden" name="dest" value="" />
          <input type="button" value={`Translate via ${api.apiName} API`} />
        </form>
      </>
    </>
  );
}
/**
 *
 * @param s
 */
function addTranslation(s) {
  let w = window.parent.frames.ro;
  if (typeof w === 'undefined') w = window.opener;
  if (typeof w === 'undefined') {
    alert('Translation can not be copied!');
    return;
  }
  const c = w.document.forms[0].WoTranslation;
  if (typeof c !== 'object') {
    alert('Translation can not be copied!');
    return;
  }
  const oldValue = c.value;
  if (oldValue.trim() == '') {
    c.value = s;
    w.makeDirty();
  } else if (oldValue.indexOf(s) == -1) {
    c.value = `${oldValue} / ${s}`;
    w.makeDirty();
  } else if (
    confirm(`"${s}" seems already to exist as a translation.\nInsert anyway?`)
  ) {
    c.value = `${oldValue} / ${s}`;
    w.makeDirty();
  }
}
// if ( ok ) {

// 	if (count(data['tuc']) > 0) {

// 		i = 0;

// 		echo "<p>\n";
// 		foreach (data['tuc'] as &value) {
// 			word = '';
// 			if (isset(value['phrase'])) {
// 				if (isset(value['phrase']['text']))
// 					word = value['phrase']['text'];
// 			} else if (isset(value['meanings'])) {
// 				if (isset(value['meanings'][0]['text']))
// 					word = "(" . value['meanings'][0]['text'] . ")";
// 			}
// 			if (word != '') {
// 				word = trim(strip_tags(word));
// 				echo '<span class="click" onClick="addTranslation(' . prepare_textdata_js(word) . ');"><Icon src="tick-button" title="Copy";
// 				i++;
// 			}
// 		}
// 		echo "</p>";
// 		if (i) {
// 		echo '<p>&nbsp;<br/>' . i . ' translation' . (i==1 ? '' : 's') . ' retrieved via <a href="http://API.com/a-api" target="_blank">API API</a>.</p>';
// 		}

// 	} else {

// 		echo '<p>No translations found (' . tohtml(from) . '-' . tohtml(dest) . ').</p>';

// 		if (dest != "en" && from != "en") {

// 			ok = FALSE;

// 			dest = "en";
// 			titletext = '<a href="http://API.com/' . from . '/' . dest . '/' . phrase . '">API Dictionary (' . tohtml(from) . "-" . tohtml(dest) . "):  &nbsp; <span class="red2">" . tohtml(phrase) . "</span></a>";
// 			echo '<hr /><p>&nbsp;</p><h3>' . titletext . '</h3>';

// 			API_data = file_get_contents('http://API.com/API/translate?from=' . urlencode(from) . '&dest=' . urlencode(dest) . '&format=json&phrase=' . urlencode(phrase));

// 			if(! (API_data === FALSE)) {

// 				data = json_decode (API_data, true);
// 				if ( isset(data['phrase']) ) {
// 					ok = ((data['phrase'] == phrase) && (isset(data['tuc'])));
// 				}

// 			}

// 			if ( ok ) {

// 				if (count(data['tuc']) > 0) {

// 					i = 0;

// 					echo "<p>&nbsp;<br />\n";
// 					foreach (data['tuc'] as &value) {
// 						word = '';
// 						if (isset(value['phrase'])) {
// 							if (isset(value['phrase']['text']))
// 								word = value['phrase']['text'];
// 						} else if (isset(value['meanings'])) {
// 							if (isset(value['meanings'][0]['text']))
// 								word = "(" . value['meanings'][0]['text'] . ")";
// 						}
// 						if (word != '') {
// 							word = trim(strip_tags(word));
// 							echo '<span class="click" onClick="addTranslation(' . prepare_textdata_js(word) . ');"><Icon src="tick-button" title="Copy";
// 							i++;
// 						}
// 					}
// 					echo "</p>";
// 					if (i) {
// 					echo '<p>&nbsp;<br/>' . i . ' translation' . (i==1 ? '' : 's') . ' retrieved via <a href="http://API.com/a-api" target="_blank">API API</a>.</p>';
// 					}

// 				} else {

// 					echo '<p>&nbsp;<br/>No translations found (' . tohtml(from) . '-' . tohtml(dest) . ').</p>';

// 				}

// 			} else {

// 				echo '<p>&nbsp;<br/>Retrieval error (' . tohtml(from) . '-' . tohtml(dest) . '). Possible reason: There is a limit of API API calls that may be done from one IP address in a fixed period of time, to prevent from abuse.</p>';

// 			}
// 		}

// 	}

// } else {

// 	echo '<p>Retrieval error (' . tohtml(from) . '-' . tohtml(dest) . '). Possible reason: There is a limit of API API calls that may be done from one IP address in a fixed period of time, to prevent from abuse.</p>';

// }

// echo '&nbsp;<hr />&nbsp;<form action="API_api" method="get">Unhappy?<br/>Change term:
// <input type="text" name="phrase" maxlength={250} size={15} value="' . tohtml(phrase) . '">
// <input type="hidden" name="from" value="' . tohtml(from) . '">
// <input type="hidden" name="dest" value="' . tohtml(destorig) . '">
// <input type="submit" value="Translate via API">
// </form>';

// pageend();

// ?>
