import React, { useRef } from 'react';
import { LANGDEFS, LANGS } from '../data/wizardData';
const $ = '';

function wizard_exit() {
  window.close();
}
function wizard_go(
  refL1: React.MutableRefObject<HTMLSelectElement | undefined>,
  refL2: React.MutableRefObject<HTMLSelectElement | undefined>
) {
  const l1 = refL1.current?.value;
  const l2 = refL2.current?.value;

  if (l1 == '') {
    alert('Please choose your native language (L1)!');
    return;
  }
  if (l2 == '') {
    alert('Please choose your language you want to read/study (L2)!');
    return;
  }
  if (l2 == l1) {
    alert('L1 L2 Languages must not be equal!');
    return;
  }

  const w = window.opener;
  if (typeof w == 'undefined') {
    alert('Language setting cannot be set. Please try again.');
    wizard_exit();
  }
  // TODO input values
  const context = w.document;
  // $('input[name="LgName"]', context).val(l2);
  // $('input[name="LgDict1URI"]', context).val(
  //   '*https://de.glosbe.com/' +
  //     LANGDEFS[l2].LgGlosbeKey +
  //     '/' +
  //     LANGDEFS[l1].LgGlosbeKey +
  //     '/###'
  // );
  // $('input[name="LgGoogleTranslateURI"]', context).val(
  //   '*http://translate.google.com/?ie=UTF-8&sl=' +
  //     LANGDEFS[l2].LgGTransKey +
  //     '&tl=' +
  //     LANGDEFS[l1].LgGTransKey +
  //     '&text=###'
  // );
  // $('select[name="LgTextSize"]', context).val(LANGDEFS[l2].LgTextSize);
  // $('input[name="LgRegexpSplitSentences"]', context).val(
  //   LANGDEFS[l2].LgRegexpSplitSentences
  // );
  // $('input[name="LgRegexpWordCharacters"]', context).val(
  //   LANGDEFS[l2].LgRegexpWordCharacters
  // );
  // $('select[name="LgSplitEachChar"]', context).val(
  //   LANGDEFS[l2].LgSplitEachChar
  // );
  // $('select[name="LgRemoveSpaces"]', context).val(LANGDEFS[l2].LgRemoveSpaces);
  // $('select[name="LgRightToLeft"]', context).val(LANGDEFS[l2].LgRightToLeft);
  wizard_exit();
}
export default function NewLanguageWizard(): JSX.Element {
  const refL1 =
    useRef<HTMLSelectElement>() as React.MutableRefObject<HTMLSelectElement>;
  const refL2 =
    useRef<HTMLSelectElement>() as React.MutableRefObject<HTMLSelectElement>;
  return (
    <>
      <div className="center">
        <p className="wizard">
          <img
            src="icn/wizard.png"
            title="Language Settings Wizard"
            alt="Language Settings Wizard"
          />
        </p>

        <h3 className="wizard">Language Settings Wizard</h3>

        <p className="wizard">
          <b>My Native language is:</b>
          <br />
          L1:
          <select ref={refL1} name="l1" id="l1">
            <option value="">[Choose...]</option>
            {LANGS.map((lang) => {
              return <option value={lang}>{lang}</option>;
            })}
          </select>
        </p>

        <p className="wizard">
          <b>I want to study:</b>
          <br />
          L2:
          <select name="l2" id="l2" ref={refL2}>
            <option value="" selected>
              [Choose...]
            </option>
            {LANGS.map((lang) => {
              return <option value={lang}>{lang}</option>;
            })}
          </select>
        </p>

        <p className="wizard">
          <input
            type="button"
            style={{ fontSize: '1.1em' }}
            value="Set Language Settings"
            onClick={() => wizard_go(refL1, refL2)}
          />
        </p>

        <p className="wizard">
          <input type="button" value="Cancel" onClick={wizard_exit} />
        </p>
      </div>
    </>
  );
}
