import { Icon } from '../Icon';
import { dataService } from '../data/data.service';
import { Tags, Words } from '../data/parseMySqlDump';
import { useData } from '../data/useAkita';
import { A } from '../nav/InternalLink';
import { useInternalNavigate, useUpdateParams } from '../nav/useInternalNav';
import { LanguageDropdown } from '../ui-kit/LanguageDropdown';
import { Pager } from '../ui-kit/Pager';
import { usePager } from '../usePager';
import { Header } from './Header';
import { confirmDelete } from './utils';
export const enum Sorting {
  'Term A-Z' = 1,
  'Translation A-Z' = 2,
  'Newest first' = 3,
  'Oldest first' = 7,
  'Status' = 4,
  'Score Value (%)' = 5,
  'Word Count Active Texts' = 6,
}
function TagDropDown({ tags }: { tags: Tags[] }): JSX.Element {
  const updateParams = useUpdateParams();
  return (
    <select
      name="tag1"
      onChange={({ target: { value } }) => {
        updateParams({ tag1: value });
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
  //   TODO
  const pageSize = 10;
  const numPages = Math.ceil(numTerms / pageSize);
  const navigate = useInternalNavigate();
  const updateParams = useUpdateParams();
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
              onChange={({ target: { value } }) => {
                updateParams({ text: value === '-1' ? null : value });
              }}
            >
              <option value={-1} selected>
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
            // style={{ whiteSpace: 'nowrap' }}
            className="td1 center"
            colSpan={2}
          >
            Status:
            <select
              name="status"
              // TODO
              // defaultValue={}
              onChange={({ target: { value: selectedValue } }) => {
                updateParams({ status: selectedValue });
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
                updateParams(
                  { query: selectedValue }
                  // `/edit_wors?page=${currentPage}&query=${selectedValue}`
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
                navigate(`/edit_words?page=${1}&tag12=${value}`);
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
            <Pager currentPage={currentPage} numPages={numPages} />
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
  const pageSize = 2;
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
            <Pager currentPage={currentPage} numPages={numPages} />
          </th>
        </tr>
      </tbody>
    </table>
  );
}
function TermLine({ word }: { word: Words }): JSX.Element {
  const termID = word.WoID;
  const sentence = word.WoSentence;

  return (
    <tr>
      <td name="rec${termID}" className="td1 center">
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
          onClick={() => {
            if (confirmDelete()) {
              dataService.deleteTerm(word.WoID);
            }
          }}
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
const sortingMethod = (
  sort: Sorting
): ((termA: Words, termB: Words) => 1 | -1 | 0) => {
  switch (sort) {
    case Sorting['Oldest first']:
      return (a, b) => {
        return a.WoCreated > b.WoCreated
          ? 1
          : a.WoCreated < b.WoCreated
          ? -1
          : 0;
      };
    case Sorting['Newest first']:
      return (a, b) => {
        return a.WoCreated > b.WoCreated
          ? -1
          : a.WoCreated < b.WoCreated
          ? 1
          : 0;
      };
    // TODO
    case Sorting['Score Value (%)']:
      return (a, b) => {
        return a.WoCreated > b.WoCreated
          ? -1
          : a.WoCreated < b.WoCreated
          ? 1
          : 0;
      };
    case Sorting['Status']:
      return (a, b) => {
        return a.WoStatus > b.WoStatus ? -1 : a.WoStatus < b.WoStatus ? 1 : 0;
      };
    // TODO
    case Sorting['Term A-Z']:
      return (a, b) => {
        return a.WoText > b.WoText ? -1 : a.WoText < b.WoText ? 1 : 0;
      };
    // TODO
    case Sorting['Translation A-Z']:
      return (a, b) => {
        return a.WoTranslation > b.WoTranslation
          ? 1
          : a.WoTranslation < b.WoTranslation
          ? -1
          : 0;
      };
    // TODO
    case Sorting['Word Count Active Texts']:
      return (a, b) => {
        return a.WoCreated > b.WoCreated
          ? -1
          : a.WoCreated < b.WoCreated
          ? 1
          : 0;
      };
  }
};
export function Terms({
  pageNum = null,
  sort = null,
  status = null,
}: {
  pageNum: number | null;
  status: number | null;
  sort: Sorting | null;
}): JSX.Element {
  const [{ activeWords, activeLanguage }] = useData([
    'activeWords',
    'activeLanguage',
  ]);
  console.log(activeWords);
  if (!activeWords || !activeLanguage) {
    return <></>;
  }

  const filteredWords =
    status !== null
      ? activeWords.filter((val) => val.WoStatus === status)
      : activeWords;

  const sortedWords =
    sort !== null ? filteredWords.sort(sortingMethod(sort)) : filteredWords;
  const currentPage = pageNum !== null ? pageNum : 1;

  const { dataOnPage: displayedWords } = usePager(sortedWords, currentPage, 10);
  return (
    <>
      <Header
        title={`My ${activeLanguage?.LgName} Terms (Words and Expressions)`}
      />
      {sortedWords && (
        <>
          <TermsFilterBox
            numTerms={sortedWords.length}
            currentPage={currentPage}
          />
          <table className="sortable tab1">
            <TermsHeader />
            <tbody>
              {displayedWords.map((word) => {
                return <TermLine word={word} />;
              })}
            </tbody>
          </table>
          <TermsFooter
            numTerms={sortedWords.length}
            currentPage={currentPage}
          />
        </>
      )}
    </>
  );
}
export function ChangeTerm({ chgID }: { chgID: number }): JSX.Element {
  const [{ words, activeLanguage }] = useData(['words', 'activeLanguage']);
  const term = words.find((val) => {
    return val.WoID === chgID;
  });
  return (
    <>
      <Header
        title={`My ${activeLanguage?.LgName} Terms (Words and Expressions)`}
      />

      <h4>Edit Term</h4>
      <script
        type="text/javascript"
        src="js/unloadformcheck.js"
        charSet="utf-8"
      ></script>
      <form
        name="editword"
        className="validate"
        action="<?php echo $_SERVER['PHP_SELF']; ?>#rec<?php echo $_REQUEST['chg']; ?>"
        method="post"
      >
        <input type="hidden" name="WoID" value={term?.WoID} />
        <input
          type="hidden"
          name="WoLgID"
          id="langfield"
          value={term?.WoLgID}
        />
        <input type="hidden" name="WoOldStatus" value={term?.WoStatus} />
        <table className="tab3" cellSpacing={0} cellPadding={5}>
          <tr>
            <td className="td1 right">Language:</td>
            <td className="td1">
              {term?.WoLgID}
              {/* TODO */}
              {/* <?php echo tohtml($record['LgName']); ?> */}
            </td>
          </tr>
          <tr title="Normally only change uppercase/lowercase here!">
            <td className="td1 right">Term:</td>
            <td className="td1">
              <input
                // <?php echo $scrdir; ?>
                className="notempty setfocus checkoutsidebmp"
                data_info="Term"
                type="text"
                name="WoText"
                id="wordfield"
                value={term?.WoText}
                maxlength={250}
                size={40}
              />
              <Icon src="status-busy" title="Field must not be empty" />
            </td>
          </tr>
          {/* <?php print_similar_terms_tabrow(); ?> */}
          <tr>
            <td className="td1 right">Translation:</td>
            <td className="td1">
              <textarea
                className="textarea-noreturn checklength checkoutsidebmp"
                data_maxlength={500}
                data_info="Translation"
                name="WoTranslation"
                cols={40}
                rows={3}
              >
                {term?.WoTranslation}
              </textarea>
            </td>
          </tr>
          <tr>
            <td className="td1 right">Tags:</td>
            <td className="td1">
              {/* TODO */}
              {/* <?php echo getWordTags($record['WoID']); ?> */}
            </td>
          </tr>
          <tr>
            <td className="td1 right">Romaniz.:</td>
            <td className="td1">
              <input
                type="text"
                className="checkoutsidebmp"
                data_info="Romanization"
                name="WoRomanization"
                maxlength={100}
                size={40}
                value={term?.WoRomanization}
              />
            </td>
          </tr>
          <tr>
            <td className="td1 right">
              Sentence
              <br />
              Term in {'{...}'}:
            </td>
            <td className="td1">
              <textarea
                // TODO
                // <?php echo $scrdir; ?>
                className="textarea-noreturn checklength checkoutsidebmp"
                data_maxlength={1000}
                data_info="Sentence"
                name="WoSentence"
                cols={40}
                rows={3}
              >
                {term?.WoSentence}
              </textarea>
            </td>
          </tr>
          <tr>
            <td className="td1 right">Status:</td>
            <td className="td1">{term?.WoStatus}</td>
          </tr>
          <tr>
            <td className="td1 right" colSpan={2}>
              &nbsp;
              {/* TODO */}
              {/* <?php echo createDictLinksInEditWin2($record['WoLgID'],'document.forms[\'editword\'].WoSentence','document.forms[\'editword\'].WoText'); ?> */}
              &nbsp; &nbsp;
              <input
                type="button"
                value="Cancel"
                onClick="{resetDirty(); location.href='edit_words.php#rec<?php echo $_REQUEST['chg']; ?>';}"
              />
              <input type="submit" name="op" value="Change" />
            </td>
          </tr>
        </table>
      </form>
      <div id="exsent">
        <span
          className="click"
          // TODO
          // onClick="do_ajax_show_sentences(<?php echo $record['LgID']; ?>, <?php echo prepare_textdata_js($wordlc) . ', ' . prepare_textdata_js("document.forms['editword'].WoSentence"); ?>);"
        >
          <Icon src="sticky-notes-stack" title="Show Sentences" /> Show
          Sentences
        </span>
      </div>
    </>
  );
}
