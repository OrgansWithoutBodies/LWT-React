import { UIString } from 'lwt-i18n';
import {
  LanguagesID,
  NumericalStrengthPotentiallyCompound,
  Tag,
  Tag2,
  Tags2ID,
  TagsID,
} from 'lwt-schemas';
import { dataService } from 'lwt-state';
import {
  Icon,
  LanguageDropdown,
  TagAndOr,
  TagDropDown,
  useI18N,
  useUpdateParams,
} from 'lwt-ui-kit';
import { PropsWithChildren, useRef } from 'react';
import { FilterSortPager } from '../ArchivedText/FilterSortPager';

// TODO generic filterbox components: Language, (Text Select,Status Select, Tag1/2 Select), (Text Title Query, Term Rom/Trans Query, Tag Text Query) {[filter] [clear]}
export function LanguageBoxFilterWidget({
  activeLanguageID,
}: {
  activeLanguageID: LanguagesID | null | undefined;
}) {
  const t = useI18N();
  return (
    <td className="td1 center" colSpan={2}>
      {t('Language')}:
      <LanguageDropdown
        onChange={(val) => {
          dataService.setActiveLanguage(val);
        }}
        defaultValue={activeLanguageID === null ? undefined : activeLanguageID}
        header="Filter off"
      />
    </td>
  );
}

export function StatusSelectFilterWidget({
  selected = null,
}: {
  selected?: NumericalStrengthPotentiallyCompound | null;
}) {
  const t = useI18N();
  const updateParams = useUpdateParams();
  return (
    <td style={{ whiteSpace: 'nowrap' }} className="td1 center" colSpan={2}>
      {t('Status')}:
      <select
        name="status"
        defaultValue={selected === null ? undefined : selected}
        onChange={({ target: { value: selectedValue } }) => {
          updateParams({ status: selectedValue, page: null });
        }}
      >
        <option value="" selected={selected === undefined}>
          [{t('Filter off')}]
        </option>
        {new Array(5).fill(0).map((_, ii) => {
          const val = ii + 1;
          return (
            <option key={val} value={val} selected={selected === val}>
              {val === 5 ? t('Learned') : t('Learning')} [{val}]
            </option>
          );
        })}
        <option value="99" selected={selected === 99}>
          Well Known [WKn]
        </option>
        <option value="98" selected={selected === 98}>
          Ignored [Ign]
        </option>
        {/* TODO reuse GetWordstatusSelectoptions */}
        {new Array(4).fill(0).map((_, ii) => {
          const val = ii + 1;
          return (
            <span key={ii}>
              <option disabled>--------</option>
              {new Array(5 - val).fill(0).map((__, jj) => {
                const jVal = jj + 1;
                return (
                  <option
                    key={jj}
                    value={`${val}${jVal}`}
                    selected={selected === Number.parseInt(`${val}${jVal}`)}
                  >
                    {val + jVal === 5 ? t('Learning/-ed') : t('Learning')} [
                    {val}
                    ..
                    {val + jVal}]
                  </option>
                );
              })}
            </span>
          );
        })}
        <option disabled>--------</option>
        <option value="599">{t('All known [5+WKn]')}</option>
      </select>
    </td>
  );
}
export function QueryFilterWidget({
  filterString,
  query,
  colSpan = 2,
}: {
  filterString: UIString;
  query: string | null;
  colSpan?: number;
}) {
  const updateParams = useUpdateParams();
  const queryRef = useRef<HTMLInputElement | null>(null);

  const t = useI18N();
  return (
    <td
      style={{ whiteSpace: 'nowrap' }}
      className="td1 center"
      colSpan={colSpan}
    >
      {t(filterString)}:
      <input
        onKeyDown={(val) => {
          if (val.key === 'Enter') {
            if (queryRef.current) {
              updateParams({
                query:
                  queryRef.current.value === '' ? null : queryRef.current.value,
                page: null,
              });
            }
            val.preventDefault();
          }
        }}
        type="text"
        name="query"
        defaultValue={query || ''}
        ref={queryRef}
        maxLength={50}
        size={15}
      />
      &nbsp;
      <input
        type="button"
        name="querybutton"
        value="Filter"
        onClick={() => {
          console.log('TEST123-filter');
          if (queryRef.current) {
            updateParams({
              query:
                queryRef.current.value === '' ? null : queryRef.current.value,
              page: null,
            });
          }
        }}
      />
      &nbsp;
      <input
        type="button"
        value="Clear"
        onClick={() => {
          updateParams(null);
          if (queryRef.current) {
            queryRef.current.value = '';
          }
        }}
      />
    </td>
  );
}
export function FilterHeaderWidget() {
  const paramUpdater = useUpdateParams();
  const t = useI18N();
  return (
    <tr>
      <th className="th1" colSpan={4}>
        {t('Filter')} <Icon src="funnel" title="Filter" />
        &nbsp;
        <input
          type="button"
          value="Reset All"
          // TODO this doesnt update language to null
          onClick={() => paramUpdater(null)}
        />
      </th>
    </tr>
  );
}

export function FilterBox({
  footerProps,
  recno,
  children,
}: PropsWithChildren<{
  recno: number;
  footerProps: Parameters<typeof FilterSortPager>[0];
}>) {
  return (
    <table className="tab1" cellSpacing={0} cellPadding={5}>
      <FilterHeaderWidget />
      {children}
      {recno > 0 && <FilterSortPager {...footerProps} />}
    </table>
  );
}
type TextTagWidgetProps = {
  availableTags: Tag2[];
  tag1: Tags2ID | null;
  tag12: 0 | 1;
  tag2: Tags2ID | null;
};

type TermTagWidgetProps = {
  availableTags: Tag[];
  tag1: TagsID | null;
  tag12: 0 | 1;
  tag2: TagsID | null;
};

export function CompoundTagFilterWidget(
  tagArgs: TextTagWidgetProps | TermTagWidgetProps
) {
  const paramUpdater = useUpdateParams();
  const isTextTag = tagIsTextTag(tagArgs);
  const t = useI18N();
  return (
    <tr>
      <td className="td1 center" colSpan={2} style={{ whiteSpace: 'nowrap' }}>
        {t('Tag #1')}:{/* just used for type discrimination */}
        {isTextTag ? (
          <TagDropDown
            tags={tagArgs.availableTags}
            tagKey={'tag1'}
            defaultValue={tagArgs.tag1}
          />
        ) : (
          <TagDropDown
            tags={tagArgs.availableTags}
            tagKey={'tag1'}
            defaultValue={tagArgs.tag1}
          />
        )}
      </td>
      <TagAndOr
        defaultValue={tagArgs.tag12}
        onChange={({ target: { value } }) => {
          paramUpdater({ tag12: value, page: null });
        }}
      />
      <td className="td1 center" style={{ whiteSpace: 'nowrap' }}>
        {t('Tag #2')}:
        {isTextTag ? (
          <TagDropDown
            tags={tagArgs.availableTags}
            tagKey={'tag2'}
            defaultValue={tagArgs.tag2}
          />
        ) : (
          <TagDropDown
            tags={tagArgs.availableTags}
            tagKey={'tag2'}
            defaultValue={tagArgs.tag2}
          />
        )}{' '}
      </td>
    </tr>
  );
}
function tagIsTextTag(
  args: TextTagWidgetProps | TermTagWidgetProps
): args is TextTagWidgetProps {
  return (
    args.availableTags &&
    args.availableTags[0] !== undefined &&
    'T2ID' in args.availableTags[0]
  );
}
