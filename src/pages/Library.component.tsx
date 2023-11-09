import { Icon } from '../Icon';
import { TextDetailRow } from '../data/data.query';
import { dataService } from '../data/data.service';
import { useData } from '../data/useAkita';
import { A } from '../nav/InternalLink';
import { Header } from './Header';

export function MultiActions() {
  return (
    <>
      <table className="tab1" cellSpacing={0} cellPadding={5}>
        <tbody>
          <tr>
            <th className="th1" colSpan={2}>
              Multi Actions
              <Icon src="lightning" title="Multi Actions" />
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
          &&nbsp;Test
        </th>
        <th className="th1 sorttable_nosort">Actions</th>
        <th className="th1 clickable">
          Title [Tags] / Audio:&nbsp;
          <Icon src="speaker-volume" title="With Audio" />
          , Src.Link:&nbsp;
          <Icon src="chain" title="Source Link available" />
          , Ann.Text:&nbsp;
          <Icon src="tick" title="Annotated Text available" />
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
function LibraryFooter({
  numTexts,
  currentPage,
  numPages,
}: {
  numTexts: number;
  currentPage: number;
  numPages: number;
}): JSX.Element {
  return (
    <table className="tab1" cellSpacing={0} cellPadding={5}>
      <tbody>
        <tr>
          <th className="th1">
            {/* style={{whiteSpace:"nowrap"}} */}
            {numTexts} Texts
          </th>
          <th className="th1">
            {/* style={{whiteSpace:"nowrap"}} */}
            &nbsp; &nbsp;
            <Icon src="placeholder" alt="-" />
            {/* {true}&nbsp; */}
            <Icon src="placeholder" alt="-" />
            {/* TODO pagination */}
            &nbsp; Page
            <select name="page2">
              {new Array(numPages).fill(0).map((_, ii) => {
                return <option value={ii + 1}>{ii + 1}</option>;
              })}
            </select>
            <A href={`/edit_texts?page=${currentPage + 1}`}>
              <Icon src="control" title="Next Page" />
            </A>
            {/* selected="selected" of 2&nbsp; */}
            <A href={`/edit_texts?page=${currentPage + 1}`}>
              <Icon src="control" title="Next Page" />
            </A>
            &nbsp;
            <A href={`/edit_texts?page=${numPages}`}>
              <Icon src="control-stop" title="Last Page" />
            </A>
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
        <A>
          {/* name="rec2" */}
          <input
            name="marked[]"
            className="markcheck"
            type="checkbox"
            value="2"
          />
        </A>
      </td>
      <td className="td1 center">
        {/* style={{whiteSpace:"nowrap"}} */}
        &nbsp;
        <A href={`/do_text?start=${text.TxID}`}>
          <Icon src="book-open-bookmark" title="Read" />
        </A>
        &nbsp;
        <A href={`/do_test?text=${text.TxID}`}>
          <Icon src="question-balloon" title="Test" />
        </A>
        &nbsp;
      </td>
      <td className="td1 center">
        {/* style={{whiteSpace:"nowrap"}} */}
        &nbsp;
        <A href={`/print_text?text=${text.TxID}`}>
          <Icon src="printer" title="Print" />
        </A>
        &nbsp;
        <A href={`/edit_texts?arch=${text.TxID}`}>
          <Icon src="inbox-download" title="Archive" />
        </A>
        &nbsp;
        <A href={`/edit_texts?chg=${text.TxID}`}>
          <Icon src="document--pencil" title="Edit" />
        </A>
        &nbsp;
        <span
          className="click"
          onClick={() => dataService.deleteText(text.TxID)}
        >
          <Icon src="minus-button" title="Delete" />
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
        {text.audioAvailable && <Icon src="speaker-volume" />}
        {text.link && <Icon src="chain" />}
        {text.annotatedAvailable && <Icon src="tick" />}
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
  const pageSize = 10;
  const numPages = textDetails ? Math.ceil(textDetails.length / pageSize) : 0;
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
          <LibraryFooter
            numTexts={textDetails ? textDetails.length : 0}
            currentPage={0}
            numPages={numPages}
          />
        </>
      )}
    </>
  );
}
export function makePager({ currentpage, pages, script, formname, inst }: {}) {
  return (
    <>
      {currentpage > 1 ? (
        <>
          {/* TODO */}
          <A href="<?php echo script; ?>?page=1">
            <Icon src="control-stop-180" title="First Page" />
          </A>
          &nbsp;
          {/* TODO */}
          <A href="<?php echo script; ?>?page=<?php echo currentpage - 1; ?>">
            <Icon src="control-180" title="Previous Page" />
          </A>
          &nbsp;
        </>
      ) : (
        <>
          &nbsp; &nbsp;
          <Icon src="placeholder" alt="-" />
          &nbsp;
          <Icon src="placeholder" alt="-" />
          &nbsp;
        </>
      )}
      {pages === 1 ? (
        '1'
      ) : (
        <select
          // TODO
          name="page<?php echo inst; ?>"
          // TODO
          onChange="{val=document.<?php echo formname; ?>.page<?php echo inst; ?>.options[document.<?php echo formname; ?>.page<?php echo inst; ?>.selectedIndex].value; location.href='<?php echo script; ?>?page=' + val;}"
        >
          {'<?php echo get_paging_selectoptions(currentpage, pages); ?>'}
        </select>
      )}{' '}
      {' of '} {pages} {'&nbsp; '}
      {currentpage < pages ? (
        <>
          {/* TODO */}
          <A href="<?php echo script; ?>?page=<?php echo currentpage + 1; ?>">
            <Icon src="control" title="Next Page" />
          </A>
          &nbsp;
          {/* TODO */}
          <A href="<?php echo script; ?>?page=<?php echo pages; ?>">
            <Icon src="control-stop" title="Last Page" />
          </A>
          &nbsp; &nbsp;
        </>
      ) : (
        <>
          <Icon src="placeholder" alt="-" />
          &nbsp;
          <Icon src="placeholder" alt="-" />
          &nbsp; &nbsp;
        </>
      )}
    </>
  );
}
