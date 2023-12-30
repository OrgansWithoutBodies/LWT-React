// TODO Integrate

import React, { ForwardedRef, useEffect, useRef, useState } from "react";
import { useThemeColors } from "./hooks/useThemeColors";

/*
 * jQuery UI Tag-it!
 *
 * @version v2.0 (06/2011)
 *
 * Copyright 2011, Levy Carneiro Jr.
 * Released under the MIT license.
 * http://aehlke.github.com/tag-it/LICENSE
 *
 * Homepage:
 *   http://aehlke.github.com/tag-it/
 *
 * Authors:
 *   Levy Carneiro Jr.
 *   Martin Rehfeld
 *   Tobias Schmidt
 *   Skylar Challand
 *   Alex Ehlke
 *
 * Maintainer:
 *   Alex Ehlke - Twitter: @aehlke
 *
 * Dependencies:
 *   jQuery v1.4+
 *   jQuery UI v1.8+
 *
 * Changed for LWT:
 *   <input type="text" />
 *   INSERTED: maxlength="20" size="20"
 *
 */

export type TagItOptions = {
  caseSensitive?: boolean;
  fieldName?: string;
  placeholderText?: null | string; // Sets `placeholder` attr on input field.
  readOnly?: boolean; // Disables editing.
  removeConfirmation?: boolean; // Require confirmation to remove tags.
  tagLimit?: number | null; // Max number of tags allowed (null for unlimited).

  // Used for autocomplete, unless you override `autocomplete.source`.
  availableTags: TagType[];

  // Use to override or add any options to the autocomplete widget.
  //
  // By default, autocomplete.source will map to availableTags,
  // unless overridden.
  autocomplete?: {
    minLength?: number;
    source?: (
      search: { term: string },
      showChoices: (arg0: any) => void
    ) => void;
  };

  // Shows autocomplete before the user even types anything.

  // When enabled, quotes are unneccesary for inputting multi-word tags.
  allowSpaces?: boolean;

  // Whether to animate tag removals or not.
  animate?: boolean;

  // Optionally set a tabindex attribute on the input that gets
  // created for tag-it.
  tabIndex?: null;

  // Event callbacks.
  onTagClicked?: TagEventHandler;
  onChange?: TagEventHandler<null, object, void>;
  onTagExists?: TagEventHandler;
  onTagLimitExceeded?: TagEventHandler<
    null,
    { duringInitialization?: boolean }
  >;
  beforeTagAdded?: TagEventHandler;
  afterTagAdded?: TagEventHandler;
  beforeTagRemoved?: TagEventHandler;
  afterTagRemoved?: TagEventHandler;
};
const defaultOptions: TagItOptions = {
  caseSensitive: true,
  fieldName: "tags",
  placeholderText: null, // Sets `placeholder` attr on input field.
  removeConfirmation: false, // Require confirmation to remove tags.
  tagLimit: null, // Max number of tags allowed (null for unlimited).
  availableTags: [],
  autocomplete: {},
  allowSpaces: false,
  animate: true,
  tabIndex: null,
  beforeTagAdded: undefined,
  afterTagAdded: undefined,
  beforeTagRemoved: undefined,
  afterTagRemoved: undefined,
  onTagClicked: undefined,
  onTagLimitExceeded: undefined,
};

