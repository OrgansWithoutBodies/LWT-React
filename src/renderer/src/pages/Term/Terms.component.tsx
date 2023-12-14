import { useEffect, useState } from 'react';
import { BrandedNumber } from '../../data/branding';
import { dataService } from '../../data/data.service';
import {
  wordNoIdPrevalidateMap,
  wordPrevalidateMap,
} from '../../data/preValidateMaps';
import { HOUR_IN_DAY, MIN_IN_HOUR, MS_IN_S, S_IN_MIN } from '../../data/time';
import {
  EditWordsValidator,
  LanguagesId,
  Tags2Id,
  TagsId,
  TextsId,
  WordsId,
} from '../../data/validators';
import { useData } from '../../hooks/useAkita';
import { useFormInput } from '../../hooks/useFormInput';
import {
  PathParams,
  useInternalNavigate,
  useUpdateParams,
} from '../../hooks/useInternalNav';
import { usePager } from '../../hooks/usePager';
import { useSelection } from '../../hooks/useSelection';
import { A } from '../../nav/InternalLink';
import { APITranslateTerm } from '../../plugins/deepl.plugin';
import { Header } from '../../ui-kit/Header';
import { Icon } from '../../ui-kit/Icon';
import { LanguageDropdown } from '../../ui-kit/LanguageDropdown';
import { StatusRadioButtons } from '../../ui-kit/StatusRadioButtons';
import { TagAndOr } from '../../ui-kit/TagAndOr';
import { WordTagsSelectDropdown } from '../../ui-kit/WordTagsSelectDropdown';
import { filterTags } from '../../utils/filterTags';
import {
  AddNewWordValidator,
  Language,
  Tag,
  Tag2,
  Word,
} from '../../utils/parseMySqlDump';
import { allActionGo, confirmDelete } from '../../utils/utils';
import {
  FilterSortPager,
  buildTextTagLookup,
} from '../ArchivedText/EditArchivedTexts.component';
import { markClick, textareaKeydown } from '../IO/CheckForm';
import { EntryRow } from '../Language/NewLanguage';
import { getDirTag } from '../Reader.component';
import {
  GetAllWordsActionsSelectOptions,
  get_status_abbr,
} from '../SelectOptions';
import { WordSorting, resetDirty, sortingMethod } from '../Sorting';
import { getStatusName } from '../StrengthMap';
import { SortableHeader, TableFooter } from '../Text/Library.component';
import {
  createTheDictUrl,
  owin,
  prepare_textdata_js,
} from '../translateSentence2';
import { MultiFunctionalURL, SentencesForWord } from './AddNewWordPane';

const isTags = (tags: Tag[] | Tag2[]): tags is Tag[] =>
  tags[0] && 'TgID' in tags[0];
// TODO tagKey type restricted to path param

/**
 *
 */
export function TagDropDown<TTag extends Tag | Tag2>({
  tags,
  tagKey,
  defaultValue = null,
}: TTag extends Tag
  ? {
      defaultValue: TagsId | null;
      tags: TTag[];
      tagKey: PathParams;
    }
  : {
      defaultValue: Tags2Id | null;
      tags: TTag[];
      tagKey: PathParams;
    }): JSX.Element {
  const updateParams = useUpdateParams();
  return (
    <select
      name="tag1"
      onChange={({ target: { value } }) => {
        updateParams({ [tagKey]: value, page: null });
      }}
    >
      <option value="" selected={defaultValue === null}>
        [Filter off]
      </option>
      {isTags(tags)
        ? tags.map((tag) => (
            <option value={tag.TgID} selected={defaultValue === tag.TgID}>
              {tag.TgText}
            </option>
          ))
        : tags.map((tag) => (
            <option value={tag.T2ID} selected={defaultValue === tag.T2ID}>
              {tag.T2Text}
            </option>
          ))}

      <option disabled>--------</option>
      {/* TODO */}
      <option value="-1">UNTAGGED</option>
    </select>
  );
}

/**
 *
 */
