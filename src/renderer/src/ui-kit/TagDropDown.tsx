import { Tags2ID, TagsID } from '../data/validators';
import { PathParams, useUpdateParams } from '../hooks/useInternalNav';
import { Tag, Tag2 } from '../utils/parseMySqlDump';

// TODO collect guards like this in one place?
const isTags = (tags: Tag[] | Tag2[]): tags is Tag[] =>
  tags[0] && 'TgID' in tags[0];

// TODO tagKey type restricted to path param
export function TagDropDown<TTag extends Tag | Tag2>({
  tags,
  tagKey,
  defaultValue = null,
}: TTag extends Tag
  ? {
      defaultValue: TagsID | null;
      tags: TTag[];
      tagKey: PathParams;
    }
  : {
      defaultValue: Tags2ID | null;
      tags: TTag[];
      tagKey: PathParams;
    }): JSX.Element {
  const updateParams = useUpdateParams();
  return (
    <select
      name="tag1"
      onChange={({ target: { value } }) => {
        updateParams({ [tagKey]: value, page: null });
      }}
    >
      <option value="" selected={defaultValue === null}>
        [Filter off]
      </option>
      {isTags(tags)
        ? tags.map((tag) => (
            <option value={tag.TgID} selected={defaultValue === tag.TgID}>
              {tag.TgText}
            </option>
          ))
        : tags.map((tag) => (
            <option value={tag.T2ID} selected={defaultValue === tag.T2ID}>
              {tag.T2Text}
            </option>
          ))}

      <option disabled>--------</option>
      {/* TODO */}
      <option value="-1">UNTAGGED</option>
    </select>
  );
}
