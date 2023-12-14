import { Persistable } from '../../../shared/Persistable';
import { getEntryLinePluginsFor } from '../data/validators';
import { TRefMap } from '../forms/Forms';
import { FormInputComponent } from '../hooks/useFormInput';
import { EntryRow } from '../pages/Language/NewLanguage';

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
