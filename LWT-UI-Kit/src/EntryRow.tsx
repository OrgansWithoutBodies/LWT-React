import { openInNewWindow } from "lwt-common";
import { EntryRowType } from "lwt-schemas";
import { PropsWithChildren } from "react";
import { I18N } from "./I18N";
import { Icon } from "./Icon";

export function EntryRow({
  headerClasses = [],
  entryTitle,
  children,
  headerText,
  headerInfoLink,
  headerDir = "right",
  PreMapComponent,
}: PropsWithChildren<EntryRowType>): JSX.Element {
  return (
    <tr title={entryTitle}>
      {PreMapComponent && <PreMapComponent />}
      <td className={`td1 ${headerDir} ${headerClasses.join(" ")}`}>
        <I18N i={headerText} />
        {headerInfoLink ? (
          <Icon
            className="click"
            src="question-frame"
            title="Help"
            onClick={() => {
              openInNewWindow(headerInfoLink);
            }}
          />
        ) : (
          <></>
        )}
      </td>
      <td className="td1">{children}</td>
    </tr>
  );
}
