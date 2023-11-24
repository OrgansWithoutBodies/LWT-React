import { RequiredLineButton } from '../Icon';
import { LanguageDropdown } from '../ui-kit/LanguageDropdown';
import { Header } from './Header';
import { NavigateButton } from './Statistics.component';

export function CheckText(): JSX.Element {
  return (
    <>
      <Header title="Check Text" />

      <p>&nbsp;</p>
      <form className="validate" action="/check_text" method="post">
        <table className="tab3" cellSpacing={0} cellPadding={5}>
          <tbody>
            <tr>
              <td className="td1 right">Language:</td>
              <td className="td1">
                <LanguageDropdown />
                <RequiredLineButton />
              </td>
            </tr>
            <tr>
              <td className="td1 right">
                Text:
                <br />
                <br />
                (max.
                <br />
                65,000
                <br />
                bytes)
              </td>
              <td className="td1">
                <textarea
                  name="TxText"
                  className="notempty checkbytes checkoutsidebmp"
                  maxLength={65000}
                  // data_info="Text"
                  cols={60}
                  rows={20}
                ></textarea>
                <RequiredLineButton />
              </td>
            </tr>
            <tr>
              <td className="td1 right" colSpan={2}>
                <NavigateButton value="<< Back" navigateTo="/" />
                <input type="submit" name="op" value="Check" />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </>
  );
}
