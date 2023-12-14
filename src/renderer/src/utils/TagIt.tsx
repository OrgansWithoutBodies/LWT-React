// TODO Integrate

import { useState } from 'react';

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
type TagItOptions = {
  allowDuplicates?: boolean;
  caseSensitive?: boolean;
  fieldName?: string;
  placeholderText?: null | string; // Sets `placeholder` attr on input field.
  readOnly?: boolean; // Disables editing.
  removeConfirmation?: boolean; // Require confirmation to remove tags.
  tagLimit?: number | null; // Max number of tags allowed (null for unlimited).

  // Used for autocomplete, unless you override `autocomplete.source`.
  availableTags?: string[];

  // Use to override or add any options to the autocomplete widget.
  //
  // By default, autocomplete.source will map to availableTags,
  // unless overridden.
  autocomplete: {
    minLength?: number;
    source?: (
      search: { term: string },
      showChoices: (arg0: any) => void
    ) => void;
  };

  // Shows autocomplete before the user even types anything.
  showAutocompleteOnFocus?: boolean;

  // When enabled, quotes are unneccesary for inputting multi-word tags.
  allowSpaces?: boolean;

  // The below options are for using a single field instead of several
  // for our form values.
  //
  // When enabled, will use a single hidden field for the form,
  // rather than one per tag. It will delimit tags in the field
  // with singleFieldDelimiter.
  //
  // The easiest way to use singleField is to just instantiate tag-it
  // on an INPUT element, in which case singleField is automatically
  // set to true, and singleFieldNode is set to that element. This
  // way, you don't need to fiddle with these options.
  singleField?: boolean;

  // This is just used when preloading data from the field, and for
  // populating the field with delimited tags as the user adds them.
  singleFieldDelimiter?: string;

  // Set this to an input DOM node to use an existing form field.
  // Any text in it will be erased on init. But it will be
  // populated with the text of tags as they are created,
  // delimited by singleFieldDelimiter.
  //
  // If this is not set, we create an input node for it,
  // with the name given in settings.fieldName.
  // TODO type
  singleFieldNode?: null;

  // Whether to animate tag removals or not.
  animate?: boolean;

  // Optionally set a tabindex attribute on the input that gets
  // created for tag-it.
  tabIndex?: null;

  // Event callbacks.
  beforeTagAdded?:
    | null
    | ((event: any, ui: { tag: { text: () => string } }) => void);
  afterTagAdded?: (() => void) | null;

  beforeTagRemoved?: (() => void) | null;
  afterTagRemoved?: (() => void) | null;

  onTagClicked?: (() => void) | null;
  onTagLimitExceeded?: (() => void) | null;
};
const defaultOptions: TagItOptions = {
  allowDuplicates: false,
  caseSensitive: true,
  fieldName: 'tags',
  placeholderText: null, // Sets `placeholder` attr on input field.
  readOnly: false, // Disables editing.
  removeConfirmation: false, // Require confirmation to remove tags.
  tagLimit: null, // Max number of tags allowed (null for unlimited).
  availableTags: [],
  autocomplete: {},
  showAutocompleteOnFocus: false,
  allowSpaces: false,
  singleField: false,
  singleFieldDelimiter: ',',
  singleFieldNode: null,
  animate: true,
  tabIndex: null,
  beforeTagAdded: null,
  afterTagAdded: null,
  beforeTagRemoved: null,
  afterTagRemoved: null,
  onTagClicked: null,
  onTagLimitExceeded: null,
};
/**
 *
 */
