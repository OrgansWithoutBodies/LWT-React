import { useRef, useState } from 'react';
import { Icon } from '../Icon';
import { dataService } from '../data/data.service';
import { useData } from '../data/useAkita';
import { LanguagesId } from '../data/validators';
import { useInternalNavigate } from '../nav/useInternalNav';
import { LanguageDropdown } from '../ui-kit/LanguageDropdown';
import { Pager } from '../ui-kit/Pager';
import { usePager } from '../usePager';
import { Header } from './Header';
import { useSelection } from './useSelection';
import { confirmDelete, get_archivedtexttag_selectoptions } from './utils';

export function EditArchivedTexts({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}): JSX.Element {
  const [{ languages, activeLanguage, numArchivedTexts, archivedtexts }] =
    useData([
      'languages',
      'activeLanguage',
      'numArchivedTexts',
      'archivedtexts',
    ]);
  const pageSize = 15;

  const [filterLanguageID, setFilterLanguage] = useState<LanguagesId | null>(
    activeLanguage ? activeLanguage.LgID : null
  );

  // const filterLanguage = languages.map((lang) => {
  //   return lang.LgID === filterLanguageID;
  // });
  const filteredTexts =
    filterLanguageID !== null
      ? archivedtexts.filter(({ AtLgID }) => {
          return AtLgID === filterLanguageID;
        })
      : archivedtexts;
  const { dataOnPage, numPages } = usePager(
    filteredTexts,
    currentPage,
    pageSize
  );
  const recno = numArchivedTexts;
  const navigate = useInternalNavigate();
  const { onSelectAll, onSelectNone, checkboxPropsForEntry, selectedValues } =
    useSelection(archivedtexts, 'AtID');
  const queryRef = useRef<HTMLInputElement | undefined>();
  return (
    <>
      <Header title={`My ${activeLanguage?.LgName} Text Archive`} />
      <p>&nbsp;</p>
      <form name="form1">
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
              <LanguageDropdown
                onChange={(val) => {
                  if (val === -1) {
                    setFilterLanguage(null);
                  } else {
                    setFilterLanguage(val);
                  }
                }}
              />
              {/* <?php	echo get_languages_selectoptions($currentlang,'[Filter off]'); ?> */}
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
                onClick={() => navigate(`/edit_archivedtexts`)}
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
                  // TODO paramUpdater
                  navigate(`/edit_archivedtexts?tag1=${val}`)
                }
              >
                {get_archivedtexttag_selectoptions('', '')}
                {/* TODO */}
                {/* <?php echo get_archivedtexttag_selectoptions($currenttag1,$currentlang); ?> */}
              </select>
            </td>
            <td className="td1 center" style={{ whiteSpace: 'nowrap' }}>
              Tag #1 ..
              <select
                name="tag12"
                onChange={({ target: { value: val } }) =>
                  navigate(`/edit_archivedtexts?tag12=${val}`)
                }
              >
                {/* <?php echo get_andor_selectoptions($currenttag12); ?> */}
              </select>
              .. Tag #2
            </td>
            <td className="td1 center" style={{ whiteSpace: 'nowrap' }}>
              Tag #2:
              <select
                name="tag2"
                onChange={({ target: { value: val } }) =>
                  // TODO paramUpdater
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
              <input type="button" value="Mark All" onClick={onSelectAll} />
              <input type="button" value="Mark None" onClick={onSelectNone} />
            </td>
            <td className="td1 center">
              Marked Texts:&nbsp;
              <select
                name="markaction"
                id="markaction"
                disabled={selectedValues.size === 0}
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
            {filterLanguageID === null && (
              <>
                {/* TODO */}
                <th className="th1 clickable">Lang.</th>
              </>
            )}
            {/* <?php if ($currentlang == '') echo <th class="th1 clickable">Lang.</th>; ?> */}
            <th className="th1 clickable">
              Title [Tags] / Audio:&nbsp;
              <Icon src="speaker-volume" title="With Audio" />
              , Src.Link:&nbsp;
              <Icon src="chain" title="Source Link available" />
              , Ann.Text:&nbsp;
              <Icon src="tick" title="Annotated Text available" />
            </th>
          </tr>
          {dataOnPage.map((text) => {
            const languageForLine = languages.find(
              (lang) => lang.LgID === text.AtLgID
            );
            return (
              <>
                <tr>
                  <td className="td1 center">
                    <a name="rec' . $record['AtID'] . '">
                      <input
                        name="marked[]"
                        className="markcheck"
                        type="checkbox"
                        {...checkboxPropsForEntry(text)}
                        value="' . $record['AtID'] . '"
                      />
                    </a>
                  </td>
                  {/* ' . checkTest($record['AtID'], 'marked') . '  */}
                  <td style={{ whiteSpace: 'nowrap' }} className="td1 center">
                    &nbsp;
                    <a href="' . $_SERVER['PHP_SELF'] . '?unarch=' . $record['AtID'] . '">
                      <Icon src="inbox-upload" title="Unarchive" />
                    </a>
                    &nbsp;
                    <a href="' . $_SERVER['PHP_SELF'] . '?chg=' . $record['AtID'] . '">
                      <Icon src="document--pencil" title="Edit" />
                    </a>
                    &nbsp;
                    <span
                      className="click"
                      // onClick="if (confirmDelete()) location.href=\'' . $_SERVER['PHP_SELF'] . '?del=' . $record['AtID'] . '\';"
                      // TODO del url pattern uniformly?
                      onClick={() => {
                        if (confirmDelete()) {
                          dataService.deleteArchivedText(text.AtID);
                        }
                      }}
                    >
                      <Icon src="minus-button" title="Delete" />
                    </span>
                    &nbsp;
                  </td>
                  {filterLanguageID === null && (
                    <>
                      <td className="td1 center">{languageForLine?.LgName}</td>
                    </>
                  )}
                  <td className="td1 center">
                    {text.AtTitle}
                    <span className="smallgray2">
                      {/* . tohtml($record['taglist']) . */}
                    </span>
                    {text.AtAudioURI && (
                      <Icon src="speaker-volume" title="With Audio" />
                    )}
                    {text.AtSourceURI && (
                      <a href="' . $record['AtSourceURI'] . '" target="_blank">
                        <Icon src="chain" title="Link to Text Source" />
                      </a>
                    )}
                    {text.AtAnnotatedText && (
                      <Icon src="tick" title="Annotated Text available" />
                    )}
                  </td>
                </tr>
              </>
            );
          })}
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
`
<?php

}

?> */}
      <Pager currentPage={currentPage} numPages={numPages} />
      <p>
        <input
          type="button"
          value="Active Texts"
          onClick={() => navigate(`/edit_texts?query=&page=1`)}
        />
      </p>
    </>
  );
}