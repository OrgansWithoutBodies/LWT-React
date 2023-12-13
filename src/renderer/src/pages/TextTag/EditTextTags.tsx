import { TextTagDetailRow } from '../../data/data.query';
import { dataService } from '../../data/data.service';
import { Tags2Id, Tags2Validator } from '../../data/validators';
import { CheckAndSubmit } from '../../forms/Forms';
import { useData } from '../../hooks/useAkita';
import { useFormInput } from '../../hooks/useFormInput';
import { useInternalNavigate } from '../../hooks/useInternalNav';
import { usePager } from '../../hooks/usePager';
import { useSelection } from '../../hooks/useSelection';
import { A } from '../../nav/InternalLink';
import { Header } from '../../ui-kit/Header';
import { Icon } from '../../ui-kit/Icon';
import { confirmDelete } from '../../utils/utils';
import { FilterSortPager } from '../ArchivedText/EditArchivedTexts.component';
import {
  GetAllTagsActionsSelectOptions,
  GetMultipleTagsActionsSelectOptions,
  GetTagSortSelectoptions,
} from '../SelectOptions';
import { TagSorting, resetDirty } from '../Sorting';
import { SortableHeader, TableFooter } from '../Text/Library.component';
/**
 *
 */
export function DisplayTextTags({
  query,
  currentPage = 1,
  sorting = TagSorting['Tag Text A-Z'],
}: {
  query: string;
  currentPage?: number;
  sorting?: TagSorting;
}) {
  const [{ tags2, archtexttags, texttags, settings }] = useData([
    'tags2',
    'archtexttags',
    'texttags',
    'settings',
  ]);
  const navigate = useInternalNavigate();
  const { onSelectAll, onSelectNone, checkboxPropsForEntry, selectedValues } =
    useSelection(tags2, 'T2ID');
  const pageSize = settings['set-tags-per-page'] || 1;
  const countTextsPerTag: Record<Tags2Id, number> = texttags.reduce(
    (prev, curr) => ({ ...prev, [curr.TtT2ID]: prev[curr.TtT2ID] + 1 }),
    Object.fromEntries(tags2.map((val) => [val.T2ID, 0]))
  );
  const countArchivedTextsPerTag: Record<Tags2Id, number> = archtexttags.reduce(
    (prev, curr) => ({ ...prev, [curr.AgT2ID]: prev[curr.AgT2ID] + 1 }),
    Object.fromEntries(tags2.map((val) => [val.T2ID, 0]))
  );

  const sortedTags = tags2
    .map((tag) => ({
      ...tag,
      textCount: countTextsPerTag[tag.T2ID],
      archTextCount: countArchivedTextsPerTag[tag.T2ID],
    }))
    .sort(sortValues(sorting));
  const recno = tags2.length;
  const { dataOnPage, numPages } = usePager(sortedTags, currentPage, pageSize);
  return (
    <>
      <Header title="Edit Text Tags" />
      <p>
        <A href="/edit_texttags?new=1">
          <Icon src="plus-button" title="New" alt="New" /> New Text Tag ...
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
                  navigate(`/edit_texttags`);
                }}
              />
            </th>
          </tr>
          <tr>
            <td className="td1 center" colSpan={4}>
              Tag Text or Comment:
              <input
                type="text"
                name="query"
                defaultValue={query}
                maxLength={50}
                size={15}
              />
              &nbsp;
              <input
                type="button"
                name="querybutton"
                value="Filter"
                onClick={() => {
                  navigate(`/edit_texttags?page=${1}&query=${query}`);
                }}
              />
              &nbsp;
              <input
                type="button"
                value="Clear"
                onClick={() => {
                  navigate(`/edit_texttags?page=${1}&query=`);
                }}
              />
            </td>
          </tr>
          <FilterSortPager
            currentPage={currentPage}
            numPages={numPages}
            recno={recno}
            elementName={'Tag'}
          >
            <GetTagSortSelectoptions selected={sorting} />
          </FilterSortPager>
        </table>
      </form>
      {recno === 0 ? (
        <p>No tags found.</p>
      ) : (
        <form name="form2" method="post">
          <input type="hidden" name="data" value="" />
          <table className="tab1" cellSpacing={0} cellPadding={5}>
            <tr>
              <th className="th1 center" colSpan={2}>
                Multi Actions <Icon src="lightning" title="Multi Actions" />
              </th>
            </tr>
            <tr>
              <td className="td1 center" colSpan={2}>
                <b>ALL</b> {recno} {recno === 1 ? 'Tag' : 'Tags'}
                <select
                  name="allaction"
                  onChange={({ target: { value } }) => {
                    // TODO other cases
                    if (value === 'delall') {
                      if (
                        window.confirm(
                          `THIS IS AN ACTION ON ALL RECORDS\nON ALL PAGES OF THE CURRENT QUERY!\n\n*** ' + t + ' ***\n\n*** ${recno} Record(s) will be affected ***\n\nARE YOU SURE?`
                        )
                      ) {
                        dataService.deleteMultipleTextTags(
                          tags2.map((val) => val.T2ID)
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
                          `${dataOnPage.length} Record(s) will be affected ***\n\nARE YOU SURE?`
                        )
                      ) {
                        dataService.deleteMultipleTextTags([...selectedValues]);
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
                downSorting={TagSorting['Tag Text Z-A']}
                upSorting={TagSorting['Tag Text A-Z']}
              >
                Tag Text
              </SortableHeader>
              <SortableHeader
                sorting={sorting}
                downSorting={TagSorting['Tag Comment Z-A']}
                upSorting={TagSorting['Tag Comment A-Z']}
              >
                Tag Comment
              </SortableHeader>
              <SortableHeader
                sorting={sorting}
                downSorting={TagSorting['Texts With Tag']}
                upSorting={TagSorting['Texts With Tag (desc)']}
              >
                Texts
                <br />
                With Tag
              </SortableHeader>
              <SortableHeader
                sorting={sorting}
                downSorting={TagSorting['Arch. Texts With Tag']}
                upSorting={TagSorting['Arch. Texts With Tag (desc)']}
              >
                Arch.Texts
                <br />
                With Tag
              </SortableHeader>
            </tr>

            {sortedTags.map((tag) => {
              const { textCount } = tag;
              const { archTextCount } = tag;
              return (
                <tr>
                  {/* TODO think already taken care of?*/}
                  {/*  ' . checkTest($record['T2ID'], 'marked') . ' */}
                  <td className="td1 center">
                    <A id={`rec${tag['T2ID']}`}>
                      <input
                        name="marked[]"
                        type="checkbox"
                        className="markcheck"
                        {...checkboxPropsForEntry(tag)}
                        value={tag['T2ID']}
                      />
                    </A>
                  </td>
                  <td className="td1 center" style={{ whiteSpace: 'nowrap' }}>
                    &nbsp;
                    <A href={`/edit_texttags?chg=${tag.T2ID}`}>
                      <Icon src="document--pencil" title="Edit" />
                    </A>
                    &nbsp;
                    <A>
                      <Icon
                        onClick={() => {
                          if (confirmDelete()) {
                            dataService.deleteTextTag(tag.T2ID);
                          }
                        }}
                        src="minus-button"
                        title="Delete"
                      />
                    </A>
                    &nbsp;
                  </td>
                  <td className="td1 center">{tag.T2Text}</td>
                  <td className="td1 center">{tag.T2Comment}</td>
                  <td className="td1 center">
                    {textCount > 0 ? (
                      <A href={`/edit_texts?tag1=${tag.T2ID}`}>{textCount}</A>
                    ) : (
                      '0'
                    )}
                  </td>
                  <td className="td1 center">
                    {archTextCount > 0 ? (
                      <A href={`/edit_archivedtexts?tag1=${tag.T2ID}`}>
                        {archTextCount}
                      </A>
                    ) : (
                      '0'
                    )}
                  </td>
                </tr>
              );
            })}
          </table>
        </form>
      )}
      {numPages > 1 && (
        <form name="form3" action="#">
          <TableFooter
            currentPage={currentPage}
            pageSize={pageSize}
            numPages={numPages}
            recno={recno}
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
 */
export function NewTextTag() {
  const validator = Tags2Validator;
  const navigator = useInternalNavigate();
  const { Input: TtInput, refMap } = useFormInput({ validator });
  return (
    <>
      <Header title="My Text Tags" />
      <h4>New Tag</h4>
      <form name="newtag" className="validate" method="post">
        <table className="tab3" cellSpacing={0} cellPadding={5}>
          <tr>
            <td className="td1 right">Tag:</td>
            <td className="td1">
              <TtInput
                className="notempty setfocus noblanksnocomma checkoutsidebmp"
                entryKey="T2Text"
                errorName="Tag"
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
                errorName="Comment"
                name="T2Comment"
                ref={refMap.T2Comment}
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
                  navigator('/edit_texttags');
                }}
              />
              <input
                type="button"
                name="op"
                value="Save"
                onClick={() => {
                  CheckAndSubmit(
                    refMap,
                    {},
                    validator,
                    (value) => {
                      dataService.addTextTag(value);
                      navigator('/edit_texttags');
                    },
                    'T2ID'
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
export function EditTextTag({ chgID }: { chgID: number }) {
  const [{ tags2 }] = useData(['tags2']);
  const changingTag = tags2.find(({ T2ID }) => chgID === T2ID);
  if (!changingTag) {
    throw new Error('invalid change ID');
  }
  const validator = Tags2Validator;
  const navigator = useInternalNavigate();
  const {
    Input: TgInput,
    onSubmit,
    refMap,
  } = useFormInput({ validator, entry: changingTag });
  return (
    <>
      <Header title="My Text Tags" />
      <h4>Edit Tag</h4>
      <form name="edittag" className="validate">
        <TgInput type="hidden" entryKey="T2ID" fixed />
        <table className="tab3" cellSpacing={0} cellPadding={5}>
          <tr>
            <td className="td1 right">Tag:</td>
            <td className="td1">
              <TgInput
                errorName="Tag"
                className="notempty setfocus noblanksnocomma checkoutsidebmp"
                type="text"
                entryKey="T2Text"
                default
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
                errorName="Comment"
                name="T2Comment"
                ref={refMap.T2Comment}
                cols={40}
                rows={3}
                defaultValue={changingTag.T2Comment}
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
                  navigator(`/edit_texttags#rec${chgID}`);
                }}
              />
              <input
                type="button"
                name="op"
                value="Change"
                onClick={() => {
                  onSubmit(
                    {},
                    (value) => {
                      if (dataService.addTextTag(value) !== -1) {
                        navigator('/edit_texttags');
                      }
                    },
                    'T2ID'
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
 * @param value
 */
function sortValues(value: TagSorting) {
  switch (value) {
    case TagSorting['Newest first']:
      return (a: TextTagDetailRow, b: TextTagDetailRow) =>
        a.T2ID > b.T2ID ? 1 : -1;
    case TagSorting['Oldest first']:
      return (a: TextTagDetailRow, b: TextTagDetailRow) =>
        a.T2ID < b.T2ID ? 1 : -1;
    case TagSorting['Tag Text A-Z']:
      return (a: TextTagDetailRow, b: TextTagDetailRow) =>
        a.T2Text < b.T2Text ? 1 : -1;
    case TagSorting['Tag Text Z-A']:
      return (a: TextTagDetailRow, b: TextTagDetailRow) =>
        a.T2Text < b.T2Text ? -1 : 1;
    case TagSorting['Tag Comment A-Z']:
      return (a: TextTagDetailRow, b: TextTagDetailRow) =>
        (a.T2Comment || '') < (b.T2Comment || '') ? 1 : -1;
    case TagSorting['Tag Comment Z-A']:
      return (a: TextTagDetailRow, b: TextTagDetailRow) =>
        (a.T2Comment || '') < (b.T2Comment || '') ? -1 : 1;

    case TagSorting['Texts With Tag']:
      return (a: TextTagDetailRow, b: TextTagDetailRow) =>
        a.textCount > b.textCount ? 1 : -1;
    case TagSorting['Texts With Tag (desc)']:
      return (a: TextTagDetailRow, b: TextTagDetailRow) =>
        a.textCount > b.textCount ? -1 : 1;

    case TagSorting['Arch. Texts With Tag']:
      return (a: TextTagDetailRow, b: TextTagDetailRow) =>
        a.archTextCount > b.archTextCount ? 1 : -1;
    case TagSorting['Arch. Texts With Tag (desc)']:
      return (a: TextTagDetailRow, b: TextTagDetailRow) =>
        a.archTextCount > b.archTextCount ? -1 : 1;
  }
}