function TagInput({
  options: {
    readOnly,
    tabIndex,
    placeholderText,
    showAutocompleteOnFocus,
    autocomplete,
    availableTags,
    removeConfirmation,
  },
  handlers,
  tagger: {
    _subtractArray,
    assignedTags,
    _showAutoComplete,
    createTag,
    _cleanedInput,
  },
}: {
  options: TagItOptions;
  handlers: TagItHandlers;
  tagger: PrivateTagger;
}) {
  autocomplete.source = function (
    search: { term: string },
    showChoices: (arg0: any) => void
  ) {
    const filter = search.term.toLowerCase();
    const choices = $.grep(availableTags, function (element: string) {
      // Only match autocomplete options that begin with the search term.
      // (Case insensitive.)
      return element.toLowerCase().indexOf(filter) === 0;
    });
    showChoices(_subtractArray(choices, assignedTags()));
  };

  if (showAutocompleteOnFocus) {
    tagInput.focus(function (event: any, ui: any) {
      _showAutoComplete();
    });

    if (autocomplete.minLength === undefined) {
      autocomplete.minLength = 0;
    }
  }
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);
  return (
    <>
      <input
        autoComplete={autoCompleteOptions}
        onAutoCompleteOpen={() => {
          setAutocompleteOpen(true);
        }}
        onAutoCompleteClose={() => {
          setAutocompleteOpen(false);
        }}
        onKeyDown={(event) => {
          // Backspace is not detected within a keypress, so it must use keydown.
          if (
            event.which == $.ui.keyCode.BACKSPACE &&
            that.tagInput.val() === ''
          ) {
            const tag = that._lastTag();
            if (!removeConfirmation || tag.hasClass('remove')) {
              // When backspace is pressed, the last tag is deleted.
              that.removeTag(tag);
            } else if (removeConfirmation) {
              tag.addClass('remove ui-state-highlight');
            }
          } else if (removeConfirmation) {
            that._lastTag().removeClass('remove ui-state-highlight');
          }

          // Comma/Space/Enter are all valid delimiters for new tags,
          // except when there is an open quote or if setting allowSpaces = true.
          // Tab will also create a tag, unless the tag input is empty,
          // in which case it isn't caught.
          if (
            event.which === $.ui.keyCode.COMMA ||
            event.which === $.ui.keyCode.ENTER ||
            (event.which == $.ui.keyCode.TAB && that.tagInput.val() !== '') ||
            (event.which == $.ui.keyCode.SPACE &&
              that.options.allowSpaces !== true &&
              ($.trim(that.tagInput.val()).replace(/^s*/, '').charAt(0) !=
                '"' ||
                ($.trim(that.tagInput.val()).charAt(0) == '"' &&
                  $.trim(that.tagInput.val()).charAt(
                    $.trim(that.tagInput.val()).length - 1
                  ) == '"' &&
                  $.trim(that.tagInput.val()).length - 1 !== 0)))
          ) {
            // Enter submits the form if there's no text in the input.
            if (
              !(
                event.which === $.ui.keyCode.ENTER && that.tagInput.val() === ''
              )
            ) {
              event.preventDefault();
            }

            createTag(_cleanedInput());
            // The autocomplete doesn't close automatically when TAB is pressed.
            // So let's ensure that it closes.
            tagInput.autocomplete('close');
          }
        }}
        type="text"
        onBlur={() => {
          // Create a tag when the element loses focus.
          // If autocomplete is enabled and suggestion was clicked, don't add it.
          if (autocompleteOpen) {
            createTag(_cleanedInput());
          }
        }}
        onFocus={() => {
          _showAutoComplete();
        }}
        maxlength="20"
        size="20"
        disabled={readOnly ? true : undefined}
        tabindex={tabIndex ? tabIndex : undefined}
        placeholder={placeholderText ? placeholderText : undefined}
        className="ui-widget-content"
      />
    </>
  );
}
/**
 *
 */
