import { useState } from 'react';
import { TextsId } from '../data/validators';
import { useData } from '../hooks/useAkita';
import { APITranslateTerm } from '../plugins/deepl.plugin';
import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from '../ui-kit/Tooltip';
import { Language, Word } from '../utils/parseMySqlDump';
import { AddNewTermTooltip } from './Term/AddNewTermTooltip';

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
  activeId,
  setActiveWord,
  setIFrameURL,
  setTranslateAPIParams,
  activeWord,
}: {
  activeId: TextsId;
  setActiveWord: (word: Word | { newWord: string } | null) => void;
  activeWord: Word | { newWord: string } | null;
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
  const activeText = texts.find((text) => text.TxID === activeId);
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
    (val) => val.TiTxID === activeId && val.TiLgID === language.LgID
  );
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
                  sentence="sentence"
                  onClose={() => setTooltipOpen(null)}
                  setIFrameURL={setIFrameURL}
                  setTranslateAPIParams={setTranslateAPIParams}
                  textLanguage={language}
                />
              </PopoverBody>
            </PopoverContent>
          )}
          {activeParsedText.map((term, ii) => {
            const { TiIsNotWord, TiTextLC, TiText, TiOrder, TiWordCount } =
              term;
            const foundWord = wordLookupKeyedByTextLC[TiTextLC];
            const $spanid = 'ID-' + TiOrder + '-' + TiWordCount;
            const termStatus = foundWord
              ? ` status${foundWord.WoStatus}`
              : ' status0';
            return (
              <>
                {!TiIsNotWord ? (
                  <PopoverTrigger
                    onClickWord={() => {
                      setActiveWord(
                        foundWord !== undefined
                          ? foundWord
                          : { newWord: TiText }
                      );
                      setTooltipOpen(ii);
                    }}
                    termStatus={termStatus}
                  >
                    {TiText}
                  </PopoverTrigger>
                ) : (
                  <>
                    <span>{TiText}</span>
                  </>
                )}
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
            {/* ' . $currcharcount . ' */}
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
export const getDirTag = (language: Language) => ({
  dir: language.LgRightToLeft ? 'rtl' : 'ltr',
});
