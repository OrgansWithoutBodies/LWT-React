export function TagAndOr({
  onChange,
  defaultValue,
}: {
  onChange: (arg: { target: { value: '0' | '1' } }) => void;
  defaultValue?: 0 | 1;
}) {
  return (
    <td style={{ whiteSpace: 'nowrap' }} className="td1 center">
      Tag #1 ..
      <select
        defaultValue={defaultValue}
        name="tag12"
        onChange={
          onChange as (arg: {
            target: {
              value: any;
              //  as '0' | '1'
            };
          }) => void
        }
      >
        <option value={0}>... OR ...</option>
        <option value={1}>... AND ...</option>
      </select>
      .. Tag #2
    </td>
  );
}
