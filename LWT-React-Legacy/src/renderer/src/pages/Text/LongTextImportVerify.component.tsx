import { AddNewTextType } from 'lwt-schemas';
import { dataService } from 'lwt-state';
import { Header, useI18N, useInternalNavigate } from 'lwt-ui-kit';

export function LongTextVerify({
  verifying,
  onCancelVerify,
}: {
  verifying: AddNewTextType[];
  onCancelVerify: () => void;
}): JSX.Element {
  const navigate = useInternalNavigate();
  const t = useI18N();
  return (
    <>
      <Header title="Long Text Import" />

      <p>&nbsp;</p>
      <form
        // TODO
        encType="multipart/form-data"
      >
        {/* TODO */}
        <input type="hidden" name="LgID" value="2" />
        <input type="hidden" name="TxTitle" value="TODO" />
        <input type="hidden" name="TxSourceURI" value="" />
        <input type="hidden" name="TextTags" value="null" />
        <input type="hidden" name="TextCount" value="12" />
        <table className="tab3" cellSpacing={0} cellPadding={5}>
          <tbody>
            <tr>
              <td className="td1" colSpan={2}>
                {verifying.length > 1
                  ? t(
                      `This long text will be split into ${verifying.length} shorter
                texts - as follows:` as any
                    )
                  : t('This text can fit as a single text')}
              </td>
            </tr>
            <tr>
              <td className="td1 right" colSpan={2}>
                <input
                  type="button"
                  value="Cancel"
                  onClick={() => {
                    navigate('/');
                  }}
                />
                &nbsp; | &nbsp;
                <input
                  type="button"
                  value="Go Back"
                  onClick={() => {
                    onCancelVerify();
                  }}
                />
                &nbsp; | &nbsp;
                <input
                  type="button"
                  value={`Create ${verifying.length} texts`}
                  onClick={() => {
                    dataService.addMultipleTexts(verifying);
                  }}
                />
              </td>
            </tr>

            {verifying.map(({ TxText }, ii) => (
              <tr>
                <td className="td1 right">
                  <b>Text {ii + 1}:</b>
                  <br />
                  <br />
                  <br />
                  {t('Length:\n{byteSizeOfString(TxText)}\nBytes')}
                </td>
                <td className="td1">
                  <textarea
                    readOnly
                    name={`text[${ii}]`}
                    cols={60}
                    rows={10}
                    defaultValue={TxText}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </form>
    </>
  );
}
