import { useData } from '../hooks/useData';
import { containsCharacterOutsideBasicMultilingualPlane } from '../pages/IO/CheckForm';
import { useTagIt } from '../utils/TagIt';

export function WordTagsSelectList() {
  const [{ tags }] = useData(['tags']);
  const { TagList } = useTagIt({
    availableTags: tags.map((value) => ({ value: value.TgText })),
    fieldName: 'TermTags[TagList][]',
    beforeTagAdded: (event, ui) =>
      !containsCharacterOutsideBasicMultilingualPlane(ui.tag.value),
  });

  // TODO set ref to be list of selected tags
  return <TagList id="termtags" />;
}
export function TextTagsSelectList() {
  const [{ tags2 }] = useData(['tags2']);
  const { TagList } = useTagIt({
    availableTags: tags2.map((value) => ({ value: value.T2Text })),
    fieldName: 'TextTags[TagList][]',
    beforeTagAdded: (event, ui) =>
      !containsCharacterOutsideBasicMultilingualPlane(ui.tag.value),
  });

  // TODO set ref to be list of selected tags
  return <TagList id="texttags" />;
}