function TermsHeader({ sorting }: { sorting: WordSorting }): JSX.Element {
  const [{ activeLanguageId }] = useData(['activeLanguageId']);
  return (
    <tr>
      <th className="th1 sorttable_nosort">Mark</th>
      <th className="th1 sorttable_nosort">Act.</th>
      {activeLanguageId === null && (
        <SortableHeader
          sorting={sorting}
          downSorting={WordSorting['Lang. (desc)']}
          upSorting={WordSorting['Lang.']}
        >
          Lang.
        </SortableHeader>
      )}
      <SortableHeader
        sorting={sorting}
        downSorting={WordSorting['Term A-Z']}
        upSorting={WordSorting['Term Z-A']}
      >
        Term /
        <br />
        Romanization
      </SortableHeader>
      <SortableHeader
        sorting={sorting}
        downSorting={WordSorting['Translation A-Z']}
        upSorting={WordSorting['Translation Z-A']}
      >
        Translation [Tags]
        <br />
        <span id="waitinfo" className="hide">
          Please <img src="icn/waiting2.gif" /> wait ...
        </span>
      </SortableHeader>
      <SortableHeader
        sorting={sorting}
        downSorting={WordSorting['Oldest first']}
        upSorting={WordSorting['Newest first']}
      >
        Se.
        <br />?
      </SortableHeader>
      <SortableHeader
        sorting={sorting}
        downSorting={WordSorting['Stat./Days']}
        upSorting={WordSorting['Stat./Days (desc)']}
      >
        Stat./
        <br />
        Days
      </SortableHeader>
      <SortableHeader
        sorting={sorting}
        downSorting={WordSorting['Score Value (%)']}
        upSorting={WordSorting['Score Value (%) (desc)']}
      >
        Score
        <br />%
      </SortableHeader>
      {sorting === WordSorting['Word Count Active Texts'] && (
        <SortableHeader
          title="Word Count in Active Texts"
          sorting={sorting}
          downSorting={WordSorting['Word Count Active Texts']}
          upSorting={WordSorting['Word Count Active Texts (desc)']}
        >
          WCnt
          <br />
          Txts
        </SortableHeader>
      )}
    </tr>
  );
}

// TODO abstract out filterbox

/**
 *
 */
export function TermsFilterBox({
  numTerms,

  currentPage,
  activeLanguageId,
  numPages,
  tag12,
  tag1,
  tag2,
  sorting,
  status,
  textFilter,
}: {
  textFilter: TextsId | null;

  activeLanguageId: LanguagesId | null;
  numTerms: number;
  numPages: number;
  currentPage: number;
  status: number | null;
  tag1: TagsId | null;
  tag2: TagsId | null;
  tag12: 0 | 1;
  sorting: WordSorting;
}): JSX.Element {
  const [{ tags, texts }] = useData(['tags', 'texts']);
  // TODO usePager available here - contextprovider?
  // TODO why would need pager in filter box?
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
              onClick={() => updateParams(null)}
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
              defaultValue={textFilter === null ? undefined : textFilter}
              onChange={({ target: { value } }) => {
                updateParams({
                  text: value === '-1' ? null : value,
                  page: null,
                });
              }}
            >
              <option value={-1} selected>
                [Filter off]
              </option>
              {(activeLanguageId !== null
                ? texts.filter(({ TxLgID }) => TxLgID === activeLanguageId)
                : texts
              ).map((text) => (
                <option value={text.TxID}>{text.TxTitle}</option>
              ))}
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
              defaultValue={status === null ? undefined : status}
              onChange={({ target: { value: selectedValue } }) => {
                updateParams({ status: selectedValue, page: null });
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
              {/* TODO reuse GetWordstatusSelectoptions */}
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
                          ..
                          {val + jVal}]
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
                updateParams({ query: selectedValue, page: null });
              }}
            />
            &nbsp;
            <input
              type="button"
              value="Clear"
              onChange={() => {
                updateParams(null);
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
            <TagDropDown tags={tags} tagKey="tag1" defaultValue={tag1} />
          </td>
          <TagAndOr
            defaultValue={tag12}
            onChange={({ target: { value } }) => {
              updateParams({ tag12: value, page: null });
            }}
          />
          <td style={{ whiteSpace: 'nowrap' }} className="td1 center">
            Tag #2:
            <TagDropDown tags={tags} tagKey="tag2" defaultValue={tag2} />
          </td>
        </tr>
        <FilterSortPager
          currentPage={currentPage}
          numPages={numPages}
          recno={numTerms}
          elementName={'Term'}
        >
          {/* TODO keep these up to date w wordSort enum */}
          {/* TODO move to sortings */}
          <option value="1" selected={sorting === 1}>
            Term A-Z
          </option>
          <option value="2" selected={sorting === 2}>
            Translation A-Z
          </option>
          <option value="3" selected={sorting === 3}>
            Newest first
          </option>
          <option value="7" selected={sorting === 7}>
            Oldest first
          </option>
          <option value="4" selected={sorting === 4}>
            Status
          </option>
          <option value="5" selected={sorting === 5}>
            Score Value (%)
          </option>
          <option value="6" selected={sorting === 6}>
            Word Count Active Texts
          </option>{' '}
        </FilterSortPager>
      </tbody>
    </table>
  );
}

