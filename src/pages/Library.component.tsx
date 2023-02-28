import React from 'react';
import { TextDetailRow } from '../data/data.query';
import { dataService } from '../data/data.service';
import { useData } from '../data/useAkita';
import { Icon } from '../Icon';
import { Header } from './Header';

export function MultiActions() {
  return (
    <>
      <table className="tab1" cellSpacing={0} cellPadding={5}>
        <tbody>
          <tr>
            <th className="th1" colSpan={2}>
              Multi Actions
              <Icon
                iconName="lightning"
                title="Multi Actions"
                alt="Multi Actions"
              />
            </th>
          </tr>
          <tr>
            <td className="td1 center">
              <input type="button" value="Mark All" />
              {/* onClick="selectToggle(true,'form2');" */}
              <input type="button" value="Mark None" />
              {/* onClick="selectToggle(false,'form2');" */}
            </td>
            <td className="td1 center">
              Marked Texts
              <select name="markaction" id="markaction" disabled={true}>
                {/* onchange="multiActionGo(document.form2, document.form2.markaction);" */}
                <option value=""></option>
                {/* selected="selected" */}
                <option disabled={true}>------------</option>
                <option value="test">Test Marked Texts</option>
                <option disabled={true}>------------</option>
                <option value="addtag">Add Tag</option>
                <option value="deltag">Remove Tag</option>
                <option disabled={true}>------------</option>
                <option value="rebuild">Reparse Texts</option>
                <option value="setsent">Set Term Sentences</option>
                <option disabled={true}>------------</option>
                <option value="arch">Archive Marked Texts</option>
                <option disabled={true}>------------</option>
                <option value="del">Delete Marked Texts</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

function LibraryHeader(): JSX.Element {
  return (
    <thead>
      <tr>
        <th className="th1 sorttable_nosort">Mark</th>
        <th className="th1 sorttable_nosort">
          Read
          <br />
          &amp;&nbsp;Test
        </th>
        <th className="th1 sorttable_nosort">Actions</th>
        <th className="th1 clickable">
          Title [Tags] / Audio:&nbsp;
          <Icon iconName="speaker-volume" title="With Audio" alt="With Audio" />
          , Src.Link:&nbsp;
          <Icon
            iconName="chain"
            title="Source Link available"
            alt="Source Link available"
          />
          , Ann.Text:&nbsp;
          <Icon
            iconName="tick"
            title="Annotated Text available"
            alt="Annotated Text available"
          />
        </th>
        <th className="th1 sorttable_numeric clickable">
          Total
          <br />
          Words
        </th>
        <th className="th1 sorttable_numeric clickable">
          Saved
          <br />
          Wo+Ex
        </th>
        <th className="th1 sorttable_numeric clickable">
          Unkn.
          <br />
          Words
        </th>
        <th className="th1 sorttable_numeric clickable">
          Unkn.
          <br />%
        </th>
      </tr>
    </thead>
  );
}
function LibraryFooter({ numTexts }: { numTexts: number }): JSX.Element {
  return (
    <table className="tab1" cellSpacing={0} cellPadding={5}>
      <tbody>
        <tr>
          <th className="th1">
            {/* nowrap="nowrap" */}
            {numTexts} Texts
          </th>
          <th className="th1">
            {/* nowrap="nowrap" */}
            &nbsp; &nbsp;
            <Icon iconName="placeholder" alt="-" />
            {/* {true}&nbsp; */}
            <Icon iconName="placeholder" alt="-" />
            {/* TODO pagination */}
            &nbsp; Page
            <select name="page2">
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
            {/* selected="selected" of 2&nbsp; */}
            <a href="edit_texts.php?page=2">
              <Icon iconName="control" title="Next Page" alt="Next Page" />
            </a>
            &nbsp;
            <a href="edit_texts.php?page=2">
              <Icon iconName="control-stop" title="Last Page" alt="Last Page" />
            </a>
            &nbsp; &nbsp;
          </th>
        </tr>
      </tbody>
    </table>
  );
}
function LibraryRow({ text }: { text: TextDetailRow }): JSX.Element {
  return (
    <tr>
      <td className="td1 center">
        <a>
          {/* name="rec2" */}
          <input
            name="marked[]"
            className="markcheck"
            type="checkbox"
            value="2"
          />
        </a>
      </td>
      <td className="td1 center">
        {/* nowrap="nowrap" */}
        &nbsp;
        <a href="do_text.php?start=2">
          <Icon iconName="book-open-bookmark" title="Read" alt="Read" />
        </a>
        &nbsp;
        <a href="do_test.php?text=2">
          <Icon iconName="question-balloon" title="Test" alt="Test" />
        </a>
        &nbsp;
      </td>
      <td className="td1 center">
        {/* nowrap="nowrap" */}
        &nbsp;
        <a href="print_text.php?text=30">
          <Icon iconName="printer" title="Print" alt="Print" />
        </a>
        &nbsp;
        <a href="/edit_texts.php?arch=30">
          <Icon iconName="inbox-download" title="Archive" alt="Archive" />
        </a>
        &nbsp;
        <a href="/edit_texts.php?chg=30">
          <Icon iconName="document--pencil" title="Edit" alt="Edit" />
        </a>
        &nbsp;
        <span
          className="click"
          onClick={() => dataService.deleteText(text.TxID)}
        >
          <Icon iconName="minus-button" title="Delete" alt="Delete" />
        </span>
        &nbsp;
      </td>
      <td className="td1 center">
        {text.title}
        <span className="smallgray2">
          {text.tags &&
            '[' +
              text.tags.map((tag, ii) => {
                return ii > 0 ? ' ' + tag : tag;
              }) +
              ']'}
        </span>
        {text.audioAvailable && <Icon iconName="speaker-volume" />}
        {text.link && <Icon iconName="chain" />}
        {text.annotatedAvailable && <Icon iconName="tick" />}
      </td>
      <td className="td1 center">{text.totalWords}</td>
      <td className="td1 center">{text.saved}</td>
      <td className="td1 center">{text.unk}</td>
      <td className="td1 center">{text.unkPerc}</td>
    </tr>
  );
}

export function Library() {
  const [{ textDetails, activeLanguage }] = useData([
    'textDetails',
    'activeLanguage',
  ]);

  return (
    <>
      {activeLanguage && (
        <>
          <Header
            title={activeLanguage ? `My ${activeLanguage.LgName} Texts` : ''}
          />

          <table className="sortable tab1">
            <LibraryHeader />
            <tbody>
              {textDetails &&
                textDetails.map((text) => {
                  return <LibraryRow text={text} />;
                })}
            </tbody>
          </table>
          <LibraryFooter numTexts={textDetails ? textDetails.length : 0} />
        </>
      )}
    </>
  );
}
