import React from 'react';
import { LanguagesId } from '../data/validators';
import { useData } from '../hooks/useData';

export function LanguageDropdown({
  header = 'Choose...',
  name = 'LgID',
  defaultValue,
  onChange,
  dropdownRef,
}: {
  header?: string;
  name?: string;
  defaultValue?: LanguagesId;
  onChange?: (value: LanguagesId) => void;
  dropdownRef?: React.MutableRefObject<any>;
}): JSX.Element {
  const [{ languages }] = useData(['languages']);

  return (
    <select
      name={name}
      value={defaultValue}
      className="notempty setfocus"
      onChange={(val) =>
        onChange ? onChange(Number.parseInt(val.target.value)) : () => {}
      }
      ref={dropdownRef}
    >
      <option key={-1} value="-1">
        [{header}]
      </option>
      {languages.map((language) => (
        <option key={language.LgID} value={language.LgID}>
          {language.LgName}
        </option>
      ))}
    </select>
  );
}
