import { Icon } from '../Icon';
import { dataService } from '../data/data.service';
import { Tags, Words } from '../data/parseMySqlDump';
import { useData } from '../data/useAkita';
import { A } from '../nav/InternalLink';
import { useInternalNavigate } from '../nav/useInternalNav';
import { LanguageDropdown } from '../ui-kit/LanguageDropdown';
import { Header } from './Header';
function TagDropDown({ tags }: { tags: Tags[] }): JSX.Element {
  const navigate = useInternalNavigate();
  return (
    <select
      name="tag1"
      // TODO
      onChange={({ target: { value } }) => {
        navigate(`/edit_words?page=1&tag1=${value}`);
      }}
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
  currentPage,
}: {
  numTerms: number;
  currentPage: number;
}): JSX.Element {
  const [{ languages, tags, texts }] = useData(['languages', 'tags', 'texts']);
  const pageSize = 10;
  //   TODO
  const numPages = Math.ceil(numTerms / pageSize);
  const navigate = useInternalNavigate();
  return (
    <table className="tab1" cellSpacing={0} cellPadding={5}>
      <tbody>
        <tr>
          <th className="th1" colSpan={4}>
            Filter
            <Icon src="funnel" title="Filter" />
            &nbsp;
            <input
              type="button"
              value="Reset All"
              // TODO
              onClick="resetAll('edit_words');"
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
              onChange={(event) => {
                navigate(
                  `/edit_words?page=${currentPage}&text=${event.target.value}`
                );
              }}
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
          <td
            style={{ whiteSpace: 'nowrap' }}
            className="td1 center"
            colSpan={2}
          >
            Status:
            <select
              name="status"
              onChange={({ target: { value: selectedValue } }) => {
                navigate(
                  `/edit_words?page=${currentPage}&status=${selectedValue}`
                );
              }}
            >
              <option value="" selected>
                [Filter off]
              </option>
              {new Array(5).fill(0).map((_, ii) => {
                const val = ii + 1;
                return (
                  <option value={val}>
                    {val === 5 ? 'Learned' : 'Learning'} [{val}]
                  </option>
                );
              })}
              <option value="99">Well Known [WKn]</option>
              <option value="98">Ignored [Ign]</option>
              {new Array(4).fill(0).map((_, ii) => {
                const val = ii + 1;
                return (
                  <>
                    <option disabled>--------</option>
                    {new Array(5 - val).fill(0).map((__, jj) => {
                      const jVal = jj + 1;
                      return (
                        <option value={`${val}${jVal}`}>
                          {val + jVal === 5 ? 'Learning/-ed' : 'Learning'} [
                          {val}
                          ..{val + jVal}]
                        </option>
                      );
                    })}
                  </>
                );
              })}
              <option disabled>--------</option>
              <option value="599">All known [5+WKn]</option>
            </select>
          </td>
          <td
            style={{ whiteSpace: 'nowrap' }}
            className="td1 center"
            colSpan={2}
          >
            Term, Rom., Transl. (Wildc.=*):
            <input type="text" name="query" value="" maxLength={50} size={15} />
            &nbsp;
            <input
              type="button"
              name="querybutton"
              value="Filter"
              onChange={({ target: { value: selectedValue } }) => {
                navigate(
                  `/edit_words?page=${currentPage}&query=${selectedValue}`
                );
              }}
            />
            &nbsp;
            <input
              type="button"
              value="Clear"
              onChange={() => {
                navigate(`/edit_words?page=${currentPage}&query=`);
              }}
            />
          </td>
        </tr>
        <tr>
          <td
            style={{ whiteSpace: 'nowrap' }}
            className="td1 center"
            colSpan={2}
          >
            Tag #1:
            <TagDropDown tags={tags} />
          </td>
          <td style={{ whiteSpace: 'nowrap' }} className="td1 center">
            Tag #1 ..
            <select
              name="tag12"
              onChange={({ target: { value } }) => {
                navigate(`/edit_words?page=1&tag12=${value}`);
              }}
            >
              <option value="0">... OR ...</option>
              <option value="1">... AND ...</option>
            </select>
            .. Tag #2
          </td>
          <td style={{ whiteSpace: 'nowrap' }} className="td1 center">
            Tag #2:
            <TagDropDown tags={tags} />
          </td>
        </tr>
        <tr>
          <th style={{ whiteSpace: 'nowrap' }} className="th1">
            {numTerms} Terms
          </th>
          <th className="th1" style={{ whiteSpace: 'nowrap' }} colSpan={2}>
            &nbsp; &nbsp;
            <Icon src="placeholder" alt="-" />
            &nbsp;
            <Icon src="placeholder" alt="-" />
            &nbsp; Page
            <select
              name="page1"
              onChange={({ target: { value } }) => {
                navigate(`/edit_words?page=${value}`);
              }}
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
            <A href="/edit_words?page=2">
              <Icon src="control" title="Next Page" />
            </A>
            &nbsp;
            <A href="/edit_words?page=53">
              <Icon src="control-stop" title="Last Page" />
            </A>
            &nbsp; &nbsp;
          </th>
          <th style={{ whiteSpace: 'nowrap' }} className="th1">
            Sort Order:
            <select
              name="sort"
              onChange={({ target: { value } }) => {
                navigate(`/edit_words?page=1&sort=${value}`);
              }}
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

export function TermsFooter({
  numTerms,
  currentPage,
}: {
  numTerms: number;
  currentPage: number;
}): JSX.Element {
  const pageSize = 10;
  const numPages = Math.ceil(numTerms / pageSize);
  const navigate = useInternalNavigate();
  return (
    <table className="tab1" cellSpacing={0} cellPadding={5}>
      <tbody>
        <tr>
          <th style={{ whiteSpace: 'nowrap' }} className="th1">
            {numTerms} Term{numTerms === 1 ? '' : 's'}
          </th>
          <th style={{ whiteSpace: 'nowrap' }} className="th1">
            &nbsp; &nbsp;
            <Icon src="placeholder" alt="-" />
            &nbsp;
            <Icon src="placeholder" alt="-" />
            {/* TODO abstract this into a page dropdown component? */}
            &nbsp; Page
            <select
              name={`page${currentPage}`}
              onChange={({ target: { value } }) =>
                navigate(`/edit_words?page=${value}`)
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
            <A href={`/edit_words?page=${currentPage + 1}`}>
              <Icon src="control" title="Next Page" />
            </A>
            &nbsp;
            <A href={`/edit_words?page=${numPages}`}>
              <Icon src="control-stop" title="Last Page" />
            </A>
            &nbsp; &nbsp;
          </th>
        </tr>
      </tbody>
    </table>
  );
}
function TermLine({ word }: { word: Words }): JSX.Element {
  const termID = word.WoID;
  // TODO
  const sentence = word.WoSentence;

  return (
    <tr>
      <td className="td1 center">
        {/*a name="rec${termID}" */}
        <A>
          <input
            name="marked[]"
            type="checkbox"
            className="markcheck"
            value={termID}
          />
        </A>
      </td>
      <td style={{ whiteSpace: 'nowrap' }} className="td1 center">
        &nbsp;
        <A href={`/edit_words?chg=${termID}`}>
          <Icon src="sticky-note--pencil" title="Edit" />
        </A>
        &nbsp;
        <A
          className="confirmdelete"
          onClick={() => dataService.deleteTerm(word.WoID)}
        >
          <Icon src="minus-button" title="Delete" />
        </A>
        &nbsp;
      </td>
      <td className="td1">
        <span>{word.WoText}</span> /
        <span
          id={`roman${termID}`}
          className="edit_area clickedit"
          title="Click to edit..."
        >
          {word.WoRomanization}
        </span>
      </td>
      <td className="td1">
        <span
          id={`trans${termID}`}
          className="edit_area clickedit"
          title="Click to edit..."
        >
          {word.WoTranslation}
        </span>
        <span className="smallgray2"></span>
      </td>
      <td className="td1 center">
        <b>
          {sentence !== undefined ? (
            <Icon src="status-busy" title={`${sentence}`} alt="Yes" />
          ) : (
            <Icon src="status-busy" title="(No valid sentence)" alt="No" />
          )}
        </b>
      </td>
      <td className="td1 center" title="Learning">
        1/1
      </td>
      <td style={{ whiteSpace: 'nowrap' }} className="td1 center">
        <span className="scorered">
          0
          <Icon src="status-busy" title="Test today!" />
        </span>
      </td>
    </tr>
  );
}
// TODO "New New Term? - Set Language Filter first "
export function Terms({ pageNum }: { pageNum: number }): JSX.Element {
  const [{ activeWords, activeLanguage }] = useData([
    'activeWords',
    'activeLanguage',
  ]);

  return (
    <>
      <Header
        title={`My ${activeLanguage?.LgName} Terms (Words and Expressions)`}
      />
      {activeWords && (
        <>
          <TermsFilterBox numTerms={activeWords.length} currentPage={pageNum} />
          <table className="sortable tab1">
            <TermsHeader />
            <tbody>
              {activeWords.map((word) => {
                return <TermLine word={word} />;
              })}
            </tbody>
          </table>
          <TermsFooter numTerms={activeWords.length} currentPage={0} />
        </>
      )}
    </>
  );
}
