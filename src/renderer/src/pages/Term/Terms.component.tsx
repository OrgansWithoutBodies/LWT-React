import { useEffect, useState } from 'react';
import { dataService } from '../../data/data.service';
import {
  wordNoIDPrevalidateMap,
  wordPrevalidateMap,
} from '../../data/preValidateMaps';
import {
  EditWordsValidator,
  LanguagesID,
  TagsID,
  TextsID,
  WordsID,
} from '../../data/validators';
import { useData } from '../../hooks/useData';
import { useFormInput } from '../../hooks/useFormInput';
import {
  useInternalNavigate,
  useUpdateParams,
} from '../../hooks/useInternalNav';
import { usePager } from '../../hooks/usePager';
import { useSelection } from '../../hooks/useSelection';
import { useSettingWithDefault } from '../../hooks/useSettingWithDefault';
import { A } from '../../nav/InternalLink';
import { EntryRow } from '../../ui-kit/EntryRow';
import { Header } from '../../ui-kit/Header';
import { Icon } from '../../ui-kit/Icon';
import { LanguageDropdown } from '../../ui-kit/LanguageDropdown';
import { SortableHeader } from '../../ui-kit/SortableHeader';
import { StatusRadioButtons } from '../../ui-kit/StatusRadioButtons';
import { TableFooter } from '../../ui-kit/TableFooter';
import { TagAndOr } from '../../ui-kit/TagAndOr';
import { TagDropDown } from '../../ui-kit/TagDropDown';
import { WordTagsAutocomplete } from '../../ui-kit/TagsAutocomplete';
import { filterTags } from '../../utils/filterTags';
import { getDirTag } from '../../utils/getDirTag';
import { AddNewWordValidator, Word } from '../../utils/parseMySqlDump';
import { DateDiff } from '../../utils/time';
import { allActionGo, confirmDelete } from '../../utils/utils';
import { prepare_textdata_js } from '../../utils/windowFunctions';
import { FilterSortPager } from '../ArchivedText/FilterSortPager';
import { buildTextTagLookup } from '../ArchivedText/buildTextTagLookup';
import { textareaKeydown } from '../IO/CheckForm';
import {
  GetAllWordsActionsSelectOptions,
  GetMultipleWordsSctionsSelectoptions,
} from '../SelectOptions';
import { WordSorting, sortingMethod } from '../Sorting';
import { getStatusName, get_status_abbr } from '../StrengthMap';
import { SentencesForWord } from './AddNewWordPane';
import { DictionaryLinks } from './DictionaryLinks';

