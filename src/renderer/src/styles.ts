/**
 ************************************************************
 * "Learning with Texts" (LWT) is free and unencumbered software
 * released into the PUBLIC DOMAIN.
 *
 * Anyone is free to copy, modify, publish, use, compile, sell, or
 * distribute this software, either in source code form or as a
 * compiled binary, for any purpose, commercial or non-commercial,
 * and by any means.
 *
 * In jurisdictions that recognize copyright laws, the author or
 * authors of this software dedicate any and all copyright
 * interest in the software to the public domain. We make this
 * dedication for the benefit of the public at large and to the
 * detriment of our heirs and successors. We intend this
 * dedication to be an overt act of relinquishment in perpetuity
 * of all present and future rights to this software under
 * copyright law.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE
 * AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * For more information, please refer to [http://unlicense.org/].
 **************************************************************
 */

import { CSSObject } from 'styled-components';
import blueMonday from '../public/css/jplayer_skin/jplayer.blue.monday.jpg';
import pbarAni from '../public/css/jplayer_skin/pbar-ani.gif';
/**
 ************************************************************
 * Stylesheet
 **************************************************************
 */
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
export const VariantMap: Record<StyleVariant, ColorSchema> = {
  dark: DarkColors,
  light: DefaultColors,
};
export const createColors = (
  variant: StyleVariant
): Record<'body' | string, CSSObject> => {
  const Colors = VariantMap[variant];
  return {
    hr: {
      border: '1px solid rgb(128, 128, 128)',
    },
    input: {
      backgroundColor: `${Colors.lum6}`,
      color: `${Colors.lum0}`,
    },
    '.input': {
      backgroundColor: `${Colors.lum6}`,
      color: `${Colors.lum0}`,
      outline: `9px ${Colors.lum0}`,
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
    '.inputText': {
      cursor: 'text',
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
      backgroundColor: Colors.str5,
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
    '.a': {
      textDecoration: 'none',
      cursor: 'pointer',
      color: Colors.wrong,
    },
    '.a:focus': {
      color: Colors.str3,
    },
    '.a:hover': {
      color: Colors.str3,
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
      padding: '3px',
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
      borderLeft: `1px solid ${Colors.lum0}`,
      borderTop: `1px solid ${Colors.lum0}`,
      borderBottom: `1px solid ${Colors.lum0}`,
      backgroundColor: Colors.lum4,
    },
    '.bordermiddle': {
      borderTop: `1px solid ${Colors.lum0}`,
      borderBottom: `1px solid ${Colors.lum0}`,
      backgroundColor: Colors.lum4,
    },
    '.borderright': {
      borderRight: `1px solid ${Colors.lum0}`,
      borderTop: `1px solid ${Colors.lum0}`,
      borderBottom: `1px solid ${Colors.lum0}`,
      backgroundColor: Colors.lum4,
    },
    '.wizard': {
      margin: '20px 0 5px 0',
    },

    /**
     ************************************************************
     * Additional styles for printing
     **************************************************************
     */

    '@media print': {
      '.noprint': {
        display: 'none',
      },
      '#print': {
        fontSize: '75%',
      },
    },
    /**
     ***********************************************************
     * Split View
     **************************************************************
     */
    '.Resizer': {
      background: Colors.lum2,
      zIndex: 1,
      '-moz-box-sizing': 'border-box',
      '-webkit-box-sizing': 'border-box',
      boxSizing: 'border-box',
      '-moz-background-clip': 'padding',
      '-webkit-background-clip': 'padding',
      backgroundClip: 'padding-box',
    },
    '.Resizer:hover': {
      '-webkit-transition': 'all 2s ease',
      transition: 'all 2s ease',
    },
    '.Resizer.horizontal': {
      height: '11px',
      margin: '-5px 0',
      borderTop: `5px solid ${Colors.lum2}`,
      borderBottom: `5px solid ${Colors.lum2}`,
      cursor: 'row-resize',
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
    },
    '.Resizer.horizontal:hover': {
      borderTop: `5px solid ${Colors.lum2}`,
      borderBottom: `5px solid ${Colors.lum2}`,
    },
    '.Resizer.vertical': {
      width: '11px',
      margin: '0 -5px',
      borderLeft: `5px solid ${Colors.lum2}`,
      borderRight: `5px solid ${Colors.lum2}`,
      cursor: 'col-resize',
    },
    '.Resizer.vertical:hover': {
      borderLeft: `5px solid ${Colors.lum2}`,
      borderRight: `5px solid ${Colors.lum2}`,
    },
    '.Resizer.disabled': {
      cursor: 'not-allowed',
    },
    '.Resizer.disabled:hover': {
      borderColor: 'transparent',
    },

    /**
     ***********************************************************
     * Tagger
     **************************************************************
     */

    'ul.tagit': {
      padding: '1px 5px',
      overflow: 'auto',
      marginLeft: 'inherit' /* usually we don't want the regular ul margins. */,
      marginRight: 'inherit',
    },

    'ul.tagit li': {
      display: 'block',
      float: 'left',
      margin: '2px 5px 2px 0',
    },
    'ul.tagit li.tagit-choice ': {
      position: 'relative',
      lineHeight: 'inherit',
    },

    'ul.tagit li.tagit-choice-read-only': {
      padding: '.2em .5em .2em .5em',
    },

    'ul.tagit li.tagit-choice-editable': {
      padding: '.2em 18px .2em .5em',
    },

    'ul.tagit li.tagit-new': {
      padding: '.25em 4px .25em 0',
    },

    'ul.tagit li.tagit-choice a.tagit-label': {
      cursor: 'pointer',
      textDecoration: 'none',
    },

    'ul.tagit li.tagit-choice .tagit-close': {
      cursor: 'pointer',
      position: 'absolute',
      right: '.1em',
      top: '50%',
      marginTop: '-8px',
    },

    /* used for some custom themes that don't need image icons */

    // 'ul.tagit li.tagit-choice .tagit-close .text-icon': {
    //   display: 'none',
    // },

    'ul.tagit li.tagit-choice input': {
      display: 'block',
      float: 'left',
      margin: '2px 5px 2px 0',
    },

    'ul.tagit input[type="text"]': {
      '-moz-box-sizing': 'border-box',
      '-webkit-box-sizing': 'border-box',
      boxSizing: 'border-box',
      border: 'none',
      margin: 0,
      padding: 0,
      width: 'inherit',
      outline: 'none',
    },

    '.ui-state-default .ui-widget-content .ui-state-default .ui-widget-header .ui-state-default':
      {
        border: `1px solid #${Colors.lum3}`,
        backgroundColor: `#e6e6e6`,
        fontWeight: 'normal',
        color: `#${Colors.lum5}`,
      },

    ///////

    noshade: {
      height: '1px',
      border: 'none',
      color: '#333',
      backgroundColor: '#333',
    },

    /**
     ***********************************************************
     * Tagger
     **************************************************************
     */

    /*
     * Skin for jPlayer Plugin (jQuery JavaScript Library)
     * http://www.happyworm.com/jquery/jplayer
     *
     * Skin Name: Blue Monday (Modified for LWT)
     *
     * Copyright (c) 2010 Happyworm Ltd
     * Dual licensed under the MIT and GPL licenses.
     *  - http://www.opensource.org/licenses/mit-license.php
     *  - http://www.gnu.org/copyleft/gpl.html
     *
     * Author: Silvia Benvenuti
     * Skin Version: 3.0 (jPlayer 2.0.0)
     * Date: 20th December 2010
     * Modified for LWT
     */

    'div.jp-audio': {
      fontSize: '1.25em',
      fontFamily: 'Verdana, Arial, sans-serif',
      lineHeight: 1.6,
      color: Colors.lum1,
      width: '307px',
    },
    'div.jp-interface': {
      position: 'relative',
      backgroundColor: `${Colors.lum4}`,
      width: '100%',
      border: `1px solid ${Colors.lum4}`,
    },
    'div.jp-audio div.jp-type-single div.jp-interface': {
      height: '50px',
      borderBottom: 'none',
    },
    'div.jp-audio div.jp-type-playlist div.jp-interface': {
      height: '50px',
    },
    'div.jp-interface ul.jp-controls': {
      listStyleType: 'none',
      padding: 0,
      margin: 0,
    },
    'div.jp-interface ul.jp-controls li': {
      display: 'inline',
    },
    'div.jp-interface ul.jp-controls a': {
      position: 'absolute',
      overflow: 'hidden',
      textIndent: '-9999px',
    },
    'a.jp-play, a.jp-pause': {
      width: '40px',
      height: '40px',
      zIndex: 1,
    },
    'div.jp-audio div.jp-type-single a.jp-play, div.jp-audio div.jp-type-single a.jp-pause':
      {
        top: '5px',
        left: '7px',
      },
    'div.jp-audio div.jp-type-playlist a.jp-play, div.jp-audio div.jp-type-playlist a.jp-pause':
      {
        top: '5px',
        left: '10px',
      },
    'a.jp-play': {
      background: `url(${blueMonday}) 0 0 no-repeat`,
    },
    'a.jp-play:hover': {
      background: `url(${blueMonday}) -41px 0 no-repeat`,
    },
    'a.jp-pause': {
      background: `url(${blueMonday}) 0 -42px no-repeat`,
    },
    'a.jp-pause:hover': {
      background: `url(${blueMonday}) -41px -42px no-repeat`,
    },
    'div.jp-audio div.jp-type-single a.jp-stop': {
      top: '11px',
      left: '52px',
    },
    'div.jp-audio div.jp-type-playlist a.jp-stop': {
      top: '26px',
      left: '88px',
    },
    'a.jp-stop': {
      background: `url(${blueMonday}) 0 -83px no-repeat`,
      width: '28px',
      height: '28px',
      zIndex: 1,
    },
    'a.jp-stop:hover': {
      background: `url(${blueMonday}) -29px -83px no-repeat`,
    },
    'div.jp-audio div.jp-type-playlist a.jp-previous': {
      left: '20px',
      top: '26px',
    },
    'a.jp-previous': {
      background: `url(${blueMonday}) 0 -112px no-repeat`,
      width: '28px',
      height: '28px',
    },
    'a.jp-previous:hover': {
      background: `url(${blueMonday}) -29px -112px no-repeat`,
    },
    'div.jp-audio div.jp-type-playlist a.jp-next': {
      left: '88px',
      top: '26px',
    },
    'a.jp-next': {
      background: `url(${blueMonday}) 0 -141px no-repeat`,
      width: '28px',
      height: '28px',
    },
    'a.jp-next:hover': {
      background: `url(${blueMonday}) -29px -141px no-repeat`,
    },
    'div.jp-progress': {
      position: 'absolute',
      overflow: 'hidden',
      backgroundColor: Colors.lum3,
    },
    'div.jp-audio div.jp-type-single div.jp-progress': {
      top: '17px',
      left: '90px',
      width: '122px',
      height: '15px',
    },
    'div.jp-audio div.jp-type-playlist div.jp-progress': {
      top: '17px',
      left: '124px',
      width: '122px',
      height: '15px',
    },
    'div.jp-seek-bar': {
      background: `url(${blueMonday}) 0 -202px repeat-x`,
      // width: '0px',
      width: '100%',
      height: '100%',
      cursor: 'pointer',
    },
    'div.jp-play-bar': {
      background: `url(${blueMonday}) 0 -218px repeat-x `,
      height: '100%',
    },
    'div.jp-seeking-bg': {
      background: `url(${pbarAni})`,
    },
    'a.jp-mute, a.jp-unmute': {
      width: '18px',
      height: '15px',
    },
    'div.jp-audio div.jp-type-single a.jp-mute, div.jp-audio div.jp-type-single a.jp-unmute':
      {
        top: '17px',
        left: '224px',
      },
    'div.jp-audio div.jp-type-playlist a.jp-mute, div.jp-audio div.jp-type-playlist a.jp-unmute':
      {
        top: '17px',
        left: '246px',
      },
    'a.jp-mute': {
      background: `url(${blueMonday}) 0 -186px no-repeat`,
    },
    'a.jp-mute:hover': {
      background: `url(${blueMonday}) -19px -170px no-repeat`,
    },
    'a.jp-unmute': {
      background: `url(${blueMonday}) 0 -170px no-repeat`,
    },
    'a.jp-unmute:hover': {
      background: `url(${blueMonday}) -19px -186px no-repeat`,
    },
    'div.jp-volume-bar': {
      position: 'absolute',
      overflow: 'hidden',
      background: `url(${blueMonday}) 0 -202px repeat-x`,
      width: '46px',
      height: '10px',
      cursor: 'pointer',
    },
    'div.jp-audio div.jp-type-single div.jp-volume-bar': {
      top: '20px',
      left: '252px',
    },
    'div.jp-audio div.jp-type-playlist div.jp-volume-bar': {
      top: '20px',
      left: '274px',
    },
    'div.jp-volume-bar-value': {
      background: `url(${blueMonday}) 0 -218px repeat-x`,
      width: '0px',
      height: '10px',
    },
    'div.jp-current-time, div.jp-duration': {
      position: 'absolute',
      fontSize: '.64em',
      fontStyle: 'oblique',
    },
    'div.jp-duration': {
      textAlign: 'right',
    },
    'div.jp-audio div.jp-type-single div.jp-current-time, div.jp-audio div.jp-type-single div.jp-duration':
      {
        top: '29px',
        left: '90px',
        width: '122px',
      },
    'div.jp-audio div.jp-type-playlist div.jp-current-time, div.jp-audio div.jp-type-playlist div.jp-duration':
      {
        top: '29px',
        left: '124px',
        width: '122px',
      },
    'div.jp-jplayer': {
      width: '0px',
      height: '0px',
      backgroundColor: Colors.lum0,
    },
  };
};
