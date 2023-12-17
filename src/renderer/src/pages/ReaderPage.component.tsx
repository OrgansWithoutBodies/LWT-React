import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { dataService } from '../data/data.service';
import { getCurrentTimeAsString } from '../data/preValidateMaps';
import { TextsID, WordsID } from '../data/validators';
import { useData } from '../hooks/useData';
import { useThemeColors } from '../hooks/useThemeColors';
import { useUpdateActiveText } from '../hooks/useUpdateActiveText';
import { PLUGINS } from '../plugins';
import { APITranslateTerm } from '../plugins/deepl.plugin';
import { AudioPlayer } from '../ui-kit/AudioPlayer';
import { Header } from '../ui-kit/Header';
import { Text, TextItem, Word } from '../utils/parseMySqlDump';
import {
  makeScoreRandomInsertUpdate,
  prepare_textdata_js,
  strToClassName,
} from '../utils/utils';
import { FourFramePage } from './FourFrames';
import { TranslationAPI } from './IO/APITranslation.component';
import { Loader } from './Loader';
import { Reader } from './Reader.component';
import { AddNewWordPane } from './Term/AddNewWordPane';
import { TextToDoCount } from './TextToDoCount';
import { makeTooltipTitleObj } from './readerTesterEventHandlers';

// TODO
//  confirmation screen
//  details screen

/**
 *
 * @param text
 * @param newVal
 * @param onShowChanged
 */
function showallwordsClick(
  text: TextsID,
  newVal: 0 | 1,
  onShowChanged: (args: { text: TextsID; mode: 0 | 1 }) => void
) {
  dataService.setSettings({ showallwords: newVal });
  onShowChanged({ text, mode: newVal });
}

/**
 *
 */
function ShowAllMessage({ showAll: showAll }: { showAll: 0 | 1 }) {
  return (
    <p>
      <span id="waiting">
        <img src="icn/waiting.gif" alt="Please wait" title="Please wait" />
        &nbsp;&nbsp;Please wait ...
      </span>
      {showAll === 1 ? (
        <>
          <p>
            <b>
              <i>Show All</i>
            </b>{' '}
            is set to <b>ON</b>.<br />
            <br />
            ALL terms are now shown, and all multi-word terms are shown as
            superscripts before the first word. The superscript indicates the
            number of words in the multi-word term.
            <br />
            <br />
            To concentrate more on the multi-word terms and to display them
            without superscript, set <i>Show All</i> to OFF.
          </p>
        </>
      ) : (
        <>
          <p>
            <b>
              <i>Show All</i>
            </b>{' '}
            is set to <b>OFF</b>.<br />
            <br />
            Multi-word terms now hide single words and shorter or overlapping
            multi-word terms. The creation and deletion of multi-word terms can
            be a bit slow in long texts.
            <br />
            <br />
            To manipulate ALL terms, set <i>Show All</i> to ON.
          </p>
        </>
      )}
    </p>
  );
}

/**
 *
 */
export function IFramePane({ url }: { url: string | null }) {
  console.log('TEST123-IFRAME', url);
  const [loading, setLoading] = useState<boolean>(false);
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) {
      return () => {};
    }
    const loadHandler = () => {
      console.log('TEST123-load-done');
      setLoading(false);
    };
    console.log('TEST123-load-setting');
    setLoading(true);
    frame.addEventListener('load', loadHandler);

    return () => {
      frame.removeEventListener('load', loadHandler);
    };
  }, [url]);

  const colors = useThemeColors();
  // dictionary pane
  // const frameRef = useRef<HTMLIFrameElement | null>(null);
  // useEffect(() => {
  //   const frame = frameRef.current;
  // This runs into XSS issues...would be cool to be able to tell when something is selected on another page & trigger a handler but prob not possible
  // TODO investigate
  //   // if (!frame) {
  //   //   return;
  //   // }
  //   console.log('TEST123-frame-addListener', { frame });
  //   function loadHandler() {
  //     console.log('TEST123-loaded', frame?.contentWindow);
  //     console.log(
  //       'TEST123-select',
  //       frame?.contentWindow?.document.getSelection()
  //     );
  //     frame.contentWindow.addEventListener('click', (e) => {
  //       console.log('TEST123-click', e.target);
  //     });
  //   }
  //   frame.addEventListener('load', loadHandler);
  //   return () => frame.removeEventListener('load', loadHandler);
  // }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: colors.lum6,
        alignItems: 'center',
      }}
    >
      {loading && <Loader height={'50px'} width={'50px'} />}
      {url && (
        <iframe
          name="ru"
          src={url}
          width={'100%'}
          height={'100%'}
          ref={frameRef}
        />
      )}
    </div>
  );
}
// TODO I Know All

