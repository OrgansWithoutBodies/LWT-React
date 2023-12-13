// TODO these are activated on class key

import { confirmDelete } from '../../utils/utils';

function noShowAfter3Secs() {
  $('#hide3').slideUp();
}

/**
 *
 * @param s
 */
function getUTF8Length(s: any) {
  return new Blob([String(s)]).size;
}
/**
 *
 */
function isInt(value: { length: number; charAt: (arg0: any) => number }) {
  for (let i = 0; i < value.length; i++) {
    if (value.charAt(i) < '0' || value.charAt(i) > '9') {
      return false;
    }
  }
  return true;
}

/**
 *
 * @param s
 */
function containsCharacterOutsideBasicMultilingualPlane(s: string) {
  return /[\uD800-\uDFFF]/.test(s);
}

/**
 *
 * @param s
 * @param info
 */
function alertFirstCharacterOutsideBasicMultilingualPlane(
  s: string,
  info: string
) {
  const match = /[\uD800-\uDFFF]/.exec(s);
  if (match) {
    alert(
      'ERROR\n\nText "' +
        info +
        '" contains invalid character(s) (in the Unicode Supplementary Multilingual Planes, > U+FFFF) like emojis or very rare characters.\n\nFirst invalid character: "' +
        s.substring(match.index, match.index + 2) +
        '" at position ' +
        (match.index + 1) +
        '.\n\nMore info: https://en.wikipedia.org/wiki/Plane_(Unicode)\n\nPlease remove this/these character(s) and try again.'
    );
    return 1;
  } else {
    return 0;
  }
}

/**
 *
 */
function check() {
  let count = 0;
  $('.notempty').each(function (n: any) {
    if ($(this).val().trim() === '') count++;
  });
  if (count > 0) {
    alert(
      'ERROR\n\n' + count + ' field(s) - marked with * - must not be empty!'
    );
    return false;
  }
  count = 0;
  $('input.checkurl').each(function (n: any) {
    if ($(this).val().trim().length > 0) {
      if (
        $(this).val().trim().indexOf('http://') !== 0 &&
        $(this).val().trim().indexOf('https://') !== 0
      ) {
        alert(
          'ERROR\n\nField "' +
            $(this).attr('data_info') +
            '" must start with "http://" or "https://" if not empty.'
        );
        count++;
      }
    }
  });
  $('input.checkdicturl').each(function (n: any) {
    if ($(this).val().trim().length > 0) {
      if (
        $(this).val().trim().indexOf('http://') !== 0 &&
        $(this).val().trim().indexOf('https://') !== 0 &&
        $(this).val().trim().indexOf('*http://') !== 0 &&
        $(this).val().trim().indexOf('*https://') !== 0 &&
        // TODO api://
        $(this).val().trim().indexOf('glosbe_api.php') !== 0
      ) {
        alert(
          'ERROR\n\nField "' +
            $(this).attr('data_info') +
            '" must start with "http://" or "https://" or "*http://" or "*https://" or "glosbe_api.php" if not empty.'
        );
        count++;
      }
    }
  });
  $('input.posintnumber').each(function (n: any) {
    if ($(this).val().trim().length > 0) {
      if (!(isInt($(this).val().trim()) && $(this).val().trim() + 0 > 0)) {
        alert(
          'ERROR\n\nField "' +
            $(this).attr('data_info') +
            '" must be an integer number > 0.'
        );
        count++;
      }
    }
  });
  $('input.zeroposintnumber').each(function (n: any) {
    if ($(this).val().trim().length > 0) {
      if (!(isInt($(this).val().trim()) && $(this).val().trim() + 0 >= 0)) {
        alert(
          'ERROR\n\nField "' +
            $(this).attr('data_info') +
            '" must be an integer number >= 0.'
        );
        count++;
      }
    }
  });
  $('input.checkoutsidebmp').each(function (n: any) {
    if ($(this).val().trim().length > 0) {
      if (containsCharacterOutsideBasicMultilingualPlane($(this).val())) {
        count += alertFirstCharacterOutsideBasicMultilingualPlane(
          $(this).val(),
          $(this).attr('data_info')
        );
      }
    }
  });
  $('textarea.checklength').each(function (n: any) {
    if ($(this).val().trim().length > 0 + $(this).attr('data_maxlength')) {
      alert(
        'ERROR\n\nText is too long in field "' +
          $(this).attr('data_info') +
          '", please make it shorter! (Maximum length: ' +
          $(this).attr('data_maxlength') +
          ' char.)'
      );
      count++;
    }
  });
  $('textarea.checkoutsidebmp').each(function (n: any) {
    if (containsCharacterOutsideBasicMultilingualPlane($(this).val())) {
      count += alertFirstCharacterOutsideBasicMultilingualPlane(
        $(this).val(),
        $(this).attr('data_info')
      );
    }
  });
  $('textarea.checkbytes').each(function (n: any) {
    if (
      getUTF8Length($(this).val().trim()) >
      0 + $(this).attr('data_maxlength')
    ) {
      alert(
        'ERROR\n\nText is too long in field "' +
          $(this).attr('data_info') +
          '", please make it shorter! (Maximum length: ' +
          $(this).attr('data_maxlength') +
          ' bytes.)'
      );
      count++;
    }
  });
  $('input.noblanksnocomma').each(function (n: any) {
    if ($(this).val().indexOf(' ') > 0 || $(this).val().indexOf(',') > 0) {
      alert(
        'ERROR\n\nNo spaces or commas allowed in field "' +
          $(this).attr('data_info') +
          '", please remove!'
      );
      count++;
    }
  });
  return count === 0;
}

