import {
  SettingSpec,
  Text,
  TextItemsID,
  TextsID,
  settingSpec,
} from 'lwt-schemas';
import { useData } from 'lwt-state';
import {
  AudioPlayer,
  Icon,
  useInternalNavigate,
  useSettingWithDefault,
  useUpdateActiveText,
} from 'lwt-ui-kit';
import { useState } from 'react';
import SplitPane from 'react-split-pane';
import { AnnPlcmnt } from './Annotation.types';
import { DisplayAnnotatedText } from './PrintText.component';

export function DisplayImprText({ textID }: { textID: TextsID }) {
  const [{ wordHashmapByLC, texts, languageHashmap, textitems }] = useData([
    'texts',
    'languageHashmap',
    'textitems',
    'wordHashmapByLC',
  ]);

  const text = texts.find((val) => val.TxID === textID);
  if (!text) {
    throw new Error('Invalid Text ID!');
  }
  const termsAvailable = textitems.filter((val) => val.TiTxID === text.TxID);
  const annotationsAvailable = termsAvailable.map((val) => val);
  const [showingTerms, setShowingTerms] = useState(termsAvailable);
  const [showingAnnotations, setShowingAnnotations] =
    useState(annotationsAvailable);
  const [hiddenTexts, setHiddenTexts] = useState<Record<TextItemsID, true>>({});
  const [hiddenAnns, setHiddenAnns] = useState<Record<TextItemsID, true>>({});
  useUpdateActiveText({ txID: textID });
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

  const showAllTerms = () => setShowingTerms(termsAvailable);
  const showNoTerms = () => setShowingTerms([]);
  const showAllAnnotations = () => setShowingAnnotations(annotationsAvailable);
  const showNoAnnotations = () => setShowingAnnotations([]);
  return (
    <>
      <SplitPane
        split="horizontal"
        minSize={settingSpec['set-test-l-framewidth-percent']['min'] - 90}
        maxSize={settingSpec['set-text-h-frameheight-with-audio']['max'] - 90}
        defaultSize={frameHeight - 90}
      >
        <div style={{ overflowY: 'auto' }}>
          <DisplayImprTextHeader
            text={text}
            showAllTerms={showAllTerms}
            showNoTerms={showNoTerms}
            showAllAnnotations={showAllAnnotations}
            showNoAnnotations={showNoAnnotations}
            noTermsShown={showingTerms.length === 0}
            noAnnsShown={showingAnnotations.length === 0}
          />
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
function DisplayImprTextHeader({
  text: { TxTitle, TxSourceURI, TxAudioURI },
  showAllTerms,
  showNoTerms,
  showAllAnnotations,
  showNoAnnotations,
  noTermsShown: noTermsShown,
  noAnnsShown: noAnnsShown,
}: {
  text: Text;

  showAllTerms: () => void;
  showNoTerms: () => void;
  showAllAnnotations: () => void;
  showNoAnnotations: () => void;
  noTermsShown: boolean;
  noAnnsShown: boolean;
}) {
  const navigate = useInternalNavigate();
  // const audio = text['TxAudioURI'];
  // const langid = text['TxLgID'];
  return (
    <>
      <h2 className="center" style={{ margin: '5px', marginTop: '-10px' }}>
        {noTermsShown ? (
          <Icon
            id="hidet"
            style={{ marginBottom: '-5px' }}
            className="click"
            src="light-bulb-T"
            title="Toggle Text Display (Now ON)"
            onClick={() => showNoTerms()}
          />
        ) : (
          <Icon
            id="showt"
            style={{ marginBottom: '-5px' }}
            className="click"
            src="light-bulb-off-T"
            title="Toggle Text Display (Now OFF)"
            onClick={() => showAllTerms()}
          />
        )}
        {noAnnsShown ? (
          <Icon
            id="hide"
            style={{ marginBottom: '-5px' }}
            className="click"
            src="light-bulb-A"
            title="Toggle Annotation Display (Now ON)"
            onClick={() => showNoAnnotations()}
          />
        ) : (
          <Icon
            id="show"
            style={{ marginBottom: '-5px' }}
            className="click"
            src="light-bulb-off-A"
            title="Toggle Annotation Display (Now OFF)"
            onClick={() => showAllAnnotations()}
          />
        )}
        &nbsp; &nbsp;
        {TxTitle}
        {TxSourceURI ? (
          <a href={TxSourceURI} target="_blank">
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
          onClick={() => navigate('/')}
        />
        {/* </span> */}
      </h2>
      {TxAudioURI && <AudioPlayer audioURL={TxAudioURI} />}
      {/* //   </table> */}
    </>
  );
}
// TODO is this duped with AnnotateText?
// TODO
// function DisplayImprTextText({
//   text: { TxLgID, TxTitle, TxID, TxAnnotatedText },
// }: {
//   text: Text;
// }) {
// const ann = TxAnnotatedText;
// const ann_exists = ann !== '';
// if (TxID == null || !ann_exists) {
//   // TODO
//   // header("Location: edit_texts.php");
//   // exit();
// }
// const [{ languageHashmap }] = useData(['languageHashmap']);
// const { LgTextSize, LgRemoveSpaces, LgRightToLeft } = languageHashmap[TxLgID];
// const title = TxTitle;
// const langid = TxLgID;
// const textsize = LgTextSize;
// const removeSpaces = LgRemoveSpaces;
// const rtlScript = LgRightToLeft;
// useUpdateActiveText({ txID: TxID });
// // pagestart_nobody('Display');
// function click_ann() {
//   if ($(this).css('color') == 'rgb(200, 220, 240)') {
//     $(this).css('color', '#006699');
//     $(this).css('background-color', 'white');
//   } else {
//     $(this).css('color', '#C8DCF0');
//     $(this).css('background-color', '#C8DCF0');
//   }
// }
// function click_text() {
//   if ($(this).css('color') == 'rgb(229, 228, 226)') {
//     $(this).css('color', 'black');
//     $(this).css('background-color', 'white');
//   } else {
//     $(this).css('color', '#E5E4E2');
//     $(this).css('background-color', '#E5E4E2');
//   }
// }
// $(document).ready(function () {
//   $('.anntransruby2').click(click_ann);
//   $('.anntermruby').click(click_text);
// });
// const items = ann.split('/[\n]/u');
// return (
//   <div id="print" {...getDirTag({ LgRightToLeft })}>
//     <p
//       style={{
//         fontSize: `${textsize}`,
//         lineHeight: 1.35,
//         marginBottom: '10px',
//       }}
//     >
//       {items.map((item)=>( {
//     vals = preg_split('/[\t]/u', item);
//     {vals[0]>-1?
//       {trans = '';
//       c = count(vals);
//       rom = '';
//       if (c > 2) {
//         if (vals[2] !== '') {
//           wid = vals[2] + 0;
//           rom = get_first_value("select WoRomanization as value from " . tbpref . "words where WoID = " . wid);
//           if (!isset(rom))
//             rom = '';
//         }
//       }
//       if (c > 3){
//         trans = vals[3];}
//       if (trans == '*'){
//         trans = vals[1] . " "; // <- U+200A HAIR SPACE}
//       echo ' <ruby><rb><span class="click anntermruby" style="color:black;"' . (rom == '' ? '' : (' title="' . tohtml(rom) . '"')) . '>' . tohtml(vals[1]) . '</span></rb><rt><span class="click anntransruby2">' . tohtml(trans) . '</span></rt></ruby> ';
//     } : {
//       if (count(vals) >= 2){
//       vals[1].split(
//     "¶",
//     ).map((val)=>(return <>
//       <p style={{fontSize:`${textsize}%`,lineHeight: 1.3, marginBottom: '10px'}}>
//       {val}
//       </p>
//       </>))}
//     }}}}))
//     </p>
//   </div>
// );
// }