export type APITranslateTermParams =
  | (APITranslateTerm<string, string> & {
      apiKey: string;
    })
  | null;
/**
 *
 */
export function ReaderPage({
  textID: textID,
}: // onShowChanged,
{
  textID: TextsID;
  // onShowChanged: (args: { text: TextsID; mode: 0 | 1 }) => void;
}) {
  console.log('TEST123-setting-READER-PAGE');
  useUpdateActiveText({ textID });

  const [{ texts }] = useData(['texts']);

  // const lFrameWidthPerc = 50;
  // const rFrameHeightPerc = 50;
  // ANN_ARRAY = <?php echo annotation_to_json($ann); ?>;
  const TEXTPOS = -1;
  // OPENED = 0;
  // TODO
  // $(document).ready(function () {
  //   $('.word').each(word_each_do_text_text);
  //   $('.mword').each(mword_each_do_text_text);
  // });
  // TODO

  const onSetAudioPosition = () => {};
  const onSetEditWord = () => {};
  const onSetShowingWord = () => {};
  const onSetWordStatus = () => {};

  const [activeWord, setActiveWord] = useState<
    | (Word & Pick<TextItem, 'TiSeID'>)
    | ({ newWord: string } & Pick<TextItem, 'TiSeID'>)
    | null
  >(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const [showAll, setShowAll] = useState<boolean>(false);
  // TODO bad pattern
  const [showChanged, setShowChanged] = useState<{
    text: TextsID;
    mode: 0 | 1;
  } | null>(null);
  const [iFrameURL, setIFrameURL] = useState<string | null>(null);

  const [translateAPIParams, setTranslateAPIParams] =
    useState<APITranslateTermParams>(null);
  const text = texts.find((text) => text.TxID === textID);
  const activeText =
    activeWord === null
      ? null
      : 'newWord' in activeWord
      ? activeWord.newWord
      : activeWord.WoText;
  if (!text) {
    throw new Error('Invalid Text ID!');
  }
  // useEffect(() => {
  //   const onKeyDown: (this: Document, ev: KeyboardEvent) => any = (e) =>
  //     onTextKeydown(e, {
  //       onSetAudioPosition,
  //       onSetEditWord,
  //       onSetShowingWord,
  //       onSetWordStatus,
  //       ADDFILTER,
  //       ann,
  //       text,
  //       textItem,
  //       word,
  //     });
  //   document.addEventListener('keydown', onKeyDown);
  //   return () => {
  //     document.removeEventListener('keydown', onKeyDown);
  //   };
  // }, []);

  return (
    <FourFramePage
      ULFrame={() => (
        <ReaderHeader
          text={text}
          setShowAll={setShowAll}
          audioPlayerRef={audioPlayerRef}
        />
      )}
      URFrame={() => (
        <div>
          {activeWord && activeText ? (
            <AddNewWordPane
              word={activeText}
              // sentenceString='TODO'
              existingTerm={'WoID' in activeWord ? activeWord : undefined}
              langID={text.TxLgID}
              onClearActiveWord={() => setActiveWord(null)}
              setIFrameURL={setIFrameURL}
              setTranslateAPIParams={setTranslateAPIParams}
            />
          ) : showChanged ? (
            <>
              <ShowAllMessage showAll={showAll ? 1 : 0} />
            </>
          ) : (
            <></>
          )}
        </div>
      )}
      BLFrame={() => (
        <Reader
          showAll={showAll}
          activeID={textID}
          setActiveWord={setActiveWord}
          activeWord={activeWord}
          setIFrameURL={setIFrameURL}
          setTranslateAPIParams={setTranslateAPIParams}
        />
      )}
      BRFrame={() => (
        <ReaderTranslatePane
          translateAPIParams={translateAPIParams}
          iFrameURL={iFrameURL}
        />
      )}
      textID={undefined}
      frameSizes={{
        hFrameHeightKey: text.TxAudioURI
          ? 'set-text-h-frameheight-with-audio'
          : 'set-text-h-frameheight-no-audio',
        lFrameWidthPercKey: 'set-text-l-framewidth-percent',
        rFrameHeightPercKey: 'set-text-r-frameheight-percent',
      }}
    />
  );
}
export type Modality = 0 | 1 | 2 | 3 | 4 | 5 | 'table' | null;

export function ReaderTranslatePane({
  translateAPIParams,
  iFrameURL,
}: {
  translateAPIParams: APITranslateTermParams;
  iFrameURL: string | null;
}) {
  const availableAPIPlugins = Object.fromEntries(
    PLUGINS.filter((val) => val.api !== undefined).map((plugin) => [
      plugin.pluginName,
      plugin.api!,
    ])
  );
  const currentlyActiveAPI = translateAPIParams
    ? availableAPIPlugins[translateAPIParams?.apiKey]
    : null;
  const themeColors = useThemeColors();

  if (!currentlyActiveAPI && translateAPIParams) {
    throw new Error('Invalid API Plugin Specified!');
  }
  return (
    <div
      style={{
        backgroundColor: themeColors.lum6,
        width: '100%',
        height: '100%',
        padding: '10px',
      }}
    >
      {translateAPIParams && currentlyActiveAPI ? (
        <TranslationAPI
          onAcceptLine={(data) =>
            console.log('TEST123-ACCEPTING TRANSLATION: ', data)
          }
          api={currentlyActiveAPI}
          sourceKey={translateAPIParams.sourceKey}
          targetKey={translateAPIParams.targetKey}
          word={translateAPIParams.word}
        />
      ) : (
        <IFramePane url={iFrameURL} />
      )}
    </div>
  );
}
export function ReaderHeader({
  text,
  setShowAll,
  audioPlayerRef,
}: {
  text: Text;
  setShowAll: (showAll: boolean) => void;
  audioPlayerRef: MutableRefObject<HTMLAudioElement>;
}) {
  console.log('TEST123-AUDIOREF', audioPlayerRef.current, audioPlayerRef);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Header
        title={`READ ▶ ${text.TxTitle}`}
        readerProps={{
          // TODO getPreviousAndNextTextLinks
          nextTextID: 'Test1',
          prevTextString: 'test2',
          langID: text.TxLgID,
          textID: text.TxID,
        }}
      />
      <table
        className="width99pc"
        // style={{ display: 'flex', flexDirection: 'row' }}
      >
        <tr>
          <td
            className="center"
            colSpan={7}
            style={{ whiteSpace: 'nowrap', padding: '2px 5px 5px 5px' }}
          >
            TO DO:{' '}
            <span id="learnstatus">
              <TextToDoCount text={text} />
            </span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span
              title="[Show All] = ON: ALL terms are shown, and all multi-word terms are shown as superscripts before the first word. The superscript indicates the number of words in the multi-word term. 
[Show All] = OFF: Multi-word terms now hide single words and shorter or overlapping multi-word terms."
            >
              Show All&nbsp;
              <input
                type="checkbox"
                id="showallwords"
                onClick={({ target: { value } }) => {
                  {
                    /* TODO deprecate */
                  }
                  // showallwordsClick(text.TxID, val, setShowChanged)
                  // TODO
                  setShowAll(value);
                }}
                // TODO
                // ref={null}
              />
            </span>
            <span id="thetextid" className="hide">
              {text.TxID}
            </span>
          </td>
        </tr>
      </table>
      {text.TxAudioURI && (
        <AudioPlayer ref={audioPlayerRef} audioURL={text.TxAudioURI} />
      )}
    </div>
  );
}
{
  // TODO
  // pagestart_nobody('', 'html, body { margin:3px; padding:0; }');
  /* <p class="center">&nbsp;<br />Sorry - No terms to display or to test at this time.</p> */
  // '<p>Sorry - The selected terms are in ' . cntlang . ' languages, but tests are only possible in one language at a time.</p>
}

