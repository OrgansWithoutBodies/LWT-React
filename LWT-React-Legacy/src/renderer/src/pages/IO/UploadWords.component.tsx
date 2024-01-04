import { TermParsedFromCSV, parseTermsFromCSV } from 'lwt-common';
import { StrengthMap, UploadTermsValidator } from 'lwt-schemas';
import { dataService, parseNumMap, useData } from 'lwt-state';
import {
  Header,
  RequiredLineButton,
  SelectBoolean,
  useFormInput,
  useI18N,
  useInternalNavigate,
} from 'lwt-ui-kit';
import { GoBackButton } from '../../../../../../LWT-UI-Kit/src/GoBackButton';
import { GetWordstatusSelectoptions } from '../PrintAnnotate/PrintText.component';

/**
 *
 */
export function UploadWords() {
  const [{ languages }] = useData(['languages']);
  const navigator = useInternalNavigate();
  const validator = UploadTermsValidator(languages);
  const {
    refMap,
    Input: UlInput,
    TextArea,
    onSubmit,
    LanguageSelectInput,
  } = useFormInput({ validator });
  const t = useI18N();
  return (
    <>
      <Header title="Import Terms" />
      <form encType="multipart/form-data">
        <UlInput entryKey="columns" type="hidden" />
        <table className="tab3" cellSpacing={0} cellPadding={5}>
          <tr>
            <td className="td1 center">
              <b>Language:</b>
            </td>
            <td className="td1">
              <LanguageSelectInput entryKey="WoLgID" />
            </td>
          </tr>
          <tr>
            <td className="td1 center">
              <b>{t('Import Data')}:</b>
              <br />
              <br />
              Format per line:
              <br />
              C1 D C2 D C3 D C4 D C5
              <br />
              <br />
              <b>Field Delimiter "D":</b>
              <br />
              <select name="Tab" ref={refMap.delimiter}>
                <option value="c" selected>
                  Comma "," [CSV File, LingQ]
                </option>
                <option value="t">TAB (ASCII 9) [TSV File]</option>
                <option value="h">Hash "#" [Direct Input]</option>
              </select>
              <br />
              <br />
              <b>Column Assignment:</b>
              <br />
              "C1":{' '}
              <select ref={refMap.c1} name="Col1">
                {ImportColumnAssignmentSelectOptions({ selected: 'w' })}
              </select>
              <br />
              "C2":{' '}
              <select ref={refMap.c2} name="Col2">
                {ImportColumnAssignmentSelectOptions({ selected: 't' })}
              </select>
              <br />
              "C3":{' '}
              <select ref={refMap.c3} name="Col3">
                {ImportColumnAssignmentSelectOptions({ selected: 'x' })}
              </select>
              <br />
              "C4":{' '}
              <select ref={refMap.c4} name="Col4">
                {ImportColumnAssignmentSelectOptions({ selected: 'x' })}
              </select>
              <br />
              "C5":{' '}
              <select ref={refMap.c5} name="Col4">
                {ImportColumnAssignmentSelectOptions({ selected: 'x' })}
              </select>
              <br />
              <b>
                overwrite existent
                <br />
                terms
              </b>
              :
              <SelectBoolean
                entry={{ over: 1 }}
                entryKey={'over'}
                refMap={refMap}
              />
              <br />
              <br />
              <b>Important:</b>
              <br />
              You must specify the term.
              <br />
              Translation, romanization, <br />
              sentence and tag list
              <br />
              are optional. The tag list <br />
              must be separated either
              <br />
              by spaces or commas.
            </td>
            <td className="td1">
              Either specify a <b>File to upload</b>
              :
              <br />
              <UlInput entryKey="file" type="file" />
              <br />
              <br />
              {/* TODO use this */}
              <b>Or</b> type in or paste from clipboard (do <b>NOT</b> specify
              {/* TODO use validator to specify not both */}
              file):
              <br />
              <TextArea
                className="checkoutsidebmp"
                errorName="Upload"
                entryKey="TextField"
                cols={60}
                rows={25}
              />
            </td>
          </tr>
          <tr>
            <td className="td1 center">
              <b>Status</b> for all uploaded terms:
            </td>
            <td className="td1">
              <select
                ref={refMap.WoStatus}
                className="notempty"
                name="WoStatus"
              >
                {(
                  Object.keys(StrengthMap).filter(
                    (val) => val !== 0
                  ) as (keyof typeof StrengthMap)[]
                ).map((key) => (
                  <option value={StrengthMap[key].classKey} key={key}>
                    {StrengthMap[key].status} [{key}]
                  </option>
                ))}
                {/* TODO */}
                <GetWordstatusSelectoptions
                  v={null}
                  all={false}
                  not9899={false}
                />
              </select>{' '}
              <RequiredLineButton />
            </td>
          </tr>
          <tr>
            <td className="td1 center" colSpan={2}>
              <span className="red2">
                A DATABASE{' '}
                <input
                  type="button"
                  value="BACKUP"
                  onClick={() => navigator('/backup_restore')}
                />{' '}
                MAY BE ADVISABLE!
                <br />
                PLEASE DOUBLE-CHECK EVERYTHING!
              </span>
              <br />
              <input
                type="button"
                value="&lt;&lt; Back"
                onClick={() => navigator('/')}
              />{' '}
              &nbsp; &nbsp; &nbsp; | &nbsp; &nbsp; &nbsp;{' '}
              <input
                type="button"
                name="op"
                value="Import"
                onClick={async () => {
                  if (
                    !window.confirm(
                      'Did you double-check everything?\nAre you sure?'
                    )
                  ) {
                    return;
                  }
                  onSubmit(
                    {
                      columns: (_, refMap) => [
                        refMap.c1.current.value,
                        refMap.c2.current.value,
                        refMap.c3.current.value,
                        refMap.c4.current.value,
                        refMap.c5.current.value,
                      ],
                      WoLgID: parseNumMap,
                      over: parseNumMap,
                      WoStatus: parseNumMap,
                      file: (_, { file }) => ({
                        // TODO this object confuses error handling - compound path
                        file: file.current.files[0] || false,
                        fileName: file.current.files[0]?.name,
                        fileType: file.current.files[0]?.type,
                      }),
                    },
                    // TODO maybe have a nested checkValidate so that we also validate that the terms that get parsed end up being valid?
                    async (value) => {
                      const parsedTerms = await parseTermsFromCSV(value);
                      dataService.addMultipleTerms(parsedTerms);
                    }
                  );
                }}
              />
            </td>
          </tr>
        </table>
      </form>

      <p>
        Sentences should contain the term in curly brackets {'"... {term} ..."'}
        .
        <br />
        If not, such sentences can be automatically created later with the{' '}
        <br />
        "Set Term Sentences" action in the{' '}
        <input
          type="button"
          value="My Texts"
          onClick={() => navigator('/edit_texts')}
        />{' '}
        screen.
      </p>
    </>
  );
}
function ImportColumnAssignmentSelectOptions({
  selected,
}: {
  selected: 'w' | 't' | 'r' | 's' | 'g' | 'x';
}) {
  return (
    <>
      <option value="w" selected={selected === 'w'}>
        Term
      </option>
      <option value="t" selected={selected === 't'}>
        Translation
      </option>
      <option value="r" selected={selected === 'r'}>
        Romanization
      </option>
      <option value="s" selected={selected === 's'}>
        Sentence
      </option>
      <option value="g" selected={selected === 'g'}>
        Tag List
      </option>
      <option value="x" selected={selected === 'x'}>
        Don't import
      </option>
    </>
  );
}

