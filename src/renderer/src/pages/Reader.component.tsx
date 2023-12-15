import { useState } from 'react';
import { TextsID } from '../data/validators';
import { useData } from '../hooks/useData';
import { APITranslateTerm } from '../plugins/deepl.plugin';
import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from '../ui-kit/Tooltip';
import { getDirTag } from '../ui-kit/getDirTag';
import { Language, Text, TextItem, Word } from '../utils/parseMySqlDump';
import {
  MwordClickEventDoTextText,
  word_dblclick_event_do_text_text,
} from './ReaderPage.component';
import { AddNewTermTooltip } from './Term/AddNewTermTooltip';
import { word_click_event_do_text_text } from './word_click_event_do_text_text';

// TODO map color from termstrength type
// TODO frame
// TODO translator
// TODO add term
// TODO hover term/click term
// TODO chinese terms
// TODO data order
// TODO 'show all' for ambiguous terms

/**
 *
 */
export function Reader({
  activeID,
  setActiveWord,
  setIFrameURL,
  setTranslateAPIParams,
  activeWord,
}: {
  activeID: TextsID;
  setActiveWord: (
    word:
      | (Word & Pick<TextItem, 'TiSeID'>)
      | ({ newWord: string } & Pick<TextItem, 'TiSeID'>)
      | null
  ) => void;
  activeWord:
    | (Word & Pick<TextItem, 'TiSeID'>)
    | ({ newWord: string } & Pick<TextItem, 'TiSeID'>)
    | null;
  setIFrameURL: (url: string | null) => void;
  setTranslateAPIParams: (
    vals: (APITranslateTerm<string, string> & { apiKey: string }) | null
  ) => void;
}): JSX.Element {
  const [{ languages, texts, words, sentences, textitems }] = useData([
    'texts',
    'words',
    'sentences',
    'textitems',
    'languages',
  ]);
  console.log('TEST123-READER-words', words);
  const [tooltipOpen, setTooltipOpen] = useState<null | number>(null);
  const [hideUntil, setHideUntil] = useState<null | number>(-1);
  const activeText = texts.find((text) => text.TxID === activeID);
  if (!activeText) {
    return <></>;
  }
  const language = languages.find((langs) => langs.LgID === activeText.TxLgID);
  if (!language) {
    return <></>;
  }

  const wordLookupKeyedByTextLC = Object.fromEntries(
    words
      .filter((word) => word.WoLgID === language.LgID)
      .map((val) => [val.WoTextLC, val])
  );
  const activeParsedText = textitems.filter(
    (val) => val.TiTxID === activeID && val.TiLgID === language.LgID
  );
  const currcharcount = 0;
  // TODO key by order?
  return (
    <div id="thetext" {...getDirTag(language)}>
      <p
        onClick={() => setTooltipOpen(null)}
        style={{
          // TODO
          // wordBreak: 'break-all',
          // whiteSpace: 'nowrap',
          fontSize: '200%',
          lineHeight: 1.4,
          marginBottom: '10px',
        }}
      >
        <Popover open={tooltipOpen !== null}>
          {tooltipOpen && activeWord !== null && (
            <PopoverContent className="Popover">
              <PopoverBody>
                <AddNewTermTooltip
                  word={
                    'WoText' in activeWord ? activeWord : activeWord.newWord
                  }
                  sentence={
                    sentences.find(
                      (sentence) => sentence.SeID === activeWord.TiSeID
                      // TODO no !
                    )!
                  }
                  onClose={() => setTooltipOpen(null)}
                  setIFrameURL={setIFrameURL}
                  setTranslateAPIParams={setTranslateAPIParams}
                  textLanguage={language}
                />
              </PopoverBody>
            </PopoverContent>
          )}
          {activeParsedText.map((textItem, ii) => {
            const {
              TiIsNotWord,
              TiTextLC,
              TiText,
              TiOrder,
              TiWordCount,
              TiSeID,
            } = textItem;
            const foundWord = wordLookupKeyedByTextLC[TiTextLC];
            const spanID = 'ID-' + TiOrder + '-' + TiWordCount;
            const hidetag =
              hideUntil > 0 && TiOrder <= hideUntil ? 'hide' : undefined;
            const termStatus = foundWord
              ? ` status${foundWord.WoStatus}`
              : ' status0';
            // if MULTIWORD
            // if (!$showAll) {
            //   if ($hideuntil === -1) {
            //     $hideuntil = $record['TiOrder'] + ($record['Code'] - 1) * 2;
            //   }
            // }
            return (
              <>
                {TiIsNotWord ? (
                  <>
                    <span id={spanID} className={hidetag}>
                      {TiText}
                    </span>
                  </>
                ) : (
                  <PopoverTrigger
                    onClickWord={() => {
                      setActiveWord(
                        foundWord !== undefined
                          ? { ...foundWord, TiSeID }
                          : { newWord: TiText, TiSeID }
                      );
                      setTooltipOpen(ii);
                    }}
                    termStatus={termStatus}
                  >
                    {TiWordCount > 0 ? (
                      <MultiWord
                        textItem={textItem}
                        word={undefined}
                        showAll={false}
                        hideuntil={hideUntil}
                        currcharcount={currcharcount}
                        setHideUntil={setHideUntil}
                        spanID={''}
                        hidetag={null}
                      />
                    ) : (
                      <SingleWord
                        textItem={textItem}
                        word={foundWord}
                        showAll={showAll}
                        hideuntil={hideUntil}
                        currcharcount={currcharcount}
                        setHideUntil={setHideUntil}
                        spanID={spanID}
                        hidetag={null}
                      />
                    )}
                  </PopoverTrigger>
                )}
                {/* This is how we currently handle spacing - TODO far from ideal */}
                {ii < activeParsedText.length - 1 &&
                activeParsedText[ii + 1].TiIsNotWord ? (
                  <></>
                ) : (
                  <> </>
                )}
              </>
            );
          })}
        </Popover>
      </p>

      <>
        <p>
          <span id="totalcharcount" className="hide">
            {currcharcount}
          </span>
        </p>
        <p
          style={{
            fontSize: language.LgTextSize,
            lineHeight: '1.4',
            marginBottom: '300px',
          }}
        >
          &nbsp;
        </p>
      </>
    </div>
  );
}
/**
 *
 */
