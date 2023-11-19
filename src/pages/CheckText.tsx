import { Icon } from '../Icon';
import { useInternalNavigate } from '../nav/useInternalNav';
import { LanguageDropdown } from '../ui-kit/LanguageDropdown';
import { Header } from './Header';

export function CheckText(): JSX.Element {
  const shorterTexts = [
    { text: 'test123' },
    { text: 'test1234' },
    { text: 'test1234帮' },
  ];
  const navigate = useInternalNavigate();
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
                <Icon src="status-busy" title="Field must not be empty" />
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
                  data_maxlength="65000"
                  data_info="Text"
                  cols={60}
                  rows={20}
                ></textarea>
                <Icon src="status-busy" title="Field must not be empty" />
              </td>
            </tr>
            <tr>
              <td className="td1 right" colSpan={2}>
                <input
                  type="button"
                  value="<< Back"
                  onClick={() => {
                    navigate('/');
                  }}
                />
                <input type="submit" name="op" value="Check" />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </>
  );
}
