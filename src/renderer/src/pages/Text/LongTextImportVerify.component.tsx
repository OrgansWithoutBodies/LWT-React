import { dataService } from '../../data/data.service';
import { useInternalNavigate } from '../../hooks/useInternalNav';
import { Header } from '../../ui-kit/Header';
import { byteSizeOfString } from '../../utils/utils';
import { resetDirty } from '../Sorting';
import { LongTextType } from './LongTextImport.component';

/**
 *
 */
export function LongTextVerify({
  verifying,
  onCancelVerify,
}: {
  verifying: LongTextType;
  onCancelVerify: () => void;
}): JSX.Element {
  const navigate = useInternalNavigate();
  console.log('TEST123-longtext', verifying);
  return (
    <>
      <Header title="Long Text Import" />

      <p>&nbsp;</p>
      <form
        encType="multipart/form-data"
        action="/long_text_import"
        method="post"
      >
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
                  ? `This long text will be split into ${verifying.length} shorter
                texts - as follows:`
                  : 'This text can fit as a single text'}
              </td>
            </tr>
            <tr>
              <td className="td1 right" colSpan={2}>
                <input
                  type="button"
                  value="Cancel"
                  onClick={() => {
                    resetDirty();
                    navigate('/');
                  }}
                />
                &nbsp; | &nbsp;
                <input
                  type="button"
                  value="Go Back"
                  onClick={() => {
                    resetDirty();
                    onCancelVerify();
                  }}
                />
                &nbsp; | &nbsp;
                <input
                  type="button"
                  value={`Create ${verifying.length} texts`}
                  onClick={() => {
                    verifying.forEach((text) => {
                      dataService.addText(text);
                    });
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
                  Length:
                  <br />
                  {byteSizeOfString(TxText)}
                  <br />
                  Bytes
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