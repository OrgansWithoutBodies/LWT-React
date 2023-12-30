import {
  Tags2ID,
  TagsID,
  TextTag,
  TextsID,
  WordTag,
  WordsID,
} from 'lwt-schemas';

const isWordTag = (tag: WordTag[] | TextTag[]): tag is WordTag[] =>
  tag[0] && 'WtTgID' in tag[0];
/**
 *
 * filterTags steps through an intermediate table and reduces it to a lookup for the non-tag value
 */

// TODO this is very messy

/**
 *
 * @param tagIDs
 * @param tag1
 * @param tag2
 * @param tag12
 */
export function filterTags<
  TTag extends TagsID | Tags2ID,
  TRecord extends TTag extends TagsID
    ? Record<WordsID, true | 'partial'>
    : Record<TextsID, true | 'partial'> = TTag extends TagsID
    ? Record<WordsID, true | 'partial'>
    : Record<TextsID, true | 'partial'>
>(
  tagIDs: TTag extends TagsID ? WordTag[] : TextTag[],
  tag1: TTag | null,
  tag2: TTag | null,
  tag12: 0 | 1
): TRecord {
  const isWord = isWordTag(tagIDs);
  const key = isWord ? ('WtWoID' as const) : ('TtTxID' as const);
  const tagKey = isWord ? ('WtTgID' as const) : ('TtT2ID' as const);
  const tag1Specified = tag1 !== null;
  const tag2Specified = tag2 !== null;
  const noTagsSpecified = !tag1Specified && !tag2Specified;
  if (noTagsSpecified) {
    return Object.fromEntries(
      tagIDs.map((tag) => [tag[key as keyof typeof tag], true])
    ) as TRecord;
  }
  const returnedLookup = tagIDs.reduce((prev, curr) => {
    const currTag = curr[tagKey as keyof typeof curr] as TTag;
    const currVal = curr[key as keyof typeof curr] as keyof typeof prev;
    const onlyUseOneTag =
      (!tag1Specified && tag2Specified) || (!tag2Specified && tag1Specified);

    const isTag1Equal = tag1 === currTag;
    const isTag2Equal = tag2 === currTag;
    if (onlyUseOneTag) {
      if (tag1Specified ? isTag1Equal : isTag2Equal) {
        prev[currVal] = true as any;
      }
      return prev;
    }

    const isUsingOr = tag12 === 0;
    if (isUsingOr) {
      if (isTag1Equal || isTag2Equal) {
        prev[currVal] = true as any;
      }
      return prev;
    }
    // we're now hitting this tag in an 'and' statement, either first time or second time - if first set 'partial' else set true
    if (isTag1Equal || isTag2Equal) {
      if (prev[currVal] === 'partial') {
        prev[currVal] = true as any;
        return prev;
      }
      prev[currVal] = 'partial' as any;
      return prev;
    }
    return prev;
  }, {} as TRecord);
  return returnedLookup;
}
