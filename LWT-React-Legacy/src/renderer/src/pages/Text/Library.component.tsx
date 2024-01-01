import { confirmDelete, getDirTag } from 'lwt-common';
import {
  Tags2ID,
  Text,
  TextItem,
  TextTag,
  TextsID,
  TextsWithTagsValidator,
  Word,
} from 'lwt-schemas';
import {
  TextDetailRow,
  calculateWordCounts,
  dataService,
  textPrevalidateMap,
  useData,
} from 'lwt-state';
import {
  A,
  EntryRow,
  GenericMultiActions,
  GetTextsSortSelectoptions,
  Header,
  Icon,
  MarkedTextsSelectOptions,
  RequiredLineButton,
  SortableHeader,
  TableFooter,
  TextTagsAutocomplete,
  useFormInput,
  useI18N,
  useInternalNavigate,
  usePager,
  useSelection,
} from 'lwt-ui-kit';
import { useState } from 'react';
import { filterTags } from '../../utils/filterTags';
import { TextSorting, buildSortByValue } from '../Sorting';
import {
  CompoundTagFilterWidget,
  FilterBox,
  LanguageBoxFilterWidget,
  QueryFilterWidget,
} from '../Term/LanguageBoxFilterWidget';
import { OnCheckText, TextChecker } from './CheckText';

const TextMultiAction = {
  test: (selectedValues: Set<TextsID>) => {
    console.log('TODO test');
  },
  addtag: (selectedValues: Set<TextsID>) => {
    const answer = window.prompt(
      `*** ${'addTag'} ***\n\n*** ${
        selectedValues.size
      } Record(s) will be affected ***\n\nPlease enter one tag (20 char. max., no spaces, no commas -- or leave empty to cancel:`
    );
    if (answer === null) {
      return;
    }

    dataService.addTagToMultipleTexts(answer, [...selectedValues]);
  },
  deltag: (selectedValues: Set<TextsID>) => {
    // TODO think this is getting duped, pass in as arg
    const answer = window.prompt(
      `*** ${'addTag'} ***\n\n*** ${
        selectedValues.size
      } Record(s) will be affected ***\n\nPlease enter one tag (20 char. max., no spaces, no commas -- or leave empty to cancel:`
    );
    if (answer === null) {
      return;
    }

    dataService.removeTagFromMultipleTexts(answer, [...selectedValues]);
    console.log('TODO deltag');
  },
  rebuild: (selectedValues: Set<TextsID>) => {
    dataService.reparseMultipleTexts([...selectedValues]);
  },
  setsent: (selectedValues: Set<TextsID>) => {
    dataService.setSent([...selectedValues]);
  },
  arch: (selectedValues: Set<TextsID>) => {
    dataService.archiveMultipleTexts([...selectedValues]);
  },
  del: (selectedValues: Set<TextsID>) => {
    if (confirmDelete()) {
      dataService.deleteMultipleTexts([...selectedValues]);
    }
  },
};

/**
 *
 */
export function TextMultiActions({
  onSelectAll,
  onSelectNone,
  selectedValues,
}: {
  selectedValues: Set<TextsID>;
  onSelectAll: () => void;
  onSelectNone: () => void;
}) {
  return (
    <form name="form1">
      <GenericMultiActions
        AllActions={null}
        onChangeAll={null}
        SelectedOptions={MarkedTextsSelectOptions}
        onChangeSelected={({ target: { value } }) => {
          /* TODO */
          TextMultiAction[value as keyof typeof TextMultiAction](
            selectedValues
          );
        }}
        countAllTerms={null}
        countSelectedTerms={selectedValues.size}
        onSelectAll={onSelectAll}
        onSelectNone={onSelectNone}
        nounSingular={'Text'}
      />
    </form>
  );
}

/**
 *
 */
