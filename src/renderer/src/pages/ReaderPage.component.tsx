import { useEffect, useRef, useState } from 'react';
import SplitPane from 'react-split-pane';
import { dataService } from '../data/data.service';
import { getCurrentTimeAsString } from '../data/preValidateMaps';
import { LanguagesID, TextsID, WordsID } from '../data/validators';
import { useData } from '../hooks/useData';
import { useSettingWithDefault } from '../hooks/useSettingWithDefault';
import { useThemeColors } from '../hooks/useThemeColors';
import { useUpdateActiveText } from '../hooks/useUpdateActiveText';
import { PLUGINS } from '../plugins';
import { APITranslateTerm } from '../plugins/deepl.plugin';
import { MakeAudioPlayer } from '../ui-kit/AudioPlayer';
import { Header } from '../ui-kit/Header';
import { TextItem, Word } from '../utils/parseMySqlDump';
import {
  makeScoreRandomInsertUpdate,
  prepare_textdata_js,
  strToClassName,
} from '../utils/utils';
import { TranslationAPI } from './IO/APITranslation.component';
import { Loader } from './Loader';
import { Reader } from './Reader.component';
import { AddNewWordPane } from './Term/AddNewWordPane';
import { Tester, TesterTable } from './Tester';
import { TextToDoCount } from './TextToDoCount';
import { makeTooltipTitleObj } from './readerTesterEventHandlers';
import { owin } from './translateSentence2';

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
function IFramePane({ url }: { url: string | null }) {
  console.log('TEST123-IFRAME', url);
  const [loading, setLoading] = useState<boolean>(false);
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) {
      return () => {};
    }
    const loadHandler = () => {
      setLoading(false);
    };
    setLoading(true);
    frame.addEventListener('load', loadHandler);

    return () => {
      frame.removeEventListener('load', loadHandler);
    };
  }, [url]);

  const colors = useThemeColors();
  // https://stackoverflow.com/questions/23616226/insert-html-with-react-variable-statements-jsx
  // dictionary pane
  // const frameRef = useRef<HTMLIFrameElement | null>(null);
  // useEffect(() => {
  //   const frame = frameRef.current;
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
      style={{ height: '100%', width: '100%', backgroundColor: colors.lum6 }}
    >
      {loading && <Loader height={'50%'} width={'50%'} />}
      {
        <iframe
          name="ru"
          src={url || undefined}
          width={'100%'}
          height={'100%'}
          ref={frameRef}
        />
      }
    </div>
  );
}
// TODO I Know All

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
  const [{ texts }] = useData(['texts']);
  const {
    ['set-text-l-framewidth-percent']: lFrameWidthPerc,
    ['set-text-r-frameheight-percent']: rFrameHeightPerc,
    ['set-text-visit-statuses-via-key']: ADDFILTER,
    // TODO use
    ['set-text-h-frameheight-no-audio']: setTextHFrameheightNoAudio,
    ['set-text-h-frameheight-with-audio']: setTextHFrameheightWithAudio,
  } = useSettingWithDefault([
    'set-text-l-framewidth-percent',
    'set-text-r-frameheight-percent',
    'set-text-visit-statuses-via-key',
    'set-text-h-frameheight-no-audio',
    'set-text-h-frameheight-with-audio',
  ]);

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

  useUpdateActiveText(textID);

  const [activeWord, setActiveWord] = useState<
    | (Word & Pick<TextItem, 'TiSeID'>)
    | ({ newWord: string } & Pick<TextItem, 'TiSeID'>)
    | null
  >(null);
  // TODO bad pattern
  const [showAll, setShowAll] = useState<boolean>(false);
  const [showChanged, setShowChanged] = useState<{
    text: TextsID;
    mode: 0 | 1;
  } | null>(null);
  const [iFrameURL, setIFrameURL] = useState<string | null>(null);
  const [translateAPIParams, setTranslateAPIParams] = useState<
    (APITranslateTerm<string, string> & { apiKey: string }) | null
  >(null);
  const text = texts.find((text) => text.TxID === textID);
  const activeText =
    activeWord === null
      ? null
      : 'newWord' in activeWord
      ? activeWord.newWord
      : activeWord.WoText;
  if (!text) {
    // return <></>;
    // TODO if testing by language then this could be multiple
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
  const availableAPIPlugins = Object.fromEntries(
    PLUGINS.filter((val) => val.api !== undefined).map((plugin) => [
      plugin.pluginName,
      plugin.api!,
    ])
  );
  const currentlyActiveAPI = translateAPIParams
    ? availableAPIPlugins[translateAPIParams?.apiKey]
    : null;
  console.log(
    'TEST123-reader',
    availableAPIPlugins,
    currentlyActiveAPI,
    PLUGINS
  );
  if (!currentlyActiveAPI && translateAPIParams) {
    throw new Error('Invalid API Plugin Specified!');
  }
  return (
    <SplitPane
      split="vertical"
      minSize={50}
      defaultSize={`${lFrameWidthPerc}%`}
    >
      <SplitPane
        style={{ overflowWrap: 'break-word' }}
        split="horizontal"
        minSize={50}
        defaultSize={`${rFrameHeightPerc}%`}
      >
        <>
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
          <table className="width99pc">
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
                      // showallwordsClick(text.TxID, val, setShowChanged)
                      // TODO
                      setShowAll(value);
                    }}
                    // TODO
                    // ref={null}
                  />
                </span>
                {/* TODO deprecate */}
                <span id="thetextid" className="hide">
                  {text.TxID}
                </span>
              </td>
            </tr>

            {text.TxAudioURI && <AudioPlayer audioURI={text.TxAudioURI} />}
          </table>
          <br />
          <MakeAudioPlayer
            $audio={
              'https://learning-with-texts.sourceforge.io/media/dondusang_short.mp3'
            }
          />
        </>
        <Reader
          showAll={showAll}
          activeID={textID}
          setActiveWord={setActiveWord}
          activeWord={activeWord}
          setIFrameURL={setIFrameURL}
          setTranslateAPIParams={setTranslateAPIParams}
        />
      </SplitPane>
      <SplitPane
        split="horizontal"
        minSize={50}
        defaultSize={`${rFrameHeightPerc}%`}
      >
        {activeWord && activeText ? (
          <AddNewWordPane
            word={activeText}
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
      </SplitPane>
    </SplitPane>
  );
}
export type Modality = 0 | 1 | 2 | 3 | 4 | 5 | 'table' | null;

