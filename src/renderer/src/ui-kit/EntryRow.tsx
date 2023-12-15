import { PropsWithChildren } from 'react';
import { openInNewWindow } from '../utils/openInNewWindow';
import { Icon } from './Icon';

export interface EntryRowType {
  headerClasses?: string[];
  // TODO hacky
  PreMapComponent?: () => JSX.Element;
  entryTitle?: string;
  headerText: string;
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
        {headerText.split('\n').map((val) => (
          <>
            {val}
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
            :
            <br />
          </>
        ))}
      </td>
      <td className="td1">{children}</td>
    </tr>
  );
}