function TagList({
  options,
  handlers,
  tagger,
}: {
  options: TagItOptions;
  handlers: TagItHandlers;
  tagger: PrivateTagger;
}) {
  // TODO
  // // Single field support.
  // let addedExistingFromSingleFieldNode = false;
  // if (options.singleField) {
  //   if (options.singleFieldNode) {
  //     // Add existing tags from the input field.
  //     const node = $(options.singleFieldNode);
  //     const tags = node.val().split(options.singleFieldDelimiter);
  //     node.val('');
  //     $.each(tags, function (index: any, tag: any) {
  //       that.createTag(tag, null, true);
  //       addedExistingFromSingleFieldNode = true;
  //     });
  //   } else {
  //     // Create our single field input after our list.
  //     options.singleFieldNode = (
  //       <input
  //         type="hidden"
  //         style={{ display: 'none' }}
  //         value=""
  //         name={options.fieldName}
  //       />
  //     );

  //     tagList.after(options.singleFieldNode);
  //   }
  // }

  // // Add existing tags from the list, if any.
  // if (!addedExistingFromSingleFieldNode) {
  //   tagList.children('li').each(function () {
  //     if (!$(this).hasClass('tagit-new')) {
  //       that.createTag($(this).text(), $(this).attr('class'), true);
  //       $(this).remove();
  //     }
  //   });
  // }

  return (
    <ul
      className={`${'tagit'} ${'ui-widget ui-widget-content ui-corner-all'}`}
      onClick={(e) => {
        const target = $(e.target);
        if (target.hasClass('tagit-label')) {
          const tag = target.closest('.tagit-choice');
          if (!tag.hasClass('removed') && handlers.onTagClicked) {
            handlers.onTagClicked(e, {
              tag,
              tagLabel: that.tagLabel(tag),
            });
          }
        } else {
          // Sets the focus() to the input field, if the user
          // clicks anywhere inside the UL. This is needed
          // because the input field needs to be of a small size.
          that.tagInput.focus();
        }
      }}
    >
      <li className="tagit-new">
        <TagInput options={options} tagger={tagger} handlers={handlers} />
      </li>
    </ul>
  );
}
type TagType = string;
type TagEventHandler = (
  e: React.MouseEvent,
  tag: {
    tag: TagType;
    tagLabel: string;
  }
) => boolean;

type TagItHandlers = {
  onTagClicked?: TagEventHandler;
  change?: TagEventHandler;
  onTagExists?: TagEventHandler;
  onTagLimitExceeded?: TagEventHandler;
  beforeTagAdded?: TagEventHandler;
  afterTagAdded?: TagEventHandler;
  beforeTagRemoved?: TagEventHandler;
  afterTagRemoved?: TagEventHandler;
};

type PublicTagger = {
  assignedTags: () => void;
  tagLabel: (tag: TagType) => void;
  createTag: () => void;
  removeTag: (
    tag: {
      addClass: (arg0: string) => void;
      remove: () => void;
      fadeOut: (arg0: string) => {
        (): any;
        new (): any;
        hide: {
          (): any;
          new (): any;
          apply: {
            (arg0: any, arg1: (string | { direction: string })[]): {
              (): any;
              new (): any;
              dequeue: { (): void; new (): any };
            };
            new (): any;
          };
        };
      };
    },
    animate: TagItOptions['animate']
  ) => void;
  removeTagByLabel: () => void;
  removeAll: () => void;
};
type PrivateTagger = PublicTagger & {
  _cleanedInput: () => void;
  _lastTag: () => void;
  _tags: () => void;
  _updateSingleTagsField: () => void;
  _subtractArray: () => void;
  _showAutoComplete: () => void;
  _findTagByLabel: () => void;
  _isNew: () => void;
  _formatStr: () => void;
  _effectExists: () => void;
};
type TaggerOutput = PublicTagger & {
  TagInput: () => JSX.Element;
  TagList: () => JSX.Element;
};
/**
 *
 * @param options
 */
