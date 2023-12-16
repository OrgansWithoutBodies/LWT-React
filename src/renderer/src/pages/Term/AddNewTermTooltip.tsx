import React from 'react';
import { useData } from '../../hooks/useData';
import { A } from '../../nav/InternalLink';
import { APITranslateTerm } from '../../plugins/deepl.plugin';
import { Language, Sentence, TextItem, Word } from '../../utils/parseMySqlDump';
import {
  DictionaryLinks,
  KnownTermLines,
  UnknownTermLines,
} from './DictionaryLinks';

function ExpressionsLines({
  expressions,
}: {
  expressions: TextItem[];
}): JSX.Element {
  return (
    <>
      Expr:
      {expressions.map((expression, ii) => (
        <A
          // TODO make sure works
          href={`/edit_mword?tid=${expression.TiTxID}&ord=${expression.TiOrder}&txt=${expression.TiText}`}
          target="ro"
        >
          {ii + 2}
          ..
          {expression.TiText}
        </A>
      ))}
    </>
  );
}

function TranslateLines({
  language,
  word,
  setIFrameURL,
  sentence,
  setTranslateAPIParams,
}: {
  language: Language;
  sentence: Sentence;
  word: string;
  setIFrameURL: (url: string | null) => void;
  setTranslateAPIParams: (
    vals: (APITranslateTerm<string, string> & { apiKey: string }) | null
  ) => void;
}): JSX.Element {
  return (
    <>
      <DictionaryLinks
        langDictData={language}
        sentenceString={sentence.SeText}
        wordString={word}
        setTranslateAPIParams={setTranslateAPIParams}
        setIFrameURL={setIFrameURL}
      />
    </>
  );
}
function TermTooltipCloseImpl(
  {
    // children,
    onClose,
    ...props
  }: React.PropsWithChildren<{ onClose: () => void }>,
  ref: React.ForwardedRef<HTMLDivElement>
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
}
const TermTooltipClose = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{ onClose: () => void }>
>(TermTooltipCloseImpl);

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

export function AddNewTermTooltip({
  word,
  sentence,
  onClose,
  setIFrameURL,
  setTranslateAPIParams,
  textLanguage,
}: {
  word: Word | string;
  sentence: Sentence;
  textLanguage: Language;
  onClose: () => void;
  setIFrameURL: (url: string | null) => void;
  setTranslateAPIParams: (
    vals: (APITranslateTerm<string, string> & { apiKey: string }) | null
  ) => void;
}): JSX.Element {
  const isNewTerm = typeof word === 'string';
  const [{ wordtags, tags }] = useData(['wordtags', 'tags']);
  const tagsLookup = Object.fromEntries(
    tags.map((val) => [val.TgID, val.TgText])
  );
  const relevantWordTags = isNewTerm
    ? []
    : wordtags
        .filter((val) => val.WtWoID === word.WoID)
        .map((val) => tagsLookup[val.WtTgID]);
  const expressions: TextItem[] = [];

  const wordStr = isNewTerm ? word : word.WoText;
  // TODO on click on term, change other panes
  return (
    <table
      width={260}
      cellSpacing={0}
      cellPadding={1}
      border={0}
      style={{
        // TODO theme color
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
                    {/* TODO */}
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
                      sentence={sentence}
                      word={wordStr}
                      language={textLanguage}
                      setIFrameURL={setIFrameURL}
                      setTranslateAPIParams={setTranslateAPIParams}
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
