import {
  NumericalStrength,
  get_status_abbr,
  get_status_name,
} from './StrengthMap';

// function getMultipletextactionsSelectoptions()
// {
// 	r = "<option value="\" selected=\"selected">[Choose...]</option>";
// 	r += "<option disabled="disabled">------------</option>";
// 	r += "<option value="test">Test Marked Texts</option>";
// 	r += "<option disabled="disabled">------------</option>";
// 	r += "<option value="addtag">Add Tag</option>";
// 	r += "<option value="deltag">Remove Tag</option>";
// 	r += "<option disabled="disabled">------------</option>";
// 	r += "<option value="rebuild">Reparse Texts</option>";
// 	r += "<option value="setsent">Set Term Sentences</option>";
// 	r += "<option disabled="disabled">------------</option>";
// 	r += "<option value="arch">Archive Marked Texts</option>";
// 	r += "<option disabled="disabled">------------</option>";
// 	r += "<option value="del">Delete Marked Texts</option>";
// 	return r;
// }

function GetGenericSelectOptions<TVal extends string | number>({
  selectOptions,
  selected,
}: {
  selectOptions: { title: string; value: TVal; disabled?: boolean }[];
  selected: TVal | null;
}) {
  return (
    <>
      {selectOptions.map(({ title, value, disabled }) => (
        <option
          value={value}
          disabled={disabled === true}
          selected={selected === value}
        >
          {title}
        </option>
      ))}
    </>
  );
}
export function GetTagSortSelectoptions({
  selected,
}: {
  selected: number | null;
}) {
  return (
    <GetGenericSelectOptions
      selectOptions={[
        { value: 1, title: 'Tag Text A-Z' },
        { value: 2, title: 'Tag Comment A-Z' },
        { value: 3, title: 'Newest first' },
        { value: 4, title: 'Oldest first' },
      ]}
      selected={selected}
    />
  );
}

export function GetSentenceCountSelectoptions({
  selected,
}: {
  selected: number | null;
}) {
  return (
    <GetGenericSelectOptions
      selectOptions={[
        { value: 1, title: 'Just ONE' },
        { value: 2, title: 'TWO (+previous)' },
        { value: 3, title: 'THREE (+previous,+next)' },
      ]}
      selected={selected}
    />
  );
}
export function GetTextsSortSelectoptions({
  selected,
}: {
  selected: number | null;
}) {
  return (
    <GetGenericSelectOptions
      selectOptions={[
        { value: 1, title: 'Title A-Z' },
        { value: 2, title: 'Newest first' },
        { value: 3, title: 'Oldest first' },
      ]}
      selected={selected}
    />
  );
}
export function GetLanguagessizeSelectoptions({
  selected,
}: {
  selected: number | null;
}) {
  return (
    <GetGenericSelectOptions
      selectOptions={[
        { value: 100, title: '100 %' },
        { value: 150, title: '150 %' },
        { value: 200, title: '200 %' },
        { value: 250, title: '250 %' },
      ]}
      selected={selected}
    />
  );
}

export function GetMultipleTagsActionsSelectOptions() {
  return (
    <>
      <option value="">[Choose...]</option>
      <option value="del">Delete Marked Tags</option>
    </>
  );
}

export function GetAllTagsActionsSelectOptions() {
  return (
    <>
      <option value="">[Choose...]</option>
      <option value="delall">Delete ALL Tags</option>
    </>
  );
}

export function GetMultipleArchivedTextActionsSelectOptions() {
  return (
    <>
      <option value="">[Choose...]</option>
      <DisabledLine />
      <option value="addtag">Add Tag</option>
      <option value="deltag">Remove Tag</option>
      <DisabledLine />
      <option value="unarch">Unarchive Marked Texts</option>
      <DisabledLine />
      <option value="del">Delete Marked Texts</option>
      <option value="delall">Delete ALL Tags</option>
    </>
  );
}

export const MarkedTagsSelectOptions = {
  del: 'Delete Marked Tags',
} as const;
export const AllTagsSelectOptions = {
  delall: 'Delete ALL Tags',
} as const;
export const MarkedArchiveTextSelectOptions = {
  addtag: 'Add Tag',
  deltag: 'Remove Tag',
  unarch: 'Unarchive Marked Texts',
  del: 'Delete Marked Texts',
  delall: 'Delete ALL Tags',
} as const;
export const MarkedTextsSelectOption = {
  test: 'Test Marked Texts',
  addtag: 'Add Tag',
  deltag: 'Remove Tag',
  rebuild: 'Reparse Texts',
  setsent: 'Set Term Sentences',
  arch: 'Archive Marked Texts',
  del: 'Delete Marked Texts',
} as const;
const AllWordsSelectOption = {
  testall: 'Test ALL Terms',
  spl1all: 'Increase Status by 1 [+1]',
  smi1all: 'Reduce Status by 1 [-1]',
  todayall: 'Set Status Date to Today',
  lowerall: 'Set ALL Terms to Lowercase',
  capall: 'Capitalize ALL Terms',
  delsentall: 'Delete Sentences of ALL Terms',
  addtagall: 'Add Tag',
  deltagall: 'Remove Tag',
  expall: 'Export ALL Terms (Anki)',
  expall2: 'Export ALL Terms (TSV)',
  expall3: 'Export ALL Terms (Flexible)',
  delall: 'Delete ALL Terms',
} as const;

