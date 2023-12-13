// TODO these are activated on class key
function getUTF8Length(s: any) {
  return new Blob([String(s)]).size;
}
function isInt(value: { length: number; charAt: (arg0: any) => number }) {
  for (i = 0; i < value.length; i++) {
    if (value.charAt(i) < '0' || value.charAt(i) > '9') {
      return false;
    }
  }
  return true;
}

function containsCharacterOutsideBasicMultilingualPlane(s: string) {
  return /[\uD800-\uDFFF]/.test(s);
}

function alertFirstCharacterOutsideBasicMultilingualPlane(
  s: string,
  info: string
) {
  var match = /[\uD800-\uDFFF]/.exec(s);
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

function check() {
  var count = 0;
  $('.notempty').each(function (n: any) {
    if ($(this).val().trim() == '') count++;
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
        $(this).val().trim().indexOf('http://') != 0 &&
        $(this).val().trim().indexOf('https://') != 0
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
        $(this).val().trim().indexOf('http://') != 0 &&
        $(this).val().trim().indexOf('https://') != 0 &&
        $(this).val().trim().indexOf('*http://') != 0 &&
        $(this).val().trim().indexOf('*https://') != 0 &&
        // TODO api://
        $(this).val().trim().indexOf('glosbe_api.php') != 0
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
  return count == 0;
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
function setTheFocus() {
  $('.setfocus').focus().select();
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
    beforeTagAdded: function (event, ui) {
      return !containsCharacterOutsideBasicMultilingualPlane(ui.tag.text());
    },
    availableTags: TAGS,
    fieldName: 'TermTags[TagList][]',
  });
  $('#texttags').tagit({
    beforeTagAdded: function (event, ui) {
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
