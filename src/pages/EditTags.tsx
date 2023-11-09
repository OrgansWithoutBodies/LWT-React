import { useRef } from 'react';
import { Icon } from '../Icon';
import { useData } from '../data/useAkita';
import { A } from '../nav/InternalLink';
import { useInternalNavigate } from '../nav/useInternalNav';
import { Header } from './Header';

export function EditTags({ query }: { query: string }): JSX.Element {
  const [{ tags }] = useData(['tags']);
  const restoreBackup = useRef();
  const navigate = useInternalNavigate();
  const queryRef = useRef<HTMLInputElement>();
  return (
    <>
      <body>
        <Header title="Backup/Restore/Empty Database" />

        <p>
          {/* TODO */}
          <A ref={`<?php echo _SERVER['PHP_SELF']; ?>?new=1`}>
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
                    navigate(`/edit_tags?page=${1}&query=`);
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
                  // TODO
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
              <th className="th1 clickable">Terms With Tag</th>
            </tr>
            {tags.map((tag) => {
              return (
                <tr>
                  {/* ' . checkTest(record['TgID'], 'marked') . ' */}
                  <td className="td1 center">
                    // TODO
                    <A name="rec' . record['TgID'] . '">
                      <input
                        name="marked[]"
                        type="checkbox"
                        className="markcheck"
                        value="' . record['TgID'] . '"
                      />
                    </A>
                  </td>
                  <td className="td1 center" style={{ whiteSpace: 'nowrap' }}>
                    &nbsp;
                    <A
                      // TODO
                      ref={`' . _SERVER['PHP_SELF'] . '?chg=' . record['TgID'] . '`}
                    >
                      <Icon src="document--pencil" title="Edit" />
                    </A>
                    &nbsp;{' '}
                    <A
                      className="confirmdelete"
                      // TODO
                      ref={`' . _SERVER['PHP_SELF'] . '?del=' . record['TgID'] . '`}
                    >
                      <Icon src="minus-button" title="Delete" />
                    </A>
                    &nbsp;
                  </td>
                  <td className="td1 center"> . tohtml(record['TgText']) . </td>
                  <td className="td1 center">
                    {' '}
                    . tohtml(record['TgComment']) .{' '}
                  </td>
                  <td className="td1 center">
                    {' '}
                    .
                    {c > 0 ? (
                      <A
                        href={`/edit_words?page=1&query=&text=&status=&filterlang=&status=&tag12=0&tag2=&tag1=`}
                      >
                        {' . c . '}
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
        {pages > 1 && (
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

        {/* <?php if( pages > 1) { ?>
<form name="form3" action="#">
<table className="tab1" cellspacing="0" cellpadding="5">
<tr>
<th className="th1" style={{whiteSpace:"nowrap"}}>
<?php echo recno; ?> Tag<?php echo (recno==1?'':'s'); ?>
</th><th className="th1" style={{whiteSpace:"nowrap"}}>
// <?php makePager (currentpage, pages, 'edit_tags', 'form3', 2); ?> */}
      </body>
    </>
  );
}
