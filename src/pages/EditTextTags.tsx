import { Icon } from '../Icon';
import { useData } from '../data/useAkita';
import { A } from '../nav/InternalLink';
import { useInternalNavigate } from '../nav/useInternalNav';
import { Header } from './Header';

export function EditTextTags({ query }: { query: string }) {
  const [{ tags2, archtexttags, texttags }] = useData([
    'tags2',
    'archtexttags',
    'texttags',
  ]);
  const navigate = useInternalNavigate();

  return (
    <>
      <Header title={'Edit Text Tags'} />
      <p>
        <A href="/edit_texttags?new=1">
          <Icon src="plus-button" title="New" alt="New" /> New Text Tag ...
        </A>
      </p>

      <form
        name="form1"
        action="#"
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
                  navigate(`/edit_texttags?page=${1}&query=`);
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
          {/* <?php if($recno > 0) { ?>
<tr>
<th class="th1" colspan={1} style={{whiteSpace:"nowrap"}}>
<?php echo $recno; ?> Tag<?php echo ($recno==1?'':'s'); ?>
</th><th class="th1" colspan={2} style={{whiteSpace:"nowrap"}}>
<?php makePager ($currentpage, $pages, 'edit_texttags', 'form1', 1); ?>
</th><th class="th1" style={{whiteSpace:"nowrap"}}>
Sort Order:
<select name="sort" onchange="{val=document.form1.sort.options[document.form1.sort.selectedIndex].value; location.href='edit_texttags?page=1&sort=' + val;}"><?php echo get_tagsort_selectoptions($currentsort); ?></select>
</th></tr>
<?php } ?> */}
        </table>
      </form>
      {/* 
<?php
if ($recno==0) {
?>
<p>No tags found.</p>
<?php
} else {
?> */}
      <form
        name="form2"
        action="<?php echo $_SERVER['PHP_SELF']; ?>"
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
              {/* <?php echo ($recno == 1 ? '1 Tag' : $recno . ' Tags'); ?>:&nbsp;  */}
              <select
                name="allaction"
                onChange="allActionGo(document.form2, document.form2.allaction,<?php echo $recno; ?>);"
              >
                {/* <?php echo get_alltagsactions_selectoptions(); ?> */}
              </select>
            </td>
          </tr>
          <tr>
            <td className="td1 center">
              <input
                type="button"
                value="Mark All"
                // TODO
                onClick="selectToggle(true,'form2');"
              />
              <input
                type="button"
                value="Mark None"
                // TODO
                onClick="selectToggle(false,'form2');"
              />
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
            const c = texttags.filter(({ TtT2ID }) => {
              return tag.T2ID === TtT2ID;
            }).length;
            const ca = archtexttags.filter(({ AgT2ID }) => {
              return tag.T2ID === AgT2ID;
            }).length;
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
                      value="' . $record['T2ID'] . '"
                    />
                  </A>
                </td>
                <td className="td1 center" style={{ whiteSpace: 'nowrap' }}>
                  &nbsp;
                  <A href={`/edit_texttags?chg=${tag.T2ID}`}>
                    <Icon src={'document--pencil'} title="Edit" />
                  </A>
                  &nbsp;{' '}
                  <A
                    href={`/edit_texttags?del=${tag.T2ID}`}
                    className="confirmdelete"
                  >
                    <Icon src="minus-button" title="Delete" />
                  </A>
                  &nbsp;
                </td>
                {/* TODO */}
                <td className="td1 center">{tag.T2Text}</td>
                <td className="td1 center">{tag.T2Comment}</td>
                <td className="td1 center">
                  {c > 0 ? (
                    <A
                    // TODO
                    // ref={`edit_texts?page=1&query=&tag12=0&tag2=&tag1= . ${tag['T2ID']} . `}
                    >
                      {c}
                    </A>
                  ) : (
                    '0'
                  )}
                </td>
                <td className="td1 center">
                  {ca > 0 ? (
                    <A
                    // TODO
                    // ref={`edit_archivedtexts?page=1&query=&tag12=0&tag2=&tag1= . ${tag['T2ID']} . `}
                    >
                      {ca}
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
      {/* TODO */}
      {/*       
// <?php if( $pages > 1) { ?>
// <form name="form3" action="#">
// <table class="tab1" cellspacing={0} cellpadding={5}>
// <tr>
// <th class="th1" style={{whiteSpace:"nowrap"}}>
// <?php echo $recno; ?> Tag<?php echo ($recno==1?'':'s'); ?>
// </th><th class="th1" style={{whiteSpace:"nowrap"}}>
// <?php makePager ($currentpage, $pages, 'edit_texttags', 'form3', 2); ?>
// </th></tr></table>
// </form>
// <?php } ?> */}
    </>
  );
}

export function NewTextTag() {
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
                name="T2Text"
                data_info="Tag"
                value=""
                maxlength={20}
                size={20}
              />{' '}
              <img
                src="icn/status-busy.png"
                title="Field must not be empty"
                alt="Field must not be empty"
              />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Comment:</td>
            <td className="td1">
              <textarea
                className="textarea-noreturn checklength checkoutsidebmp"
                data_maxlength={200}
                data_info="Comment"
                name="T2Comment"
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
                onClick="{resetDirty(); location.href='edit_texttags.php';}"
              />
              <input type="submit" name="op" value="Save" />
            </td>
          </tr>
        </table>
      </form>
    </>
  );
}
export function EditTextTag({ chgID }: { chgID: number }) {
  const [{ tags2 }] = useData(['tags2']);
  const changingTag = tags2.find(({ T2ID }) => {
    return chgID === T2ID;
  });
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
        name="edittag"
        className="validate"
        action="<?php echo $_SERVER['PHP_SELF']; ?>#rec<?php echo $_REQUEST['chg']; ?>"
        method="post"
      >
        <input type="hidden" name="T2ID" value={changingTag?.T2ID} />
        <table className="tab3" cellSpacing={0} cellPadding={5}>
          <tr>
            <td className="td1 right">Tag:</td>
            <td className="td1">
              <input
                data_info="Tag"
                class="notempty setfocus noblanksnocomma checkoutsidebmp"
                type="text"
                name="T2Text"
                value={changingTag?.T2Text}
                maxlength={20}
                size={20}
              />{' '}
              <img
                src="icn/status-busy.png"
                title="Field must not be empty"
                alt="Field must not be empty"
              />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Comment:</td>
            <td className="td1">
              <textarea
                className="textarea-noreturn checklength checkoutsidebmp"
                data_maxlength={200}
                data_info="Comment"
                name="T2Comment"
                value={changingTag?.T2Comment}
                cols={40}
                rows={3}
              >
                {/* <?php echo tohtml($record['T2Comment']); ?> */}
              </textarea>
            </td>
          </tr>
          <tr>
            <td className="td1 right" colSpan={2}>
              <input
                type="button"
                value="Cancel"
                onClick="{resetDirty(); location.href='edit_texttags.php#rec<?php echo $_REQUEST['chg']; ?>'};"
              />
              <input type="submit" name="op" value="Change" />
            </td>
          </tr>
        </table>
      </form>
    </>
  );
}
