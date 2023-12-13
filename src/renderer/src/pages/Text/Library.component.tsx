import { useRef, useState } from 'react';
import { TextDetailRow } from '../../data/data.query';
import { dataService } from '../../data/data.service';
import { textPrevalidateMap } from '../../data/preValidateMaps';
import { Settings } from '../../data/settings';
import { Tags2Id, TextsId, TextsValidator } from '../../data/validators';
import { useData } from '../../hooks/useAkita';
import { useFormInput } from '../../hooks/useFormInput';
import {
  useInternalNavigate,
  useUpdateParams,
} from '../../hooks/useInternalNav';
import { usePager } from '../../hooks/usePager';
import { useSelection } from '../../hooks/useSelection';
import { A } from '../../nav/InternalLink';
import { Header } from '../../ui-kit/Header';
import { Icon, RequiredLineButton } from '../../ui-kit/Icon';
import { LanguageDropdown } from '../../ui-kit/LanguageDropdown';
import { Pager } from '../../ui-kit/Pager';
import { TagAndOr } from '../../ui-kit/TagAndOr';
import { filterTags } from '../../utils/filterTags';
import { Text } from '../../utils/parseMySqlDump';
import { confirmDelete } from '../../utils/utils';
import {
  FilterSortPager,
  buildTextTagLookup,
} from '../ArchivedText/EditArchivedTexts.component';
import { getDirTag } from '../Reader.component';
import { SelectMediaPath } from '../SelectMediaPath';
import { GetTextsSortSelectoptions } from '../SelectOptions';
import { TextSorting, buildSortByValue, resetDirty } from '../Sorting';
import { TagDropDown } from '../Term/Terms.component';
import { pluralize } from '../TermTag/EditTags';
import { OnCheckText, TextChecker } from './CheckText';

