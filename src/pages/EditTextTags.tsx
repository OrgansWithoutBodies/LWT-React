import { Icon } from '../Icon';
import { useData } from '../data/useAkita';
import { Header } from './Header';

export function EditTextTags() {
  const [{ texttags }] = useData(['texttags']);
  return (
    <>
      <Header title={'Edit Text Tags'} />
      <p>
        <a href="<?php echo $_SERVER['PHP_SELF']; ?>?new=1">
          <img src="icn/plus-button.png" title="New" alt="New" /> New Text Tag
          ...
        </a>
      </p>

      <form
        name="form1"
        action="#"
        onSubmit="document.form1.querybutton.click(); return false;"
      >
        <table className="tab1" cellspacing="0" cellpadding="5">
          <tr>
            <th className="th1" colspan="4">
              Filter <img src="icn/funnel.png" title="Filter" alt="Filter" />
              &nbsp;
              <input
                type="button"
                value="Reset All"
                onClick="{location.href='edit_texttags.php?page=1&query=';}"
              />
            </th>
          </tr>
          <tr>
            <td className="td1 center" colspan="4">
              Tag Text or Comment:
              <input
                type="text"
                name="query"
                value="<?php echo tohtml($currentquery); ?>"
                maxlength="50"
                size="15"
              />
              &nbsp;
              <input
                type="button"
                name="querybutton"
                value="Filter"
                onClick="{val=document.form1.query.value; location.href='edit_texttags.php?page=1&query=' + val;}"
              />
              &nbsp;
              <input
                type="button"
                value="Clear"
                onClick="{location.href='edit_texttags.php?page=1&query=';}"
              />
            </td>
          </tr>
          {/* <?php if($recno > 0) { ?>
<tr>
<th class="th1" colspan="1" style={{whiteSpace:"nowrap"}}>
<?php echo $recno; ?> Tag<?php echo ($recno==1?'':'s'); ?>
</th><th class="th1" colspan="2" style={{whiteSpace:"nowrap"}}>
<?php makePager ($currentpage, $pages, 'edit_texttags.php', 'form1', 1); ?>
</th><th class="th1" style={{whiteSpace:"nowrap"}}>
Sort Order:
<select name="sort" onchange="{val=document.form1.sort.options[document.form1.sort.selectedIndex].value; location.href='edit_texttags.php?page=1&sort=' + val;}"><?php echo get_tagsort_selectoptions($currentsort); ?></select>
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
        <table className="tab1" cellspacing="0" cellpadding="5">
          <tr>
            <th className="th1 center" colspan="2">
              Multi Actions{' '}
              <img
                src="icn/lightning.png"
                title="Multi Actions"
                alt="Multi Actions"
              />
            </th>
          </tr>
          <tr>
            <td className="td1 center" colspan="2">
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
                onClick="selectToggle(true,'form2');"
              />
              <input
                type="button"
                value="Mark None"
                onClick="selectToggle(false,'form2');"
              />
            </td>
            <td className="td1 center">
              Marked Tags:&nbsp;
              <select
                name="markaction"
                id="markaction"
                disabled="disabled"
                onchange="multiActionGo(document.form2, document.form2.markaction);"
              >
                {/* <?php echo get_multipletagsactions_selectoptions(); ?> */}
              </select>
            </td>
          </tr>
        </table>

        <table className="sortable tab1" cellspacing="0" cellpadding="5">
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
              'select count(*) as value from ',
              'texttags where TtT2ID='.$record['T2ID']
            );
            const ca = get_first_value(
              'select count(*) as value from ',
              'archtexttags where AgT2ID='.$record['T2ID']
            );
            return (
              <tr>
                {/* TODO */}
                {/*  ' . checkTest($record['T2ID'], 'marked') . ' */}
                <td className="td1 center">
                  <a name="rec' . $record['T2ID'] . '">
                    <input
                      name="marked[]"
                      type="checkbox"
                      className="markcheck"
                      value="' . $record['T2ID'] . '"
                    />
                  </a>
                </td>
                <td className="td1 center" style={{ whiteSpace: 'nowrap' }}>
                  &nbsp;
                  <a href="' . $_SERVER['PHP_SELF'] . '?chg=' . $record['T2ID'] . '">
                    <Icon
                      iconName={'document--pencil'}
                      title="Edit"
                      alt="Edit"
                    />
                  </a>
                  &nbsp;{' '}
                  <a
                    className="confirmdelete"
                    href="' . $_SERVER['PHP_SELF'] . '?del=' . $record['T2ID'] . '"
                  >
                    <Icon iconName="minus-button" title="Delete" alt="Delete" />
                  </a>
                  &nbsp;
                </td>
                <td className="td1 center"> . {tohtml($record['T2Text'])}</td>
                <td className="td1 center">
                  {' '}
                  . {tohtml($record['T2Comment'])}
                </td>
                <td className="td1 center">
                  {' '}
                  .{' '}
                  {c > 0 ? (
                    <a
                      href={`edit_texts.php?page=1&query=&tag12=0&tag2=&tag1= . ${tag['T2ID']} . `}
                    >
                      {' '}
                      {c}{' '}
                    </a>
                  ) : (
                    '0'
                  )}{' '}
                  .{' '}
                </td>
                <td className="td1 center">
                  {' '}
                  .{' '}
                  {ca > 0 ? (
                    <a
                      href={`edit_archivedtexts.php?page=1&query=&tag12=0&tag2=&tag1= . ${tag['T2ID']} . `}
                    >
                      {' '}
                      {ca}{' '}
                    </a>
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
      {/* 
// <?php if( $pages > 1) { ?>
// <form name="form3" action="#">
// <table class="tab1" cellspacing="0" cellpadding="5">
// <tr>
// <th class="th1" style={{whiteSpace:"nowrap"}}>
// <?php echo $recno; ?> Tag<?php echo ($recno==1?'':'s'); ?>
// </th><th class="th1" style={{whiteSpace:"nowrap"}}>
// <?php makePager ($currentpage, $pages, 'edit_texttags.php', 'form3', 2); ?>
// </th></tr></table>
// </form>
// <?php } ?>

// <?php
// }

// }

// pageend();

// ?> */}
    </>
  );
}