/**
 *
 */
function TermRow({
  word,
  onSelect,
  isSelected,
  tags,
  sorting,
}: {
  sorting: WordSorting;
  word: Word;
  tags: string[];
  isSelected: boolean;
  onSelect: (term: Word, checked: boolean) => void;
}): JSX.Element {
  const termID = word.WoID;
  const sentence = word.WoSentence;
  const [{ activeLanguageId, languages }] = useData([
    'activeLanguageId',
    'languages',
  ]);
  const foundLanguage = activeLanguageId
    ? null
    : languages.find((val) => val.LgID === word.WoLgID);
  if (!foundLanguage && !activeLanguageId) {
    throw new Error('Invalid Word Language ID!');
  }
  return (
    <tr>
      <td id={`rec${termID}`} className="td1 center">
        <A>
          <input
            name="marked[]"
            type="checkbox"
            onClick={markClick}
            checked={isSelected}
            value={termID}
            onChange={({ target: { checked } }) => {
              onSelect(word, checked);
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
      {!activeLanguageId && (
        <td className="td1 center">{foundLanguage?.LgName}</td>
      )}
      <td className="td1">
        <span>{word.WoText}</span> /
        <span
          id={`roman${termID}`}
          className="edit_area clickedit"
          // TODO RTL somewhere here
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
        </span>{' '}
        {tags.length > 0 && (
          <span className="smallgray2">[{tags.join(', ')}]</span>
        )}
      </td>
      <td className="td1 center">
        <b>
          {sentence !== undefined ? (
            <Icon src="status" title={`${sentence}`} alt="Yes" />
          ) : (
            <Icon src="status-busy" title="(No valid sentence)" alt="No" />
          )}
        </b>
      </td>
      <td className="td1 center" title={getStatusName(word.WoStatus)}>
        {/* <td className="td1 center">
            <span title="Saved" className="status4">
              &nbsp;
              (txtworkedall > 0 ? '
                      <a href="edit_words.php?page=1&;query=&;status=&;tag12=0&;tag2=&;tag1=&;text=' . record['TxID'] . '">
                        {txtworkedwords }
                        +
                        {txtworkedexpr }
                        </a>
                        : 0)
              &nbsp;
            </span>
          </td> */}

        {get_status_abbr(word['WoStatus'])}
        {word['WoStatus'] < 98
          ? `/${Math.floor(
              (new Date().getTime() -
                new Date(word.WoStatusChanged).getTime()) /
                (MS_IN_S * S_IN_MIN * MIN_IN_HOUR * HOUR_IN_DAY)
            )}`
          : ''}
      </td>
      <td style={{ whiteSpace: 'nowrap' }} className="td1 center">
        {word.WoTodayScore < 0 ? (
          <span className="scorered">
            0 <Icon src="status-busy" title="Test today!" />
          </span>
        ) : (
          <span className="scoregreen">
            {' '}
            {Math.floor(word.WoTodayScore)}
            {word.WoTomorrowScore < 0 ? (
              <Icon src="status-away" title="Test tomorrow!" />
            ) : (
              <Icon src="status" title="-" />
            )}
          </span>
        )}
        {/* TODO */}
        {/* echo '<td class="td1 center" nowrap="nowrap">&nbsp;<a href="' . $_SERVER['PHP_SELF'] . '?chg=' . record['WoID'] . '"><img src="icn/sticky-note--pencil.png" title="Edit" alt="Edit" /></a>&nbsp; <a class="confirmdelete" href="' . $_SERVER['PHP_SELF'] . '?del=' . record['WoID'] . '"><img src="icn/minus-button.png" title="Delete" alt="Delete" /></a>&nbsp;</td>'; */}
      </td>
      {sorting === WordSorting['Word Count Active Texts'] && (
        <td className="td1 center" style={{ whiteSpace: 'nowrap' }}>
          {/* TODO */}
          {/* ' . record['textswordcount'] . ' */}
        </td>
      )}
    </tr>
  );
}

/**
 *
 */
export function Terms({
  pageNum = null,
  sort = WordSorting['Term A-Z'],
  status = null,
  textFilter = null,
  tag1,
  tag12 = 0,
  tag2,
}: {
  textFilter: TextsId | null;
  pageNum: number | null;
  // filterlang: LanguagesId | null;
  status: number | null;
  tag1: TagsId | null;
  tag12: 0 | 1;
  tag2: TagsId | null;
  sort?: WordSorting;
}): JSX.Element {
  const [{ words, activeLanguage, settings, tags, wordtags }] = useData([
    'words',
    'tags',
    'activeLanguage',
    'settings',
    'wordtags',
  ]);
  console.log('TEST123-words', words, textFilter);
  const pageSize = settings['set-terms-per-page'] || 10;

  const filteredWordTags = filterTags(wordtags, tag1, tag2, tag12);

  const filteredWords = words.filter((word) => {
    // TODO - find if in target text
    const isRightText = textFilter === null ? true : true;
    if (!isRightText) {
      return false;
    }
    const isRightStatus = status === null ? true : word.WoStatus === status;
    if (!isRightStatus) {
      return false;
    }
    const isRightLang =
      activeLanguage === null || activeLanguage === undefined
        ? true
        : word.WoLgID === activeLanguage.LgID;
    if (!isRightLang) {
      return false;
    }
    if (tag1 === null && tag2 === null) {
      return true;
    }
    const filteredTagsIncludesWord = filteredWordTags[word.WoID] === true;
    return filteredTagsIncludesWord;
  });
  console.log('WORDFILTER', filteredWordTags);

  const textTagLookup = buildTextTagLookup(tags, wordtags);
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
      {activeLanguage ? (
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
            sorting={sort}
            status={status}
            tag12={tag12}
            activeLanguageId={activeLanguage ? activeLanguage.LgID : null}
            numTerms={sortedWords.length}
            currentPage={currentPage}
            numPages={numPages}
            tag1={tag1}
            tag2={tag2}
            textFilter={textFilter}
          />
          <TermMultiActions
            selectedTerms={selectedValues}
            onSelectAll={onSelectAll}
            onSelectNone={onSelectNone}
            allTermIDs={filteredWords.map((val) => val.WoID)}
          />
          <table className="sortable tab1">
            <TermsHeader sorting={sort} />
            <tbody>
              {displayedWords.map((word) => (
                <TermRow
                  tags={textTagLookup[word.WoID] || []}
                  word={word}
                  onSelect={onSelect}
                  sorting={sort}
                  isSelected={selectedValues.has(word.WoID)}
                />
              ))}
            </tbody>
          </table>
          <TableFooter
            currentPage={currentPage}
            pageSize={pageSize}
            numPages={numPages}
            recno={sortedWords.length}
            elementName={'Term'}
            pageSizeSettingsKey={'set-terms-per-page'}
          />
        </>
      )}
    </>
  );
}

/**
 *
 */
export function EditTerm({ chgID }: { chgID: number }): JSX.Element {
  const [{ words, languages }] = useData(['words', 'languages']);
  const validator = EditWordsValidator;
  const navigator = useInternalNavigate();
  const term = words.find((val) => val.WoID === chgID);
  const [showingSentences, setShowingSentences] = useState<boolean>(false);

  const {
    Input: WoInput,
    onSubmit,
    refMap,
    TextArea,
  } = useFormInput({ validator, entry: term });

  if (!term) {
    return <></>;
  }
  const termLanguage = languages.find((val) => val.LgID === term.WoLgID);
  if (!termLanguage) {
    return <></>;
  }
  // TODO don't know why this is necessary but seems to happen that initially words starts as [] for a few ms
  if (words.length === 0) {
    return <></>;
  }
  if (!term) {
    throw new Error(`Invalid Change ID! ${chgID}`);
  }
  return (
    <>
      <Header
        title={`My ${termLanguage.LgName} Terms (Words and Expressions)`}
      />

      <h4>Edit Term</h4>
      <form name="editword" className="validate">
        <WoInput type="hidden" entryKey="WoID" fixed />
        <WoInput type="hidden" entryKey="WoLgID" fixed id="langfield" />
        <WoInput type="hidden" entryKey="WoCreated" fixed />
        {/* TODO */}
        <input type="hidden" name="WoOldStatus" value={term.WoStatus} />
        <table className="tab3" cellSpacing={0} cellPadding={5}>
          <tr>
            <td className="td1 right">Language:</td>
            <td className="td1">{termLanguage.LgName}</td>
          </tr>
          <tr title="Normally only change uppercase/lowercase here!">
            <td className="td1 right">Term:</td>
            <td className="td1">
              <WoInput
                {...getDirTag(termLanguage)}
                className="notempty setfocus checkoutsidebmp"
                // TODO
                // onBlur={do_ajax_show_similar_terms}
                id="wordfield"
                errorName="Term"
                entryKey="WoText"
                maxLength={250}
                size={40}
                isRequired
                default
              />
            </td>
          </tr>
          <PrintSimilarTermsTabrow
            word={refMap.WoText.current}
            lang={refMap.WoLgID.current}
          />
          <tr>
            <td className="td1 right">Translation:</td>
            <td className="td1">
              <TextArea
                className="checklength checkoutsidebmp"
                onKeyDown={textareaKeydown}
                maxLength={500}
                errorName="Translation"
                name="WoTranslation"
                cols={40}
                rows={3}
                default
              />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Tags:</td>
            <td className="td1">
              <WordTagsSelectDropdown wordID={term.WoID} />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Romaniz.:</td>
            <td className="td1">
              <WoInput
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
              <TextArea
                {...getDirTag(termLanguage)}
                className="checklength checkoutsidebmp"
                onKeyDown={textareaKeydown}
                maxLength={1000}
                errorName="Sentence"
                name="WoSentence"
                cols={40}
                rows={3}
                defaultValue={term.WoSentence}
              />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Status:</td>
            <td className="td1">
              <StatusRadioButtons
                defaultStatus={term.WoStatus}
                refMap={refMap}
              />
            </td>
          </tr>
          <tr>
            <td className="td1 right" colSpan={2}>
              &nbsp;
              <DictionaryLinks
                lang={termLanguage}
                sentenceString={term.WoSentence}
                wordString={term.WoText}
              />
              &nbsp; &nbsp;
              <input
                type="button"
                value="Cancel"
                onClick={() => {
                  resetDirty();
                  navigator(`/edit_words#rec${chgID}`);
                }}
              />
              <input
                type="button"
                value="Change"
                onClick={() => {
                  onSubmit(wordPrevalidateMap, (val) => {
                    // TODO
                    dataService.editTerm(val);
                    navigator('/edit_words');
                  });
                }}
              />
            </td>
          </tr>
        </table>
      </form>
      <div id="exsent">
        {showingSentences && term ? (
          <SentencesForWord
            word={term}
            // TODO
            onChooseSentence={(sentence) => console.log(sentence)}
          />
        ) : (
          <span
            className="click"
            onClick={() => {
              setShowingSentences(true);
            }}
          >
            <Icon src="sticky-notes-stack" title="Show Sentences" />
            Show Sentences
          </span>
        )}
      </div>
    </>
  );
}

/**
 *
 */
export function AddTerm({ langId }: { langId: LanguagesId }): JSX.Element {
  const [{ languages }] = useData(['languages']);
  const language = languages.find((val) => val.LgID === langId);
  if (!language) {
    throw new Error('Invalid Language ID!');
  }
  const navigator = useInternalNavigate();
  const validator = AddNewWordValidator;
  const [showingSentences, setShowingSentences] = useState<boolean>(false);

  const {
    Input: WoInput,
    refMap,
    onSubmit,
    TextArea,
  } = useFormInput({
    entry: { WoLgID: langId },
    validator,
  });
  return (
    <>
      <Header title="TODO" />

      <h4>New Term</h4>
      <form name="newword" className="validate">
        <WoInput type="hidden" entryKey="WoLgID" fixed />
        <table className="tab3" cellSpacing={0} cellPadding={5}>
          <EntryRow headerText={'Language'}>
            <>{language.LgName}</>
          </EntryRow>
          <EntryRow
            entryTitle="Normally only change uppercase/lowercase here!"
            headerText={'Term'}
          >
            <WoInput
              {...getDirTag(language)}
              className="notempty setfocus checkoutsidebmp"
              // TODO
              // onBlur={do_ajax_show_similar_terms}
              id="wordfield"
              errorName="Term"
              entryKey="WoText"
              maxLength={250}
              isRequired
              size={40}
            />
          </EntryRow>
          <PrintSimilarTermsTabrow
            word={refMap.WoText.current}
            lang={refMap.WoLgID.current}
          />
          <EntryRow headerText={'Translation'}>
            <TextArea
              className="checklength checkoutsidebmp"
              onKeyDown={textareaKeydown}
              maxLength={500}
              errorName="Translation"
              name="WoTranslation"
              cols={40}
              rows={3}
            />
          </EntryRow>
          <EntryRow headerText={'Tags'}>
            <GetTagsList EntryID={null} tagKey={'tags'} />
          </EntryRow>
          <EntryRow headerText={'Romaniz.'}>
            <WoInput
              className="checkoutsidebmp"
              maxLength={100}
              size={40}
              entryKey="WoRomanization"
            />
          </EntryRow>
          <EntryRow headerText={'Sentence\nTerm in {...}'}>
            <TextArea
              {...getDirTag(language)}
              className="checklength checkoutsidebmp"
              onKeyDown={textareaKeydown}
              maxLength={1000}
              errorName="Sentence"
              name="WoSentence"
              cols={40}
              rows={3}
              rezf={refMap.WoSentence}
            />
          </EntryRow>
          <EntryRow headerText="Status">
            <StatusRadioButtons refMap={refMap} />
          </EntryRow>
          <tr>
            <td className="td1 right" colSpan={2}>
              &nbsp;
              <DictionaryLinks
                lang={language}
                // TODO
                // 'document.forms[\'editword\'].WoSentence'
                sentenceString={undefined}
                // 'document.forms[\'editword\'].WoText'
                wordString={undefined}
              />
              &nbsp; &nbsp;
              <input
                type="button"
                value="Cancel"
                onClick={() => {
                  resetDirty();
                  navigator('/edit_words');
                }}
              />
              <input
                type="button"
                value="Save"
                onClick={() => {
                  onSubmit(wordNoIdPrevalidateMap, (val) => {
                    console.log('ADDING TERM', val);
                    dataService.addTerm(val);
                    navigator('/edit_words');
                  });
                }}
              />
            </td>
          </tr>
        </table>
      </form>
      <div id="exsent">
        {showingSentences && existingTerm ? (
          <SentencesForWord
            // TODO where get term?
            word={existingTerm}
            onChooseSentence={(sentence) => console.log(sentence)}
          />
        ) : (
          <span
            className="click"
            onClick={() => {
              setShowingSentences(true);
            }}
          >
            <Icon src="sticky-notes-stack" title="Show Sentences" />
            Show Sentences
          </span>
        )}
      </div>
    </>
  );
}

/**
 *
 */
export function TermMultiActions({
  selectedTerms,
  onSelectAll,
  onSelectNone,
  allTermIDs,
}: {
  selectedTerms: Set<WordsId>;
  onSelectAll: () => void;
  onSelectNone: () => void;
  allTermIDs: WordsId[];
}) {
  const recno = allTermIDs.length;
  return (
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
            <td className="td1 center" colSpan={2}>
              <b>ALL</b> {recno === 1 ? '1 Term' : `${recno} Terms`}&nbsp;
              <select
                name="allaction"
                onChange={({ target: { value, innerText } }) => {
                  allActionGo({
                    numRecords: recno,
                    sel: { value, text: innerText },
                    onSetCapitalization: (upperCase) => {},
                    onAddTag: (tagStr) => {},
                    onClear: () => {},
                    onExport: () => {},
                    onSetStrength: (strength) => {},
                  });
                }}
              >
                <GetAllWordsActionsSelectOptions />
              </select>
            </td>
          </tr>
          <tr>
            <td className="td1 center">
              <input type="button" value="Mark All" onClick={onSelectAll} />
              <input type="button" value="Mark None" onClick={onSelectNone} />
            </td>
            <td className="td1 center">
              Marked Terms:
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
  );
}

/**
 *
 */
function PrintSimilarTermsTabrow({
  word,
  lang,
}: {
  word: string;
  lang: LanguagesId;
}) {
  const [{ settings }] = useData(['settings']);

  // TODO trigger onBlur
  const [showingSimilar, setShowingSimilar] = useState(false);

  useEffect(() => {
    if (word && lang) {
      setShowingSimilar(true);
    } else {
      setShowingSimilar(false);
    }
  }, [word, lang]);
  return (
    <>
      {settings['set-similar-terms-count'] > 0 && (
        <tr>
          <td className="td1 right">
            Similar
            <br />
            Terms:
          </td>
          <td className="td1">
            <span id="simwords" className="smaller">
              &nbsp;
              {showingSimilar ? (
                <>
                  <PrintSimilarTerms lang_id={lang} compared_term={word} />
                </>
              ) : (
                <>
                  <img src="icn/waiting2.gif" />
                </>
              )}
            </span>
          </td>
        </tr>
      )}
    </>
  );
}

/**
 *
 */
function PrintSimilarTerms({
  lang_id,
  compared_term,
}: {
  lang_id: LanguagesId;
  compared_term: string;
}) {
  const [{ settings, words }] = useData(['settings', 'words']);
  const max_count = settings['set-similar-terms-count'];
  if (max_count <= 0) {
    return <></>;
  }
  if (compared_term.trim() == '') {
    return <>&nbsp;</>;
  }
  // compare = tohtml(compared_term);
  const termarr = get_similar_terms(lang_id, compared_term, max_count, 0.33);
  // rarr = array();
  return (
    <>
      {termarr.map((termid: BrandedNumber<'wordsId'>) => {
        const record = words.find((val) => val.WoID === termid)!;
        const term = record['WoText'];
        const tra = record['WoTranslation'];
        if (tra == '*') {
          tra = '???';
        }

        const { rom, romd } =
          record.WoRomanization && record.WoRomanization.trim() !== ''
            ? {
                romd: ` [${record['WoRomanization']}]`,
                rom: record.WoRomanization,
              }
            : { rom: '', romd: '' };
        return (
          <>
            <Icon
              className="clickedit"
              src="tick-button-small"
              title="Copy → Translation &amp; Romanization Field(s)"
              onClick={() =>
                setTransRoman(
                  prepare_textdata_js(tra),
                  prepare_textdata_js(rom)
                )
              }
            />{' '}
            {stripos(compare, term) !== FALSE ? (
              <span className="red3">{term}</span>
            ) : (
              <span className="red3">
                {/* TODO */}
                <u>{' . term.replace(compare)=>this compare . '}</u>
              </span>
            )}
            {romd} — {tra}
            <br />
          </>
        );
      })}
    </>
  );
}

/**
 * TODO
 */
export function WordTag() {
  return (
    <>
      {/* // Create tag.
            var tag = $('<li></li>')
                .addClass('tagit-choice ui-widget-content ui-state-default ui-corner-all')
                .addClass(additionalClass)
                .append(label); */}

      <li className="tagit-choice ui-widget-content ui-state-default ui-corner-all">
        {/* TODO */}
        {/* this.options.onTagClicked */}
        <a className="tagit-label"></a>
        <span className="tagit-label"></span>
      </li>
    </>
  );
}

/**
 *
 */
export function GetTagsList({
  EntryID,
  tagKey,
}:
  | { EntryID: WordsId | null; tagKey: 'tags' }
  | { EntryID: TextsId | null; tagKey: 'tags2' }) {
  const guardedTagKey = (key: 'tags' | 'tags2'): key is 'tags' =>
    key === 'tags';
  const { instanceKey, idKey } = guardedTagKey(tagKey)
    ? ({ instanceKey: 'wordtags', idKey: 'WtTgID' } as const)
    : ({ instanceKey: 'texttags', idKey: 'TtTxID' } as const);
  const [{ [instanceKey]: instance, [tagKey]: tags }] = useData([
    instanceKey,
    tagKey,
  ]);
  return (
    <ul
      id="termtags"
      // TODO tagit
    >
      {EntryID !== null && (
        <>
          {instance
            .filter((row) => row[idKey] === EntryID)
            .map((row) => {
              const tag = tags.find((tag) => tag[idKey] === row[idKey]);
              if (!tag) {
                return <></>;
              }
              return <li>{tag[idKey]}</li>;
            })}
        </>
      )}
    </ul>
  );
}

/**
 *
 */
export function DictionaryLinks({
  lang,
  sentenceString: sentenceString,
  wordString: wordString,
  setTranslateAPIParams,
  setIFrameURL,
  breakSent,
}: {
  lang: Language;
  sentenceString: string;
  wordString: string;
  setTranslateAPIParams: (
    vals: (APITranslateTerm<string, string> & { apiKey: string }) | null
  ) => void;
  setIFrameURL: (url: string | null) => void;
  breakSent?: boolean;
}) {
  const { LgDict1URI, LgDict2URI, LgGoogleTranslateURI } = lang;
  return (
    <>
      Lookup Term:
      <MultiFunctionalURL
        templateStr={LgDict1URI}
        word={wordString}
        setIFrameURL={setIFrameURL}
        setTranslateAPIParams={setTranslateAPIParams}
        language={lang}
      >
        Dict1
      </MultiFunctionalURL>
      {LgDict2URI && (
        <MultiFunctionalURL
          templateStr={LgDict2URI}
          word={wordString}
          setIFrameURL={setIFrameURL}
          setTranslateAPIParams={setTranslateAPIParams}
          language={lang}
        >
          Dict2
        </MultiFunctionalURL>
      )}
      {LgGoogleTranslateURI && (
        <MultiFunctionalURL
          templateStr={LgGoogleTranslateURI}
          word={wordString}
          setIFrameURL={setIFrameURL}
          setTranslateAPIParams={setTranslateAPIParams}
          language={lang}
        >
          GTr
        </MultiFunctionalURL>
      )}
      {breakSent && <br />}
      {LgGoogleTranslateURI && (
        <>
          {breakSent ? '| Sent.' : 'Lookup Sentence'}:
          <MultiFunctionalURL
            templateStr={LgGoogleTranslateURI}
            word={sentenceString}
            setIFrameURL={setIFrameURL}
            setTranslateAPIParams={setTranslateAPIParams}
            language={lang}
          >
            GTr
          </MultiFunctionalURL>
        </>
      )}
    </>
  );
}

/**
 *
 * @param url
 * @param wordctl
 */
function translateWord2(url: string, wordctl: { value: any }) {
  if (typeof wordctl !== 'undefined' && url !== '') {
    const text = wordctl.value;
    if (typeof text === 'string') {
      owin(createTheDictUrl(url, text));
    }
  }
}

/**
 *
 * @param tra
 * @param rom
 */
function setTransRoman(tra: string, rom: string) {
  if ($('textarea[name="WoTranslation"]').length == 1)
    $('textarea[name="WoTranslation"]').val(tra);
  if ($('input[name="WoRomanization"]').length == 1)
    $('input[name="WoRomanization"]').val(rom);
  makeDirty();
}

/**
 *
 * @param lang_id
 * @param compared_term
 * @param max_count
 * @param min_ranking
 * @param words
 */
function get_similar_terms(
  lang_id: LanguagesId,
  compared_term: string,
  max_count: number,
  min_ranking: number,
  words: Word[]
) {
  // For a language lang_id and a term compared_term (UTF-8),
  // return an array with max_count wordids with a similarity ranking
  // > min_ranking, sorted decending.
  // If string is already in database, it will be excluded in results.
  const compared_term_lc = compared_term.toLowerCase();
  const sql = words.filter(
    (word) => word.WoLgID === lang_id && word.WoTextLC !== compared_term_lc
  );
  const termlsd = Object.fromEntries(
    sql.map((record) => [
      record['WoID'],
      getSimilarityRanking(compared_term_lc, record['WoTextLC']),
    ])
  );
  // arsort(termlsd, SORT_NUMERIC);
  const r: string[] = [];
  let i = 0;
  Object.entries(termlsd).forEach(([key, val]) => {
    if (i >= max_count) {
      // TODO check behavior against php break
      return;
    }
    if (val < min_ranking) {
      return;
    }
    i++;
    r[i] = key;
  });
  return r;
}

/**
 *
 * @param str1
 * @param str2
 */
function getSimilarityRanking(str1: string, str2: string) {
  // Returns SimilarityRanking of two UTF-8 strings str1 and str2
  // Source http://www.catalysoft.com/articles/StrikeAMatch.html
  // Source http://stackoverflow.com/questions/653157
  const pairs1 = wordLetterPairs(str1);
  const pairs2 = wordLetterPairs(str2);
  const union = pairs1.length + pairs2.length;
  if (union == 0) {
    return 0;
  }
  const intersection = new Set(...pairs1, ...pairs2).size;
  return (2.0 * intersection) / union;
}

/**
 *
 * @param str
 */
function wordLetterPairs(str: string) {
  const allPairs = [];
  const words = str.split(' ');
  for (let w = 0; w < words.length; w++) {
    const pairsInWord = letterPairs(words[w]);
    for (let p = 0; p < pairsInWord.length; p++) {
      allPairs[pairsInWord[p]] = pairsInWord[p];
    }
  }
  return array_values(allPairs);
}

/**
 *
 * @param str
 */
function letterPairs(str: string) {
  const numPairs = str.length - 1;
  const pairs = [];
  for (let i = 0; i < numPairs; i++) {
    pairs[i] = mb_substr(str, i, 2);
  }
  return pairs;
}
