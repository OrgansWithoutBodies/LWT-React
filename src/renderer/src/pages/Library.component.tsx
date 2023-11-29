import { useRef } from 'react';
import { TextDetailRow } from '../data/data.query';
import { dataService } from '../data/data.service';
import { useData } from '../data/useAkita';
import { TextsId, TextsValidator } from '../data/validators';
import { usePager } from '../hooks/usePager';
import { useSelection } from '../hooks/useSelection';
import { A } from '../nav/InternalLink';
import { useInternalNavigate, useUpdateParams } from '../nav/useInternalNav';
import { Icon, RequiredLineButton } from '../ui-kit/Icon';
import { LanguageDropdown } from '../ui-kit/LanguageDropdown';
import { Pager } from '../ui-kit/Pager';
import { resetAll } from './EditArchived.component';
import { RefMap } from './Forms';
import { Header } from './Header';
import { TagAndOr, TagDropDown, resetDirty } from './Terms.component';
import { buildFormInput } from './buildFormInput';
const TextMultiAction = {
  test: (selectedValues: Set<TextsId>) => {
    console.log('test');
  },
  addtag: (selectedValues: Set<TextsId>) => {
    console.log('addtag');
  },
  deltag: (selectedValues: Set<TextsId>) => {
    console.log('deltag');
  },
  rebuild: (selectedValues: Set<TextsId>) => {
    console.log('rebuild');
  },
  setsent: (selectedValues: Set<TextsId>) => {
    console.log('setsent');
  },
  arch: (selectedValues: Set<TextsId>) => {
    console.log('arch');
  },
  del: (selectedValues: Set<TextsId>) => {
    console.log('del');
  },
};
export function TextMultiActions({
  onSelectAll,
  onSelectNone,
  selectedValues,
}: {
  selectedValues: Set<TextsId>;
  onSelectAll: () => void;
  onSelectNone: () => void;
}) {
  return (
    <>
      <form name="form1" action="#">
        <table className="tab1" cellSpacing={0} cellPadding={5}>
          <tbody>
            <tr>
              <th className="th1" colSpan={2}>
                Multi Actions
                <Icon src="lightning" title="Multi Actions" />
              </th>
            </tr>
            <tr>
              <td className="td1 center">
                <input type="button" value="Mark All" onClick={onSelectAll} />
                <input type="button" value="Mark None" onClick={onSelectNone} />
              </td>
              <td className="td1 center">
                Marked Texts
                <select
                  name="markaction"
                  id="markaction"
                  disabled={selectedValues.size === 0}
                  onChange={({ target: { value } }) => {
                    /* TODO */
                    TextMultiAction[value as keyof typeof TextMultiAction](
                      selectedValues
                    );
                  }}
                >
                  <option value=""></option>
                  <option disabled={true}>------------</option>
                  <option value={'test'}>Test Marked Texts</option>
                  <option disabled={true}>------------</option>
                  <option value={'addtag'}>Add Tag</option>
                  <option value={'deltag'}>Remove Tag</option>
                  <option disabled={true}>------------</option>
                  <option value={'rebuild'}>Reparse Texts</option>
                  <option value={'setsent'}>Set Term Sentences</option>
                  <option disabled={true}>------------</option>
                  <option value={'arch'}>Archive Marked Texts</option>
                  <option disabled={true}>------------</option>
                  <option value={'del'}>Delete Marked Texts</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </>
  );
}

