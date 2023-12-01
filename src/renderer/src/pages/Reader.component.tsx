import { useState } from 'react';
import { Words } from '../data/parseMySqlDump';
import { useData } from '../data/useAkita';
import { TextsId } from '../data/validators';
import { AddNewTermTooltip } from './AddNewTermTooltip';
import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from './Tooltip';

// TODO map color from termstrength type
// TODO frame
// TODO translator
// TODO add term
// TODO hover term/click term
// TODO chinese terms
// TODO data order
// TODO 'show all' for ambiguous terms

export function Reader({
  activeId,
  setActiveWord,
  activeWord,
}: {
  activeId: TextsId;
  setActiveWord: (word: Words | { newWord: string } | null) => void;
  activeWord: Words | { newWord: string } | null;
}): JSX.Element {
  const [{ texts, words, parsedTexts }] = useData([
    'texts',
    'words',
    'parsedTexts',
  ]);
  const [tooltipOpen, setTooltipOpen] = useState<null | number>(null);
  const activeText = texts.find((text) => text.TxID === activeId);
  const activeParsedText = parsedTexts[activeId];
  return (
    <div id="thetext">
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
                />
              </PopoverBody>
            </PopoverContent>
          )}
          {activeText &&
            // TODO
            activeParsedText.map((term, ii) => {
              const foundWord = words.find(
                (word) => word.WoText.toLowerCase() === term.text.toLowerCase()
              );
              const termStatus = foundWord
                ? ` status${foundWord.WoStatus}`
                : ' status0';
              const { isTerm } = term;
              return (
                <>
                  {isTerm ? (
                    <PopoverTrigger
                      onClickWord={() => {
                        setActiveWord(
                          foundWord !== undefined
                            ? foundWord
                            : { newWord: term.text }
                        );
                        setTooltipOpen(ii);
                      }}
                      termStatus={termStatus}
                    >
                      {term.text}
                    </PopoverTrigger>
                  ) : (
                    <>{term.text}</>
                  )}
                </>
              );
            })}
        </Popover>{' '}
      </p>
    </div>
  );
}
