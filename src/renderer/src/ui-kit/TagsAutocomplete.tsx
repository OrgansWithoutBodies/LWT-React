import React from 'react';
import { useData } from '../hooks/useData';
import { containsCharacterOutsideBasicMultilingualPlane } from '../pages/IO/CheckForm';
import { TagItOptions, useTagIt } from './TagIt';

function WordTagsAutocompleteImpl(
  extraArgs: Partial<TagItOptions>,
  tagInputRef
) {
  const [{ tags }] = useData(['tags']);
  console.log({ tagInputRef });
  const { TagList } = useTagIt(
    {
      availableTags: tags.map((value) => ({ value: value.TgText })),
      fieldName: 'TermTags[TagList][]',
      beforeTagAdded: (_event, ui) =>
        !containsCharacterOutsideBasicMultilingualPlane(ui.tag.value),
      ...{ extraArgs },
    },
    tagInputRef
  );

  // TODO set ref to be list of selected tags
  return <TagList id="termtags" />;
}
function TextTagsAutocompleteImpl(
  extraArgs: Partial<TagItOptions>,
  tagInputRef
) {
  const [{ tags2 }] = useData(['tags2']);
  const { TagList } = useTagIt(
    {
      availableTags: tags2.map((value) => ({ value: value.T2Text })),
      fieldName: 'TextTags[TagList][]',
      beforeTagAdded: (_event, ui) =>
        !containsCharacterOutsideBasicMultilingualPlane(ui.tag.value),
      ...extraArgs,
    },
    tagInputRef
  );

  // TODO set ref to be list of selected tags
  return <TagList id="texttags" />;
}
export const WordTagsAutocomplete = React.forwardRef(WordTagsAutocompleteImpl);
export const TextTagsAutocomplete = React.forwardRef(TextTagsAutocompleteImpl);
