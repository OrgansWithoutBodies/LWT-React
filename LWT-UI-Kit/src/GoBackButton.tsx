// TODO

import { UIString } from 'lwt-i18n';
import { useI18N } from 'lwt-ui-kit';

export function GoBackButton({
  onBack = () => history.back(),
  backText = '&lt;&lt; Back',
}: {
  onBack?: () => void;
  backText?: UIString;
}) {
  const t = useI18N();
  return (
    <>
      <br />
      <input type="button" value={t(backText)} onClick={onBack} />
    </>
  );
}

/**
 * @TODO
 * @param isError
 */
export function BackOnError(isError: boolean) {
  return isError ? (
    <GoBackButton backText="&lt;&lt; Go back and correct &lt;&lt;" />
  ) : (
    <></>
  );
}