/**
 *
 * @param id_string
 * @todo this can probably be deprecated just via handlers
 */
export function get_position_from_id(id_string) {
  if (id_string == undefined) {
    return -1;
  }
  const arr = id_string.split('-');
  return parseInt(arr[1]) * 10 + 10 - parseInt(arr[2]);
}

const onIgnoreTerm = () => {
  // TODO
  // $word = get_first_value("select TiText as value from " . $tbpref . "textitems where TiWordCount = 1 and TiTxID = " . $_REQUEST['tid'] . " and TiOrder = " . $_REQUEST['ord']);
  // $wordlc = mb_strtolower($word, 'UTF-8');
  // $langid = get_first_value("select TxLgID as value from " . $tbpref . "texts where TxID = " . $_REQUEST['tid']);
  // pagestart("Term: " . $word, false);
  // $m1 = runsql('insert into ' . $tbpref . 'words (WoLgID, WoText, WoTextLC, WoStatus, WoStatusChanged,' . make_score_random_insert_update('iv') . ') values( ' .
  //     $langid . ', ' .
  //     convert_string_to_sqlsyntax($word) . ', ' .
  //     convert_string_to_sqlsyntax($wordlc) . ', 98, NOW(), ' .
  //     make_score_random_insert_update('id') . ')', 'Term added');
  // $wid = get_last_key();
  // echo "<p>OK, this term will be ignored!</p>";
  // $hex = strToClassName($wordlc);
  // ?>
  // <script type="text/javascript">
  //     //<![CDATA[
  //     var context = window.parent.frames['l'].document;
  //     var contexth = window.parent.frames['h'].document;
  //     var title = make_tooltip(<?php echo prepare_textdata_js($word); ?>, '*', '', '98');
  //     $('.TERM<?php echo $hex; ?>', context).removeClass('status0').addClass('status98 word<?php echo $wid; ?>').attr(status, '98').attr(wid, '<?php echo $wid; ?>').attr('title', title);
  //     $('#learnstatus', contexth).html('<?php echo texttodocount2($_REQUEST['tid']); ?>');
  //     window.parent.frames['l'].focus();
  //     window.parent.frames['l'].setTimeout('cClick()', 100);
  //     //]]>
  // </script>
  // <?php
  // pageend();
  // ?>
};
// TODO dedupe with above 98/99
const onWellKnownTerm = ({
  TiOrder,
  TiTxID,
  onInsertNewTerm,
  onSetToDoCount2,
}: Pick<TextItem, 'TiOrder' | 'TiTxID'> & {
  onSetToDoCount2: (args: Pick<TextItem, 'TiTxID'>) => void;
  onInsertNewTerm: (
    args: Pick<
      Word,
      | 'WoLgID'
      | 'WoText'
      | 'WoStatus'
      | 'WoTextLC'
      | 'WoStatusChanged'
      | 'WoTodayScore'
      | 'WoTomorrowScore'
      | 'WoRandom'
    >
  ) => WordsID;
}) => {
  const [{ words, textitems, texts }] = useData([
    'words',
    'textitems',
    'texts',
  ]);
  const textItem = textitems.find(
    (textItem) =>
      textItem.TiWordCount === 1 &&
      textItem.TiTxID === TiTxID &&
      textItem.TiOrder === TiOrder
  );
  if (!textItem) {
    throw new Error('Invalid TextItem ID!');
  }
  const word = textItem.TiText;
  const text = texts.find((val) => val.TxID === textItem.TiTxID);
  if (!text) {
    throw new Error('Invalid Text ID!');
  }
  const langid = text.TxLgID;
  const $wordlc = textItem.TiTextLC;
  // pagestart("Term: " . $word, false);
  // make_score_random_insert_update()
  const newWoID = onInsertNewTerm({
    WoLgID: langid,
    // TODO consider
    // WoText: convert_string_to_sqlsyntax(word),
    WoText: word,
    WoTextLC: $wordlc,
    WoStatus: 99,
    WoStatusChanged: getCurrentTimeAsString(),
    ...makeScoreRandomInsertUpdate(word),
  });

  // TODO this line is the onlyy difference between 99 & 98
  // echo "<p>OK, this term will be ignored!</p>";
  // echo "<p>OK, you know this term well!</p>";
  const hex = strToClassName($wordlc);
  const title = makeTooltipTitleObj({
    WoText: prepare_textdata_js(word),
    WoTranslation: '*',
    WoStatus: 99,
  });

  onSetToDoCount2({ TiTxID });
  onSetWordClass({ hex, WoID: newWoID, status: 99, title });

  onFocus();
  onSetTimeout(100);
};
