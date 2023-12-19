import { title } from 'process';
import { useState } from 'react';
import { TextsID } from '../data/validators';
import { useData } from '../hooks/useData';
import { useThemeColors } from '../hooks/useThemeColors';
import { APITranslateTerm } from '../plugins/deepl.plugin';
import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from '../ui-kit/Tooltip';
import { getDirTag } from '../utils/getDirTag';
import { Language, Text, TextItem, Word } from '../utils/parseMySqlDump';
import { strToClassName } from '../utils/utils';
import { EditWordParams } from './OverlibComponents';
import { AddNewTermTooltip } from './Term/AddNewTermTooltip';
import {
  ArrV10,
  MwordClickEventDoTextText,
  WordClickEventDoTextText,
  WordDblclickEventDoTextText,
} from './readerTesterEventHandlers';

// TODO map color from termstrength type
// TODO frame
// TODO translator
// TODO add term
// TODO hover term/click term
// TODO chinese terms
// TODO data order
// TODO 'show all' for ambiguous terms

export function Reader({
  activeID,
  setActiveWord,
  setIFrameURL,
  setTranslateAPIParams,
  activeWord,
  showAll,
}: {
  // could just pass text down here instead of having to find it again? or be more uniform
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
  showAll: boolean;
}): JSX.Element {
  const [{ languages, texts, words, sentences, textitems }] = useData([
    'texts',
    'words',
    'sentences',
    'textitems',
    'languages',
  ]);
  console.log('TEST123-READER-words', activeWord);
  const [tooltipOpen, setTooltipOpen] = useState<null | number>(null);
  const [hideUntil, setHideUntil] = useState<null | number>(-1);
  const themeColors = useThemeColors();
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
    <div
      id="thetext"
      style={{
        backgroundColor: themeColors.lum6,
        padding: '2px',
        wordBreak: 'break-all',
      }}
      {...getDirTag(language)}
    >
      <p
        onClick={() => setTooltipOpen(null)}
        style={{
          // TODO
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
              TiTxID,
            } = textItem;
            const foundWord = wordLookupKeyedByTextLC[TiTextLC];
            const safeWord = foundWord
              ? foundWord
              : {
                  WoText: TiText,
                  WoTxID: TiTxID,
                  WoTextLC: TiTextLC,
                  WoStatus: 0,
                };
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
                        word={safeWord}
                        showAll={showAll}
                        hideuntil={hideUntil}
                        currcharcount={currcharcount}
                        setHideUntil={setHideUntil}
                        spanID={''}
                        hidetag={null}
                      />
                    ) : (
                      <SingleWord
                        textItem={textItem}
                        word={safeWord}
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

function SingleWord({
  textItem,
  word,
  TID,
  showAll,
  hideuntil,
  setHideUntil,
  spanID,
  currcharcount,
  hidetag,
  language,
  setTranslateAPIParams,
  onSetNewWord,
  onInsertIgnoreWord,
  onSetWordStatus,
  onSetEditingNewWord,
  onSetEditingWord,
  setIFrameURL,
  onDeleteWord,
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
  onDeleteWord: (args: Pick<Word, 'WoID'>) => void;
  setTranslateAPIParams: (
    vals: (APITranslateTerm<string, string> & { apiKey: string }) | null
  ) => void;
  onSetNewWord: (
    params: Pick<Text, 'TxID'> & Pick<TextItem, 'TiOrder'> & { txt: string }
  ) => void;
  onInsertIgnoreWord: (
    args: Pick<Text, 'TxID'> & Pick<TextItem, 'TiOrder'>
  ) => void;
  onSetWordStatus: (params: EditWordParams & Pick<Word, 'WoStatus'>) => void;
  onSetEditingNewWord: (
    params: Pick<EditWordParams, 'TiOrder' | 'TxID'> & { txt: string }
  ) => void;
  onSetEditingWord: (
    params: Pick<EditWordParams, 'TxID' | 'TiOrder'> &
      Partial<Pick<EditWordParams, 'WoID'>>
  ) => void;
  setIFrameURL: (url: string | null) => void;
}) {
  const { WoID, WoStatus } = word;
  const { TiTextLC, TiText } = textItem;
  // TODO
  const onSetAudioPosition = () => {};
  // TODO currCharCount vs totalCharCount
  const totalcharcount = 0;
  // TODO
  const titext: ArrV10 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  return (
    <span
      id={spanID}
      className={`${hidetag} click word wsty word${WoID} status${WoStatus} TERM ${strToClassName(
        TiTextLC
      )}`}
      onClick={() =>
        WordClickEventDoTextText({
          TxID: TID,
          language,
          mw: titext,
          ann: 'TODO',
          textItem,
          // TODO perhaps optional WoID
          word,
          onSetEditingNewWord,
          onSetNewWord,
          setIFrameURL,
          onDeleteWord,
          setTranslateAPIParams,
          title,
          onInsertIgnoreWord,
          onSetWordStatus,
          onSetEditingWord,
        })
      }
      onDoubleClick={() =>
        WordDblclickEventDoTextText({
          pos: currcharcount,
          onSetAudioPosition,
          totalcharcount,
        })
      }
      // TODO
      // data_trans="<?php echo tohtml(repl_tab_nl($record['WoTranslation']) . getWordTagList($record['WoID'], ' ', 1, 0)); ?>"
    >
      {TiText}
    </span>
  );
}

function MultiWord({
  textItem,
  showAll,
  hideuntil,
  totalcharcount,
  setHideUntil,
  spanID,
  currcharcount,
  hidetag,
  word,
}: {
  word: Pick<Word, 'WoStatus' | 'WoRomanization'> & { WoID?: Word['WoID'] };
  textItem: Pick<TextItem, 'TiText' | 'TiWordCount' | 'TiOrder' | 'TiTextLC'>;
  showAll: boolean;
  hideuntil: number;
  currcharcount: number;
  setHideUntil: (val: number) => void;
  spanID: string;
  hidetag: string | null;
  totalcharcount: number;
}) {
  // TODO
  const TxID = 0 as TextsID;
  const { TiText, TiWordCount, TiOrder, TiTextLC } = textItem;

  const { WoStatus, WoID } = word;
  if (WoID !== undefined) {
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
        onClick={() =>
          MwordClickEventDoTextText({
            word: { WoID, WoStatus },
            langDictData: language,
            textItem,
            title,
            TxID,
            mw: ['TODO'] as any,
          })
        }
        onDoubleClick={() =>
          WordDblclickEventDoTextText({
            totalcharcount,
            pos: currcharcount,
            onSetAudioPosition: () => {},
          })
        }
        // data_pos={currcharcount}
        // data_order={TiOrder}
        // data_wid={WoID}
        // data_trans="<?php echo tohtml(repl_tab_nl($record['WoTranslation']) . getWordTagList($record['WoID'], ' ', 1, 0)); ?>"
        // data_rom={WoRomanization}
        // data_status={WoStatus}
        // data_code={TiWordCount}
        // data_text={TiText}
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
        WordDblclickEventDoTextText({
          totalcharcount,
          pos: currcharcount,
          onSetAudioPosition: () => {},
        })
      }
      onClick={() => MwordClickEventDoTextText({ word })}
      className={`click mword ${
        showAll ? 'mwsty' : 'wsty'
      } hide order${TiOrder} TERM${strToClassName(TiTextLC)}`}
      // data_pos={currcharcount}
      // data_order={TiOrder}
      // data_code={TiWordCount}
      // data_text={TiText}
    >
      {showAll ? <>&nbsp;{TiWordCount}&nbsp;</> : <>{TiText}</>}
    </span>
  );
}
