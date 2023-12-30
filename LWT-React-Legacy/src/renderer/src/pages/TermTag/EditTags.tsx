import { confirmDelete } from 'lwt-common';
import { Tag, TagsID, TagsValidator } from 'lwt-schemas';
import {
  WordTagDetailRow,
  dataService,
  tagPreValidateMap,
  useData,
} from 'lwt-state';
import {
  A,
  EntryRow,
  GenericMultiActions,
  GetAllTagsActionsSelectOptions,
  GetMultipleTagsActionsSelectOptions,
  GetTagSortSelectoptions,
  Header,
  Icon,
  SortableHeader,
  TableFooter,
  useFormInput,
  useI18N,
  useInternalNavigate,
  usePager,
} from 'lwt-ui-kit';
import { useSelection } from '../../hooks/useSelection';
import { FilterSortPager } from '../ArchivedText/FilterSortPager';
import { textareaKeydown } from '../IO/CheckForm';
import { TagSorting } from '../Sorting';
import {
  FilterHeaderWidget,
  QueryFilterWidget,
} from '../Term/LanguageBoxFilterWidget';

export function DisplayTags({
  query,
  sorting = TagSorting['Tag Text A-Z'],
  currentPage,
}: {
  query: string;
  sorting?: TagSorting;
  currentPage: number;
}): JSX.Element {
  const [{ tags, settings, wordTagCountmapByTag }] = useData([
    'tags',
    'settings',
    'wordTagCountmapByTag',
  ]);
  const recno = tags.length;

  const sortedTags = tags
    .map((tag) => ({
      ...tag,
      termCount: (wordTagCountmapByTag || {})[tag.TgID],
    }))
    .sort(sortValues(sorting));
  const pageSize = settings['set-tags-per-page'] || 1;
  const { dataOnPage, numPages } = usePager(sortedTags, currentPage, pageSize);
  const { checkboxPropsForEntry, onSelectAll, onSelectNone, selectedValues } =
    useSelection(tags, 'TgID');
  const t = useI18N();
  return (
    <>
      <Header title="My Term Tags" />
      <p>
        <A href="/edit_tags?new=1">
          <Icon src="plus-button" title="New" /> {t('New Term Tag')} ...
        </A>
      </p>

      <form name="form1">
        <table className="tab1" cellSpacing={0} cellPadding={5}>
          <FilterHeaderWidget />
          <tr>
            <QueryFilterWidget
              query={query}
              colSpan={6}
              filterString="Tag Text or Comment"
            />
          </tr>
          {recno > 0 && (
            <FilterSortPager
              currentPage={currentPage}
              numPages={numPages}
              recno={recno}
              elementName={'Tag'}
            >
              <GetTagSortSelectoptions selected={sorting} />
            </FilterSortPager>
          )}
        </table>
      </form>

      {recno === 0 ? (
        <p>{t('No tags found')}.</p>
      ) : (
        <>
          <form name="form2">
            <input type="hidden" name="data" value="" />
            <GenericMultiActions
              AllActions={GetAllTagsActionsSelectOptions}
              SelectedOptions={GetMultipleTagsActionsSelectOptions}
              onChangeAll={({ target: { value } }) => {
                onChangeAllTags(value, dataOnPage, tags);
              }}
              onChangeSelected={({ target: { value } }) => {
                onChangeSelectedTags(value, selectedValues);
              }}
              countAllTerms={sortedTags.length}
              countSelectedTerms={selectedValues.size}
              onSelectAll={onSelectAll}
              onSelectNone={onSelectNone}
              nounSingular={'Tag'}
            />

            <table className="sortable tab1" cellSpacing={0} cellPadding={5}>
              <TagHeader sorting={sorting} />
              {dataOnPage.map((tag) => (
                <TagRow
                  tag={tag}
                  checkboxPropsForEntry={checkboxPropsForEntry}
                />
              ))}
            </table>
          </form>
        </>
      )}

      {numPages > 1 && (
        <form name="form3">
          <TableFooter
            recno={recno}
            currentPage={currentPage}
            numPages={numPages}
            pageSize={pageSize}
            elementName={'Tag'}
            pageSizeSettingsKey={'set-tags-per-page'}
          />
        </form>
      )}
    </>
  );
}