function LibraryHeader({ sorting }: { sorting: TextSorting }): JSX.Element {
  const [{ activeLanguageID }] = useData(['activeLanguageID']);
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
        {!activeLanguageID && (
          <SortableHeader
            sorting={sorting}
            downSorting={TextSorting['Lang.']}
            upSorting={TextSorting['Lang. (desc)']}
          >
            Lang.
          </SortableHeader>
        )}
        <SortableHeader
          sorting={sorting}
          downSorting={TextSorting['Title A-Z']}
          upSorting={TextSorting['Title Z-A']}
        >
          Title [Tags] / Audio:&nbsp;
          <Icon src="speaker-volume" title="With Audio" />
          , Src.Link:&nbsp;
          <Icon src="chain" title="Source Link available" />
          , Ann.Text:&nbsp;
          <Icon src="tick" title="Annotated Text available" />
        </SortableHeader>
        <SortableHeader
          sorting={sorting}
          downSorting={TextSorting['Total Words (desc)']}
          upSorting={TextSorting['Total Words']}
        >
          Total
          <br />
          Words
        </SortableHeader>
        <SortableHeader
          sorting={sorting}
          downSorting={TextSorting['Saved Wo+Ex (desc)']}
          upSorting={TextSorting['Saved Wo+Ex']}
        >
          {' '}
          Saved
          <br />
          Wo+Ex
        </SortableHeader>
        <SortableHeader
          sorting={sorting}
          downSorting={TextSorting['Unkn. Words (desc)']}
          upSorting={TextSorting['Unkn. Words']}
        >
          {' '}
          Unkn.
          <br />
          Words
        </SortableHeader>
        <SortableHeader
          sorting={sorting}
          downSorting={TextSorting['Unkn. %']}
          upSorting={TextSorting['Unkn. % (desc)']}
        >
          {' '}
          Unkn.
          <br />%
        </SortableHeader>
      </tr>
    </thead>
  );
}

/**
 *
 */
function LibraryRow({
  text,
  checked,
  onChange,
  filterArgs,
}: {
  text: TextDetailRow;
  checked: boolean;
  filterArgs: FilterArgs;
  onChange: () => void;
}): JSX.Element {
  const [{ languages, activeLanguageID, settings }] = useData([
    'languages',
    'activeLanguageID',
    'settings',
  ]);
  const showCounts = settings['set-show-text-word-counts'];
  const languageForLine = languages.find((lang) => lang.LgID === text.TxLgID);
  if (!languageForLine) {
    throw new Error('Invalid Language line');
  }

  return (
    <tr>
      <td className="td1 center">
        <A>
          {/* name="rec2" */}
          <input
            name="marked[]"
            // TODO consider
            // onClick={markClick}
            type="checkbox"
            checked={checked}
            onChange={() => onChange()}
            value="2"
          />
        </A>
      </td>
      <td style={{ whiteSpace: 'nowrap' }} className="td1 center">
        &nbsp;
        <A
          // TODO better way than passing as params
          href={`/do_text?start=${text.TxID}&query=${filterArgs.query}&sorting=${filterArgs.sorting}&onlyAnn=${filterArgs.onlyAnn}&tag1=${filterArgs.tag1}&tag2=${filterArgs.tag2}&tag12=${filterArgs.tag12}`}
        >
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
          onClick={() => {
            if (confirmDelete()) {
              dataService.deleteText(text.TxID);
            }
          }}
        >
          <Icon src="minus-button" title="Delete" />
        </span>
        &nbsp;
      </td>

      {!activeLanguageID && (
        <td className="td1 center">{languageForLine.LgName}</td>
      )}
      <td className="td1 center">
        {text.TxTitle}
        {text.taglist && text.taglist.length > 0 && (
          <span className="smallgray2"> [{text.taglist.join(', ')}]</span>
        )}
        {text.TxAudioURI && <Icon src="speaker-volume" title="With Audio" />}
        {text.TxSourceURI && (
          <a href={text.TxSourceURI} target="_blank">
            <Icon src="chain" title="Link to Text Source" />
          </a>
        )}
        {text.TxAnnotatedText && (
          <A href={`/print_impr_text?text=${text.TxID}`}>
            <Icon src="tick" title="Annotated Text available" />
          </A>
        )}
      </td>
      {/* TODO */}
      {showCounts ? (
        <>
          <td className="td1 center">
            <span title="Total">&nbsp;{text.totalWords}</span>
          </td>
          <td className="td1 center">
            <span title="Saved" className="status4">
              {/* ($txtworkedall > 0 ? '<a href="edit_words.php?page=1&amp;query=&amp;status=&amp;tag12=0&amp;tag2=&amp;tag1=&amp;text=' . $record['TxID'] . '">'  */}
              &nbsp;{text.saved}&nbsp;
              {/* </a> */}
            </span>
          </td>
          <td className="td1 center">
            <span title="Unknown" className="status0">
              &nbsp;{text.unk}&nbsp;
            </span>
          </td>
          <td className="td1 center">
            <span title="Unknown (%)">{text.unkPerc}</span>
          </td>
        </>
      ) : (
        <>
          <td className="td1 center">
            <span id={`total-${text.TxID}`}></span>
          </td>
          <td className="td1 center">
            <span data_id={text.TxID} id={`saved-${text.TxID}`}>
              <span
                className="click"
                onClick={() => {
                  // TODO
                  do_ajax_word_counts();

                  // $r[] = '<span title="Total">&nbsp;' . $txttotalwords . '&nbsp;</span>';
                  // $r[] = '<span title="Saved" class="status4">&nbsp;' . ($txtworkedall > 0 ? '<a href="edit_words.php?page=1&amp;query=&amp;status=&amp;tag12=0&amp;tag2=&amp;tag1=&amp;text=' . $id . '">' . $txtworkedwords . '+' . $txtworkedexpr . '</a>' : '0') . '&nbsp;';
                  // $r[] = '<span title="Unknown" class="status0">&nbsp;' . $txttodowords . '&nbsp;</span>';
                  // $r[] = '<span title="Unknown (%)">' . $percentunknown . '</span></td>';
                }}
              >
                <Icon src="lightning" title="View Word Counts" />
              </span>
            </span>
          </td>
          <td className="td1 center">
            <span id={`todo-${text.TxID}`}></span>
          </td>
          <td className="td1 center">
            <span id={`todop-${text.TxID}`}></span>
          </td>
        </>
      )}
    </tr>
  );
}

