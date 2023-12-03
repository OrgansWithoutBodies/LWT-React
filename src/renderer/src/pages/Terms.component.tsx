import { dataService } from '../data/data.service';
import { AddNewWordValidator, Tag, Tag2, Word } from '../data/parseMySqlDump';
import { useData } from '../data/useAkita';
import {
  EditWordsValidator,
  LanguagesId,
  TagsId,
  TextsId,
  WordsId,
} from '../data/validators';
import { useFormInput } from '../hooks/useFormInput';
import {
  PathParams,
  useInternalNavigate,
  useUpdateParams,
} from '../hooks/useInternalNav';
import { usePager } from '../hooks/usePager';
import { useSelection } from '../hooks/useSelection';
import { A } from '../nav/InternalLink';
import { Header } from '../ui-kit/Header';
import { Icon } from '../ui-kit/Icon';
import { LanguageDropdown } from '../ui-kit/LanguageDropdown';
import { Pager } from '../ui-kit/Pager';
import { NumericalStrength } from './AddNewTermTooltip';
import { StatusRadioButtons, do_ajax_show_sentences } from './AddNewWordPane';
import { resetAll } from './EditArchivedTexts.component';
import { pluralize } from './EditTags';
import { filterTags } from './Library.component';
import { Sorting, resetDirty } from './Sorting';
import { StrengthMapNumericalKey } from './StrengthMap';
import { WordTagsSelectDropdown } from './WordTagsSelectDropdown';
import { wordNoIdPrevalidateMap, wordPrevalidateMap } from './preValidateMaps';
import { confirmDelete } from './utils';

const isTags = (tags: Tag[] | Tag2[]): tags is Tag[] =>
  tags[0] && 'TgID' in tags[0];
// TODO tagKey type restricted to path param

export function TagDropDown({
  tags,
  tagKey,
}: {
  tags: Tag[] | Tag2[];
  tagKey: PathParams;
}): JSX.Element {
  const updateParams = useUpdateParams();
  return (
    <select
      name="tag1"
      onChange={({ target: { value } }) => {
        updateParams({ [tagKey]: value });
      }}
    >
      <option value="" selected>
        [Filter off]
      </option>
      {isTags(tags)
        ? tags.map((tag) => <option value={tag.TgID}>{tag.TgText}</option>)
        : tags.map((tag) => <option value={tag.T2ID}>{tag.T2Text}</option>)}

      <option disabled>--------</option>
      <option value="-1">UNTAGGED</option>
    </select>
  );
}

function TermsHeader({ sorting }: { sorting: Sorting }): JSX.Element {
  return (
    <tr>
      <th className="th1 sorttable_nosort">Mark</th>
      <th className="th1 sorttable_nosort">Act.</th>
      <th className="th1 clickable">
        Term /
        <br />
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
      {sorting === Sorting['Word Count Active Texts'] && (
        <th
          className="th1 sorttable_numeric clickable"
          title="Word Count in Active Texts"
        >
          WCnt
          <br />
          Txts
        </th>
      )}
    </tr>
  );
}

// TODO abstract out filterbox

