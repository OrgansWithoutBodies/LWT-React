/**
 *
 * @param $i
 * @param $wid
 * @param $trans
 * @param $word
 * @param $lang
 */
export function make_trans($i, $wid, $trans, $word, $lang) {
  // const 		$alltrans = get_first_value("select WoTranslation as value from " . $tbpref . "words where WoID = " . $wid);
  // const 		$transarr = preg_split('/[' . get_sepas() . ']/u', $alltrans);
  const $r = '';
  const $set = false;
  return transarr.map(($t) => (
    <>
      {$tt === '*' || $tt === '' ? (
        <></>
      ) : (
        //   if ((!$set) && ($tt === $trans)) {
        <>
          <span className="nowrap">
            <input
              class="impr-ann-radio"
              checked="checked"
              type="radio"
              name={`rg${$i}`}
              value={$tt}
            />
            &nbsp;
            {$tt}
          </span>
          <br />
        </>
      )}
      {!$set ? (
        <>
          <span className="nowrap">
            <input
              class="impr-ann-radio"
              checked="checked"
              type="radio"
              name={`rg${$i}`}
              value=""
            />
            &nbsp;
            <input
              className="impr-ann-text"
              type="text"
              name={`tx${$i}`}
              id={`tx${$i}`}
              value={$trans}
              maxLength={50}
              size={40}
            />
          </span>
        </>
      ) : (
        <>
          <span className="nowrap">
            <input
              className="impr-ann-radio"
              type="radio"
              name={`rg${$i}`}
              value=""
            />
            &nbsp;
            <input
              className="impr-ann-text"
              type="text"
              name={`tx${$i}`}
              id={`tx${$i}`}
              value=""
              maxLength={50}
              size={40}
            />
          </span>
        </>
      )}
    </>
  ));
}
{
  /* // } else {
  // $r = '<span class="nowrap"><input checked="checked" type="radio" name="rg' . $i . '" value="" />&nbsp;<input class="impr-ann-text" type="text" name="tx' . $i . '" id="tx' . $i . '" value="' . tohtml($trans) . '" maxlength={50} size={40} />';
  // }
  // $r .= ' &nbsp;<img class="click" src="icn/eraser.png" title="Erase Text Field" alt="Erase Text Field" onclick="$(\'#tx' . $i . '\').val(\'\').trigger(\'change\');" />';
  // $r .= ' &nbsp;<img class="click" src="icn/star.png" title="* (Set to Term)" alt="* (Set to Term)" onclick="$(\'#tx' . $i . '\').val(\'*\').trigger(\'change\');" />';
  // if ($widset)
  // $r .= ' &nbsp;<img class="click" src="icn/plus-button.png" title="Save another translation to existent term" alt="Save another translation to existent term" onclick="addTermTranslation(' . $wid . ', \'#tx' . $i . '\',\'\',' . $lang . ');" />';
  // else
  // $r .= ' &nbsp;<img class="click" src="icn/plus-button.png" title="Save translation to new term" alt="Save translation to new term" onclick="addTermTranslation(0, \'#tx' . $i . '\',' . prepare_textdata_js($word) . ',' . $lang . ');" />';
  // $r .= '&nbsp;&nbsp;<span id="wait' . $i . '"><img src="icn/empty.gif" /></span></span>';
  // return $r; */
}
