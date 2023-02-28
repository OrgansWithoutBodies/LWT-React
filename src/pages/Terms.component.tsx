import React, { useState } from 'react';
import { dataService } from '../data/data.service';
import { Tags, Words } from '../data/parseMySqlDump';
import { useData } from '../data/useAkita';
import { Icon } from '../Icon';
import { LanguageDropdown } from '../ui-kit/LanguageDropdown';
function TagDropDown({ tags }: { tags: Tags[] }): JSX.Element {
  return (
    <select
      name="tag1"
      // onChange="{val=document.form1.tag1.options[document.form1.tag1.selectedIndex].value; location.href='edit_words.php?page=1&amp;tag1=' + val;}"
    >
      <option value="" selected>
        [Filter off]
      </option>
      {tags.map((tag) => {
        return <option value={tag.TgID}>{tag.TgText}</option>;
      })}

      <option disabled>--------</option>
      <option value="-1">UNTAGGED</option>
    </select>
  );
}
function TermsHeader(): JSX.Element {
  return (
    <tr>
      <th className="th1 sorttable_nosort">Mark</th>
      <th className="th1 sorttable_nosort">Act.</th>
      <th className="th1 clickable">
        Term /<br />
        Romanization
      </th>
      <th className="th1 clickable">
        Translation [Tags]
        <br />
        <span id="waitinfo" className="hide">
          Please <img src="icn/waiting2.gif" /> wait ...
        </span>
      </th>
      <th className="th1 sorttable_nosort">
        Se.
        <br />?
      </th>
      <th className="th1 sorttable_numeric clickable">
        Stat./
        <br />
        Days
      </th>
      <th className="th1 sorttable_numeric clickable">
        Score
        <br />%
      </th>
    </tr>
  );
}

