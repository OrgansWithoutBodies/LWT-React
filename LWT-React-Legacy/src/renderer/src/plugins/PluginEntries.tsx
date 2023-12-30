import { TRefMap } from 'lwt-forms';
import { EntryRowType } from 'lwt-schemas';
import { EntryRow, FormInputComponent } from 'lwt-ui-kit';
import * as ss from 'superstruct';
import { Persistable } from '../../../shared/Persistable';
import { EntryRowComponent } from '../Plugin';
import { PLUGINS } from '../plugins';

// todo why cant use straight string for persistable here
const getValidatorPluginsFor = <
  TKey extends Persistable,
  TTableKeys extends string = string
>(
  key: TKey
): { [k in TTableKeys]: ss.Struct<any, unknown> } => {
  const val = Object.fromEntries(
    PLUGINS.filter(
      ({ validators }) => validators && validators[key] !== undefined
    )
      .map(({ validators }) => {
        const safeKeyValidator = validators![key]!;

        return Object.entries(safeKeyValidator);
      })
      .flat()
    // TODO no cast if possible
  ) as { [k in TTableKeys]: ss.Struct<any, unknown> };
  console.log('TEST123-validator', val);
  return val;
};
export const getEntryLinePluginsFor = <
  TKey extends Persistable,
  TTableKeys extends string = string
>(
  key: TKey
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
  );
export function PluginEntries<TData>({
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
  const PluginLines = getEntryLinePluginsFor(persistable);
  const numberPlugins = Object.keys(PluginLines).length;
  return (
    <>
      {Object.keys(PluginLines).map((lineKey, ii) => {
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
