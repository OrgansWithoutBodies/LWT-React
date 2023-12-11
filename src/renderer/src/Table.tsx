// TODO "compilation row" ie add a row which compiles data in a column (ie by adding)

/**
 *
 */
export default function Table<TType extends {}, TElement extends {}>({
  rowElement,
  header,
  data,
}: {
  rowElement: (value: TType) => JSX.Element;
  header: any;
  data: TType[];
}): JSX.Element {
  return (
    <table>
      <tr>
        <th />
      </tr>
      {data.map((row) => (
        <tr>
          {Object.keys(row).map((cell) => (
            <td />
          ))}
        </tr>
      ))}
    </table>
  );
}