// TODO abstract out filterbox
export function TermsFilterBox({
  numTerms,
}: {
  numTerms: number;
}): JSX.Element {
  const [{ languages, tags, texts }] = useData(['languages', 'tags', 'texts']);
  //   TODO
  const numPages = Math.ceil(numTerms / 10);
  const currentPage = 1;
  const [filteredLanguage, setFilteredLanguage] = useState<number>();
  return (
    <table className="tab1" cellSpacing="0" cellPadding={5}>
      <tbody>
        <tr>
          <th className="th1" colSpan={4}>
            Filter
            <Icon iconName="funnel" title="Filter" alt="Filter" />
            &nbsp;
            <input
              type="button"
              value="Reset All"
              // onClick="resetAll('edit_words.php');"
            />
          </th>
        </tr>
        <tr>
          <td className="td1 center" colSpan={2}>
            Language:
            <LanguageDropdown header="Filter off" />
          </td>
          <td className="td1 center" colSpan={2}>
            Text:
            <select
              name="text"
              // onChange="{val=document.form1.text.options[document.form1.text.selectedIndex].value; location.href='edit_words.php?page=1&amp;text=' + val;}"
            >
              <option value="" selected>
                [Filter off]
              </option>
              {texts.map((text) => {
                return <option value={text.TxID}>{text.TxTitle}</option>;
              })}
            </select>
          </td>
        </tr>
        <tr>
          <td className="td1 center" colSpan={2}>
            {/* nowrap="nowrap" */}
            Status:
            <select
              name="status"
              // onChange="{val=document.form1.status.options[document.form1.status.selectedIndex].value; location.href='edit_words.php?page=1&amp;status=' + val;}"
            >
              <option value="" selected>
                [Filter off]
              </option>
              <option value="1">Learning [1]</option>
              <option value="2">Learning [2]</option>
              <option value="3">Learning [3]</option>
              <option value="4">Learning [4]</option>
              <option value="5">Learned [5]</option>
              <option value="99">Well Known [WKn]</option>
              <option value="98">Ignored [Ign]</option>
              <option disabled>--------</option>
              <option value="12">Learning [1..2]</option>
              <option value="13">Learning [1..3]</option>
              <option value="14">Learning [1..4]</option>
              <option value="15">Learning/-ed [1..5]</option>
              <option disabled>--------</option>
              <option value="23">Learning [2..3]</option>
              <option value="24">Learning [2..4]</option>
              <option value="25">Learning/-ed [2..5]</option>
              <option disabled>--------</option>
              <option value="34">Learning [3..4]</option>
              <option value="35">Learning/-ed [3..5]</option>
              <option disabled>--------</option>
              <option value="45">Learning/-ed [4..5]</option>
              <option disabled>--------</option>
              <option value="599">All known [5+WKn]</option>
            </select>
          </td>
          <td className="td1 center" colSpan={2}>
            {/* nowrap="nowrap" */}
            Term, Rom., Transl. (Wildc.=*):
            <input type="text" name="query" value="" maxLength={50} size={15} />
            &nbsp;
            <input
              type="button"
              name="querybutton"
              value="Filter"
              // onClick="{val=document.form1.query.value; location.href='edit_words.php?page=1&amp;query=' + val;}"
            />
            &nbsp;
            <input
              type="button"
              value="Clear"
              // onClick="{location.href='edit_words.php?page=1&amp;query=';}"
            />
          </td>
        </tr>
        <tr>
          <td className="td1 center" colSpan={2}>
            {/* nowrap="nowrap" */}
            Tag #1:
            <TagDropDown tags={tags} />
          </td>
          <td className="td1 center">
            {/* nowrap="nowrap" */}
            Tag #1 ..
            <select
              name="tag12"
              // onChange="{val=document.form1.tag12.options[document.form1.tag12.selectedIndex].value; location.href='edit_words.php?page=1&amp;tag12=' + val;}"
            >
              <option value="0">... OR ...</option>
              <option value="1">... AND ...</option>
            </select>
            .. Tag #2
          </td>
          <td className="td1 center">
            {/* nowrap="nowrap" */}
            Tag #2:
            <TagDropDown tags={tags} />
          </td>
        </tr>
        <tr>
          <th className="th1">
            {/* nowrap="nowrap" */}
            {numTerms} Terms
          </th>
          <th className="th1" colSpan={2}>
            {/* nowrap="nowrap" */}
            &nbsp; &nbsp;
            <Icon iconName="placeholder" alt="-" />
            &nbsp;
            <Icon iconName="placeholder" alt="-" />
            &nbsp; Page
            <select
              name="page1"
              // onChange="{val=document.form1.page1.options[document.form1.page1.selectedIndex].value; location.href='edit_words.php?page=' + val;}"
            >
              {[...new Array(numPages).keys()].map((pageNumber) => {
                const isSelected = currentPage === pageNumber + 1;
                return (
                  <option value={pageNumber + 1} selected={isSelected}>
                    {pageNumber + 1}
                  </option>
                );
              })}
            </select>
            of {numPages}&nbsp;
            <a href="edit_words.php?page=2">
              <Icon iconName="control" title="Next Page" alt="Next Page" />
            </a>
            &nbsp;
            <a href="edit_words.php?page=53">
              <Icon iconName="control-stop" title="Last Page" alt="Last Page" />
            </a>
            &nbsp; &nbsp;
          </th>
          <th className="th1">
            {/* nowrap="nowrap" */}
            Sort Order:
            <select
              name="sort"
              // onChange="{val=document.form1.sort.options[document.form1.sort.selectedIndex].value; location.href='edit_words.php?page=1&amp;sort=' + val;}"
            >
              <option value="1">Term A-Z</option>
              <option value="2">Translation A-Z</option>
              <option value="3" selected>
                Newest first
              </option>
              <option value="7">Oldest first</option>
              <option value="4">Status</option>
              <option value="5">Score Value (%)</option>
              <option value="6">Word Count Active Texts</option>
            </select>
          </th>
        </tr>
      </tbody>
    </table>
  );
}

