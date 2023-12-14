import { useState } from 'react';
import { dataService } from '../../data/data.service';
import { wordNoIdPrevalidateMap } from '../../data/preValidateMaps';
import { LanguagesId, WordsId, WordsValidator } from '../../data/validators';
import { useData } from '../../hooks/useAkita';
import { useFormInput } from '../../hooks/useFormInput';
import { APITranslateTerm } from '../../plugins/deepl.plugin';
import { Icon } from '../../ui-kit/Icon';
import { StatusRadioButtons } from '../../ui-kit/StatusRadioButtons';
import {
  AddNewWordValidator,
  Language,
  Sentence,
  Word,
} from '../../utils/parseMySqlDump';
import { textareaKeydown } from '../IO/CheckForm';
import { DictionaryLinks, GetTagsList } from './Terms.component';

/**
 * This is only called from inside the reader, rly more of a pane than a component
 */
export function AddNewWordPane({
  word,
  langId,
  onClearActiveWord,
  existingTerm = undefined,
  setIFrameURL,
  setTranslateAPIParams,
}: {
  word: string;
  // TODO
  // wordInSentence:string
  existingTerm?: Word;
  langId: LanguagesId;
  onClearActiveWord: () => void;
  setIFrameURL: (url: string | null) => void;
  setTranslateAPIParams: (
    vals: (APITranslateTerm<string, string> & { apiKey: string }) | null
  ) => void;
}): JSX.Element {
  const validator = AddNewWordValidator;
  const [{ languages }] = useData(['languages']);

  // TODO hashmap here avoid lookup
  const lang = languages.find((lang) => lang.LgID === langId);
  const {
    Input: WoInput,
    refMap,
    formErrors,
    onSubmit,
    TextArea,
  } = useFormInput({
    entry: { WoText: word || '', WoLgID: langId },
    validator,
  });

  const [showingSentences, setShowingSentences] = useState<boolean>(false);
  const isEdit = existingTerm !== undefined;
  const termStatus = isEdit ? existingTerm.WoStatus : 1;

  if (!lang) {
    throw new Error('Incorrect Language Set!');
  }
  const { LgName, LgGoogleTranslateURI, LgDict2URI, LgDict1URI } = lang;
  return (
    <>
      <form name="newword" className="validate">
        <input type="hidden" name="fromAnn" value="" />
        <WoInput type="hidden" entryKey="WoLgID" id="langfield" />
        <WoInput type="hidden" entryKey="WoCreated" id="langfield" />
        <WoInput type="hidden" entryKey="WoTextLC" />
        {/* TODO what are these */}
        <input type="hidden" name="tid" value="11" />
        <input type="hidden" name="ord" value="7" />

        <table className="tab2" cellSpacing={0} cellPadding={5}>
          <tbody>
            <tr>
              <td className="td1 right">Language:</td>
              <td className="td1">{LgName}</td>
            </tr>
            <tr title="Only change uppercase/lowercase!">
              <td className="td1 right">
                <b>{isEdit ? 'Edit' : 'New'} Term:</b>
              </td>
              <td className="td1">
                <WoInput
                  className="notempty checkoutsidebmp"
                  errorName="New Term"
                  entryKey="WoText"
                  // TODO
                  // onBlur={do_ajax_show_similar_terms}
                  id="wordfield"
                  // value={word}
                  default
                  // defaultEntry={FormState}
                  size={35}
                  isRequired
                />
              </td>
            </tr>

            <tr>
              <td className="td1 right">Translation:</td>
              <td className="td1">
                <TextArea
                  name="WoTranslation"
                  // value={FormState.WoTranslation}
                  className="setfocus checklength checkoutsidebmp"
                  maxLength={500}
                  onKeyDown={textareaKeydown}
                  errorName="Translation"
                  cols={35}
                  rows={3}
                />
              </td>
            </tr>
            {formErrors.WoTranslation && (
              <tr title="Only change uppercase/lowercase!">
                <td style={{ color: 'red' }}>ERROR</td>
                <td />
              </tr>
            )}
            <tr>
              <td className="td1 right">Tags:</td>
              <td className="td1">
                <ul
                  id="termtags"
                  // TODO tagit
                  className="tagit ui-widget ui-widget-content ui-corner-all"
                >
                  <GetTagsList
                    EntryID={existingTerm?.WoID || null}
                    tagKey="tags"
                  />
                  <li className="tagit-new">
                    <span
                      role="status"
                      aria-live="polite"
                      className="ui-helper-hidden-accessible"
                    />
                    <WoInput
                      maxLength={20}
                      size={20}
                      className="ui-widget-content ui-autocomplete-input"
                      autoComplete="off"
                      entryKey={'WoTags'}
                    />
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <td className="td1 right">Romaniz.:</td>
              <td className="td1">
                <WoInput
                  className="checkoutsidebmp"
                  errorName="Romanization"
                  entryKey="WoRomanization"
                  maxLength={100}
                  size={35}
                />
              </td>
            </tr>
            <tr>
              <td className="td1 right">
                Sentence
                <br />
                Term in :
              </td>
              <td className="td1">
                <TextArea
                  name="WoSentence"
                  className="checklength checkoutsidebmp"
                  onKeyDown={textareaKeydown}
                  maxLength={1000}
                  errorName="Sentence"
                  cols={35}
                  rows={3}
                />
              </td>
            </tr>
            <tr>
              <td className="td1 right">Status:</td>
              <td className="td1">
                <StatusRadioButtons
                  defaultStatus={termStatus}
                  refMap={refMap}
                />
              </td>
            </tr>
            <tr>
              <td className="td1 right" colSpan={2}>
                <DictionaryLinks
                  lang={lang}
                  sentenceString={refMap.WoSentence.current}
                  wordString={refMap.WoText.current}
                  setTranslateAPIParams={setTranslateAPIParams}
                  setIFrameURL={setIFrameURL}
                />
                &nbsp; &nbsp; &nbsp;
                <input
                  type="button"
                  value="Save"
                  onClick={() => {
                    onSubmit(wordNoIdPrevalidateMap, (value) => {
                      console.log('TEST123-saving word', value);
                      dataService.addTerm(value);
                      // navigator('/edit_words');
                      onClearActiveWord();
                    });
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      <div id="exsent">
        {showingSentences && existingTerm ? (
          <SentencesForWord
            word={existingTerm}
            // TODO
            onChooseSentence={(sentence) => console.log(sentence)}
          />
        ) : (
          <span
            className="click"
            onClick={() => {
              setShowingSentences(true);
            }}
          >
            <Icon src="sticky-notes-stack" title="Show Sentences" />
            Show Sentences
          </span>
        )}
      </div>
      <ul
        className="ui-autocomplete ui-front ui-menu ui-widget ui-widget-content ui-corner-all"
        id="ui-id-1"
        tabIndex={0}
      />
    </>
  );
}

/**
 * This is only called from inside the reader, rly more of a pane than a component
 */
export function EditWordPane({
  chgId,
  setTranslateAPIParams,
  setIFrameURL,
}: {
  chgId: WordsId;
  setTranslateAPIParams: (
    vals: (APITranslateTerm<string, string> & { apiKey: string }) | null
  ) => void;
  setIFrameURL: (url: string | null) => void;
}): JSX.Element {
  // TODO reset form on new word
  // TODO verify dialog on change
  const validator = WordsValidator;
  const [{ languages, words }] = useData(['languages', 'words']);
  const word = words.find((val) => val.WoID === chgId);
  if (!word) {
    throw new Error('Invalid ChgID!');
  }
  // const navigator = useInternalNavigate();
  // TODO hashmap here avoid lookup
  const lang = languages.find((lang) => lang.LgID === word.WoLgID);
  if (!lang) {
    throw new Error('Invalid langID!');
  }
  const {
    Input: WoInput,
    refMap,
    formErrors,
    onSubmit,
    TextArea,
  } = useFormInput({
    entry: { WoText: word || '', WoLgID: word.WoLgID },
    validator,
  });
  const [showingSentences, setShowingSentences] = useState<boolean>(false);

  const { WoStatus, WoText } = word;
  const { LgName, LgID, LgDict1URI, LgDict2URI, LgGoogleTranslateURI } = lang;
  return (
    <>
      <form name="newword" className="validate">
        <input type="hidden" name="fromAnn" value="" />
        <WoInput type="hidden" entryKey="WoLgID" id="langfield" value={LgID} />
        <input
          type="hidden"
          name="WoCreated"
          ref={refMap.WoCreated}
          id="langfield"
          // TODO add creation val
          value={LgID}
        />
        <WoInput
          type="hidden"
          entryKey="WoTextLC"
          // value={word?.toLowerCase()}
        />
        {/* TODO what are these */}
        <input type="hidden" name="tid" value="11" />
        <input type="hidden" name="ord" value="7" />

        <table className="tab2" cellSpacing={0} cellPadding={5}>
          <tbody>
            <tr>
              <td className="td1 right">Language:</td>
              <td className="td1">{LgName}</td>
            </tr>
            <tr title="Only change uppercase/lowercase!">
              <td className="td1 right">
                <b>{'Edit'} Term:</b>
              </td>
              <td className="td1">
                <WoInput
                  className="notempty checkoutsidebmp"
                  errorName="New Term"
                  entryKey="WoText"
                  // TODO
                  // onBlur={do_ajax_show_similar_terms}
                  id="wordfield"
                  // value={word}
                  default
                  // defaultEntry={FormState}
                  size={35}
                  isRequired
                />
              </td>
            </tr>

            <tr>
              <td className="td1 right">Translation:</td>
              <td className="td1">
                <TextArea
                  name="WoTranslation"
                  // value={FormState.WoTranslation}
                  className="setfocus checklength checkoutsidebmp"
                  onKeyDown={textareaKeydown}
                  maxLength={500}
                  errorName="Translation"
                  cols={35}
                  rows={3}
                />
              </td>
            </tr>
            {formErrors.WoTranslation && (
              <tr title="Only change uppercase/lowercase!">
                <td style={{ color: 'red' }}>ERROR</td>
                <td />
              </tr>
            )}
            <tr>
              <td className="td1 right">Tags:</td>
              <td className="td1">
                <ul
                  id="termtags"
                  // TODO tagit
                  className="tagit ui-widget ui-widget-content ui-corner-all"
                >
                  <GetTagsList EntryID={chgId} tagKey="tags" />
                  <li className="tagit-new">
                    <span
                      role="status"
                      aria-live="polite"
                      className="ui-helper-hidden-accessible"
                    />
                    <WoInput
                      maxLength={20}
                      size={20}
                      className="ui-widget-content ui-autocomplete-input"
                      autoComplete="off"
                      entryKey={''}
                    />
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <td className="td1 right">Romaniz.:</td>
              <td className="td1">
                <WoInput
                  className="checkoutsidebmp"
                  errorName="Romanization"
                  entryKey="WoRomanization"
                  maxLength={100}
                  size={35}
                />
              </td>
            </tr>
            <tr>
              <td className="td1 right">
                Sentence
                <br />
                Term in :
              </td>
              <td className="td1">
                <TextArea
                  name="WoSentence"
                  className="checklength checkoutsidebmp"
                  onKeyDown={textareaKeydown}
                  maxLength={1000}
                  errorName="Sentence"
                  cols={35}
                  rows={3}
                />
              </td>
            </tr>
            <tr>
              <td className="td1 right">Status:</td>
              <td className="td1">
                <StatusRadioButtons defaultStatus={WoStatus} refMap={refMap} />
              </td>
            </tr>
            <tr>
              <td className="td1 right" colSpan={2}>
                <DictionaryLinks
                  lang={lang}
                  sentenceString={refMap.WoSentence.current}
                  wordString={refMap.WoText.current}
                  setTranslateAPIParams={setTranslateAPIParams}
                  setIFrameURL={setIFrameURL}
                />
                &nbsp; &nbsp; &nbsp;
                <input
                  type="button"
                  value="Save"
                  onClick={() => {
                    onSubmit(wordNoIdPrevalidateMap, (value) => {
                      dataService.addTerm(value);
                      // navigator('/edit_words');
                    });
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      <div id="exsent">
        {showingSentences ? (
          <SentencesForWord
            word={word}
            // TODO
            onChooseSentence={(sentence) => console.log(sentence)}
          />
        ) : (
          <span
            className="click"
            onClick={() => {
              setShowingSentences(true);
            }}
          >
            <Icon src="sticky-notes-stack" title="Show Sentences" />
            Show Sentences
          </span>
        )}
      </div>
      <ul
        className="ui-autocomplete ui-front ui-menu ui-widget ui-widget-content ui-corner-all"
        id="ui-id-1"
        tabIndex={0}
      />
    </>
  );
}

/**
 *
 * @param templateStr
 * @param word
 */
function replaceTemplate(templateStr: string, word: string): string {
  console.log('TEST123-replaceTemplate', templateStr, word);
  // TODO template vs url branded type
  const startsWithStar = templateStr.startsWith('*');
  return (startsWithStar ? templateStr.slice(1) : templateStr).replace(
    '###',
    word
  );
}

export function MultiFunctionalURL({
  templateStr,
  word,
  setIFrameURL,
  children,
  setTranslateAPIParams,
  language,
}: React.PropsWithChildren<{
  templateStr: string;
  language: Language;
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
            // TODO get 'LgTatoebaKey' from api
            sourceKey: language.LgTatoebaKey,
            targetKey: 'eng',
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
/**
 *
 */
export function SentencesForWord({
  word,
  onChooseSentence,
}: // jsctlname,
{
  word: Word;
  onChooseSentence: (sentence: Sentence) => void;
  // jsctlname: { value: string };
}) {
  const [{ sentences, textitems, settings }] = useData([
    'sentences',
    'textitems',
    'settings',
  ]);
  const termSentenceCount = settings['set-term-sentence-count'];
  const sentenceLookupByID = Object.fromEntries(
    sentences
      .filter((val) => val.SeLgID === word.WoLgID)
      .map((val) => [val.SeID, val])
  );
  const itemsForThisWord = textitems
    .filter((ti) => ti.TiTextLC === word.WoTextLC && ti.TiLgID === word.WoLgID)
    .map((ti) => sentenceLookupByID[ti.TiSeID]);
  return (
    <>
      <p>
        <b>
          Sentences in active texts with <i>{word.WoTextLC}</i>
        </b>
      </p>
      <p>
        (Click on <Icon src="tick-button" title="Choose" /> to copy sentence
        into above term)
      </p>
      <p>
        {itemsForThisWord.slice(0, termSentenceCount).map((sentence) => (
          <>
            <span
              className="click"
              onClick={() => {
                onChooseSentence(sentence);
                // TODO
                // `${jsctlname}.value=`;
              }}
            >
              <Icon src="tick-button" title="Choose" />
            </span>{' '}
            &nbsp;
            {/* TODO make bold*/}
            {sentence.SeText}
            <br />
          </>
        ))}
      </p>
    </>
  );
}
