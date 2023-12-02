import { useState } from 'react';
import { dataService } from '../data/data.service';
import { Tags, Tags2, Words } from '../data/parseMySqlDump';
import { useData } from '../data/useAkita';
import {
  LanguagesId,
  TagsId,
  TextsId,
  WordsId,
  WordsValidator,
  WordsValidatorNoId,
} from '../data/validators';
import { CheckAndSubmit, RefMap, parseNumMap } from '../forms/Forms';
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
import { Icon, RequiredLineButton } from '../ui-kit/Icon';
import { LanguageDropdown } from '../ui-kit/LanguageDropdown';
import { Pager } from '../ui-kit/Pager';
import { StatusRadioButtons, do_ajax_show_sentences } from './AddNewWordPane';
import { resetAll } from './EditArchived.component';
import { Sorting, resetDirty } from './Sorting';
import { WordTagsSelectDropdown } from './buildFormInput';
import { confirmDelete } from './utils';

const isTags = (tags: Tags[] | Tags2[]): tags is Tags[] =>
  tags[0] && 'TgID' in tags[0];
// TODO tagKey type restricted to path param

export function TagDropDown({
  tags,
  tagKey,
}: {
  tags: Tags[] | Tags2[];
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

function TermsHeader(): JSX.Element {
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
      <select defaultValue={defaultValue} name="tag12" onChange={onChange}>
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
            {numTerms} Term
            {numTerms === 1 ? '' : 's'}
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
  onSelect: (term: Words, checked: boolean) => void;
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
        </span>
        <span className="smallgray2" />
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
      return (a, b) =>
        a.WoCreated > b.WoCreated ? 1 : a.WoCreated < b.WoCreated ? -1 : 0;
    case Sorting['Newest first']:
      return (a, b) =>
        a.WoCreated > b.WoCreated ? -1 : a.WoCreated < b.WoCreated ? 1 : 0;
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

export function Terms({
  pageNum = null,
  // filterlang = null,
  sort = null,
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
  sort: Sorting | null;
}): JSX.Element {
  const [{ words, activeLanguage, settings, wordtags }] = useData([
    'words',
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
  const filteredWords = words.filter((val) => {
    const allTagsForThisWord = wordtags.filter(
      ({ WtWoID }) => WtWoID === val.WoID
    );
    const isRightText =
      textFilter === null
        ? true
        : // TODO - find if in target text
          // : Number.parseInt(val.WoText) === textFilter;
          true;
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

    // TODO account for both tags empty
    const compoundTagStatement =
      tag12 === 0
        ? // need an extra check to avoid sticking when only one tag is specified? I think

          isRightTag1 || (tag2 === null ? false : isRightTag2)
        : isRightTag1 && isRightTag2;

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
          />
          <table className="sortable tab1">
            <TermsHeader />
            <tbody>
              {displayedWords.map((word) => (
                <TermLine
                  word={word}
                  onSelect={onSelect}
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

export function ChangeTerm({ chgID }: { chgID: number }): JSX.Element {
  const [{ words, activeLanguage }] = useData(['words', 'activeLanguage']);
  const term = words.find((val) => val.WoID === chgID);
  const validator = WordsValidator;
  const refMap = RefMap(validator);
  const navigator = useInternalNavigate();
  const WoInput = useFormInput(refMap, term);
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
                // id="wordfield"
                // data_info="Term"
                entryKey="WoText"
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
                // data_info="Sentence"
                name="WoSentence"
                cols={40}
                rows={3}
                defaultValue={term.WoSentence}
              />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Status:</td>
            <td className="td1">{term.WoStatus}</td>
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
                  // TODO
                  // CheckAndSubmit(refMap, {}, validator, (val) => {
                  //   dataService.addTerm(val);
                  // });
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
            do_ajax_show_sentences(term.WoLgID, term.WoTextLC, term.WoSentence);
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

export function AddTerm({ langId }: { langId: LanguagesId }): JSX.Element {
  const [{ languages }] = useData(['languages']);
  const language = languages.find((val) => val.LgID === langId);
  if (!language) {
    throw new Error('Invalid Language ID!');
  }
  const validator = WordsValidatorNoId;
  const [formErrors, setFormErrors] = useState<{
    [key in keyof typeof validator.TYPE]?: string;
  }>({});
  const refMap = RefMap(validator);
  const navigator = useInternalNavigate();
  const WoInput = useFormInput(refMap, { WoLgID: langId }, formErrors);
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
                // id="wordfield"
                // data_info="Term"
                entryKey="WoText"
                maxLength={250}
                size={40}
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
                ref={refMap.WoTranslation}
              />
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
                ref={refMap.WoSentence}
              />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Status:</td>
            <StatusRadioButtons termStatus="1" refMap={refMap} />
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
                  navigator('/edit_words');
                }}
              />
              <input
                type="button"
                value="Save"
                onClick={() => {
                  CheckAndSubmit(
                    refMap,
                    { WoLgID: parseNumMap },
                    validator,
                    (val) => {
                      console.log('ADDING TERM');
                      dataService.addTerm(val);
                      navigator('/edit_words');
                    },
                    null,
                    (errors) => {
                      console.log('TEST123-terms', errors);
                      setFormErrors(errors);
                    }
                  );
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
              refMap.WoTextLC.current.value,
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
}: {
  selectedTerms: Set<WordsId>;
  onSelectAll: () => void;
  onSelectNone: () => void;
}) {
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
