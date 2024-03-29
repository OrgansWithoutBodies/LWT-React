// TODO these are activated on class key
import { byteSizeOfString, confirmDelete } from 'lwt-common';
import {
  DictURLValidator,
  TextsID,
  URLValidator,
  containsCharacterOutsideBasicMultilingualPlane,
} from 'lwt-schemas';
import * as ss from 'superstruct';
const checkNotEmptyValidator = () =>
  ss.refine(ss.string(), 'not-blank', (val) => val.trim() !== '');
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
const checkBytesValidator = <TSize extends number>(size: TSize) =>
  ss.refine(
    ss.string(),
    `string-size-within-${size}-bytes`,
    (val) => byteSizeOfString(val) <= size
  );
const checkStringLengthValidator = <TSize extends number>(size: TSize) =>
  ss.refine(
    ss.string(),
    `string-size-within-${size}-chars`,
    (val) => val.length <= size
  );
const checkNoBlanksNoCommaValidator = () =>
  ss.refine(ss.string(), 'no-blanks-no-commas', (val) => {
    for (const char of val) {
      if (char === '' || char === ',') {
        return false;
      }
    }
    return true;
  });

/**
 *
 * @param s
 * @param info
 */
export function alertFirstCharacterOutsideBasicMultilingualPlane(
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
 * @param event
 * @param onSubmit
 */
export const textareaKeydown = (
  event: React.KeyboardEvent<HTMLTextAreaElement>,
  onSubmit: () => void
) => {
  if (event.key && event.key === 'Enter') {
    onSubmit();
  }
};
export const InputElementOnClick = {
  '*': {
    confirmdelete: confirmDelete,
  },
};
export const InputElementOnKeyDown = {
  textarea: {
    'textarea-noreturn': textareaKeydown,
  },
};
// export const InputElementAlertVal={}
export const InputElementValidator = {
  '*': {
    // alert(
    //   'ERROR\n\n' + count + ' field(s) - marked with * - must not be empty!'
    // );
    notempty: checkNotEmptyValidator,
  },
  input: {
    // alert(
    //   'ERROR\n\nField "' +
    //     data_info +
    //     '" must start with "http://" or "https://" if not empty.'
    // );
    checkurl: URLValidator,
    // alert(
    //   'ERROR\n\nField "' +
    //     data_info +
    //     '" must start with "http://" or "https://" or "*http://" or "*https://" or "glosbe_api" if not empty.'
    // );
    checkdicturl: DictURLValidator,
    // 'ERROR\n\nField "' +
    //           data_info +
    //           '" must be an integer number > 0.'
    posintnumber: checkPosIntNumberValidator,
    // 'ERROR\n\nField "' +
    //   data_info +
    //   '" must be an integer number >= 0.'
    zeroposintnumber: checkZeroPosIntNumberValidator,
    // count += alertFirstCharacterOutsideBasicMultilingualPlane(
    //   $(this).val(),
    //   data_info
    // );
    checkoutsidebmp: checkOutsideBMPValidator,

    // 'ERROR\n\nNo spaces or commas allowed in field "' +
    //   data_info +
    //   '", please remove!'
    noblanksnocomma: checkNoBlanksNoCommaValidator,
    // TODO
    // markcheck: length,
  },
  textarea: {
    // data_maxlength
    // alert(
    //   'ERROR\n\nText is too long in field "' +
    //     data_info +
    //     '", please make it shorter! (Maximum length: ' +
    //     data_maxlength +
    //     ' bytes.)'
    // );
    checklength: checkStringLengthValidator,
    // count += alertFirstCharacterOutsideBasicMultilingualPlane(
    //   $(this).val(),
    //   data_info
    // );
    checkoutsidebmp: checkOutsideBMPValidator,

    // data_maxlength
    // alert(
    //   'ERROR\n\nText is too long in field "' +
    //     data_info +
    //     '", please make it shorter! (Maximum length: ' +
    //     data_maxlength +
    //     ' bytes.)'
    // );
    checkbytes: checkBytesValidator,
  },
};

// TODO
// function setTheFocus() {
//   $('.setfocus').focus().select();
// }

export type SetBoolHandler = (val: boolean) => void;

// also changeImprAnnText - only difference is 	$(this).prev('input:radio').attr('checked', 'checked');
/**
 *
 * @param textid
 * @param thedata
 * @param elem
 * @param onSetWaiting
 * @param onSaveData
 */
export async function changeImprAnnRadio(
  textid: TextsID,
  // TODO maybe?
  // thedata: {serialize:()=>string},
  thedata: string,
  // TODO whats this is it needed
  elem: string,
  onSetWaiting: SetBoolHandler,
  // TODO functionality from ajax_save_impr_text
  onSaveData: (args: {
    id: typeof textid;
    data: typeof thedata;
    elem: typeof elem;
  }) => Promise<boolean>
) {
  onSetWaiting(true);
  const success = await onSaveData({ id: textid, elem, data: thedata });
  onSetWaiting(false);
  if (!success) {
    alert('Saving your changes failed, please reload page and try again!');
  }
}

/**
 *
 */
export async function changeImprAnnText(
  textID: TextsID,
  elem: string,
  formData: object,
  onSaveImprText: (val: {
    id: TextsID;
    elem: string;
    data: string;
  }) => Promise<'OK' | false>,
  setLoading: (val: boolean) => void,
  onCheckPrev: () => void
) {
  // const textid = $('#editimprtextdata').attr('data_id');

  onCheckPrev();
  const thedata = JSON.stringify(formData);
  setLoading(true);
  const d = await onSaveImprText({ id: textID, elem, data: thedata });
  if (d != 'OK')
    alert('Saving your changes failed, please reload page and try again!');
}
// TODO
// type ShowSimilarTermsArgs = {
//   lang: LanguagesID;
//   word: string;
// };

// $(document).ready(function () {
//   $('.edit_area').editable('inline_edit', {
//     type: 'textarea',
//     indicator: '<img src="icn/indicator.gif">',
//     tooltip: 'Click to edit...',
//     submit: 'Save',
//     cancel: 'Cancel',
//     rows: 3,
//     cols: 35,
//   });
// $('form.validate').submit(check);

//   markClick();
//   setTheFocus();

//   window.setTimeout(noShowAfter3Secs, 3000);
// });
