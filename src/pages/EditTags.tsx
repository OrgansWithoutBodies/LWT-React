import { useRef } from 'react';
import { useData } from '../data/useAkita';
import { Header } from './Header';

export function EditTags(): JSX.Element {
  const [,] = useData([]);
  const restoreBackup = useRef();
  return (
    <>
      <body>
        <Header title="Backup/Restore/Empty Database" />

        <p>
          <a href="<?php echo $_SERVER['PHP_SELF']; ?>?new=1">
            <img src="icn/plus-button.png" title="New" alt="New" /> New Term Tag
            ...
          </a>
        </p>

        <form
          name="form1"
          action="#"
          // onSubmit="document.form1.querybutton.click(); return false;"
        >
          <table className="tab1" cellSpacing="0" cellPadding="5">
            <tr>
              <th className="th1" colSpan={4}>
                Filter <img src="icn/funnel.png" title="Filter" alt="Filter" />
                &nbsp;
                <input
                  type="button"
                  value="Reset All"
                  // onClick="{location.href='edit_tags.php?page=1&amp;query=';}"
                />
              </th>
            </tr>
            <tr>
              <td className="td1 center" colSpan={4}>
                Tag Text or Comment:
                <input
                  type="text"
                  name="query"
                  value="<?php echo tohtml($currentquery); ?>"
                  maxLength={50}
                  size={15}
                />
                &nbsp;
                <input
                  type="button"
                  name="querybutton"
                  value="Filter"
                  // onClick="{val=document.form1.query.value; location.href='edit_tags.php?page=1&amp;query=' + val;}"
                />
                &nbsp;
                <input
                  type="button"
                  value="Clear"
                  // onClick="{location.href='edit_tags.php?page=1&amp;query=';}"
                />
              </td>
            </tr>
            {/* <?php if($recno > 0) { ?>
<tr>
<th className="th1" colSpan={1} nowrap="nowrap">
<?php echo $recno; ?> Tag<?php echo ($recno==1?'':'s'); ?>
</th><th className="th1" colSpan={2} nowrap="nowrap">
<?php makePager ($currentpage, $pages, 'edit_tags.php', 'form1', 1); ?>
</th><th className="th1" nowrap="nowrap">
Sort Order:
<select name="sort" onChange="{val=document.form1.sort.options[document.form1.sort.selectedIndex].value; location.href='edit_tags.php?page=1&amp;sort=' + val;}"><?php echo get_tagsort_selectoptions($currentsort); ?></select>
</th></tr>
<?php } ?> */}
          </table>
        </form>

        {/* <?php
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
          <table className="tab1" cellSpacing="0" cellPadding="5">
            <tr>
              <th className="th1 center" colSpan={2}>
                Multi Actions{' '}
                <img
                  src="icn/lightning.png"
                  title="Multi Actions"
                  alt="Multi Actions"
                />
              </th>
            </tr>
            <tr>
              <td className="td1 center" colSpan={2}>
                <b>ALL</b>
                {/* <?php echo ($recno == 1 ? '1 Tag' : $recno . ' Tags'); ?>:&nbsp;  */}
                <select
                  name="allaction"
                  // onChange="allActionGo(document.form2, document.form2.allaction,<?php echo $recno; ?>);"
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
                  // onClick="selectToggle(true,'form2');"
                />
                <input
                  type="button"
                  value="Mark None"
                  // onClick="selectToggle(false,'form2');"
                />
              </td>
              <td className="td1 center">
                Marked Tags:&nbsp;
                <select
                  name="markaction"
                  id="markaction"
                  disabled
                  // onChange="multiActionGo(document.form2, document.form2.markaction);"
                >
                  {/* <?php echo get_multipletagsactions_selectoptions(); ?> */}
                </select>
              </td>
            </tr>
          </table>

          <table className="sortable tab1" cellSpacing="0" cellPadding="5">
            <tr>
              <th className="th1 sorttable_nosort">Mark</th>
              <th className="th1 sorttable_nosort">Actions</th>
              <th className="th1 clickable">Tag Text</th>
              <th className="th1 clickable">Tag Comment</th>
              <th className="th1 clickable">Terms With Tag</th>
            </tr>
            {/* 
<?php

$sql = 'select TgID, TgText, TgComment from ' . $tbpref . 'tags where (1=1) ' . $wh_query . ' order by ' . $sorts[$currentsort-1] . ' ' . $limit;
if ($debug) echo $sql;
$res = do_mysqli_query($sql);
while ($record = mysqli_fetch_assoc($res)) {
	$c = get_first_value('select count(*) as value from ' . $tbpref . 'wordtags where WtTgID=' . $record['TgID']);
	echo '<tr>';
	echo '<td className="td1 center"><a name="rec' . $record['TgID'] . '"><input name="marked[]" type="checkbox" className="markcheck" value="' . $record['TgID'] . '" ' . checkTest($record['TgID'], 'marked') . ' /></a></td>';
	echo '<td className="td1 center" nowrap="nowrap">&nbsp;<a href="' . $_SERVER['PHP_SELF'] . '?chg=' . $record['TgID'] . '"><img src="icn/document--pencil.png" title="Edit" alt="Edit" /></a>&nbsp; <a className="confirmdelete" href="' . $_SERVER['PHP_SELF'] . '?del=' . $record['TgID'] . '"><img src="icn/minus-button.png" title="Delete" alt="Delete" /></a>&nbsp;</td>';
	echo '<td className="td1 center">' . tohtml($record['TgText']) . '</td>';
	echo '<td className="td1 center">' . tohtml($record['TgComment']) . '</td>';
	echo '<td className="td1 center">' . ($c > 0 ? '<a href="edit_words.php?page=1&amp;query=&amp;text=&amp;status=&amp;filterlang=&amp;status=&amp;tag12=0&amp;tag2=&amp;tag1=' . $record['TgID'] . '">' . $c . '</a>' : '0' ) . '</td>';
	echo '</tr>';
}
mysqli_free_result($res);

?> */}
          </table>
        </form>

        {/* <?php if( $pages > 1) { ?>
<form name="form3" action="#">
<table className="tab1" cellspacing="0" cellpadding="5">
<tr>
<th className="th1" nowrap="nowrap">
<?php echo $recno; ?> Tag<?php echo ($recno==1?'':'s'); ?>
</th><th className="th1" nowrap="nowrap">
<?php makePager ($currentpage, $pages, 'edit_tags.php', 'form3', 2); ?> */}
      </body>
    </>
  );
}
