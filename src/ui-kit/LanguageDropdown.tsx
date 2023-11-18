import React from 'react';
import { useData } from '../data/useAkita';
import { LanguagesId } from '../data/validators';

export function LanguageDropdown({
  header = 'Choose...',
  name = 'LgID',
  defaultValue,
  onSelect,
  dropdownRef,
}: {
  header?: string;
  name?: string;
  defaultValue?: LanguagesId;
  onSelect?: (value: number) => void;
  dropdownRef?: React.MutableRefObject<any>;
}): JSX.Element {
  const [{ languages }] = useData(['languages']);

  return (
    <select
      name={name}
      value={defaultValue}
      className="notempty setfocus"
      ref={dropdownRef}
    >
      <option value="-1">[{header}]</option>
      {languages.map((language) => {
        return <option value={language.LgID}>{language.LgName}</option>;
      })}
    </select>
  );
}

{
  /* <select
            name="languages"
            value={activeLanguageId}
            onChange={(event) => {
              if (event.target.value !== '-1') {
                dataService.setActiveLanguage(event.target.value);
              }
            }}
          >
            <option value="-1">[Select...]</option>
            {languages.map((lang) => {
              return <option value={lang.LgID}>{lang.LgName}</option>;
            })}
          </select> */
}
