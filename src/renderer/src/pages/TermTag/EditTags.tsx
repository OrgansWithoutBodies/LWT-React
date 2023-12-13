import { useRef } from 'react';
import { WordTagDetailRow } from '../../data/data.query';
import { dataService } from '../../data/data.service';
import { tagPreValidateMap } from '../../data/preValidateMaps';
import { TagsId, TagsValidator } from '../../data/validators';
import { RefMap } from '../../forms/Forms';
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
import { Icon } from '../../ui-kit/Icon';
import { Tag } from '../../utils/parseMySqlDump';
import { confirmDelete } from '../../utils/utils';
import { FilterSortPager } from '../ArchivedText/EditArchivedTexts.component';
import {
  GetAllTagsActionsSelectOptions,
  GetMultipleTagsActionsSelectOptions,
  GetTagSortSelectoptions,
} from '../SelectOptions';
import { TagSorting, resetDirty } from '../Sorting';
import { NavigateButton } from '../Statistics.component';
import { SortableHeader, TableFooter } from '../Text/Library.component';

/**
 *
 */
export function DisplayTags({
  query,
  sorting = TagSorting['Tag Text A-Z'],
  currentPage,
}: {
  query: string;
  sorting?: TagSorting;
  currentPage: number;
}): JSX.Element {
  const [{ tags, settings, wordtags }] = useData([
    'wordtags',
    'tags',
    'settings',
  ]);
  const navigate = useInternalNavigate();
  console.log('TEST123-sorting', sorting, tags);
  const recno = tags.length;
  const countPerTag: Record<TagsId, number> = wordtags.reduce(
    (prev, curr) => ({ ...prev, [curr.WtTgID]: prev[curr.WtTgID] + 1 }),
    Object.fromEntries(tags.map((val) => [val.TgID, 0]))
  );
  const sortedTags = tags
    .map((tag) => ({ ...tag, termCount: countPerTag[tag.TgID] }))
    .sort(sortValues(sorting));
  const pageSize = settings['set-tags-per-page'] || 1;
  const { dataOnPage, numPages } = usePager(sortedTags, currentPage, pageSize);
  const paramUpdater = useUpdateParams();
  const { checkboxPropsForEntry, onSelectAll, onSelectNone, selectedValues } =
    useSelection(tags, 'TgID');

  const queryRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <Header title="Word Tags" />
      <p>
        <A href="/edit_tags?new=1">
          <Icon src="plus-button" title="New" /> New Term Tag ...
        </A>
      </p>

      <form name="form1">
        <table className="tab1" cellSpacing={0} cellPadding={5}>
          <tr>
            <th className="th1" colSpan={4}>
              Filter <Icon src="funnel" title="Filter" />
              &nbsp;
              <NavigateButton
                value="Reset All"
                navigateTo={`/edit_tags?page=${1}`}
              />
            </th>
          </tr>
          <tr>
            <td className="td1 center" colSpan={4}>
              Tag Text or Comment:
              <input
                type="text"
                name="query"
                ref={queryRef}
                value={query}
                maxLength={50}
                size={15}
              />
              &nbsp;
              <input
                type="button"
                name="querybutton"
                value="Filter"
                onClick={() => {
                  paramUpdater({ query: queryRef.current?.value || '' });
                }}
              />
              &nbsp;
              <input
                type="button"
                value="Clear"
                onClick={() => {
                  navigate(`/edit_tags?page=${1}&query=`);
                }}
              />
            </td>
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
        <p>No tags found.</p>
      ) : (
        <form name="form2">
          <input type="hidden" name="data" value="" />
          <table className="tab1" cellSpacing={0} cellPadding={5}>
            <tr>
              <th className="th1 center" colSpan={2}>
                Multi Actions <Icon src="lightning" title="Multi Actions" />
              </th>
            </tr>
            <tr>
              <td className="td1 center" colSpan={2}>
                <b>ALL</b> {dataOnPage.length}{' '}
                {dataOnPage.length === 1 ? 'Tag' : 'Tags'}
                <select
                  name="allaction"
                  disabled={false}
                  onChange={({ target: { value } }) => {
                    // TODO rest
                    if (value === 'delall') {
                      if (
                        window.confirm(
                          `${dataOnPage.length} Record(s) will be affected ***\n\nARE YOU SURE?`
                        )
                      ) {
                        dataService.deleteMultipleTermTags(
                          tags.map(({ TgID }) => TgID)
                        );
                      }
                    }
                  }}
                >
                  <GetAllTagsActionsSelectOptions />
                </select>
              </td>
            </tr>
            <tr>
              <td className="td1 center">
                <input type="button" value="Mark All" onClick={onSelectAll} />
                <input type="button" value="Mark None" onClick={onSelectNone} />
              </td>
              <td className="td1 center">
                Marked Tags:&nbsp;
                <select
                  name="markaction"
                  id="markaction"
                  disabled={selectedValues.size === 0}
                  onChange={({ target: { value } }) => {
                    if (value === 'del') {
                      if (
                        window.confirm(
                          `${selectedValues.size} Record(s) will be affected ***\n\nARE YOU SURE?`
                        )
                      ) {
                        dataService.deleteMultipleTermTags([...selectedValues]);
                      }
                    }
                  }}
                >
                  <GetMultipleTagsActionsSelectOptions />
                </select>
              </td>
            </tr>
          </table>

          <table className="sortable tab1" cellSpacing={0} cellPadding={5}>
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
                downSorting={TagSorting['Term Count']}
                upSorting={TagSorting['Term Count (desc)']}
              >
                Terms With Tag{' '}
              </SortableHeader>
            </tr>
            {dataOnPage.map((tag) => (
              <tr>
                {/* ' . checkTest(record['TgID'], 'marked') . ' */}
                <td className="td1 center">
                  <A id={`rec${tag['TgID']}`}>
                    <input
                      name="marked[]"
                      type="checkbox"
                      {...checkboxPropsForEntry(tag)}
                      className="markcheck"
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
            ))}
          </table>
        </form>
      )}

      {numPages > 1 && (
        <form name="form3" action="#">
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
        a.TgText < b.TgText ? 1 : -1;
    case TagSorting['Tag Comment A-Z']:
      return (a: WordTagDetailRow, b: WordTagDetailRow) =>
        (a.TgComment || '') < (b.TgComment || '') ? 1 : -1;
    case TagSorting['Tag Text Z-A']:
      return (a: WordTagDetailRow, b: WordTagDetailRow) =>
        a.TgText < b.TgText ? -1 : 1;
    case TagSorting['Tag Comment Z-A']:
      return (a: WordTagDetailRow, b: WordTagDetailRow) =>
        (a.TgComment || '') < (b.TgComment || '') ? -1 : 1;
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

/**
 *
 * @param count
 */
export function pluralize(count: number) {
  return count === 1 ? '' : 's';
}

/**
 *
 */
export function NewTag() {
  const validator = TagsValidator;
  const refMap = RefMap<Tag>(validator);

  const navigator = useInternalNavigate();

  const { Input: TgInput, onSubmit } = useFormInput({ validator });
  return (
    <>
      <Header title="My Term Tags" />
      <h4>New Tag</h4>
      <form name="newtag" className="validate" method="post">
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
              <textarea
                className="textarea-noreturn checklength checkoutsidebmp"
                maxLength={200}
                ref={refMap.TgComment}
                name="TgComment"
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
                  resetDirty();
                  navigator('/edit_tags');
                }}
              />
              <input
                type="button"
                name="op"
                value="Save"
                onClick={() => {
                  onSubmit(
                    tagPreValidateMap,
                    (value) => {
                      dataService.addTag(value);
                      navigator('/edit_tags');
                    },
                    'TgID'
                  );
                }}
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
export function EditTag({ chgId }: { chgId: TagsId }) {
  const [{ tags }] = useData(['tags']);
  const changingTag = tags.find(({ TgID }) => TgID === chgId);
  if (!changingTag) {
    throw new Error('Invalid Tag ID');
  }
  const validator = TagsValidator;
  const refMap = RefMap<Tag>(validator);

  const { onSubmit, Input: TgInput } = useFormInput({
    validator,
    entry: changingTag,
  });
  const navigator = useInternalNavigate();
  return (
    <>
      <Header title="My Term Tags" />
      <h4>Edit Tag</h4>
      <form name="newtag" className="validate">
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
              <textarea
                className="textarea-noreturn checklength checkoutsidebmp"
                maxLength={200}
                ref={refMap.TgComment}
                name="TgComment"
                cols={40}
                defaultValue={changingTag.TgComment}
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
                  resetDirty();
                  navigator('/edit_tags');
                }}
              />
              <input
                type="button"
                name="op"
                value="Save"
                onClick={() => {
                  onSubmit(
                    tagPreValidateMap,
                    (value) => {
                      dataService.editTag(changingTag.TgID, value);
                      navigator('/edit_tags');
                    },
                    'TgID'
                  );
                }}
              />
            </td>
          </tr>
        </table>
      </form>
    </>
  );
}
