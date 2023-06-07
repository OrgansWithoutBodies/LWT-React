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

import { CSSObject } from 'styled-components';

/**************************************************************
Stylesheet
***************************************************************/
export type StyleVariant = 'light' | 'dark';
type HexString = `#${Uppercase<string>}`;
type ColorSchema = { [key in ColorKeys]: HexString };
const DefaultColors = {
  // nonsaturated
  lum0: '#000000',
  lum1: '#808080',
  lum2: '#999999',
  lum3: '#DDDDDD',
  lum4: '#EEEEEE',
  lum5: '#F8F8F8',
  lum6: '#FFFFFF',

  //   right/wrong
  right: '#006400',
  wrong: '#C00000',

  //   value colors
  str0: '#ADDFFF',
  str1: '#F5B8A9',
  str2: '#F5CCA9',
  str3: '#F5E1A9',
  str4: '#F5F3A9',
  str5: '#A9F5A9',

  //   offwhites
  off0: '#FFFFD0',
  off1: '#FFFFE0',
  off2: '#FFFACD',

  // highlight
  highlightColor0: '#0000FF',
  highlightColor1: '#FF0000',

  //   etc
  test7: '#006699',
  test8: '#0099CC',
  test9: '#BBFFBB',
  test10: '#CCFFCC',
  test11: '#DDFFDD',
} as const;
type ColorKeys = keyof typeof DefaultColors;

