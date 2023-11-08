import { useData } from '../data/useAkita';
import { Header } from './Header';

export function EditArchivedTexts(): JSX.Element {
  const [{ languages, activeLanguage, numArchivedTexts }] = useData([
    'languages',
    'activeLanguage',
    'numArchivedTexts',
  ]);
  const recno = numArchivedTexts;
  return (
    <>
      <body>
        <Header title={`My ${activeLanguage?.LgName} Text Archive`} />
        <p>&nbsp;</p>

        <form
          name="form1"
          action="#"
          onSubmit="document.form1.querybutton.click(); return false;"
        >
          <table className="tab1" cellSpacing={0} cellPadding={5}>
            <tr>
              <th className="th1" colSpan={4}>
                Filter <img src="icn/funnel.png" title="Filter" alt="Filter" />
                &nbsp;
                <input
                  type="button"
                  value="Reset All"
                  onClick="resetAll('edit_archivedtexts.php');"
                />
              </th>
            </tr>
            <tr>
              <td className="td1 center" colSpan={2}>
                Language:
                <select
                  name="filterlang"
                  onChange="{setLang(document.form1.filterlang,'edit_archivedtexts.php');}"
                >
                  {languages.map((language) => {
                    return (
                      <option value={language.LgID}>{language.LgName}</option>
                    );
                  })}
                  {/* <?php	echo get_languages_selectoptions($currentlang,'[Filter off]'); ?> */}
                </select>
              </td>
              <td className="td1 center" colSpan={2}>
                Text Title (Wildc.=*):
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
                  onClick="{val=document.form1.query.value; location.href='edit_archivedtexts.php?page=1&query=' + val;}"
                />
                &nbsp;
                <input
                  type="button"
                  value="Clear"
                  onClick="{location.href='edit_archivedtexts.php?page=1&query=';}"
                />
              </td>
            </tr>
            <tr>
              <td
                className="td1 center"
                colSpan={2}
                style={{ whiteSpace: 'nowrap' }}
              >
                Tag #1:
                <select
                  name="tag1"
                  onChange="{val=document.form1.tag1.options[document.form1.tag1.selectedIndex].value; location.href='edit_archivedtexts.php?page=1&tag1=' + val;}"
                >
                  {/* <?php echo get_archivedtexttag_selectoptions($currenttag1,$currentlang); ?> */}
                </select>
              </td>
              <td className="td1 center" style={{ whiteSpace: 'nowrap' }}>
                Tag #1 ..{' '}
                <select
                  name="tag12"
                  onChange="{val=document.form1.tag12.options[document.form1.tag12.selectedIndex].value; location.href='edit_archivedtexts.php?page=1&tag12=' + val;}"
                >
                  {/* <?php echo get_andor_selectoptions($currenttag12); ?> */}
                </select>{' '}
                .. Tag #2
              </td>
              <td className="td1 center" style={{ whiteSpace: 'nowrap' }}>
                Tag #2:
                <select
                  name="tag2"
                  onChange="{val=document.form1.tag2.options[document.form1.tag2.selectedIndex].value; location.href='edit_archivedtexts.php?page=1&tag2=' + val;}"
                >
                  {/* <?php echo get_archivedtexttag_selectoptions($currenttag2,$currentlang); ?> */}
                </select>
              </td>
            </tr>
            {/* <?php if($recno > 0) { ?>
<tr>
<th class="th1" style={{whiteSpace:"nowrap"}}>
<?php echo $recno; ?> Text<?php echo ($recno==1?'':'s'); ?>
</th>
<th class="th1" colspan={2} style={{whiteSpace:"nowrap"}}>
<?php makePager ($currentpage, $pages, 'edit_archivedtexts.php', 'form1', 1); ?>
</th>
<th class="th1" style={{whiteSpace:"nowrap"}}>
Sort Order:
<select name="sort" onchange="{val=document.form1.sort.options[document.form1.sort.selectedIndex].value; location.href='edit_archivedtexts.php?page=1&sort=' + val;}">
  <?php echo get_textssort_selectoptions($currentsort); ?>
</select>
</th></tr>
<?php } ?> */}
          </table>
        </form>
        {/* 
<?php
if ($recno==0) {
?>
<p>No archived texts found.</p>
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
              <th className="th1" colSpan={2}>
                Multi Actions{' '}
                <img
                  src="icn/lightning.png"
                  title="Multi Actions"
                  alt="Multi Actions"
                />
              </th>
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
                Marked Texts:&nbsp;
                <select
                  name="markaction"
                  id="markaction"
                  disabled="disabled"
                  onchange="multiActionGo(document.form2, document.form2.markaction);"
                >
                  {/* <?php echo get_multiplearchivedtextactions_selectoptions(); ?> */}
                </select>
              </td>
            </tr>
          </table>

          <table className="sortable tab1" cellSpacing={0} cellPadding={5}>
            <tr>
              <th className="th1 sorttable_nosort">Mark</th>
              <th className="th1 sorttable_nosort">Actions</th>
              {/* <?php if ($currentlang == '') echo '<th class="th1 clickable">Lang.</th>'; ?> */}
              <th className="th1 clickable">
                Title [Tags] / Audio:&nbsp;
                <img
                  src="icn/speaker-volume.png"
                  title="With Audio"
                  alt="With Audio"
                />
                , Src.Link:&nbsp;
                <img
                  src="icn/chain.png"
                  title="Source Link available"
                  alt="Source Link available"
                />
                , Ann.Text:&nbsp;
                <img
                  src="icn/tick.png"
                  title="Annotated Text available"
                  alt="Annotated Text available"
                />
              </th>
            </tr>
            {/* 
<?php

$sql = 'select AtID, AtTitle, LgName, AtAudioURI, AtSourceURI, length(AtAnnotatedText) as annotlen, ifnull(concat(\'[\',group_concat(distinct T2Text order by T2Text separator \', \'),\']\'),\'\') as taglist from ((' . $tbpref . 'archivedtexts left JOIN ' . $tbpref . 'archtexttags ON AtID = AgAtID) left join ' . $tbpref . 'tags2 on T2ID = AgT2ID), ' . $tbpref . 'languages where LgID=AtLgID ' . $wh_lang . $wh_query . ' group by AtID ' . $wh_tag . ' order by ' . $sorts[$currentsort-1] . ' ' . $limit;

if ($debug) echo $sql;

$res = do_mysqli_query($sql);
while ($record = mysqli_fetch_assoc($res)) {
	echo '<tr>';
	echo '<td class="td1 center"><a name="rec' . $record['AtID'] . '"><input name="marked[]" class="markcheck"  type="checkbox" value="' . $record['AtID'] . '" ' . checkTest($record['AtID'], 'marked') . ' /></a></td>';
	echo '<td style={{whiteSpace:"nowrap"}} class="td1 center">&nbsp;<a href="' . $_SERVER['PHP_SELF'] . '?unarch=' . $record['AtID'] . '"><img src="icn/inbox-upload.png" title="Unarchive" alt="Unarchive" /></a>&nbsp; <a href="' . $_SERVER['PHP_SELF'] . '?chg=' . $record['AtID'] . '"><img src="icn/document--pencil.png" title="Edit" alt="Edit" /></a>&nbsp; <span class="click" onclick="if (confirmDelete()) location.href=\'' . $_SERVER['PHP_SELF'] . '?del=' . $record['AtID'] . '\';"><img src="icn/minus-button.png" title="Delete" alt="Delete" /></span>&nbsp;</td>';
	if ($currentlang == '') echo '<td class="td1 center">' . tohtml($record['LgName']) . '</td>';
	echo '<td class="td1 center">' . tohtml($record['AtTitle']) . ' <span class="smallgray2">' . tohtml($record['taglist']) . '</span> &nbsp;' . (isset($record['AtAudioURI']) ? '<img src="icn/speaker-volume.png" title="With Audio" alt="With Audio" />' : '') . (isset($record['AtSourceURI']) ? ' <a href="' . $record['AtSourceURI'] . '" target="_blank"><img src="icn/chain.png" title="Link to Text Source" alt="Link to Text Source" /></a>' : '') . ($record['annotlen'] ? ' <img src="icn/tick.png" title="Annotated Text available" alt="Annotated Text available" />' : '') . '</td>';
	echo '</tr>';
}
mysqli_free_result($res);

?> */}
          </table>
        </form>
        {/* 
<?php if( $pages > 1) { ?>
<form name="form3" action="#">
<table class="tab1" cellspacing={0} cellpadding={5}>
<tr>
<th class="th1" style={{whiteSpace:"nowrap"}}>
<?php echo $recno; ?> Text<?php echo ($recno==1?'':'s'); ?>
</th><th class="th1" style={{whiteSpace:"nowrap"}}>
<?php makePager ($currentpage, $pages, 'edit_archivedtexts.php', 'form3', 2); ?>
</th></tr></table>
</form>
<?php } ?>

<?php

}

?> */}

        <p>
          <input
            type="button"
            value="Active Texts"
            onClick="location.href='edit_texts.php?query=&page=1';"
          />
        </p>

        {/* <?php

}

pageend();

?> */}
      </body>
    </>
  );
}
