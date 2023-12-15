import { useSearchParams } from 'react-router-dom';
import { dataService } from './data/data.service';
import { LanguagesId, Tags2Id, TagsId, TextsId } from './data/validators';
import { useData } from './hooks/useData';
import { useUpdateParams } from './hooks/useInternalNav';
import { useInternalParams } from './hooks/useInternalParams';
import { EditArchivedTexts } from './pages/ArchivedText/EditArchivedTexts.component';
import { UploadWords } from './pages/IO/UploadWords.component';
import { EditLanguage } from './pages/Language/EditLanguage.component';
import { LanguagesPage } from './pages/Language/Languages.component';
import { NewLanguage } from './pages/Language/NewLanguage';
import { ReaderPage, TesterPage } from './pages/ReaderPage.component';
import { WordSorting } from './pages/Sorting';
import { AddNewWordPane } from './pages/Term/AddNewWordPane';
import { AddTerm, EditTerm, Terms } from './pages/Term/Terms.component';
import { DisplayTags, EditTag, NewTag } from './pages/TermTag/EditTags';
import { AnnotateText } from './pages/Text/AnnotateText';
import { EditText, Library } from './pages/Text/Library.component';
import { PrintText } from './pages/Text/PrintText.component';
import { ImportShortTextPage } from './pages/Text/TextImport';
import {
  DisplayTextTags,
  EditTextTag,
  NewTextTag,
} from './pages/TextTag/EditTextTags';
import { Switch } from './ui-kit/Switch';

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
    lang,
  } = useInternalParams('edit_words');
  const [{ activeLanguageId }] = useData(['activeLanguageId']);
  const isNew = newVal === '1';
  const updateParams = useUpdateParams();
  // 'filterlang' is set as a keyword but with an empty value instead of being missing altogether
  if (filterlang === '') {
    if (activeLanguageId !== null && activeLanguageId !== undefined) {
      dataService.setActiveLanguage(null);
      updateParams({ filterlang: null });
    }
  } else if (
    filterlang !== null &&
    Number.parseInt(filterlang) !== activeLanguageId
  ) {
    dataService.setActiveLanguage(Number.parseInt<LanguagesId>(filterlang));
    updateParams({ filterlang: null });
  }
  return (
    <Switch on={isNew}>
      <Switch on={chg !== null}>
        <Terms
          pageNum={page !== null ? Number.parseInt(page) : 1}
          sort={sort ? (Number.parseInt(sort) as WordSorting) : undefined}
          status={status ? Number.parseInt(status) : null}
          textFilter={text === null ? null : Number.parseInt<TextsId>(text)}
          tag1={
            tag1 === null || tag1 === '' ? null : Number.parseInt<TagsId>(tag1)
          }
          tag12={
            tag12 === null || !['0', '1'].includes(tag12)
              ? 0
              : Number.parseInt<0 | 1>(tag12)
          }
          tag2={
            tag2 === null || tag2 === '' ? null : Number.parseInt<TagsId>(tag2)
          }
        />
        <EditTerm chgID={Number.parseInt(chg!)} />
      </Switch>
      <AddTerm langId={Number.parseInt(lang!)} />
    </Switch>
  );
}

export function AnnotatedTextsWrapper() {
  const { text, annplcmnt, ann, status } = useInternalParams('print_impr_text');
  if (text === null) {
    throw new Error('Need To Specify Text ID');
  }
  return (
    <AnnotateText
      textID={Number.parseInt(text)}
      annplcmnt={annplcmnt === null ? 0 : Number.parseInt(annplcmnt)}
    />
  );
}

export function UploadWordsWrapper() {
  return <UploadWords />;
}

export function PrintTextWrapper() {
  const { text, annplcmnt } = useInternalParams('print_text');
  if (text === null) {
    throw new Error('Need To Specify Text ID');
  }
  return (
    <PrintText
      textID={Number.parseInt(text)}
      annplcmnt={annplcmnt === null ? 0 : Number.parseInt(annplcmnt)}
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
    dataService.reparseText(Number.parseInt(refreshID) as TextsId);
    updateParams(null);
  }
  return (
    <Switch on={isNew}>
      <Switch on={chgID !== null}>
        <LanguagesPage />
        <EditLanguage chgID={Number.parseInt(chgID!)} />
      </Switch>
      <NewLanguage />
    </Switch>
  );
}
{
  /* TODO this only accessed from inside reader, doesnt fit pattern to have own route  */
}

export function AddNewWordWrapper() {
  const [searchParams] = useSearchParams();
  // const textID = searchParams.get('text');
  const langID = searchParams.get('lang');
  if (langID === null) {
    throw new Error('Need To Specify Language ID');
  }
  return <AddNewWordPane langId={Number.parseInt(langID)} />;
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
    console.log('TEST123-ARCH', arch);
    dataService.archiveText(Number.parseInt(arch));
    paramUpdater(null);
  }
  // TODO
  // const [, { archiveText, reparseAllTextsForLanguage }] = useData([]);
  // if (refreshID !== null) {
  //   dataService.reparseText(Number.parseInt(refreshID) as TextsId);
  // }
  console.log('new', isNew);
  return (
    <Switch on={isNew}>
      <Switch on={chg !== null}>
        <Library
          currentPage={page !== null ? Number.parseInt(page) : 1}
          query={query}
          sorting={sort !== null ? Number.parseInt(sort) : undefined}
          tag2={
            tag2 === null || tag2 === '' ? null : Number.parseInt<Tags2Id>(tag2)
          }
          tag1={
            tag1 === null || tag1 === '' ? null : Number.parseInt<Tags2Id>(tag1)
          }
          tag12={
            tag12 === null || !['0', '1'].includes(tag12)
              ? 0
              : Number.parseInt<0 | 1>(tag12)
          }
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
  const unarch = searchParams.get('unarch');

  const paramUpdater = useUpdateParams();

  if (unarch !== null) {
    dataService.unarchiveText(Number.parseInt(unarch));
    paramUpdater(null);
  }
  return (
    <EditArchivedTexts
      query={query || ''}
      currentPage={page !== null ? Number.parseInt(page) : 1}
      tag12={tag12 && ['1', '0'].includes(tag12) ? Number.parseInt(tag12) : 0}
      tag1={tag1 !== null || tag1 === '' ? Number.parseInt<TagsId>(tag1) : null}
      tag2={tag2 !== null || tag2 === '' ? Number.parseInt<TagsId>(tag2) : null}
      sorting={sort !== null ? Number.parseInt(sort) : undefined}
    />
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
  const chgId = searchParams.get('chg');

  return (
    <Switch on={chgId !== null}>
      <Switch on={isNew}>
        <DisplayTags
          query={query || ''}
          currentPage={page !== null ? Number.parseInt(page) : 1}
          sorting={sort !== null ? Number.parseInt(sort) : undefined}
        />
        <NewTag />
      </Switch>
      <EditTag chgId={Number.parseInt(chgId!)} />
    </Switch>
  );
}

export function ReaderWrapper() {
  const [searchParams] = useSearchParams();
  const start = searchParams.get('start');
  // TODO sanitize
  // TODO verify exists
  return <ReaderPage textID={Number.parseInt(start!)} />;
}

export function TestWrapper() {
  const [searchParams] = useSearchParams();
  const textID = searchParams.get('text');
  const lang = searchParams.get('lang');
  // TODO sanitize more
  // TODO verify exists
  return (
    <TesterPage
      langID={lang !== null ? Number.parseInt<LanguagesId>(lang) : null}
      textID={textID !== null ? Number.parseInt<TextsId>(textID) : null}
    />
  );
}