const TextMultiAction = {
  test: (selectedValues: Set<TextsId>) => {
    console.log('test');
  },
  addtag: (selectedValues: Set<TextsId>) => {
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
  deltag: (selectedValues: Set<TextsId>) => {
    console.log('deltag');
  },
  rebuild: (selectedValues: Set<TextsId>) => {
    console.log('rebuild');
  },
  setsent: (selectedValues: Set<TextsId>) => {
    console.log('setsent');
  },
  arch: (selectedValues: Set<TextsId>) => {
    console.log('arch');
  },
  del: (selectedValues: Set<TextsId>) => {
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
  selectedValues: Set<TextsId>;
  onSelectAll: () => void;
  onSelectNone: () => void;
}) {
  return (
    <form name="form1" action="#">
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
                disabled={selectedValues.size === 0}
                onChange={({ target: { value } }) => {
                  /* TODO */
                  TextMultiAction[value as keyof typeof TextMultiAction](
                    selectedValues
                  );
                }}
              >
                <option value="" />
                <option disabled>------------</option>
                <option value="test">Test Marked Texts</option>
                <option disabled>------------</option>
                <option value="addtag">Add Tag</option>
                <option value="deltag">Remove Tag</option>
                <option disabled>------------</option>
                <option value="rebuild">Reparse Texts</option>
                <option value="setsent">Set Term Sentences</option>
                <option disabled>------------</option>
                <option value="arch">Archive Marked Texts</option>
                <option disabled>------------</option>
                <option value="del">Delete Marked Texts</option>
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
function LibraryHeader({ sorting }: { sorting: TextSorting }): JSX.Element {
  console.log('TEST123-library-header', sorting);
  const [{ activeLanguageId }] = useData(['activeLanguageId']);
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
        {!activeLanguageId && (
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
export function SortableHeader({
  sorting,
  downSorting,
  upSorting,
  children,
}: React.PropsWithChildren<Parameters<typeof SortingArrow>[0]>) {
  const paramUpdater = useUpdateParams();
  return (
    <th
      className="th1 clickable"
      onClick={() =>
        paramUpdater({
          sort: sorting === upSorting ? downSorting : upSorting,
          page: null,
        })
      }
    >
      {children}
      <SortingArrow
        sorting={sorting}
        downSorting={downSorting}
        upSorting={upSorting}
      />
    </th>
  );
}

/**
 *
 */
export function TableFooter({
  recno,
  currentPage,
  numPages,
  pageSize,
  elementName,
  pageSizeSettingsKey,
}: {
  recno: number;
  currentPage: number;
  numPages: number;
  pageSize: number;
  elementName: string;
  pageSizeSettingsKey: keyof Settings;
}): JSX.Element {
  return (
    <table className="tab1" cellSpacing={0} cellPadding={5}>
      <tbody>
        <tr>
          <th style={{ whiteSpace: 'nowrap' }} className="th1">
            {recno} {elementName}
            {pluralize(recno)}
          </th>
          <th style={{ whiteSpace: 'nowrap' }} className="th1">
            &nbsp; &nbsp;
            <Icon src="placeholder" alt="-" />
            <Icon src="placeholder" alt="-" />
            <Pager currentPage={currentPage} numPages={numPages} />
          </th>
          <th style={{ whiteSpace: 'nowrap' }} className="th1">
            &nbsp; &nbsp;
            <Icon src="placeholder" alt="-" />
            <Icon src="placeholder" alt="-" />
            <ResizePage
              pageSize={pageSize}
              onPageResize={function (newSize: number): void {
                dataService.setSettings({ [pageSizeSettingsKey]: newSize });
              }}
            />
          </th>
        </tr>
      </tbody>
    </table>
  );
}

/**
 *
 */
export function ResizePage({
  pageSize,
  onPageResize,
}: {
  pageSize: number;
  onPageResize: (newSize: number) => void;
}) {
  const numberOptions = 20;
  const options = new Array(numberOptions).fill(0).map((_, ii) => (ii + 1) * 5);
  return (
    <>
      # / Page:{' '}
      {options.includes(pageSize) ? (
        <select
          value={pageSize}
          onChange={({ target: { value } }) =>
            onPageResize(Number.parseInt(value))
          }
        >
          {options.map((val) => (
            <option value={val}>{val}</option>
          ))}
        </select>
      ) : (
        <input
          type="number"
          defaultValue={pageSize}
          onChange={({ target: { value } }) =>
            onPageResize(Number.parseInt(value))
          }
        />
      )}
    </>
  );
}

/**
 *
 */
function LibraryRow({
  text,
  checked,
  onChange,
  textTags,
}: {
  text: TextDetailRow;
  textTags: string[];
  checked: boolean;
  onChange: () => void;
}): JSX.Element {
  const [{ languages, activeLanguageId }] = useData([
    'languages',
    'activeLanguageId',
  ]);
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
            className="markcheck"
            type="checkbox"
            checked={checked}
            onChange={() => onChange()}
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

      {!activeLanguageId && (
        <td className="td1 center">{languageForLine.LgName}</td>
      )}
      <td className="td1 center">
        {text.TxTitle}
        <span className="smallgray2"> [{textTags.join(', ')}]</span>
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
      <td className="td1 center">{text.totalWords}</td>
      <td className="td1 center">{text.saved}</td>
      <td className="td1 center">{text.unk}</td>
      <td className="td1 center">{text.unkPerc}</td>
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
}: {
  currentPage: number;
  query: string | null;
  tag2: Tags2Id | null;
  tag1: Tags2Id | null;
  tag12: 0 | 1;
  sorting?: TextSorting;
}) {
  const [{ textDetails, activeLanguage, texttags, tags2, settings }] = useData([
    'textDetails',
    'activeLanguage',
    'texttags',
    'tags2',
    'settings',
  ]);
  console.log({ textDetails, texttags, tags2 });
  const pageSize = settings['set-texts-per-page'] || 1;
  // TODO
  // const tags2ForLanguage=tags2.filter((val)=>val.)
  const filteredTags = filterTags(texttags, tag1, tag2, tag12);
  const filteredTextDetails = (textDetails || []).filter((textDetail) => {
    // TODO query

    const includesTag = filteredTags[textDetail.TxID] === true;
    return includesTag;
  });
  const filteredSortedTextDetails = filteredTextDetails.sort(
    sortingMethod(sorting)
  );
  // TODO useFilter
  const { numPages, dataOnPage } = usePager(
    filteredSortedTextDetails || [],
    currentPage,
    pageSize
  );
  const paramUpdater = useUpdateParams();
  const navigator = useInternalNavigate();
  const queryRef = useRef<HTMLInputElement | null>(null);
  // TODO
  const { selectedValues, onSelectAll, onSelectNone, checkboxPropsForEntry } =
    useSelection(textDetails || [], 'TxID');
  const textTagLookup = buildTextTagLookup(tags2, texttags);

  const recno = (filteredTextDetails || []).length;
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

      <form name="form1">
        <table className="tab1" cellSpacing={0} cellPadding={5}>
          <tr>
            <th className="th1" colSpan={4}>
              Filter <Icon src="funnel" title="Filter" />
              &nbsp;
              <input
                type="button"
                value="Reset All"
                onClick={() => {
                  // resetAll('edit_texts');
                  paramUpdater(null);
                }}
              />
            </th>
          </tr>
          <tr>
            <td className="td1 center" colSpan={2}>
              Language:
              <LanguageDropdown
                name="filterlang"
                header="Filter off"
                onChange={(val) => {
                  if (val === -1) {
                    dataService.setActiveLanguage(null);
                  } else {
                    dataService.setActiveLanguage(val);
                  }
                }}
                defaultValue={activeLanguage?.LgID}
              />
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
                  paramUpdater({
                    query: queryRef.current?.value || '',
                    page: null,
                  })
                }
              />
              &nbsp;
              <input
                type="button"
                value="Clear"
                onClick={() => {
                  navigator('/edit_texts?page=1&query=');
                  if (queryRef.current) {
                    queryRef.current.value = '';
                  }
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
              <TagDropDown tags={tags2} tagKey="tag1" defaultValue={tag1} />
            </td>
            <TagAndOr
              defaultValue={tag12}
              onChange={({ target: { value } }) => {
                paramUpdater({ tag12: value, page: null });
              }}
            />
            <td className="td1 center" style={{ whiteSpace: 'nowrap' }}>
              Tag #2:
              <TagDropDown tags={tags2} tagKey="tag2" defaultValue={tag2} />
            </td>
          </tr>

          {recno > 0 && (
            <FilterSortPager
              currentPage={currentPage}
              numPages={numPages}
              recno={recno}
              elementName={'Text'}
            >
              <GetTextsSortSelectoptions selected={sorting} />
            </FilterSortPager>
          )}
        </table>
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
                  text={text}
                  textTags={textTagLookup[text.TxID]}
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

/**
 *
 */
export function EditTextPane({
  chgID,
  onCheckText,
}: {
  chgID: TextsId;
  onCheckText: OnCheckText;
}) {
  const [{ texts, tags2, languages }] = useData([
    'texts',
    'tags2',
    'languages',
  ]);
  const editingText = texts.find(({ TxID }) => TxID === chgID);
  if (!editingText) {
    throw new Error('Invalid change ID');
  }
  const language = languages.find(({ LgID }) => LgID === editingText.TxLgID);
  if (!language) {
    throw new Error('Invalid text language ID');
  }
  const validator = TextsValidator;
  const navigator = useInternalNavigate();

  const {
    onSubmit,
    refMap,
    Input: TxInput,
    LanguageSelectInput,
  } = useFormInput({
    entry: editingText,
    validator,
  });
  const editTextPrevalidateMap = textPrevalidateMap;
  return (
    <>
      <Header title="My Texts" />
      <h4>
        Edit Text{' '}
        <A target="_blank" href="/info#howtotext">
          <Icon src="question-frame" title="Help" />
        </A>
      </h4>
      <form className="validate">
        <TxInput type="hidden" entryKey="TxID" fixed />
        <table className="tab3" cellSpacing={0} cellPadding={5}>
          <tr>
            <td className="td1 right">Language:</td>
            <td className="td1">
              {/* TODO this one shouldnt change active language id */}
              <LanguageSelectInput entryKey={'TxLgID'} isRequired />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Title:</td>
            <td className="td1">
              <TxInput
                className="notempty checkoutsidebmp"
                errorName="Title"
                entryKey="TxTitle"
                default
                maxLength={200}
                size={60}
                isRequired
              />
            </td>
          </tr>
          <tr>
            <td className="td1 right">
              Text:
              <br />
              <br />
              (max.
              <br />
              65,000
              <br />
              bytes)
            </td>
            <td className="td1">
              <textarea
                {...getDirTag(language)}
                ref={refMap.TxText}
                name="TxText"
                className="notempty checkbytes checkoutsidebmp"
                maxLength={65000}
                errorName="Text"
                cols={60}
                rows={20}
                defaultValue={editingText.TxText}
              />
              <RequiredLineButton />
            </td>
          </tr>
          <TxInput type="hidden" entryKey="TxAnnotatedText" fixed />
          <tr>
            <td className="td1 right">Ann.Text:</td>
            <td className="td1">
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
            </td>
          </tr>
          <tr>
            <td className="td1 right">Source URI:</td>
            <td className="td1">
              <TxInput
                className="checkurl checkoutsidebmp"
                errorName="Source URI"
                entryKey="TxSourceURI"
                default
                maxLength={1000}
                size={60}
              />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Tags:</td>
            <td className="td1">
              <TagDropDown tags={tags2} tagKey={'text'} defaultValue={null} />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Audio-URI:</td>
            <td className="td1">
              <TxInput
                className="checkoutsidebmp"
                errorName="Audio-URI"
                entryKey="TxAudioURI"
                default
                maxLength={200}
                size={60}
              />
              <span id="mediaselect">
                <SelectMediaPath f="TxAudioURI" />
              </span>
            </td>
          </tr>
          <tr>
            <td className="td1 right" colSpan={2}>
              <input
                type="button"
                value="Cancel"
                onClick={() => {
                  resetDirty();
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
export function EditText({ chgID }: { chgID: TextsId }) {
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
const sortingMethod = (
  sort: TextSorting
): ((termA: TextDetailRow, termB: TextDetailRow) => 1 | -1 | 0) => {
  switch (sort) {
    case TextSorting['Oldest first']:
      // TODO these wrong
      return () => -1;
    // return buildSortByOldest('title');
    case TextSorting['Newest first']:
      // TODO these wrong
      return buildSortByValue('totalWords');
    // return () => 1;;
    // return buildSortByNewest('title');
    // TODO
    case TextSorting['Title A-Z']:
      return buildSortByValue('title');
  }
};
const DOWN_ARROW = '▾' as const;
const UP_ARROW = '▴' as const;

/**
 *
 */
export function SortingArrow<TSort extends number>({
  sorting,
  downSorting,
  upSorting,
}: {
  sorting: TSort;
  downSorting: TSort;
  upSorting: TSort;
}) {
  return (
    <>
      {sorting === downSorting ? (
        <>&nbsp;{DOWN_ARROW}</>
      ) : sorting === upSorting ? (
        <>&nbsp;{UP_ARROW}</>
      ) : (
        <></>
      )}
    </>
  );
}
