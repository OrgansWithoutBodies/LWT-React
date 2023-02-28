import React from 'react';
import { Header } from './Header';
import { byteSizeOfString } from './utils';

export function LongTextVerify(): JSX.Element {
  const shorterTexts = [
    { text: 'test123' },
    { text: 'test1234' },
    { text: 'test1234帮' },
  ];
  return (
    <>
      <Header title="Long Text Import" />

      <p>&nbsp;</p>
      <form
        encType="multipart/form-data"
        action="/long_text_import.php"
        method="post"
      >
        <input type="hidden" name="LgID" value="2" />
        <input type="hidden" name="TxTitle" value="fdasfdsa" />
        <input type="hidden" name="TxSourceURI" value="" />
        <input type="hidden" name="TextTags" value="null" />
        <input type="hidden" name="TextCount" value="12" />
        <table className="tab3" cellSpacing="0" cellPadding={5}>
          <tbody>
            <tr>
              <td className="td1" colSpan={2}>
                {/* TODO plural */}
                This long text will be split into {shorterTexts.length} shorter
                texts - as follows:
              </td>
            </tr>
            <tr>
              <td className="td1 right" colSpan={2}>
                <input
                  type="button"
                  value="Cancel"
                  // onClick="{resetDirty(); location.href='index.php';}"
                />
                &nbsp; | &nbsp;
                <input
                  type="button"
                  value="Go Back"
                  // onClick="{resetDirty(); history.back();}"
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
