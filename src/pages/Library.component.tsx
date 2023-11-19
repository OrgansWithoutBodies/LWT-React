import { useRef, useState } from 'react';
import { Icon } from '../Icon';
import { TextDetailRow } from '../data/data.query';
import { dataService } from '../data/data.service';
import { useData } from '../data/useAkita';
import { A } from '../nav/InternalLink';
import { useInternalNavigate, useUpdateParams } from '../nav/useInternalNav';
import { LanguageDropdown } from '../ui-kit/LanguageDropdown';
import { Pager } from '../ui-kit/Pager';
import { Header } from './Header';

export function MultiActions() {
  return (
    <>
      <form
        name="form1"
        action="#"
        // TODO
        onSubmit="document.form1.querybutton.click(); return false;"
      >
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
                {/* TODO */}
                {/* onClick="selectToggle(true,'form2');" */}
                <input type="button" value="Mark None" />
                {/* TODO */}
                {/* onClick="selectToggle(false,'form2');" */}
              </td>
              <td className="td1 center">
                Marked Texts
                <select name="markaction" id="markaction" disabled={true}>
                  {/* TODO */}
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
      </form>
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
    <>
      <table className="tab1" cellSpacing={0} cellPadding={5}>
        <tbody>
          <tr>
            <th style={{ whiteSpace: 'nowrap' }} className="th1">
              {numTexts} Texts
            </th>
            <th style={{ whiteSpace: 'nowrap' }} className="th1">
              &nbsp; &nbsp;
              <Icon src="placeholder" alt="-" />
              <Icon src="placeholder" alt="-" />
              <Pager currentPage={currentPage} numPages={numPages} />
            </th>
          </tr>
        </tbody>
      </table>
    </>
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
      <td style={{ whiteSpace: 'nowrap' }} className="td1 center">
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
      <td className="td1 center" style={{ whiteSpace: 'nowrap' }}>
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

export function Library({
  currentPage,
  query = null,
}: {
  currentPage: number;
  query: string | null;
}) {
  const [{ textDetails, activeLanguage }] = useData([
    'textDetails',
    'activeLanguage',
  ]);
  const pageSize = 10;
  const numPages = textDetails ? Math.ceil(textDetails.length / pageSize) : 0;
  const paramUpdater = useUpdateParams();
  const navigator = useInternalNavigate();
  const queryRef = useRef<HTMLInputElement | undefined>();
  // TODO
  const [selectedTags, setSelectedTags] = useState([]);

  return (
    <>
      <Header
        title={activeLanguage ? `My ${activeLanguage.LgName} Texts` : ''}
      />
      <p>
        <A href={`/edit_texts?new=${1}`}>
          <Icon src="plus-button" title="New" /> New Text ...
        </A>
        &nbsp; | &nbsp;
        <A href="/long_text_import">
          <Icon src="plus-button" title="Long Text Import" /> Long Text Import
          ...
        </A>
      </p>

      <form
        name="form1"
        action="#"
        onSubmit="document.form1.querybutton.click(); return false;"
      >
        <table className="tab1" cellSpacing={0} cellPadding={5}>
          <tr>
            <th className="th1" colSpan={4}>
              Filter <Icon src="funnel" title="Filter" />
              &nbsp;
              <input
                type="button"
                value="Reset All"
                // TODO
                onClick="resetAll('edit_texts.php');"
              />
            </th>
          </tr>
          <tr>
            <td className="td1 center" colSpan={2}>
              Language:
              {/* onChange="{setLang(document.form1.filterlang,'edit_texts.php');}" */}
              {/* name="filterlang" */}
              <LanguageDropdown defaultValue={activeLanguage?.LgID} />
            </td>
            <td className="td1 center" colSpan={2}>
              Text Title (Wildc.=*):
              <input
                type="text"
                name="query"
                ref={queryRef}
                defaultValue={query || ''}
                maxLength={50}
                size={15}
              />
              &nbsp;
              <input
                type="button"
                name="querybutton"
                value="Filter"
                onClick={() =>
                  navigator(
                    `/edit_texts?page=1&query=${queryRef.current?.value || ''}`
                  )
                }
              />
              &nbsp;
              <input
                type="button"
                value="Clear"
                onClick={() => {
                  navigator('/edit_texts?page=1&query=');
                  queryRef.current.value = '';
                }}
              />
            </td>
          </tr>
          <tr>
            <td
              className="td1 center"
              colSpan={2}
              style={{ whiteSpace: 'nowrap' }}
            >
              Tag #1:
              <select
                name="tag1"
                // TODO
                onChange="{val=document.form1.tag1.options[document.form1.tag1.selectedIndex].value; location.href='edit_texts.php?page=1&amp;tag1=' + val;}"
              >
                {/* TODO */}
                {/* <?php echo get_texttag_selectoptions($currenttag1,$currentlang); ?> */}
              </select>
            </td>
            <td className="td1 center" style={{ whiteSpace: 'nowrap' }}>
              Tag #1 ..
              <select
                name="tag12"
                // TODO
                onChange="{val=document.form1.tag12.options[document.form1.tag12.selectedIndex].value; location.href='edit_texts.php?page=1&amp;tag12=' + val;}"
              >
                {/* TODO */}
                {/* <?php echo get_andor_selectoptions($currenttag12); ?> */}
              </select>
              .. Tag #2
            </td>
            <td className="td1 center" style={{ whiteSpace: 'nowrap' }}>
              Tag #2:
              <select
                name="tag2"
                // TODO
                onChange="{val=document.form1.tag2.options[document.form1.tag2.selectedIndex].value; location.href='edit_texts.php?page=1&amp;tag2=' + val;}"
              >
                {/* TODO */}
                {/* <?php echo get_texttag_selectoptions($currenttag2,$currentlang); ?> */}
              </select>
            </td>
          </tr>

          {/* TODO */}
          {/* <?php if($recno > 0) { ?> */}
          <tr>
            <th className="th1" colSpan={1} style={{ whiteSpace: 'nowrap' }}>
              {/* TODO */}
              {/* <?php echo $recno; ?> Text<?php echo ($recno==1?'':'s'); ?> */}
            </th>
            <th className="th1" colSpan={2} style={{ whiteSpace: 'nowrap' }}>
              {/* TODO */}
              <Pager currentPage={currentPage} numPages={numPages} />
              {/* <?php makePager ($currentpage, $pages, 'edit_texts.php', 'form1', 1); ?> */}
            </th>
            <th className="th1" colSpan={1} style={{ whiteSpace: 'nowrap' }}>
              Sort Order:
              <select
                name="sort"
                // TODO
                onChange="{val=document.form1.sort.options[document.form1.sort.selectedIndex].value; location.href='edit_texts.php?page=1&amp;sort=' + val;}"
              >
                {/* TODO */}
                {/* <?php echo get_textssort_selectoptions($currentsort); ?> */}
              </select>
            </th>
          </tr>
        </table>
      </form>

      <MultiActions />
      {activeLanguage && (
        <>
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
            currentPage={currentPage}
            numPages={numPages}
          />
        </>
      )}
    </>
  );
}
