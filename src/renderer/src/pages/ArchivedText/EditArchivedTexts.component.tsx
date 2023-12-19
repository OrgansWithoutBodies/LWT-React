import { useRef } from 'react';
import { dataService } from '../../data/data.service';
import {
  ArchivedTextID,
  ArchivedTextsWithTagsValidator,
  TagsID,
} from '../../data/validators';
import { useData } from '../../hooks/useData';
import { useFormInput } from '../../hooks/useFormInput';
import {
  useInternalNavigate,
  useUpdateParams,
} from '../../hooks/useInternalNav';
import { usePager } from '../../hooks/usePager';
import { useSelection } from '../../hooks/useSelection';
import { A } from '../../nav/InternalLink';
import { Header } from '../../ui-kit/Header';
import { Icon } from '../../ui-kit/Icon';
import { LanguageDropdown } from '../../ui-kit/LanguageDropdown';
import { SortableHeader } from '../../ui-kit/SortableHeader';
import { TableFooter } from '../../ui-kit/TableFooter';
import { TagAndOr } from '../../ui-kit/TagAndOr';
import { TagDropDown } from '../../ui-kit/TagDropDown';
import { TextTagsAutocomplete } from '../../ui-kit/TagsAutocomplete';
import { confirmDelete } from '../../utils/utils';
import { SelectMediaPath } from '../SelectMediaPath';
import {
  GetMultipleArchivedTextActionsSelectOptions,
  GetTextsSortSelectoptions,
} from '../SelectOptions';
import { TextSorting } from '../Sorting';
import { FilterSortPager } from './FilterSortPager';
import { buildTextTagLookup } from './buildTextTagLookup';

/**
 *
 */