function TagInputImpl(
  {
    options: {
      // readOnly,
      tabIndex,
      placeholderText,
      // autocomplete,
      // availableTags,
      removeConfirmation,
      allowSpaces,
    },
    tagger: {
      removeTag,
      // _subtractArray,
      showingAutocomplete,
      // assignedTags,
      _showAutoComplete,
      createTag,
      _cleanedInput,
      _availableTagsThatStartWith,
      _lastTag,
      // _tags,
    },
  }: {
    options: TagItOptions;
    tagger: PrivateTagger;
  },
  tagInputRef: React.ForwardedRef<HTMLInputElement>
) {
  // autocomplete.source = function (
  //   search: { term: string },
  //   showChoices: (arg0: any) => void
  // ) {
  //   const filter = search.term.toLowerCase();
  //   const choices = (availableTags || []).filter(
  //     (tag) =>
  //       // Only match autocomplete options that begin with the search term.
  //       // (Case insensitive.)
  //       tag.value.toLowerCase().indexOf(filter) === 0
  //   );
  //   showChoices(_subtractArray(choices, assignedTags()));
  // };

  // Autocomplete.
  // const autoCompleteOptions =
  //   availableTags || autocomplete.source
  //     ? {
  //         select(event: any, ui: { item: { value: any } }) {
  //           createTag(ui.item.value);
  //           // Preventing the tag input to be updated with the chosen value.
  //           return false;
  //         },
  //         ...autocomplete,
  //       }
  //     : undefined;
  const [autocompleteOptions, setAutocompleteOptions] = useState<TagType[]>([]);
  return (
    <>
      <input
        ref={tagInputRef}
        // autoComplete="search"

        // options
        onChange={() => {
          setAutocompleteOptions(
            // TODO
            _availableTagsThatStartWith((tagInputRef as any).current.value)
          );
        }}
        // autoComplete={autoCompleteOptions}
        // onAutoCompleteOpen={() => {
        //   setAutocompleteOpen(true);
        // }}
        // onAutoCompleteClose={() => {
        //   setAutocompleteOpen(false);
        // }}
        onKeyDown={(event) => {
          // Backspace is not detected within a keypress, so it must use keydown.
          if (event.key === "Escape") {
            setAutocompleteOptions([]);
            return;
          }
          if (
            event.key === "Backspace" &&
            (tagInputRef as any).current.value === ""
          ) {
            const tag = _lastTag();
            console.log("TEST123-deleting", tag);
            if (tag) {
              if (!removeConfirmation || tag.removed) {
                // When backspace is pressed, the last tag is deleted.
                console.log("TEST123-TAGINPUT1", event.currentTarget);
                removeTag(tag);

                // tagInputRef.current.focus();
                event.currentTarget.focus();
                // console.log('TEST123-TAGINPUT2', tagInputRef.current);
              } else if (removeConfirmation) {
                removeTag(tag);
                // TODO
                // setTagHighlight(tag,true)
                // tag.addClass('remove ui-state-highlight');
              }
            }
          } else if (removeConfirmation) {
            const lastTag = _lastTag();
            // TODO this should just delete onkeydown? doesnt seem right
            if (lastTag) {
              // setTagHighlight(tag,false)
              // unsetRemove(tag)
              //  lastTag.removeClass('remove ui-state-highlight');
            }
          }

          // Comma/Space/Enter are all valid delimiters for new tags,
          // except when there is an open quote or if setting allowSpaces = true.
          // Tab will also create a tag, unless the tag input is empty,
          // in which case it isn't caught.
          const inputValClean = (tagInputRef as any).current.value.trim();
          console.log("TEST123-tagit-new", inputValClean);
          if (
            event.key === "Comma" ||
            event.key === "Enter" ||
            (event.key === "Tab" &&
              (tagInputRef as any).current.value !== "") ||
            (event.key === "Space" &&
              allowSpaces !== true &&
              (inputValClean.replace(/^s*/, "").charAt(0) !== '"' ||
                (inputValClean.charAt(0) === '"' &&
                  inputValClean.charAt(inputValClean.length - 1) === '"' &&
                  inputValClean.length - 1 !== 0)))
          ) {
            // TODO
            // Enter submits the form if there's no text in the input.
            if (
              false
              // !(event.key === 'Enter' && tagInputRef.current.value === '')
            ) {
              event.preventDefault();
            }

            if (autocompleteOptions.length === 0) {
              createTag(_cleanedInput());
              setAutocompleteOptions([]);
            }
            // The autocomplete doesn't close automatically when TAB is pressed.
            // So let's ensure that it closes.
          }
        }}
        type="text"
        onBlur={() => {
          // Create a tag when the element loses focus.
          // If autocomplete is enabled and suggestion was clicked, don't add it.
          if (autocompleteOptions) {
            createTag(_cleanedInput());
          }
          setAutocompleteOptions([]);
        }}
        onFocus={() => {
          _showAutoComplete();
        }}
        maxLength={20}
        size={20}
        // disabled={readOnly ? true : undefined}
        tabIndex={tabIndex ? tabIndex : undefined}
        placeholder={placeholderText ? placeholderText : undefined}
        // className="ui-widget-content"
      />

      {showingAutocomplete && autocompleteOptions.length !== 0 && (
        <Autocomplete
          autocompleteOptions={autocompleteOptions}
          onSelectTag={(tagVal) => {
            createTag(tagVal);
            setAutocompleteOptions([]);
          }}
        />
      )}
    </>
  );
}
const TagInput = React.forwardRef(TagInputImpl);

