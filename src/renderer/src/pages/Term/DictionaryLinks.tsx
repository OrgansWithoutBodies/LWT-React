import React from 'react';
import { dataService } from '../../data/data.service';
import { TermStrengths } from '../../data/type';
import { A } from '../../nav/InternalLink';
import { APITranslateTerm } from '../../plugins/deepl.plugin';
import { Language } from '../../utils/parseMySqlDump';
import { confirmDelete } from '../../utils/utils';
import {
  ReverseStrengthMap,
  StrengthMap,
  StrengthMapNumericalKey,
  getStatusName,
} from '../StrengthMap';
import { LanguageDictionaryData, WordKnownTermLines } from './limitedTypes';

/**
 *
 */
export function DictionaryLinks({
  lang,
  sentenceString: sentenceString,
  wordString: wordString,
  setTranslateAPIParams,
  setIFrameURL,
  breakSent,
}: {
  lang: LanguageDictionaryData &
    Pick<
      Language,
      // TODO dont rely on tatoebakey here explicitly
      'LgTatoebaKey'
    >;
  sentenceString: string;
  wordString: string;
  setTranslateAPIParams: (
    vals: (APITranslateTerm<string, string> & { apiKey: string }) | null
  ) => void;
  setIFrameURL: (url: string | null) => void;
  breakSent?: boolean;
}) {
  const {
    LgDict1URI,
    LgDict2URI,
    LgGoogleTranslateURI,
    // TODO get 'LgTatoebaKey' from api
    LgTatoebaKey: sourceKey,
  } = lang;

  // TODO
  const targetKey = 'eng';
  return (
    <>
      Lookup Term:
      <MultiFunctionalURL
        templateStr={LgDict1URI}
        word={wordString}
        setIFrameURL={setIFrameURL}
        setTranslateAPIParams={setTranslateAPIParams}
        sourceKey={sourceKey}
        targetKey={targetKey}
      >
        Dict1
      </MultiFunctionalURL>
      {LgDict2URI && (
        <MultiFunctionalURL
          templateStr={LgDict2URI}
          word={wordString}
          setIFrameURL={setIFrameURL}
          setTranslateAPIParams={setTranslateAPIParams}
          sourceKey={sourceKey}
          targetKey={targetKey}
        >
          Dict2
        </MultiFunctionalURL>
      )}
      {LgGoogleTranslateURI && (
        <MultiFunctionalURL
          templateStr={LgGoogleTranslateURI}
          word={wordString}
          setIFrameURL={setIFrameURL}
          setTranslateAPIParams={setTranslateAPIParams}
          sourceKey={sourceKey}
          targetKey={targetKey}
        >
          GTr
        </MultiFunctionalURL>
      )}
      {breakSent && <br />}
      {LgGoogleTranslateURI && (
        <>
          {breakSent ? '| Sent.' : 'Lookup Sentence'}:
          <MultiFunctionalURL
            templateStr={LgGoogleTranslateURI}
            word={sentenceString}
            setIFrameURL={setIFrameURL}
            setTranslateAPIParams={setTranslateAPIParams}
            sourceKey={sourceKey}
            targetKey={targetKey}
          >
            GTr
          </MultiFunctionalURL>
        </>
      )}
    </>
  );
}
/**
 *
 */
export function MultiFunctionalURL({
  templateStr,
  word,
  setIFrameURL,
  children,
  setTranslateAPIParams,
  sourceKey,
  targetKey,
}: React.PropsWithChildren<{
  templateStr: string;
  sourceKey: string;
  targetKey: string;
  word: string;
  setIFrameURL: (url: string | null) => void;
  setTranslateAPIParams: (
    vals: (APITranslateTerm<string, string> & { apiKey: string }) | null
  ) => void;
}>) {
  const apiStrPos = templateStr.indexOf('api://');
  if (apiStrPos === 0) {
    console.log('TEST123-API', word);
    return (
      <span
        className="a"
        onClick={() =>
          setTranslateAPIParams({
            sourceKey,
            targetKey,
            word,
            apiKey: templateStr.slice(6),
          })
        }
      >
        {children}
      </span>
    );
  }
  const startsWithStar = templateStr.startsWith('*');
  if (!startsWithStar) {
    return (
      <span
        className="a"
        onClick={() => setIFrameURL(replaceTemplate(templateStr, word))}
      >
        {children}
      </span>
    );
  }
  return (
    // TODO target specific new frame?
    <a target="_blank" href={replaceTemplate(templateStr, word)}>
      {children}
    </a>
  );
}
export function KnownTermLines({
  word,
  tags,
}: {
  word: WordKnownTermLines;
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
export function UnknownTermLines({ word }: { word: string }): JSX.Element {
  return (
    <>
      <b>
        {word}
        <br />▶ Unknown [?]
      </b>
      <br />
      <A
        // href={`_`}
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
 * @param templateStr
 * @param word
 */

export function replaceTemplate(templateStr: string, word: string): string {
  console.log('TEST123-replaceTemplate', templateStr, word);
  // TODO template vs url branded type
  const startsWithStar = templateStr.startsWith('*');
  return (startsWithStar ? templateStr.slice(1) : templateStr).replace(
    '###',
    word
  );
}
