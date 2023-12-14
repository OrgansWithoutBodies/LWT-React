import { TextsId } from '../../data/validators';
import { useInternalNavigate } from '../../hooks/useInternalNav';
import { Header } from '../../ui-kit/Header';
import { Icon } from '../../ui-kit/Icon';
export function AnnotateText({
  textid,
  editmode: editmode,
}: {
  textid: TextsId;
  editmode: boolean;
}) {
  // const delmode = getreq('del');
  // const delmode = (delmode === '' ? 0 : (delmode+0));
  // const ann = get_first_value("select TxAnnotatedText as value from " . tbpref . "texts where TxID = " . textid);
  // const ann_exists = (strlen(ann) > 0);
  // if (ann_exists) {
  // 	const ann = recreate_save_ann(textid, ann);
  // 	const ann_exists = (strlen(ann) > 0);
  // }

  // if(textid==0) {
  // 	Header("Location: edit_texts.php");
  // 	xit();
  // }

  // if ( delmode ) {  // Delete
  // 	if ( ann_exists ) const dummy = runsql('update ' . tbpref . 'texts set ' .
  // 			'TxAnnotatedText = ' . ("") . ' where TxID = ' . textid, "");
  // 	const ann_exists = ((get_first_value("select length(TxAnnotatedText) as value from " . tbpref . "texts where TxID = " . textid) + 0) > 0);
  // 	if ( ! ann_exists ) {
  // 		header("Location: print_text.php?text=" . textid);
  // 		xit();
  // 	}
  // }

  // const sql = 'select TxLgID, TxTitle, TxAudioURI, TxSourceURI from ' . tbpref . 'texts where TxID = ' . textid;
  // const res = do_mysqli_query(sql);
  // const record = mysqli_fetch_assoc(res);
  // const title = record['TxTitle'];
  // const sourceURI = record['TxSourceURI'];
  // const langid = record['TxLgID'];
  // const audio = record['TxAudioURI'];
  // if(! isset(audio)) {const audio='';}
  // const audio = trim(audio);

  // const sql = 'select LgTextSize, LgRemoveSpaces, LgRightToLeft from ' . tbpref . 'languages where LgID = ' . langid;
  // const res = do_mysqli_query(sql);
  // const record = mysqli_fetch_assoc(res);
  // const textsize = record['LgTextSize'];
  // const removeSpaces = record['LgRemoveSpaces'];
  // const rtlScript = record['LgRightToLeft'];

  // saveSetting('currenttext',textid);

  // pagestart_nobody('Annotated Text');
  const navigator = useInternalNavigate();
  return (
    <div className="noprint">
      <h4>
        <Header title={'TODO'} />
        <a href="edit_texts.php" target="_top">
          LWT
        </a>
        &nbsp; | &nbsp; quickMenu(); echo getPreviousAndNextTextLinks(textid,
        'print_impr_text.php?text=', TRUE, '&nbsp; | &nbsp;'); &nbsp; | &nbsp;
        <a href="do_text.php?start=' . textid . '" target="_top">
          <Icon src="book-open-bookmark" title="Read" />
        </a>{' '}
        &nbsp;
        <a href="do_test.php?text=' . textid . '" target="_top">
          <Icon src="question-balloon" title="Test" />
        </a>{' '}
        &nbsp;
        <a href="print_text.php?text=' . textid . '" target="_top">
          <Icon src="printer" title="Print" />{' '}
        </a>
        &nbsp;
        <a target="_top" href="edit_texts.php?chg=' . textid . '">
          <Icon src="document--pencil" title="Edit Text" />
        </a>
      </h4>
      <h3>
        ANN.TEXT&nbsp;▶ ' . tohtml(title) . (isset(sourceURI) ? '{' '}
        <a href="' . sourceURI . '" target="_blank">
          <Icon src="chain" title="Text Source" />
        </a>
        ' : '') . '
      </h3>

      <p id="printoptions">
        <b>Improved Annotated Text</b>
        {editmode ? (
          <>
            <b>(Edit Mode)</b>
            <Icon
              src="question-frame"
              title="Help"
              className="click"
              onClick={() => navigator('/info#il')}
            />
            <br />
            <input
              type="button"
              value="Display/Print Mode"
              onClick={() => navigator('/print_impr_text?text=')}
            />
          </>
        ) : (
          <>
            <b>(Display/Print Mode)</b>
            <br />
            <input
              type="button"
              value="Edit"
              onClick={() =>
                navigator(`/print_impr_text?edit=1&text=${textid}`)
              }
            ></input>
          </>
        )}
        &nbsp; | &nbsp;
        <input
          type="button"
          value="Delete"
          onClick={() => {
            if (window.confirm('Are you sure?')) {
              navigator(`/print_impr_text?del=1&text=${textid}`);
            }
          }}
        />
        &nbsp; | &nbsp;
        <input type="button" value="Print" onClick={() => window.print()} />
        &nbsp; | &nbsp;
        <input
          type="button"
          value="Display"
          // TODO
          //  . ((audio !== '') ? ' with Audio Player' : '') . " in new Window"
          onClick={() => navigator(`/display_impr_text?text=${textid}`)}
        />
      </p>
    </div>
  );
}
{
  /* <!-- noprint --> */
}
{
  /* 
  export function DisplayAnnotatedText(){}
  if ( editmode ) {  // Edit Mode

    if ( ! ann_exists ) {  // No Ann., Create...
      const ann = create_save_ann(textid);
      const ann_exists = (strlen(ann) > 0);
    }
    
    if ( ! ann_exists ) {  // No Ann., not possible
      <p>No annotated text found, and creation seems not possible.</p>
    } else { // Ann. exists, set up for editing.
      \n
  ?>
  <?php
      <div const data_id="' . textid . '" const id="editimprtextdata"></div>
      \n
  ?>
    <script type="text/javascript">
    //<![CDATA[
    $(document).ready( function() {
    do_ajax_edit_impr_text(0,'');
    } ); 
    //]]>
    </script>
  <?php
    }
    <div className="noprint"><input type="button" value="Display/Print Mode" onClick="location.href=\'print_impr_text.php?text=' . textid . '\';" /></div>

  }

  else {  // Print Mode

    <div id="print"" . (rtlScript ? ' dir="rtl"' : '') . ">
    
    <p style="font-size:' . textsize . '%;line-height: 1.35; margin-bottom: 10px; ">' . tohtml(title) . '<br /><br />
    
    items = preg_split('/[\n]/u', ann);
    
    foreach (items as item) {
      vals = preg_split('/[\t]/u', item);
      if (vals[0] > -1) {
        trans = '';
        if (count(vals) > 3) trans = vals[3];
        if (trans === '*') trans = vals[1] . " "; // <- U+200A HAIR SPACE
        <ruby><rb><span className="anntermruby">' . tohtml(vals[1]) . '</span></rb><rt><span className="anntransruby2">' . tohtml(trans) . '</span></rt></ruby> 
      } else {
        if (count(vals) >= 2) 
          echo str_replace(
          "¶",
          '</p><p style="font-size:' . textsize . '%;line-height: 1.3; margin-bottom: 10px;">',
          " " . tohtml(vals[1]) . " ");
      }
    }
    
    </p></div>

  }

  pageend();

  ?> */
}
