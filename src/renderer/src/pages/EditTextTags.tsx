import { dataService } from '../data/data.service';
import { Tag2 } from '../data/parseMySqlDump';
import { useData } from '../data/useAkita';
import { Tags2Validator } from '../data/validators';
import { CheckAndSubmit, RefMap } from '../forms/Forms';
import { useFormInput } from '../hooks/useFormInput';
import { useInternalNavigate } from '../hooks/useInternalNav';
import { usePager } from '../hooks/usePager';
import { useSelection } from '../hooks/useSelection';
import { A } from '../nav/InternalLink';
import { Header } from '../ui-kit/Header';
import { Icon } from '../ui-kit/Icon';
import { Pager } from '../ui-kit/Pager';
import { pluralize } from './EditTags';
import { FormInput } from './FormInput';
import { resetDirty } from './Sorting';
import { confirmDelete } from './utils';

export function DisplayTextTags({
  query,
  page = 1,
}: {
  query: string;
  page?: number;
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

  const recno = tags2.length;
  const { dataOnPage, numPages } = usePager(tags2, page, pageSize);
  console.log(page, numPages, pageSize);
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
                  // refMap;
                  // navigate(`/edit_texttags?page=${1}&query=`);
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
          {/* TODO */}
          <tr>
            <th className="th1" colSpan={1} style={{ whiteSpace: 'nowrap' }}>
              {recno} Tag{pluralize(recno)}
            </th>
            <th className="th1" colSpan={2} style={{ whiteSpace: 'nowrap' }}>
              {/* TODO */}
              <Pager currentPage={0} numPages={0} />
            </th>
            <th className="th1" style={{ whiteSpace: 'nowrap' }}>
              Sort Order:
              <select
                name="sort"
                // TODO
                onChange="{val=document.form1.sort.options[document.form1.sort.selectedIndex].value; location.href='edit_texttags?page=1&sort=' + val;}"
              >
                <GetTagsortSelectoptions />
              </select>
            </th>
          </tr>
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
              <th className="th1 clickable">Tag Text</th>
              <th className="th1 clickable">Tag Comment</th>
              <th className="th1 clickable">
                Texts
                <br />
                With Tag
              </th>
              <th className="th1 clickable">
                Arch.Texts
                <br />
                With Tag
              </th>
            </tr>

            {/* $sql = 'select T2ID, T2Text, T2Comment from ' . $tbpref . 'tags2 where (1=1) ' . $wh_query . ' order by ' . $sorts[$currentsort-1] . ' ' . $limit; */}
            {tags2.map((tag) => {
              const numTextTags = texttags.filter(
                ({ TtT2ID }) => tag.T2ID === TtT2ID
              ).length;
              const numArchivedTextTags = archtexttags.filter(
                ({ AgT2ID }) => tag.T2ID === AgT2ID
              ).length;
              return (
                <tr>
                  {/* TODO */}
                  {/*  ' . checkTest($record['T2ID'], 'marked') . ' */}
                  <td className="td1 center">
                    <A name="rec' . $record['T2ID'] . '">
                      <input
                        name="marked[]"
                        type="checkbox"
                        className="markcheck"
                        {...checkboxPropsForEntry(tag)}
                        value="' . $record['T2ID'] . '"
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
                    {numTextTags > 0 ? (
                      <A href={`/edit_texts?tag1=${tag.T2ID}`}>{numTextTags}</A>
                    ) : (
                      '0'
                    )}
                  </td>
                  <td className="td1 center">
                    {numArchivedTextTags > 0 ? (
                      <A href={`/edit_archivedtexts?tag1=${tag.T2ID}`}>
                        {numArchivedTextTags}
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
          <table className="tab1" cellSpacing={0} cellPadding={5}>
            <tr>
              <th className="th1" style={{ whiteSpace: 'nowrap' }}>
                {recno} Tag{pluralize(recno)}
              </th>
              <th className="th1" style={{ whiteSpace: 'nowrap' }}>
                <Pager currentPage={page} numPages={numPages} />
              </th>
            </tr>
          </table>
        </form>
      )}
    </>
  );
}

export function NewTextTag() {
  const validator = Tags2Validator;
  const refMap = RefMap<Tag2>(validator);
  const navigator = useInternalNavigate();
  return (
    <>
      <Header title="My Text Tags" />
      <h4>New Tag</h4>
      <form name="newtag" className="validate" method="post">
        <table className="tab3" cellSpacing={0} cellPadding={5}>
          <tr>
            <td className="td1 right">Tag:</td>
            <td className="td1">
              <FormInput
                className="notempty setfocus noblanksnocomma checkoutsidebmp"
                type="text"
                entryKey="T2Text"
                refMap={refMap}
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

export function GetMultipleTagsActionsSelectOptions() {
  return (
    <>
      <option value="">[Choose...]</option>
      <option value="del">Delete Marked Tags</option>
    </>
  );
}

export function GetAllTagsActionsSelectOptions() {
  return (
    <>
      <option value="">[Choose...]</option>
      <option value="delall">Delete ALL Tags</option>
    </>
  );
}

export function GetMultipleArchivedTextActionsSelectOptions() {
  return (
    <>
      <option value="">[Choose...]</option>
      <option disabled>------------</option>
      <option value="addtag">Add Tag</option>
      <option value="deltag">Remove Tag</option>
      <option disabled>------------</option>
      <option value="unarch">Unarchive Marked Texts</option>
      <option disabled>------------</option>
      <option value="del">Delete Marked Texts</option>
      <option value="delall">Delete ALL Tags</option>
    </>
  );
}

export function GetTagsortSelectoptions() {
  return (
    <>
      <option value="1">Tag Text A-Z</option>
      <option value="2">Tag Comment A-Z</option>
      <option value="3">Newest first</option>
      <option value="4">Oldest first</option>
    </>
  );
}
export function GetTextssortSelectoptions() {
  return (
    <>
      <option value="1">Title A-Z</option>
      <option value="2">Newest first</option>
      <option value="3">Oldest first</option>
    </>
  );
}
