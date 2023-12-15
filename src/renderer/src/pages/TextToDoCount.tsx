import { TextsId } from '../data/validators';
import { useData } from '../hooks/useData';
import { Text } from '../utils/parseMySqlDump';

/**
 *
 * @param t
 */
function iknowall(t: TextsId, onSetAllKnown: (t: TextsId) => void) {
  const answer = confirm('Are you sure?');
  if (answer) {
    onSetAllKnown(t);
  }
  // top.frames['ro'].location.href = 'all_words_wellknown.php?text=' + t;
}

// TODO
// $langid = get_first_value("select TxLgID as value from " . $tbpref . "texts where TxID = " . $_REQUEST['text']);

// pagestart("Setting all blue words to Well-known", false);

// $sql = 'select distinct TiText, TiTextLC from (' . $tbpref . 'textitems left join ' . $tbpref . 'words on (TiTextLC = WoTextLC) and (TiLgID = WoLgID)) where TiIsNotWord = 0 and WoID is null and TiWordCount = 1 and TiTxID = ' . $_REQUEST['text'] . ' order by TiOrder';
// $res = do_mysqli_query($sql);
// $count = 0;
// $javascript = "var title='';";
// while ($record = mysqli_fetch_assoc($res)) {
// 	$term = $record['TiText'];
// 	$termlc = $record['TiTextLC'];
// 	$count1 = 0 + runsql('insert into ' . $tbpref . 'words (WoLgID, WoText, WoTextLC, WoStatus, WoStatusChanged,' . make_score_random_insert_update('iv') . ') values( ' .
// 		$langid . ', ' .
// 		convert_string_to_sqlsyntax($term) . ', ' .
// 		convert_string_to_sqlsyntax($termlc) . ', 99 , NOW(), ' .
// 		make_score_random_insert_update('id') . ')', '');
// 	$wid = get_last_key();
// 	if ($count1 > 0)
// 		$javascript .= "title = makeTooltipTitle(" . prepare_textdata_js($term) . ",'*','','99');";
// 	$javascript .= "$('.TERM" . strToClassName($termlc) . "', context).removeClass('status0').addClass('status99 word" . $wid . "').attr('data_status','99').attr('data_wid','" . $wid . "').attr('title',title);";
// 	$count += $count1;
// }
// mysqli_free_result($res);

// echo "<p>OK, you know all " . $count . " word(s) well!</p>";

// ?>
// <script type="text/javascript">
// 	//<![CDATA[
// 	var context = window.parent.frames['l'].document;
// 	var contexth = window.parent.frames['h'].document;
// 	<?php echo $javascript; ?>
// 	$('#learnstatus', contexth).html('<?php echo texttodocount2($_REQUEST['text']); ?>');
// 	window.parent.frames['l'].setTimeout('cClick()', 1000);
// 	//]]>
// </script>
// <?php

// pageend();

// ?>
/**
 *
 * @param text
 */
export function TextToDoCount({ text }: { text: Text }): JSX.Element {
  const onSetAllKnown = () => {
    window.alert('TODO ALL KNOWN');
  };
  const [{ textitems, words }] = useData(['textitems', 'words']);
  const textItemsForThisText = textitems.filter(
    (val) =>
      val.TiLgID === text.TxLgID &&
      val.TiIsNotWord === 0 &&
      val.TiTxID === text.TxID &&
      val.TiWordCount === 1
  ).length;
  const wordsForThisText = words.filter(
    (val) => val.WoLgID === text.TxLgID
  ).length;
  const c = wordsForThisText - textItemsForThisText;
  return (
    <>
      {c > 0 ? (
        <>
          <span title="To Do" className="status0">
            &nbsp;{c}&nbsp;
          </span>
          <>
            &nbsp;&nbsp;&nbsp;
            <input
              type="button"
              onClick={() => iknowall(text.TxID, onSetAllKnown)}
              value=" I KNOW ALL "
            />
          </>
        </>
      ) : (
        <>
          <span title="To Do" className="status0">
            &nbsp;{c}&nbsp;
          </span>
        </>
      )}
    </>
  );
}