/**
 *
 */
export function Library({
  currentPage,
  query = null,
  tag2 = null,
  tag12 = 0,
  tag1 = null,
  sorting = TextSorting['Oldest first'],
}: FilterArgs & {
  currentPage: number;
}) {
  const [{ textDetails, activeLanguage, texttags, tags2, settings }] = useData([
    'textDetails',
    'activeLanguage',
    'texttags',
    'tags2',
    'settings',
  ]);
  const pageSize = settings['set-texts-per-page'] || 1;
  // TODO
  // const tags2ForLanguage=tags2.filter((val)=>val.)
  const filteredSortedTextDetails = filterAndSortTexts({
    texttags,
    tag1,
    tag2,
    tag12,
    textDetails,
    sorting,
    query,
  });
  console.log('test123-lib', { filteredSortedTextDetails, tags2 });
  // TODO useFilter
  const { numPages, dataOnPage } = usePager(
    filteredSortedTextDetails || [],
    currentPage,
    pageSize
  );
  const t = useI18N();
  const { selectedValues, onSelectAll, onSelectNone, checkboxPropsForEntry } =
    useSelection(textDetails || [], 'TxID');

  const recno = (filteredSortedTextDetails || []).length;
  return (
    <>
      <Header
        title={
          `My ${activeLanguage ? `${activeLanguage.LgName} ` : ''}Texts` as any
        }
      />
      <p>
        <A href={`/edit_texts?new=${1}`}>
          <Icon src="plus-button" title="New" /> {t('New Text ...')}
        </A>
        &nbsp; | &nbsp;
        <A href="/long_text_import">
          <Icon src="plus-button" title="Long Text Import" />{' '}
          {t('Long Text Import')}
          ...
        </A>
      </p>

      <form name="form1">
        <FilterBox
          recno={recno}
          footerProps={{
            children: <GetTextsSortSelectoptions selected={sorting} />,
            currentPage,
            numPages,
            recno,
            elementName: 'Text',
          }}
        >
          <tr>
            <LanguageBoxFilterWidget activeLanguageID={activeLanguage?.LgID} />
            <QueryFilterWidget
              query={query}
              filterString="Text Title (Wildc.=*)"
            />
          </tr>
          <CompoundTagFilterWidget
            availableTags={tags2}
            tag1={tag1}
            tag12={tag12}
            tag2={tag2}
          />
        </FilterBox>
      </form>

      <TextMultiActions
        onSelectAll={onSelectAll}
        onSelectNone={onSelectNone}
        selectedValues={selectedValues}
      />
      <>
        <table className="sortable tab1">
          <LibraryHeader sorting={sorting} />
          <tbody>
            {dataOnPage &&
              dataOnPage.map((text) => (
                <LibraryRow
                  filterArgs={{
                    query,
                    tag1,
                    tag12,
                    tag2,
                    sorting,
                    // TODO
                    onlyAnn: false,
                  }}
                  key={`library-row-${text.TxID}`}
                  text={text}
                  {...checkboxPropsForEntry(text)}
                />
              ))}
          </tbody>
        </table>
        <TableFooter
          elementName={'Text'}
          pageSize={pageSize}
          recno={recno}
          currentPage={currentPage}
          numPages={numPages}
          pageSizeSettingsKey={'set-texts-per-page'}
        />
      </>
    </>
  );
}

type TagFilterArgs = {
  tag1: Tags2ID | null;
  tag2: Tags2ID | null;
  tag12: 0 | 1;
};

