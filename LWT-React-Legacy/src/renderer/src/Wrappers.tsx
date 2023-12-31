import { LanguagesID, Tags2ID, TagsID, TextsID } from 'lwt-schemas';
import { dataService, useData } from 'lwt-state';
import { Switch, useInternalParams, useUpdateParams } from 'lwt-ui-kit';
import { useSearchParams } from 'react-router-dom';
import {
  DisplayArchivedTexts,
  EditArchivedText,
} from './pages/ArchivedText/EditArchivedTexts.component';
import { UploadWords } from './pages/IO/UploadWords.component';
import { EditLanguage } from './pages/Language/EditLanguage.component';
import { LanguagesPage } from './pages/Language/Languages.component';
import { NewLanguage } from './pages/Language/NewLanguage';
import { AnnotateText } from './pages/PrintAnnotate/AnnotateText';
import { AnnPlcmnt, AnnType } from './pages/PrintAnnotate/Annotation.types';
import { DisplayImprText } from './pages/PrintAnnotate/DisplayImprText';
import { PrintText } from './pages/PrintAnnotate/PrintText.component';
import { ReaderPage } from './pages/Reader/ReaderPage.component';
import { LanguageSorting, TextSorting, WordSorting } from './pages/Sorting';
import { AddTerm, EditTerm, Terms } from './pages/Term/Terms.component';
import { DisplayTags, EditTag, NewTag } from './pages/TermTag/EditTags';
import { TesterPage } from './pages/Tester/Tester';
import { EditText, Library } from './pages/Text/Library.component';
import { ImportShortTextPage } from './pages/Text/TextImport';
import {
  DisplayTextTags,
  EditTextTag,
  NewTextTag,
} from './pages/TextTag/EditTextTags';

export function TermsWrapper() {
  const {
    filterlang,
    new: newVal,
    page,
    sort,
    chg,
    tag1,
    status,
    tag12,
    tag2,
    text,
    query,
    lang,
  } = useInternalParams('edit_words');
  const [{ activeLanguageID }] = useData(['activeLanguageID']);
  const isNew = newVal === '1';
  const updateParams = useUpdateParams();
  // 'filterlang' is set as a keyword but with an empty value instead of being missing altogether
  if (filterlang === '') {
    if (activeLanguageID !== null && activeLanguageID !== undefined) {
      dataService.setActiveLanguage(null);
      updateParams({ filterlang: null });
    }
  } else if (
    filterlang !== null &&
    Number.parseInt(filterlang) !== activeLanguageID
  ) {
    dataService.setActiveLanguage(Number.parseInt<LanguagesID>(filterlang));
    updateParams({ filterlang: null });
  }
  return (
    <Switch on={isNew}>
      <Switch on={chg !== null}>
        <Terms
          pageNum={page !== null ? Number.parseInt(page) : 1}
          sort={sort ? (Number.parseInt(sort) as WordSorting) : undefined}
          status={status ? Number.parseInt(status) : null}
          textFilter={parseNumericalParam<TextsID, TextsID | null>(text, null)}
          tag1={parseNumericalParam<TagsID, TagsID | null>(tag1, null)}
          tag12={parseNumericalBoolean(tag12)}
          tag2={parseNumericalParam<TagsID, TagsID | null>(tag2, null)}
          query={query}
        />
        <EditTerm chgID={Number.parseInt(chg!)} />
      </Switch>
      <AddTerm langID={Number.parseInt(lang!)} />
    </Switch>
  );
}

function parseNumericalParam<
  TVal extends number,
  TDefault extends null | TVal = TVal
>(val: string | null, defaultVal: TDefault): TDefault {
  return val === null || val === ''
    ? defaultVal
    : // TODO no any
      (Number.parseInt<TVal>(val) as any);
}
function parseNumericalBoolean(
  val: string | null,
  defaultVal: 0 | 1 = 0
): 0 | 1 {
  return val === null || !['0', '1'].includes(val)
    ? defaultVal
    : Number.parseInt<0 | 1>(val);
}

export function AnnotatedTextsWrapper() {
  const {
    text,
    annplcmnt,
    // TODO
    // ann, status
  } = useInternalParams('print_impr_text');
  if (text === null) {
    throw new Error('Need To Specify Text ID');
  }
  return (
    <AnnotateText
      textID={Number.parseInt(text)}
      annplcmnt={parseNumericalParam(annplcmnt, AnnPlcmnt.behind)}
      editmode={false}
    />
  );
}
export function DisplayImprTextWrapper() {
  const {
    text,
    // TODO
    //  annplcmnt,
    //   ann,
    //    status
  } = useInternalParams('display_impr_text');
  if (text === null) {
    throw new Error('Need To Specify Text ID');
  }
  return <DisplayImprText textID={Number.parseInt(text)} />;
}

export function UploadWordsWrapper() {
  return <UploadWords />;
}

export function PrintTextWrapper() {
  const { status, ann, text, annplcmnt } = useInternalParams('print_text');
  if (text === null) {
    throw new Error('Need To Specify Text ID');
  }
  return (
    <PrintText
      ann={parseNumericalParam<AnnType>(ann, AnnType['Nothing'])}
      textID={Number.parseInt(text)}
      annplcmnt={parseNumericalParam(annplcmnt, AnnPlcmnt.behind)}
      status={status === null ? 14 : Number.parseInt(status)}
    />
  );
}

