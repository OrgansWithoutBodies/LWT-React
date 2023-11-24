// export function LanguageDropdown({
//   header = 'Choose...',
//   name = 'LgID',
//   onSelect,
// }: {
//   header?: string;
//   name?: string;
//   onSelect?: (value: number) => void;
// }): JSX.Element {
//   const [{ languages }] = useData(['languages']);

//   return (
//     <select name={name} className="notempty setfocus">
//       <option value="-1">[{header}]</option>
//       {languages.map((language) => {
//         return <option value={language.LgID}>{language.LgName}</option>;
//       })}
//     </select>
//   );
// }

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