export function TermsFooter({ numTerms }: { numTerms: number }): JSX.Element {
  const numPages = Math.ceil(numTerms / 10);
  const [currentPage, setCurrentPage] = useState<number>(6);
  return (
    <table className="tab1" cellSpacing="0" cellPadding={5}>
      <tbody>
        <tr>
          <th className="th1">
            {/* nowrap="nowrap" */}
            {/* TODO plural */}
            {numTerms} Terms
          </th>
          <th className="th1">
            {/* nowrap="nowrap" */}
            &nbsp; &nbsp;
            <Icon iconName="placeholder" alt="-" />
            &nbsp;
            <Icon iconName="placeholder" alt="-" />
            {/* TODO abstract this into a page dropdown component? */}
            &nbsp; Page
            <select
              name="page2"
              onChange={({ target }) =>
                setCurrentPage(Number.parseInt(target.value, 10))
              }
            >
              {[...new Array(numPages).keys()].map((pageNumber) => {
                const isSelected = currentPage === pageNumber + 1;
                return (
                  <option value={pageNumber + 1} selected={isSelected}>
                    {pageNumber + 1}
                  </option>
                );
              })}
            </select>
            of {numPages}&nbsp;
            <a href={`edit_words.php?page=${currentPage + 1}`}>
              <Icon iconName="control" title="Next Page" alt="Next Page" />
            </a>
            &nbsp;
            <a href={`edit_words.php?page=${numPages}`}>
              <Icon iconName="control-stop" title="Last Page" alt="Last Page" />
            </a>
            &nbsp; &nbsp;
          </th>
        </tr>
      </tbody>
    </table>
  );
}
function TermLine({ word }: { word: Words }): JSX.Element {
  return (
    <tr>
      <td className="td1 center">
        {/*a name="rec19517" */}
        <a>
          <input
            name="marked[]"
            type="checkbox"
            className="markcheck"
            value="19517"
          />
        </a>
      </td>
      <td className="td1 center">
        {/* nowrap="nowrap" */}
        &nbsp;
        <a href="/edit_words.php?chg=19517">
          <Icon iconName="sticky-note--pencil" title="Edit" alt="Edit" />
        </a>
        &nbsp;
        <a
          className="confirmdelete"
          onClick={() => dataService.deleteTerm(word.WoID)}
        >
          <Icon iconName="minus-button" title="Delete" alt="Delete" />
        </a>
        &nbsp;
      </td>
      <td className="td1">
        <span>{word.WoText}</span> /
        <span
          id="roman19517"
          className="edit_area clickedit"
          title="Click to edit..."
        >
          {word.WoRomanization}
        </span>
      </td>
      <td className="td1">
        <span
          id="trans19517"
          className="edit_area clickedit"
          title="Click to edit..."
        >
          {word.WoTranslation}
        </span>
        <span className="smallgray2"></span>
      </td>
      <td className="td1 center">
        <b>
          <Icon iconName="status-busy" title="(No valid sentence)" alt="No" />
        </b>
      </td>
      <td className="td1 center" title="Learning">
        1/1
      </td>
      <td className="td1 center">
        {/* nowrap="nowrap" */}
        <span className="scorered">
          0
          <Icon iconName="status-busy" title="Test today!" alt="Test today!" />
        </span>
      </td>
    </tr>
  );
}
export function Terms(): JSX.Element {
  const [{ activeWords }] = useData(['activeWords']);

  return (
    <>
      {activeWords && (
        <>
          <TermsFilterBox numTerms={activeWords.length} />
          <table className="sortable tab1">
            <TermsHeader />
            <tbody>
              {activeWords.map((word) => {
                return <TermLine word={word} />;
              })}
            </tbody>
          </table>
          <TermsFooter numTerms={activeWords.length} />
        </>
      )}
    </>
  );
}
