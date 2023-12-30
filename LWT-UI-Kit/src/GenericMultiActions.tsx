import { pluralize } from "lwt-common";
import { Icon, useI18N } from "lwt-ui-kit";

export function GenericMultiActions({
  AllActions,
  SelectedOptions,
  onChangeAll,
  onChangeSelected,
  countAllTerms: countAllTerms,
  countSelectedTerms: countSelectedTerms,
  onSelectAll,
  onSelectNone,
  nounSingular: nounSingular,
}: {
  AllActions: null | (() => JSX.Element);
  SelectedOptions: () => JSX.Element;
  // TODO typewise enforce possible select values
  onChangeAll: null | React.ChangeEventHandler<HTMLSelectElement>;
  onChangeSelected: React.ChangeEventHandler<HTMLSelectElement>;
  countAllTerms: null | number;
  countSelectedTerms: number;
  onSelectAll: () => void;
  onSelectNone: () => void;
  nounSingular: "Tag" | "Text" | "Term";
}) {
  const t = useI18N();
  return (
    <table className="tab1" cellSpacing={0} cellPadding={5}>
      <tbody>
        <tr>
          <th className="th1" colSpan={2}>
            {t("Multi Actions")}
            <Icon src="lightning" title="Multi Actions" />
          </th>
        </tr>
        {AllActions && onChangeAll && countAllTerms !== null && (
          <tr>
            <td className="td1 center" colSpan={2}>
              <b>ALL</b> {countAllTerms} {nounSingular}
              {pluralize(countAllTerms)}&nbsp;
              <select name="allaction" onChange={onChangeAll}>
                <AllActions />
              </select>
            </td>
          </tr>
        )}
        <tr>
          <td className="td1 center">
            <input type="button" value="Mark All" onClick={onSelectAll} />
            <input type="button" value="Mark None" onClick={onSelectNone} />
          </td>
          <td className="td1 center">
            {t(`Marked ${nounSingular}`)}
            {/* TODO doesnt work w i18n */}
            {pluralize(countSelectedTerms)}:
            <select
              name="markaction"
              id="markaction"
              onChange={onChangeSelected}
              disabled={countSelectedTerms === 0}
            >
              <SelectedOptions />
            </select>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
