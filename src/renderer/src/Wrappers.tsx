import { useSearchParams } from 'react-router-dom';
import { Switch } from './App';
import { dataService } from './data/data.service';
import { useData } from './data/useAkita';
import { LanguagesId, Tags2Id, TagsId, TextsId } from './data/validators';
import { useInternalParams } from './hooks/useInternalParams';
import { AddNewWordPane } from './pages/AddNewWordPane';
import { EditArchivedTexts } from './pages/EditArchivedTexts.component';
import { EditLanguage } from './pages/EditLanguage.component';
import { DisplayTags, EditTag, NewTag } from './pages/EditTags';
import { DisplayTextTags, EditTextTag, NewTextTag } from './pages/EditTextTags';
import { LanguagesPage } from './pages/Languages.component';
import { EditText, Library } from './pages/Library.component';
import { NewLanguage } from './pages/NewLanguage';
import { PrintText } from './pages/PrintText.component';
import { ReaderPage, TesterPage } from './pages/ReaderPage.component';
import { WordSorting } from './pages/Sorting';
import { AddTerm, EditTerm, Terms } from './pages/Terms.component';
import { ImportShortText } from './pages/TextImport';
import { UploadWords } from './pages/UploadWords.component';

/**
 *
 */
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

  // 'filterlang' is set as a keyword but with an empty value instead of being missing altogether
  if (filterlang === '') {
    if (activeLanguageId !== null) {
      dataService.setActiveLanguage(null);
    }
  } else if (
    filterlang !== null &&
    Number.parseInt(filterlang) !== activeLanguageId
  ) {
    dataService.setActiveLanguage(Number.parseInt<LanguagesId>(filterlang));
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
/**
 *
 */
export function UploadWordsWrapper() {
  return <UploadWords />;
}
/**
 *
 */
export function PrintTextWrapper() {
  const { text } = useInternalParams('print_text');
  if (text === null) {
    throw new Error('Need To Specify Text ID');
  }
  return <PrintText textID={Number.parseInt(text)} />;
}
/**
 *
 */
export function LanguagesWrapper() {
  const [searchParams] = useSearchParams();
  const isNew = searchParams.get('new') === '1';
  const chgID = searchParams.get('chg');
  const refreshID = searchParams.get('refresh');

  if (refreshID !== null) {
    dataService.reparseText(Number.parseInt(refreshID) as TextsId);
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
/**
 *
 */
export function AddNewWordWrapper() {
  const [searchParams] = useSearchParams();
  // const textID = searchParams.get('text');
  const langID = searchParams.get('lang');
  if (langID === null) {
    throw new Error('Need To Specify Language ID');
  }
  return <AddNewWordPane langId={Number.parseInt(langID)} />;
}
/**
 *
 */
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
  if (arch !== null) {
    dataService.archiveText(Number.parseInt(arch));
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
      <ImportShortText />
    </Switch>
  );
}
{
  // TODO these are used in check text
  /* <p><input type="button" value="&lt;&lt; Back" onClick="history.back();" /></p> */
}
// op === 'check';
// wordList = array();
// wordSeps = array();
// r .= "<h4>Sentences</h4><ol>";
// sentNumber = 0;
// foreach (textLines as value) {
//   r .= "<li " . (rtlScript ? 'dir="rtl"' : '') . ">" . tohtml(remove_spaces(value, removeSpaces)) . "</li>";
//   lineWords[sentNumber] = preg_split('/([^' . termchar . ']{1,})/u', value, -1, PREG_SPLIT_DELIM_CAPTURE);
//   l = count(lineWords[sentNumber]);
//   for (i = 0; i < l; i++) {
//     term = mb_strtolower(lineWords[sentNumber][i], 'UTF-8');
//     if (term != '') {
//       if (i % 2 == 0) {
//         if (array_key_exists(term, wordList)) {
//           wordList[term][0]++;
//           wordList[term][1][] = sentNumber;
//         } else {
//           wordList[term] = array(1, array(sentNumber));
//         }
//       } else {
//         ww = remove_spaces(term, removeSpaces);
//         if (array_key_exists(ww, wordSeps))
//           wordSeps[ww]++;
//         else
//           wordSeps[ww] = 1;
//       }
//     }
//   }
//   sentNumber += 1;
// }
// r .= "</ol><h4>Word List <span class="red2">(red = already saved)</span></h4><ul>";
// ksort(wordList);
// anz = 0;
// foreach (wordList as key => value) {
//   trans = get_first_value("select WoTranslation as value from " . tbpref . "words where WoLgID = " . lid . " and WoTextLC = " . convert_string_to_sqlsyntax(key));
//   if (!isset(trans))
//     trans = "";
//   if (trans == "*")
//     trans = "";
//   if (trans != "")
//     r .= "<li " . (rtlScript ? 'dir="rtl"' : '') . "><span class="red2">[" . tohtml(key) . "] — " . value[0] . " - " . tohtml(replaceTabsWithNewLine(trans)) . "</span></li>";
//   else
//     r .= "<li " . (rtlScript ? 'dir="rtl"' : '') . ">[" . tohtml(key) . "] — " . value[0] . "</li>";
//   anz++;
// }
// r .= "</ul><p>TOTAL: " . anz . "</p><h4>Non-Word List</h4><ul>";
// if (array_key_exists('', wordSeps))
//   unset(wordSeps['']);
// ksort(wordSeps);
// anz = 0;
// foreach (wordSeps as key => value) {
//   r .= "<li>[" . str_replace(" ", "<span class="backgray">&nbsp;</span>", tohtml(key)) . "] — " . value . "</li>";
//   anz++;
// }
// r .= "</ul><p>TOTAL: " . anz . "</p></div>";
// return r;
/**
 *
 */
export function EditArchivedTextsWrapper() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const page = searchParams.get('page');
  const sort = searchParams.get('sort');
  const tag12 = searchParams.get('tag12');
  const tag1 = searchParams.get('tag1');
  const tag2 = searchParams.get('tag2');
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
/**
 *
 */
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
/**
 *
 */
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
/**
 *
 */
export function ReaderWrapper() {
  const [searchParams] = useSearchParams();
  const start = searchParams.get('start');
  // TODO sanitize
  // TODO verify exists
  return <ReaderPage textId={Number.parseInt(start!)} />;
}
/**
 *
 */
export function TestWrapper() {
  const [searchParams] = useSearchParams();
  const textID = searchParams.get('text');
  const lang = searchParams.get('lang');
  // TODO sanitize more
  // TODO verify exists
  return (
    <TesterPage
      langId={lang !== null ? Number.parseInt<LanguagesId>(lang) : null}
      textId={textID !== null ? Number.parseInt<TextsId>(textID) : null}
    />
  );
}
