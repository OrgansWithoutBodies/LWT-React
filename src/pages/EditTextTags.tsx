import { Icon } from '../Icon';
import { useData } from '../data/useAkita';
import { A } from '../nav/InternalLink';
import { useInternalNavigate } from '../nav/useInternalNav';
import { Header } from './Header';

export function EditTextTags({ query }: { query: string }) {
  const [{ texttags }] = useData(['texttags']);
  const navigate = useInternalNavigate();

  return (
    <>
      <Header title={'Edit Text Tags'} />
      <p>
        <A ref="<?php echo $_SERVER['PHP_SELF']; ?>?new=1">
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
          {texttags.map((tag) => {
            const c = get_first_value(
              'select count(*) as value from '
              // 'texttags where TtT2ID='.$record['T2ID']
            );
            const ca = get_first_value(
              'select count(*) as value from '
              // 'archtexttags where AgT2ID='.$record['T2ID']
            );
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
                  <A ref="' . $_SERVER['PHP_SELF'] . '?chg=' . $record['T2ID'] . '">
                    <Icon src={'document--pencil'} title="Edit" />
                  </A>
                  &nbsp;{' '}
                  <A
                    className="confirmdelete"
                    ref="' . $_SERVER['PHP_SELF'] . '?del=' . $record['T2ID'] . '"
                  >
                    <Icon src="minus-button" title="Delete" />
                  </A>
                  &nbsp;
                </td>
                {/* TODO */}
                <td className="td1 center"> . {tohtml($record['T2Text'])}</td>
                <td className="td1 center">
                  {' '}
                  {/* TODO */}. {tohtml($record['T2Comment'])}
                </td>
                <td className="td1 center">
                  {' '}
                  .{' '}
                  {c > 0 ? (
                    <A
                      ref={`edit_texts?page=1&query=&tag12=0&tag2=&tag1= . ${tag['T2ID']} . `}
                      // TODO
                    >
                      {' '}
                      {c}{' '}
                    </A>
                  ) : (
                    '0'
                  )}{' '}
                  .{' '}
                </td>
                <td className="td1 center">
                  {' '}
                  .{' '}
                  {ca > 0 ? (
                    <A
                      // TODO
                      ref={`edit_archivedtexts?page=1&query=&tag12=0&tag2=&tag1= . ${tag['T2ID']} . `}
                    >
                      {ca}
                    </A>
                  ) : (
                    '0'
                  )}{' '}
                  .{' '}
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