function SingleWord({
  textItem: { TiText, TiOrder, TiTextLC },
  word: { WoStatus, WoID, WoRomanization },
  TID,
  showAll,
  hideuntil,
  setHideUntil,
  spanID,
  currcharcount,
  hidetag,
  language,
}: {
  language: Language;
  word: Pick<Word, 'WoStatus' | 'WoRomanization'> & { WoID?: Word['WoID'] };
  textItem: Pick<TextItem, 'TiText' | 'TiOrder' | 'TiTextLC'>;
  showAll: boolean;
  hideuntil: number;
  currcharcount: number;
  setHideUntil: (val: number) => void;
  spanID: string;
  hidetag: string | null;
  TID: Text['TxID'];
}) {
  const titext = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as const;
  return (
    <span
      id={spanID}
      className={`${hidetag} click word wsty word${WoID} status${WoStatus} TERM ${strToClassName(
        TiTextLC
      )}`}
      onClick={() =>
        word_click_event_do_text_text({
          TID,
          language,
          mw: titext,
          data_ann: 'TODO',
          textItem,
          word,
        })
      }
      onDoubleClick={() =>
        word_dblclick_event_do_text_text({
          // TODO currCharCount vs totalCharCount
          data_pos: currcharcount,
          setPos: () => {},
          totalcharcount,
        })
      }
      data_order={TiOrder}
      data_wid={WoID}
      data_trans="<?php echo tohtml(repl_tab_nl($record['WoTranslation']) . getWordTagList($record['WoID'], ' ', 1, 0)); ?>"
      data_rom={WoRomanization}
      data_status={WoStatus}
      data_mw2={titext[2]}
      data_mw3={titext[3]}
      data_mw4={titext[4]}
      data_mw5={titext[5]}
      data_mw6={titext[6]}
      data_mw7={titext[7]}
      data_mw8={titext[8]}
      data_mw9={titext[9]}
    >
      {TiText}
    </span>
  );
}
/**
 *
 */
