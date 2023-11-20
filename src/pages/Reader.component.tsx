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
}: {
  activeId: TextsId;
  setActiveWord: (word: string) => void;
}): JSX.Element {
  const [{ texts, words }] = useData(['texts', 'words']);
  const activeText = texts.find((text) => text.TxID === activeId);
  return (
    <div id="thetext">
      <p
        style={{
          // wordBreak: 'break-all',
          // whiteSpace: 'nowrap',
          fontSize: '200%',
          lineHeight: 1.4,
          marginBottom: '10px',
        }}
      >
        {activeText &&
          // TODO
          activeText.TxText.split('\n').map((par) =>
            par.split('. ').map((sentence) => {
              return sentence.split(' ').map((rawTerm, ii) => {
                const term = rawTerm
                  .toLowerCase()
                  .replace('.', '')
                  .replace(',', '');
                const foundWord = words.find(
                  (word) => word.WoText.toLowerCase() === term
                );
                // TODO non-highlighted words (ie punctuation)
                const termStatus = foundWord
                  ? ` status${foundWord.WoStatus}`
                  : ' status0';
                return (
                  // TODO make sure works w mobile
                  // TODO only one tooltip open at a time
                  <Popover>
                    <PopoverContent className="Popover">
                      <PopoverBody>
                        <AddNewTermTooltip
                          word={foundWord || term}
                          sentence={sentence}
                        />
                      </PopoverBody>
                    </PopoverContent>

                    <PopoverTrigger
                      onClickWord={() =>
                        setActiveWord(foundWord?.WoText || term)
                      }
                      termStatus={termStatus}
                    >
                      {term}
                    </PopoverTrigger>
                  </Popover>
                );
              });
            })
          )}
      </p>
    </div>
  );
}

{
  /* <span id="ID-12-1" class=" click word wsty status0 TERM石" data_pos="7" data_order="12" data_trans="" data_rom="" data_status="0" data_wid="" data_mw2="石破" data_mw3="石破天" data_mw4="石破天惊" data_mw5="石破天惊民" data_mw6="石破天惊民主" data_mw7="石破天惊民主化" data_mw8="石破天惊民主化列" data_mw9="石破天惊民主化列车" title="石
▶ Unknown [?]">石</span> */
}