export function LanguagesWrapper() {
  const [searchParams] = useSearchParams();
  const isNew = searchParams.get('new') === '1';
  const chgID = searchParams.get('chg');
  const refreshID = searchParams.get('refresh');
  const updateParams = useUpdateParams();
  if (refreshID !== null) {
    dataService.reparseAllTextsForLanguage(Number.parseInt(refreshID));
    updateParams(null);
  }
  return (
    <Switch on={isNew}>
      <Switch on={chgID !== null}>
        <LanguagesPage sorting={LanguageSorting['Language A-Z']} />
        <EditLanguage chgID={Number.parseInt(chgID!)} />
      </Switch>
      <NewLanguage />
    </Switch>
  );
}

export function LibraryWrapper() {
  const {
    chg,
    arch,
    page,
    query,
    tag1,
    tag2,
    tag12,
    sort,
    new: newVal,
  } = useInternalParams('edit_texts');
  const isNew = newVal === '1';
  const paramUpdater = useUpdateParams();
  if (arch !== null) {
    dataService.archiveText(Number.parseInt(arch));
    paramUpdater(null);
  }
  // TODO
  // const [, { archiveText, reparseAllTextsForLanguage }] = useData([]);
  // if (refreshID !== null) {
  //   dataService.reparseText(Number.parseInt(refreshID) as TextsID);
  // }

  return (
    <Switch on={isNew}>
      <Switch on={chg !== null}>
        <Library
          currentPage={page !== null ? Number.parseInt(page) : 1}
          query={query}
          sorting={
            sort !== null ? Number.parseInt(sort) : TextSorting['Newest first']
          }
          tag2={
            tag2 === null || tag2 === '' ? null : Number.parseInt<Tags2ID>(tag2)
          }
          tag1={
            tag1 === null || tag1 === '' ? null : Number.parseInt<Tags2ID>(tag1)
          }
          tag12={parseNumericalBoolean(tag12)}
        />
        <EditText chgID={Number.parseInt(chg!)} />
      </Switch>
      <ImportShortTextPage />
    </Switch>
  );
}

export function EditArchivedTextsWrapper() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const page = searchParams.get('page');
  const sort = searchParams.get('sort');
  const tag12 = searchParams.get('tag12');
  const tag1 = searchParams.get('tag1');
  const tag2 = searchParams.get('tag2');
  const chgID = searchParams.get('chg');
  const unarch = searchParams.get('unarch');

  const paramUpdater = useUpdateParams();

  if (unarch !== null) {
    dataService.unarchiveText(Number.parseInt(unarch));
    paramUpdater(null);
  }
  console.log('TEST123-tag', tag1, tag2);
  return (
    <Switch on={chgID !== null}>
      <DisplayArchivedTexts
        query={query || ''}
        currentPage={page !== null ? Number.parseInt(page) : 1}
        tag12={tag12 && ['1', '0'].includes(tag12) ? Number.parseInt(tag12) : 0}
        tag1={
          tag1 !== null && tag1 !== '' ? Number.parseInt<Tags2ID>(tag1) : null
        }
        tag2={
          tag2 !== null && tag2 !== '' ? Number.parseInt<Tags2ID>(tag2) : null
        }
        sorting={sort !== null ? Number.parseInt(sort) : undefined}
      />
      <EditArchivedText chgID={Number.parseInt(chgID!)} />
    </Switch>
  );
}

export function EditTextTagsWrapper() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const isNew = searchParams.get('new') === '1';
  const chgID = searchParams.get('chg');
  const sort = searchParams.get('sort');
  const page = searchParams.get('page');

  return (
    <Switch on={isNew}>
      <Switch on={chgID !== null}>
        <DisplayTextTags
          currentPage={page !== null ? Number.parseInt(page) : 1}
          sorting={sort !== null ? Number.parseInt(sort) : undefined}
          query={query || ''}
        />
        <EditTextTag chgID={Number.parseInt(chgID!)} />
      </Switch>
      <NewTextTag />
    </Switch>
  );
}

export function EditTagsWrapper() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const isNew = searchParams.get('new') === '1';
  const page = searchParams.get('page');
  const sort = searchParams.get('sort');
  const chgID = searchParams.get('chg');

  return (
    <Switch on={chgID !== null}>
      <Switch on={isNew}>
        <DisplayTags
          query={query || ''}
          currentPage={page !== null ? Number.parseInt(page) : 1}
          sorting={sort !== null ? Number.parseInt(sort) : undefined}
        />
        <NewTag />
      </Switch>
      <EditTag chgID={Number.parseInt(chgID!)} />
    </Switch>
  );
}

export function ReaderWrapper() {
  const { start, onlyAnn, query, tag1, tag2, tag12 } =
    useInternalParams('do_text');
  // TODO sanitize
  // TODO verify exists
  if (!start) {
    throw new Error('Invalid Start ID!');
  }
  console.log('WRAPPER');
  return (
    <ReaderPage
      filterArgs={{ onlyAnn, query, tag1, tag2, tag12 }}
      txID={Number.parseInt(start)}
    />
  );
}

export function TestWrapper() {
  const [searchParams] = useSearchParams();
  const textID = searchParams.get('text');
  const lang = searchParams.get('lang');
  // TODO sanitize more
  // TODO verify exists
  return (
    <TesterPage
      langID={lang !== null ? Number.parseInt<LanguagesID>(lang) : null}
      textID={textID !== null ? Number.parseInt<TextsID>(textID) : null}
    />
  );
}
