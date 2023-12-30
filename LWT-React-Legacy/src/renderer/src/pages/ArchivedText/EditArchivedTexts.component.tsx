import { confirmDelete } from 'lwt-common';
import {
  ArchivedText,
  ArchivedTextID,
  ArchivedTextsWithTagsValidator,
  Language,
  TagsID,
} from 'lwt-schemas';
import { dataService, useData } from 'lwt-state';
import {
  A,
  GenericMultiActions,
  GetMultipleArchivedTextActionsSelectOptions,
  GetTextsSortSelectoptions,
  Header,
  Icon,
  MultipleTextActionSelectOption,
  SortableHeader,
  TableFooter,
  TagAndOr,
  TagDropDown,
  TextTagsAutocomplete,
  useFormInput,
  useInternalNavigate,
  usePager,
  useUpdateParams,
} from 'lwt-ui-kit';
import { useSelection } from '../../hooks/useSelection';
import { TextSorting } from '../Sorting';
import {
  FilterHeaderWidget,
  LanguageBoxFilterWidget,
  QueryFilterWidget,
} from '../Term/LanguageBoxFilterWidget';
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

  return (
    <>
      <Header
        title={
          `My ${
            activeLanguage ? `${activeLanguage.LgName} ` : ''
          }Text Archive` as any
        }
      />
      <p>&nbsp;</p>
      <form name="form1">
        <table className="tab1" cellSpacing={0} cellPadding={5}>
          <FilterHeaderWidget />
          <tr>
            <LanguageBoxFilterWidget activeLanguageID={activeLanguage?.LgID} />
            <QueryFilterWidget
              query={query}
              filterString="Text Title (Wildc.=*)"
            />
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

          <GenericMultiActions
            AllActions={null}
            onChangeAll={null}
            countAllTerms={null}
            SelectedOptions={GetMultipleArchivedTextActionsSelectOptions}
            onChangeSelected={({ target: { value } }) => {
              // TODO rest
              switch (value as MultipleTextActionSelectOption) {
                case MultipleTextActionSelectOption.del:
                  if (confirmDelete()) {
                    dataService.deleteMultipleArchivedTexts([
                      ...selectedValues,
                    ]);
                  }
                  break;
                case MultipleTextActionSelectOption.addtag: {
                  const answer = window.prompt(
                    `*** ${'addTag'} ***\n\n*** ${
                      selectedValues.size
                    } Record(s) will be affected ***\n\nPlease enter one tag (20 char. max., no spaces, no commas -- or leave empty to cancel:`
                  );
                  if (answer === null) {
                    break;
                  }

                  dataService.addTagToMultipleArchivedTexts(answer, [
                    ...selectedValues,
                  ]);

                  break;
                }
                case MultipleTextActionSelectOption.deltag:
                  console.log('TODO');
                  break;
                case MultipleTextActionSelectOption.unarch:
                  dataService.unarchiveMultipleTexts([...selectedValues]);
                  break;
                case MultipleTextActionSelectOption.delall:
                  console.log('TODO');
                  break;
              }
            }}
            countSelectedTerms={selectedValues.size}
            onSelectAll={onSelectAll}
            onSelectNone={onSelectNone}
            nounSingular={'Text'}
          />

          <table className="sortable tab1" cellSpacing={0} cellPadding={5}>
            {
              <ArchivedTextTableHeader
                activeLanguage={activeLanguage}
                sorting={sorting}
              />
            }
            {dataOnPage.map((text) => {
              const languageForLine = languages.find(
                (lang) => lang.LgID === text.AtLgID
              );
              if (!languageForLine) {
                throw new Error('Invalid Language line');
              }

              return (
                <ArchivedTextRow
                  textRowProps={{
                    ...text,
                    tagList: textTagLookup[text.AtID],
                    AtLgName: languageForLine.LgName,
                  }}
                  checkboxProps={checkboxPropsForEntry(text)}
                />
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

function ArchivedTextTableHeader({
  activeLanguage,
  sorting,
}: {
  activeLanguage: Language | null;
  sorting: TextSorting;
}) {
  return (
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
  );
}

function ArchivedTextRow({
  textRowProps,
  checkboxProps,
}: {
  textRowProps: Pick<
    ArchivedText,
    'AtID' | 'AtTitle' | 'AtAudioURI' | 'AtSourceURI' | 'AtAnnotatedText'
  > & { AtLgName: string | null; tagList: string[] | null };
  checkboxProps: {
    onChange: () => void;
    checked: boolean;
  };
}) {
  return (
    <tr>
      <td className="td1 center">
        <a id={`rec${textRowProps['AtID']}`}>
          <input
            name="marked[]"
            type="checkbox"
            {...checkboxProps}
            value={textRowProps['AtID']}
          />
        </a>
      </td>
      {/* ' . checkTest(record['AtID'], 'marked') . '  */}
      <td style={{ whiteSpace: 'nowrap' }} className="td1 center">
        &nbsp;
        <A href={`/edit_archivedtexts?unarch=${textRowProps.AtID}`}>
          <Icon src="inbox-upload" title="Unarchive" />
        </A>
        &nbsp;
        <A href={`/edit_archivedtexts?chg=${textRowProps.AtID}`}>
          <Icon src="document--pencil" title="Edit" />
        </A>
        &nbsp;
        <span
          className="click"
          onClick={() => {
            if (confirmDelete()) {
              // TODO del url pattern uniformly?
              dataService.deleteArchivedText(textRowProps.AtID);
            }
          }}
        >
          <Icon src="minus-button" title="Delete" />
        </span>
        &nbsp;
      </td>
      {!textRowProps.AtLgName && (
        <td className="td1 center">{textRowProps.AtLgName}</td>
      )}
      <td className="td1 center">
        {textRowProps.AtTitle}
        <span className="smallgray2">
          {' '}
          {textRowProps.tagList && (
            <>
              {'['}
              {textRowProps.tagList.join(', ')}
              {']'}
            </>
          )}
        </span>
        {textRowProps.AtAudioURI && (
          <Icon src="speaker-volume" title="With Audio" />
        )}
        {textRowProps.AtSourceURI && (
          <a href={textRowProps.AtSourceURI} target="_blank">
            <Icon src="chain" title="Link to Text Source" />
          </a>
        )}
        {textRowProps.AtAnnotatedText && (
          <Icon src="tick" title="Annotated Text available" />
        )}
      </td>
    </tr>
  );
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
  const { AtAnnotatedText } = text;
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
              {/* TODO */}
              {/* <span id="mediaselect">
                <SelectMediaPath f={AtAudioURI} />
              </span> */}
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