function ActionsSelectOptionComponent({
  option,
}: {
  option: keyof typeof AllWordsSelectOption;
}) {
  return <option value={option}>{AllWordsSelectOption[option]}</option>;
}

// TODO use new genericselectoptions pattern

export function GetAllWordsActionsSelectOptions() {
  return (
    <>
      <option value="" selected>
        [Choose...]
      </option>
      <DisabledLine />
      // TODO actions
      <ActionsSelectOptionComponent option="testall" />
      <DisabledLine />
      <ActionsSelectOptionComponent option={'spl1all'} />
      <ActionsSelectOptionComponent option={'smi1all'} />
      <DisabledLine />
      <GetSetStatusOption n={1} suffix={'all'} />
      <GetSetStatusOption n={5} suffix={'all'} />
      <GetSetStatusOption n={99} suffix={'all'} />
      <GetSetStatusOption n={98} suffix={'all'} />
      <DisabledLine />
      <ActionsSelectOptionComponent option={'todayall'} />
      <DisabledLine />
      <ActionsSelectOptionComponent option={'lowerall'} />
      <ActionsSelectOptionComponent option={'capall'} />
      <ActionsSelectOptionComponent option={'delsentall'} />
      <DisabledLine />
      <ActionsSelectOptionComponent option={'addtagall'} />
      <ActionsSelectOptionComponent option={'deltagall'} />
      <DisabledLine />
      <ActionsSelectOptionComponent option={'expall'} />
      <ActionsSelectOptionComponent option={'expall2'} />
      <ActionsSelectOptionComponent option={'expall3'} />
      <DisabledLine />
      <ActionsSelectOptionComponent option={'delall'} />
    </>
  );
}
export function GetMultipleWordsSctionsSelectoptions() {
  return (
    <>
      <option value="\" selected>
        [Choose...]
      </option>
      <option disabled>------------</option>
      <option value="test">Test Marked Terms</option>
      <option disabled>------------</option>
      <option value="spl1">Increase Status by 1 [+1]</option>
      <option value="smi1">Reduce Status by 1 [-1]</option>
      <option disabled>------------</option>
      {/* TODO */}
      {/* get_set_status_option(1)
get_set_status_option(5)
get_set_status_option(99)
get_set_status_option(98) */}
      <option disabled>------------</option>
      <option value="today">Set Status Date to Today</option>
      <option disabled>------------</option>
      <option value="lower">Set Marked Terms to Lowercase</option>
      <option value="cap">Capitalize Marked Terms</option>
      <option value="delsent">Delete Sentences of Marked Terms</option>
      <option disabled>------------</option>
      <option value="addtag">Add Tag</option>
      <option value="deltag">Remove Tag</option>
      <option disabled>------------</option>
      <option value="exp">Export Marked Terms (Anki)</option>
      <option value="exp2">Export Marked Terms (TSV)</option>
      <option value="exp3">Export Marked Terms (Flexible)</option>
      <option disabled>------------</option>
      <option value="del">Delete Marked Terms</option>
    </>
  );
}

export function DisabledLine() {
  return <option disabled>------------</option>;
}

function GetSetStatusOption({
  n,
  suffix,
}: {
  n: NumericalStrength;
  suffix: string;
}) {
  return (
    <option value={`s${n}${suffix}`}>
      Set Status to {get_status_name(n)}[{get_status_abbr(n)}]
    </option>
  );
}

export function GetSecondsSelectoptions({
  selectedVal = 5,
}: {
  selectedVal?: number;
}) {
  return (
    <>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <option value={i} selected={i === selectedVal}>
          {i} sec
        </option>
      ))}
    </>
  );
}

export function GetPlaybackrateSelectoptions({
  selectedVal: selectedVal = 10,
}: {
  selectedVal?: number;
}) {
  console.log('SELECTPLAYRATE', selectedVal);
  return (
    <>
      {[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (
        <option value={i} selected={i === selectedVal}>
          &nbsp;{i < 10 ? ` 0.${i}x` : ` 1.${i - 10} x `}&nbsp;
        </option>
      ))}
    </>
  );
}