function LibraryHeader(): JSX.Element {
  return (
    <thead>
      <tr>
        <th className="th1 sorttable_nosort">Mark</th>
        <th className="th1 sorttable_nosort">
          Read
          <br />
          &&nbsp;Test
        </th>
        <th className="th1 sorttable_nosort">Actions</th>
        <th className="th1 clickable">
          Title [Tags] / Audio:&nbsp;
          <Icon src="speaker-volume" title="With Audio" />
          , Src.Link:&nbsp;
          <Icon src="chain" title="Source Link available" />
          , Ann.Text:&nbsp;
          <Icon src="tick" title="Annotated Text available" />
        </th>
        <th className="th1 sorttable_numeric clickable">
          Total
          <br />
          Words
        </th>
        <th className="th1 sorttable_numeric clickable">
          Saved
          <br />
          Wo+Ex
        </th>
        <th className="th1 sorttable_numeric clickable">
          Unkn.
          <br />
          Words
        </th>
        <th className="th1 sorttable_numeric clickable">
          Unkn.
          <br />%
        </th>
      </tr>
    </thead>
  );
}
function LibraryFooter({
  numTexts,
  currentPage,
  numPages,
}: {
  numTexts: number;
  currentPage: number;
  numPages: number;
}): JSX.Element {
  return (
    <>
      <table className="tab1" cellSpacing={0} cellPadding={5}>
        <tbody>
          <tr>
            <th style={{ whiteSpace: 'nowrap' }} className="th1">
              {numTexts} Texts
            </th>
            <th style={{ whiteSpace: 'nowrap' }} className="th1">
              &nbsp; &nbsp;
              <Icon src="placeholder" alt="-" />
              <Icon src="placeholder" alt="-" />
              <Pager currentPage={currentPage} numPages={numPages} />
            </th>
            <th style={{ whiteSpace: 'nowrap' }} className="th1">
              &nbsp; &nbsp;
              <Icon src="placeholder" alt="-" />
              <Icon src="placeholder" alt="-" />
              <ResizePage
                pageSize={15}
                onPageResize={function (newSize: number): void {
                  throw new Error('Function not implemented.');
                }}
              />
            </th>
          </tr>
        </tbody>
      </table>
    </>
  );
}
function ResizePage({
  pageSize,
  onPageResize,
}: {
  pageSize: number;
  onPageResize: (newSize: number) => void;
}) {
  const numberOptions = 15;
  const options = new Array(numberOptions).fill(0).map((_, ii) => (ii + 1) * 5);
  return (
    <>
      #/Page:{' '}
      <select
        value={pageSize}
        onChange={(val) => onPageResize(Number.parseInt(val))}
      >
        {options.map((val) => {
          return <option value={val}>{val}</option>;
        })}
      </select>
    </>
  );
}

function LibraryRow({
  text,
  checked,
  onChange,
}: {
  text: TextDetailRow;
  checked: boolean;
  onChange: () => void;
}): JSX.Element {
  return (
    <tr>
      <td className="td1 center">
        <A>
          {/* name="rec2" */}
          <input
            name="marked[]"
            className="markcheck"
            type="checkbox"
            checked={checked}
            onChange={() => onChange()}
            value="2"
          />
        </A>
      </td>
      <td style={{ whiteSpace: 'nowrap' }} className="td1 center">
        &nbsp;
        <A href={`/do_text?start=${text.TxID}`}>
          <Icon src="book-open-bookmark" title="Read" />
        </A>
        &nbsp;
        <A href={`/do_test?text=${text.TxID}`}>
          <Icon src="question-balloon" title="Test" />
        </A>
        &nbsp;
      </td>
      <td className="td1 center" style={{ whiteSpace: 'nowrap' }}>
        &nbsp;
        <A href={`/print_text?text=${text.TxID}`}>
          <Icon src="printer" title="Print" />
        </A>
        &nbsp;
        <A href={`/edit_texts?arch=${text.TxID}`}>
          <Icon src="inbox-download" title="Archive" />
        </A>
        &nbsp;
        <A href={`/edit_texts?chg=${text.TxID}`}>
          <Icon src="document--pencil" title="Edit" />
        </A>
        &nbsp;
        <span
          className="click"
          onClick={() => dataService.deleteText(text.TxID)}
        >
          <Icon src="minus-button" title="Delete" />
        </span>
        &nbsp;
      </td>
      <td className="td1 center">
        {text.title}
        <span className="smallgray2">
          {text.tags &&
            '[' +
              text.tags.map((tag, ii) => {
                return ii > 0 ? ' ' + tag : tag;
              }) +
              ']'}
        </span>
        {text.audioAvailable && <Icon src="speaker-volume" />}
        {text.link && <Icon src="chain" />}
        {text.annotatedAvailable && <Icon src="tick" />}
      </td>
      <td className="td1 center">{text.totalWords}</td>
      <td className="td1 center">{text.saved}</td>
      <td className="td1 center">{text.unk}</td>
      <td className="td1 center">{text.unkPerc}</td>
    </tr>
  );
}

