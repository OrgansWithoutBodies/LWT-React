import React, { useRef } from 'react';
import { LANGS } from '../data/wizardData';
import { Icon } from '../ui-kit/Icon';

/**
 *
 * @param refL1
 * @param refL2
 * @param onSuccess
 */
function wizard_go(
  refL1: React.MutableRefObject<HTMLSelectElement | undefined>,
  refL2: React.MutableRefObject<HTMLSelectElement | undefined>,
  onSuccess: (l1: string, l2: string) => void
) {
  const l1 = refL1.current?.value;
  const l2 = refL2.current?.value;

  if (l1 === undefined || l2 === undefined) {
    throw new Error('Undefined refs');
  }
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
  onSuccess(l1, l2);
}

export default function NewLanguageWizard({
  onSuccess,
  onExit,
}: {
  onSuccess: (l1: string, l2: string) => void;
  onExit: () => void;
}): JSX.Element {
  const refL1 =
    useRef<HTMLSelectElement>() as React.MutableRefObject<HTMLSelectElement>;
  const refL2 =
    useRef<HTMLSelectElement>() as React.MutableRefObject<HTMLSelectElement>;
  return (
    <div className="center">
      <p className="wizard">
        <Icon src="wizard" title="Language Settings Wizard" />
      </p>

      <h3 className="wizard">Language Settings Wizard</h3>

      <p className="wizard">
        <b>My Native language is:</b>
        <br />
        L1:
        <select ref={refL1} name="l1" id="l1">
          <option value="">[Choose...]</option>
          {LANGS.map((lang) => (
            <option value={lang}>{lang}</option>
          ))}
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
          {LANGS.map((lang) => (
            <option value={lang}>{lang}</option>
          ))}
        </select>
      </p>

      <p className="wizard">
        <input
          type="button"
          style={{ fontSize: '1.1em' }}
          value="Set Language Settings"
          onClick={() => wizard_go(refL1, refL2, onSuccess)}
        />
      </p>

      <p className="wizard">
        <input type="button" value="Cancel" onClick={() => onExit()} />
      </p>
    </div>
  );
}