export function useTagIt(
  options: TagItOptions,
  handlers: TagItHandlers
): TaggerOutput {
  const [tagItTags, setTagItTags] = useState(options.availableTags || []);

  const assignedTags = () =>
    // // Returns an array of tag string values
    // const that = this;
    // let tags = [];
    // if (options.singleField) {
    //   tags = $(options.singleFieldNode)
    //     .val()
    //     .split(options.singleFieldDelimiter);
    //   if (tags[0] === '') {
    //     tags = [];
    //   }
    // } else {
    //   _tags().each(function () {
    //     tags.push(that.tagLabel(this));
    //   });
    // }
    // return tags;
    tagItTags;
  const tagLabel: PublicTagger['tagLabel'] = (tag) => {
    if (options.singleField) {
      return $(tag).find('.tagit-label:first').text();
    } else {
      return $(tag).find('input:first').val();
    }
  };
  const removeAll = () => {
    // Removes all tags.
    const that = this;
    _tags().each(function (index: any, tag: any) {
      removeTag(tag, false);
    });
  };
  const _cleanedInput = () =>
    // Returns the contents of the tag input, cleaned and ready to be passed to createTag
    tagInput
      .val()
      .replace(/^"(.*)"$/, '$1')
      .trim();
  const _lastTag = () => tagList.find('.tagit-choice:last:not(.removed)');
  const _tags = () => tagItTags.find('.tagit-choice:not(.removed)');
  const _updateSingleTagsField = (tags: any[]) => {
    // Takes a list of tag string values, updates options.singleFieldNode.val to the tags delimited by options.singleFieldDelimiter
    $(options.singleFieldNode)
      .val(tags.join(options.singleFieldDelimiter))
      .trigger('change');
  };
  const _subtractArray = (a1: any[], a2: any[]) => {
    const result = [];
    for (let i = 0; i < a1.length; i++) {
      if ($.inArray(a1[i], a2) == -1) {
        result.push(a1[i]);
      }
    }
    return result;
  };
  const _showAutoComplete = () => {
    tagInput.autocomplete('search', '');
  };
  const _findTagByLabel = (name: any) => {
    const that = this;
    let tag = null;
    _tags().each(function () {
      if (_formatStr(name) == _formatStr(tagLabel(this))) {
        tag = $(this);
        return false;
      }
    });
    return tag;
  };
  const _isNew = (name: any) => !_findTagByLabel(name);
  const _formatStr = (str: string) => {
    if (options.caseSensitive) {
      return str;
    }
    return str.toLowerCase().trim();
  };
  const _effectExists = (name: string | number) =>
    Boolean(
      $.effects &&
        ($.effects[name] || ($.effects.effect && $.effects.effect[name]))
    );

  const createTag = (
    value: string,
    additionalClass: any,
    duringInitialization: any
  ) => {
    const that = this;

    value = value.trim();

    if (value === '') {
      return false;
    }

    if (!options.allowDuplicates && !_isNew(value)) {
      const existingTag = _findTagByLabel(value);
      if (
        handlers.onTagExists &&
        handlers.onTagExists(null, {
          existingTag,
          duringInitialization,
        }) !== false
      ) {
        if (_effectExists('highlight')) {
          existingTag.effect('highlight');
        }
      }
      return false;
    }

    if (options.tagLimit && options.tagLimit >= _tags().length) {
      if (handlers.onTagLimitExceeded) {
        handlers.onTagLimitExceeded(null, {
          duringInitialization,
        });
      }
      return false;
    }

    const label = options.onTagClicked ? (
      <a className="tagit-label">{value}</a>
    ) : (
      <span className="tagit-label">{value}</span>
    );

    // Create tag.
    const tag = (
      <li
        className={`tagit-choice ui-widget-content ui-state-default ui-corner-all ${additionalClass} ${
          options.readOnly ? 'tagit-choice-read-only' : 'tagit-choice-editable'
        }`}
      >
        {label}
        {!options.readOnly && (
          <a
            className="tagit-close"
            onClick={() => {
              // Removes a tag when the little 'x' is clicked.
              that.removeTag(tag);
            }}
          >
            <span className="text-icon">
              {'\xd7'}
              {/* Button for removing the tag. */}
              <span className="ui-icon ui-icon-close"></span>{' '}
            </span>
          </a>
        )}
        {!options.singleField && (
          // Unless options.singleField is set, each tag has a hidden input field inline.
          <input
            type="hidden"
            style={{ display: 'none' }}
            value={label}
            name={options.fieldName}
          />
        )}
      </li>
    );

    if (
      handlers.beforeTagAdded(null, {
        tag,
        tagLabel: tagLabel(tag),
        duringInitialization,
      }) === false
    ) {
      return;
    }

    if (options.singleField) {
      // const tags = assignedTags();
      // tags.push(value);
      setTagItTags([...tagItTags, value]);
      // TODO
      _updateSingleTagsField(tags);
    }

    tagInput.val('');

    // Insert tag.
    tagInput.parent().before(tag);

    handlers.afterTagAdded(null, {
      tag,
      tagLabel: tagLabel(tag),
      duringInitialization,
    });

    if (options.showAutocompleteOnFocus && !duringInitialization) {
      setTimeout(function () {
        that._showAutoComplete();
      }, 0);
    }
  };
  const removeTag: PublicTagger['removeTag'] = (tag, animate) => {
    animate = animate === undefined ? options.animate : animate;

    // tag = $(tag);
    if (
      handlers.beforeTagRemoved &&
      handlers.beforeTagRemoved(null, {
        tag,
        tagLabel: tagLabel(tag),
      }) === false
    ) {
      return;
    }

    if (options.singleField) {
      const tags = tagItTags;
      const removedTagLabel = tagLabel(tag);
      setTagItTags(tags.filter((t) => t !== removedTagLabel));
      // TODO
      _updateSingleTagsField(tags);
    }

    if (animate) {
      tag.addClass('removed'); // Excludes this tag from _tags.
      const hide_args = _effectExists('blind')
        ? ['blind', { direction: 'horizontal' }, 'fast']
        : ['fast'];

      hide_args.push(function () {
        tag.remove();
      });

      tag.fadeOut('fast').hide.apply(tag, hide_args).dequeue();
    } else {
      tag.remove();
    }
    if (handlers.afterTagRemoved) {
      handlers.afterTagRemoved(null, {
        tag,
        tagLabel: tagLabel(tag),
      });
    }
  };
  const removeTagByLabel = (tagLabel: string, animate: any) => {
    const toRemove = _findTagByLabel(tagLabel);
    if (!toRemove) {
      throw "No such tag exists with the name '" + tagLabel + "'";
    }
    removeTag(toRemove, animate);
  };
  return {
    TagInput,
    assignedTags,
    tagLabel,
    createTag,
    removeTag,
    removeTagByLabel,
    removeAll,
  };
}
/**
 *
 * @param options
 */