function Autocomplete({
  autocompleteOptions,
  onSelectTag,
}: {
  autocompleteOptions: TagType[];
  // TODO maybe pass back id here?
  onSelectTag: (val: string) => void;
}) {
  const themeColors = useThemeColors();
  const [highlightedTagIndex, setHighlightedTagIndex] = useState<number | null>(
    null
  );
  useEffect(() => {
    const TODO = (e: KeyboardEvent) => {
      console.log("TEST123-ARROW", e.key, autocompleteOptions.length);
      // Down increases bc the options are reversed
      if (e.key === "ArrowDown") {
        setHighlightedTagIndex(
          Math.min(
            autocompleteOptions.length - 1,
            (highlightedTagIndex || autocompleteOptions.length - 1) - 1
          )
        );
        e.preventDefault();
      }
      if (e.key === "ArrowUp") {
        setHighlightedTagIndex(Math.max(0, (highlightedTagIndex || 0) + 1));
        e.preventDefault();
      }
      if (e.key === "Enter" && highlightedTagIndex !== null) {
        onSelectTag(autocompleteOptions[highlightedTagIndex].value);
        e.preventDefault();
      }
      // TODO on escape
    };
    window.addEventListener("keydown", TODO);

    return () => {
      window.removeEventListener("keydown", TODO);
    };
  }, [highlightedTagIndex]);
  console.log("TEST123-highlight", highlightedTagIndex);

  return (
    <div
      style={{
        backgroundColor: `${themeColors.lum6}`,
        outline: `1px ${themeColors.lum0}`,
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        bottom: "0%",
      }}
    >
      {autocompleteOptions.map((tag, ii) => (
        <div
          style={{
            backgroundColor:
              highlightedTagIndex === ii ? themeColors.lum3 : themeColors.lum4,
            margin: "2px",
          }}
          onMouseOver={() => setHighlightedTagIndex(ii)}
        >
          {tag.value}
        </div>
      ))}
    </div>
  );
}

function TagList({
  id,
  options,
  tagger,
  tagList,
  tagInputRef,
}: {
  id?: string;
  options: TagItOptions;
  tagger: PrivateTagger;
  tagList: TagType[];
  // TODO ref passed in should just return a value of tag elements
  tagInputRef: React.MutableRefObject<HTMLInputElement | null>;
}) {
  // TODO

  // We only ever use this for ul, if you want to reimpliment other functionality that's your problem lol
  // const tagList = element.find('ul, ol').andSelf().last();

  // Add existing tags from the list, if any.
  // TODO
  // tagList.each(function () {
  //   if (!$(this).hasClass('tagit-new')) {
  //     that.createTag($(this).text(), $(this).attr('class'), true);
  //     $(this).remove();
  //   }
  // });

  return (
    <ul
      id={id}
      className={`${"tagit"} ${"ui-widget ui-widget-content ui-corner-all"} inputText input`}
      onClick={(e) => {
        tagInputRef.current?.focus();
        console.log("TODO", e);
        // TODO
        // if (target.hasClass('tagit-label')) {
        //   const tag = target.closest('.tagit-choice');
        //   if (!tag.removed && options.onTagClicked) {
        //     options.onTagClicked(e, {
        //       tag,
        //       tagLabel: tagger.tagLabel(tag),
        //     });
        //   }
        // } else {
        //   // Sets the focus() to the input field, if the user
        //   // clicks anywhere inside the UL. This is needed
        //   // because the input field needs to be of a small size.
        //   tagInputRef.current.focus();
        // }
      }}
    >
      {tagList.map((tag) => (
        <li
          className={`tagit-choice ui-widget-content ui-state-default ui-corner-all ${
            tag.additionalClass
          } ${"tagit-choice-editable"}`}
        >
          {options.onTagClicked ? (
            <a className="tagit-label">{tag.value}</a>
          ) : (
            <span className="tagit-label">{tag.value}</span>
          )}
          {
            <a
              className="tagit-close"
              onClick={() => {
                // Removes a tag when the little 'x' is clicked.
                tagger.removeTag(tag);
              }}
            >
              <span className="text-icon">
                {"\xd7"}
                {/* Button for removing the tag. */}
                <span className="ui-icon ui-icon-close"></span>{" "}
              </span>
            </a>
          }
          <input
            type="hidden"
            style={{ display: "none" }}
            value={tag.value}
            name={options.fieldName}
          />
        </li>
      ))}
      <li className="tagit-new">
        <TagInput options={options} tagger={tagger} ref={tagInputRef} />
      </li>
    </ul>
  );
}
type TagType = { value: string; removed?: boolean; additionalClass?: string };
type TagEventHandler<
  EventOptions extends React.MouseEvent | null = React.MouseEvent | null,
  TagOptions extends object = {
    tag: TagType;
    tagLabel?: string;
    duringInitialization?: boolean;
  },
  TReturn = boolean
