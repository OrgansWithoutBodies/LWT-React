import { getSepas } from 'lwt-common';
import { TextsID, WordsID } from 'lwt-schemas';
import { useData } from 'lwt-state';
import { Icon } from 'lwt-ui-kit';
import { changeImprAnnRadio, changeImprAnnText } from './IO/CheckForm';
import { do_ajax_edit_impr_text } from './PrintAnnotate/PrintText.component';

/**
 *
 * @param i
 * @param wid
 * @param trans
 * @param word
 * @param lang
 */
export function MakeTrans(
  i: number,
  wid: WordsID,
  trans: string | number | readonly string[] | undefined
  // word: string,
  // lang: any
) {
  const [{ words }] = useData(['words']);
  const alltrans = words.find((val) => val.WoID === wid)?.WoTranslation;
  if (!alltrans) {
    // TODO ?
    return <></>;
  }
  const r = '';
  const set = false;
  const transarr = alltrans.split(`/[${getSepas()}]\\u`);

  return transarr.map((t) => {
    const tt = t.trim();
    return (
      <span>
        {tt === '*' || tt === '' ? (
          <></>
        ) : (
          //   if ((!set) && (tt === trans)) {
          <>
            <span className="nowrap">
              <input
                onChange={() => changeImprAnnRadio()}
                checked
                type="radio"
                name={`rg${i}`}
                value={tt}
              />
              &nbsp;
              {tt}
            </span>
            <br />
          </>
        )}
        {!set ? (
          <>
            <span className="nowrap">
              <input
                onChange={changeImprAnnRadio}
                checked
                type="radio"
                name={`rg${i}`}
                value=""
              />
              &nbsp;
              <input
                // TODO maybe reimpliment this instead of explicitly adding handlers?
                // className="impr-ann-text"
                type="text"
                name={`tx${i}`}
                id={`tx${i}`}
                value={trans}
                maxLength={50}
                size={40}
                onChange={changeImprAnnText}
              />
            </span>
          </>
        ) : (
          <>
            <span className="nowrap">
              <input
                type="radio"
                onChange={changeImprAnnRadio}
                name={`rg${i}`}
                value=""
              />
              &nbsp;
              <input
                type="text"
                name={`tx${i}`}
                id={`tx${i}`}
                value=""
                maxLength={50}
                size={40}
                onChange={changeImprAnnText}
              />
            </span>
          </>
        )}
        <>
          <span className="nowrap">
            <input checked type="radio" name="rg' . i . '" value="" />
            &nbsp;
            <input
              onChange={changeImprAnnText}
              type="text"
              name="tx' . i . '"
              id="tx' . i . '"
              value="' . tohtml(trans) . '"
              maxLength={50}
              size={40}
            />
            &nbsp;
            <Icon
              src="eraser"
              title="Erase Text Field"
              className="click"
              onClick={() => onChange()}
              // onClick="$(\'#tx' . i . '\').val(\'\').trigger(\'change\');"
            />
            &nbsp;
            <Icon
              src="star"
              title="* (Set to Term)"
              className="click"
              onClick={() => onChange()}
              // onClick="$(\'#tx' . i . '\').val(\'*\').trigger(\'change\');"
            />
            {widset ? (
              <>
                &nbsp;
                <Icon
                  src="plus-button"
                  title="Save another translation to existent term"
                  className="click"
                  onClick={() => onAddTermTranslation()}
                  // onClick="addTermTranslation(' . wid . ', \'#tx' . i . '\',\'\',' . lang . ');"
                />
                ';
              </>
            ) : (
              <>
                &nbsp;
                <Icon
                  src="plus-button"
                  title="Save translation to new term"
                  className="click"
                  onClick={() => onAddTermTranslation()}

                  // onClick="addTermTranslation(0, \'#tx' . i . '\',' . prepare_textdata_js(word) . ',' . lang . ');"
                />
                &nbsp;&nbsp;
                <span id="wait' . i . '">
                  <img src="icn/empty.gif" />
                </span>
              </>
            )}
          </span>
        </>
      </span>
    );
  });
}

/**
 *
 * @param wordid
 * @param txid
 * @param word
 * @param lang
 */
function onAddTermTranslation(wordid: WordsID, txid: TextsID, word, lang) {
  const thedata = $(txid).val().trim();
  const pagepos = $(document).scrollTop();
  if (thedata == '' || thedata == '*') {
    alert("Text Field is empty or = '*'!");
    return;
  }
  $.post(
    'ajax_add_term_transl.php',
    { id: wordid, data: thedata, text: word, lang },
    function (d) {
      if (d == '') {
        alert(
          'Adding translation to term OR term creation failed, please reload page and try again!'
        );
      } else {
        do_ajax_edit_impr_text(pagepos, d);
      }
    }
  );
}
