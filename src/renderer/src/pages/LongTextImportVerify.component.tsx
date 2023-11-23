import { useInternalNavigate } from '../nav/useInternalNav';
import { Header } from './Header';
import { byteSizeOfString } from './utils';

export function LongTextVerify(): JSX.Element {
  const shorterTexts = [
    { text: 'test123' },
    { text: 'test1234' },
    { text: 'test1234帮' },
  ];
  const navigate = useInternalNavigate();

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
        <input type="hidden" name="TxTitle" value="fdasfdsa" />
        <input type="hidden" name="TxSourceURI" value="" />
        <input type="hidden" name="TextTags" value="null" />
        <input type="hidden" name="TextCount" value="12" />
        <table className="tab3" cellSpacing={0} cellPadding={5}>
          <tbody>
            <tr>
              <td className="td1" colSpan={2}>
                {shorterTexts.length > 1
                  ? `This long text will be split into ${shorterTexts.length} shorter
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
                    // TODO
                    const resetDirty = () => {};
                    resetDirty();
                    navigate('/');
                  }}
                />
                &nbsp; | &nbsp;
                <input
                  type="button"
                  value="Go Back"
                  // TODO
                  onClick="{resetDirty(); history.back();}"
                />
                &nbsp; | &nbsp;
                <input
                  type="submit"
                  name="op"
                  value={`Create ${shorterTexts.length} texts`}
                />
              </td>
            </tr>

            {shorterTexts.map((text, ii) => {
              return (
                <tr>
                  <td className="td1 right">
                    <b>Text {ii + 1}:</b>
                    <br />
                    <br />
                    <br />
                    Length:
                    <br />
                    {byteSizeOfString(text.text)}
                    <br />
                    Bytes
                  </td>
                  <td className="td1">
                    <textarea readOnly name="text[0]" cols={60} rows={10}>
                      {text.text}
                    </textarea>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </form>
    </>
  );
}