> =
  // EventOptions extends null
  //   ? () => void  :
  (e: EventOptions, ui: TagOptions) => TReturn;

type PublicTagger = {
  assignedTags: () => TagType[];
  tagLabel: (tag: TagType) => string;
  createTag: (
    value: string,
    additionalClass?: string | undefined,
    duringInitialization?: boolean
  ) => void;
  removeTag: (
    tag: TagType,
    // tag: {
    //   addClass: (arg0: string) => void;
    //   remove: () => void;
    //   fadeOut: (arg0: string) => {
    //     ();
    //     new ();
    //     hide: {
    //       ();
    //       new ();
    //       apply: {
    //         (arg0: any, arg1: (string | { direction: string })[]): {
    //           ();
    //           new ();
    //           dequeue: { (): void; new () };
    //         };
    //         new ();
    //       };
    //     };
    //   };
    // },
    animate?: TagItOptions["animate"]
  ) => void;
  removeAll: () => void;
};
type PrivateTagger = PublicTagger & {
  _cleanedInput: () => string;
  showingAutocomplete: boolean;
  _lastTag: () => TagType | null;
  _tags: () => TagType[];
  _availableTagsThatStartWith: (val: string) => TagType[];
  _subtractArray: (a1: TagType[], a2: TagType[]) => TagType[];
  _showAutoComplete: () => void;
  _findTagByLabel: (name: string) => TagType | undefined;
  _isNew: (str: string) => boolean;
  _formatStr: (str: string) => string;
};
type TaggerOutput = PublicTagger & {
  // TagInput: () => JSX.Element;
  TagList: (args: { id?: string }) => JSX.Element;
};
/**
 *
 * @param options
 */