type SortFilterArgs = { sorting: TextSorting };
type QueryFilterArgs = { query: string | null };
export type FilterArgs = SortFilterArgs &
  QueryFilterArgs &
  TagFilterArgs & {
    onlyAnn?: boolean;
  };

/**
 *
 */
export function filterAndSortTexts({
  texttags,
  tag1,
  tag2,
  tag12,
  textDetails,
  sorting,
  query,
  onlyAnn = false,
}: FilterArgs & {
  texttags: TextTag[];
  textDetails: TextDetailRow[];
}) {
  const filteredTags = filterTags({ tagIDs: texttags, tag1, tag2, tag12 });
  const isTagsFilterRunning = filteredTags !== null;
  const filteredTextDetails = (textDetails || []).filter((textDetail) => {
    if (onlyAnn && textDetail.TxAnnotatedText === '') {
      return false;
    }
    if (filterByQuery(query, [textDetail.TxTitle]) === false) {
      return false;
    }
    const includesTag = isTagsFilterRunning
      ? Object.keys(filteredTags).length === 0 ||
        filteredTags[textDetail.TxID] === true
      : true;
    return includesTag;
  });
  const filteredSortedTextDetails = filteredTextDetails.sort(
    textSortingMethod(sorting)
  );
  return filteredSortedTextDetails;
}

/**
 *
 * @param query
 * @param stringsToCheck
 */
export function filterByQuery(query: string | null, stringsToCheck: string[]) {
  // Ignore if no query
  if (query === null || query === '') {
    return true;
  }
  let checking = true;
  let i = 0;
  // for each field to check
  while (checking) {
    // TODO account for *
    // let walkingQueryString=true
    // let i=0
    // while(walkingQueryString){
    //   query[]
    // }
    console.log(stringsToCheck[i], i, stringsToCheck.length);
    if (stringsToCheck[i].toLowerCase().includes(query.toLowerCase())) {
      return true;
    }
    i = i + 1;
    checking = i < stringsToCheck.length;
  }
  return false;
}

/**
 *
 */
export function EditTextPane({
  chgID,
  onCheckText,
}: {
  chgID: TextsID;
  onCheckText: OnCheckText;
}) {
  const [{ texts, languages, activeLanguage }] = useData([
    'texts',
    'languages',
    'activeLanguage',
  ]);
  const editingText = texts.find(({ TxID }) => TxID === chgID);
  if (!editingText) {
    throw new Error('Invalid change ID');
  }
  const language = languages.find(({ LgID }) => LgID === editingText.TxLgID);
  if (!language) {
    throw new Error('Invalid text language ID');
  }
  const validator = TextsWithTagsValidator;
  const navigator = useInternalNavigate();

  const {
    onSubmit,
    Input: TxInput,
    TextArea,
    LanguageSelectInput,
    refMap,
    setDirty,
  } = useFormInput({
    entry: editingText,
    validator,
  });
  const editTextPrevalidateMap = textPrevalidateMap;
  return (
    <>
      <Header
        title={
          `My ${activeLanguage ? `${activeLanguage.LgName} ` : ''}Texts` as any
        }
      />
      <h4>
        Edit Text{' '}
        <A target="_blank" href="/info#howtotext">
          <Icon src="question-frame" title="Help" />
        </A>
      </h4>
      <form>
        <TxInput type="hidden" entryKey="TxID" fixed />
        <table className="tab3" cellSpacing={0} cellPadding={5}>
          <EntryRow headerText="Language">
            {/* TODO this one shouldnt change active language id */}
            <LanguageSelectInput entryKey={'TxLgID'} isRequired />
          </EntryRow>
          <EntryRow headerText={'Title'}>
            <TxInput
              className="notempty checkoutsidebmp"
              errorName="Title"
              entryKey="TxTitle"
              default
              maxLength={200}
              size={60}
              isRequired
            />
          </EntryRow>
          <EntryRow headerText={'Text:\n\n(max.\n65,000\nbytes)'}>
            <TextArea
              {...getDirTag(language)}
              entryKey="TxText"
              className="notempty checkbytes checkoutsidebmp"
              maxLength={65000}
              errorName="Text"
              cols={60}
              rows={20}
              default
            />
            <RequiredLineButton />
          </EntryRow>
          <TxInput type="hidden" entryKey="TxAnnotatedText" fixed />
          <EntryRow headerText={'Ann.Text'}>
            {editingText.TxAnnotatedText.length ? (
              <>
                <Icon src="tick" title="With Improved Annotation" /> Exists -
                May be partially or fully lost if you change the text!
                <br />
                <input
                  type="button"
                  value="Print/Edit..."
                  onClick={() => navigator(`/print_impr_text?text=${chgID}`)}
                />
              </>
            ) : (
              <Icon src="cross" title="No Improved Annotation" />
            )}
          </EntryRow>
          <EntryRow headerText={'Source URI'}>
            <TxInput
              className="checkurl checkoutsidebmp"
              errorName="Source URI"
              entryKey="TxSourceURI"
              default
              maxLength={1000}
              size={60}
            />
          </EntryRow>
          <EntryRow headerText={'Tags'}>
            <TextTagsAutocomplete ref={refMap.taglist} onChange={setDirty} />
          </EntryRow>
          <EntryRow headerText={'Audio-URI'}>
            <>
              <TxInput
                className="checkoutsidebmp"
                errorName="Audio-URI"
                entryKey="TxAudioURI"
                default
                maxLength={200}
                size={60}
              />
              <span id="mediaselect">
                <TxInput type="file" entryKey={'TxAudioFile'} />
                {/* <SelectMediaPath f="TxAudioURI" /> */}
              </span>
            </>
          </EntryRow>
          <tr>
            <td className="td1 right" colSpan={2}>
              <input
                type="button"
                value="Cancel"
                onClick={() => {
                  navigator(`/edit_texts#rec${chgID}`);
                }}
              />
              <input
                type="button"
                onClick={() => {
                  onSubmit(editTextPrevalidateMap, (val) => {
                    onCheckText(val);
                  });
                }}
                value="Check"
              />
              <input
                type="button"
                onClick={() => {
                  window.alert('TODO');
                }}
                value="Change"
              />
              <input
                type="button"
                onClick={() => {
                  window.alert('TODO');
                }}
                value="Change and Open"
              />
            </td>
          </tr>
        </table>
      </form>
    </>
  );
}
/**
 *
 */
