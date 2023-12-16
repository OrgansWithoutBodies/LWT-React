import {
  NumericalStrength,
  get_status_abbr,
  get_status_name,
} from './StrengthMap';

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
      <option disabled>------------</option>
      <option value="addtag">Add Tag</option>
      <option value="deltag">Remove Tag</option>
      <option disabled>------------</option>
      <option value="unarch">Unarchive Marked Texts</option>
      <option disabled>------------</option>
      <option value="del">Delete Marked Texts</option>
      <option value="delall">Delete ALL Tags</option>
    </>
  );
}

export function GetTagSortSelectoptions({
  selected,
}: {
  selected: number | null;
}) {
  return (
    <>
      <option value="1" selected={selected === 1}>
        Tag Text A-Z
      </option>
      <option value="2" selected={selected === 2}>
        Tag Comment A-Z
      </option>
      <option value="3" selected={selected === 3}>
        Newest first
      </option>
      <option value="4" selected={selected === 4}>
        Oldest first
      </option>
    </>
  );
}

export function GetTextsSortSelectoptions({
  selected,
}: {
  selected: number | null;
}) {
  return (
    <>
      <option value="1" selected={selected === 1}>
        Title A-Z
      </option>
      <option value="2" selected={selected === 2}>
        Newest first
      </option>
      <option value="3" selected={selected === 3}>
        Oldest first
      </option>
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
      <ActionsSelectOptionComponent option="testall" />
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
