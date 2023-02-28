import React from 'react';
import { dataService } from '../data/data.service';
import { Languages, Words } from '../data/parseMySqlDump';
import {
  TermStrength,
  TermStrengthOrUnknown,
  TermStrengths,
} from '../data/type';
import { useData } from '../data/useAkita';
import { usePopoverContext } from './Tooltip';
type NumericalStrength = 0 | 1 | 2 | 3 | 4 | 5 | 98 | 99;
const ReverseStrengthMap: Record<NumericalStrength, TermStrengthOrUnknown> = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  98: 'Ign',
  99: 'WKn',
};
export const StrengthMap: Record<
  TermStrengthOrUnknown,
  { status: string; classKey: NumericalStrength }
> = {
  0: { status: 'Unknown', classKey: 0 },
  1: { status: 'Learning', classKey: 1 },
  2: { status: 'Learning', classKey: 2 },
  3: { status: 'Learning', classKey: 3 },
  4: { status: 'Learning', classKey: 4 },
  5: { status: 'Learned', classKey: 5 },
  Ign: { status: 'Ignored', classKey: 98 },
  WKn: { status: 'Well Known', classKey: 99 },
};
function ExpressionsLines({
  expressions,
}: {
  expressions: string[];
}): JSX.Element {
  return (
    <>
      Expr:
      {expressions.map((expressions, ii) => {
        return (
          <a href="edit_mword.php?tid=44&amp;ord=55&amp;txt=这帮" target="ro">
            {ii + 2}..{expressions}
          </a>
        );
      })}
    </>
  );
}
// TODO template vs url branded type
function ApplyTemplate(templateStr: string, valueStr: string): string {
  const replaced = templateStr.replace('###', valueStr);
  console.log('TEST123', replaced);
  return replaced;
}
function TranslateLines({
  language,
  word,
  sentence,
}: {
  language: Languages;
  word: string;
  sentence: string;
}): JSX.Element {
  function TranslateWord(translator: string) {
    ApplyTemplate(translator, word);
  }
  function TranslateSentence(translator: string) {
    ApplyTemplate(translator, sentence);
  }

  return (
    <>
      Lookup Term:
      <span
        className="click"
        onClick={() => TranslateWord(language.LgDict1URI)}
      >
        Dict1
      </span>
      {language.LgDict2URI && (
        <span
          className="click"
          onClick={() => TranslateWord(language.LgDict2URI)}
        >
          Dict2
        </span>
      )}
      <span
        className="click"
        onClick={() => TranslateWord(language.LgGoogleTranslateURI)}
      >
        GTr
      </span>
      <br />
      Lookup Sentence:
      <span
        className="click"
        onClick={() => TranslateSentence(language.LgGoogleTranslateURI)}
      >
        GTr
      </span>
    </>
  );
}
const TermTooltipClose = React.forwardRef<HTMLDivElement>(function PopoverClose(
  { children, ...props },
  ref
) {
  const { setOpen } = usePopoverContext();
  return (
    <div {...props} ref={ref} onClick={() => setOpen(false)}>
      {/* <!-- <font size={1} face="Verdana,Arial,Helvetica" color="#FFFFFF"> --> */}
      Close
      {/* </font>  */}
    </div>
  );
});

function TermTooltipHeader({
  headerTitle,
}: {
  headerTitle: string;
}): JSX.Element {
  return (
    <>
      <table width="100%" cellSpacing="0" cellPadding={2}>
        {/* border={0} */}
        <tbody>
          <tr>
            <td>
              <b>
                {/* <!-- <font lucida="" grande",arial,sans-serif,stheiti,"arial="" unicode="" ms",mingliu"="" size={3} face="" color="#FFFFFF"> --> */}
                <a
                  style={{ color: 'yellow' }}
                  href="edit_word.php?tid=44&amp;ord=55&amp;wid=369"
                  target="ro"
                >
                  {headerTitle} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                  &nbsp;
                </a>
                {/* <!-- </font> --> */}
              </b>
            </td>
            <td align="right">
              <TermTooltipClose />
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
export function UnknownTermLines({ word }: { word: string }): JSX.Element {
  return (
    <>
      {' '}
      <b>
        {word}
        <br />▶ Unknown [?]
      </b>
      <br />
      <a href="insert_word_wellknown.php?tid=44&amp;ord=1504" target="ro">
        I know this term well
      </a>
      <br />
      <a href="insert_word_ignore.php?tid=44&amp;ord=1504" target="ro">
        Ignore this term
      </a>
    </>
  );
}
export function KnownTermLines({ word }: { word: Words }): JSX.Element {
  return (
    <>
      <b>
        {word.WoText}
        <br />▶ {word.WoRomanization}
        <br />
        {/* TODO tags */}▶ {word.WoTranslation}, [HSK1]
        <br />▶{StrengthMap[ReverseStrengthMap[word.WoStatus]].status} [
        {ReverseStrengthMap[word.WoStatus]}]
      </b>
      St:
      {TermStrengths.map((strength) => {
        if (word.WoStatus === strength) {
          return <span title="Learned"> ◆</span>;
        }
        return (
          <a
            onClick={() => dataService.changeTermStrength(word.WoID, strength)}
            target="ro"
          >
            <span title={StrengthMap[strength].status}> [{strength}]</span>
          </a>
        );
      })}
      <br />
      <a href="edit_word.php?tid=44&amp;ord=55&amp;wid=369" target="ro">
        Edit term
      </a>
      |
      <a onClick={() => dataService.deleteTerm(word.WoID)} target="ro">
        Delete term
      </a>
    </>
  );
}
export function AddNewTermTooltip({
  word,
  sentence,
}: {
  word: Words | string;
  sentence: string;
}): JSX.Element {
  const newTerm = typeof word === 'string';
  const [{ languages }] = useData(['languages']);
  const language = languages.find((lang) => lang.LgID);
  if (!language) {
    return <></>;
  }
  const wordStr = newTerm ? word : word.WoText;
  // TODO on click on term, change other panes
  return (
    <table
      width="260"
      cellSpacing="0"
      cellPadding={1}
      // border={0}
      color="#333399"
    >
      <tbody>
        <tr>
          <td>
            <TermTooltipHeader headerTitle={newTerm ? 'New Word' : 'Word'} />
            <table
              width="100%"
              cellSpacing="0"
              cellPadding={2}
              // border={0}
              color="#FFFFE8"
            >
              <tbody>
                <tr>
                  <td valign="top">
                    {/* <font lucida="' grande',arial,sans-serif,stheiti,"arial="" unicode="' ms',mingliu'='" size={3} face="" color="#000000">  */}

                    {newTerm ? (
                      <UnknownTermLines word={word} />
                    ) : (
                      <KnownTermLines word={word} />
                    )}
                    <br />
                    <ExpressionsLines
                      expressions={[
                        '帮家',
                        '家伙',
                        '伙好',
                        '好脸',
                        '他',
                        '他们',
                        '们歧',
                      ]}
                    />
                    <br />
                    <TranslateLines
                      word={wordStr}
                      language={language}
                      sentence={sentence}
                    />
                    {/* </font>  */}
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
