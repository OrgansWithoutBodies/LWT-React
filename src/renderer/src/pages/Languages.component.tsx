import { Icon } from '../Icon';
import { dataService } from '../data/data.service';
import { ArchivedTexts, Languages, Texts, Words } from '../data/parseMySqlDump';
import { useData } from '../data/useAkita';
import { LanguagesId } from '../data/validators';
import { A } from '../nav/InternalLink';
import { Header } from './Header';
import { confirmDelete } from './utils';

function LanguageLine({
  language,
  activeLanguageId,
  texts,
  terms,
  archivedtexts,
}: {
  language: Languages;
  activeLanguageId: LanguagesId | null;
  texts: Texts[];
  terms: Words[];
  archivedtexts: ArchivedTexts[];
}): JSX.Element {
  const id = language.LgID;
  const thisRowActive = activeLanguageId === id;
  const numTextsThisLanguage = texts.filter(
    (text) => text.TxLgID === id
  ).length;
  const numTermsThisLanguage = terms.filter(
    (term) => term.WoLgID === id
  ).length;
  const numArchivedThisLanguage = archivedtexts.filter(
    (text) => text.AtLgID === id
  ).length;
  const TdTh = ({ children }: React.PropsWithChildren<object>) => {
    if (thisRowActive) {
      return <th className="th1 center">{children}</th>;
    }
    return <td className="td1 center">{children}</td>;
  };
  return (
    <tr>
      {thisRowActive ? (
        <th className="th1">
          <Icon
            onClick={() => {
              dataService.setActiveLanguage(thisRowActive ? null : id);
            }}
            src={'exclamation-red'}
            title={'Current Language'}
          />
        </th>
      ) : (
        <td className="td1 center">
          <Icon
            onClick={() => {
              dataService.setActiveLanguage(thisRowActive ? null : id);
            }}
            src={'tick-button'}
            title={'Set as Current Language'}
          />
        </td>
      )}
      <TdTh>
        <A href={`/do_test?lang=${id}`}>
          <Icon src={'question-balloon'} title="Test" />
        </A>
      </TdTh>
      <TdTh>
        &nbsp;
        <A href={`/edit_languages?chg=${id}`}>
          <Icon src="document--pencil" title="Edit" />
        </A>
        &nbsp;
        {numTermsThisLanguage === 0 &&
        numArchivedThisLanguage === 0 &&
        numTextsThisLanguage === 0 ? (
          <span
            className="click"
            //         if ($textcount == 0 && $archtextcount == 0 && $wordcount == 0)
            // 	echo '&nbsp; <span class="click" onclick="if (confirmDelete()) location.href=\'' . $_SERVER['PHP_SELF'] . '?del=' . $record['LgID'] . '\';"><img src="icn/minus-button.png" title="Delete" alt="Delete" /></span>';
            // else
            // 	echo '&nbsp; <img src="icn/placeholder.png" title="Delete not possible" alt="Delete not possible" />';

            onClick={() => {
              if (confirmDelete()) {
                dataService.deleteLanguage(language.LgID);
              }
            }}
          >
            <Icon src="minus-button" title="Delete" />
          </span>
        ) : (
          <Icon src="placeholder" title="Delete not possible" />
        )}
        &nbsp;
      </TdTh>
      <TdTh>{language.LgName}</TdTh>
      <TdTh>
        {numTextsThisLanguage !== 0 ? (
          <>
            <A href={`/edit_texts?filterlang=${language.LgID}`}>
              {numTextsThisLanguage}
            </A>
            &nbsp;&nbsp;
            <A href={`/edit_languages?refresh=${language.LgID}`}>
              <Icon src="lightning" title="Reparse Texts" />
            </A>
          </>
        ) : (
          0
        )}
      </TdTh>
      <TdTh>
        {numArchivedThisLanguage !== 0 ? (
          <A href={`/edit_archivedtexts?filterlang=${language.LgID}`}>
            {numArchivedThisLanguage}
          </A>
        ) : (
          0
        )}
      </TdTh>
      <TdTh>
        <A href={`/edit_words?filterlang=${language.LgID}`}>
          {numTermsThisLanguage}
        </A>
      </TdTh>
      <TdTh>
        {language.LgExportTemplate !== undefined ? (
          <Icon src="status" title="Yes" />
        ) : (
          <Icon src="status-busy" title="No" />
        )}
      </TdTh>
    </tr>
  );
}
export function LanguagesPage(): JSX.Element {
  const [{ languages, activeLanguageId, texts, words, archivedtexts }] =
    useData([
      'languages',
      'activeLanguageId',
      'texts',
      'words',
      'archivedtexts',
    ]);

  return (
    <>
      <Header title="My Languages" />
      <p>
        <A href={`/edit_languages?new=${1}`}>
          <Icon src="plus-button" title="New" /> New Language ...
        </A>
      </p>
      <table className="sortable tab1" cellSpacing={0} cellPadding={5}>
        <thead>
          <tr>
            <th className="th1 sorttable_nosort">
              Curr.
              <br />
              Lang.
            </th>
            <th className="th1 sorttable_nosort">
              Test
              <br />
              ↓↓↓
            </th>
            <th className="th1 sorttable_nosort">Actions</th>
            <th className="th1 clickable">Language</th>
            <th className="th1 sorttable_numeric clickable">
              Texts,
              <br />
              Reparse
            </th>
            <th className="th1 sorttable_numeric clickable">
              Arch.
              <br />
              Texts
            </th>
            <th className="th1 sorttable_numeric clickable">Terms</th>
            <th className="th1 sorttable_nosort">
              Export
              <br />
              Template?
            </th>
          </tr>
        </thead>
        {languages.map((lang) => {
          return (
            <LanguageLine
              texts={texts}
              archivedtexts={archivedtexts}
              terms={words}
              language={lang}
              activeLanguageId={activeLanguageId}
            />
          );
        })}
      </table>
    </>
  );
}