export function DisplayArchivedTexts({
  query,
  currentPage,
  tag12,
  tag1,
  tag2,
  sorting = TextSorting['Oldest first'],
}: {
  query: string;
  currentPage: number;
  tag12: 0 | 1;
  tag1: TagsID | null;
  tag2: TagsID | null;
  sorting?: TextSorting;
}): JSX.Element {
  const [
    { tags, languages, activeLanguage, archivedtexts, archtexttags, tags2 },
  ] = useData([
    'languages',
    'tags2',
    'activeLanguage',
    'archivedtexts',
    'tags',
    'archtexttags',
  ]);
  const pageSize = 15;
  const textTagLookup: Record<ArchivedTextID, string[]> = buildTextTagLookup(
    tags2,
    archtexttags
  );
  const filteredTexts = activeLanguage
    ? archivedtexts.filter(({ AtLgID }) => AtLgID === activeLanguage.LgID)
    : archivedtexts;
  const { dataOnPage, numPages } = usePager(
    filteredTexts,
    currentPage,
    pageSize
  );
  const recno = filteredTexts.length;
  const navigate = useInternalNavigate();
  const paramUpdater = useUpdateParams();
  const { onSelectAll, onSelectNone, checkboxPropsForEntry, selectedValues } =
    useSelection(archivedtexts, 'AtID');
  const queryRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <Header
        title={`My ${
          activeLanguage ? `${activeLanguage.LgName} ` : ''
        }Text Archive`}
      />
      <p>&nbsp;</p>
      <form name="form1">
        <table className="tab1" cellSpacing={0} cellPadding={5}>
          <tr>
            <th className="th1" colSpan={4}>
              Filter <Icon src="funnel" title="Filter" />
              &nbsp;
              <input
                type="button"
                value="Reset All"
                onClick={() => resetAll('edit_archivedtexts')}
              />
            </th>
          </tr>
          <tr>
            <td className="td1 center" colSpan={2}>
              Language:
              <LanguageDropdown
                defaultValue={activeLanguage?.LgID}
                header="Filter off"
                onChange={(val) => {
                  if (val === -1) {
                    dataService.setActiveLanguage(null);
                  } else {
                    dataService.setActiveLanguage(val);
                  }
                }}
              />
            </td>

            <td className="td1 center" colSpan={2}>
              Text Title (Wildc.=*):
              <input
                type="text"
                name="query"
                ref={queryRef}
                value={query}
                maxLength={50}
                size={15}
              />
              &nbsp;
              <input
                type="button"
                name="querybutton"
                value="Filter"
                onClick={() =>
                  navigate(
                    `/edit_archivedtexts?page=1&query=${
                      queryRef.current?.value || ''
                    }`
                  )
                }
              />
              &nbsp;
              <input
                type="button"
                value="Clear"
                onClick={() => navigate('/edit_archivedtexts')}
              />
            </td>
          </tr>
          <tr>
            <td
              className="td1 center"
              colSpan={2}
              style={{ whiteSpace: 'nowrap' }}
            >
              Tag #1:
              {/* TODO filter tags here to only be ones that correspond to an archivedTag */}
              <TagDropDown tags={tags} tagKey="tag1" defaultValue={tag1} />
            </td>
            <TagAndOr
              defaultValue={tag12}
              onChange={({ target: { value: val } }) =>
                paramUpdater({ tag12: val })
              }
            />
            <td className="td1 center" style={{ whiteSpace: 'nowrap' }}>
              Tag #2:
              {/* TODO filter tags here to only be ones that correspond to an archivedTag */}
              <TagDropDown tags={tags} tagKey="tag2" defaultValue={tag2} />
            </td>
          </tr>
          {recno > 0 && (
            <FilterSortPager
              currentPage={currentPage}
              numPages={numPages}
              recno={recno}
              elementName={'Text'}
            >
              <GetTextsSortSelectoptions selected={sorting} />
            </FilterSortPager>
          )}
        </table>
      </form>
      {recno === 0 ? (
        <p>No archived texts found.</p>
      ) : (
        <form name="form2">
          <input type="hidden" name="data" value="" />
          <table className="tab1" cellSpacing={0} cellPadding={5}>
            <tr>
              <th className="th1" colSpan={2}>
                Multi Actions <Icon src="lightning" title="Multi Actions" />
              </th>
            </tr>
            <tr>
              <td className="td1 center">
                <input type="button" value="Mark All" onClick={onSelectAll} />
                <input type="button" value="Mark None" onClick={onSelectNone} />
              </td>
              <td className="td1 center">
                Marked Texts:&nbsp;
                <select
                  name="markaction"
                  id="markaction"
                  disabled={selectedValues.size === 0}
                  onChange={({ target: { value } }) => {
                    // TODO rest
                    if (value === 'del') {
                      if (confirmDelete()) {
                        dataService.deleteMultipleArchivedTexts([
                          ...selectedValues,
                        ]);
                      }
                    }
                  }}
                >
                  <GetMultipleArchivedTextActionsSelectOptions />
                </select>
              </td>
            </tr>
          </table>

          <table className="sortable tab1" cellSpacing={0} cellPadding={5}>
            <tr>
              <th className="th1 sorttable_nosort">Mark</th>
              <th className="th1 sorttable_nosort">Actions</th>
              {!activeLanguage && (
                <SortableHeader
                  sorting={sorting}
                  upSorting={TextSorting['Lang.']}
                  downSorting={TextSorting['Lang. (desc)']}
                >
                  Lang.
                </SortableHeader>
              )}
              <SortableHeader
                sorting={sorting}
                upSorting={TextSorting['Title A-Z']}
                downSorting={TextSorting['Title Z-A']}
              >
                Title [Tags] / Audio:&nbsp;
                <Icon src="speaker-volume" title="With Audio" />
                , Src.Link:&nbsp;
                <Icon src="chain" title="Source Link available" />
                , Ann.Text:&nbsp;
                <Icon src="tick" title="Annotated Text available" />
              </SortableHeader>
            </tr>
            {dataOnPage.map((text) => {
              const languageForLine = languages.find(
                (lang) => lang.LgID === text.AtLgID
              );
              if (!languageForLine) {
                throw new Error('Invalid Language line');
              }

              return (
                <tr>
                  <td className="td1 center">
                    <a id={`rec${text['AtID']}`}>
                      <input
                        name="marked[]"
                        type="checkbox"
                        // onClick={markClick}
                        {...checkboxPropsForEntry(text)}
                        value={text['AtID']}
                      />
                    </a>
                  </td>
                  {/* ' . checkTest(record['AtID'], 'marked') . '  */}
                  <td style={{ whiteSpace: 'nowrap' }} className="td1 center">
                    &nbsp;
                    <A href={`/edit_archivedtexts?unarch=${text.AtID}`}>
                      <Icon src="inbox-upload" title="Unarchive" />
                    </A>
                    &nbsp;
                    <A href={`/edit_archivedtexts?chg=${text.AtID}`}>
                      <Icon src="document--pencil" title="Edit" />
                    </A>
                    &nbsp;
                    <span
                      className="click"
                      onClick={() => {
                        if (confirmDelete()) {
                          // TODO del url pattern uniformly?
                          dataService.deleteArchivedText(text.AtID);
                        }
                      }}
                    >
                      <Icon src="minus-button" title="Delete" />
                    </span>
                    &nbsp;
                  </td>
                  {!activeLanguage && (
                    <td className="td1 center">{languageForLine.LgName}</td>
                  )}
                  <td className="td1 center">
                    {text.AtTitle}
                    <span className="smallgray2">
                      {' '}
                      {textTagLookup[text.AtID] && (
                        <>
                          {'['}
                          {textTagLookup[text.AtID].join(', ')}
                          {']'}
                        </>
                      )}
                    </span>
                    {text.AtAudioURI && (
                      <Icon src="speaker-volume" title="With Audio" />
                    )}
                    {text.AtSourceURI && (
                      <a href={text.AtSourceURI} target="_blank">
                        <Icon src="chain" title="Link to Text Source" />
                      </a>
                    )}
                    {text.AtAnnotatedText && (
                      <Icon src="tick" title="Annotated Text available" />
                    )}
                  </td>
                </tr>
              );
            })}
          </table>
        </form>
      )}
      {numPages > 1 && (
        <form name="form3" action="#">
          <TableFooter
            recno={recno}
            currentPage={currentPage}
            numPages={numPages}
            pageSize={pageSize}
            elementName={'Text'}
            pageSizeSettingsKey={'set-archivedtexts-per-page'}
          />
        </form>
      )}

      <p>
        <input
          type="button"
          value="Active Texts"
          onClick={() => navigate('/edit_texts?query=&page=1')}
        />
      </p>
    </>
  );
}

