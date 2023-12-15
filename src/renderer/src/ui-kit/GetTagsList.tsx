import { TextsId, WordsId } from '../data/validators';
import { useData } from '../hooks/useData';

export function GetTagsList({
  EntryID,
  tagKey,
}:
  | { EntryID: WordsId | null; tagKey: 'tags' }
  | { EntryID: TextsId | null; tagKey: 'tags2' }) {
  const guardedTagKey = (key: 'tags' | 'tags2'): key is 'tags' =>
    key === 'tags';
  const { instanceKey, idKey } = guardedTagKey(tagKey)
    ? ({ instanceKey: 'wordtags', idKey: 'WtTgID' } as const)
    : ({ instanceKey: 'texttags', idKey: 'TtTxID' } as const);
  const [{ [instanceKey]: instance, [tagKey]: tags }] = useData([
    instanceKey,
    tagKey,
  ]);
  return (
    <ul id="termtags">
      {EntryID !== null && (
        <>
          {instance
            .filter((row) => row[idKey] === EntryID)
            .map((row) => {
              const tag = tags.find((tag) => tag[idKey] === row[idKey]);
              if (!tag) {
                return <></>;
              }
              return <li>{tag[idKey]}</li>;
            })}
        </>
      )}
    </ul>
  );
}
