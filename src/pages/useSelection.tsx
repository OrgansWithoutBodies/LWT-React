import { useState } from 'react';

export function useSelection<TData extends object, TKey extends keyof TData>(
  data: TData[],
  key: TKey
) {
  const [selectedValues, setSelectedValues] = useState<Set<TData[TKey]>>(
    new Set()
  );
  const onSelect = (val: TData, selecting: boolean) => {
    if (selecting) {
      return setSelectedValues(new Set([...selectedValues, val[key]]));
    }
    const newSet = new Set([...selectedValues]);
    newSet.delete(val[key]);
    setSelectedValues(newSet);
    return;
  };
  return {
    selectedValues,
    checkboxPropsForEntry: (val: TData) => {
      const isChecked = selectedValues.has(val[key]);
      return { onChange: () => onSelect(val, !isChecked), checked: isChecked };
    },
    // onSelectId:(id:[TKey])=>{
    //   const isSelected = selectedValues.has(id);

    // },
    onSelectAll: () => setSelectedValues(new Set(data.map((val) => val[key]))),
    onSelectNone: () => setSelectedValues(new Set()),
    onSelect,
  };
}
