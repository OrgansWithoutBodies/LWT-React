import { useState } from 'react';
import { dataService } from '../../data/data.service';
import { wordNoIdPrevalidateMap } from '../../data/preValidateMaps';
import { LanguagesId, WordsId, WordsValidator } from '../../data/validators';
import { TRefMap } from '../../forms/Forms';
import { useData } from '../../hooks/useAkita';
import { useFormInput } from '../../hooks/useFormInput';
import { APITranslateTerm } from '../../plugins/deepl.plugin';
import { Icon } from '../../ui-kit/Icon';
import {
  AddNewWordValidator,
  Language,
  Sentence,
  Word,
} from '../../utils/parseMySqlDump';
import { owin, translateSentence2 } from '../translateSentence2';
import { GetTagsList } from './Terms.component';

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
                <textarea
                  name="WoTranslation"
                  // value={FormState.WoTranslation}
                  ref={refMap.WoTranslation}
                  className="setfocus textarea-noreturn checklength checkoutsidebmp"
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
                <textarea
                  name="WoSentence"
                  className="textarea-noreturn checklength checkoutsidebmp"
                  maxLength={1000}
                  errorName="Sentence"
                  cols={35}
                  rows={3}
                  ref={refMap.WoSentence}
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
                Lookup Term:
                {/* external link */}
                <MultiFunctionalURL
                  templateStr={LgDict1URI}
                  word={word}
                  setIFrameURL={setIFrameURL}
                  setTranslateAPIParams={setTranslateAPIParams}
                  language={lang}
                >
                  Dict1
                </MultiFunctionalURL>{' '}
                {LgDict2URI && (
                  <a href={replaceTemplate(LgDict2URI, word)} target="ru">
                    Dict2
                  </a>
                )}{' '}
                {LgGoogleTranslateURI !== undefined && (
                  <>
                    <MultiFunctionalURL
                      word={word}
                      templateStr={LgGoogleTranslateURI}
                      setIFrameURL={setIFrameURL}
                      language={lang}
                      setTranslateAPIParams={setTranslateAPIParams}
                    >
                      GTr
                    </MultiFunctionalURL>{' '}
                  </>
                )}
                {LgGoogleTranslateURI !== undefined && (
                  <>
                    | Sent.:
                    <span
                      className="click"
                      onClick={() => {
                        // TODO
                        // replaceTemplate(lang.LgGoogleTranslateURI, word)
                        translateSentence2(
                          LgGoogleTranslateURI,
                          refMap.WoSentence.current
                        );
                      }}
                    >
                      GTr
                    </span>
                  </>
                )}
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
export function EditWordPane({ chgId }: { chgId: WordsId }): JSX.Element {
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
        <input
          type="hidden"
          name="WoTextLC"
          ref={refMap.WoTextLC}
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
                <textarea
                  name="WoTranslation"
                  // value={FormState.WoTranslation}
                  ref={refMap.WoTranslation}
                  className="setfocus textarea-noreturn checklength checkoutsidebmp"
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
                  className="tagit ui-widget ui-widget-content ui-corner-all"
                >
                  <GetTagsList EntryID={chgId} tagKey="TODO" />
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
                <textarea
                  name="WoSentence"
                  className="textarea-noreturn checklength checkoutsidebmp"
                  maxLength={1000}
                  errorName="Sentence"
                  cols={35}
                  rows={3}
                  ref={refMap.WoSentence}
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
                <script type="text/javascript" />
                Lookup Term:
                {/* external link */}
                <a
                  href={replaceTemplate(LgDict1URI, WoText)}
                  // TODO whats this
                  target="ru"
                >
                  Dict1
                </a>
                {LgDict2URI && (
                  <a href={replaceTemplate(LgDict2URI, WoText)} target="ru">
                    Dict2
                  </a>
                )}
                {LgGoogleTranslateURI && (
                  <span
                    className="click"
                    onClick={() => {
                      owin(replaceTemplate(LgGoogleTranslateURI, WoText));
                    }}
                  >
                    GTr
                  </span>
                )}
                {LgGoogleTranslateURI && (
                  <>
                    | Sent.:
                    <span
                      className="click"
                      onClick={() => {
                        // TODO
                        // replaceTemplate(lang.LgGoogleTranslateURI, word)
                        translateSentence2(
                          LgGoogleTranslateURI,
                          refMap.WoSentence.current
                        );
                      }}
                    >
                      GTr
                    </span>
                  </>
                )}
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
export function replaceTemplate(templateStr: string, word: string): string {
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
            // TODO get 'LgTatoebaKey' from
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
 * TODO this not updating
 */
export function StatusRadioButtons<TEntryType extends Pick<Word, 'WoStatus'>>({
  defaultStatus = 1,
  refMap,
}: {
  defaultStatus?: Word['WoStatus'];
  refMap: TRefMap<TEntryType>;
}) {
  // const [currentStatus, setcurrentStatus] = useState(second)
  const setRef = (event: React.ChangeEvent<HTMLInputElement>) => {
    refMap.WoStatus.current = event.target;
    console.log(
      'TEST123-StatusRadio-setref',
      event.target,
      refMap.WoStatus.current.value
    );
  };
  // console.log('TEST123-StatusRadio-currentStatus', currentStatus);
  return (
    <>
      <span className="status1" title="Learning">
        &nbsp;
        <input
          type="radio"
          name="WoStatus"
          value="1"
          onChange={setRef}
          checked={
            refMap.WoStatus.current === null ||
            refMap.WoStatus.current.value === '1'
          }
          ref={refMap.WoStatus}
        />
        1&nbsp;
      </span>
      <span className="status2" title="Learning">
        &nbsp;
        <input
          type="radio"
          name="WoStatus"
          onChange={setRef}
          checked={
            refMap.WoStatus.current && refMap.WoStatus.current.value === '2'
          }
          value="2"
        />
        2&nbsp;
      </span>
      <span className="status3" title="Learning">
        &nbsp;
        <input
          type="radio"
          name="WoStatus"
          checked={
            refMap.WoStatus.current && refMap.WoStatus.current.value === '3'
          }
          onChange={setRef}
          value="3"
        />
        3&nbsp;
      </span>
      <span className="status4" title="Learning">
        &nbsp;
        <input
          onChange={setRef}
          type="radio"
          name="WoStatus"
          checked={
            refMap.WoStatus.current && refMap.WoStatus.current.value === '4'
          }
          value="4"
        />
        4&nbsp;
      </span>
      <span className="status5" title="Learned">
        &nbsp;
        <input
          type="radio"
          onChange={setRef}
          name="WoStatus"
          checked={
            refMap.WoStatus.current && refMap.WoStatus.current.value === '5'
          }
          value="5"
        />
        5&nbsp;
      </span>
      <span className="status99" title="Well Known">
        &nbsp;
        <input
          type="radio"
          onChange={setRef}
          name="WoStatus"
          checked={
            refMap.WoStatus.current && refMap.WoStatus.current.value === '99'
          }
          value="99"
        />
        WKn&nbsp;
      </span>
      <span className="status98" title="Ignored">
        &nbsp;
        <input
          onChange={setRef}
          type="radio"
          name="WoStatus"
          value="98"
          checked={
            refMap.WoStatus.current && refMap.WoStatus.current.value === '98'
          }
        />
        Ign&nbsp;
      </span>
    </>
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
