import { confirmDelete } from 'lwt-common';
import { Language, LanguagesID } from 'lwt-schemas';
import { dataService, useData } from 'lwt-state';
import { A, Header, I18N, Icon, Loader, SortableHeader } from 'lwt-ui-kit';
import { LanguageSorting } from '../Sorting';
import {
  sortAZ,
  sortBigSmall,
  sortSmallBig,
  sortZA,
} from '../TextTag/EditTextTags';

function LanguageLine({
  language,
  activeLanguageID,
}: {
  language: TLanguageLine;
  activeLanguageID: LanguagesID | null;
}): JSX.Element {
  const {
    LgID: id,

    numTerms: numTermsThisLanguage,
    numArchivedTexts: numArchivedThisLanguage,
    numTexts: numTextsThisLanguage,
  } = language;
  const thisRowActive = activeLanguageID === id;
  /**
   *
   */
  function TdTh({ children }: React.PropsWithChildren<object>) {
    if (thisRowActive) {
      return <th className="th1 center">{children}</th>;
    }
    return <td className="td1 center">{children}</td>;
  }
  return (
    <tr>
      {thisRowActive ? (
        <th className="th1">
          <Icon
            onClick={() => {
              dataService.setActiveLanguage(thisRowActive ? null : id);
            }}
            src="exclamation-red"
            title="Current Language"
          />
        </th>
      ) : (
        <td className="td1 center">
          <Icon
            onClick={() => {
              dataService.setActiveLanguage(thisRowActive ? null : id);
            }}
            src="tick-button"
            title="Set as Current Language"
          />
        </td>
      )}
      <TdTh>
        <A href={`/do_test?lang=${id}`}>
          <Icon src="question-balloon" title="Test" />
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

type TLanguageLine = Pick<Language, 'LgName' | 'LgID' | 'LgExportTemplate'> & {
  numTexts: number;
  numTerms: number;
  numArchivedTexts: number;
};
/**
 *
 * @param value
 */
function sortValues(value: LanguageSorting) {
  switch (value) {
    case LanguageSorting['Language A-Z']:
      return ({ LgName: a }: TLanguageLine, { LgName: b }: TLanguageLine) =>
        sortAZ(a, b);
    case LanguageSorting['Language Z-A']:
      return ({ LgName: a }: TLanguageLine, { LgName: b }: TLanguageLine) =>
        sortZA(a, b);
    case LanguageSorting['Num Texts']:
      return ({ numTexts: a }: TLanguageLine, { numTexts: b }: TLanguageLine) =>
        sortSmallBig(a, b);
    case LanguageSorting['Num Texts (desc)']:
      return ({ numTexts: a }: TLanguageLine, { numTexts: b }: TLanguageLine) =>
        sortBigSmall(a, b);
    case LanguageSorting['Num Terms']:
      return ({ numTerms: a }: TLanguageLine, { numTerms: b }: TLanguageLine) =>
        sortSmallBig(a, b);
    case LanguageSorting['Num Terms (desc)']:
      return ({ numTerms: a }: TLanguageLine, { numTerms: b }: TLanguageLine) =>
        sortBigSmall(a, b);
    case LanguageSorting['Num Archived Texts']:
      return (
        { numArchivedTexts: a }: TLanguageLine,
        { numArchivedTexts: b }: TLanguageLine
      ) => sortSmallBig(a, b);
    case LanguageSorting['Num Archived Texts (desc)']:
      return (
        { numArchivedTexts: a }: TLanguageLine,
        { numArchivedTexts: b }: TLanguageLine
      ) => sortBigSmall(a, b);
  }
}

export function LanguagesPage({
  sorting,
}: {
  sorting: LanguageSorting;
}): JSX.Element {
  const [
    {
      languages,
      activeLanguageID,
      archivedTextsHashmapByLanguage,
      textsCountmapByLanguage,
      wordCountmapByLanguage,
    },
  ] = useData([
    'languages',
    'activeLanguageID',
    'archivedTextsHashmapByLanguage',
    'textsCountmapByLanguage',
    'wordCountmapByLanguage',
  ]);
  if (
    archivedTextsHashmapByLanguage === undefined ||
    textsCountmapByLanguage === undefined ||
    wordCountmapByLanguage === undefined
  ) {
    return (
      <>
        <Loader />
      </>
    );
  }
  const languageLines: TLanguageLine[] = languages.map((val) => ({
    ...val,
    numArchivedTexts: archivedTextsHashmapByLanguage[val.LgID] || 0,
    numTerms: wordCountmapByLanguage[val.LgID] || 0,
    numTexts: textsCountmapByLanguage[val.LgID] || 0,
  }));
  const sortedLanguages = languageLines.sort(sortValues(sorting));
  return (
    <>
      <Header title={'My Languages'} />
      <p>
        <A href={`/edit_languages?new=${1}`}>
          <Icon src="plus-button" title="New" /> <I18N i="New Language ..." />
        </A>
      </p>
      <table className="sortable tab1" cellSpacing={0} cellPadding={5}>
        <thead>
          <tr>
            <th className="th1 sorttable_nosort">
              <I18N i={'Curr.\nLang.'} />
            </th>
            <th className="th1 sorttable_nosort">
              <I18N i={'Test'} />
              <br />
              ↓↓↓
            </th>
            <th className="th1 sorttable_nosort">
              <I18N i="Actions" />
            </th>
            <th className="th1 clickable">
              <I18N i="Language" />
            </th>
            <SortableHeader
              sorting={sorting}
              downSorting={LanguageSorting['Num Texts (desc)']}
              upSorting={LanguageSorting['Num Texts']}
            >
              <I18N i={'Texts,\nReparse'} />
            </SortableHeader>
            <SortableHeader
              sorting={sorting}
              downSorting={LanguageSorting['Num Archived Texts (desc)']}
              upSorting={LanguageSorting['Num Archived Texts']}
            >
              {' '}
              <I18N i={'Arch.\nTexts'} />
            </SortableHeader>
            <SortableHeader
              sorting={sorting}
              downSorting={LanguageSorting['Num Terms (desc)']}
              upSorting={LanguageSorting['Num Terms']}
            >
              <I18N i="Terms" />
            </SortableHeader>
            <th className="th1 sorttable_nosort">
              <I18N i={'Export\nTemplate?'} />
            </th>
          </tr>
        </thead>
        {sortedLanguages.map((lang) => (
          <LanguageLine language={lang} activeLanguageID={activeLanguageID} />
        ))}
      </table>
    </>
  );
}