export function EditText({ chgID }: { chgID: TextsID }) {
  const [checkingText, setCheckingText] = useState<null | Text>(null);
  return (
    <>
      {checkingText ? (
        <TextChecker potentialText={checkingText} />
      ) : (
        <EditTextPane chgID={chgID} onCheckText={setCheckingText} />
      )}
    </>
  );
}
const textSortingMethod = (
  sort: TextSorting
): ((termA: TextDetailRow, termB: TextDetailRow) => 1 | -1 | 0) => {
  switch (sort) {
    case TextSorting['Oldest first']:
      // TODO these wrong
      return () => -1;
    // return buildSortByOldest('title');
    case TextSorting['Newest first']:
      return buildSortByValue('totalWords');
    // return () => 1;;
    // return buildSortByNewest('title');
    // TODO
    case TextSorting['Title A-Z']:
      return buildSortByValue('TxTitle');
    case TextSorting['Title Z-A']:
      return buildSortByValue('TxTitle', false);
    case TextSorting['Lang.']:
      return buildSortByValue('TxLgName');
    case TextSorting['Lang. (desc)']:
      return buildSortByValue('TxLgName', false);
    case TextSorting['Saved Wo+Ex']:
      return buildSortByValue('saved');
    case TextSorting['Saved Wo+Ex (desc)']:
      return buildSortByValue('saved', false);
    case TextSorting['Unkn. %']:
      return buildSortByValue('unkPerc');
    case TextSorting['Unkn. % (desc)']:
      return buildSortByValue('unkPerc', false);
    case TextSorting['Unkn. Words']:
      return buildSortByValue('unk');
    case TextSorting['Unkn. Words (desc)']:
      return buildSortByValue('unk', false);
    case TextSorting['Total Words']:
      return buildSortByValue('totalWords');
    case TextSorting['Total Words (desc)']:
      return buildSortByValue('totalWords', false);
  }
};
/**
 *
 * @param text
 * @param textItems
 * @param words
 * @param onSetLoading
 */
function do_ajax_word_counts(
  text: Text,
  textItems: TextItem[],
  words: Word[],
  onSetLoading: (loading: boolean) => void,
  setTotal: (vals: { $txttotalwords: number }) => void,
  setSaved: (vals: {
    $txtworkedall: number;
    $percentunknown: number;
    $txtworkedwords: number;
    $txtworkedexpr: number;
  }) => void,
  setUnknown: (val: { $txttodowords: number }) => void,
  setUnknownPerc: (val: { $percentunknown: number }) => void
) {
  $("span[id^='saved-']").each(function (i) {
    onSetLoading(true);

    const wordCounts = calculateWordCounts(text, textItems, words);

    setTotal(wordCounts);
    setSaved(wordCounts);
    setUnknown(wordCounts);
    setUnknownPerc(wordCounts);

    onSetLoading(false);
  });
}
