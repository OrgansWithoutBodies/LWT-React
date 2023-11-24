import React from 'react';
import { dataService } from '../data/data.service';
import { Languages, Words } from '../data/parseMySqlDump';
import { TermStrengthOrUnknown, TermStrengths } from '../data/type';
import { useData } from '../data/useAkita';
import { A } from '../nav/InternalLink';
type NumericalStrength = 0 | 1 | 2 | 3 | 4 | 5 | 98 | 99;
// TODO dedupe with STATUSES
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
      {expressions.map((expression, ii) => {
        return (
          // TODO numbers here
          <A
            href={`/edit_mword?tid=${44}&ord=${55}&txt=${expression}`}
            target="ro"
          >
            {ii + 2}..{expression}
          </A>
        );
      })}
    </>
  );
}
// TODO template vs url branded type
function ApplyTemplate(templateStr: string, valueStr: string): string {
  const replaced = templateStr.replace('###', valueStr);
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
  {
    // children,
    onClose,
    ...props
  }: React.PropsWithChildren<{ onClose: () => void }>,
  ref
) {
  // const { setOpen } = usePopoverContext();
  return (
    <div
      className="click"
      {...props}
      ref={ref}
      onClick={() => {
        console.log('CLOSE');
        // setOpen(false);
        onClose();
      }}
    >
      {/* <!-- <font size={1} face="Verdana,Arial,Helvetica" color="#FFFFFF"> --> */}
      Close
      {/* </font>  */}
    </div>
  );
});

function TermTooltipHeader({
  headerTitle,
  onClose,
}: {
  onClose: () => void;
  headerTitle: string;
}): JSX.Element {
  return (
    <>
      <table width="100%" cellSpacing={0} cellPadding={2}>
        {/* border={0} */}
        <tbody>
          <tr>
            <td>
              <b>
                {/* <!-- <font lucida="" grande",arial,sans-serif,stheiti,"arial="" unicode="" ms",mingliu"="" size={3} face="" color="#FFFFFF"> --> */}
                <A
                  style={{ color: 'yellow' }}
                  href={`/edit_word?tid=${44}&ord=${55}&wid=${369}`}
                  target="ro"
                >
                  {headerTitle} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                  &nbsp;
                </A>
                {/* <!-- </font> --> */}
              </b>
            </td>
            <td align="right">
              <TermTooltipClose onClose={onClose} />
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
      <b>
        {word}
        <br />▶ Unknown [?]
      </b>
      <br />
      <A href={`/insert_word_wellknown?tid=${44}&ord=${1504}`} target="ro">
        I know this term well
      </A>
      <br />
      <A href={`/insert_word_ignore?tid=${44}&ord=${1504}`} target="ro">
        Ignore this term
      </A>
    </>
  );
}
export function KnownTermLines({
  word,
  tags,
}: {
  word: Words;
  tags: string[];
}): JSX.Element {
  return (
    <>
      <b>
        {word.WoText}
        <br />▶ {word.WoRomanization}
        <br />▶ {word.WoTranslation}, [{tags.join(', ')}]
        <br />▶{/* TODO why undef */}
        {StrengthMap[ReverseStrengthMap[word.WoStatus]]
          ? StrengthMap[ReverseStrengthMap[word.WoStatus]].status
          : ''}{' '}
        [{ReverseStrengthMap[word.WoStatus]}]
      </b>
      St:
      {TermStrengths.map((strength) => {
        if (word.WoStatus === strength) {
          return <span title="Learned"> ◆</span>;
        }
        return (
          <span
            onClick={() => dataService.changeTermStrength(word.WoID, strength)}
            title={StrengthMap[strength].status}
          >
            [{strength}]
          </span>
        );
      })}
      <br />
      <A href={`/edit_word?tid=${44}&ord=${55}&wid=${369}`} target="ro">
        Edit term
      </A>
      |
      <A onClick={() => dataService.deleteTerm(word.WoID)} target="ro">
        Delete term
      </A>
    </>
  );
}
// TODO why not working
export function AddNewTermTooltip({
  word,
  sentence,
  onClose,
}: {
  word: Words | string;
  sentence: string;
  onClose: () => void;
}): JSX.Element {
  const newTerm = typeof word === 'string';
  const [{ languages }] = useData(['languages']);
  const language = languages.find((lang) => lang.LgID);
  const expressions: string[] = [];
  if (!language) {
    return <></>;
  }
  console.log('TEST123-tooltip', word, sentence, newTerm);
  const wordStr = newTerm ? word : word.WoText;
  // TODO on click on term, change other panes
  return (
    <table
      width={260}
      cellSpacing={0}
      cellPadding={1}
      border={0}
      style={{
        backgroundColor: '#333399',
      }}
    >
      <tbody>
        <tr>
          <td>
            <TermTooltipHeader
              headerTitle={newTerm ? 'New Word' : 'Word'}
              onClose={onClose}
            />
            <table
              width="100%"
              cellSpacing={0}
              cellPadding={2}
              border={0}
              style={{ backgroundColor: '#FFFFE8', color: '#000000' }}
            >
              <tbody>
                <tr>
                  <td valign="top">
                    {/* <font lucida="' grande',arial,sans-serif,stheiti,"arial="" unicode="' ms',mingliu'='" size={3} face="" color="#000000">  */}

                    {newTerm ? (
                      <UnknownTermLines word={word} />
                    ) : (
                      <KnownTermLines word={word} tags={[]} />
                    )}
                    <br />
                    <ExpressionsLines expressions={expressions} />
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
