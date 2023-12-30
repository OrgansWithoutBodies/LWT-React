import { confirmDelete } from 'lwt-common';
import { Tag2, Tags2ID, Tags2Validator } from 'lwt-schemas';
import { TextTagDetailRow, dataService, useData } from 'lwt-state';
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
  const { onSelectAll, onSelectNone, checkboxPropsForEntry, selectedValues } =
    useSelection(tags2, 'T2ID');
  const pageSize = settings['set-tags-per-page'] || 1;
  const countTextsPerTag: Record<Tags2ID, number> = texttags.reduce(
    (prev, curr) => ({ ...prev, [curr.TtT2ID]: prev[curr.TtT2ID] + 1 }),
    Object.fromEntries(tags2.map((val) => [val.T2ID, 0]))
  );
  const countArchivedTextsPerTag: Record<Tags2ID, number> = archtexttags.reduce(
    (prev, curr) => ({ ...prev, [curr.AgT2ID]: prev[curr.AgT2ID] + 1 }),
    Object.fromEntries(tags2.map((val) => [val.T2ID, 0]))
  );
  const t = useI18N();
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
      <Header title="My Text Tags" />
      <p>
        <A href="/edit_texttags?new=1">
          <Icon src="plus-button" title="New" /> New Text Tag ...
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
        <p>{t('No tags found')}.</p>
      ) : (
        <form name="form2" method="post">
          <input type="hidden" name="data" value="" />
          <GenericMultiActions
            AllActions={GetAllTagsActionsSelectOptions}
            SelectedOptions={GetMultipleTagsActionsSelectOptions}
            onChangeAll={({ target: { value } }) => {
              onChangeAllTextTags(value, recno, tags2);
            }}
            onChangeSelected={({ target: { value } }) => {
              onChangeSelectedTextTags(value, dataOnPage, selectedValues);
            }}
            countAllTerms={recno}
            countSelectedTerms={selectedValues.size}
            onSelectAll={onSelectAll}
            onSelectNone={onSelectNone}
            nounSingular={'Tag'}
          />

          <table className="sortable tab1" cellSpacing={0} cellPadding={5}>
            {<TextTagHeader sorting={sorting} />}
            {sortedTags.map((tag) => {
              const { textCount } = tag;
              const { archTextCount } = tag;
              return (
                <tr>
                  {/* TODO think already taken care of?*/}
                  {/*  ' . checkTest(record['T2ID'], 'marked') . ' */}
                  <td className="td1 center">
                    <A id={`rec${tag['T2ID']}`}>
                      <input
                        name="marked[]"
                        type="checkbox"
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

function TextTagHeader({ sorting }: { sorting: TagSorting }) {
  return (
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
  );
}

function onChangeSelectedTextTags(
  value: string,
  dataOnPage: TextTagDetailRow[],
  selectedValues: Set<Tags2ID>
) {
  if (value === 'del') {
    if (
      window.confirm(
        `${dataOnPage.length} Record(s) will be affected ***\n\nARE YOU SURE?`
      )
    ) {
      dataService.deleteMultipleTextTags([...selectedValues]);
    }
  }
}

function onChangeAllTextTags(value: string, recno: number, tags2: Tag2[]) {
  // TODO other cases

  if (value === 'delall') {
    if (
      window.confirm(
        `THIS IS AN ACTION ON ALL RECORDS\nON ALL PAGES OF THE CURRENT QUERY!\n\n*** ' + t + ' ***\n\n*** ${recno} Record(s) will be affected ***\n\nARE YOU SURE?`
      )
    ) {
      dataService.deleteMultipleTextTags(tags2.map((val) => val.T2ID));
    }
  }
}

export function NewTextTag() {
  const validator = Tags2Validator;
  const navigator = useInternalNavigate();
  const t = useI18N();
  const { onSubmit, Input: TtInput, TextArea } = useFormInput({ validator });
  const submitForm = () => {
    onSubmit(
      {},
      (value) => {
        dataService.addTextTag(value);
        navigator('/edit_texttags');
      },
      'T2ID'
    );
  };
  return (
    <>
      <Header title="My Text Tags" />
      <h4>{t('New Tag')}</h4>
      <form name="newtag" method="post">
        <table className="tab3" cellSpacing={0} cellPadding={5}>
          <EntryRow headerText="Tag">
            <TtInput
              className="notempty setfocus noblanksnocomma checkoutsidebmp"
              entryKey="T2Text"
              errorName="Tag"
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
              errorName="Comment"
              entryKey="T2Comment"
              cols={40}
              rows={3}
            />
          </EntryRow>
          <tr>
            <td className="td1 right" colSpan={2}>
              <input
                type="button"
                value="Cancel"
                onClick={() => {
                  navigator('/edit_texttags');
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
    TextArea,
  } = useFormInput({ validator, entry: changingTag });
  const submitForm = () => {
    onSubmit(
      {},
      (value) => {
        if (dataService.addTextTag(value) !== -1) {
          navigator('/edit_texttags');
        }
      },
      'T2ID'
    );
  };
  return (
    <>
      <Header title="My Text Tags" />
      <h4>Edit Tag</h4>
      <form name="edittag">
        <TgInput type="hidden" entryKey="T2ID" fixed />
        <table className="tab3" cellSpacing={0} cellPadding={5}>
          <EntryRow headerText="Tag">
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
          </EntryRow>
          <EntryRow headerText="Comment">
            <TextArea
              className="checklength checkoutsidebmp"
              onKeyDown={(e) => textareaKeydown(e, submitForm)}
              maxLength={200}
              errorName="Comment"
              entryKey="T2Comment"
              cols={40}
              rows={3}
              default
            />
          </EntryRow>
          <tr>
            <td className="td1 right" colSpan={2}>
              <input
                type="button"
                value="Cancel"
                onClick={() => {
                  navigator(`/edit_texttags#rec${chgID}`);
                }}
              />
              <input
                type="button"
                name="op"
                value="Change"
                onClick={submitForm}
              />
            </td>
          </tr>
        </table>
      </form>
    </>
  );
}

export const sortAZ = (a: string, b: string) => (a < b ? 1 : -1);
export const sortZA = (a: string, b: string) => sortAZ(a, b) * -1;
export const sortSmallBig = (a: number, b: number) => (a < b ? 1 : -1);
export const sortBigSmall = (a: number, b: number) => sortSmallBig(a, b) * -1;
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
        sortAZ(a.T2Text, b.T2Text);
    case TagSorting['Tag Text Z-A']:
      return (a: TextTagDetailRow, b: TextTagDetailRow) =>
        sortZA(a.T2Text, b.T2Text);
    case TagSorting['Tag Comment A-Z']:
      return (a: TextTagDetailRow, b: TextTagDetailRow) =>
        sortAZ(a.T2Comment || '', b.T2Comment || '');

    case TagSorting['Tag Comment Z-A']:
      return (
        { T2Comment: a }: TextTagDetailRow,
        { T2Comment: b }: TextTagDetailRow
      ) => sortZA(a || '', b || '');

    case TagSorting['Texts With Tag']:
      return (
        { textCount: a }: TextTagDetailRow,
        { textCount: b }: TextTagDetailRow
      ) => sortSmallBig(a, b);
    case TagSorting['Texts With Tag (desc)']:
      return (
        { textCount: a }: TextTagDetailRow,
        { textCount: b }: TextTagDetailRow
      ) => sortBigSmall(a, b);
    case TagSorting['Arch. Texts With Tag']:
      return (a: TextTagDetailRow, b: TextTagDetailRow) =>
        a.archTextCount > b.archTextCount ? 1 : -1;
    case TagSorting['Arch. Texts With Tag (desc)']:
      return (a: TextTagDetailRow, b: TextTagDetailRow) =>
        a.archTextCount > b.archTextCount ? -1 : 1;
  }
}
