import { UploadTermsValidator } from '../../data/UploadTermsValidator';
import { dataService } from '../../data/data.service';
import { parseNumMap } from '../../forms/Forms';
import { useData } from '../../hooks/useData';
import { useFormInput } from '../../hooks/useFormInput';
import { useInternalNavigate } from '../../hooks/useInternalNav';
import { Header } from '../../ui-kit/Header';
import { RequiredLineButton } from '../../ui-kit/Icon';
import { SelectBoolean } from '../../ui-kit/SelectBoolean';
import { parseTermsFromCSV } from '../../utils/parsers/parseCsvTerms';
import { StrengthMap } from '../StrengthMap';
import { GetWordstatusSelectoptions } from '../Text/PrintText.component';

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
              <b>Import Data:</b>
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
                <option value="w" selected>
                  Term
                </option>
                <option value="t">Translation</option>
                <option value="r">Romanization</option>
                <option value="s">Sentence</option>
                <option value="g">Tag List</option>
                <option value="x">Don't import</option>
              </select>
              <br />
              "C2":{' '}
              <select ref={refMap.c2} name="Col2">
                <option value="w">Term</option>
                <option value="t" selected>
                  Translation
                </option>
                <option value="r">Romanization</option>
                <option value="s">Sentence</option>
                <option value="g">Tag List</option>
                <option value="x">Don't import</option>
              </select>
              <br />
              "C3":{' '}
              <select ref={refMap.c3} name="Col3">
                <option value="w">Term</option>
                <option value="t">Translation</option>
                <option value="r">Romanization</option>
                <option value="s">Sentence</option>
                <option value="g">Tag List</option>
                <option value="x" selected>
                  Don't import
                </option>
              </select>
              <br />
              "C4":{' '}
              <select ref={refMap.c4} name="Col4">
                <option value="w">Term</option>
                <option value="t">Translation</option>
                <option value="r">Romanization</option>
                <option value="s">Sentence</option>
                <option value="g">Tag List</option>
                <option value="x" selected>
                  Don't import
                </option>
              </select>
              <br />
              "C5":{' '}
              <select ref={refMap.c5} name="Col5">
                <option value="w">Term</option>
                <option value="t">Translation</option>
                <option value="r">Romanization</option>
                <option value="s">Sentence</option>
                <option value="g">Tag List</option>
                <option value="x" selected>
                  Don't import
                </option>
              </select>
              <br />
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
                  <option value={StrengthMap[key].classKey}>
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
                  onClickCapture={() => navigator('/backup_restore')}
                />{' '}
                MAY BE ADVISABLE!
                <br />
                PLEASE DOUBLE-CHECK EVERYTHING!
              </span>
              <br />
              <input
                type="button"
                value="&lt;&lt; Back"
                onClickCapture={() => navigator('/')}
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