// TODO abstract common themes
// export function FourFramePage({}){}
/**
 *
 */
export function TesterPage({
  langID: langID,
  textID: textID,
}: {
  textID: TextsID | null;
  langID: LanguagesID | null;
}) {
  const [{ texts, words, languages, textitems }] = useData([
    'texts',
    'words',
    'languages',
    'textitems',
  ]);
  useUpdateActiveText(textID);

  const [activeWord, setActiveWord] = useState<string | null>();
  // TODO can be multiple texts?

  const [translateAPIParams, setTranslateAPIParams] = useState<
    (APITranslateTerm<string, string> & { apiKey: string }) | null
  >(null);
  const text =
    textID !== null
      ? texts.find((text) => text.TxID === textID)
      : texts.find((text) => text.TxLgID === langID);
  const [iFrameURL, setIFrameURL] = useState<string | null>(null);

  const [testModality, setTestModality] = useState<Modality>(null);
  const language = languages.find(
    (val) => val.LgID === (langID ? langID : text.TxLgID)
  );
  // TODO might be no text & only specified language?
  if (!text) {
    return <></>;
  }
  if (!language) {
    return <></>;
  }
  const wordLookupKeyedByTextLC = Object.fromEntries(
    words
      .filter((word) => word.WoLgID === language.LgID)
      .map((val) => [val.WoTextLC, val])
  );
  const tableWords = textitems
    .filter(
      (ti) =>
        ti.TiTxID === text.TxID &&
        ti.TiLgID === language.LgID &&
        ti.TiIsNotWord === 0 &&
        wordLookupKeyedByTextLC[ti.TiTextLC]
    )
    .map((ti) => wordLookupKeyedByTextLC[ti.TiTextLC]);
  console.log('TEST123-table', tableWords);

  const availableAPIPlugins = Object.fromEntries(
    PLUGINS.filter((val) => val.api !== undefined).map((plugin) => [
      plugin.pluginName,
      plugin.api!,
    ])
  );
  const currentlyActiveAPI = translateAPIParams
    ? availableAPIPlugins[translateAPIParams?.apiKey]
    : null;
  return (
    <SplitPane split="vertical" minSize={50} defaultSize="55%">
      <SplitPane
        style={{ overflowWrap: 'break-word' }}
        split="horizontal"
        minSize={50}
        defaultSize="20%"
      >
        <>
          <Header title={`TEST ▶ ${text.TxTitle} (Due: TODO of TODO)`} />

          <p style={{ marginBottom: 0 }}>
            <input
              type="button"
              value="..[L2].."
              // TODO difference between onClick & onClickCapture?
              onClickCapture={() => setTestModality(1)}
            />
            <input
              type="button"
              value="..[L1].."
              onClickCapture={() => setTestModality(2)}
            />
            <input
              type="button"
              value="..[••].."
              onClickCapture={() => setTestModality(3)}
            />{' '}
            &nbsp; | &nbsp;
            <input
              type="button"
              value="[L2]"
              onClickCapture={() => setTestModality(4)}
            />
            <input
              type="button"
              value="[L1]"
              onClickCapture={() => setTestModality(5)}
            />{' '}
            &nbsp; | &nbsp;
            <input
              type="button"
              value="Table"
              onClickCapture={() => setTestModality('table')}
            />
          </p>
        </>
        {testModality === null ? (
          <></>
        ) : testModality === 'table' ? (
          <TesterTable language={language} words={tableWords} />
        ) : (
          <Tester
            modality={testModality}
            setTranslateAPIParams={setTranslateAPIParams}
            setIFrameURL={setIFrameURL}
          />
        )}
      </SplitPane>
      <SplitPane split="horizontal" minSize={50} defaultSize="60%">
        {activeWord ? (
          <AddNewWordPane
            word={activeWord}
            existingTerm={words.find(
              ({ WoTextLC }) => activeWord.toLowerCase() === WoTextLC
            )}
            langID={text.TxLgID}
            onClearActiveWord={() => setActiveWord(null)}
            setIFrameURL={setIFrameURL}
            setTranslateAPIParams={setTranslateAPIParams}
          />
        ) : (
          <></>
        )}
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
        )}{' '}
      </SplitPane>
    </SplitPane>
  );
}

