import { InputHTMLAttributes } from 'react';
import { Icon, RequiredLineButton } from '../Icon';
import { dataService } from '../data/data.service';
import { Tags, Words } from '../data/parseMySqlDump';
import { useData } from '../data/useAkita';
import { LanguagesId, WordsId, WordsValidator } from '../data/validators';
import { A } from '../nav/InternalLink';
import { useInternalNavigate, useUpdateParams } from '../nav/useInternalNav';
import { LanguageDropdown } from '../ui-kit/LanguageDropdown';
import { Pager } from '../ui-kit/Pager';
import { usePager } from '../usePager';
import { do_ajax_show_sentences } from './AddNewWord';
import { RefMap, TRefMap } from './Forms';
import { Header } from './Header';
import { useSelection } from './useSelection';
import { confirmDelete } from './utils';

// TODO
export const resetDirty = () => {};
export const setDirty = () => {};

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
  activeLanguageId,
  numPages,
}: {
  activeLanguageId: LanguagesId | null;
  numTerms: number;
  numPages: number;
  currentPage: number;
}): JSX.Element {
  const [{ tags, texts }] = useData(['tags', 'texts']);
  // TODO usePager available here - contextprovider?
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
            <LanguageDropdown
              onChange={(val) => {
                if (val === -1) {
                  dataService.setActiveLanguage(null);
                } else {
                  dataService.setActiveLanguage(val);
                }
              }}
              defaultValue={
                activeLanguageId !== null ? activeLanguageId : undefined
              }
              header="Filter off"
            />
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
              {(activeLanguageId !== null
                ? texts.filter(({ TxLgID }) => {
                    return TxLgID === activeLanguageId;
                  })
                : texts
              ).map((text) => {
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
                updateParams({ query: selectedValue });
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
  numPages,
}: {
  numTerms: number;
  currentPage: number;
  numPages: number;
}): JSX.Element {
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
function TermLine({
  word,
  onSelect,
  isSelected,
}: {
  word: Words;
  isSelected: boolean;
  onSelect: (term: WordsId, checked: boolean) => void;
}): JSX.Element {
  const termID = word.WoID;
  const sentence = word.WoSentence;

  // console.log('TERMLINE', word, word.WoRomanization);
  return (
    <tr>
      <td name="rec${termID}" className="td1 center">
        <A>
          <input
            name="marked[]"
            type="checkbox"
            className="markcheck"
            checked={isSelected}
            value={termID}
            onChange={({ target: { checked } }) => {
              onSelect(word.WoID, checked);
            }}
          />
        </A>
      </td>
      <td style={{ whiteSpace: 'nowrap' }} className="td1 center">
        &nbsp;
        <A href={`/edit_words?chg=${termID}`}>
          <Icon src="sticky-note--pencil" title="Edit" />
        </A>
        &nbsp;
        <Icon
          onClick={() => {
            if (confirmDelete()) {
              dataService.deleteTerm(word.WoID);
            }
          }}
          src="minus-button"
          title="Delete"
        />
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
          {sentence !== null ? (
            <Icon src="status" title={`${sentence}`} alt="Yes" />
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
  // filterlang = null,
  sort = null,
  status = null,
  textFilter,
  tag1,
  tag12,
  tag2,
}: {
  textFilter: number | null;
  pageNum: number | null;
  // filterlang: LanguagesId | null;
  status: number | null;
  tag1: number | null;
  tag12: 0 | 1;
  tag2: number | null;
  sort: Sorting | null;
}): JSX.Element {
  const pageSize = 15;
  const [{ words, activeLanguage }] = useData([
    'words',
    'activeLanguage',
    // 'texttags',
  ]);
  // if (!activeLanguage) {
  //   return <></>;
  // }
  // const textTagsMatchingTag1=texttags.filter((tag)=>tag.TtTxID===)
  // const navigator = useInternalNavigate();
  const filteredWords = words.filter((val) => {
    const isRightText =
      textFilter === null
        ? true
        : // TODO - find if in target text
          // : Number.parseInt(val.WoText) === textFilter;
          true;
    const isRightStatus = status === null ? true : val.WoStatus === status;
    const isRightLang =
      activeLanguage === null ? true : val.WoLgID === activeLanguage?.LgID;
    // const isRightTag1 = tag1 === null ? true : val.WoLgID === filterlang;
    // const isRightTag2 = tag2 === null ? true : val.WoLgID === filterlang;
    const isRightTag1 = true;
    const isRightTag2 = true;

    const compoundTagStatement =
      tag12 === 0 ? isRightTag1 || isRightTag2 : isRightTag1 && isRightTag2;

    return isRightStatus && isRightText && isRightLang && compoundTagStatement;
  });

  const sortedWords =
    sort !== null ? filteredWords.sort(sortingMethod(sort)) : filteredWords;
  const currentPage = pageNum !== null ? pageNum : 1;
  const { onSelectAll, onSelectNone, selectedValues, onSelect } = useSelection(
    filteredWords,
    'WoID'
  );
  const { dataOnPage: displayedWords, numPages } = usePager(
    sortedWords,
    currentPage,
    pageSize
  );
  return (
    <>
      <Header
        title={`My ${
          activeLanguage?.LgName || ''
        } Terms (Words and Expressions)`}
      />
      {activeLanguage !== undefined ? (
        <p>
          <A href={`/edit_words?new=1&lang=${activeLanguage.LgID}`}>
            <Icon src="plus-button" title="New" />
            New {activeLanguage.LgName} Term ...
          </A>
        </p>
      ) : (
        <p>
          <Icon src="plus-button" title="New" /> New Term? - Set Language Filter
          first ...
        </p>
      )}

      {sortedWords && (
        <>
          <TermsFilterBox
            activeLanguageId={
              activeLanguage !== undefined ? activeLanguage.LgID : null
            }
            numTerms={sortedWords.length}
            currentPage={currentPage}
            numPages={numPages}
          />
          <TermMultiActions
            selectedTerms={selectedValues}
            onSelectAll={onSelectAll}
            onSelectNone={onSelectNone}
          />
          <table className="sortable tab1">
            <TermsHeader />
            <tbody>
              {displayedWords.map((word) => {
                return (
                  <TermLine
                    word={word}
                    onSelect={onSelect}
                    isSelected={selectedValues.has(word.WoID)}
                  />
                );
              })}
            </tbody>
          </table>
          <TermsFooter
            numPages={numPages}
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
  const validator = WordsValidator;
  const refMap = RefMap(validator);
  const navigator = useInternalNavigate();
  const WoInput = buildFormInput(refMap, term);
  return (
    <>
      <Header
        title={`My ${activeLanguage?.LgName} Terms (Words and Expressions)`}
      />

      <h4>Edit Term</h4>
      <form name="editword" className="validate">
        <WoInput type="hidden" entryKey={'WoID'} fixed />
        <WoInput type="hidden" entryKey={'WoLgID'} fixed />
        <input type="hidden" name="WoOldStatus" value={term?.WoStatus} />
        <table className="tab3" cellSpacing={0} cellPadding={5}>
          <tr>
            <td className="td1 right">Language:</td>
            {/* TODO not necessarily active */}
            <td className="td1">{activeLanguage?.LgName}</td>
          </tr>
          <tr title="Normally only change uppercase/lowercase here!">
            <td className="td1 right">Term:</td>
            <td className="td1">
              <WoInput
                // TODO whats this
                // <?php echo $scrdir; ?>
                className="notempty setfocus checkoutsidebmp"
                type="text"
                // id="wordfield"
                // data_info="Term"
                entryKey={'WoText'}
                maxLength={250}
                size={40}
                default
              />
              <RequiredLineButton />
            </td>
          </tr>
          {/* TODO */}
          {/* <?php print_similar_terms_tabrow(); ?> */}
          <tr>
            <td className="td1 right">Translation:</td>
            <td className="td1">
              <textarea
                className="textarea-noreturn checklength checkoutsidebmp"
                maxLength={500}
                // data_info="Translation"
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
              <WoInput
                type="text"
                className="checkoutsidebmp"
                maxLength={100}
                size={40}
                entryKey="WoRomanization"
                default
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
                maxLength={1000}
                // data_info="Sentence"
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
                onClick={() => {
                  resetDirty();
                  // TODO #
                  navigator(`/edit_words#rec${chgID}`);
                }}
              />
              <input type="button" value="Change" />
            </td>
          </tr>
        </table>
      </form>
      <div id="exsent">
        <span
          className="click"
          // TODO
          onClick={() => {
            do_ajax_show_sentences(
              term?.WoLgID,
              term?.WoTextLC,
              term?.WoSentence
            );
            // "do_ajax_show_sentences(<?php echo $record['LgID']; ?>, <?php echo prepare_textdata_js($wordlc) . ', ' . prepare_textdata_js("document.forms['editword'].WoSentence"); ?>);"
          }}
        >
          <Icon src="sticky-notes-stack" title="Show Sentences" /> Show
          Sentences
        </span>
      </div>
    </>
  );
}

export function TermMultiActions({
  selectedTerms,
  onSelectAll,
  onSelectNone,
}: {
  selectedTerms: Set<WordsId>;
  onSelectAll: () => void;
  onSelectNone: () => void;
}) {
  return (
    <>
      <form name="form1">
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
                <input type="button" value="Mark All" onClick={onSelectAll} />
                <input type="button" value="Mark None" onClick={onSelectNone} />
              </td>
              <td className="td1 center">
                Marked Texts
                <select
                  name="markaction"
                  id="markaction"
                  // TODO
                  onChange={() => {}}
                  disabled={selectedTerms.size === 0}
                >
                  <GetAllWordsActionsSelectOptions />
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </>
  );
}
function GetAllWordsActionsSelectOptions() {
  return (
    <>
      <option value="" selected>
        [Choose...]
      </option>
      <option disabled>------------</option>
      // TODO actions
      <option value="testall">Test ALL Terms</option>
      <option disabled>------------</option>
      <option value="spl1all">Increase Status by 1 [+1]</option>
      <option value="smi1all">Reduce Status by 1 [-1]</option>
      <option disabled>------------</option>
      {/* get_set_status_option(1, "all"
 get_set_status_option(5, "all"
 get_set_status_option(99, "all"
 get_set_status_option(98, "all" */}
      <option disabled>------------</option>
      <option value="todayall">Set Status Date to Today</option>
      <option disabled>------------</option>
      <option value="lowerall">Set ALL Terms to Lowercase</option>
      <option value="capall">Capitalize ALL Terms</option>
      <option value="delsentall">Delete Sentences of ALL Terms</option>
      <option disabled>------------</option>
      <option value="addtagall">Add Tag</option>
      <option value="deltagall">Remove Tag</option>
      <option disabled>------------</option>
      <option value="expall">Export ALL Terms (Anki)</option>
      <option value="expall2">Export ALL Terms (TSV)</option>
      <option value="expall3">Export ALL Terms (Flexible)</option>
      <option disabled>------------</option>
      <option value="delall">Delete ALL Terms</option>
    </>
  );
}

// function getWordTags($wid)
// {
// 	global $tbpref;
// 	$r = '<ul id="termtags">';
// 	if ($wid > 0) {
// 		$sql = 'select TgText from ' . $tbpref . 'wordtags, ' . $tbpref . 'tags where TgID = WtTgID and WtWoID = ' . $wid . ' order by TgText';
// 		$res = do_mysqli_query($sql);
// 		while ($record = mysqli_fetch_assoc($res)) {
// 			$r .= '<li>' . tohtml($record["TgText"]) . '</li>';
// 		}
// 		mysqli_free_result($res);
// 	}
// 	$r .= '</ul>';
// 	return $r;
// }

export function buildFormInput<
  TKey extends string,
  TData extends Record<TKey, any>
>(refMap: TRefMap<TData>, entry?: TData) {
  // TODO useFormContext? for shared without build
  return (
    args: Omit<
      Parameters<typeof FormInput>[0],
      'refMap' | 'defaultEntry' | 'fixedEntry'
    > & { fixed?: boolean; default?: boolean }
  ) => (
    <FormInput
      {...args}
      refMap={refMap}
      fixedEntry={args.fixed ? entry : undefined}
      defaultEntry={args.default ? entry : undefined}
    />
  );
}
export function FormInput<
  TKey extends string,
  TData extends Record<TKey, any>
>({
  // TODO nonoptional add dot
  // TODO errorlines
  entryKey,
  refMap,
  defaultEntry,
  fixedEntry,
  ...nativeProps
}: Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'defaultValue' | 'id' | 'ref' | 'name'
> & {
  entryKey: TKey;
  // TODO need refmap if fixed entry?
  refMap: TRefMap<TData>;
  defaultEntry?: TData;
  fixedEntry?: TData;
}) {
  // const { maxLength } = nativeProps;
  if (fixedEntry && defaultEntry) {
    throw new Error("Can't have fixed and default set!");
  }
  return (
    <input
      defaultValue={
        defaultEntry === undefined ? undefined : defaultEntry[entryKey]
      }
      value={fixedEntry === undefined ? undefined : fixedEntry[entryKey]}
      name={entryKey}
      ref={refMap[entryKey]}
      {...nativeProps}
    />
  );
}
