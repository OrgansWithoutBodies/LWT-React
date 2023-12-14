// TODO these are activated on class key
import * as ss from 'superstruct';
import { useTagIt } from '../../utils/TagIt';
import { confirmDelete } from '../../utils/utils';

/**
 *
 */
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
  // 'ERROR\n\nField "' +
  //           $(this).attr('data_info') +
  //           '" must be an integer number > 0.'
  $('input.posintnumber').each(checkPosIntNumberValidator);
  // 'ERROR\n\nField "' +
  //   $(this).attr('data_info') +
  //   '" must be an integer number >= 0.'
  $('input.zeroposintnumber').each(checkZeroPosIntNumberValidator);
  // count += alertFirstCharacterOutsideBasicMultilingualPlane(
  //   $(this).val(),
  //   $(this).attr('data_info')
  // );
  $('input.checkoutsidebmp').each(checkOutsideBMPValidator);
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
  // count += alertFirstCharacterOutsideBasicMultilingualPlane(
  //   $(this).val(),
  //   $(this).attr('data_info')
  // );
  $('textarea.checkoutsidebmp').each(checkOutsideBMPValidator);
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
  // 'ERROR\n\nNo spaces or commas allowed in field "' +
  //   $(this).attr('data_info') +
  //   '", please remove!'
  $('input.noblanksnocomma').each(checkNoBlanksNoCommaValidator);
  return count === 0;
}

const checkNotEmptyValidator = () => {};
const checkURLValidator = () => {};
const checkDictURLValidator = () => {};
const checkLengthValidator = () => {};
const checkPosIntNumberValidator = () =>
  ss.refine(ss.number(), 'pos-int', (val) => val > 0 && Number.isInteger(val));
const checkZeroPosIntNumberValidator = () =>
  ss.refine(
    ss.number(),
    'zero-pos-int',
    (val) => val >= 0 && Number.isInteger(val)
  );
const checkOutsideBMPValidator = () =>
  ss.refine(ss.string(), 'is-inside-bmp', (val) =>
    containsCharacterOutsideBasicMultilingualPlane(val)
  );
const checkBytesValidator = () => {};
const checkNoBlanksNoCommaValidator = () =>
  ss.refine(ss.string(), 'no-blanks-no-commas', (val) => {
    for (const char of val) {
      if (char === '' || char === ',') {
        return false;
      }
    }
    return true;
  });

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
export function changeImprAnnRadio(this: any) {
  const textid = $('#editimprtextdata').attr('data_id');
  const elem = $(this).attr('name');
  const idwait = '#wait' + elem.substring(2);
  $(idwait).html('<img src="icn/waiting2.gif" />');
  const thedata = JSON.stringify($('form').serializeObject());
  $.post(
    'ajax_save_impr_text.php',
    { id: textid, elem, data: thedata },
    function (d: string) {
      $(idwait).html('<img src="icn/empty.gif" />');
      if (d !== 'OK')
        alert('Saving your changes failed, please reload page and try again!');
    }
  );
}

/**
 *
 */
export function changeImprAnnText(this: any) {
  const textid = $('#editimprtextdata').attr('data_id');
  $(this).prev('input:radio').attr('checked', 'checked');
  const elem = $(this).attr('name');
  const idwait = '#wait' + elem.substring(2);
  $(idwait).html('<img src="icn/waiting2.gif" />');
  const thedata = JSON.stringify($('form').serializeObject());
  $.post(
    'ajax_save_impr_text.php',
    { id: textid, elem, data: thedata },
    function (d: string) {
      $(idwait).html('<img src="icn/empty.gif" />');
      if (d !== 'OK')
        alert('Saving your changes failed, please reload page and try again!');
    }
  );
}

/**
 *
 */
export function markClick() {
  if ($('input.markcheck:checked').length > 0) {
    $('#markaction').removeAttr('disabled');
  } else {
    $('#markaction').attr('disabled', 'disabled');
  }
}

/**
 *
 */
export function textareaKeydown(event: { keyCode: string }) {
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
  $('form.validate').submit(check);
  $('.confirmdelete').click(confirmDelete);
  $('textarea.textarea-noreturn').keydown(textareaKeydown);
  const termTags = [] as string[];
  const textTags = [] as string[];
  const tagItTermTags = useTagIt({
    availableTags: termTags,
    fieldName: 'TermTags[TagList][]',
    beforeTagAdded: (event, ui) =>
      !containsCharacterOutsideBasicMultilingualPlane(ui.tag.text()),
  });
  const tagItTextTags = useTagIt({
    availableTags: textTags,
    fieldName: 'TextTags[TagList][]',
    beforeTagAdded: (event, ui) =>
      !containsCharacterOutsideBasicMultilingualPlane(ui.tag.text()),
  });

  markClick();
  setTheFocus();

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
    function (data: any) {
      $('#simwords').html(data);
    }
  );
}