// TODO deprecate
/**
 * @param u
 * @param w
 * @param t
 * @param b
 * @deprecated
 */
export function CreateTheDictLink({
  u,
  w,
  t,
  b,
}: {
  u: string;
  w: string;
  t: string;
  b: string;
}): JSX.Element {
  const url = u.trim();
  const trm = w.trim();
  const txt = t.trim();
  const txtbefore = b.trim();
  if (url !== '' && txt !== '') {
    if (url.substr(0, 1) === '*') {
      return (
        <>
          {txtbefore}{' '}
          <span
            className="click"
            onClick={() =>
              owin(createTheDictUrl(url.substring(1), escape_apostrophes(trm)))
            }
          >
            {txt}
          </span>
        </>
      );
    } else {
      return (
        <>
          {txtbefore}{' '}
          <a href={`${createTheDictUrl(url, trm)}`} target="ru">
            {txt}
          </a>
        </>
      );
    }
  }
  return <></>;
}

/**
 * @param u
 * @param w
 * @deprecated
 */
export function createTheDictUrl(u: string, w: string) {
  const url = u.trim();
  const trm = w.trim();
  const r = `trans?x=2&i=${escape(url)}&t=${trm}`;
  return r;
}

/**
 *
 * @param s
 */
function escape_apostrophes(s: string) {
  return s.replace(/'/g, "\\'");
}

/**
 * @todo
 */
function AudioPlayer({ audioURI }: { audioURI: string }) {
  // TODO
  return <></>;
}

// TODO
{
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

// TODO

// $x = $_REQUEST["x"];
// $i = stripTheSlashesIfNeeded($_REQUEST["i"]);
// $t = stripTheSlashesIfNeeded($_REQUEST["t"]);

// if ( $x == 1 ) {
// 	$sql = 'select SeText, LgGoogleTranslateURI from ' . $tbpref . 'languages, ' . $tbpref . 'sentences, ' . $tbpref . 'textitems where TiSeID = SeID and TiLgID = LgID and TiTxID = ' . $t . ' and TiOrder = ' . $i;
// 	$res = do_mysqli_query($sql);
// 	$record = mysqli_fetch_assoc($res);
// 	if ($record) {
// 		$satz = $record['SeText'];
// 		$trans = isset($record['LgGoogleTranslateURI']) ? $record['LgGoogleTranslateURI'] : "";
// 		if(substr($trans,0,1) == '*') $trans = substr($trans,1);
// 	} else {
// 		my_die("No results: $sql");
// 	}
// 	mysqli_free_result($res);
// 	if ($trans != '') {
// 		/*
// 		echo "{" . $i . "}<br />";
// 		echo "{" . $t . "}<br />";
// 		echo "{" . createTheDictLink($trans,$satz) . "}<br />";
// 		*/
// 		header("Location: " . createTheDictLink($trans,$satz));
// 	}
// 	exit();
// }

// if ( $x == 2 ) {
// 	/*
// 	echo "{" . $i . "}<br />";
// 	echo "{" . $t . "}<br />";
// 	echo "{" . createTheDictLink($i,$t) . "}<br />";
// 	*/
// 	header("Location: " . createTheDictLink($i,$t));
// 	exit();
// }
