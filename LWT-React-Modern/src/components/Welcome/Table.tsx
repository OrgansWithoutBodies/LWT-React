import { Checkbox, ScrollArea, Table, rem } from '@mantine/core';
import { useState } from 'react';

export function TableSelection<TDatum extends { id: string }>({
  data,
  RowTemplate,
  headerVals,
}: {
  data: TDatum[];
  RowTemplate: (
    val: TDatum & { selected: boolean; toggleRow: (id: string) => void }
  ) => JSX.Element;
  headerVals: string[];
}) {
  const [selection, setSelection] = useState(['1']);
  const toggleRow = (id: string) =>
    setSelection((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  const toggleAll = () =>
    setSelection((current) => (current.length === data.length ? [] : data.map((item) => item.id)));

  const rows = data.map((item) => {
    const selected = selection.includes(item.id);
    return <RowTemplate {...item} selected={selected} toggleRow={toggleRow} />;
  });

  return (
    <ScrollArea>
      <Table miw={800} verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: rem(40) }}>
              <Checkbox
                onChange={toggleAll}
                checked={selection.length === data.length}
                indeterminate={selection.length > 0 && selection.length !== data.length}
              />
            </Table.Th>
            {headerVals.map((val) => {
              return <Table.Th>{val}</Table.Th>;
            })}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
export function TableSingleSelection<TDatum extends { id: string }>({
  data,
  RowTemplate,
  headerVals,
}: {
  data: TDatum[];
  RowTemplate: (
    val: TDatum & { selected: boolean; toggleRow: (id: string) => void }
  ) => JSX.Element;
  headerVals: string[];
}) {
  const [selection, setSelection] = useState(['1']);
  const toggleRow = (id: string) =>
    setSelection((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  const toggleAll = () =>
    setSelection((current) => (current.length === data.length ? [] : data.map((item) => item.id)));

  const rows = data.map((item) => {
    const selected = selection.includes(item.id);
    return <RowTemplate {...item} selected={selected} toggleRow={toggleRow} />;
  });

  return (
    <ScrollArea>
      <Table miw={800} verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: rem(40) }}>
              <Checkbox
                onChange={toggleAll}
                checked={selection.length === data.length}
                indeterminate={selection.length > 0 && selection.length !== data.length}
              />
            </Table.Th>
            {headerVals.map((val) => {
              return <Table.Th>{val}</Table.Th>;
            })}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
