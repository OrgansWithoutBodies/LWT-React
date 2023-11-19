import { Icon } from './Icon';
import { Header } from './pages/Header';
import { LanguageDropdown } from './ui-kit/LanguageDropdown';

export function UploadWords() {
  return (
    <>
      <Header />
      <form
        encType="multipart/form-data"
        className="validate"
        action="<?php echo $_SERVER['PHP_SELF']; ?>"
        method="post"
        onSubmit="{return confirm ('Did you double-check everything?\nAre you sure?');}"
      >
        <table className="tab3" cellSpacing={0} cellPadding={5}>
          <tr>
            <td className="td1 center">
              <b>Language:</b>
            </td>
            <td className="td1">
              {/* <select name="LgID" className="notempty setfocus"> */}
              <LanguageDropdown />
              <Icon src="status-busy" title="Field must not be empty" />
            </td>
          </tr>
          <tr>
            <td className="td1 center">
              <b>Import Data:</b>
              <br />
              <br />
              Format per line:
              <br />
              C1 D C2 D C3 D C4 D C5
              <br />
              <br />
              <b>Field Delimiter "D":</b>
              <br />
              <select name="Tab">
                <option value="c" selected="selected">
                  Comma "," [CSV File, LingQ]
                </option>
                <option value="t">TAB (ASCII 9) [TSV File]</option>
                <option value="h">Hash "#" [Direct Input]</option>
              </select>
              <br />
              <br />
              <b>Column Assignment:</b>
              <br />
              "C1":{' '}
              <select name="Col1">
                <option value="w" selected="selected">
                  Term
                </option>
                <option value="t">Translation</option>
                <option value="r">Romanization</option>
                <option value="s">Sentence</option>
                <option value="g">Tag List</option>
                <option value="x">Don't import</option>
              </select>
              <br />
              "C2":{' '}
              <select name="Col2">
                <option value="w">Term</option>
                <option value="t" selected="selected">
                  Translation
                </option>
                <option value="r">Romanization</option>
                <option value="s">Sentence</option>
                <option value="g">Tag List</option>
                <option value="x">Don't import</option>
              </select>
              <br />
              "C3":{' '}
              <select name="Col3">
                <option value="w">Term</option>
                <option value="t">Translation</option>
                <option value="r">Romanization</option>
                <option value="s">Sentence</option>
                <option value="g">Tag List</option>
                <option value="x" selected="selected">
                  Don't import
                </option>
              </select>
              <br />
              "C4":{' '}
              <select name="Col4">
                <option value="w">Term</option>
                <option value="t">Translation</option>
                <option value="r">Romanization</option>
                <option value="s">Sentence</option>
                <option value="g">Tag List</option>
                <option value="x" selected="selected">
                  Don't import
                </option>
              </select>
              <br />
              "C5":{' '}
              <select name="Col5">
                <option value="w">Term</option>
                <option value="t">Translation</option>
                <option value="r">Romanization</option>
                <option value="s">Sentence</option>
                <option value="g">Tag List</option>
                <option value="x" selected="selected">
                  Don't import
                </option>
              </select>
              <br />
              <br />
              <b>
                Overwrite existent
                <br />
                terms
              </b>
              :
              <select name="Over">
                <option value="0" selected="selected">
                  No
                </option>
                <option value="1">Yes</option>
              </select>
              <br />
              <br />
              <b>Important:</b>
              <br />
              You must specify the term.
              <br />
              Translation, romanization, <br />
              sentence and tag list
              <br />
              are optional. The tag list <br />
              must be separated either
              <br />
              by spaces or commas.
            </td>
            <td className="td1">
              Either specify a <b>File to upload</b>:<br />
              <input name="thefile" type="file" />
              <br />
              <br />
              <b>Or</b> type in or paste from clipboard (do <b>NOT</b> specify
              file):
              <br />
              <textarea
                className="checkoutsidebmp"
                data_info="Upload"
                name="Upload"
                cols={60}
                rows={25}
              ></textarea>
            </td>
          </tr>
          <tr>
            <td className="td1 center">
              <b>Status</b> for all uploaded terms:
            </td>
            <td className="td1">
              <select className="notempty" name="WoStatus">
                {/* <?php echo get_wordstatus_selectoptions(NULL,false,false); ?> */}
              </select>{' '}
              <Icon src="status-busy" title="Field must not be empty" />
            </td>
          </tr>
          <tr>
            <td className="td1 center" colSpan={2}>
              <span className="red2">
                A DATABASE{' '}
                <input
                  type="button"
                  value="BACKUP"
                  onClick="location.href='backup_restore.php';"
                />{' '}
                MAY BE ADVISABLE!
                <br />
                PLEASE DOUBLE-CHECK EVERYTHING!
              </span>
              <br />
              <input
                type="button"
                value="&lt;&lt; Back"
                onClick="location.href='index.php';"
              />{' '}
              &nbsp; &nbsp; &nbsp; | &nbsp; &nbsp; &nbsp;{' '}
              <input type="submit" name="op" value="Import" />
            </td>
          </tr>
        </table>
      </form>

      <p>
        Sentences should contain the term in curly brackets {'"... {term} ..."'}
        .
        <br />
        If not, such sentences can be automatically created later with the{' '}
        <br />
        "Set Term Sentences" action in the{' '}
        <input
          type="button"
          value="My Texts"
          onClick="location.href='edit_texts.php?query=&amp;page=1';"
        />{' '}
        screen.
      </p>
    </>
  );
}