export function tagIt(options: typeof defaultOptions) {
  return {
    options,

    _create() {
      // for handling static scoping inside callbacks
      const that = this;

      // There are 2 kinds of DOM nodes this widget can be instantiated on:
      //     1. UL, OL, or some element containing either of these.
      //     2. INPUT, in which case 'singleField' is overridden to true,
      //        a UL is created and the INPUT is hidden.
      if (element.is('input')) {
        tagList = $('<ul></ul>').insertAfter(element);
        options.singleField = true;
        options.singleFieldNode = element;
        element.css('display', 'none');
      } else {
        tagList = element.find('ul, ol').andSelf().last();
      }

      // Bind autocomplete.source callback functions to this context.
      if ($.isFunction(options.autocomplete.source)) {
        options.autocomplete.source = $.proxy(
          options.autocomplete.source,
          this
        );
      }

      // Autocomplete.
      if (
        options.availableTags ||
        options.tagSource ||
        options.autocomplete.source
      ) {
        const autocompleteOptions = {
          select(event: any, ui: { item: { value: any } }) {
            that.createTag(ui.item.value);
            // Preventing the tag input to be updated with the chosen value.
            return false;
          },
        };
        $.extend(autocompleteOptions, options.autocomplete);

        // tagSource is deprecated, but takes precedence here since autocomplete.source is set by default,
        // while tagSource is left null by default.
        autocompleteOptions.source = autocompleteOptions.source;

        tagInput
          .autocomplete(autocompleteOptions)
          .bind('autocompleteopen', function (event: any, ui: any) {
            that.tagInput.data('autocomplete-open', true);
          })
          .bind('autocompleteclose', function (event: any, ui: any) {
            that.tagInput.data('autocomplete-open', false);
          });
      }
    },
  };
}
