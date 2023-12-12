import React from 'react';
import { dataService } from '../data/data.service';
import { Language, Word } from '../data/parseMySqlDump';
import { TermStrengthOrUnknown, TermStrengths } from '../data/type';
import { useData } from '../data/useAkita';
import { A } from '../nav/InternalLink';
import { replaceTemplate } from './AddNewWordPane';
import {
  NumericalStrength,
  StrengthMap,
  StrengthMapNumericalKey,
} from './StrengthMap';
import { getStatusName } from './escape_html_chars';
import { confirmDelete } from './utils';

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
/**
 *
 */
function ExpressionsLines({
  expressions,
}: {
  expressions: string[];
}): JSX.Element {
  return (
    <>
      Expr:
      {expressions.map((expression, ii) => (
        // TODO numbers here
        <A
          href={`/edit_mword?tid=${44}&ord=${55}&txt=${expression}`}
          target="ro"
        >
          {ii + 2}
          ..
          {expression}
        </A>
      ))}
    </>
  );
}

/**
 *
 */
function TranslateLines({
  language,
  word,
  sentence,
}: {
  language: Language;
  word: string;
  sentence: string;
}): JSX.Element {
  /**
   *
   * @param translator
   */
  function TranslateWord(translator: string) {
    replaceTemplate(translator, word);
  }
  /**
   *
   * @param translator
   */
  function TranslateSentence(translator: string) {
    replaceTemplate(translator, sentence);
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
const TermTooltipClose = React.forwardRef<HTMLDivElement>(
  (
    {
      // children,
      onClose,
      ...props
    }: React.PropsWithChildren<{ onClose: () => void }>,
    ref
  ) => (
    // const { setOpen } = usePopoverContext();
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
  )
);

/**
 *
 */
function TermTooltipHeader({
  headerTitle,
  onClose,
}: {
  onClose: () => void;
  headerTitle: string;
}): JSX.Element {
  return (
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
  );
}

/**
 *
 */
export function UnknownTermLines({ word }: { word: string }): JSX.Element {
  return (
    <>
      <b>
        {word}
        <br />▶ Unknown [?]
      </b>
      <br />
      <A
        href={`_`}
        // onClick={() => dataService.updateTermStrength(w)}
        target="ro"
      >
        {/* <A href={`/insert_word_wellknown?tid=${44}&ord=${1504}`} target="ro"> */}
        I know this term well
      </A>
      <br />
      <A href={`/insert_word_ignore?tid=${44}&ord=${1504}`} target="ro">
        Ignore this term
      </A>
    </>
  );
}

/**
 *
 */
export function KnownTermLines({
  word,
  tags,
}: {
  word: Word;
  tags: string[];
}): JSX.Element {
  return (
    <>
      <b>
        {word.WoText}
        {word.WoRomanization && (
          <>
            <br />▶{word.WoRomanization}
          </>
        )}
        <br />▶{word.WoTranslation}
        {tags.length > 0 && <>, [{tags.join(', ')}]</>}
        <br />▶{StrengthMap[ReverseStrengthMap[word.WoStatus]].status} [
        {ReverseStrengthMap[word.WoStatus]}]
      </b>
      <br />
      St:
      {TermStrengths.map((strength) => {
        if (StrengthMapNumericalKey[word.WoStatus].abbr === strength) {
          return (
            <span title={getStatusName(StrengthMap[strength].classKey)}>
              {' '}
              ◆{' '}
            </span>
          );
        }
        return (
          <span
            className="clickable a"
            onClick={() =>
              dataService.updateTermStrength(
                word.WoID,
                StrengthMap[strength].classKey
              )
            }
            title={StrengthMap[strength].status}
          >
            [{strength}]{' '}
          </span>
        );
      })}
      <br />
      {/* TODO onclick */}
      <A href={`/edit_word?tid=${44}&ord=${55}&wid=${369}`} target="ro">
        Edit term
      </A>
      <A
        onClick={() => {
          // TODO update text
          if (confirmDelete()) {
            dataService.deleteTerm(word.WoID);
          }
        }}
        target="ro"
      >
        Delete term
      </A>
    </>
  );
}

/**
 *
 */
export function AddNewTermTooltip({
  word,
  sentence,
  onClose,
}: {
  word: Word | string;
  sentence: string;
  onClose: () => void;
}): JSX.Element {
  const isNewTerm = typeof word === 'string';
  const [{ languages, wordtags, tags }] = useData([
    'languages',
    'wordtags',
    'tags',
  ]);
  const tagsLookup = Object.fromEntries(
    tags.map((val) => [val.TgID, val.TgText])
  );
  const language = languages.find((lang) => lang.LgID);
  const relevantWordTags = isNewTerm
    ? []
    : wordtags
        .filter((val) => val.WtWoID === word.WoID)
        .map((val) => tagsLookup[val.WtTgID]);
  const expressions: string[] = [];
  if (!language) {
    return <></>;
  }
  const wordStr = isNewTerm ? word : word.WoText;
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
              headerTitle={isNewTerm ? 'New Word' : 'Word'}
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

                    {isNewTerm ? (
                      <UnknownTermLines word={word} />
                    ) : (
                      <KnownTermLines word={word} tags={relevantWordTags} />
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
