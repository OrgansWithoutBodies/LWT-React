import { useState } from 'react';
import { Language, Text } from '../data/parseMySqlDump';
import { useData } from '../data/useAkita';
import { CheckTextsValidator } from '../data/validators';
import { parseNumMap } from '../forms/Forms';
import { useFormInput } from '../hooks/useFormInput';
import { Header } from '../ui-kit/Header';
import { RequiredLineButton } from '../ui-kit/Icon';
import { getDirTag } from './Reader.component';
import { NavigateButton } from './Statistics.component';
import {
  cleanText,
  remove_spaces,
  replaceTabsWithNewLine,
  splitCheckText,
} from './utils';

/**
 *
 */
export function CheckTextPage() {
  const [checkingText, setCheckingText] = useState<null | Text>(null);
  return (
    <>
      {checkingText ? (
        <TextChecker potentialText={checkingText} />
      ) : (
        <CheckText onCheckText={setCheckingText} />
      )}
    </>
  );
}

export type OnCheckText = (text: null | Text) => void;

// TODO bring into edit/adding text
/**
 *
 */
export function CheckText({
  onCheckText,
}: {
  onCheckText: OnCheckText;
}): JSX.Element {
  const validator = CheckTextsValidator;
  const { refMap, LanguageSelectInput, onSubmit } = useFormInput({ validator });
  return (
    <>
      <Header title="Check Text" />

      <p>&nbsp;</p>
      <form className="validate" action="/check_text" method="post">
        <table className="tab3" cellSpacing={0} cellPadding={5}>
          <tbody>
            <tr>
              <td className="td1 right">Language:</td>
              <td className="td1">
                <LanguageSelectInput
                  isRequired
                  entryKey={'TxLgID'}
                  // onChange={(val) => setLanguageForText(val)}
                />
              </td>
            </tr>
            <tr>
              <td className="td1 right">
                Text:
                <br />
                <br />
                (max.
                <br />
                65,000
                <br />
                bytes)
              </td>
              <td className="td1">
                <textarea
                  ref={refMap.TxText}
                  name="TxText"
                  className="notempty checkbytes checkoutsidebmp"
                  maxLength={65000}
                  errorName="Text"
                  cols={60}
                  rows={20}
                />
                <RequiredLineButton />
              </td>
            </tr>
            <tr>
              <td className="td1 right" colSpan={2}>
                <NavigateButton value="<< Back" navigateTo="/" />
                <input
                  type="button"
                  name="op"
                  value="Check"
                  onClick={() => {
                    onSubmit({ TxLgID: parseNumMap }, (validated) => {
                      onCheckText(validated);
                    });
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </>
  );
}

// TODO
// if (strlen(prepare_textdata($_REQUEST['TxText'])) > 65000) {
//   $message = "Error: Text too long, must be below 65000 Bytes";
//   if ($no_pagestart)
//     pagestart('My ' . getLanguage($currentlang) . ' Texts', true);

/**
 *
 */
export function TextChecker({
  // TODO better name
  potentialText: { TxText, TxLgID },
}: {
  potentialText: Text;
}) {
  const [{ languages }] = useData(['languages']);
  const language = languages.find((val) => val.LgID === TxLgID);
  if (!language) {
    throw new Error('Invalid lgid');
  }

  return (
    <>
      <Header title="Check Text" />
      <p>
        <input
          type="button"
          value="&lt;&lt; Back"
          onClick={() => window.history.back()}
        />
      </p>
      <CheckTextSentences language={language} $s={TxText} />
      <p>
        <input
          type="button"
          value="&lt;&lt; Back"
          onClick={() => window.history.back()}
        />
      </p>
    </>
  );
}
/**
 *
 */
export function CheckTextSentences({
  language,
  $s,
}: {
  language: Language;
  $s: string;
}) {
  const { LgRemoveSpaces: removeSpaces } = language;
  // const wordList = [];
  const [{ words }] = useData(['words']);
  const {
    sArray: textlines,
    wordCount,
    sepsCount,
  } = splitCheckText($s, language);
  // const sentNumber = 0;
  // TODO
  const anz = 0;

  return (
    <>
      <div style={{ marginRight: '50px' }}>
        <h4>Text</h4>
        <p {...getDirTag(language)}>
          {cleanText($s, language.LgSplitEachChar)
            .split('¶')
            .map((val) => (
              <>
                {val}
                <br />
                <br />
              </>
            ))}
        </p>
        <h4>Sentences</h4>
        <ol>
          {textlines.map(
            (value) => (
              <li {...getDirTag(language)}>
                {remove_spaces(value.SeText, removeSpaces)}
              </li>
            )
            // lineWords[sentNumber] = preg_split('/([^' . termchar . ']{1,})/u', value, -1, PREG_SPLIT_DELIM_CAPTURE);
            // l = count(lineWords[sentNumber]);
            // for (i = 0; i < l; i++) {
            //   term = mb_strtolower(lineWords[sentNumber][i], 'UTF-8');
            //   if (term != '') {
            //     if (i % 2 == 0) {
            //       if (array_key_exists(term, wordList)) {
            //         wordList[term][0]++;
            //         wordList[term][1][] = sentNumber;
            //       } else {
            //         wordList[term] = array(1, array(sentNumber));
            //       }
            //     } else {
            //       ww = remove_spaces(term, removeSpaces);
            //       if (array_key_exists(ww, wordSeps))
            //         wordSeps[ww]++;
            //       else
            //         wordSeps[ww] = 1;
            //     }
            //   }}
            // sentNumber += 1;
          )}
        </ol>
        <h4>
          Word List <span className="red2">(red = already saved)</span>
        </h4>
        <ul>
          {/* ksort(wordList); */}
          {/* anz = 0; */}
          {Object.keys(wordCount)
            .sort((a, b) => (a > b ? 1 : -1))
            .map((key) => {
              const trans = words.find((word) => word.WoTextLC === key);
              // trans = get_first_value("select WoTranslation as value from " . tbpref . "words where WoLgID = " . lid . " and WoTextLC = " . convert_string_to_sqlsyntax(key));
              // TODO when does this happen?
              // if (trans == '*') {
              //   trans = '';
              // }

              return trans !== undefined ? (
                <>
                  <li {...getDirTag(language)}>
                    <span className="red2">
                      [{key}] — {wordCount[key]} -{' '}
                      {replaceTabsWithNewLine(trans.WoTranslation)}
                    </span>
                  </li>
                </>
              ) : (
                <li {...getDirTag(language)}>
                  [{key}] — {wordCount[key]}
                </li>
              );

              // anz++;
            })}
        </ul>
        <p>TOTAL: {anz}</p>
        <h4>Non-Word List</h4>
        <ul>
          {/* ksort(wordSeps); */}
          {/* anz = 0; */}
          {Object.keys(sepsCount).map(
            (key) => (
              <li>
                [
                {key.split(' ').map((val) => (
                  <>
                    {val}
                    <span className="backgray">&nbsp;</span>
                  </>
                ))}
                ] — {sepsCount[key]}
              </li>
            )
            // anz++;
          )}
        </ul>
        <p>TOTAL: {anz}</p>
      </div>
    </>
  );
}