/**
 *
 * @param refMap
 */
export function resetAll(refMap: string): void {
  window.alert('TODO Function not implemented.');
}
/**
 *
 */
export function EditArchivedText({ chgID }: { chgID: ArchivedTextID }) {
  const [{ archivedtexts }] = useData(['archivedtexts']);
  const text = archivedtexts.find((val) => val.AtID === chgID);
  console.log('TEST123-AT', { chgID, archivedtexts });
  // $sql = 'select AtLgID, AtTitle, AtText, AtAudioURI, AtSourceURI, length(AtAnnotatedText) as annotlen from ' . $tbpref . 'archivedtexts where AtID = ' . $_REQUEST['chg'];
  // $res = do_mysqli_query($sql);
  // if ($record = mysqli_fetch_assoc($res)) {
  const {
    Input: AtInput,
    onSubmit,
    refMap,
    setDirty,
    TextArea: AtTextArea,
    LanguageSelectInput,
  } = useFormInput({ validator: ArchivedTextsWithTagsValidator, entry: text });

  if (!text) {
    return <></>;
    // throw new Error('Invalid ChgID!');
  }
  const {
    AtAudioURI,
    AtAnnotatedText,
    AtID,
    AtLgID,
    AtText,
    AtTitle,
    AtSourceURI,
  } = text;
  const annotlen = AtAnnotatedText.length;
  return (
    <>
      <h4>Edit Archived Text</h4>
      <form className="validate">
        <AtInput type="hidden" entryKey="AtID" />
        <table className="tab3" cellSpacing={0} cellPadding={5}>
          <tr>
            <td className="td1 right">Language:</td>
            <td className="td1">
              <LanguageSelectInput entryKey={'AtLgID'} isRequired />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Title:</td>
            <td className="td1">
              <AtInput
                type="text"
                className="notempty checkoutsidebmp"
                errorName="Title"
                entryKey="AtTitle"
                default
                maxLength={200}
                size={60}
              />{' '}
              <img
                src="icn/status-busy.png"
                title="Field must not be empty"
                alt="Field must not be empty"
              />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Text:</td>
            <td className="td1">
              <AtTextArea
                isRequired
                entryKey="AtText"
                className="notempty checkbytes checkoutsidebmp"
                // data_maxlength={65000}
                errorName="Text"
                cols={60}
                rows={20}
                default
              />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Ann.Text:</td>
            <td className="td1">
              {annotlen ? (
                <>
                  <img
                    src="icn/tick.png"
                    title="With Annotation"
                    alt="With Annotation"
                  />{' '}
                  Exists - May be partially or fully lost if you change the
                  text!
                </>
              ) : (
                <>
                  <img
                    src="icn/cross.png"
                    title="No Annotation"
                    alt="No Annotation"
                  />{' '}
                  - None
                </>
              )}
            </td>
          </tr>
          <tr>
            <td className="td1 right">Source URI:</td>
            <td className="td1">
              <AtInput
                type="text"
                className="checkurl checkoutsidebmp"
                errorName="Source URI"
                entryKey="AtSourceURI"
                default
                maxLength={1000}
                size={60}
              />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Tags:</td>
            <td className="td1">
              <TextTagsAutocomplete ref={refMap.taglist} onChange={setDirty} />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Audio-URI:</td>
            <td className="td1">
              <AtInput
                type="text"
                default
                className="checkoutsidebmp"
                errorName="Audio-URI"
                entryKey="AtAudioURI"
                maxLength={200}
                size={60}
              />
              <span id="mediaselect">
                <SelectMediaPath f={AtAudioURI} />
              </span>
            </td>
          </tr>
          <tr>
            <td className="td1 right" colSpan={2}>
              <input
                type="button"
                value="Cancel"
                // onClick={() =>
                //   onSubmit({}, (data) => {
                //     dataService.editArchivedText(data);
                //   })
                // }
                // onClick="{resetDirty(); location.href='edit_archivedtexts.php#rec<?php echo $_REQUEST['chg']; ?>';}"
              />
              <input
                type="button"
                value="Change"
                onClick={() =>
                  onSubmit({}, (data) => {
                    dataService.editArchivedText(data);
                  })
                }
              />
            </td>
          </tr>
        </table>
      </form>
    </>
  );
}
