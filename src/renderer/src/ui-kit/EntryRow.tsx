import { PropsWithChildren } from 'react';
import { I18N } from '../../../i18n/I18N';
import { UIString } from '../../../i18n/strings';
import { openInNewWindow } from '../utils/linkHelpers';
import { Icon } from './Icon';

export interface EntryRowType {
  headerClasses?: string[];
  // TODO hacky
  PreMapComponent?: () => JSX.Element;
  entryTitle?: string;
  headerText: UIString;
  headerInfoLink?: string;
  headerDir?: 'left' | 'right' | 'center';
}

export function EntryRow({
  headerClasses = [],
  entryTitle,
  children,
  headerText,
  headerInfoLink,
  headerDir = 'right',
  PreMapComponent,
}: PropsWithChildren<EntryRowType>): JSX.Element {
  return (
    <tr title={entryTitle}>
      {PreMapComponent && <PreMapComponent />}
      <td className={`td1 ${headerDir} ${headerClasses.join(' ')}`}>
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
