import { FormInputComponent, TRefMap } from 'lwt-forms';
import { EntryRowComponent, Plugin } from 'lwt-plugins';
import { EntryRowType, Persistable } from 'lwt-schemas';
import { EntryRow } from 'lwt-ui-kit';
import { usePlugins } from './usePlugins';

// todo why cant use straight string for persistable here
// const getValidatorPluginsFor = <
//   TKey extends Persistable,
//   TTableKeys extends string = string
// >(
//   key: TKey
// ): { [k in TTableKeys]: ss.Struct<any, unknown> } => {
//   const val = Object.fromEntries(
//     PLUGINS.filter(
//       ({ validators }) => validators && validators[key] !== undefined
//     )
//       .map(({ validators }) => {
//         const safeKeyValidator = validators![key]!;

//         return Object.entries(safeKeyValidator);
//       })
//       .flat()
//     // TODO no cast if possible
//   ) as { [k in TTableKeys]: ss.Struct<any, unknown> };
//   console.log("TEST123-validator", val);
//   return val;
// };
export const getEntryLinePluginsFor = <
  TKey extends Persistable,
  TTableKeys extends string = string
>(
  key: TKey,
  PLUGINS: Plugin[]
): { [k in TTableKeys]: EntryRowType & { child: EntryRowComponent } } =>
  Object.fromEntries(
    PLUGINS.filter(
      ({ entryLines }) => entryLines && entryLines[key] !== undefined
    )
      .map(({ entryLines }) => {
        const safeKeyEntryLines = entryLines![key]!;
        console.log('TEST123-entry', Object.entries(safeKeyEntryLines));
        return Object.entries(safeKeyEntryLines);
      })
      .flat()
    // TODO
  ) as any;
export function PluginEntries<TData extends object>({
  persistable,
  refMap,
  InputComponent,
  // This is basically just for the settings being weird
  PreMapComponent,
}: React.PropsWithChildren<{
  persistable: Persistable;
  refMap: TRefMap<TData>;
  InputComponent: FormInputComponent;
  PreMapComponent?: (args: { numElements: number }) => JSX.Element;
}>) {
  const plugins = usePlugins();
  const PluginLines = getEntryLinePluginsFor(persistable, plugins);
  const numberPlugins = Object.keys(PluginLines).length;
  return (
    <>
      {Object.keys(PluginLines).map((lineKey) => {
        const { child: PluginLine, ...entryRowArgs } = PluginLines[lineKey];
        return (
          <>
            <EntryRow
              {...entryRowArgs}
              PreMapComponent={
                PreMapComponent
                  ? () => <PreMapComponent numElements={numberPlugins} />
                  : undefined
              }
            >
              <PluginLine
                refMap={refMap}
                Component={(args) => (
                  <InputComponent
                    {...args}
                    entryKey={lineKey}
                    size={60}
                    default
                  />
                )}
              />
            </EntryRow>
          </>
        );
      })}
    </>
  );
}