const checkNotEmptyValidator = () => {};
const checkURLValidator = () => {};
const checkDictURLValidator = () => {};
const checkLengthValidator = () => {};
const checkPosIntNumberValidator = () => {};
const checkZeroPosIntNumberValidator = () => {};
const checkOutsideBMPValidator = () => {};
const checkBytesValidator = () => {};
const checkNoBlanksNoCommaValidator = () => {};

// TODO
/**
 *
 */
function setTheFocus() {
  $('.setfocus').focus().select();
}

/**
 *
 */
function changeImprAnnRadio() {
  const textid = $('#editimprtextdata').attr('data_id');
  const elem = $(this).attr('name');
  const idwait = '#wait' + elem.substring(2);
  $(idwait).html('<img src="icn/waiting2.gif" />');
  const thedata = JSON.stringify($('form').serializeObject());
  $.post(
    'ajax_save_impr_text.php',
    { id: textid, elem, data: thedata },
    function (d) {
      $(idwait).html('<img src="icn/empty.gif" />');
      if (d !== 'OK')
        alert('Saving your changes failed, please reload page and try again!');
    }
  );
}

/**
 *
 */
function changeImprAnnText() {
  const textid = $('#editimprtextdata').attr('data_id');
  $(this).prev('input:radio').attr('checked', 'checked');
  const elem = $(this).attr('name');
  const idwait = '#wait' + elem.substring(2);
  $(idwait).html('<img src="icn/waiting2.gif" />');
  const thedata = JSON.stringify($('form').serializeObject());
  $.post(
    'ajax_save_impr_text.php',
    { id: textid, elem, data: thedata },
    function (d) {
      $(idwait).html('<img src="icn/empty.gif" />');
      if (d !== 'OK')
        alert('Saving your changes failed, please reload page and try again!');
    }
  );
}

/**
 *
 */
function markClick() {
  if ($('input.markcheck:checked').length > 0) {
    $('#markaction').removeAttr('disabled');
  } else {
    $('#markaction').attr('disabled', 'disabled');
  }
}

/**
 *
 */
function showallwordsClick() {
  const option = $('#showallwords:checked').length;
  const text = $('#thetextid').text();
  window.parent.frames['ro'].location.href =
    'set_text_mode.php?mode=' + option + '&text=' + text;
}

function textareaKeydown(event) {
  if (event.keyCode && event.keyCode === '13') {
    if (check()) $('input:submit').last().click();
    return false;
  } else {
    return true;
  }
}

$(document).ready(function () {
  $('.edit_area').editable('inline_edit.php', {
    type: 'textarea',
    indicator: '<img src="icn/indicator.gif">',
    tooltip: 'Click to edit...',
    submit: 'Save',
    cancel: 'Cancel',
    rows: 3,
    cols: 35,
  });
  $('input.impr-ann-text').change(changeImprAnnText);
  $('input.impr-ann-radio').change(changeImprAnnRadio);
  $('form.validate').submit(check);
  $('input.markcheck').click(markClick);
  $('.confirmdelete').click(confirmDelete);
  $('#showallwords').click(showallwordsClick);
  $('textarea.textarea-noreturn').keydown(textareaKeydown);
  $('#termtags').tagit({
    beforeTagAdded(event, ui) {
      return !containsCharacterOutsideBasicMultilingualPlane(ui.tag.text());
    },
    availableTags: TAGS,
    fieldName: 'TermTags[TagList][]',
  });
  $('#texttags').tagit({
    beforeTagAdded(event, ui) {
      return !containsCharacterOutsideBasicMultilingualPlane(ui.tag.text());
    },
    availableTags: TEXTTAGS,
    fieldName: 'TextTags[TagList][]',
  });
  markClick();
  setTheFocus();
  if (
    $('#simwords').length > 0 &&
    $('#langfield').length > 0 &&
    $('#wordfield').length > 0
  ) {
    $('#wordfield').blur(do_ajax_show_similar_terms);
    do_ajax_show_similar_terms();
  }
  window.setTimeout(noShowAfter3Secs, 3000);
});

// TODO

/**
 *
 */
export function do_ajax_show_similar_terms() {
  $('#simwords').html('<img src="icn/waiting2.gif" />');
  $.post(
    'ajax_show_similar_terms.php',
    { lang: $('#langfield').val(), word: $('#wordfield').val() },
    function (data) {
      $('#simwords').html(data);
    }
  );
}
