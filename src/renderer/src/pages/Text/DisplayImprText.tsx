import { useState } from 'react';
import SplitPane from 'react-split-pane';
import { SettingSpec, settingSpec } from '../../data/settings';
import { TextItemsID, TextsID } from '../../data/validators';
import { useData } from '../../hooks/useData';
import { useSettingWithDefault } from '../../hooks/useSettingWithDefault';
import { useUpdateActiveText } from '../../hooks/useUpdateActiveText';
import { AudioPlayer } from '../../ui-kit/AudioPlayer';
import { Icon } from '../../ui-kit/Icon';
import { Text } from '../../utils/parseMySqlDump';
import { AnnPlcmnt, DisplayAnnotatedText } from './PrintText.component';

export function DisplayImprText({ textID }: { textID: TextsID }) {
  const [{ wordHashmapByLC, texts, languageHashmap, textitems }] = useData([
    'texts',
    'languageHashmap',
    'textitems',
    'wordHashmapByLC',
  ]);

  const [hiddenTexts, setHiddenTexts] = useState<Record<TextItemsID, true>>({});
  const [hiddenAnns, setHiddenAnns] = useState<Record<TextItemsID, true>>({});
  const text = texts.find((val) => val.TxID === textID);
  if (!text) {
    throw new Error('Invalid Text ID!');
  }
  useUpdateActiveText({ textID });
  const frameHeightKey: keyof SettingSpec = text.TxAudioURI
    ? 'set-text-h-frameheight-with-audio'
    : 'set-text-h-frameheight-no-audio';
  const { [frameHeightKey]: frameHeight } = useSettingWithDefault([
    frameHeightKey,
  ]);
  // TODO shouldnt need
  if (!languageHashmap) {
    return <></>;
  }
  const language = languageHashmap[text.TxLgID];
  if (!language) {
    throw new Error('Invalid Text Language ID!');
  }

  const textItemsForThisText = textitems
    .filter((val) => val.TiTxID === textID)
    .sort((a, b) => (a.TiOrder > b.TiOrder ? 1 : -1));

  return (
    <>
      <SplitPane
        split="horizontal"
        minSize={settingSpec['set-test-l-framewidth-percent']['min'] - 90}
        maxSize={settingSpec['set-text-h-frameheight-with-audio']['max'] - 90}
        defaultSize={frameHeight - 90}
      >
        <div style={{ overflowY: 'auto' }}>
          <DisplayImprTextHeader text={text} />
        </div>
        <div style={{ overflowY: 'auto' }}>
          <DisplayAnnotatedText
            transClassName="anntransruby2"
            language={language}
            showingText={text}
            textItemsForThisText={textItemsForThisText}
            wordLookupKeyedByTextLC={wordHashmapByLC}
            annplcmnt={AnnPlcmnt['above (ruby)']}
            show_rom={false}
            show_trans
            hiddenAnns={hiddenAnns}
            hiddenTrans={hiddenTexts}
            onClickTerm={(id) => {
              const mutableTexts = hiddenTexts;
              console.log('TEST123-clickterm', { mutableTexts, id });
              if (hiddenTexts[id]) {
                delete mutableTexts[id];
                return setHiddenTexts(mutableTexts);
              }
              mutableTexts[id] = true;
              return setHiddenTexts(mutableTexts);
            }}
            onClickAnn={(id) => {
              const mutableAnns = hiddenAnns;
              if (hiddenAnns[id]) {
                delete mutableAnns[id];
                return setHiddenAnns(mutableAnns);
              }
              mutableAnns[id] = true;
              return setHiddenAnns(mutableAnns);
            }}
          />
        </div>
      </SplitPane>
    </>
  );
}
function DisplayImprTextHeader({ text }: { text: Text }) {
  // TODO move to parent
  const termsAvailable = [];
  const annotationsAvailable = [];
  const [showingTerms, setShowingTerms] = useState([]);
  const [showingAnnotations, setShowingAnnotations] = useState([]);

  const showAllTerms = () => setShowingTerms(termsAvailable);
  const showNoTerms = () => setShowingTerms([]);
  const showAllAnnotations = () => setShowingAnnotations(annotationsAvailable);
  const showNoAnnotations = () => setShowingAnnotations([]);
  const audio = text['TxAudioURI'];

  const title = text['TxTitle'];
  const sourceURI = text['TxSourceURI'];
  const langid = text['TxLgID'];
  function do_hide_t() {
    showNoAnnotations();
    //   .css('color', 'd#E5E4E2')
    //   .css('background-color', '#E5E4E2');
  }
  function do_show_t() {
    showAllAnnotations();
    //   .css('color', 'black')
    //   .css('background-color', 'white');
  }
  function do_hide_a() {
    showNoTerms();
    // TODO
    //   .css('color', '#C8DCF0')
    //   .css('background-color', '#C8DCF0');
  }
  function do_show_a() {
    showAllTerms();
    // TODO
    //   .css('color', '#006699')
    //   .css('background-color', 'white');
  }
  return (
    <>
      <h2 className="center" style={{ margin: '5px', marginTop: '-10px' }}>
        {showingTerms.length === 0 ? (
          <Icon
            id="hidet"
            style={{ marginBottom: '-5px' }}
            className="click"
            src="light-bulb-T"
            title="Toggle Text Display (Now ON)"
            onClick={() => do_hide_t()}
          />
        ) : (
          <Icon
            id="showt"
            style={{ marginBottom: '-5px' }}
            className="click"
            src="light-bulb-off-T"
            title="Toggle Text Display (Now OFF)"
            onClick={() => do_show_t()}
          />
        )}
        {showNoAnnotations.length === 0 ? (
          <Icon
            id="hide"
            style={{ marginBottom: '-5px' }}
            className="click"
            src="light-bulb-A"
            title="Toggle Annotation Display (Now ON)"
            onClick={() => do_hide_a()}
          />
        ) : (
          <Icon
            id="show"
            style={{ marginBottom: '-5px' }}
            className="click"
            src="light-bulb-off-A"
            title="Toggle Annotation Display (Now OFF)"
            onClick={() => do_show_a()}
          />
        )}
        &nbsp; &nbsp;
        {title}
        {sourceURI ? (
          <a href={sourceURI} target="_blank">
            <Icon src="chain" title="Text Source" />
          </a>
        ) : (
          <></>
        )}
        {/* TODO */}
        {/* // echo getPreviousAndNextTextLinks(textid, 'display_impr_text.php?text=', TRUE, ' &nbsp; &nbsp; '); */}
        <Icon
          className="click"
          src="cross"
          title="Close Window"
          onClick="top.close();"
        />
        {/* </span> */}
      </h2>
      <AudioPlayer audioURL={text.TxAudioURI} />
      {/* //   </table> */}
    </>
  );
}
function DisplayImprTextText({ text }: { text: Text }) {
  // textid = getreq('text') + 0;
  // ann = get_first_value("select TxAnnotatedText as value from " . tbpref . "texts where TxID = " . textid);
  // ann_exists = (strlen(ann) > 0);
  // if ((textid == 0) || (!ann_exists)) {
  // 	header("Location: edit_texts.php");
  // 	exit();
  // }
  // sql = 'select TxLgID, TxTitle from ' . tbpref . 'texts where TxID = ' . textid;
  // res = do_mysqli_query(sql);
  // record = mysqli_fetch_assoc(res);
  // title = record['TxTitle'];
  // langid = record['TxLgID'];
  // mysqli_free_result(res);
  // sql = 'select LgTextSize, LgRemoveSpaces, LgRightToLeft from ' . tbpref . 'languages where LgID = ' . langid;
  // res = do_mysqli_query(sql);
  // record = mysqli_fetch_assoc(res);
  // textsize = record['LgTextSize'];
  // removeSpaces = record['LgRemoveSpaces'];
  // rtlScript = record['LgRightToLeft'];
  // mysqli_free_result(res);
  // saveSetting('currenttext', textid);
  // pagestart_nobody('Display');
  // ?>
  // <script type="text/javascript">
  // 	//<![CDATA[
  // 	function click_ann() {
  // 		if ($(this).css('color') == 'rgb(200, 220, 240)') {
  // 			$(this).css('color', '#006699');
  // 			$(this).css('background-color', 'white');
  // 		}
  // 		else {
  // 			$(this).css('color', '#C8DCF0');
  // 			$(this).css('background-color', '#C8DCF0');
  // 		}
  // 	}
  // 	function click_text() {
  // 		if ($(this).css('color') == 'rgb(229, 228, 226)') {
  // 			$(this).css('color', 'black');
  // 			$(this).css('background-color', 'white');
  // 		}
  // 		else {
  // 			$(this).css('color', '#E5E4E2');
  // 			$(this).css('background-color', '#E5E4E2');
  // 		}
  // 	}
  // 	$(document).ready(function () {
  // 		$('.anntransruby2').click(click_ann);
  // 		$('.anntermruby').click(click_text);
  // 	});
  // 	//]]>
  // </script>
  // <?php
  // echo "<div id=\"print\"" . (rtlScript ? ' dir="rtl"' : '') . ">";
  // echo '<p style="font-size:' . textsize . '%;line-height: 1.35; margin-bottom: 10px; ">';
  // items = preg_split('/[\n]/u', ann);
  // foreach (items as item) {
  // 	vals = preg_split('/[\t]/u', item);
  // 	if (vals[0] > -1) {
  // 		trans = '';
  // 		c = count(vals);
  // 		rom = '';
  // 		if (c > 2) {
  // 			if (vals[2] !== '') {
  // 				wid = vals[2] + 0;
  // 				rom = get_first_value("select WoRomanization as value from " . tbpref . "words where WoID = " . wid);
  // 				if (!isset(rom))
  // 					rom = '';
  // 			}
  // 		}
  // 		if (c > 3)
  // 			trans = vals[3];
  // 		if (trans == '*')
  // 			trans = vals[1] . " "; // <- U+200A HAIR SPACE
  // 		echo ' <ruby><rb><span class="click anntermruby" style="color:black;"' . (rom == '' ? '' : (' title="' . tohtml(rom) . '"')) . '>' . tohtml(vals[1]) . '</span></rb><rt><span class="click anntransruby2">' . tohtml(trans) . '</span></rt></ruby> ';
  // 	} else {
  // 		if (count(vals) >= 2)
  // 			echo str_replace(
  // 				"¶",
  // 				'</p><p style="font-size:' . textsize . '%;line-height: 1.3; margin-bottom: 10px;">',
  // 				" " . tohtml(vals[1])
  // 			);
  // 	}
  // }
  // echo "</p></div>";
  // pageend();
  // ?>
}