const DarkColors: ColorSchema = {
  // nonsaturated
  lum0: '#FFFFFF',
  lum1: '#F8F8F8',
  lum2: '#EEEEEE',
  lum4: '#999999',
  lum5: '#808080',
  lum3: '#555555',
  lum6: '#000000',

  //   value colors

  str0: '#004ED2',
  str1: '#B200DB',
  str2: '#D31700',
  str3: '#FF7900',
  str4: '#6BC837',
  str5: '#117433',

  //   right/wrong
  right: '#006400',
  wrong: '#C00000',

  //   offwhites
  off0: '#FFFFD0',
  off1: '#FFFFE0',
  // wizard color
  off2: '#4400AA',

  // highlight
  highlightColor0: '#0000FF',
  highlightColor1: '#FF0000',

  //   etc
  test7: '#006699',
  test8: '#0099CC',
  test9: '#BBFFBB',
  test10: '#CCFFCC',
  test11: '#DDFFDD',
};
const VariantMap: Record<StyleVariant, ColorSchema> = {
  dark: DarkColors,
  light: DefaultColors,
};
export const createColors = (variant: StyleVariant): CSSObject => {
  const Colors = VariantMap[variant];
  return {
    input: {
      backgroundColor: `${Colors.lum6}`,
      color: `${Colors.lum0}`,
    },
    select: {
      backgroundColor: `${Colors.lum6}`,
      color: `${Colors.lum0}`,
    },
    textArea: {
      backgroundColor: `${Colors.lum6}`,
      color: `${Colors.lum0}`,
    },
    body: {
      backgroundColor: Colors.lum6,
      color: Colors.lum0,
      font: '100%/1.25 "Lucida Grande",Arial,sans-serif,STHeiti,"Arial Unicode MS",MingLiu',
      margin: '20px',
      padding: '0px',
    },
    'input[type=text]': {
      font: '85% "Lucida Grande",Arial,sans-serif,STHeiti,"Arial Unicode MS",MingLiu',
      border: `1px solid ${Colors.lum0}`,
      padding: '3px',
    },
    p: {
      margin: '5px 0 5px 0',
      padding: 0,
    },
    h3: {
      margin: '0px 0 0px 0',
      padding: '0',
    },
    h4: {
      margin: '5px 0 10px 0',
      padding: '0',
    },
    'span.status0': {
      backgroundColor: Colors.str0,
      color: Colors.lum0,
    },
    'span.status1': {
      backgroundColor: Colors.str1,
      color: Colors.lum0,
    },
    'span.status2': {
      backgroundColor: Colors.str2,
      color: Colors.lum0,
    },
    'span.status3': {
      backgroundColor: Colors.str3,
      color: Colors.lum0,
    },
    'span.status4': {
      backgroundColor: Colors.str4,
      color: Colors.lum0,
    },
    'span.status5': {
      backgroundColor: Colors.test11,
      color: Colors.lum0,
    },
    'span.status99': {
      backgroundColor: Colors.lum5,
      borderBottom: `solid 2px ${Colors.test10}`,
      color: Colors.lum0,
    },
    'span.status98': {
      backgroundColor: Colors.lum5,
      borderBottom: `dashed 1px ${Colors.test10}`,
      color: Colors.lum0,
    },
    'span.mwsty': {
      marginRight: '2px',
      fontSize: '60%',
      fontWeight: 'bold',
      color: Colors.lum0,
      verticalAlign: 'top,',
    },
    'span.wsty': {
      marginRight: '2px',
      color: Colors.lum0,
    },
    'span.todosty': {
      backgroundColor: Colors.str3,
    },
    'span.doneoksty': {
      backgroundColor: Colors.str5,
    },
    'span.donewrongsty': {
      backgroundColor: Colors.str1,
    },
    'span.status5stat': {
      backgroundColor: Colors.test9,
      color: Colors.lum0,
    },
    textarea: {
      font: '85% "Lucida Grande",Arial,sans-serif,STHeiti,"Arial Unicode MS",MingLiu',
      border: `1px solid ${Colors.lum0}`,
      padding: '3px',
    },
    'table.tab1': {
      backgroundColor: Colors.lum5,
      marginBottom: '10px',
      marginTop: '10px',
      borderTop: `1px solid ${Colors.lum0}`,
      borderLeft: `1px solid ${Colors.lum0}`,
      width: '850px',
    },
    'table.tab2': {
      backgroundColor: Colors.lum5,
      marginBottom: '10px',
      marginTop: '10px',
      borderTop: `1px solid ${Colors.lum0}`,
      borderLeft: `1px solid ${Colors.lum0}`,
      width: '100%',
    },
    'table.tab3': {
      backgroundColor: Colors.lum5,
      marginBottom: '10px',
      marginTop: '10px',
      borderTop: `1px solid ${Colors.lum0}`,
      borderLeft: `1px solid ${Colors.lum0}`,
      width: 'auto',
    },
    'td.td1': {
      borderBottom: `1px solid ${Colors.lum0}`,
      borderRight: `1px solid ${Colors.lum0}`,
      verticalAlign: 'top,',
    },
    'td.td1bot': {
      borderBottom: `1px solid ${Colors.lum0}`,
      borderRight: `1px solid ${Colors.lum0}`,
      verticalAlign: 'bottom,',
    },
    'th.th1': {
      borderBottom: `1px solid ${Colors.lum0}`,
      borderRight: `1px solid ${Colors.lum0}`,
      backgroundColor: Colors.lum3,
      verticalAlign: 'top,',
    },
    'th.clickable': {
      cursor: 'pointer',
    },
    '.click': {
      cursor: 'pointer',
      color: Colors.wrong,
    },
    '.clickedit': {
      cursor: 'pointer',
    },
    '.hide': {
      display: 'none',
    },
    a: {
      textDecoration: 'none',
    },
    'a:link': {
      color: Colors.wrong,
    },
    'a:visited': {
      color: Colors.wrong,
    },
    'a:active': {
      color: Colors.wrong,
    },
    'a:focus': {
      color: Colors.wrong,
    },
    'a:hover': {
      color: Colors.wrong,
    },
    img: {
      border: '0pt none',
    },
    '.red': {
      color: Colors.highlightColor1,
      fontWeight: 'bold',
      backgroundColor: Colors.off0,
      textAlign: 'center',
      fontSize: '120%',
    },
    '.msgblue': {
      color: Colors.highlightColor0,
      fontWeight: 'bold',
      backgroundColor: Colors.off1,
      textAlign: 'center',
      fontSize: '120%',
    },
    '.red2': {
      color: Colors.highlightColor1,
      fontWeight: 'bold',
    },
    '.red3': {
      color: Colors.highlightColor1,
    },
    '.scorered': {
      fontWeight: 'bold',
      color: Colors.highlightColor1,
    },
    '.scoregreen': {
      color: Colors.right,
    },
    '.left': {
      textAlign: 'left',
    },
    '.right': {
      textAlign: 'right',
    },
    '.center': {
      textAlign: 'center',
    },
    '.bigger': {
      fontSize: '130%',
    },
    '.smaller': {
      fontSize: '80%',
    },
    '.backgray': {
      backgroundColor: Colors.lum3,
    },
    '.backlightyellow': {
      backgroundColor: Colors.off2,
    },
    '.small': {
      color: Colors.lum0,
      fontSize: '60%',
    },
    '.smallgray': {
      color: `${Colors.lum1}`,
      fontSize: '60%',
    },
    '.smallgray2': {
      color: `${Colors.lum1}`,
      fontSize: '80%',
    },
    '.smallgray3': {
      color: `${Colors.lum1}`,
      fontSize: '70%',
      width: '850px',
      marginBottom: '20px',
    },
    '#learnstatus': {
      color: Colors.lum0,
      fontSize: '120%',
      fontWeight: 'bold',
    },
    '#iknowall': {
      backgroundColor: Colors.str0,
      cursor: 'pointer',
      color: Colors.wrong,
      padding: '5px',
      border: `1px solid ${Colors.lum0}`,
      textAlign: 'center',
    },
    'img.lwtlogo': {
      marginRight: '15px',
      float: 'left',
    },
    'img.lwtlogoright': {
      marginLeft: '30px',
      float: 'right',
    },
    '.inline': {
      display: 'inline',
    },
    '.grayborder': {
      border: '1pt solid #808080',
    },
    '.graydotted': {
      marginTop: '30px',
      paddingTop: '5px',
      borderTop: `1px dotted ${Colors.lum0}`,
    },
    '#printoptions': {
      marginBottom: '15px',
      paddingBottom: '15px',
      borderBottom: `1px dotted ${Colors.lum0}`,
      lineHeight: 1.8,
      marginTop: '20px',
    },
    '.width50px': {
      width: '50px',
    },
    '.width99pc': {
      width: '99%',
    },
    '.width45pc': {
      width: '45%',
    },
    dd: {
      marginTop: '10pt',
    },
    dt: {
      marginTop: '10pt',
    },
    '.annterm': {
      fontWeight: 'bold',
      borderBottom: `2px solid ${Colors.lum0}`,
    },
    '.anntermruby': {
      fontWeight: 'normal',
      borderBottom: `2px solid ${Colors.lum0}`,
    },
    '.annrom': {
      color: Colors.lum2,
      fontSize: '60%',
      fontStyle: 'italic',
    },
    '.annromruby': {
      color: Colors.lum0,
      fontSize: '100%',
      fontStyle: 'italic',
    },
    '.annromrubysolo': {
      color: Colors.lum0,
      fontSize: '100%',
      fontStyle: 'normal',
    },
    '.anntrans': {
      color: Colors.test8,
      fontSize: '60%',
      fontStyle: 'normal',
    },
    '.anntransruby': {
      color: Colors.test8,
      fontSize: '100%',
      fontStyle: 'normal',
    },
    '.anntransruby2': {
      color: Colors.test7,
      fontSize: '125%',
      fontStyle: 'normal',
    },
    '#footer': {
      bottom: 0,
      position: 'absolute',
      width: '100%',
      height: '45px',
      lineHeight: '30px',
      background: Colors.lum3,
      fontSize: '14px',
      textAlign: 'center',
      borderTop: `1px solid ${Colors.lum0}`,
    },
    '.borderl': {
      borderLeft: `1px solid ${Colors.lum0}`,
      borderTop: `1px solid ${Colors.lum0}`,
      borderBottom: `1px solid ${Colors.lum0}`,
    },
    '.borderr': {
      borderTop: `1px solid ${Colors.lum0}`,
      borderBottom: `1px solid ${Colors.lum0}`,
      borderRight: `1px solid ${Colors.lum0}`,
    },
    '.uwordmarked': {
      fontWeight: 'bold',
      borderTop: `3px solid ${Colors.highlightColor1}`,
      borderBottom: `3px solid ${Colors.highlightColor1}`,
      borderRight: `3px solid ${Colors.highlightColor1}`,
      borderLeft: `3px solid ${Colors.highlightColor1}`,
    },
    '.kwordmarked': {
      fontWeight: 'bold',
      borderTop: `3px solid ${Colors.lum6}`,
      borderBottom: `3px solid ${Colors.lum6}`,
      borderLeft: `3px solid ${Colors.lum6}`,
      borderRight: `3px solid ${Colors.lum6}`,
    },
    '#termtags': {
      width: '340px',
      marginTop: '0px',
      marginBottom: '0px',
      marginLeft: '2px',
    },
    '#texttags': {
      width: '340px',
      marginTop: '0px',
      marginBottom: '0px',
      marginLeft: '2px',
    },
    '.editable_textarea': {
      display: 'inline',
    },
    '.nowrap': {
      whiteSpace: 'nowrap',
      marginLeft: '20pt',
    },
    '.borderleft': {
      borderLeft: `1px solid ${Colors.lum6}`,
      borderTop: `1px solid ${Colors.lum6}`,
      borderBottom: `1px solid ${Colors.lum6}`,
      backgroundColor: Colors.lum4,
    },
    '.bordermiddle': {
      borderTop: `1px solid ${Colors.lum6}`,
      borderBottom: `1px solid ${Colors.lum6}`,
      backgroundColor: Colors.lum4,
    },
    '.borderright': {
      borderRight: `1px solid ${Colors.lum6}`,
      borderTop: `1px solid ${Colors.lum6}`,
      borderBottom: `1px solid ${Colors.lum6}`,
      backgroundColor: Colors.lum4,
    },
    '.wizard': {
      margin: '20px 0 5px 0',
    },

    /**************************************************************
Additional styles for printing
***************************************************************/

    '@media print': {
      '.noprint': {
        display: 'none',
      },
      '#print': {
        fontSize: '75%',
      },
    },
    /*************************************************************
Split View
***************************************************************/
    '.Resizer': {
      position: 'relative',
      background: 'darkGray',
      '-moz-box-sizing': 'border-box',
      '-webkit-box-sizing': 'border-box',
      'box-sizing': 'border-box',
      '-moz-background-clip': 'padding',
      '-webkit-background-clip': 'padding',
      'background-clip': 'padding-box',
    },

    /*
  .Resizer:hover,
  .Resizer:active {
	-webkit-transition: all 2s ease,
	transition: all 2s ease,
  }*/

    '.Resizer.horizontal': {
      height: '20px',
      margin: '-5px 0',
      'border-top': '5px solid rgba(255, 255, 255, 0)',
      'border-bottom': '5px solid rgba(255, 255, 255, 0)',
      cursor: 'row-resize',
      width: '100%',
    },
    /*   
  .Resizer.horizontal:hover,
  .Resizer.Resizer.horizontal:active {
	border-top: 5px solid rgba(0, 0, 0, 0.5),
	border-bottom: 5px solid rgba(0, 0, 0, 0.5),
  }
   */
    '.Resizer.vertical': {
      width: '20px',
      margin: '0 -5px',
      'border-left': '5px solid rgba(255, 255, 255, 0)',
      'border-right': '5px solid rgba(255, 255, 255, 0)',
      cursor: 'col-resize',
    },

    /*
  .Resizer.vertical:hover,
  .Resizer.vertical:active {
	border-left: 5px solid rgba(0, 0, 0, 0.5),
	border-right: 5px solid rgba(0, 0, 0, 0.5),
  }
  */

    '.Resizer.disabled': {
      cursor: 'notAllowed',
    },
    // '.Resizer.disabled':hover,
    '.Resizer.disabled:active': {
      borderColor: 'transparent',
    },

    // '.Resizer::after',
    '.Resizer::before': {
      content: '',
      'border-left': '1px solid #333',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-100%)',
      right: 0,
      display: 'inline-block',
      height: '20px',
      margin: '0 2px',
    },
    ' .Resizer::before': {
      left: 0,
    },
  };
};
