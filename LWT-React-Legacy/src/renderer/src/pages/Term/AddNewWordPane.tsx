import { APITranslateTerm } from 'lwt-plugins';
import {
  AddNewWordValidator,
  LanguagesID,
  Sentence,
  Word,
  WordsID,
  WordsWithTagsValidator,
} from 'lwt-schemas';
import { dataService, useData, wordNoIDPrevalidateMap } from 'lwt-state';
import {
  EntryRow,
  Icon,
  StatusRadioButtons,
  WordTagsAutocomplete,
  useFormInput,
} from 'lwt-ui-kit';
import { useState } from 'react';
import { textareaKeydown } from '../IO/CheckForm';
import { DictionaryLinks } from './DictionaryLinks';

/**
 * This is only called from inside the reader, rly more of a pane than a component
 */
export function AddNewWordPane({
  word,
  langID,
  onClearActiveWord,
  setIFrameURL,
  setTranslateAPIParams,
  sentenceString,
}: {
  word: string;
  // TODO
  // wordInSentence:string
  sentenceString?: string;
  langID: LanguagesID;
  onClearActiveWord: () => void;
  setIFrameURL: (url: string | null) => void;
  setTranslateAPIParams: (
    vals: (APITranslateTerm<string, string> & { apiKey: string }) | null
  ) => void;
}): JSX.Element {
  // TODO
  const validator = AddNewWordValidator;
  // const validator = AddNewWordValidator;
  const [{ languages }] = useData(['languages']);

  // TODO hashmap here avoid lookup
  const lang = languages.find((lang) => lang.LgID === langID);
  const {
    Input: WoInput,
    refMap,
    formErrors,
    onSubmit,
    setDirty,
    TextArea,
  } = useFormInput({
    entry: {
      WoText: word,
      WoLgID: langID,
      WoSentence: sentenceString,
    },
    validator,
  });

  // const [showingSentences, setShowingSentences] = useState<boolean>(false);
  // const termStatus = isEdit ? existingTerm.WoStatus : 1;

  if (!lang) {
    throw new Error('Incorrect Language Set!');
  }
  const { LgName } = lang;
  const submitForm = () =>
    onSubmit(wordNoIDPrevalidateMap, (value) => {
      dataService.addTerm(value);
      onClearActiveWord();
    });
  console.log('TEST123-refmap', refMap['WoSentence']);
  return (
    <>
      <form name="newword">
        <input type="hidden" name="fromAnn" value="" />
        <WoInput type="hidden" entryKey="WoLgID" id="langfield" fixed />
        <WoInput type="hidden" entryKey="WoCreated" id="langfield" />
        <WoInput type="hidden" entryKey="WoTextLC" />
        {/* TODO what are these */}
        {/* TxID? */}
        <input type="hidden" name="tid" value="11" />
        {/* TiOrder? */}
        <input type="hidden" name="ord" value="7" />

        <table className="tab2" cellSpacing={0} cellPadding={5}>
          <tbody>
            <EntryRow headerText={'Study Language "L2"'}>{LgName}</EntryRow>
            <EntryRow
              entryTitle="Only change uppercase/lowercase!"
              headerText={`New Term`}
            >
              <WoInput
                className="notempty checkoutsidebmp"
                errorName="New Term"
                entryKey="WoText"
                // TODO
                // onBlur={()=>}
                id="wordfield"
                // value={word}
                default
                // defaultEntry={FormState}
                size={35}
                isRequired
              />
            </EntryRow>

            <EntryRow headerText={'Translation'}>
              <TextArea
                entryKey="WoTranslation"
                className="setfocus checklength checkoutsidebmp"
                maxLength={500}
                onKeyDown={(e) => textareaKeydown(e, submitForm)}
                errorName="Translation"
                cols={35}
                rows={3}
              />
            </EntryRow>
            {formErrors.WoTranslation && (
              <tr title="Only change uppercase/lowercase!">
                <td style={{ color: 'red' }}>ERROR</td>
                <td />
              </tr>
            )}
            <EntryRow headerText={'Tags'}>
              <WordTagsAutocomplete ref={refMap.taglist} onChange={setDirty} />
            </EntryRow>
            <EntryRow headerText={'Romaniz.'}>
              <WoInput
                className="checkoutsidebmp"
                errorName="Romanization"
                entryKey="WoRomanization"
                maxLength={100}
                size={35}
              />
            </EntryRow>
            <EntryRow headerText={'Sentence\nTerm in '}>
              <TextArea
                entryKey="WoSentence"
                className="checklength checkoutsidebmp"
                onKeyDown={(e) => textareaKeydown(e, submitForm)}
                maxLength={1000}
                errorName="Sentence"
                cols={35}
                rows={3}
                default
              />
            </EntryRow>
            <EntryRow headerText={'Status'}>
              <StatusRadioButtons
                defaultStatus={1}
                onChange={setDirty}
                refMap={refMap}
              />
            </EntryRow>
            <tr>
              <td className="td1 right" colSpan={2}>
                <DictionaryLinks
                  langDictData={lang}
                  // TODO this should actually just retrieve the current value on click
                  sentenceString={refMap.WoSentence.current?.value}
                  wordString={refMap.WoText.current?.value}
                  setTranslateAPIParams={setTranslateAPIParams}
                  setIFrameURL={setIFrameURL}
                />
                &nbsp; &nbsp; &nbsp;
                <input type="button" value="Save" onClick={submitForm} />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      {/* TODO? */}
      {/* <div id="exsent">
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
      </div> */}
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
  chgID,
  setTranslateAPIParams,
  setIFrameURL,
}: {
  chgID: WordsID;
  setTranslateAPIParams: (
    vals: (APITranslateTerm<string, string> & { apiKey: string }) | null
  ) => void;
  setIFrameURL: (url: string | null) => void;
}): JSX.Element {
  // TODO reset form on new word
  // TODO verify dialog on change
  const validator = WordsWithTagsValidator;
  const [{ languages, words }] = useData(['languages', 'words']);
  const word = words.find((val) => val.WoID === chgID);
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
    setDirty,
    TextArea,
  } = useFormInput({
    validator,
    entry: word,
  });
  console.log('TEST123-newword', word.WoLgID);
  const [showingSentences, setShowingSentences] = useState<boolean>(false);

  const { WoStatus } = word;
  const { LgName, LgID } = lang;
  const submitForm = () =>
    onSubmit(wordNoIDPrevalidateMap, (value) => {
      dataService.addTerm(value);
      // navigator('/edit_words');
    });
  return (
    <>
      <form name="newword">
        <input type="hidden" name="fromAnn" value="" />
        <WoInput type="hidden" entryKey="WoLgID" id="langfield" fixed />
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
                  entryKey="WoTranslation"
                  // value={FormState.WoTranslation}
                  className="setfocus checklength checkoutsidebmp"
                  onKeyDown={(e) => textareaKeydown(e, submitForm)}
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
              <WordTagsAutocomplete ref={refMap.taglist} onChange={setDirty} />
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
                  entryKey="WoSentence"
                  className="checklength checkoutsidebmp"
                  onKeyDown={(e) => textareaKeydown(e, submitForm)}
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
                  onChange={setDirty}
                  defaultStatus={WoStatus}
                  refMap={refMap}
                />
              </td>
            </tr>
            <tr>
              <td className="td1 right" colSpan={2}>
                <DictionaryLinks
                  langDictData={lang}
                  sentenceString={refMap.WoSentence.current?.value}
                  wordString={refMap.WoText.current?.value}
                  setTranslateAPIParams={setTranslateAPIParams}
                  setIFrameURL={setIFrameURL}
                />
                &nbsp; &nbsp; &nbsp;
                <input type="button" value="Save" onClick={submitForm} />
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
