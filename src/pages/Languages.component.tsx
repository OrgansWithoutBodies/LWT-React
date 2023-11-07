import { Icon } from '../Icon';
import { dataService } from '../data/data.service';
import { ArchivedTexts, Languages, Texts, Words } from '../data/parseMySqlDump';
import { useData } from '../data/useAkita';
import { LanguagesId } from '../data/validators';
import { Header } from './Header';

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
        <a
        // href="save_setting_redirect?k=currentlanguage&amp;v=2&amp;u=edit_languages"
        >
          <Icon
            onClick={() => {
              dataService.setActiveLanguage(thisRowActive ? null : id);
            }}
            iconName={thisRowActive ? 'exclamation-red' : 'tick-button'}
            title={
              thisRowActive ? 'Current Language' : 'Set as Current Language'
            }
            alt={thisRowActive ? 'Current Language' : 'Set as Current Language'}
          />
        </a>
      </td>
      <td className="td1 center">
        <a href={`do_test?lang=${id}`}>
          <Icon iconName={'question-balloon'} title="Test" alt="Test" />
        </a>
      </td>
      <td className="td1 center">
        &nbsp;
        <a href={`print_text?text=${id}`}>
          <Icon iconName="printer" title="Print" alt="Print" />
        </a>
        &nbsp;
        <a href={`/edit_texts?arch=${id}`}>
          <Icon iconName="inbox-download" title="Archive" alt="Archive" />
        </a>
        &nbsp;
        <a href={`/edit_texts?chg=${id}`}>
          <Icon iconName="document--pencil" title="Edit" alt="Edit" />
        </a>
        &nbsp;
        <span
          className="click"
          onClick={() => dataService.deleteLanguage(language.LgID)}
          // onClick="if (confirmDelete()) location.href='/edit_texts?del=47';"
        >
          <Icon iconName="minus-button" title="Delete" alt="Delete" />
        </span>
        &nbsp;
      </td>
      <td className="td1 center">{language.LgName}</td>
      <td className="td1 center">
        <a href="edit_texts?page=1&amp;query=&amp;filterlang=2">
          {numTextsThisLanguage}
        </a>
        &nbsp;&nbsp;
        <a href="/edit_languages?refresh=2">
          <Icon
            iconName="lightning"
            title="Reparse Texts"
            alt="Reparse Texts"
          />
        </a>
      </td>
      <td className="td1 center">{numArchivedThisLanguage}</td>
      <td className="td1 center">
        <a href="edit_words?page=1&amp;query=&amp;text=&amp;status=&amp;filterlang=2&amp;status=&amp;tag12=0&amp;tag2=&amp;tag1=">
          {numTermsThisLanguage}
        </a>
      </td>
      <td className="td1 center">
        <Icon iconName="status" title="Yes" alt="Yes" />
      </td>
    </tr>
  );
}
const UP_ARROW = '▴' as const;
const DOWN_ARROW = '▾' as const;
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
      <Header title="My Languages" link={''} />
      <p>
        <a href="/edit_languages?new=1">
          <Icon iconName="plus-button" title="New" alt="New" /> New Language ...
        </a>
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
