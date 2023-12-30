import { confirmDelete, replaceTemplate } from 'lwt-common';
import {
  Language,
  ReverseStrengthMap,
  StrengthMap,
  StrengthMapNumericalKey,
  TermStrengths,
  getStatusName,
} from 'lwt-schemas';
import { dataService } from 'lwt-state';
import { A, useI18N } from 'lwt-ui-kit';
import React from 'react';
import { APITranslateTerm } from '../../plugins/deepl.plugin';
import { LanguageDictionaryData, WordKnownTermLines } from '../limitedTypes';

export type LanguageDictionaryDataTempHack = LanguageDictionaryData &
  Pick<
    Language,
    // TODO dont rely on tatoebakey here explicitly
    'LgTatoebaSourceKey' | 'LgTatoebaTargetKey'
  >;

export function DictionaryLinks({
  langDictData: langDictData,
  sentenceString: sentenceString,
  wordString: wordString,
  setTranslateAPIParams,
  setIFrameURL,
  breakSent,
}: {
  langDictData: LanguageDictionaryDataTempHack;
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
    // TODO get 'LgTatoebaSourceKey' from api
    LgTatoebaSourceKey: sourceKey,
    LgTatoebaTargetKey: targetKey,
  } = langDictData;
  const t = useI18N();
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
          {breakSent ? `| ${t('Sent.')}` : t('Lookup Sentence')}:
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
  // TODO maybe pass params to templateStr?
  const apiStrPos = templateStr.indexOf('api://');
  if (apiStrPos === 0) {
    return (
      <span
        className="a"
        onClick={() =>
          setTranslateAPIParams({
            sourceKey,
            targetKey,
            // TODO able to get word here? or just update entire component?
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
  const isTemplate = templateStr.includes('###');
  if (isTemplate) {
    return (
      // TODO target specific new frame?
      <a target="_blank" href={replaceTemplate(templateStr, word)}>
        {children}
      </a>
    );
  }
  return (
    <a target="_blank" href={`${templateStr}${word}`}>
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
  const t = useI18N();
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
      {t('St')}:
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
      <A
        // TODO
        // onClick={() => onEditWord({wid:word.WoID,ord:TODO,tid:TODO})}
        // href={`/edit_word?tid=${44}&ord=${55}&wid=${word.WoID}`}
        target="ro"
      >
        Edit term
      </A>
      <A
        onClick={() => {
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
  const t = useI18N();
  return (
    <>
      <b>
        {word}
        <br />▶ {t('Unknown')} [?]
      </b>
      <br />
      <A
        // TODO
        // onClick={() => dataService.updateTermStrength(w)}
        target="ro"
      >
        I know this term well
      </A>
      <br />
      <A
        // TODO
        // onClick={() => dataService.updateTermStrength(w)}
        target="ro"
      >
        Ignore this term
      </A>
    </>
  );
}