export function useTagIt(
  options: TagItOptions = defaultOptions,
  tagListRef: ForwardedRef<{ value: string[] } | null>
): TaggerOutput {
  const tagInputRef = useRef<HTMLInputElement | null>(null);
  if (!tagListRef || !("current" in tagListRef)) {
    throw new Error("immutable ref");
  }
  // TODO simplify options to what we use
  const [tagItTags, setTagItTags] = useState<TagType[]>([]);
  useEffect(() => {
    tagListRef.current = { value: tagItTags.map((tag) => tag.value) };
    if (options.onChange) {
      console.log("TEST123-CHANGE");
      options.onChange(null, {});
    }
  }, [tagItTags]);
  // TODO
  const [showingAutocomplete, setShowingAutocomplete] = useState(false);

  const assignedTags: PublicTagger["assignedTags"] = () =>
    // // Returns an array of tag string values
    // ;
    // let tags = [];

    // _tags().each(function () {
    //   tags.push(that.tagLabel(this));
    // });
    // return tags;
    tagItTags;
  const tagLabel: PublicTagger["tagLabel"] = (tag) => tag.value;
  const removeAll: PublicTagger["removeAll"] = () => {
    _tags().forEach((tag: TagType) => {
      removeTag(tag, false);
    });
  };
  const _cleanedInput: PrivateTagger["_cleanedInput"] = () =>
    // Returns the contents of the tag input, cleaned and ready to be passed to createTag
    tagInputRef.current!.value.replace(/^"(.*)"$/, "$1").trim();
  // immediately stop when found one not removed
  const _lastTag = () => {
    console.log(tagItTags);
    let i = tagItTags.length - 1;
    while (i > -1) {
      if (!tagItTags[i].removed) {
        return tagItTags[i];
      }
      i--;
    }
    return null;
  };
  const _tags = () => tagItTags.filter((tag) => tag.removed !== true);
  const _subtractArray: PrivateTagger["_subtractArray"] = (a1, a2) => {
    const result = [];
    for (let i = 0; i < a1.length; i++) {
      if (a2.includes(a1[i])) {
        result.push(a1[i]);
      }
    }
    return result;
  };
  const _showAutoComplete: PrivateTagger["_showAutoComplete"] = () => {
    setShowingAutocomplete(true);
    // TODO 'search'?
    // tagInputRef.current.autocomplete('search', '');
  };
  const _findTagByLabel: PrivateTagger["_findTagByLabel"] = (name: string) => {
    tagItTags.find((tag) => tag);
    const tag = _tags().find(
      (val) => _formatStr(name) === _formatStr(tagLabel(val))
    );
    return tag;
  };
  const _isNew: PrivateTagger["_isNew"] = (name) => !_findTagByLabel(name);
  const _formatStr: PrivateTagger["_formatStr"] = (str) => {
    if (options.caseSensitive) {
      return str;
    }
    return str.toLowerCase().trim();
  };

  const createTag: PublicTagger["createTag"] = (
    value,
    additionalClass,
    duringInitialization
  ) => {
    value = value.trim();

    if (value === "") {
      return false;
    }

    if (!_isNew(value)) {
      const existingTag = _findTagByLabel(value)!;
      if (
        options.onTagExists &&
        options.onTagExists(null, {
          tag: existingTag,
          duringInitialization,
        }) !== false
      ) {
        // TODO
        // if (_effectExists('highlight')) {
        //   existingTag.effect('highlight');
        // }
      }
      return false;
    }

    if (options.tagLimit && options.tagLimit >= _tags().length) {
      if (options.onTagLimitExceeded) {
        options.onTagLimitExceeded(null, {
          duringInitialization,
        });
      }
      return false;
    }

    // Create tag.

    const tag: TagType = { value, removed: false, additionalClass };
    if (
      options.beforeTagAdded &&
      options.beforeTagAdded(null, {
        tag,
        tagLabel: tagLabel(tag),
        duringInitialization,
      }) === false
    ) {
      return;
    }

    setTagItTags([...tagItTags, tag]);
    tagInputRef.current!.value = "";

    {
      options.afterTagAdded &&
        options.afterTagAdded(null, {
          tag,
          tagLabel: tagLabel(tag),
          duringInitialization,
        });
    }
  };
  const removeTag: PublicTagger["removeTag"] = (tag, animate) => {
    animate = animate === undefined ? options.animate : animate;

    // tag = $(tag);
    if (
      options.beforeTagRemoved &&
      options.beforeTagRemoved(null, {
        tag,
        tagLabel: tagLabel(tag),
      }) === false
    ) {
      return;
    }

    if (animate) {
      setTagItTags(
        tagItTags.map((val) => (val !== tag ? val : { ...val, removed: true }))
      );
      // Excludes this tag from _tags.
      // const hide_args = _effectExists('blind')
      //   ? ['blind', { direction: 'horizontal' }, 'fast']
      //   : ['fast'];
      // TODO animate then remove
      // hide_args.push(function () {
      //   tag.remove();
      // });

      // tag.fadeOut('fast').hide.apply(tag, hide_args).dequeue();
      setTagItTags(tagItTags.filter((val) => val.value !== tag.value));
    } else {
      setTagItTags(tagItTags.filter((val) => val !== tag));
    }

    if (options.afterTagRemoved) {
      options.afterTagRemoved(null, {
        tag,
        tagLabel: tagLabel(tag),
      });
    }
  };

  const _availableTagsThatStartWith = (searchString: string) => {
    if (searchString === "") {
      return [];
    }
    const tags = options.availableTags.filter(
      (val) => tagItTags.find((tag) => tag.value === val.value) === undefined
    );
    return tags.filter((val) => val.value.startsWith(searchString));
  };

  const publicTagger = {
    assignedTags,
    tagLabel,
    createTag,
    removeTag,
    removeAll,
  };
  const totalTagger = {
    ...publicTagger,
    _cleanedInput,
    _lastTag,
    _tags,
    _subtractArray,
    _showAutoComplete,
    _findTagByLabel,
    _isNew,
    showingAutocomplete,
    _formatStr,
    _availableTagsThatStartWith,
  };
  return {
    ...publicTagger,
    // TagInput: () => <TagInput options={options} tagger={totalTagger} />,
    TagList: ({ id }) => (
      <TagList
        id={id}
        options={options}
        tagger={totalTagger}
        tagList={tagItTags}
        tagInputRef={tagInputRef}
      />
    ),
  };
}
