/**************************************************************
 "Learning with Texts" (LWT) is free and unencumbered software 
 released into the PUBLIC DOMAIN.

 Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a
compiled binary, for any purpose, commercial or non-commercial,
and by any means.

In jurisdictions that recognize copyright laws, the author or
authors of this software dedicate any and all copyright
interest in the software to the public domain. We make this
dedication for the benefit of the public at large and to the 
detriment of our heirs and successors. We intend this 
dedication to be an overt act of relinquishment in perpetuity
of all present and future rights to this software under
copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE 
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE
AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS BE LIABLE 
FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN 
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
THE SOFTWARE.

For more information, please refer to [http://unlicense.org/].
***************************************************************/

import { useEffect, useState } from 'react';

/**************************************************************
 Check for unsaved changes when unloading window
 ***************************************************************/

export function useDirtyForm(
  termtags: HTMLInputElement[],
  texttags: HTMLInputElement[],
  inputElements: HTMLInputElement[],
  resetElements: HTMLInputElement[]
) {
  const [dirty, setDirty] = useState<0 | 1>(0);

  /**
   *
   */
  function askConfirmIfDirty() {
    if (dirty) {
      return '** You have unsaved changes! **';
    }
  }

  /**
   *
   */
  function makeDirty() {
    setDirty(1);
  }

  /**
   *
   */
  function resetDirty() {
    setDirty(0);
  }

  /**
   *
   * @param event
   * @param ui
   */
  function tagChanged(_event: any, ui: { duringInitialization: boolean }) {
    if (!ui.duringInitialization) {
      setDirty(1);
    }
    return true;
  }

  // $('input,checkbox,textarea,radio,select').bind('change', makeDirty);
  // $(':reset,:submit').bind('click', resetDirty);

  useEffect(() => {
    window.addEventListener('beforeunload', askConfirmIfDirty);

    //

    termtags.forEach((tagElement) => {
      tagElement.addEventListener('afterTagAdded', tagChanged as any);
      tagElement.addEventListener('afterTagRemoved', tagChanged as any);
    });
    texttags.forEach((tagElement) => {
      tagElement.addEventListener('afterTagAdded', tagChanged as any);
      tagElement.addEventListener('afterTagRemoved', tagChanged as any);
    });

    //

    inputElements.forEach((tagElement) => {
      tagElement.addEventListener('change', makeDirty);
    });
    resetElements.forEach((tagElement) => {
      tagElement.addEventListener('change', resetDirty);
    });

    return () => {
      window.removeEventListener('beforeunload', askConfirmIfDirty);

      //

      termtags.forEach((tagElement) => {
        tagElement.removeEventListener('afterTagAdded', tagChanged as any);
        tagElement.removeEventListener('afterTagRemoved', tagChanged as any);
      });
      texttags.forEach((tagElement) => {
        tagElement.removeEventListener('afterTagAdded', tagChanged as any);
        tagElement.removeEventListener('afterTagRemoved', tagChanged as any);
      });

      //

      inputElements.forEach((tagElement) => {
        tagElement.removeEventListener('change', makeDirty);
      });
      resetElements.forEach((tagElement) => {
        tagElement.removeEventListener('change', resetDirty);
      });
    };
  }, []);
}