function TermsHeader({ sorting }: { sorting: WordSorting }): JSX.Element {
  const [{ activeLanguageID }] = useData(['activeLanguageID']);
  return (
    <tr>
      <th className="th1 sorttable_nosort">Mark</th>
      <th className="th1 sorttable_nosort">Act.</th>
      {activeLanguageID === null && (
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

export function TermsFilterBox({
  numTerms,

  currentPage,
  activeLanguageID,
  numPages,
  tag12,
  tag1,
  tag2,
  sorting,
  status,
  textFilter,
}: {
  textFilter: TextsID | null;

  activeLanguageID: LanguagesID | null;
  numTerms: number;
  numPages: number;
  currentPage: number;
  status: number | null;
  tag1: TagsID | null;
  tag2: TagsID | null;
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
                activeLanguageID !== null ? activeLanguageID : undefined
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
              {(activeLanguageID !== null
                ? texts.filter(({ TxLgID }) => TxLgID === activeLanguageID)
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
  const [{ activeLanguageID, languages }] = useData([
    'activeLanguageID',
    'languages',
  ]);
  const foundLanguage = activeLanguageID
    ? null
    : languages.find((val) => val.LgID === word.WoLgID);
  if (!foundLanguage && !activeLanguageID) {
    throw new Error('Invalid Word Language ID!');
  }
  return (
    <tr>
      <td id={`rec${termID}`} className="td1 center">
        <A>
          <input
            name="marked[]"
            type="checkbox"
            // TODO
            // onClick={markClick}
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
      {!activeLanguageID && (
        <td className="td1 center">{foundLanguage?.LgName}</td>
      )}
      <td className="td1">
        <span>{word.WoText}</span> /{' '}
        <span
          id={`roman${termID}`}
          className="edit_area clickedit"
          title="Click to edit..."
        >
          {/* TODO click to edit */}
          {word.WoRomanization}
        </span>
      </td>
      <td className="td1">
        <span
          id={`trans${termID}`}
          className="edit_area clickedit"
          title="Click to edit..."
        >
          {/* TODO click to edit */}
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
                      <a href="edit_words?page=1&;query=&;status=&;tag12=0&;tag2=&;tag1=&;text=' . record['TxID'] . '">
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
          ? `/${DateDiff(new Date(), new Date(word.WoStatusChanged))}`
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
        // TODO
        // if ($currentsort === 6) {
        //   if ($currenttext !== '')
        //     $sql = '';
        //   else
        //     $sql = 'select WoID, 0 AS textswordcount, WoText, WoTranslation, WoRomanization, WoSentence, ifnull(WoSentence,\'\') like concat(\'%{\',WoText,\'}%\') as SentOK, WoStatus, LgName, LgRightToLeft, DATEDIFF( NOW( ) , WoStatusChanged ) AS Days, WoTodayScore AS Score, WoTomorrowScore AS Score2, ifnull(concat(\'[\',group_concat(distinct TgText order by TgText separator \', \'),\']\'),\'\') as taglist, WoTextLC, WoTodayScore from ((' . $tbpref . 'words left JOIN ' . $tbpref . 'wordtags ON WoID = WtWoID) left join ' . $tbpref . 'tags on TgID = WtTgID), ' . $tbpref . 'languages where WoLgID = LgID and WoTextLC NOT IN (SELECT DISTINCT TiTextLC from ' . $tbpref . 'textitems where TiLgID = LgID) ' . $wh_lang . $wh_stat . $wh_query . ' group by WoID ' . $wh_tag . ' UNION ';
        //   $sql .= 'select WoID, count(WoID) AS textswordcount, WoText, WoTranslation, WoRomanization, WoSentence, ifnull(WoSentence,\'\') like concat(\'%{\',WoText,\'}%\') as SentOK, WoStatus, LgName, LgRightToLeft, DATEDIFF( NOW( ) , WoStatusChanged ) AS Days, WoTodayScore AS Score, WoTomorrowScore AS Score2, ifnull(concat(\'[\',group_concat(distinct TgText order by TgText separator \', \'),\']\'),\'\') as taglist, WoTextLC, WoTodayScore from ((' . $tbpref . 'words left JOIN ' . $tbpref . 'wordtags ON WoID = WtWoID) left join ' . $tbpref . 'tags on TgID = WtTgID), ' . $tbpref . 'languages, ' . $tbpref . 'textitems where TiLgID = WoLgID and TiTextLC = WoTextLC and WoLgID = LgID ';
        //   if ($currenttext !== '')
        //     $sql .= 'and TiTxID = ' . $currenttext . ' ';
        //   $sql .= $wh_lang . $wh_stat . $wh_query . ' group by WoID ' . $wh_tag . ' order by ' . $sorts[$currentsort - 1] . ' ' . $limit;
        // } else {
        //   if ($currenttext === '') {
        //     $sql = 'select WoID, WoText, WoTranslation, WoRomanization, WoSentence, ifnull(WoSentence,\'\') like concat(\'%{\',WoText,\'}%\') as SentOK, WoStatus, LgName, LgRightToLeft, DATEDIFF( NOW( ) , WoStatusChanged ) AS Days, WoTodayScore AS Score, WoTomorrowScore AS Score2, ifnull(concat(\'[\',group_concat(distinct TgText order by TgText separator \', \'),\']\'),\'\') as taglist from ((' . $tbpref . 'words left JOIN ' . $tbpref . 'wordtags ON WoID = WtWoID) left join ' . $tbpref . 'tags on TgID = WtTgID), ' . $tbpref . 'languages where WoLgID = LgID ' . $wh_lang . $wh_stat . $wh_query . ' group by WoID ' . $wh_tag . ' order by ' . $sorts[$currentsort - 1] . ' ' . $limit;
        //   } else {
        //     $sql = 'select distinct WoID, WoText, WoTranslation, WoRomanization, WoSentence, ifnull(WoSentence,\'\') like \'%{%}%\' as SentOK, WoStatus, LgName, LgRightToLeft, DATEDIFF( NOW( ) , WoStatusChanged ) AS Days, WoTodayScore AS Score, WoTomorrowScore AS Score2, ifnull(concat(\'[\',group_concat(distinct TgText order by TgText separator \', \'),\']\'),\'\') as taglist from ((' . $tbpref . 'words left JOIN ' . $tbpref . 'wordtags ON WoID = WtWoID) left join ' . $tbpref . 'tags on TgID = WtTgID), ' . $tbpref . 'languages, ' . $tbpref . 'textitems where TiLgID = WoLgID and TiTextLC = WoTextLC and TiTxID = ' . $currenttext . ' and WoLgID = LgID ' . $wh_lang . $wh_stat . $wh_query . ' group by WoID ' . $wh_tag . ' order by ' . $sorts[$currentsort - 1] . ' ' . $limit;
        //   }
        // }
        <td className="td1 center" style={{ whiteSpace: 'nowrap' }}>
          {/* TODO */}
          {/* ' . record['textswordcount'] . ' */}
        </td>
      )}
    </tr>
  );
}

export function Terms({
  pageNum = null,
  sort = WordSorting['Term A-Z'],
  status = null,
  textFilter = null,
  tag1,
  tag12 = 0,
  tag2,
}: {
  textFilter: TextsID | null;
  pageNum: number | null;
  // filterlang: LanguagesID | null;
  status: number | null;
  tag1: TagsID | null;
  tag12: 0 | 1;
  tag2: TagsID | null;
  sort?: WordSorting;
}): JSX.Element {
  const [{ words, activeLanguage, tags, wordtags }] = useData([
    'words',
    'tags',
    'activeLanguage',
    'wordtags',
  ]);

  const { ['set-terms-per-page']: pageSize } = useSettingWithDefault([
    'set-terms-per-page',
  ]);

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
            activeLanguageID={activeLanguage ? activeLanguage.LgID : null}
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
    setDirty,
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
  const onCopyTransRoman: CopyTransRomanHandler = () => {};
  return (
    <>
      <Header
        title={`My ${termLanguage.LgName} Terms (Words and Expressions)`}
      />

      <h4>Edit Term</h4>
      <form name="editword">
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
                onBlur={
                  () => {} // do_ajax_show_similar_terms(
                  //   {
                  //     lang: chgID,
                  //     word: refMap.WoText.current.value,
                  //   },
                  //   () => {},
                  //   setShowingSentences()
                  // )
                }
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
            onCopyTransRoman={onCopyTransRoman}
            word={refMap.WoText.current?.value}
            lang={refMap.WoLgID.current?.value}
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
              <WordTagsAutocomplete ref={refMap.taglist} onChange={setDirty} />
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
                onChange={setDirty}
                defaultStatus={term.WoStatus}
                refMap={refMap}
              />
            </td>
          </tr>
          <tr>
            <td className="td1 right" colSpan={2}>
              &nbsp;
              <DictionaryLinks
                langDictData={termLanguage}
                sentenceString={term.WoSentence}
                wordString={term.WoText}
              />
              &nbsp; &nbsp;
              <input
                type="button"
                value="Cancel"
                onClick={() => {
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

export function AddTerm({ langID }: { langID: LanguagesID }): JSX.Element {
  const [{ languages }] = useData(['languages']);
  const language = languages.find((val) => val.LgID === langID);
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
    setDirty,
  } = useFormInput({
    entry: { WoLgID: langID },
    validator,
  });
  const onCopyTransRoman: CopyTransRomanHandler = () => {};
  return (
    <>
      <Header title={`My ${language.LgName} Terms (Words and Expressions)`} />

      <h4>New Term</h4>
      <form name="newword">
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
            word={refMap.WoText.current?.value}
            lang={refMap.WoLgID.current?.value}
            onCopyTransRoman={onCopyTransRoman}
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
            <WordTagsAutocomplete ref={refMap.taglist} onChange={setDirty} />
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
            <StatusRadioButtons onChange={setDirty} refMap={refMap} />
          </EntryRow>
          <tr>
            <td className="td1 right" colSpan={2}>
              &nbsp;
              <DictionaryLinks
                langDictData={language}
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
                  navigator('/edit_words');
                }}
              />
              <input
                type="button"
                value="Save"
                onClick={() => {
                  onSubmit(wordNoIDPrevalidateMap, (val) => {
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
        {/* {showingSentences && existingTerm ? (
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
        )} */}
      </div>
    </>
  );
}

export function TermMultiActions({
  selectedTerms,
  onSelectAll,
  onSelectNone,
  allTermIDs,
}: {
  selectedTerms: Set<WordsID>;
  onSelectAll: () => void;
  onSelectNone: () => void;
  allTermIDs: WordsID[];
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
                    onSetCapitalization: (upperCase) => {
                      if (upperCase) {
                        return dataService.setTermTextUppercase(allTermIDs);
                      }
                      return dataService.setTermTextUppercase(allTermIDs);
                    },
                    onAddTag: (tagStr) => {
                      dataService.addPotentiallyNewTagToTerms(
                        tagStr,
                        allTermIDs
                      );
                    },
                    onClear: () => {},
                    onExport: () => {},
                    onSetStrength: (newStrength) => {
                      // TODO shouldn't need to map
                      allTermIDs.map((val) => {
                        dataService.updateTermStrength(val, newStrength);
                      });
                    },
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
                <GetMultipleWordsSctionsSelectoptions />
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  );
}

function PrintSimilarTermsTabrow({
  word,
  lang,
  onCopyTransRoman,
}: {
  word: string;
  lang: LanguagesID;
  onCopyTransRoman: CopyTransRomanHandler;
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
                  <PrintSimilarTerms
                    lang_id={lang}
                    compared_term={word}
                    onCopyTransRoman={onCopyTransRoman}
                  />
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

type CopyTransRomanHandler = (
  copyData: Pick<Word, 'WoTranslation' | 'WoRomanization'>
) => void;

function PrintSimilarTerms({
  lang_id,
  compared_term,
  onCopyTransRoman,
}: {
  lang_id: LanguagesID;
  compared_term: string;
  onCopyTransRoman: CopyTransRomanHandler;
}) {
  const [{ settings, words }] = useData(['settings', 'words']);
  const max_count = settings['set-similar-terms-count'];
  if (max_count <= 0) {
    return <></>;
  }
  console.log({ compared_term });
  if (compared_term.trim() === '') {
    return <>&nbsp;</>;
  }
  const termarr = get_similar_terms(
    lang_id,
    compared_term,
    max_count,
    0.33,
    words
  );
  // rarr = array();
  return (
    <>
      {termarr.map((termid) => {
        const word = words.find((val) => val.WoID === termid)!;
        const termText = word['WoText'];
        const tra =
          word['WoTranslation'] === '*' ? '???' : word['WoTranslation'];

        const { rom, romd } =
          word.WoRomanization && word.WoRomanization.trim() !== ''
            ? {
                romd: ` [${word['WoRomanization']}]`,
                rom: word.WoRomanization,
              }
            : { rom: '', romd: '' };
        const compare = compared_term;

        return (
          <>
            <Icon
              className="clickedit"
              src="tick-button-small"
              title="Copy → Translation & Romanization Field(s)"
              onClick={() =>
                onCopyTransRoman({
                  WoTranslation: prepare_textdata_js(tra),
                  WoRomanization: prepare_textdata_js(rom),
                })
              }
            />{' '}
            {compare.includes('term') !== false ? (
              <span className="red3">{termText}</span>
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
 *
 * @param tra
 * @param rom
 */
function setTransRoman(tra: string, rom: string) {
  if ($('textarea[name="WoTranslation"]').length === 1)
    $('textarea[name="WoTranslation"]').val(tra);
  if ($('input[name="WoRomanization"]').length === 1)
    $('input[name="WoRomanization"]').val(rom);
  setDirty();
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
  lang_id: LanguagesID,
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
  // TODO
  // arsort(termlsd, SORT_NUMERIC);
  const r: WordsID[] = [];
  let i = 0;

  // TODO this is just a filter
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
  if (union === 0) {
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