export function TermsFilterBox({
  numTerms,
  currentPage,
  activeLanguageId,
  numPages,
  tag12,
}: {
  activeLanguageId: LanguagesId | null;
  numTerms: number;
  numPages: number;
  currentPage: number;
  tag12: 0 | 1;
}): JSX.Element {
  const [{ tags, texts }] = useData(['tags', 'texts']);
  // TODO usePager available here - contextprovider?
  // TODO why would need pager in filter box?
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
              onClick={() => resetAll('edit_words')}
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
            <TagDropDown tags={tags} tagKey="tag1" />
          </td>
          <TagAndOr
            defaultValue={tag12}
            onChange={({ target: { value } }) => {
              navigate(`/edit_words?page=${1}&tag12=${value}`);
            }}
          />
          <td style={{ whiteSpace: 'nowrap' }} className="td1 center">
            Tag #2:
            <TagDropDown tags={tags} tagKey="tag2" />
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
              defaultValue="3"
              onChange={({ target: { value } }) => {
                // TODO udpate params
                navigate(`/edit_words?page=1&sort=${value}`);
              }}
            >
              <option value="1">Term A-Z</option>
              <option value="2">Translation A-Z</option>
              <option value="3">Newest first</option>
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

export function TagAndOr({
  onChange,
  defaultValue,
}: {
  onChange: (arg: { target: { value: '0' | '1' } }) => void;
  defaultValue?: 0 | 1;
}) {
  return (
    <td style={{ whiteSpace: 'nowrap' }} className="td1 center">
      Tag #1 ..
      <select
        defaultValue={defaultValue}
        name="tag12"
        onChange={onChange as (arg: { target: { value: any } }) => void}
      >
        <option value={0}>... OR ...</option>
        <option value={1}>... AND ...</option>
      </select>
      .. Tag #2
    </td>
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
            {numTerms} Term{pluralize(numTerms)}
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
  tags,
  sorting,
}: {
  sorting: Sorting;
  word: Word;
  tags: string[];
  isSelected: boolean;
  onSelect: (term: Word, checked: boolean) => void;
}): JSX.Element {
  const termID = word.WoID;
  const sentence = word.WoSentence;

  return (
    <tr>
      <td id={`rec${termID}`} className="td1 center">
        <A>
          <input
            name="marked[]"
            type="checkbox"
            className="markcheck"
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
        </span>{' '}
        <span className="smallgray2">[{tags.join(', ')}]</span>
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
      <td className="td1 center" title="Learning">
        {/* TODO */}
        1/1
      </td>
      <td style={{ whiteSpace: 'nowrap' }} className="td1 center">
        <span className="scorered">
          {/* TODO */}
          0
          <Icon src="status-busy" title="Test today!" />
        </span>
      </td>
      {sorting === Sorting['Word Count Active Texts'] && (
        <td className="td1 center" style={{ whiteSpace: 'nowrap' }}>
          {/* TODO */}
          {/* ' . $record['textswordcount'] . ' */}
        </td>
      )}
    </tr>
  );
}
const sortingMethod = (
  sort: Sorting
): ((termA: Word, termB: Word) => 1 | -1 | 0) => {
  switch (sort) {
    case Sorting['Oldest first']:
      return oldestFirstSort;
    case Sorting['Newest first']:
      return newestFirstSort;
    // TODO
    case Sorting['Score Value (%)']:
      return (a, b) =>
        a.WoCreated > b.WoCreated ? -1 : a.WoCreated < b.WoCreated ? 1 : 0;
    case Sorting.Status:
      return (a, b) =>
        a.WoStatus > b.WoStatus ? -1 : a.WoStatus < b.WoStatus ? 1 : 0;
    // TODO
    case Sorting['Term A-Z']:
      return (a, b) => (a.WoText > b.WoText ? -1 : a.WoText < b.WoText ? 1 : 0);
    // TODO
    case Sorting['Translation A-Z']:
      return (a, b) =>
        a.WoTranslation > b.WoTranslation
          ? 1
          : a.WoTranslation < b.WoTranslation
          ? -1
          : 0;
    // TODO
    case Sorting['Word Count Active Texts']:
      return (a, b) =>
        a.WoCreated > b.WoCreated ? -1 : a.WoCreated < b.WoCreated ? 1 : 0;
  }
};

const newestFirstSort = (a: Word, b: Word): 1 | -1 | 0 =>
  Date.parse(a.WoCreated) > Date.parse(b.WoCreated)
    ? -1
    : Date.parse(a.WoCreated) < Date.parse(b.WoCreated)
    ? 1
    : 0;
const oldestFirstSort = (a: Word, b: Word): 1 | -1 | 0 =>
  Date.parse(a.WoCreated) > Date.parse(b.WoCreated)
    ? 1
    : Date.parse(a.WoCreated) < Date.parse(b.WoCreated)
    ? -1
    : 0;

export function Terms({
  pageNum = null,
  // filterlang = null,
  sort = Sorting['Term A-Z'],
  status = null,
  textFilter,
  tag1,
  tag12 = 0,
  tag2,
}: {
  textFilter: TextsId | null;
  pageNum: number | null;
  // filterlang: LanguagesId | null;
  // TODO statusVal
  status: number | null;
  // TODO tagID
  tag1: TagsId | null;
  tag12: 0 | 1;
  tag2: TagsId | null;
  sort?: Sorting;
}): JSX.Element {
  const [{ words, activeLanguage, settings, tags, wordtags }] = useData([
    'words',
    'tags',
    'activeLanguage',
    'settings',
    'wordtags',
    // 'texttags',
  ]);
  const pageSize = settings['set-terms-per-page'] || 10;
  // if (!activeLanguage) {
  //   return <></>;
  // }
  // const textTagsMatchingTag1=texttags.filter((tag)=>tag.TtTxID===)
  // const navigator = useInternalNavigate();
  const filteredWordTags = wordtags.filter((tag) =>
    filterTags(tag.WtTgID, tag1, tag2, tag12)
  );
  const filteredWords = words.filter((val) => {
    const allTagsForThisWord = wordtags.filter(
      ({ WtWoID }) => WtWoID === val.WoID
    );
    // TODO - find if in target text
    const isRightText = textFilter === null ? true : true;
    const isRightStatus = status === null ? true : val.WoStatus === status;
    const isRightLang =
      activeLanguage === null ? true : val.WoLgID === activeLanguage?.LgID;
    const isRightTag1 =
      tag1 === null
        ? true
        : allTagsForThisWord.find((val) => val.WtTgID === tag1);
    const isRightTag2 =
      tag2 === null
        ? true
        : allTagsForThisWord.find((val) => val.WtTgID === tag2);

    const compoundTagStatement = filterTags(tag, tag1, tag2, tag12);

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
            tag12={tag12}
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
            allTermIDs={filteredWords.map((val) => val.WoID)}
          />
          <table className="sortable tab1">
            <TermsHeader sorting={sort} />
            <tbody>
              {displayedWords.map((word) => (
                <TermLine
                  tags={wordtags
                    .filter((val) => val.WtWoID === word.WoID)
                    .map(
                      (val) =>
                        tags.find((tag) => tag.TgID === val.WtTgID)?.TgText
                    )}
                  word={word}
                  onSelect={onSelect}
                  sorting={sort}
                  isSelected={selectedValues.has(word.WoID)}
                />
              ))}
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

export function EditTerm({ chgID }: { chgID: number }): JSX.Element {
  const [{ words, activeLanguage }] = useData(['words', 'activeLanguage']);
  const term = words.find((val) => val.WoID === chgID);
  const validator = EditWordsValidator;
  const navigator = useInternalNavigate();
  const {
    Input: WoInput,
    onSubmit,
    refMap,
  } = useFormInput({ validator, entry: term });
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
        title={`My ${activeLanguage?.LgName} Terms (Words and Expressions)`}
      />

      <h4>Edit Term</h4>
      <form name="editword" className="validate">
        <WoInput type="hidden" entryKey="WoID" fixed />
        <WoInput type="hidden" entryKey="WoLgID" fixed />
        <WoInput type="hidden" entryKey="WoCreated" fixed />
        {/* TODO */}
        <input type="hidden" name="WoOldStatus" value={term.WoStatus} />
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
          <PrintSimilarTermsTabrow />
          <tr>
            <td className="td1 right">Translation:</td>
            <td className="td1">
              <textarea
                className="textarea-noreturn checklength checkoutsidebmp"
                maxLength={500}
                errorName="Translation"
                name="WoTranslation"
                cols={40}
                rows={3}
                ref={refMap.WoTranslation}
                defaultValue={term.WoTranslation}
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
              <input
                type="button"
                value="Change"
                onClick={() => {
                  onSubmit(wordPrevalidateMap, (val) => {
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
        <span
          className="click"
          // TODO
          onClick={() => {
            // TODO repare_textdata_js
            do_ajax_show_sentences(term.WoLgID, term.WoTextLC, term.WoSentence);
          }}
        >
          <Icon src="sticky-notes-stack" title="Show Sentences" /> Show
          Sentences
        </span>
      </div>
    </>
  );
}

export function AddTerm({ langId }: { langId: LanguagesId }): JSX.Element {
  const [{ languages }] = useData(['languages']);
  const language = languages.find((val) => val.LgID === langId);
  if (!language) {
    throw new Error('Invalid Language ID!');
  }
  const navigator = useInternalNavigate();
  const validator = AddNewWordValidator;

  const {
    Input: WoInput,
    refMap,
    onSubmit,
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
          <tr>
            <td className="td1 right">Language:</td>
            {/* TODO not necessarily active */}
            <td className="td1">{language.LgName}</td>
          </tr>
          <tr title="Normally only change uppercase/lowercase here!">
            <td className="td1 right">Term:</td>
            <td className="td1">
              <WoInput
                // TODO whats this
                // <?php echo $scrdir; ?>
                className="notempty setfocus checkoutsidebmp"
                type="text"
                id="wordfield"
                errorName="Term"
                entryKey="WoText"
                maxLength={250}
                isRequired
                size={40}
              />
            </td>
          </tr>
          <PrintSimilarTermsTabrow />

          <tr>
            <td className="td1 right">Translation:</td>
            <td className="td1">
              <textarea
                className="textarea-noreturn checklength checkoutsidebmp"
                maxLength={500}
                errorName="Translation"
                name="WoTranslation"
                cols={40}
                rows={3}
                ref={refMap.WoTranslation}
              />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Tags:</td>
            <td className="td1">
              <GetTagsList EntryID={null} tagKey={'tags'} />
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
                errorName="Sentence"
                name="WoSentence"
                cols={40}
                rows={3}
                ref={refMap.WoSentence}
              />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Status:</td>
            <StatusRadioButtons refMap={refMap} />
          </tr>
          <tr>
            <td className="td1 right" colSpan={2}>
              &nbsp;
              {/* TODO */}
              {/* <?php echo createDictLinksInEditWin2($record['WoLgID'],'document.forms[\'editword\'].WoSentence','document.forms[\'editword\'].WoText'); ?> */}
              {/* createDictLinksInEditWin2 */}
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
        <span
          className="click"
          // TODO
          onClick={() => {
            // TODO prepare_textdata_js
            do_ajax_show_sentences(
              refMap.WoLgID.current.value,
              refMap.WoText.current.value,
              refMap.WoSentence.current.value
            );
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
              <b>ALL</b>
              {recno == 1 ? '1 Term' : `${recno} Terms`}&nbsp;
              <select
                name="allaction"
                onChange={({ target: { value } }) => {
                  // TODO
                  // onChange="allActionGo(document.form2, document.form2.allaction,<?php echo recno; ?>);"
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
      <GetSetStatusOption n={1} suffix={'all'} />
      <GetSetStatusOption n={5} suffix={'all'} />
      <GetSetStatusOption n={99} suffix={'all'} />
      <GetSetStatusOption n={98} suffix={'all'} />
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

function GetSetStatusOption({
  n,
  suffix,
}: {
  n: NumericalStrength;
  suffix: string;
}) {
  return (
    <option value={`s${n}${suffix}`}>
      Set Status to {get_status_name(n)}[{get_status_abbr(n)}]
    </option>
  );
}

// TODO

function do_ajax_show_similar_terms() {
  $('#simwords').html('<img src="icn/waiting2.gif" />');
  $.post(
    'ajax_show_similar_terms.php',
    { lang: $('#langfield').val(), word: $('#wordfield').val() },
    function (data) {
      $('#simwords').html(data);
    }
  );
}

export function PrintSimilarTermsTabrow() {
  const [{ settings }] = useData(['settings']);
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
            </span>
          </td>
        </tr>
      )}
    </>
  );
}

export function WordTag() {
  return (
    <>
      <li className="tagit-choice ui-widget-content ui-state-default ui-corner-all">
        {/* this.options.onTagClicked */}
        <a className="tagit-label"></a>
        <span className="tagit-label"></span>
      </li>
    </>
  );
}

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
    <ul id="termtags">
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
 * @param $n
 */
function get_status_name($n: NumericalStrength) {
  return StrengthMapNumericalKey[$n].name;
}

// -------------------------------------------------------------

/**
 *
 * @param $n
 */
function get_status_abbr($n: NumericalStrength) {
  return StrengthMapNumericalKey[$n].abbr;
}
