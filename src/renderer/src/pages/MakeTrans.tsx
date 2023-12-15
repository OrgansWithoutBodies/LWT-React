import { WordsID } from '../data/validators';
import { useData } from '../hooks/useData';
import { Icon } from '../ui-kit/Icon';
import { changeImprAnnRadio, changeImprAnnText } from './IO/CheckForm';

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
  const r = '';
  const set = false;
  const transarr = preg_split(
    '/[',
    //  . get_sepas() .
    // ']/u'
    alltrans
  );

  return transarr.map((t: any) => {
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
                onChange={changeImprAnnRadio}
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
