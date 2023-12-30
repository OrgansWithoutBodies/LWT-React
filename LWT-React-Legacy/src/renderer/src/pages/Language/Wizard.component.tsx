import { Language, StringInListValidator } from 'lwt-schemas';
import { Icon, useFormInput } from 'lwt-ui-kit';
import * as ss from 'superstruct';
import {
  AvailableLangs,
  WizardData,
} from '../../../../../data/wizard/wizard.data';

// TODO get more details from wikidata?
// https://www.wikidata.org/wiki/Property:P4132
// https://www.wikidata.org/wiki/Property:P219
// https://www.wikidata.org/wiki/Property:P220
// https://www.wikidata.org/wiki/Property:P9753
// TODO make more pluginnable

export type LangDef = Pick<
  Language,
  'LgTextSize' | 'LgRegexpWordCharacters' | 'LgRegexpSplitSentences'
> & {
  LgGTransKey: string;
  LgGlosbeKey: string;
  LgSplitEachChar: boolean;
  LgRemoveSpaces: boolean;
  LgRightToLeft: boolean;
};
export default function NewLanguageWizard({
  onSuccess,
  onExit,
}: {
  onSuccess: (
    l1: LangDef & Pick<Language, 'LgName'>,
    l2: LangDef & Pick<Language, 'LgName'>
  ) => void;
  onExit: () => void;
}): JSX.Element {
  const validator = ss.object({
    l1: StringInListValidator(AvailableLangs),
    l2: StringInListValidator(AvailableLangs),
    wizardData: ss.refine(
      ss.array(),
      'not-equal-both-filled',
      (arr) =>
        arr.length === 2 &&
        arr[0] !== arr[1] &&
        arr[0] !== undefined &&
        arr[1] !== undefined
    ),
  });
  const {
    refMap,
    onSubmit,
    Input: WzInput,
  } = useFormInput({
    validator,
  });
  return (
    <div className="center">
      <p className="wizard">
        {/* throw new Error('Undefined refs'); */}
        <Icon src="wizard" title="Language Settings Wizard" />
      </p>
      <WzInput
        type="hidden"
        entryKey="wizardData"
        errorName="Language equality"
      />
      <h3 className="wizard">Language Settings Wizard</h3>

      <p className="wizard">
        <b>My Native language is:</b>
        <br />
        L1:
        {/* alert('Please choose your native language (L1)!'); */}
        <select ref={refMap.l1} name="l1" id="l1">
          <option value="">[Choose...]</option>
          {AvailableLangs.map((lang) => (
            <option value={lang}>{lang}</option>
          ))}
        </select>
      </p>

      <p className="wizard">
        <b>I want to study:</b>
        <br />
        L2:
        {/* alert('Please choose your language you want to read/study (L2)!'); */}
        <select name="l2" id="l2" ref={refMap.l2}>
          <option value="" selected>
            [Choose...]
          </option>
          {AvailableLangs.map((lang) => (
            <option value={lang}>{lang}</option>
          ))}
        </select>
      </p>

      <p className="wizard">
        <input
          type="button"
          style={{ fontSize: '1.1em' }}
          value="Set Language Settings"
          onClick={() =>
            onSubmit({ wizardData: (_, map) => [map.l1, map.l2] }, (data) =>
              onSuccess(
                {
                  LgName: data.l1,
                  ...WizardData[data.l1 as keyof typeof WizardData],
                },
                {
                  LgName: data.l2,
                  ...WizardData[data.l2 as keyof typeof WizardData],
                }
              )
            )
          }
        />
      </p>

      <p className="wizard">
        <input type="button" value="Cancel" onClick={() => onExit()} />
      </p>
    </div>
  );
}
