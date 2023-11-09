import { useRef } from 'react';
import { Icon } from '../Icon';
import { useData } from '../data/useAkita';
import { useInternalNavigate } from '../nav/useInternalNav';
import { Header } from './Header';

export function EditArchivedTexts({ query }: { query: string }): JSX.Element {
  const [{ languages, activeLanguage, numArchivedTexts }] = useData([
    'languages',
    'activeLanguage',
    'numArchivedTexts',
  ]);
  const recno = numArchivedTexts;
  const navigate = useInternalNavigate();
  const queryRef = useRef<HTMLInputElement | undefined>();
  return (
    <>
      <body>
        <Header title={`My ${activeLanguage?.LgName} Text Archive`} />
        <p>&nbsp;</p>
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
                  // TODO
                  onClick="resetAll('edit_archivedtexts');"
                />
              </th>
            </tr>
            <tr>
              <td className="td1 center" colSpan={2}>
                Language:
                <select
                  name="filterlang"
                  // TODO
                  onChange="{setLang(document.form1.filterlang,'edit_archivedtexts');}"
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
                  // TODO
                  // onClick="{val=document.form1.query.value; location.href='edit_archivedtexts?page=1&query=' + val;}"
                  onClick={() =>
                    navigate(
                      `/edit_archivedtexts?page=1&query=${
                        queryRef.current?.value || ''
                      }`
                    )
                  }
                />
                &nbsp;
                <input
                  type="button"
                  value="Clear"
                  onClick={() => navigate(`/edit_archivedtexts?page=1&query=`)}
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
                  onChange={({ target: { value: val } }) =>
                    navigate(`/edit_archivedtexts?page=1&tag1=${val}`)
                  }
                >
                  {/* TODO */}
                  {/* <?php echo get_archivedtexttag_selectoptions($currenttag1,$currentlang); ?> */}
                </select>
              </td>
              <td className="td1 center" style={{ whiteSpace: 'nowrap' }}>
                Tag #1 ..{' '}
                <select
                  name="tag12"
                  onChange={({ target: { value: val } }) =>
                    navigate(`/edit_archivedtexts?page=1&tag12=${val}`)
                  }
                >
                  {/* <?php echo get_andor_selectoptions($currenttag12); ?> */}
                </select>{' '}
                .. Tag #2
              </td>
              <td className="td1 center" style={{ whiteSpace: 'nowrap' }}>
                Tag #2:
                <select
                  name="tag2"
                  onChange={({ target: { value: val } }) =>
                    navigate(`/edit_archivedtexts?page=1&tag2=${val}`)
                  }
                >
                  {/* TODO */}
                  {/* <?php echo get_archivedtexttag_selectoptions($currenttag2,$currentlang); ?> */}
                </select>
              </td>
            </tr>
            {/* TODO */}
            {/* <?php if(recno > 0) { ?>
<tr>
<th class="th1" style={{whiteSpace:"nowrap"}}>
<?php echo recno; ?> Text<?php echo (recno==1?'':'s'); ?>
</th>
<th class="th1" colspan={2} style={{whiteSpace:"nowrap"}}>
<?php makePager ($currentpage, $pages, 'edit_archivedtexts', 'form1', 1); ?>
</th>
<th class="th1" style={{whiteSpace:"nowrap"}}>
Sort Order:
<select name="sort" onchange="{val=document.form1.sort.options[document.form1.sort.selectedIndex].value; location.href='edit_archivedtexts?page=1&sort=' + val;}">
  <?php echo get_textssort_selectoptions($currentsort); ?>
</select>
</th></tr>
<?php } ?> */}
          </table>
        </form>
        {/* 
<?php
if (recno==0) {
?>
<p>No archived texts found.</p>
<?php
} else {
?> */}
        <form
          name="form2"
          // TODO
          action="<?php echo $_SERVER['PHP_SELF']; ?>"
          method="post"
        >
          <input type="hidden" name="data" value="" />
          <table className="tab1" cellSpacing={0} cellPadding={5}>
            <tr>
              <th className="th1" colSpan={2}>
                Multi Actions <Icon src="lightning" title="Multi Actions" />
              </th>
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
                Marked Texts:&nbsp;
                <select
                  name="markaction"
                  id="markaction"
                  disabled
                  // TODO
                  onChange="multiActionGo(document.form2, document.form2.markaction);"
                >
                  {/* TODO */}
                  {/* <?php echo get_multiplearchivedtextactions_selectoptions(); ?> */}
                </select>
              </td>
            </tr>
          </table>

          <table className="sortable tab1" cellSpacing={0} cellPadding={5}>
            <tr>
              <th className="th1 sorttable_nosort">Mark</th>
              <th className="th1 sorttable_nosort">Actions</th>
              {/* TODO */}
              {/* <?php if ($currentlang == '') echo '<th class="th1 clickable">Lang.</th>'; ?> */}
              <th className="th1 clickable">
                Title [Tags] / Audio:&nbsp;
                <Icon src="speaker-volume" title="With Audio" />
                , Src.Link:&nbsp;
                <Icon src="chain" title="Source Link available" />
                , Ann.Text:&nbsp;
                <Icon src="tick" title="Annotated Text available" />
              </th>
            </tr>
            {/* 
<?php

$sql = 'select AtID, AtTitle, LgName, AtAudioURI, AtSourceURI, length(AtAnnotatedText) as annotlen, ifnull(concat(\'[\',group_concat(distinct T2Text order by T2Text separator \', \'),\']\'),\'\') as taglist from ((' . $tbpref . 'archivedtexts left JOIN ' . $tbpref . 'archtexttags ON AtID = AgAtID) left join ' . $tbpref . 'tags2 on T2ID = AgT2ID), ' . $tbpref . 'languages where LgID=AtLgID ' . $wh_lang . $wh_query . ' group by AtID ' . $wh_tag . ' order by ' . $sorts[$currentsort-1] . ' ' . $limit;

if ($debug) echo $sql;
// TODO
$res = do_mysqli_query($sql);
while ($record = mysqli_fetch_assoc($res)) {
	echo '<tr>';
	echo '<td class="td1 center"><a name="rec' . $record['AtID'] . '"><input name="marked[]" class="markcheck"  type="checkbox" value="' . $record['AtID'] . '" ' . checkTest($record['AtID'], 'marked') . ' /></a></td>';
	echo '<td style={{whiteSpace:"nowrap"}} class="td1 center">&nbsp;<a href="' . $_SERVER['PHP_SELF'] . '?unarch=' . $record['AtID'] . '"><Icon iconName="inbox-upload.png" title="Unarchive" /></a>&nbsp; <a href="' . $_SERVER['PHP_SELF'] . '?chg=' . $record['AtID'] . '"><Icon iconName="document--pencil" title="Edit" /></a>&nbsp; <span class="click" onclick="if (confirmDelete()) location.href=\'' . $_SERVER['PHP_SELF'] . '?del=' . $record['AtID'] . '\';"><Icon src="icn/minus-button" title="Delete"  /></span>&nbsp;</td>';
	if ($currentlang == '') echo '<td class="td1 center">' . tohtml($record['LgName']) . '</td>';
	echo '<td class="td1 center">' . tohtml($record['AtTitle']) . ' <span class="smallgray2">' . tohtml($record['taglist']) . '</span> &nbsp;' . (isset($record['AtAudioURI']) ? '<Icon iconName="speaker-volume.png" title="With Audio" />' : '') . (isset($record['AtSourceURI']) ? ' <a href="' . $record['AtSourceURI'] . '" target="_blank"><Icon iconName="chain" title="Link to Text Source"  /></a>' : '') . ($record['annotlen'] ? ' <Icon src="icn/tick" title="Annotated Text available"  />' : '') . '</td>';
	echo '</tr>';
}
mysqli_free_result($res);

?> */}
          </table>
        </form>
        {/* TODO */}
        {/* 
<?php if( $pages > 1) { ?>
<form name="form3" action="#">
<table class="tab1" cellspacing={0} cellpadding={5}>
<tr>
<th class="th1" style={{whiteSpace:"nowrap"}}>
<?php echo recno; ?> Text<?php echo (recno==1?'':'s'); ?>
</th><th class="th1" style={{whiteSpace:"nowrap"}}>
<?php makePager ($currentpage, $pages, 'edit_archivedtexts', 'form3', 2); ?>
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
            onClick={() => navigate(`/edit_texts?query=&page=1`)}
          />
        </p>
      </body>
    </>
  );
}
