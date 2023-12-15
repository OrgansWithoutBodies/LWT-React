import {
  ArchivedTextId,
  Tags2Id,
  TextsId,
  WordsId,
} from '../../data/validators';
import {
  ArchTextTag,
  Tag,
  Tag2,
  TextTag,
  WordTag,
} from '../../utils/parseMySqlDump';

// TODO This is a mess

export function buildTextTagLookup(
  tags: Tag[],
  archtexttags: WordTag[]
): Record<WordsId, string[]>;
export function buildTextTagLookup(
  tags: Tag2[],
  archtexttags: TextTag[]
): Record<TextsId, string[]>;
export function buildTextTagLookup(
  tags: Tag2[],
  archtexttags: ArchTextTag[]
): Record<ArchivedTextId, string[]>;
/**
 *
 * @param tags
 * @param archtexttags
 */
export function buildTextTagLookup(
  tags: (Tag2 | Tag)[],
  archtexttags: (ArchTextTag | TextTag | WordTag)[]
):
  | Record<WordsId, string[]>
  | Record<TextsId, string[]>
  | Record<ArchivedTextId, string[]> {
  if (!tags[0]) {
    return {};
  }
  // TODO typewise enforce these better instead of free text
  const tagIDKey = 'TgID' in tags[0] ? 'TgID' : 'T2ID';
  const tagTextKey = 'TgID' in tags[0] ? 'TgText' : 'T2Text';
  const intermediaryTagID =
    'AgT2ID' in archtexttags[0]
      ? 'AgT2ID'
      : 'TtT2ID' in archtexttags[0]
      ? 'TtT2ID'
      : 'WtTgID';
  const intermediaryEntryID =
    'AgT2ID' in archtexttags[0]
      ? 'AgAtID'
      : 'TtT2ID' in archtexttags[0]
      ? 'TtTxID'
      : 'WtWoID';
  const tagTitleLookup: Record<Tags2Id, string> = Object.fromEntries(
    tags.map((tag) => [tag[tagIDKey], tag[tagTextKey]])
  );
  const textTagLookup: Record<ArchivedTextId, string[]> = archtexttags.reduce(
    (prev, curr) => {
      const entryTextID = curr[intermediaryEntryID as keyof typeof curr];
      const tagTextID = curr[intermediaryTagID as keyof typeof curr];
      if (prev[entryTextID]) {
        prev[entryTextID] = [...prev[entryTextID], tagTitleLookup[tagTextID]];
        return prev;
      }
      prev[entryTextID] = [tagTitleLookup[tagTextID]];
      return prev;
    },
    {} as Record<ArchivedTextId, string[]>
  );
  console.log({ textTagLookup });
  return textTagLookup;
}