function onChangeSelectedTags(value: string, selectedValues: Set<TagsID>) {
  if (value === 'del') {
    if (
      window.confirm(
        `${selectedValues.size} Record(s) will be affected ***\n\nARE YOU SURE?`
      )
    ) {
      dataService.deleteMultipleTermTags([...selectedValues]);
    }
  }
}

function onChangeAllTags(
  value: string,
  dataOnPage: WordTagDetailRow[],
  tags: Tag[]
) {
  // TODO rest

  if (value === 'delall') {
    if (
      window.confirm(
        `${dataOnPage.length} Record(s) will be affected ***\n\nARE YOU SURE?`
      )
    ) {
      dataService.deleteMultipleTermTags(tags.map(({ TgID }) => TgID));
    }
  }
}

function TagHeader({ sorting }: { sorting: TagSorting }) {
  return (
    <tr>
      <th className="th1 sorttable_nosort">Mark</th>
      <th className="th1 sorttable_nosort">Actions</th>
      <SortableHeader
        sorting={sorting}
        downSorting={TagSorting['Tag Text A-Z']}
        upSorting={TagSorting['Tag Text Z-A']}
      >
        Tag Text{' '}
      </SortableHeader>
      <SortableHeader
        sorting={sorting}
        downSorting={TagSorting['Tag Comment A-Z']}
        upSorting={TagSorting['Tag Comment Z-A']}
      >
        Tag Comment{' '}
      </SortableHeader>
      <SortableHeader
        sorting={sorting}
        upSorting={TagSorting['Term Count']}
        downSorting={TagSorting['Term Count (desc)']}
      >
        Terms With Tag{' '}
      </SortableHeader>
    </tr>
  );
}

function TagRow({
  tag,
  checkboxPropsForEntry,
}: {
  tag: WordTagDetailRow;
  checkboxPropsForEntry: (val: Tag) => {
    onChange: () => void;
    checked: boolean;
  };
}) {
  return (
    <tr>
      {/* ' . checkTest(record['TgID'], 'marked') . ' */}
      <td className="td1 center">
        <A id={`rec${tag['TgID']}`}>
          <input
            name="marked[]"
            type="checkbox"
            {...checkboxPropsForEntry(tag)}
            value={tag['TgID']}
          />
        </A>
      </td>
      <td className="td1 center" style={{ whiteSpace: 'nowrap' }}>
        &nbsp;
        <A href={`/edit_tags?chg=${tag.TgID}`}>
          <Icon src="document--pencil" title="Edit" />
        </A>
        &nbsp;
        <Icon
          onClick={() => {
            // TODO delete in wrapper
            if (confirmDelete()) {
              // TODO Maybe call these from wrapper?
              dataService.deleteTermTag(tag.TgID);
            }
          }}
          src="minus-button"
          title="Delete"
        />
        &nbsp;
      </td>
      <td className="td1 center">{tag.TgText}</td>
      <td className="td1 center">{tag.TgComment}</td>
      <td className="td1 center">
        {tag.termCount > 0 ? (
          <A href={`/edit_words?tag1=${tag.TgID}`}>{tag.termCount}</A>
        ) : (
          '0'
        )}
      </td>
    </tr>
  );
}

/**
 *
 * @param value
 */
