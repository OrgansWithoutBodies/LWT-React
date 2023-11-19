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
  return (
    <tr>
      <td className="td1 center">
        {/* <A
          href={`save_setting_redirect?k=${'currentlanguage'}&v=${2}&u=${'edit_languages'}`}
        > */}
        <Icon
          onClick={() => {
            dataService.setActiveLanguage(thisRowActive ? null : id);
          }}
          src={thisRowActive ? 'exclamation-red' : 'tick-button'}
          title={thisRowActive ? 'Current Language' : 'Set as Current Language'}
        />
        {/* </a> */}
      </td>
      <td className="td1 center">
        <A href={`/do_test?lang=${id}`}>
          <Icon src={'question-balloon'} title="Test" />
        </A>
      </td>
      <td className="td1 center">
        &nbsp;
        {/* <A href={`/print_text?text=${id}`}>
          <Icon src="printer" title="Print" />
        </A> */}
        &nbsp;
        <A href={`/edit_languages?chg=${id}`}>
          <Icon src="document--pencil" title="Edit" />
        </A>
        &nbsp;
        <span
          className="click"
          onClick={() => {
            if (confirmDelete()) {
              dataService.deleteLanguage(language.LgID);
            }
          }}
        >
          <Icon src="minus-button" title="Delete" />
        </span>
        &nbsp;
      </td>
      <td className="td1 center">{language.LgName}</td>
      <td className="td1 center">
        <A href={`/edit_languages?page=${1}&query=&filterlang=${2}`}>
          {numTextsThisLanguage}
        </A>
        &nbsp;&nbsp;
        <A href={`/edit_languages?refresh=${2}`}>
          {/* . $_SERVER['PHP_SELF'] . '?refresh=' . $record['LgID'] . ' */}
          <Icon src="lightning" title="Reparse Texts" />
        </A>
      </td>
      <td className="td1 center">{numArchivedThisLanguage}</td>
      <td className="td1 center">
        <A
          href={`/edit_words?page=${1}&query=&text=&status=&filterlang=${2}&status=&tag12=${0}&tag2=&tag1=`}
        >
          {numTermsThisLanguage}
        </A>
      </td>
      <td className="td1 center">
        <Icon src="status" title="Yes" />
      </td>
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
