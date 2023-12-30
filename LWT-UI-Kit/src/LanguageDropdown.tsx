import { UIString } from "lwt-i18n";
import { LanguagesID } from "lwt-schemas";
import { useData } from "lwt-state";
import React from "react";
import { useI18N } from ".";

export function LanguageDropdown({
  header = "Choose...",
  name = "LgID",
  defaultValue,
  onChange,
  dropdownRef,
}: {
  header?: UIString;
  name?: string;
  defaultValue?: LanguagesID;
  onChange?: (value: LanguagesID) => void;
  dropdownRef?: React.MutableRefObject<any>;
}): JSX.Element {
  const [{ languages }] = useData(["languages"]);
  const t = useI18N();
  return (
    <select
      name={name}
      value={defaultValue}
      className="notempty setfocus"
      onChange={({ target: { value } }) =>
        onChange && value !== "-1"
          ? onChange(Number.parseInt(value) as LanguagesID)
          : () => {}
      }
      ref={dropdownRef}
    >
      <option key={-1} disabled value="-1">
        [{t(header)}]
      </option>
      {languages.map((language) => (
        <option key={language.LgID} value={language.LgID}>
          {language.LgName}
        </option>
      ))}
    </select>
  );
}