function sortValues(value: TagSorting) {
  switch (value) {
    case TagSorting['Newest first']:
      return (a: WordTagDetailRow, b: WordTagDetailRow) =>
        a.TgID > b.TgID ? 1 : -1;
    case TagSorting['Oldest first']:
      return (a: WordTagDetailRow, b: WordTagDetailRow) =>
        a.TgID < b.TgID ? 1 : -1;
    case TagSorting['Tag Text A-Z']:
      return (a: WordTagDetailRow, b: WordTagDetailRow) =>
        a.TgText < b.TgText ? -1 : 1;
    case TagSorting['Tag Comment A-Z']:
      return (a: WordTagDetailRow, b: WordTagDetailRow) =>
        (a.TgComment || '') < (b.TgComment || '') ? -1 : 1;
    case TagSorting['Tag Text Z-A']:
      return (a: WordTagDetailRow, b: WordTagDetailRow) =>
        a.TgText < b.TgText ? 1 : -1;
    case TagSorting['Tag Comment Z-A']:
      return (a: WordTagDetailRow, b: WordTagDetailRow) =>
        (a.TgComment || '') < (b.TgComment || '') ? 1 : -1;
    case TagSorting['Term Count (desc)']:
      return (a: WordTagDetailRow, b: WordTagDetailRow) =>
        a.termCount < b.termCount ? 1 : -1;
    case TagSorting['Term Count']:
      return (a: WordTagDetailRow, b: WordTagDetailRow) =>
        a.termCount < b.termCount ? -1 : 1;
    default:
      return () => 1;
  }
}

export function NewTag() {
  const validator = TagsValidator;

  const navigator = useInternalNavigate();

  const { Input: TgInput, onSubmit, TextArea } = useFormInput({ validator });
  const submitForm = () => {
    onSubmit(
      tagPreValidateMap,
      (value) => {
        dataService.addTag(value);
        navigator('/edit_tags');
      },
      'TgID'
    );
  };
  return (
    <>
      <Header title="My Term Tags" />
      <h4>New Tag</h4>
      <form name="newtag" method="post">
        <table className="tab3" cellSpacing={0} cellPadding={5}>
          <tr>
            <td className="td1 right">Tag:</td>
            <td className="td1">
              <TgInput
                className="notempty setfocus noblanksnocomma checkoutsidebmp"
                entryKey="TgText"
                maxLength={20}
                size={20}
                isRequired
              />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Comment:</td>
            <td className="td1">
              <TextArea
                className="checklength checkoutsidebmp"
                onKeyDown={(e) => textareaKeydown(e, submitForm)}
                maxLength={200}
                entryKey="TgComment"
                cols={40}
                rows={3}
              />
            </td>
          </tr>
          <tr>
            <td className="td1 right" colSpan={2}>
              <input
                type="button"
                value="Cancel"
                onClick={() => {
                  navigator('/edit_tags');
                }}
              />
              <input
                type="button"
                name="op"
                value="Save"
                onClick={submitForm}
              />
            </td>
          </tr>
        </table>
      </form>
    </>
  );
}

export function EditTag({ chgID }: { chgID: TagsID }) {
  const [{ tags }] = useData(['tags']);
  const changingTag = tags.find(({ TgID }) => TgID === chgID);
  if (!changingTag) {
    throw new Error('Invalid Tag ID');
  }
  const validator = TagsValidator;
  const {
    onSubmit,
    Input: TgInput,
    TextArea,
  } = useFormInput({
    validator,
    entry: changingTag,
  });
  const navigator = useInternalNavigate();
  const submitForm = () => {
    onSubmit(
      tagPreValidateMap,
      (value) => {
        dataService.editTag(value);
        navigator('/edit_tags');
      },
      'TgID'
    );
  };
  const t = useI18N();
  return (
    <>
      <Header title="My Term Tags" />
      <h4>{t('Edit Tag')}</h4>
      <form name="newtag">
        <table className="tab3" cellSpacing={0} cellPadding={5}>
          <EntryRow headerText="Tag">
            <TgInput
              className="notempty setfocus noblanksnocomma checkoutsidebmp"
              entryKey="TgText"
              maxLength={20}
              size={20}
              isRequired
            />
          </EntryRow>
          <EntryRow headerText="Comment">
            <TextArea
              className="checklength checkoutsidebmp"
              onKeyDown={(e) => textareaKeydown(e, submitForm)}
              maxLength={200}
              entryKey="TgComment"
              cols={40}
              default
              rows={3}
            />
          </EntryRow>
          <tr>
            <td className="td1 right" colSpan={2}>
              <input
                type="button"
                value="Cancel"
                onClick={() => {
                  navigator('/edit_tags');
                }}
              />
              <input
                type="button"
                name="op"
                value="Save"
                onClick={submitForm}
              />
            </td>
          </tr>
        </table>
      </form>
    </>
  );
}
