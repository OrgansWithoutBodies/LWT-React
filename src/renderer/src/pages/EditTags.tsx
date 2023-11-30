import { useRef } from 'react';
import { dataService } from '../data/data.service';
import { Tags } from '../data/parseMySqlDump';
import { useData } from '../data/useAkita';
import { TagsId, TagsValidator } from '../data/validators';
import { usePager } from '../hooks/usePager';
import { useSelection } from '../hooks/useSelection';
import { A } from '../nav/InternalLink';
import { useInternalNavigate } from '../nav/useInternalNav';
import { Icon, RequiredLineButton } from '../ui-kit/Icon';
import { Pager } from '../ui-kit/Pager';
import {
  GetAllTagsActionsSelectOptions,
  GetMultipleTagsActionsSelectOptions,
} from './EditTextTags';
import { CheckAndSubmit, RefMap, emptyToNullMap, identityMap } from './Forms';
import { Header } from './Header';
import { resetDirty } from './Sorting';
import { NavigateButton } from './Statistics.component';
import { FormInput } from './buildFormInput';
import { confirmDelete, multiActionGo } from './utils';

export function DisplayTags({
  query,

  currentPage,
}: {
  query: string;
  currentPage: number;
}): JSX.Element {
  const [{ tags, settings }] = useData(['tags', 'settings']);
  const navigate = useInternalNavigate();
  const tagCount = tags.length;
  const recno = tags.length;

  const pageSize = settings['set-tags-per-page'] || 1;
  const { dataOnPage, numPages } = usePager(tags, currentPage, pageSize);
  const { checkboxPropsForEntry, selectedValues, onSelectAll, onSelectNone } =
    useSelection(tags, 'TgID');

  const queryRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <Header title={'Word Tags'} />
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
                  navigate(
                    `/edit_tags?page=1&query=${queryRef.current?.value || ''}`
                  );
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
          {/* <?php if(recno > 0) { ?>
<tr>
<th className="th1" colSpan={1} style={{whiteSpace:"nowrap"}}>
<?php echo recno; ?> Tag<?php echo (recno==1?'':'s'); ?>
</th><th className="th1" colSpan={2} style={{whiteSpace:"nowrap"}}>
<?php makePager (currentpage, pages, 'edit_tags', 'form1', 1); ?>
</th><th className="th1" style={{whiteSpace:"nowrap"}}>
Sort Order:
<select name="sort" onChange="{val=document.form1.sort.options[document.form1.sort.selectedIndex].value; location.href='edit_tags?page=1&sort=' + val;}"><?php echo get_tagsort_selectoptions(currentsort); ?></select>
</th></tr>
<?php } ?> */}
        </table>
      </form>

      {recno === 0 ? (
        <p>No tags found.</p>
      ) : (
        <form
          name="form2"
          action="<?php echo _SERVER['PHP_SELF']; ?>"
          method="post"
        >
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
                  // TODO
                  onChange="allActionGo(document.form2, document.form2.allaction,<?php echo recno; ?>);"
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
                  onChange={(val) => {
                    multiActionGo(
                      () => {},
                      // TODO ref
                      val
                    );
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
              <th className="th1 clickable">Terms With Tag</th>
            </tr>
            {dataOnPage.map((tag) => (
              <tr>
                {/* ' . checkTest(record['TgID'], 'marked') . ' */}
                <td className="td1 center">
                  {/* TODO */}
                  <A name="rec' . record['TgID'] . '">
                    <input
                      name="marked[]"
                      type="checkbox"
                      {...checkboxPropsForEntry(tag)}
                      className="markcheck"
                      value="' . record['TgID'] . '"
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
                      // ref={`' . _SERVER['PHP_SELF'] . '?del=' . record['TgID'] . '`}
                      if (confirmDelete()) {
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
                  {/* TODO should be counting with this tag */}
                  {tagCount > 0 ? (
                    <A href={`/edit_words?tag1=${tag.TgID}`}>{tagCount}</A>
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
          <table className="tab1" cellSpacing={0} cellPadding={5}>
            <tr>
              <th className="th1" style={{ whiteSpace: 'nowrap' }}>
                Tag{recno == 1 ? '' : 's'}
              </th>
              <th className="th1" style={{ whiteSpace: 'nowrap' }}></th>
            </tr>
          </table>
        </form>
      )}

      <Pager currentPage={currentPage} numPages={numPages} />
      {/* <?php if( pages > 1) { ?>
<form name="form3" action="#">
<table className="tab1" cellspacing={0} cellpadding={5}>
<tr>
<th className="th1" style={{whiteSpace:"nowrap"}}>
<?php echo recno; ?> Tag<?php echo (recno==1?'':'s'); ?>
</th><th className="th1" style={{whiteSpace:"nowrap"}}>
// <?php makePager (currentpage, pages, 'edit_tags', 'form3', 2); ?> */}
    </>
  );
}
export function NewTag() {
  const preValidateMap: {
    [key in keyof Tags]?: (value: string) => any | null;
  } = {
    TgText: identityMap,
    TgComment: emptyToNullMap,
  };
  const validator = TagsValidator;
  const refMap = RefMap<Tags>(validator);

  const navigator = useInternalNavigate();

  return (
    <>
      <Header title={'My Term Tags'} />
      <h4>New Tag</h4>
      <form
        name="newtag"
        className="validate"
        action="<?php echo $_SERVER['PHP_SELF']; ?>"
        method="post"
      >
        <table className="tab3" cellSpacing={0} cellPadding={5}>
          <tr>
            <td className="td1 right">Tag:</td>
            <td className="td1">
              <FormInput
                className="notempty setfocus noblanksnocomma checkoutsidebmp"
                type="text"
                entryKey="TgText"
                refMap={refMap}
                maxLength={20}
                size={20}
              />
              <RequiredLineButton />
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
                  CheckAndSubmit(
                    refMap,
                    preValidateMap,
                    validator,
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
export function EditTag({ chgId }: { chgId: TagsId }) {
  const [{ tags }] = useData(['tags']);
  const changingTag = tags.find(({ TgID }) => TgID === chgId);
  if (!changingTag) {
    throw new Error('Invalid Tag ID');
  }
  const preValidateMap: {
    [key in keyof Tags]?: (value: string) => any | null;
  } = {
    TgText: identityMap,
    TgComment: emptyToNullMap,
  };
  const validator = TagsValidator;
  const refMap = RefMap<Tags>(validator);

  const navigator = useInternalNavigate();
  Comment;
  return (
    <>
      <Header title={'My Term Tags'} />
      <h4>Edit Tag</h4>
      <form
        name="newtag"
        className="validate"
        // action="<?php echo $_SERVER['PHP_SELF']; ?>"
        method="post"
      >
        <table className="tab3" cellSpacing={0} cellPadding={5}>
          <tr>
            <td className="td1 right">Tag:</td>
            <td className="td1">
              <FormInput
                className="notempty setfocus noblanksnocomma checkoutsidebmp"
                type="text"
                entryKey="TgText"
                defaultEntry={changingTag}
                refMap={refMap}
                maxLength={20}
                size={20}
              />
              <RequiredLineButton />
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
                  CheckAndSubmit(
                    refMap,
                    preValidateMap,
                    validator,
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