export function Library({
  currentPage,
  query = null,
  filterTag1 = null,
  filterTag2 = null,
}: {
  currentPage: number;
  query: string | null;
  filterTag1: number | null;
  filterTag2: number | null;
}) {
  const [{ textDetails, activeLanguage, texttags, tags2, settings }] = useData([
    'textDetails',
    'activeLanguage',
    'texttags',
    'tags2',
    'settings',
  ]);
  console.log('TEST123-library', {
    activeLanguage,
    tags2,
    texttags,
    textDetails,
  });
  const pageSize = settings['set-texts-per-page'] || -1;

  const { numPages, dataOnPage } = usePager(
    textDetails || [],
    currentPage,
    pageSize
  );
  const paramUpdater = useUpdateParams();
  const navigator = useInternalNavigate();
  const queryRef = useRef<HTMLInputElement | undefined>();
  // TODO
  const {
    selectedValues,
    onSelectAll,
    onSelectNone,
    onSelect,
    checkboxPropsForEntry,
  } = useSelection(textDetails || [], 'TxID');

  const recno = (textDetails || []).length;
  return (
    <>
      <Header
        title={activeLanguage ? `My ${activeLanguage.LgName} Texts` : ''}
      />
      <p>
        <A href={`/edit_texts?new=${1}`}>
          <Icon src="plus-button" title="New" /> New Text ...
        </A>
        &nbsp; | &nbsp;
        <A href="/long_text_import">
          <Icon src="plus-button" title="Long Text Import" /> Long Text Import
          ...
        </A>
      </p>

      <form name="form1">
        <table className="tab1" cellSpacing={0} cellPadding={5}>
          <tr>
            <th className="th1" colSpan={4}>
              Filter <Icon src="funnel" title="Filter" />
              &nbsp;
              <input
                type="button"
                value="Reset All"
                onClick={() => {
                  resetAll('edit_texts');
                  navigator('/edit_texts');
                }}
              />
            </th>
          </tr>
          <tr>
            <td className="td1 center" colSpan={2}>
              Language:
              <LanguageDropdown
                name="filterlang"
                header="Filter off"
                onChange={(val) => {
                  if (val === -1) {
                    dataService.setActiveLanguage(null);
                  } else {
                    dataService.setActiveLanguage(val);
                  }
                }}
                defaultValue={activeLanguage?.LgID}
              />
            </td>
            <td className="td1 center" colSpan={2}>
              Text Title (Wildc.=*):
              <input
                type="text"
                name="query"
                ref={queryRef}
                defaultValue={query || ''}
                maxLength={50}
                size={15}
              />
              &nbsp;
              <input
                type="button"
                name="querybutton"
                value="Filter"
                onClick={() =>
                  navigator(
                    `/edit_texts?page=1&query=${queryRef.current?.value || ''}`
                  )
                }
              />
              &nbsp;
              <input
                type="button"
                value="Clear"
                onClick={() => {
                  navigator('/edit_texts?page=1&query=');
                  if (queryRef.current) {
                    queryRef.current.value = '';
                  }
                }}
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
              <TagDropDown tags={tags2} tagKey={'tag1'} />
              {/* {texttags
                  .filter((tag) => {
                    console.log(tag);
                    return true;
                  })
                  .map((tag) => {
                    return (
                      <option value={tag.TtTxID}>
                        {' '}
                        {
                          tags2.find(({ T2ID }) => {
                            return tag.TtT2ID === T2ID;
                          })?.T2Text
                        }
                      </option>
                    );
                  })} */}
            </td>
            <TagAndOr
              onChange={({ target: { value } }) => {
                paramUpdater({ tag12: value });
              }}
            />
            <td className="td1 center" style={{ whiteSpace: 'nowrap' }}>
              Tag #2:
              <TagDropDown tags={tags2} tagKey={'tag2'} />
            </td>
          </tr>

          {/* TODO */}
          {/* <?php if($recno > 0) { ?> */}
          <tr>
            <th className="th1" colSpan={1} style={{ whiteSpace: 'nowrap' }}>
              {`${recno} Text${recno === 1 ? '' : 's'}`}
            </th>
            <th className="th1" colSpan={2} style={{ whiteSpace: 'nowrap' }}>
              <Pager currentPage={currentPage} numPages={numPages} />
            </th>
            <th className="th1" colSpan={1} style={{ whiteSpace: 'nowrap' }}>
              Sort Order:
              <select
                name="sort"
                // TODO
                onChange="{val=document.form1.sort.options[document.form1.sort.selectedIndex].value; location.href='edit_texts.php?page=1&amp;sort=' + val;}"
              >
                {/* TODO */}
                {/* title-a-z/newest/oldest */}
                {/* <?php echo get_textssort_selectoptions($currentsort); ?> */}
              </select>
            </th>
          </tr>
        </table>
      </form>

      <TextMultiActions
        onSelectAll={onSelectAll}
        onSelectNone={onSelectNone}
        selectedValues={selectedValues}
      />
      {
        <>
          <table className="sortable tab1">
            <LibraryHeader />
            <tbody>
              {dataOnPage &&
                dataOnPage.map((text) => {
                  return (
                    <LibraryRow text={text} {...checkboxPropsForEntry(text)} />
                  );
                })}
            </tbody>
          </table>
          <LibraryFooter
            numTexts={textDetails ? textDetails.length : 0}
            currentPage={currentPage}
            numPages={numPages}
          />
        </>
      }
    </>
  );
}
export function EditText({ chgID }: { chgID: TextsId }) {
  const [{ texts }] = useData(['texts']);
  const editingText = texts.find(({ TxID }) => {
    return TxID === chgID;
  });
  if (!editingText) {
    throw new Error('Invalid change ID');
  }
  const validator = TextsValidator;
  const navigator = useInternalNavigate();
  const refMap = RefMap(validator);
  const TxInput = buildFormInput(refMap, editingText);
  return (
    <>
      <Header title={'My Texts'} />
      <h4>
        Edit Text{' '}
        <a target="_blank" href="info.htm#howtotext">
          <Icon src="question-frame" title="Help" />
        </a>
      </h4>
      <form
        className="validate"
        // TODO
        action="<?php echo $_SERVER['PHP_SELF']; ?>#rec<?php echo $_REQUEST['chg']; ?>"
        method="post"
      >
        <TxInput type="hidden" entryKey="TxID" fixed />
        <table className="tab3" cellSpacing={0} cellPadding={5}>
          <tr>
            <td className="td1 right">Language:</td>
            <td className="td1">
              <LanguageDropdown defaultValue={editingText.TxLgID} />
              <RequiredLineButton />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Title:</td>
            <td className="td1">
              <TxInput
                type="text"
                className="notempty checkoutsidebmp"
                // data_info="Title"
                entryKey="TxTitle"
                default
                maxLength={200}
                size={60}
              />{' '}
              <RequiredLineButton />
            </td>
          </tr>
          <tr>
            <td className="td1 right">
              Text:
              <br />
              <br />
              (max.
              <br />
              65,000
              <br />
              bytes)
            </td>
            <td className="td1">
              <textarea
                // TODO

                // function getScriptDirectionTag($lid)
                // {
                // 	global $tbpref;
                // 	if (!isset($lid))
                // 		return '';
                // 	if (trim($lid) == '')
                // 		return '';
                // 	if (!is_numeric($lid))
                // 		return '';
                // 	$r = get_first_value("select LgRightToLeft as value from " . $tbpref . "languages where LgID='" . $lid . "'");
                // 	if (isset($r)) {
                // 		if ($r)
                // 			return ' dir="rtl" ';
                // 	}
                // 	return '';
                // }
                //  <?php echo getScriptDirectionTag($record['TxLgID']); ?>
                name="TxText"
                className="notempty checkbytes checkoutsidebmp"
                maxLength={65000}
                // data_info="Text"
                cols={60}
                rows={20}
                defaultValue={editingText.TxText}
              />
              <RequiredLineButton />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Ann.Text:</td>
            <td className="td1">
              {/* TODO */}
              {/* <?php echo ($record['annotlen'] ? '<Icon src="tick.png" title="With Improved Annotation" alt="With Improved Annotation" /> Exists - May be partially or fully lost if you change the text!<br /><input type="button" value="Print/Edit..." onclick="location.href=\'print_impr_text.php?text=' . $_REQUEST['chg'] . '\';" />' : '<img src="icn/cross" title="No Improved Annotation" />'); ?> */}
            </td>
          </tr>
          <tr>
            <td className="td1 right">Source URI:</td>
            <td className="td1">
              <TxInput
                type="text"
                className="checkurl checkoutsidebmp"
                // data_info="Source URI"
                entryKey="TxSourceURI"
                default
                maxLength={1000}
                size={60}
              />
            </td>
          </tr>
          <tr>
            <td className="td1 right">Tags:</td>
            <td className="td1">
              {/* TODO */}
              {/* <?php echo getTextTags($_REQUEST['chg']); ?> */}
            </td>
          </tr>
          <tr>
            <td className="td1 right">Audio-URI:</td>
            <td className="td1">
              <TxInput
                type="text"
                className="checkoutsidebmp"
                // data_info="Audio-URI"
                entryKey="TxAudioURI"
                default
                maxLength={200}
                size={60}
              />
              <span id="mediaselect">
                {/* TODO */}
                {/* <?php echo selectmediapath('TxAudioURI'); ?> */}
              </span>
            </td>
          </tr>
          <tr>
            <td className="td1 right" colSpan={2}>
              <input
                type="button"
                value="Cancel"
                onClick={() => {
                  resetDirty();
                  navigator(`/edit_texts.php#rec${chgID}`);
                }}
              />
              <input
                type="button"
                onClick={() => {
                  window.alert('TODO');
                }}
                value="Check"
              />
              <input
                type="button"
                onClick={() => {
                  window.alert('TODO');
                }}
                value="Change"
              />
              <input
                type="button"
                onClick={() => {
                  window.alert('TODO');
                }}
                value="Change and Open"
              />
            </td>
          </tr>
        </table>
      </form>
    </>
  );
}