// TODO
/**
 *
 */
export function ImportedWordsReport({
  importedTerms,
  overwrite,
}: {
  importedTerms: TermParsedFromCSV[];
  overwrite: boolean;
}) {
  const [{ languageHashmap }] = useData(['languageHashmap']);
  const t = useI18N();
  const lang = languageHashmap[importedTerms[0].WoLgID];
  // const excnt= 				   get_first_value('select count(*) as value from ' . $tbpref . 'words where WoLgID = ' . $lang . ' and WoTextLC=' . convert_string_to_sqlsyntax($wl));
  // TODO
  const excnt = 0;
  // TODO
  const working = false;
  const exists = excnt > 0;
  // const 	 					$msg1 = runsql('delete from ' . $tbpref . 'words where WoLgID = ' . $lang . ' and WoTextLC=' . convert_string_to_sqlsyntax($wl), "Exists, deleted");
  const $msg1 = '';
  // const 	 					$msg2 = runsql('insert into ' . $tbpref . 'words (WoLgID, WoTextLC, WoText, WoStatus, WoTranslation, WoRomanization, WoSentence, WoStatusChanged,' .  make_score_random_insert_update('iv') . ') values ( ' . $lang . ', ' .
  const $msg2 = '';
  let $sqlct = 0;
  return (
    <>
      <h4>
        Import Report (Language: {lang.LgName}, Status: {status})
      </h4>
      <table className="tab1" cellSpacing="0" cellPadding="5">
        <tr>
          <th className="th1">Line</th>
          <th className="th1">Term</th>
          <th className="th1">Translation</th>
          <th className="th1">Romanization</th>
          <th className="th1">Sentence</th>
          <th className="th1">Tag List</th>
          <th className="th1">Message</th>
        </tr>
        {importedTerms.map((term, ii) => {
          if (working) {
            // TODO
            $sqlct = $sqlct + 1;
          }
          return (
            <tr key={term.WoID}>
              <td className="td1 right">{ii + 1}</td>
              <td className="td1">{term.WoText}</td>
              <td className="td1">{term.WoTranslation}</td>
              <td className="td1">{term.WoRomanization}</td>
              <td className="td1">{term.WoSentence}</td>
              <td className="td1">{term.taglist.join(', ')}</td>
              {working ? (
                exists ? (
                  overwrite ? (
                    <td className="td1">{`${$msg1} / ${$msg2} (${$sqlct})`}</td>
                  ) : (
                    <td className="td1">
                      <span className="red2">{t('EXISTS, NOT IMPORTED')}</span>
                    </td>
                  )
                ) : (
                  <td className="td1">{`${$msg1} (${$sqlct})`}</td>
                )
              ) : (
                <td className="td1">
                  <span className="red2">
                    {t('NOT IMPORTED (term and/or translation missing)')}
                  </span>
                </td>
              )}
            </tr>
          );
        })}
        <p className="red">
          <>
            <>
              *** Imported terms: {$sqlct} of {importedTerms.length} ***
            </>
            <GoBackButton />
          </>
        </p>
      </table>
    </>
  );
}