function MultiWord({
  textItem: { TiText, TiWordCount, TiOrder, TiTextLC },
  showAll,
  hideuntil,
  setHideUntil,
  spanID,
  currcharcount,
  hidetag,
  word: { WoStatus, WoID, WoRomanization },
}: {
  word: Pick<Word, 'WoStatus' | 'WoRomanization'> & { WoID?: Word['WoID'] };
  textItem: Pick<TextItem, 'TiText' | 'TiWordCount' | 'TiOrder' | 'TiTextLC'>;
  showAll: boolean;
  hideuntil: number;
  currcharcount: number;
  setHideUntil: (val: number) => void;
  spanID: string;
  hidetag: string | null;
}) {
  if (WoID) {
    if (!showAll) {
      if (hideuntil === -1) {
        // TODO I'm sure we can do this without state
        setHideUntil(TiOrder + (TiWordCount - 1) * 2);
      }
    }
    return (
      <span
        id={spanID}
        className={`${hidetag} click mword ${
          showAll ? 'mwsty' : 'wsty'
        } order${TiOrder} word${WoID} status${WoStatus} TERM${strToClassName(
          TiTextLC
        )}`}
        onClick={() => MwordClickEventDoTextText({ word })}
        onDoubleClick={() =>
          word_dblclick_event_do_text_text({
            totalcharcount,
            data_pos: currcharcount,
            setPos: () => {},
          })
        }
        data_pos={currcharcount}
        data_order={TiOrder}
        data_wid={WoID}
        // data_trans="<?php echo tohtml(repl_tab_nl($record['WoTranslation']) . getWordTagList($record['WoID'], ' ', 1, 0)); ?>"
        data_rom={WoRomanization}
        data_status={WoStatus}
        data_code={TiWordCount}
        data_text={TiText}
      >
        ({showAll ? <>&nbsp; {TiWordCount} &nbsp;</> : TiText})
      </span>
    );
  }

  // Non Displayed MultiWord
  return (
    <span
      id={spanID}
      onDoubleClick={() =>
        word_dblclick_event_do_text_text({
          totalcharcount,
          data_pos: currcharcount,
          setPos: () => {},
        })
      }
      onClick={() => MwordClickEventDoTextText(word)}
      className={`click mword ${
        showAll ? 'mwsty' : 'wsty'
      } hide order${TiOrder} TERM${strToClassName(TiTextLC)}`}
      data_pos={currcharcount}
      data_order={TiOrder}
      data_code={TiWordCount}
      data_text={TiText}
    >
      {showAll ? <>&nbsp;{TiWordCount}&nbsp;</> : <>{TiText}</>}
    </span>
  );
}

// function strToClassName($string)
// {
// 	// escapes everything to "¤xx" but not 0-9, a-z, A-Z, and unicode >= (hex 00A5, dec 165)
// 	$l = mb_strlen($string, 'UTF-8');
// 	$r = '';
// 	for ($i = 0; $i < $l; $i++) {
// 		$c = mb_substr($string, $i, 1, 'UTF-8');
// 		$o = ord($c);
// 		if (
// 			($o < 48) ||
// 			($o > 57 && $o < 65) ||
// 			($o > 90 && $o < 97) ||
// 			($o > 122 && $o < 165)
// 		)
// 			$r .= '¤' . strToHex($c);
// 		else
// 			$r .= $c;
// 	}
// 	return $r;
// }
