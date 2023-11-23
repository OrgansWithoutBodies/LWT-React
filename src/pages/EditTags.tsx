import { useRef } from 'react';
import { Icon } from '../Icon';
import { dataService } from '../data/data.service';
import { Tags } from '../data/parseMySqlDump';
import { useData } from '../data/useAkita';
import { TagsId, TagsValidator } from '../data/validators';
import { A } from '../nav/InternalLink';
import { useInternalNavigate } from '../nav/useInternalNav';
import { Pager } from '../ui-kit/Pager';
import { usePager } from '../usePager';
import { CheckAndSubmit, RefMap, emptyToNullMap, identityMap } from './Forms';
import { Header } from './Header';
import { useSelection } from './useSelection';
import { confirmDelete } from './utils';

export function DisplayTags({
  query,

  currentPage,
}: {
  query: string;
  currentPage: number;
}): JSX.Element {
  // TODO
  const pageSize = 15;

  const [{ tags }] = useData(['tags']);
  const restoreBackup = useRef();
  const navigate = useInternalNavigate();
  const tagCount = tags.length;
  const recno = tags.length;
  const { dataOnPage, numPages } = usePager(tags, currentPage, pageSize);
  const { checkboxPropsForEntry, onSelectAll, onSelectNone } = useSelection(
    tags,
    'TgID'
  );
  const queryRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <Header title={'Word Tags'} />
      <p>
        <A href="/edit_tags?new=1">
          <Icon src="plus-button" title="New" /> New Term Tag ...
        </A>
      </p>

      <form
        name="form1"
        action="#"
        // TODO
        onSubmit="document.form1.querybutton.click(); return false;"
      >
        <table className="tab1" cellSpacing={0} cellPadding={5}>
          <tr>
            <th className="th1" colSpan={4}>
              Filter <Icon src="funnel" title="Filter" />
              &nbsp;
              <input
                type="button"
                value="Reset All"
                onClick={() => {
                  navigate(`/edit_tags?page=${1}`);
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

      {/* <?php
if (recno==0) {
?>
<p>No tags found.</p>
<?php
} else {
?> */}
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
              <b>ALL</b>
              {/* <?php echo (recno == 1 ? '1 Tag' : recno . ' Tags'); ?>:&nbsp;  */}
              <select
                name="allaction"
                // TODO
                onChange="allActionGo(document.form2, document.form2.allaction,<?php echo recno; ?>);"
              >
                {/* <?php echo get_alltagsactions_selectoptions(); ?> */}
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
                disabled
                // TODO
                onChange="multiActionGo(document.form2, document.form2.markaction);"
              >
                {/* TODO */}
                {/* <?php echo get_multipletagsactions_selectoptions(); ?> */}
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
          {dataOnPage.map((tag) => {
            return (
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
                        dataService.deleteTagFromTerm(tag.WtTgID);
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
            );
          })}
        </table>
      </form>
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
  Comment;
  return (
    <>
      <Header title={'My Term Tags'} />
      <h4>New Tag</h4>
      <script
        type="text/javascript"
        src="js/unloadformcheck.js"
        charSet="utf-8"
      ></script>
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
              <input
                className="notempty setfocus noblanksnocomma checkoutsidebmp"
                type="text"
                name="TgText"
                ref={refMap.TgText}
                maxlength={20}
                size={20}
              />
              <Icon src="status-busy" title="Field must not be empty" />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Comment:</td>
            <td className="td1">
              <textarea
                className="textarea-noreturn checklength checkoutsidebmp"
                data_maxlength={200}
                ref={refMap.TgComment}
                name="TgComment"
                cols={40}
                rows={3}
              ></textarea>
            </td>
          </tr>
          <tr>
            <td className="td1 right" colSpan={2}>
              <input
                type="button"
                value="Cancel"
                // TODO
                onClick="{resetDirty(); location.href='edit_tags.php';}"
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
  const changingTag = tags.find(({ TgID }) => {
    return TgID === chgId;
  });
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
      <script
        type="text/javascript"
        src="js/unloadformcheck.js"
        charSet="utf-8"
      ></script>
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
              <input
                className="notempty setfocus noblanksnocomma checkoutsidebmp"
                type="text"
                name="TgText"
                defaultValue={changingTag?.TgText}
                ref={refMap.TgText}
                maxlength={20}
                size={20}
              />
              <Icon src="status-busy" title="Field must not be empty" />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Comment:</td>
            <td className="td1">
              <textarea
                className="textarea-noreturn checklength checkoutsidebmp"
                data_maxlength={200}
                ref={refMap.TgComment}
                name="TgComment"
                cols={40}
                defaultValue={changingTag?.TgComment}
                rows={3}
              ></textarea>
            </td>
          </tr>
          <tr>
            <td className="td1 right" colSpan={2}>
              <input
                type="button"
                value="Cancel"
                // TODO
                onClick="{resetDirty(); location.href='edit_tags.php';}"
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
                      dataService.editTag(changingTag?.TgID, value);
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
