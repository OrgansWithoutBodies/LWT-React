import { NumericalStrengthPotentiallyCompound } from '../data/data.query';
import { SentencesID, TextItemsID } from '../data/validators';
import { SetBoolHandler } from '../pages/IO/CheckForm';
import { NumericalStrength } from '../pages/StrengthMap';
import { pluralize } from '../pages/TermTag/pluralize';
import {
  Language,
  LanguageNoID,
  Sentence,
  Text,
  TextItem,
  Word,
} from './parseMySqlDump';
import { DateDiff } from './time';

/**
 *
 * @param str
 */
export function byteSizeOfString(str: string): number {
  return new Blob([str]).size;
}

export function confirmDelete(): boolean {
  return window.confirm('CONFIRM\n\nAre you sure you want to delete?');
}

// <?php

// /**************************************************************
// "Learning with Texts" (LWT) is free and unencumbered software
// released into the PUBLIC DOMAIN.
// Anyone is free to copy, modify, publish, use, compile, sell, or
// distribute this software, either in source code form or as a
// compiled binary, for any purpose, commercial or non-commercial,
// and by any means.
// In jurisdictions that recognize copyright laws, the author or
// authors of this software dedicate any and all copyright
// interest in the software to the public domain. We make this
// dedication for the benefit of the public at large and to the
// detriment of our heirs and successors. We intend this
// dedication to be an overt act of relinquishment in perpetuity
// of all present and future rights to this software under
// copyright law.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
// WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE
// AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS BE LIABLE
// FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
// For more information, please refer to [http://unlicense.org/].
// ***************************************************************/

// /**************************************************************
// PHP Utility Functions
// Plus (at end): Database Connect, .. Select, .. Updates
// ***************************************************************/

// // -------------------------------------------------------------

// function get_version()
// {
// 	global debug;
// 	return '2.0.3 (February 15 2022)' .
// 		(debug ? ' <span class="red">DEBUG</span>' : '');
// }

// // -------------------------------------------------------------

// function get_version_number()
// {
// 	r = 'v';
// 	v = get_version();
// 	pos = strpos(v, ' ', 0);
// 	if (pos === false)
// 		my_die('Wrong version: ' . v);
// 	vn = preg_split("/[.]/", substr(v, 0, pos));
// 	if (count(vn) < 3)
// 		my_die('Wrong version: ' . v);
// 	for (i = 0; i < 3; i++)
// 		r += substr('000' . vn[i], -3);
// 	return r; // 'vxxxyyyzzz' wenn version = x.y.z
// }

// // -------------------------------------------------------------

// function my_die(text)
// {
// 	echo '</select></p></div><div style="padding: 1em; color:red; font-size:120%; background-color:#CEECF5;">' .
// 		'<p><b>Fatal Error:</b> ' .
// 		tohtml(text) .
// 		"</p></div><hr /><pre>Backtrace:\n\n";
// 	debug_print_backtrace();
// 	echo '</pre><hr />';
// 	die('</body></html>');
// }

// // -------------------------------------------------------------

// function get_tags(refresh = 0)
// {
// 	global tbpref;
// 	if (isset($_SESSION['TAGS'])) {
// 		if (is_array($_SESSION['TAGS'])) {
// 			if (isset($_SESSION['TBPREF_TAGS'])) {
// 				if ($_SESSION['TBPREF_TAGS'] === tbpref . url_base()) {
// 					if (refresh === 0)
// 						return $_SESSION['TAGS'];
// 				}
// 			}
// 		}
// 	}
// 	tags = array();
// 	sql = 'select TgText from ' . tbpref . 'tags order by TgText';
// 	res = do_mysqli_query(sql);
// 	while (record = mysqli_fetch_assoc(res)) {
// 		tags[] = record["TgText"];
// 	}
// 	mysqli_free_result(res);
// 	$_SESSION['TAGS'] = tags;
// 	$_SESSION['TBPREF_TAGS'] = tbpref . url_base();
// 	return $_SESSION['TAGS'];
// }

// // -------------------------------------------------------------

// function get_texttags(refresh = 0)
// {
// 	global tbpref;
// 	if (isset($_SESSION['TEXTTAGS'])) {
// 		if (is_array($_SESSION['TEXTTAGS'])) {
// 			if (isset($_SESSION['TBPREF_TEXTTAGS'])) {
// 				if ($_SESSION['TBPREF_TEXTTAGS'] === tbpref . url_base()) {
// 					if (refresh === 0)
// 						return $_SESSION['TEXTTAGS'];
// 				}
// 			}
// 		}
// 	}
// 	tags = array();
// 	sql = 'select T2Text from ' . tbpref . 'tags2 order by T2Text';
// 	res = do_mysqli_query(sql);
// 	while (record = mysqli_fetch_assoc(res)) {
// 		tags[] = record["T2Text"];
// 	}
// 	mysqli_free_result(res);
// 	$_SESSION['TEXTTAGS'] = tags;
// 	$_SESSION['TBPREF_TEXTTAGS'] = tbpref . url_base();
// 	return $_SESSION['TEXTTAGS'];
// }

// // -------------------------------------------------------------

// function getTextTitle(textid)
// {
// 	global tbpref;
// 	text = get_first_value("select TxTitle as value from " . tbpref . "texts where TxID=" . textid);
// 	if (!isset(text))
// 		text = "?";
// 	return text;
// }

// // -------------------------------------------------------------

// function get_tag_selectoptions(v, l)
// {
// 	global tbpref;
// 	if (!isset(v))
// 		v = '';
// 	r = "<option value=""" . get_selected(v, '');
// 	r += ">[Filter off]</option>";
// 	if (l === '')
// 		sql = "select TgID, TgText from " . tbpref . "words, " . tbpref . "tags, " . tbpref . "wordtags where TgID = WtTgID and WtWoID = WoID group by TgID order by TgText";
// 	else
// 		sql = "select TgID, TgText from " . tbpref . "words, " . tbpref . "tags, " . tbpref . "wordtags where TgID = WtTgID and WtWoID = WoID and WoLgID = " . l . " group by TgID order by TgText";
// 	res = do_mysqli_query(sql);
// 	cnt = 0;
// 	while (record = mysqli_fetch_assoc(res)) {
// 		d = record["TgText"];
// 		cnt++;
// 		r += "<option value="" . record["TgID"] . """ . get_selected(v, record["TgID"]) . ">" . tohtml(d) . "</option>";
// 	}
// 	mysqli_free_result(res);
// 	if (cnt > 0) {
// 		r += "<option disabled="disabled">--------</option>";
// 		r += "<option value="-1"" . get_selected(v, -1) . ">UNTAGGED</option>";
// 	}
// 	return r;
// }

// // -------------------------------------------------------------

// function get_texttag_selectoptions(v, l)
// {
// 	global tbpref;
// 	if (!isset(v))
// 		v = '';
// 	r = "<option value=""" . get_selected(v, '');
// 	r += ">[Filter off]</option>";
// 	if (l === '')
// 		sql = "select T2ID, T2Text from " . tbpref . "texts, " . tbpref . "tags2, " . tbpref . "texttags where T2ID = TtT2ID and TtTxID = TxID group by T2ID order by T2Text";
// 	else
// 		sql = "select T2ID, T2Text from " . tbpref . "texts, " . tbpref . "tags2, " . tbpref . "texttags where T2ID = TtT2ID and TtTxID = TxID and TxLgID = " . l . " group by T2ID order by T2Text";
// 	res = do_mysqli_query(sql);
// 	cnt = 0;
// 	while (record = mysqli_fetch_assoc(res)) {
// 		d = record["T2Text"];
// 		cnt++;
// 		r += "<option value="" . record["T2ID"] . """ . get_selected(v, record["T2ID"]) . ">" . tohtml(d) . "</option>";
// 	}
// 	mysqli_free_result(res);
// 	if (cnt > 0) {
// 		r += "<option disabled="disabled">--------</option>";
// 		r += "<option value="-1"" . get_selected(v, -1) . ">UNTAGGED</option>";
// 	}
// 	return r;
// }

// // -------------------------------------------------------------

// TODO
/**
 *
 * @param v
 * @param l
 */
export function get_archivedtexttag_selectoptions(v: string, l: string) {
  console.log(v, l);
  return '';
}
// function get_archivedtexttag_selectoptions(v, l)
// {
// 	global tbpref;
// 	if (!isset(v))
// 		v = '';
// 	r = "<option value=""" . get_selected(v, '');
// 	r += ">[Filter off]</option>";
// 	if (l === '')
// 		sql = "select T2ID, T2Text from " . tbpref . "archivedtexts, " . tbpref . "tags2, " . tbpref . "archtexttags where T2ID = AgT2ID and AgAtID = AtID group by T2ID order by T2Text";
// 	else
// 		sql = "select T2ID, T2Text from " . tbpref . "archivedtexts, " . tbpref . "tags2, " . tbpref . "archtexttags where T2ID = AgT2ID and AgAtID = AtID and AtLgID = " . l . " group by T2ID order by T2Text";
// 	res = do_mysqli_query(sql);
// 	cnt = 0;
// 	while (record = mysqli_fetch_assoc(res)) {
// 		d = record["T2Text"];
// 		cnt++;
// 		r += "<option value="" . record["T2ID"] . """ . get_selected(v, record["T2ID"]) . ">" . tohtml(d) . "</option>";
// 	}
// 	mysqli_free_result(res);
// 	if (cnt > 0) {
// 		r += "<option disabled="disabled">--------</option>";
// 		r += "<option value="-1"" . get_selected(v, -1) . ">UNTAGGED</option>";
// 	}
// 	return r;
// }
// // -------------------------------------------------------------
// function saveWordTags(wid)
// {
// 	global tbpref;
// 	runsql("DELETE from " . tbpref . "wordtags WHERE WtWoID =" . wid, '');
// 	if (isset($_REQUEST['TermTags'])) {
// 		if (is_array($_REQUEST['TermTags'])) {
// 			if (isset($_REQUEST['TermTags']['TagList'])) {
// 				if (is_array($_REQUEST['TermTags']['TagList'])) {
// 					cnt = count($_REQUEST['TermTags']['TagList']);
// 					if (cnt > 0) {
// 						for (i = 0; i < cnt; i++) {
// 							tag = $_REQUEST['TermTags']['TagList'][i];
// 							if (!in_array(tag, $_SESSION['TAGS'])) {
// 								runsql('insert into ' . tbpref . 'tags (TgText) values(' .
// 									(tag) . ')', "");
// 							}
// 							runsql('insert into ' . tbpref . 'wordtags (WtWoID, WtTgID) select ' . wid . ', TgID from ' . tbpref . 'tags where TgText = ' . (tag), "");
// 						}
// 						get_tags(refresh = 1); // refresh tags cache
// 					}
// 				}
// 			}
// 		}
// 	}
// }
// // -------------------------------------------------------------
// function saveTextTags(tid)
// {
// 	global tbpref;
// 	runsql("DELETE from " . tbpref . "texttags WHERE TtTxID =" . tid, '');
// 	if (isset($_REQUEST['TextTags'])) {
// 		if (is_array($_REQUEST['TextTags'])) {
// 			if (isset($_REQUEST['TextTags']['TagList'])) {
// 				if (is_array($_REQUEST['TextTags']['TagList'])) {
// 					cnt = count($_REQUEST['TextTags']['TagList']);
// 					if (cnt > 0) {
// 						for (i = 0; i < cnt; i++) {
// 							tag = $_REQUEST['TextTags']['TagList'][i];
// 							if (!in_array(tag, $_SESSION['TEXTTAGS'])) {
// 								runsql('insert into ' . tbpref . 'tags2 (T2Text) values(' .
// 									(tag) . ')', "");
// 							}
// 							runsql('insert into ' . tbpref . 'texttags (TtTxID, TtT2ID) select ' . tid . ', T2ID from ' . tbpref . 'tags2 where T2Text = ' . (tag), "");
// 						}
// 						get_texttags(refresh = 1); // refresh tags cache
// 					}
// 				}
// 			}
// 		}
// 	}
// }
// // -------------------------------------------------------------
// function saveArchivedTextTags(tid)
// {
// 	global tbpref;
// 	runsql("DELETE from " . tbpref . "archtexttags WHERE AgAtID =" . tid, '');
// 	if (isset($_REQUEST['TextTags'])) {
// 		if (is_array($_REQUEST['TextTags'])) {
// 			if (isset($_REQUEST['TextTags']['TagList'])) {
// 				if (is_array($_REQUEST['TextTags']['TagList'])) {
// 					cnt = count($_REQUEST['TextTags']['TagList']);
// 					if (cnt > 0) {
// 						for (i = 0; i < cnt; i++) {
// 							tag = $_REQUEST['TextTags']['TagList'][i];
// 							if (!in_array(tag, $_SESSION['TEXTTAGS'])) {
// 								runsql('insert into ' . tbpref . 'tags2 (T2Text) values(' .
// 									(tag) . ')', "");
// 							}
// 							runsql('insert into ' . tbpref . 'archtexttags (AgAtID, AgT2ID) select ' . tid . ', T2ID from ' . tbpref . 'tags2 where T2Text = ' . (tag), "");
// 						}
// 						get_texttags(refresh = 1); // refresh tags cache
// 					}
// 				}
// 			}
// 		}
// 	}
// }
// // -------------------------------------------------------------
// function getWordTags(wid)
// {
// 	global tbpref;
// 	r = '<ul id="termtags"
// TODO tagit
// >';
// 	if (wid > 0) {
// 		sql = 'select TgText from ' . tbpref . 'wordtags, ' . tbpref . 'tags where TgID = WtTgID and WtWoID = ' . wid . ' order by TgText';
// 		res = do_mysqli_query(sql);
// 		while (record = mysqli_fetch_assoc(res)) {
// 			r += '<li>' . tohtml(record["TgText"]) . '</li>';
// 		}
// 		mysqli_free_result(res);
// 	}
// 	r += '</ul>';
// 	return r;
// }
// // -------------------------------------------------------------
// function getTextTags(tid)
// {
// 	global tbpref;
// 	r = '<ul id="texttags"
// TODO tagit
// >';
// 	if (tid > 0) {
// 		sql = 'select T2Text from ' . tbpref . 'texttags, ' . tbpref . 'tags2 where T2ID = TtT2ID and TtTxID = ' . tid . ' order by T2Text';
// 		res = do_mysqli_query(sql);
// 		while (record = mysqli_fetch_assoc(res)) {
// 			r += '<li>' . tohtml(record["T2Text"]) . '</li>';
// 		}
// 		mysqli_free_result(res);
// 	}
// 	r += '</ul>';
// 	return r;
// }
// // -------------------------------------------------------------
// TODO used in chging archived texts
// function getArchivedTextTags(tid)
// {
// 	global tbpref;
// 	r = '<ul id="texttags"
// TODO tagit
// >';
// 	if (tid > 0) {
// 		sql = 'select T2Text from ' . tbpref . 'archtexttags, ' . tbpref . 'tags2 where T2ID = AgT2ID and AgAtID = ' . tid . ' order by T2Text';
// 		res = do_mysqli_query(sql);
// 		while (record = mysqli_fetch_assoc(res)) {
// 			r += '<li>' . tohtml(record["T2Text"]) . '</li>';
// 		}
// 		mysqli_free_result(res);
// 	}
// 	r += '</ul>';
// 	return r;
// }
// // -------------------------------------------------------------
// function addtaglist(item, list)
// {
// 	global tbpref;
// 	tagid = get_first_value('select TgID as value from ' . tbpref . 'tags where TgText = ' . (item));
// 	if (!isset(tagid)) {
// 		runsql('insert into ' . tbpref . 'tags (TgText) values(' . (item) . ')', "");
// 		tagid = get_first_value('select TgID as value from ' . tbpref . 'tags where TgText = ' . (item));
// 	}
// 	sql = 'select WoID from ' . tbpref . 'words where WoID in ' . list;
// 	res = do_mysqli_query(sql);
// 	cnt = 0;
// 	while (record = mysqli_fetch_assoc(res)) {
// 		cnt += runsql('insert ignore into ' . tbpref . 'wordtags (WtWoID, WtTgID) values(' . record['WoID'] . ', ' . tagid . ')', "");
// 	}
// 	mysqli_free_result(res);
// 	get_tags(refresh = 1);
// 	return "Tag added in cnt Terms";
// }
// // -------------------------------------------------------------
// function addarchtexttaglist(item, list)
// {
// 	global tbpref;
// 	tagid = get_first_value('select T2ID as value from ' . tbpref . 'tags2 where T2Text = ' . (item));
// 	if (!isset(tagid)) {
// 		runsql('insert into ' . tbpref . 'tags2 (T2Text) values(' . (item) . ')', "");
// 		tagid = get_first_value('select T2ID as value from ' . tbpref . 'tags2 where T2Text = ' . (item));
// 	}
// 	sql = 'select AtID from ' . tbpref . 'archivedtexts where AtID in ' . list;
// 	res = do_mysqli_query(sql);
// 	cnt = 0;
// 	while (record = mysqli_fetch_assoc(res)) {
// 		cnt += runsql('insert ignore into ' . tbpref . 'archtexttags (AgAtID, AgT2ID) values(' . record['AtID'] . ', ' . tagid . ')', "");
// 	}
// 	mysqli_free_result(res);
// 	get_texttags(refresh = 1);
// 	return "Tag added in cnt Texts";
// }
// // -------------------------------------------------------------
// function addtexttaglist(item, list)
// {
// 	global tbpref;
// 	tagid = get_first_value('select T2ID as value from ' . tbpref . 'tags2 where T2Text = ' . (item));
// 	if (!isset(tagid)) {
// 		runsql('insert into ' . tbpref . 'tags2 (T2Text) values(' . (item) . ')', "");
// 		tagid = get_first_value('select T2ID as value from ' . tbpref . 'tags2 where T2Text = ' . (item));
// 	}
// 	sql = 'select TxID from ' . tbpref . 'texts where TxID in ' . list;
// 	res = do_mysqli_query(sql);
// 	cnt = 0;
// 	while (record = mysqli_fetch_assoc(res)) {
// 		cnt += runsql('insert ignore into ' . tbpref . 'texttags (TtTxID, TtT2ID) values(' . record['TxID'] . ', ' . tagid . ')', "");
// 	}
// 	mysqli_free_result(res);
// 	get_texttags(refresh = 1);
// 	return "Tag added in cnt Texts";
// }
// // -------------------------------------------------------------
// function removetaglist(item, list)
// {
// 	global tbpref;
// 	tagid = get_first_value('select TgID as value from ' . tbpref . 'tags where TgText = ' . (item));
// 	if (!isset(tagid))
// 		return "Tag " . item . " not found";
// 	sql = 'select WoID from ' . tbpref . 'words where WoID in ' . list;
// 	res = do_mysqli_query(sql);
// 	cnt = 0;
// 	while (record = mysqli_fetch_assoc(res)) {
// 		cnt++;
// 		runsql('delete from ' . tbpref . 'wordtags where WtWoID = ' . record['WoID'] . ' and WtTgID = ' . tagid, "");
// 	}
// 	mysqli_free_result(res);
// 	return "Tag removed in cnt Terms";
// }
// // -------------------------------------------------------------
// function removearchtexttaglist(item, list)
// {
// 	global tbpref;
// 	tagid = get_first_value('select T2ID as value from ' . tbpref . 'tags2 where T2Text = ' . (item));
// 	if (!isset(tagid))
// 		return "Tag " . item . " not found";
// 	sql = 'select AtID from ' . tbpref . 'archivedtexts where AtID in ' . list;
// 	res = do_mysqli_query(sql);
// 	cnt = 0;
// 	while (record = mysqli_fetch_assoc(res)) {
// 		cnt++;
// 		runsql('delete from ' . tbpref . 'archtexttags where AgAtID = ' . record['AtID'] . ' and AgT2ID = ' . tagid, "");
// 	}
// 	mysqli_free_result(res);
// 	return "Tag removed in cnt Texts";
// }
// // -------------------------------------------------------------
// function removetexttaglist(item, list)
// {
// 	global tbpref;
// 	tagid = get_first_value('select T2ID as value from ' . tbpref . 'tags2 where T2Text = ' . (item));
// 	if (!isset(tagid))
// 		return "Tag " . item . " not found";
// 	sql = 'select TxID from ' . tbpref . 'texts where TxID in ' . list;
// 	res = do_mysqli_query(sql);
// 	cnt = 0;
// 	while (record = mysqli_fetch_assoc(res)) {
// 		cnt++;
// 		runsql('delete from ' . tbpref . 'texttags where TtTxID = ' . record['TxID'] . ' and TtT2ID = ' . tagid, "");
// 	}
// 	mysqli_free_result(res);
// 	return "Tag removed in cnt Texts";
// }
// // -------------------------------------------------------------
// function framesetheader(title)
// {
// 	@header('Expires: Wed, 11 Jan 1984 05:00:00 GMT');
// 	@header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');
// 	@header('Cache-Control: no-cache, must-revalidate, max-age=0');
// 	@header('Pragma: no-cache');
// 	?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN"
// 		"http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
// 	<html xmlns="http://www.w3.org/1999/xhtml">
// 	<head>
// 		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
// 	<!-- ***********************************************************
// 	"Learning with Texts" (LWT) is free and unencumbered software
// 	released into the PUBLIC DOMAIN.
// 	Anyone is free to copy, modify, publish, use, compile, sell, or
// 	distribute this software, either in source code form or as a
// 	compiled binary, for any purpose, commercial or non-commercial,
// 	and by any means.
// 	In jurisdictions that recognize copyright laws, the author or
// 	authors of this software dedicate any and all copyright
// 	interest in the software to the public domain. We make this
// 	dedication for the benefit of the public at large and to the
// 	detriment of our heirs and successors. We intend this
// 	dedication to be an overt act of relinquishment in perpetuity
// 	of all present and future rights to this software under
// 	copyright law.
// 	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// 	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
// 	WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE
// 	AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS BE LIABLE
// 	FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// 	OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// 	CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// 	THE SOFTWARE.
// 	For more information, please refer to [http://unlicense.org/].
// 	************************************************************ -->
// 		<title>LWT :: <?php echo tohtml(title); ?></title>
// 	</head>
// <?php
// }
// // -------------------------------------------------------------
// function pagestart_nobody(titletext, addcss = '')
// {
// 	global debug;
// 	global tbpref;
// 	@header('Expires: Wed, 11 Jan 1984 05:00:00 GMT');
// 	@header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');
// 	@header('Cache-Control: no-cache, must-revalidate, max-age=0');
// 	@header('Pragma: no-cache');
// 	?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
// 		"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
// 	<html xmlns="http://www.w3.org/1999/xhtml">
// 	<head>
// 		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
// 	<!-- ***********************************************************
// 	"Learning with Texts" (LWT) is free and unencumbered software
// 	released into the PUBLIC DOMAIN.
// 	Anyone is free to copy, modify, publish, use, compile, sell, or
// 	distribute this software, either in source code form or as a
// 	compiled binary, for any purpose, commercial or non-commercial,
// 	and by any means.
// 	In jurisdictions that recognize copyright laws, the author or
// 	authors of this software dedicate any and all copyright
// 	interest in the software to the public domain. We make this
// 	dedication for the benefit of the public at large and to the
// 	detriment of our heirs and successors. We intend this
// 	dedication to be an overt act of relinquishment in perpetuity
// 	of all present and future rights to this software under
// 	copyright law.
// 	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// 	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
// 	WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE
// 	AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS BE LIABLE
// 	FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// 	OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// 	CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// 	THE SOFTWARE.
// 	For more information, please refer to [http://unlicense.org/].
// 	************************************************************ -->
// 		<meta name="viewport" content="width=900" />
// 		<link rel="apple-touch-icon" href="img/apple-touch-icon-57x57.png" />
// 		<link rel="apple-touch-icon" sizes="72x72" href="img/apple-touch-icon-72x72.png" />
// 		<link rel="apple-touch-icon" sizes="114x114" href="img/apple-touch-icon-114x114.png" />
// 		<link rel="apple-touch-startup-image" href="img/apple-touch-startup.png">
// 		<meta name="apple-mobile-web-app-capable" content="yes" />
// 		<link rel="stylesheet" type="text/css" href="css/jquery-ui.css">
// 		<link rel="stylesheet" type="text/css" href="css/jquery.tagit.css">
// 		<link rel="stylesheet" type="text/css" href="css/styles.css">
// 		<style type="text/css">
// 		<?php echo addcss . "\n"; ?>
// 		</style>
// 		<script type="text/javascript" src="js/jquery.js" charset="utf-8"></script>
// 		<script type="text/javascript" src="js/jquery.scrollTo.min.js" charset="utf-8"></script>
// 		<script type="text/javascript" src="js/jquery-ui.min.js"  charset="utf-8"></script>
// 		<script type="text/javascript" src="js/tag-it.js" charset="utf-8"></script>
// 		<script type="text/javascript" src="js/jquery.jeditable.mini.js" charset="utf-8"></script>
// 		<script type="text/javascript" src="js/sorttable/sorttable.js" charset="utf-8"></script>
// 		<script type="text/javascript" src="js/countuptimer.js" charset="utf-8"></script>
// 		<script type="text/javascript" src="js/overlib/overlib_mini.js" charset="utf-8"></script>
// 		<!-- URLBASE : "<?php echo tohtml(url_base()); ?>" -->
// 		<!-- TBPREF  : "<?php echo tohtml(tbpref); ?>" -->
// 		<script type="text/javascript">
// 		//<![CDATA[
// 		<?php echo "const STATUSES = " . json_encode(get_statuses()) . ";\n"; ?>
// 		<?php echo "const TAGS = " . json_encode(get_tags()) . ";\n"; ?>
// 		<?php echo "const TEXTTAGS = " . json_encode(get_texttags()) . ";\n"; ?>
// 		//]]>
// 		</script>
// 		<script type="text/javascript" src="js/pgm.js" charset="utf-8"></script>
// 		<script type="text/javascript" src="js/jq_pgm.js" charset="utf-8"></script>
// 		<title>LWT :: <?php echo titletext; ?></title>
// 	</head>
// 	<body>
// 	<div id="overDiv" style="position:absolute; visibility:hidden; z-index:1000;"></div>
// 	<?php
// 	if (debug)
// 		showRequest();
// }
// // -------------------------------------------------------------
// function pagestart(titletext, close)
// {
// 	global debug;
// 	pagestart_nobody(titletext);
// 	echo '<h4>';
// 	if (close)
// 		echo '<a href="index" target="_top">';
// 	echo_lwt_logo();
// 	echo "LWT";
// 	if (close) {
// 		echo '</a>&nbsp; | &nbsp;';
// 		quickMenu();
// 	}
// 	echo '</h4><h3>' . titletext . (debug ? ' <span class="red">DEBUG</span>' : '') . '</h3>';
// 	echo "<p>&nbsp;</p>";
// }
// // -------------------------------------------------------------
// function url_base()
// {
// 	url = parse_url("http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]");
// 	r = url["scheme"] . "://" . url["host"];
// 	if (isset(url["port"]))
// 		r += ":" . url["port"];
// 	if (isset(url["path"])) {
// 		b = basename(url["path"]);
// 		if (substr(b, -4) === "" || substr(b, -4) === ".htm" || substr(b, -5) === ".html")
// 			r += dirname(url["path"]);
// 		else
// 			r += url["path"];
// 	}
// 	if (substr(r, -1) !== "/")
// 		r += "/";
// 	return r;
// }
// // -------------------------------------------------------------
// function pageend()
// {
// 	global debug, dspltime;
// 	if (debug)
// 		showRequest();
// 	if (dspltime)
// 		echo "\n<p class="smallgray2">" .
// 			round(get_execution_time(), 5) . " secs</p>\n";
// 	?></body></html><?php
// }
// // -------------------------------------------------------------
// function echo_lwt_logo()
// {
// 	global tbpref;
// 	pref = substr(tbpref, 0, -1);
// 	if (pref === '')
// 		pref = 'Default Table Set';
// 	echo '<img class="lwtlogo" src="img/lwt_icon.png"  title="LWT - Current Table Set: ' . tohtml(pref) . '" alt="LWT - Current Table Set: ' . tohtml(pref) . '" />';
// }
// // -------------------------------------------------------------
// function get_execution_time()
// {
// 	static microtime_start = null;
// 	if (microtime_start === null) {
// 		microtime_start = microtime(true);
// 		return 0.0;
// 	}
// 	return microtime(true) - microtime_start;
// }
// // -------------------------------------------------------------
// function getprefixes()
// {
// 	prefix = array();
// 	res = do_mysqli_query(str_replace('_', "\\_", "SHOW TABLES LIKE " . _nonull('%_settings')));
// 	while (row = mysqli_fetch_row(res))
// 		prefix[] = substr(row[0], 0, -9);
// 	mysqli_free_result(res);
// 	return prefix;
// }

// // -------------------------------------------------------------

// function quickMenu()
// {
// 	?><select id="quickmenu" onchange="{const qm = document.getElementByID('quickmenu'); const val=qm.options[qm.selectedIndex].value; qm.selectedIndex=0; if (val !== '') { if (val === 'INFO') {top.location.href='info.htm';} else {top.location.href = val + '';}}}">
// 	<option value="" selected="selected">[Menu]</option>
// 	<option value="index">Home</option>
// 	<option value="edit_texts">Texts</option>
// 	<option value="edit_archivedtexts">Text Archive</option>
// 	<option value="edit_texttags">Text Tags</option>
// 	<option value="edit_languages">Languages</option>
// 	<option value="edit_words">Terms</option>
// 	<option value="edit_tags">Term Tags</option>
// 	<option value="statistics">Statistics</option>
// 	<option value="check_text">Text Check</option>
// 	<option value="long_text_import">Long Text Import</option>
// 	<option value="upload_words">Term Import</option>
// 	<option value="backup_restore">Backup/Restore</option>
// 	<option value="settings">Settings</option>
// 	<option value="INFO">Help</option>
// 	</select><?php
// }

// // -------------------------------------------------------------

// function error_message_with_hide(msg, noback)
// {
// 	if (trim(msg) === '')
// 		return '';
// 	if (substr(msg, 0, 5) === "Error")
// 		return '<p class="red">*** ' . tohtml(msg) . ' ***' .
// 			(noback ?
// 				'' :
// 				'<br /><input type="button" value="&lt;&lt; Go back and correct &lt;&lt;" onClick="history.back();" />') .
// 			'</p>';
// 	else
// 		return '<p id="hide3" class="msgblue">+++ ' . tohtml(msg) . ' +++</p>';
// }

// // -------------------------------------------------------------

/**
 *
 * @param softHyphenString
 */
export function remove_soft_hyphens(softHyphenString: string) {
  return softHyphenString.replace('­', ''); // first '..' contains Softhyphen 0xC2 0xAD
}

// // -------------------------------------------------------------

// function limitlength(s, l)
// {
// 	if (mb_strlen(s, 'UTF-8') <= l)
// 		return s;
// 	return mb_substr(s, 0, l, 'UTF-8');
// }

// // -------------------------------------------------------------

// function adjust_autoincr(table, key)
// {
// 	global tbpref;
// 	val = get_first_value('select max(' . key . ')+1 as value from ' . tbpref . table);
// 	if (!isset(val))
// 		val = 1;
// 	sql = 'alter table ' . tbpref . table . ' AUTO_INCREMENT = ' . val;
// 	res = do_mysqli_query(sql);
// }

// // -------------------------------------------------------------

// function replace_supp_unicode_planes_char(s)
// {
// 	return preg_replace('/[\x{10000}-\x{10FFFF}]/u', "\xE2\x96\x88", s);
// 	/* U+2588 = UTF8: E2 96 88 = FULL BLOCK = ⬛︎  */
// }

// // -------------------------------------------------------------

// function prepare_textdata(s)
// {
// 	return str_replace("\r\n", "\n", stripTheSlashesIfNeeded(s));
// }

// // -------------------------------------------------------------
// TODO defunct?
export function prepare_textdata_js(s) {
  return s;
  // s = (s);
  // if (s === null)
  // 	return "''";
  // return str_replace("''", "\\'", s);
}

// // -------------------------------------------------------------

// function tohtml(s)
// {
// 	if (isset(s))
// 		return htmlspecialchars(s, ENT_COMPAT, "UTF-8");
// 	else
// 		return '';
// }

// // -------------------------------------------------------------

// function makeCounterWithTotal(max, num)
// {
// 	if (max === 1)
// 		return '';
// 	if (max < 10)
// 		return num . "/" . max;
// 	return substr(
// 		str_repeat("0", strlen(max)) . num,
// 		-strlen(max)
// 	) .
// 		"/" . max;
// }

// // -------------------------------------------------------------

// function encodeURI(url)
// {
// 	reserved = array(
// 		'%2D' => '-',
// 		'%5F' => '_',
// 		'%2E' => '.',
// 		'%21' => '!',
// 		'%2A' => '*',
// 		'%27' => "'",
// 		'%28' => '(',
// 		'%29' => ')'
// 	);
// 	unescaped = array(
// 		'%3B' => ';',
// 		'%2C' => ',',
// 		'%2F' => '/',
// 		'%3F' => '?',
// 		'%3A' => ':',
// 		'%40' => '@',
// 		'%26' => '&',
// 		'%3D' => '=',
// 		'%2B' => '+',
// 		'%24' => '$'
// 	);
// 	score = array(
// 		'%23' => '#'
// 	);
// 	return strtr(rawurlencode(url), array_merge(reserved, unescaped, score));
// }

// // -------------------------------------------------------------

// function showRequest()
// {
// 	olderr = error_reporting(0);
// 	echo "<pre>** DEBUGGING **********************************\n";
// 	echo 'GLOBALS...';
// 	print_r(GLOBALS);
// 	echo 'get_version_number()...';
// 	echo get_version_number() . "\n";
// 	echo 'get_magic_quotes_gpc()...';
// 	if (function_exists("get_magic_quotes_gpc")) {
// 		echo (get_magic_quotes_gpc() ? "TRUE" : "FALSE") . "\n";
// 	} else {
// 		echo "NOT EXISTS (FALSE)\n";
// 	}
// 	echo "********************************** DEBUGGING **</pre>";
// 	error_reporting(olderr);
// }

// // -------------------------------------------------------------

// function (data)
// {
// 	result = "NULL";
// 	data = trim(prepare_textdata(data));
// 	if (data !== "")
// 		result = "'" . mysqli_real_escape_string(GLOBALS['DBCONNECTION'], data) . "'";
// 	return result;
// }

// // -------------------------------------------------------------

// function _nonull(data)
// {
// 	data = trim(prepare_textdata(data));
// 	return "'" . mysqli_real_escape_string(GLOBALS['DBCONNECTION'], data) . "'";
// }

// // -------------------------------------------------------------

// function _notrim_nonull(data)
// {
// 	return "'" . mysqli_real_escape_string(GLOBALS['DBCONNECTION'], prepare_textdata(data)) . "'";
// }

// // -------------------------------------------------------------

export function remove_spaces(s: string, remove: Language['LgRemoveSpaces']) {
  if (remove) return s.replace('/s{1,}/u', '');
  // '' enthält &#x200B;
  else return s;
}

// // -------------------------------------------------------------

// function getreq(s)
// {
// 	if (isset($_REQUEST[s])) {
// 		return trim($_REQUEST[s]);
// 	} else
// 		return '';
// }

// // -------------------------------------------------------------

// function get_sepas()
// {
// 	static sepa;
// 	if (!sepa) {
// 		sepa = preg_quote(getSettingWithDefault('set-term-translation-delimiters'), '/');
// 	}
// 	return sepa;
// }

// // -------------------------------------------------------------

// function get_first_sepa()
// {
// 	static sepa;
// 	if (!sepa) {
// 		sepa = mb_substr(
// 			getSettingWithDefault('set-term-translation-delimiters'),
// 			0,
// 			1,
// 			'UTF-8'
// 		);
// 	}
// 	return sepa;
// }

// // -------------------------------------------------------------

// function getSettingZeroOrOne(key, dft)
// {
// 	r = getSetting(key);
// 	r = (r === '' ? dft : ((((int) r) !== 0) ? 1 : 0));
// 	return r;
// }

// // -------------------------------------------------------------

// function getSetting(key)
// {
// 	global tbpref;
// 	val = get_first_value('select StValue as value from ' . tbpref . 'settings where StKey = ' . (key));
// 	if (isset(val)) {
// 		val = trim(val);
// 		if (key === 'currentlanguage')
// 			val = validateLang(val);
// 		if (key === 'currenttext')
// 			val = validateText(val);
// 		return val;
// 	} else
// 		return '';
// }

// // -------------------------------------------------------------

// function get_mobile_display_mode_selectoptions(v)
// {
// 	if (!isset(v))
// 		v = "0";
// 	r = "<option value="0"" . get_selected(v, "0");
// 	r += ">Auto</option>";
// 	r += "<option value="1"" . get_selected(v, "1");
// 	r += ">Force Non-Mobile</option>";
// 	r += "<option value="2"" . get_selected(v, "2");
// 	r += ">Force Mobile</option>";
// 	return r;
// }

// // -------------------------------------------------------------

// function saveSetting(k, v)
// {
// 	global tbpref;
// 	dft = get_setting_data();
// 	if (!isset(v))
// 		v = '';
// 	v = (v);
// 	runsql('delete from ' . tbpref . 'settings where StKey = ' . (k), '');
// 	if (v !== '') {
// 		if (array_key_exists(k, dft)) {
// 			if (dft[k]['num']) {
// 				v = (int) v;
// 				if (v < dft[k]['min'])
// 					v = dft[k]['dft'];
// 				if (v > dft[k]['max'])
// 					v = dft[k]['dft'];
// 			}
// 		}
// 		dum = runsql('insert into ' . tbpref . 'settings (StKey, StValue) values(' .
// 			(k) . ', ' .
// 			(v) . ')', '');
// 	}
// }

// // -------------------------------------------------------------

// function processSessParam(reqkey, sesskey, default, isnum)
// {
// 	result = '';
// 	if (isset($_REQUEST[reqkey])) {
// 		reqdata = (trim($_REQUEST[reqkey]));
// 		$_SESSION[sesskey] = reqdata;
// 		result = reqdata;
// 	} elseif (isset($_SESSION[sesskey])) {
// 		result = $_SESSION[sesskey];
// 	} else {
// 		result = default;
// 	}
// 	if (isnum)
// 		result = (int) result;
// 	return result;
// }

// // -------------------------------------------------------------

// function processDBParam(reqkey, dbkey, default, isnum)
// {
// 	result = '';
// 	dbdata = getSetting(dbkey);
// 	if (isset($_REQUEST[reqkey])) {
// 		reqdata = (trim($_REQUEST[reqkey]));
// 		saveSetting(dbkey, reqdata);
// 		result = reqdata;
// 	} elseif (dbdata !== '') {
// 		result = dbdata;
// 	} else {
// 		result = default;
// 	}
// 	if (isnum)
// 		result = (int) result;
// 	return result;
// }

// // -------------------------------------------------------------

// function validateLang(currentlang)
// {
// 	global tbpref;
// 	if (currentlang !== '') {
// 		if (
// 			get_first_value(
// 				'select count(LgID) as value from ' . tbpref . 'languages where LgID=' .
// 				((int) currentlang)
// 			) === 0
// 		)
// 			currentlang = '';
// 	}
// 	return currentlang;
// }

// // -------------------------------------------------------------

// function validateText(currenttext)
// {
// 	global tbpref;
// 	if (currenttext !== '') {
// 		if (
// 			get_first_value(
// 				'select count(TxID) as value from ' . tbpref . 'texts where TxID=' .
// 				((int) currenttext)
// 			) === 0
// 		)
// 			currenttext = '';
// 	}
// 	return currenttext;
// }

// // -------------------------------------------------------------

// function validateTag(currenttag, currentlang)
// {
// 	global tbpref;
// 	if (currenttag !== '' && currenttag !== -1) {
// 		if (currentlang === '')
// 			sql = "select (" . currenttag . " in (select TgID from " . tbpref . "words, " . tbpref . "tags, " . tbpref . "wordtags where TgID = WtTgID and WtWoID = WoID group by TgID order by TgText)) as value";
// 		else
// 			sql = "select (" . currenttag . " in (select TgID from " . tbpref . "words, " . tbpref . "tags, " . tbpref . "wordtags where TgID = WtTgID and WtWoID = WoID and WoLgID = " . currentlang . " group by TgID order by TgText)) as value";
// 		r = get_first_value(sql);
// 		if (r === 0)
// 			currenttag = '';
// 	}
// 	return currenttag;
// }

// // -------------------------------------------------------------

// function validateArchTextTag(currenttag, currentlang)
// {
// 	global tbpref;
// 	if (currenttag !== '' && currenttag !== -1) {
// 		if (currentlang === '')
// 			sql = "select (" . currenttag . " in (select T2ID from " . tbpref . "archivedtexts, " . tbpref . "tags2, " . tbpref . "archtexttags where T2ID = AgT2ID and AgAtID = AtID group by T2ID order by T2Text)) as value";
// 		else
// 			sql = "select (" . currenttag . " in (select T2ID from " . tbpref . "archivedtexts, " . tbpref . "tags2, " . tbpref . "archtexttags where T2ID = AgT2ID and AgAtID = AtID and AtLgID = " . currentlang . " group by T2ID order by T2Text)) as value";
// 		r = get_first_value(sql);
// 		if (r === 0)
// 			currenttag = '';
// 	}
// 	return currenttag;
// }

// // -------------------------------------------------------------

// function validateTextTag(currenttag, currentlang)
// {
// 	global tbpref;
// 	if (currenttag !== '' && currenttag !== -1) {
// 		if (currentlang === '')
// 			sql = "select (" . currenttag . " in (select T2ID from " . tbpref . "texts, " . tbpref . "tags2, " . tbpref . "texttags where T2ID = TtT2ID and TtTxID = TxID group by T2ID order by T2Text)) as value";
// 		else
// 			sql = "select (" . currenttag . " in (select T2ID from " . tbpref . "texts, " . tbpref . "tags2, " . tbpref . "texttags where T2ID = TtT2ID and TtTxID = TxID and TxLgID = " . currentlang . " group by T2ID order by T2Text)) as value";
// 		r = get_first_value(sql);
// 		if (r === 0)
// 			currenttag = '';
// 	}
// 	return currenttag;
// }

// // -------------------------------------------------------------

// function getWordTagList(wid, before = ' ', brack = 1, tohtml = 1)
// {
// 	global tbpref;
// 	r = get_first_value("select ifnull(" . (brack ? "concat('['," : "") . "group_concat(distinct TgText order by TgText separator ', ')" . (brack ? ",']')" : "") . ",'') as value from ((" . tbpref . "words left join " . tbpref . "wordtags on WoID = WtWoID) left join " . tbpref . "tags on TgID = WtTgID) where WoID = " . wid);
// 	if (r !== '')
// 		r = before . r;
// 	if (tohtml)
// 		r = tohtml(r);
// 	return r;
// }

// // -------------------------------------------------------------

// function make_status_controls_test_table(score, status, wordid)
// {
// 	if (score < 0)
// 		scoret = '<span class="red2">' . get_status_abbr(status) . '</span>';
// 	else
// 		scoret = get_status_abbr(status);

// 	if (status <= 5 || status === 98)
// 		plus = '<img src="icn/plus.png" class="click" title="+" alt="+" onClick="changeTableTestStatus(' . wordid . ',true);" />';
// 	else
// 		plus = '<img src="icn/placeholder.png" title="" alt="" />';
// 	if (status >= 1)
// 		minus = '<img src="icn/minus.png" class="click" title="-" alt="-" onClick="changeTableTestStatus(' . wordid . ',false);" />';
// 	else
// 		minus = '<img src="icn/placeholder.png" title="" alt="" />';
// 	return (status === 98 ? '' : minus . ' ') . scoret . (status === 99 ? '' : ' ' . plus);
// }

// // -------------------------------------------------------------

// function get_languages_selectoptions(v, dt)
// {
// 	global tbpref;
// 	sql = "select LgID, LgName from " . tbpref . "languages order by LgName";
// 	res = do_mysqli_query(sql);
// 	if (!isset(v) || trim(v) === '') {
// 		r = "<option value="\" selected=\"selected">" . dt . "</option>";
// 	} else {
// 		r = "<option value="">" . dt . "</option>";
// 	}
// 	while (record = mysqli_fetch_assoc(res)) {
// 		d = record["LgName"];
// 		if (strlen(d) > 30)
// 			d = substr(d, 0, 30) . "...";
// 		r += "<option value="" . record["LgID"] . "" " . get_selected(v, record["LgID"]);
// 		r += ">" . tohtml(d) . "</option>";
// 	}
// 	mysqli_free_result(res);
// 	return r;
// }

// // -------------------------------------------------------------

// function get_wordstatus_radiooptions(v)
// {
// 	if (!isset(v))
// 		v = 1;
// 	r = "";
// 	statuses = get_statuses();
// 	foreach (statuses as n => status) {
// 		r += '<span class="status' . n . '" title="' . tohtml(status["name"]) . '">';
// 		r += '&nbsp;<input type="radio" name="WoStatus" value="' . n . '"';
// 		if (v === n)
// 			r += ' checked="checked"';
// 		r += ' />' . tohtml(status["abbr"]) . "&nbsp;</span> ";
// 	}
// 	return r;
// }

// // -------------------------------------------------------------

// function get_paging_selectoptions(currentpage, pages)
// {
// 	r = "";
// 	for (i = 1; i <= pages; i++) {
// 		r += "<option value="" . i . """ . get_selected(i, currentpage);
// 		r += ">i</option>";
// 	}
// 	return r;
// }

// // -------------------------------------------------------------

// function get_set_status_option(n, suffix = "")
// {
// 	return "<option value="s" . n . suffix . "">Set Status to " .
// 		tohtml(get_status_name(n)) . " [" . tohtml(get_status_abbr(n)) .
// 		"]</option>";
// }

// // -------------------------------------------------------------

// function get_status_name(n)
// {
// 	statuses = get_statuses();
// 	return statuses[n]["name"];
// }

// // -------------------------------------------------------------

// function get_status_abbr(n)
// {
// 	statuses = get_statuses();
// 	return statuses[n]["abbr"];
// }

// // -------------------------------------------------------------

// function get_colored_status_msg(n)
// {
// 	return '<span class="status' . n . '">&nbsp;' . tohtml(get_status_name(n)) . '&nbsp;[' . tohtml(get_status_abbr(n)) . ']&nbsp;</span>';
// }

// // -------------------------------------------------------------

// function get_texts_selectoptions(lang, v)
// {
// 	global tbpref;
// 	if (!isset(v))
// 		v = '';
// 	if (!isset(lang))
// 		lang = '';
// 	if (lang === "")
// 		l = "";
// 	else
// 		l = "and TxLgID=" . lang;
// 	r = "<option value=""" . get_selected(v, '');
// 	r += ">[Filter off]</option>";
// 	sql = "select TxID, TxTitle, LgName from " . tbpref . "languages, " . tbpref . "texts where LgID = TxLgID " . l . " order by LgName, TxTitle";
// 	res = do_mysqli_query(sql);
// 	while (record = mysqli_fetch_assoc(res)) {
// 		d = record["TxTitle"];
// 		if (mb_strlen(d, 'UTF-8') > 30)
// 			d = mb_substr(d, 0, 30, 'UTF-8') . "...";
// 		r += "<option value="" . record["TxID"] . """ . get_selected(v, record["TxID"]) . ">" . tohtml((lang !== "" ? "" : (record["LgName"] . ": ")) . d) . "</option>";
// 	}
// 	mysqli_free_result(res);
// 	return r;
// }

// // -------------------------------------------------------------

// function makeStatusCondition(fieldname, statusrange)
// {
// 	if (statusrange >= 12 && statusrange <= 15) {
// 		return '(' . fieldname . ' between 1 and ' . (statusrange % 10) . ')';
// 	} elseif (statusrange >= 23 && statusrange <= 25) {
// 		return '(' . fieldname . ' between 2 and ' . (statusrange % 10) . ')';
// 	} elseif (statusrange >= 34 && statusrange <= 35) {
// 		return '(' . fieldname . ' between 3 and ' . (statusrange % 10) . ')';
// 	} elseif (statusrange === 45) {
// 		return '(' . fieldname . ' between 4 and 5)';
// 	} elseif (statusrange === 599) {
// 		return fieldname . ' in (5,99)';
// 	} else {
// 		return fieldname . ' = ' . statusrange;
// 	}
// }

// // -------------------------------------------------------------

// function checkStatusRange(currstatus, statusrange)
// {
// 	if (statusrange >= 12 && statusrange <= 15) {
// 		return (currstatus >= 1 && currstatus <= (statusrange % 10));
// 	} elseif (statusrange >= 23 && statusrange <= 25) {
// 		return (currstatus >= 2 && currstatus <= (statusrange % 10));
// 	} elseif (statusrange >= 34 && statusrange <= 35) {
// 		return (currstatus >= 3 && currstatus <= (statusrange % 10));
// 	} elseif (statusrange === 45) {
// 		return (currstatus === 4 || currstatus === 5);
// 	} elseif (statusrange === 599) {
// 		return (currstatus === 5 || currstatus === 99);
// 	} else {
// 		return (currstatus === statusrange);
// 	}
// }

// // -------------------------------------------------------------

export function makeStatusClassFilter(
  status: NumericalStrengthPotentiallyCompound | undefined
) {
  if (status === undefined) return '';
  const liste = [1, 2, 3, 4, 5, 98, 99];
  if (status === 599) {
    makeStatusClassFilterHelper(5, liste);
    makeStatusClassFilterHelper(99, liste);
  } else if (status < 6 || status > 97) {
    makeStatusClassFilterHelper(status, liste);
  } else {
    const from = status / 10;
    const to = status - from * 10;
    for (let i = from; i <= to; i++) makeStatusClassFilterHelper(i, liste);
  }
  let r = '';
  liste.forEach((v) => {
    if (v !== -1) {
      r += ':not(.status' + v + ')';
    }
  });
  return r;
}

// // -------------------------------------------------------------

function makeStatusClassFilterHelper(status, array) {
  const pos = array_search(status, array);
  if (pos !== false) {
    array[pos] = -1;
  }
}

// // -------------------------------------------------------------

// function makeOpenDictStr(url, txt)
// {
// 	r = '';
// 	if (url !== '' && txt !== '') {
// 		if (substr(url, 0, 1) === '*') {
// 			r = ' <span class="click" onClick="owin(' . prepare_textdata_js(substr(url, 1)) . ');">' . tohtml(txt) . '</span> ';
// 		} else {
// 			r = ' <a href="' . url . '" target="ru">' . tohtml(txt) . '</a> ';
// 		}
// 	}
// 	return r;
// }

// // -------------------------------------------------------------

// function makeOpenDictStrJS(url)
// {
// 	r = '';
// 	if (url !== '') {
// 		if (substr(url, 0, 1) === '*') {
// 			r = "owin(" . prepare_textdata_js(substr(url, 1)) . ");\n";
// 		} else {
// 			r = "top.frames['ru'].location.href=" . prepare_textdata_js(url) . ";\n";
// 		}
// 	}
// 	return r;
// }

// // -------------------------------------------------------------

// function makeOpenDictStrDynSent(url, sentctljs, txt)
// {
// 	r = '';
// 	if (url !== '') {
// 		if (substr(url, 0, 1) === '*') {
// 			r = '<span class="click" onClick="translateSentence2(' . prepare_textdata_js(substr(url, 1)) . ',' . sentctljs . ');">' . tohtml(txt) . '</span>';
// 		} else {
// 			r = '<span class="click" onClick="translateSentence(' . prepare_textdata_js(url) . ',' . sentctljs . ');">' . tohtml(txt) . '</span>';
// 		}
// 	}
// 	return r;
// }

// // -------------------------------------------------------------

function ord(str: string) {
  return str.charCodeAt(0);
}

// // -------------------------------------------------------------

// TODO
function dechex(val: number) {
  return Number.parseInt(`${val}`, 10);
}

// // -------------------------------------------------------------

// TODO
function strToHex(string: string) {
  let hex = '';
  for (let i = 0; i < string.length; i++) {
    const h = dechex(ord(string[i]));
    if (h.length === 1) {
      hex += `0${h}`;
    } else hex += h;
  }
  return hex.toUpperCase();
}

// -------------------------------------------------------------

export function strToClassName(string: string) {
  // escapes everything to "¤xx" but not 0-9, a-z, A-Z, and unicode >= (hex 00A5, dec 165)
  const l = string.length;
  let r = '';
  for (let i = 0; i < l; i++) {
    const c = string.substring(i, 1);
    const o = ord(c);
    if (
      o < 48 ||
      (o > 57 && o < 65) ||
      (o > 90 && o < 97) ||
      (o > 122 && o < 165)
    )
      r += '¤' + strToHex(c);
    else r += c;
  }
  return r;
}

// -------------------------------------------------------------

export function replaceTabsWithNewLine(s: string) {
  return ['\r\n', '\r', '\n', '\t', '/s/u', '/s{2,}/u']
    .reduce((prev, curr) => prev.replace(curr, ' '), s)
    .trim();
}

// // -------------------------------------------------------------

// TODO
/**
 *
 * @param text
 */
// export function textwordcount(text): number {
//   return get_first_value('select count(distinct TiTextLC) as value from ' . tbpref . 'textitems where TiIsNotWord = 0 and TiWordCount = 1 and TiTxID = ' . text);
// }

// // -------------------------------------------------------------

// function textexprcount(text)
// {
// 	global tbpref;
// 	return get_first_value('select count(distinct TiTextLC) as value from ' . tbpref . 'textitems left join ' . tbpref . 'words on TiTextLC = WoTextLC where TiWordCount > 1 and TiIsNotWord = 0 and TiTxID = ' . text . ' and WoID is not null and TiLgID = WoLgID');
// }

// // -------------------------------------------------------------

// TODO
/**
 *
 * @param text
 */
// export function textworkcount(words:Word[],textitems:TextItem[]): number {
//   return get_first_value('select count(distinct TiTextLC) as value from ' . tbpref . 'textitems left join ' . tbpref . 'words on TiTextLC = WoTextLC where TiWordCount = 1 and TiIsNotWord = 0 and TiTxID = ' . text . ' and WoID is not null and TiLgID = WoLgID');
// }

// // -------------------------------------------------------------

// // -------------------------------------------------------------

// function getSentence(seid, wordlc, mode)
// {
// 	global tbpref;
// 	txtid = get_first_value('select SeTxID as value from ' . tbpref . 'sentences where SeID = ' . seid);
// 	seidlist = seid;
// 	if (mode > 1) {
// 		prevseid = get_first_value('select SeID as value from ' . tbpref . 'sentences where SeID < ' . seid . ' and SeTxID = ' . txtid . " and trim(SeText) not in ('¶','') order by SeID desc");
// 		if (isset(prevseid))
// 			seidlist += ',' . prevseid;
// 		if (mode > 2) {
// 			nextseid = get_first_value('select SeID as value from ' . tbpref . 'sentences where SeID > ' . seid . ' and SeTxID = ' . txtid . " and trim(SeText) not in ('¶','') order by SeID asc");
// 			if (isset(nextseid))
// 				seidlist += ',' . nextseid;
// 		}
// 	}
// 	sql2 = 'SELECT TiText, TiTextLC, TiWordCount, TiIsNotWord FROM ' . tbpref . 'textitems WHERE TiSeID in (' . seidlist . ') and TiTxID=' . txtid . ' order by TiOrder asc, TiWordCount desc';
// 	res2 = do_mysqli_query(sql2);
// 	sejs = '';
// 	se = '';
// 	notfound = 1;
// 	jump = 0;
// 	while (record2 = mysqli_fetch_assoc(res2)) {
// 		if (record2['TiIsNotWord'] === 1) {
// 			jump--;
// 			if (jump < 0) {
// 				sejs += record2['TiText'];
// 				se += tohtml(record2['TiText']);
// 			}
// 		} else {
// 			if ((jump - 1) < 0) {
// 				if (notfound) {
// 					if (record2['TiTextLC'] === wordlc) {
// 						sejs += '{';
// 						se += '<b>';
// 						sejs += record2['TiText'];
// 						se += tohtml(record2['TiText']);
// 						sejs += '}';
// 						se += '</b>';
// 						notfound = 0;
// 						jump = (record2['TiWordCount'] - 1) * 2;
// 					}
// 				}
// 				if (record2['TiWordCount'] === 1) {
// 					if (notfound) {
// 						sejs += record2['TiText'];
// 						se += tohtml(record2['TiText']);
// 						jump = 0;
// 					} else {
// 						notfound = 1;
// 					}
// 				}
// 			} else {
// 				if (record2['TiWordCount'] === 1)
// 					jump--;
// 			}
// 		}
// 	}
// 	mysqli_free_result(res2);
// 	return array(se, sejs); // [0]=html, word in bold
// 	// [1]=text, word in {}
// }

// // -------------------------------------------------------------

// function get20Sentences(lang, wordlc, jsctlname, mode)
// {
// 	global tbpref;
// 	r = '<p><b>Sentences in active texts with <i>' . tohtml(wordlc) . '</i></b></p><p>(Click on <img src="icn/tick-button.png" title="Choose" alt="Choose" /> to copy sentence into above term)</p>';
// 	sql = 'SELECT DISTINCT SeID, SeText FROM ' . tbpref . 'sentences, ' . tbpref . 'textitems WHERE TiTextLC = ' . (wordlc) . ' AND SeID = TiSeID AND SeLgID = ' . lang . ' order by CHAR_LENGTH(SeText), SeText limit 0,20';
// 	res = do_mysqli_query(sql);
// 	r += '<p>';
// 	last = '';
// 	while (record = mysqli_fetch_assoc(res)) {
// 		if (last !== record['SeText']) {
// 			sent = getSentence(record['SeID'], wordlc, mode);
// 			r += '<span class="click" onClick="{' . jsctlname . '.value=' . prepare_textdata_js(sent[1]) . '; makeDirty();}"><img src="icn/tick-button.png" title="Choose" alt="Choose" /></span> &nbsp;' . sent[0] . '<br />';
// 		}
// 		last = record['SeText'];
// 	}
// 	mysqli_free_result(res);
// 	r += '</p>';
// 	return r;
// }

// // -------------------------------------------------------------

// function get_languages()
// {
// 	global tbpref;
// 	langs = array();
// 	sql = "select LgID, LgName from " . tbpref . "languages";
// 	res = do_mysqli_query(sql);
// 	while (record = mysqli_fetch_assoc(res)) {
// 		langs[record['LgName']] = record['LgID'];
// 	}
// 	mysqli_free_result(res);
// 	return langs;
// }

// // -------------------------------------------------------------

// function reparse_all_texts()
// {
// 	global tbpref;
// 	runsql('TRUNCATE ' . tbpref . 'sentences', '');
// 	runsql('TRUNCATE ' . tbpref . 'textitems', '');
// 	adjust_autoincr('sentences', 'SeID');
// 	adjust_autoincr('textitems', 'TiID');
// 	sql = "select TxID, TxLgID from " . tbpref . "texts";
// 	res = do_mysqli_query(sql);
// 	while (record = mysqli_fetch_assoc(res)) {
// 		id = record['TxID'];
// 		splitCheckText(
// 			get_first_value('select TxText as value from ' . tbpref . 'texts where TxID = ' . id), record['TxLgID'],
// 			id
// 		);
// 	}
// 	mysqli_free_result(res);
// }

// // -------------------------------------------------------------

// function getLanguage(lid)
// {
// 	global tbpref;
// 	if (!isset(lid))
// 		return '';
// 	if (trim(lid) === '')
// 		return '';
// 	if (!is_numeric(lid))
// 		return '';
// 	r = get_first_value("select LgName as value from " . tbpref . "languages where LgID='" . lid . "'");
// 	if (isset(r))
// 		return r;
// 	return '';
// }

// 	////////////////////////////////////
// 	// Split: insert sentences/textitems entries in DB

// 	sentNumber = 0;
// 	lfdnr = 0;

// 	foreach (textLines as value) {

// 		dummy = runsql('INSERT INTO ' . tbpref . 'sentences (SeLgID, SeTxID, SeOrder, SeText) VALUES (' . lid . ',' . id . ',' . (sentNumber + 1) . ',' . _notrim_nonull(remove_spaces(value . ' ', removeSpaces)) . ')', ' ');
// 		sentid = get_last_key();
// 		lineWords[sentNumber] = preg_split('/([^' . termchar . ']+)/u', value . ' ', null, PREG_SPLIT_DELIM_CAPTURE);
// 		l = count(lineWords[sentNumber]);
// 		sqltext = 'INSERT INTO ' . tbpref . 'textitems (TiLgID, TiTxID, TiSeID, TiOrder, TiWordCount, TiText, TiTextLC, TiIsNotWord) VALUES ';
// 		lfdnr1 = 0;
// 		for (i = 0; i < l; i++) {
// 			term = mb_strtolower(lineWords[sentNumber][i], 'UTF-8');
// 			rest2 = '';
// 			rest3 = '';
// 			rest4 = '';
// 			rest5 = '';
// 			rest6 = '';
// 			rest7 = '';
// 			rest8 = '';
// 			rest9 = '';
// 			restlc2 = '';
// 			restlc3 = '';
// 			restlc4 = '';
// 			restlc5 = '';
// 			restlc6 = '';
// 			restlc7 = '';
// 			restlc8 = '';
// 			restlc9 = '';
// 			if (term !== '') {
// 				if (i % 2 === 0) {
// 					isnotwort = 0;
// 					rest = lineWords[sentNumber][i];
// 					cnt = 0;
// 					for (j = i + 1; j < l; j++) {
// 						if (lineWords[sentNumber][j] !== '') {
// 							rest += lineWords[sentNumber][j];
// 							cnt++;
// 							if (cnt === 2) {
// 								rest2 = rest;
// 								restlc2 = mb_strtolower(rest, 'UTF-8');
// 							}
// 							if (cnt === 4) {
// 								rest3 = rest;
// 								restlc3 = mb_strtolower(rest, 'UTF-8');
// 							}
// 							if (cnt === 6) {
// 								rest4 = rest;
// 								restlc4 = mb_strtolower(rest, 'UTF-8');
// 							}
// 							if (cnt === 8) {
// 								rest5 = rest;
// 								restlc5 = mb_strtolower(rest, 'UTF-8');
// 							}
// 							if (cnt === 10) {
// 								rest6 = rest;
// 								restlc6 = mb_strtolower(rest, 'UTF-8');
// 							}
// 							if (cnt === 12) {
// 								rest7 = rest;
// 								restlc7 = mb_strtolower(rest, 'UTF-8');
// 							}
// 							if (cnt === 14) {
// 								rest8 = rest;
// 								restlc8 = mb_strtolower(rest, 'UTF-8');
// 							}
// 							if (cnt === 16) {
// 								rest9 = rest;
// 								restlc9 = mb_strtolower(rest, 'UTF-8');
// 								break;
// 							}
// 						}
// 					}
// 				} else {
// 					isnotwort = 1;
// 				}

// 				lfdnr++;
// 				lfdnr1++;
// 				if (lfdnr1 > 1)
// 					sqltext += ',';
// 				sqltext += '(' . lid . ',' . id . ',' . sentid . ',' . lfdnr . ', 1, ' . _notrim_nonull(remove_spaces(lineWords[sentNumber][i], removeSpaces)) . ',' . _notrim_nonull(remove_spaces(term, removeSpaces)) . ',' . isnotwort . ')';
// 				if (isnotwort === 0) {
// 					if (rest2 !== '')
// 						sqltext += ',(' . lid . ',' . id . ',' . sentid . ',' . lfdnr . ', 2, ' . _notrim_nonull(remove_spaces(rest2, removeSpaces)) . ',' . _notrim_nonull(remove_spaces(restlc2, removeSpaces)) . ',' . isnotwort . ')';
// 					if (rest3 !== '')
// 						sqltext += ',(' . lid . ',' . id . ',' . sentid . ',' . lfdnr . ', 3, ' . _notrim_nonull(remove_spaces(rest3, removeSpaces)) . ',' . _notrim_nonull(remove_spaces(restlc3, removeSpaces)) . ',' . isnotwort . ')';
// 					if (rest4 !== '')
// 						sqltext += ',(' . lid . ',' . id . ',' . sentid . ',' . lfdnr . ', 4, ' . _notrim_nonull(remove_spaces(rest4, removeSpaces)) . ',' . _notrim_nonull(remove_spaces(restlc4, removeSpaces)) . ',' . isnotwort . ')';
// 					if (rest5 !== '')
// 						sqltext += ',(' . lid . ',' . id . ',' . sentid . ',' . lfdnr . ', 5, ' . _notrim_nonull(remove_spaces(rest5, removeSpaces)) . ',' . _notrim_nonull(remove_spaces(restlc5, removeSpaces)) . ',' . isnotwort . ')';
// 					if (rest6 !== '')
// 						sqltext += ',(' . lid . ',' . id . ',' . sentid . ',' . lfdnr . ', 6, ' . _notrim_nonull(remove_spaces(rest6, removeSpaces)) . ',' . _notrim_nonull(remove_spaces(restlc6, removeSpaces)) . ',' . isnotwort . ')';
// 					if (rest7 !== '')
// 						sqltext += ',(' . lid . ',' . id . ',' . sentid . ',' . lfdnr . ', 7, ' . _notrim_nonull(remove_spaces(rest7, removeSpaces)) . ',' . _notrim_nonull(remove_spaces(restlc7, removeSpaces)) . ',' . isnotwort . ')';
// 					if (rest8 !== '')
// 						sqltext += ',(' . lid . ',' . id . ',' . sentid . ',' . lfdnr . ', 8, ' . _notrim_nonull(remove_spaces(rest8, removeSpaces)) . ',' . _notrim_nonull(remove_spaces(restlc8, removeSpaces)) . ',' . isnotwort . ')';
// 					if (rest9 !== '')
// 						sqltext += ',(' . lid . ',' . id . ',' . sentid . ',' . lfdnr . ', 9, ' . _notrim_nonull(remove_spaces(rest9, removeSpaces)) . ',' . _notrim_nonull(remove_spaces(restlc9, removeSpaces)) . ',' . isnotwort . ')';
// 				}
// 			}
// 		}
// 		if (lfdnr > 0)
// 			dummy = runsql(sqltext, '');
// 		sentNumber += 1;
// 	}

// }

// // -------------------------------------------------------------

// function restore_file(handle, title)
// {
// 	global tbpref;
// 	message = "";
// 	lines = 0;
// 	ok = 0;
// 	errors = 0;
// 	drops = 0;
// 	inserts = 0;
// 	creates = 0;
// 	start = 1;
// 	while (!gzeof(handle)) {
// 		sql_line = trim(
// 			str_replace(
// 				"\r",
// 				"",
// 				str_replace(
// 					"\n",
// 					"",
// 					gzgets(handle, 99999)
// 				)
// 			)
// 		);
// 		if (sql_line !== "") {
// 			if (start) {
// 				if (strpos(sql_line, "-- lwt-backup-") === false) {
// 					message = "Error: Invalid " . title . " Restore file (possibly not created by LWT backup)";
// 					errors = 1;
// 					break;
// 				}
// 				start = 0;
// 				continue;
// 			}
// 			if (substr(sql_line, 0, 3) !== '-- ') {
// 				res = mysqli_query(GLOBALS['DBCONNECTION'], insert_prefix_in_sql(sql_line));
// 				lines++;
// 				if (res === FALSE)
// 					errors++;
// 				else {
// 					ok++;
// 					if (substr(sql_line, 0, 11) === "INSERT INTO")
// 						inserts++;
// 					elseif (substr(sql_line, 0, 10) === "DROP TABLE")
// 						drops++;
// 					elseif (substr(sql_line, 0, 12) === "CREATE TABLE")
// 						creates++;
// 				}
// 				// echo ok . " / " . tohtml(insert_prefix_in_sql(sql_line)) . "<br />";
// 			}
// 		}
// 	} // while (! feof(handle))
// 	gzclose(handle);
// 	if (errors === 0) {
// 		reparse_all_texts();
// 		optimizedb();
// 		get_tags(refresh = 1);
// 		get_texttags(refresh = 1);
// 		message = "Success: " . title . " restored - " .
// 			lines . " queries - " . ok . " successful (" . drops . "/" . creates . " tables dropped/created, " . inserts . " records added), " . errors . " failed.";
// 	} else {
// 		if (message === "") {
// 			message = "Error: " . title . " NOT restored - " .
// 				lines . " queries - " . ok . " successful (" . drops . "/" . creates . " tables dropped/created, " . inserts . " records added), " . errors . " failed.";
// 		}
// 	}
// 	return message;
// }

// // -------------------------------------------------------------

// function recreate_save_ann(textid, oldann)
// {
// 	global tbpref;
// 	newann = create_ann(textid);
// 	// Get the translations from oldann:
// 	oldtrans = array();
// 	olditems = preg_split('/[\n]/u', oldann);
// 	foreach (olditems as olditem) {
// 		oldvals = preg_split('/[\t]/u', olditem);
// 		if (oldvals[0] > -1) {
// 			trans = '';
// 			if (count(oldvals) > 3)
// 				trans = oldvals[3];
// 			oldtrans[oldvals[0] . "\t" . oldvals[1]] = trans;
// 		}
// 	}
// 	// Reset the translations from oldann in newann and rebuild in ann:
// 	newitems = preg_split('/[\n]/u', newann);
// 	ann = '';
// 	foreach (newitems as newitem) {
// 		newvals = preg_split('/[\t]/u', newitem);
// 		if (newvals[0] > -1) {
// 			key = newvals[0] . "\t";
// 			if (isset(newvals[1]))
// 				key += newvals[1];
// 			if (array_key_exists(key, oldtrans)) {
// 				newvals[3] = oldtrans[key];
// 			}
// 			item = implode("\t", newvals);
// 		} else {
// 			item = newitem;
// 		}
// 		ann += item . "\n";
// 	}
// 	dummy = runsql('update ' . tbpref . 'texts set ' .
// 		'TxAnnotatedText = ' . (ann) . ' where TxID = ' . textid, "");
// 	return get_first_value("select TxAnnotatedText as value from " . tbpref . "texts where TxID = " . textid);
// }

// // -------------------------------------------------------------

// function create_ann(textid)
// {
// 	global tbpref;
// 	ann = '';
// 	sql = 'select TiWordCount as Code, TiText, TiOrder, TiIsNotWord, WoID, WoTranslation from (' . tbpref . 'textitems left join ' . tbpref . 'words on (TiTextLC = WoTextLC) and (TiLgID = WoLgID)) where TiTxID = ' . textid . ' and (not (TiWordCount > 1 and WoID is null)) order by TiOrder asc, TiWordCount desc';
// 	savenonterm = '';
// 	saveterm = '';
// 	savetrans = '';
// 	savewordid = '';
// 	until = 0;
// 	res = do_mysqli_query(sql);
// 	while (record = mysqli_fetch_assoc(res)) {
// 		actcode = record['Code'] + 0;
// 		order = record['TiOrder'] + 0;
// 		if (order <= until) {
// 			continue;
// 		}
// 		if (order > until) {
// 			ann = ann . process_term(savenonterm, saveterm, savetrans, savewordid, order);
// 			savenonterm = '';
// 			saveterm = '';
// 			savetrans = '';
// 			savewordid = '';
// 			until = order;
// 		}
// 		if (record['TiIsNotWord'] !== 0) {
// 			savenonterm = savenonterm . record['TiText'];
// 		} else {
// 			until = order + 2 * (actcode - 1);
// 			saveterm = record['TiText'];
// 			savetrans = '';
// 			if (isset(record['WoID'])) {
// 				savetrans = record['WoTranslation'];
// 				savewordid = record['WoID'];
// 			}
// 		}
// 	} // while
// 	mysqli_free_result(res);
// 	ann += process_term(savenonterm, saveterm, savetrans, savewordid, order);
// 	return ann;
// }

// // -------------------------------------------------------------

// function str_replace_first(needle, replace, haystack)
// {
// 	if (needle === '')
// 		return haystack;
// 	pos = strpos(haystack, needle);
// 	if (pos !== false) {
// 		return substr_replace(haystack, replace, pos, strlen(needle));
// 	}
// 	return haystack;
// }

// // -------------------------------------------------------------

// function annotation_to_json(ann)
// {
// 	if (ann === '')
// 		return "{}";
// 	arr = array();
// 	items = preg_split('/[\n]/u', ann);
// 	foreach (items as item) {
// 		vals = preg_split('/[\t]/u', item);
// 		if (count(vals) > 3 && vals[0] >= 0 && vals[2] > 0) {
// 			arr[vals[0] - 1] = array(vals[1], vals[2], vals[3]);
// 		}
// 	}
// 	return json_encode(arr);
// }

// // -------------------------------------------------------------

// function LWTTableCheck()
// {
// 	if (mysqli_num_rows(do_mysqli_query("SHOW TABLES LIKE '\\_lwtgeneral'")) === 0) {
// 		runsql("CREATE TABLE IF NOT EXISTS _lwtgeneral ( LWTKey varchar(40) NOT NULL, LWTValue varchar(40) DEFAULT NULL, PRIMARY KEY (LWTKey) ) ENGINE=MyISAM DEFAULT CHARSET=utf8", '');
// 		if (mysqli_num_rows(do_mysqli_query("SHOW TABLES LIKE '\\_lwtgeneral'")) === 0)
// 			my_die("Unable to create table '_lwtgeneral'!");
// 	}
// }

// // -------------------------------------------------------------

// function LWTTableSet(key, val)
// {
// 	LWTTableCheck();
// 	runsql("INSERT INTO _lwtgeneral (LWTKey, LWTValue) VALUES (" . (key) . ", " . (val) . ") ON DUPLICATE KEY UPDATE LWTValue = " . (val), '');
// }

// // -------------------------------------------------------------

// function LWTTableGet(key)
// {
// 	LWTTableCheck();
// 	return get_first_value("SELECT LWTValue as value FROM _lwtgeneral WHERE LWTKey = " . (key));
// }

// // -------------------------------------------------------------

// function insert_prefix_in_sql(sql_line)
// {
// 	global tbpref;
// 	//                                 123456789012345678901
// 	if (substr(sql_line, 0, 12) === "INSERT INTO ")
// 		return substr(sql_line, 0, 12) . tbpref . substr(sql_line, 12);
// 	elseif (substr(sql_line, 0, 21) === "DROP TABLE IF EXISTS ")
// 		return substr(sql_line, 0, 21) . tbpref . substr(sql_line, 21);
// 	elseif (substr(sql_line, 0, 14) === "CREATE TABLE `")
// 		return substr(sql_line, 0, 14) . tbpref . substr(sql_line, 14);
// 	elseif (substr(sql_line, 0, 13) === "CREATE TABLE ")
// 		return substr(sql_line, 0, 13) . tbpref . substr(sql_line, 13);
// 	else
// 		return sql_line;
// }

// // -------------------------------------------------------------

// function create_save_ann(textid)
// {
// 	global tbpref;
// 	ann = create_ann(textid);
// 	dummy = runsql('update ' . tbpref . 'texts set ' .
// 		'TxAnnotatedText = ' . (ann) . ' where TxID = ' . textid, "");
// 	return get_first_value("select TxAnnotatedText as value from " . tbpref . "texts where TxID = " . textid);
// }

// // -------------------------------------------------------------

// function process_term(nonterm, term, trans, wordid, line)
// {
// 	r = '';
// 	if (nonterm !== '')
// 		r = r . "-1\t" . nonterm . "\n";
// 	if (term !== '')
// 		r = r . line . "\t" . term . "\t" . trim(wordid) . "\t" . get_first_translation(trans) . "\n";
// 	return r;
// }

// // -------------------------------------------------------------

// function get_first_translation(trans)
// {
// 	arr = preg_split('/[' . get_sepas() . ']/u', trans);
// 	if (count(arr) < 1)
// 		return '';
// 	r = trim(arr[0]);
// 	if (r === '*')
// 		r = "";
// 	return r;
// }

// // -------------------------------------------------------------

export function makeScoreRandomInsertUpdate({
  word,
}: {
  word: Pick<Word, 'WoStatus' | 'WoStatusChanged'>;
}): Pick<Word, 'WoTodayScore' | 'WoTomorrowScore' | 'WoRandom'> {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const WoTodayScore = getsqlscoreformula(today, word);
  const WoTomorrowScore = getsqlscoreformula(tomorrow, word);
  // TODO check range
  const WoRandom = Math.random();
  return { WoTodayScore, WoTomorrowScore, WoRandom };
}

// // -------------------------------------------------------------

// function refreshText(word, tid)
// {
// 	global tbpref;
// 	// word : only sentences with word
// 	// tid : textid
// 	// only to be used when showAll = 0 !
// 	out = '';
// 	wordlc = trim(mb_strtolower(word, 'UTF-8'));
// 	if (wordlc === '')
// 		return '';
// 	sql = 'SELECT distinct TiSeID FROM ' . tbpref . 'textitems WHERE TiIsNotWord = 0 and TiTextLC = ' . (wordlc) . ' and TiTxID = ' . tid . ' order by TiSeID';
// 	res = do_mysqli_query(sql);
// 	inlist = '(';
// 	while (record = mysqli_fetch_assoc(res)) {
// 		if (inlist === '(')
// 			inlist += record['TiSeID'];
// 		else
// 			inlist += ',' . record['TiSeID'];
// 	}
// 	mysqli_free_result(res);
// 	if (inlist === '(')
// 		return '';
// 	else
// 		inlist = ' where TiSeID in ' . inlist . ') ';
// 	sql = 'select TiWordCount as Code, TiOrder, TiIsNotWord, WoID from (' . tbpref . 'textitems left join ' . tbpref . 'words on (TiTextLC = WoTextLC) and (TiLgID = WoLgID)) ' . inlist . ' order by TiOrder asc, TiWordCount desc';

// 	res = do_mysqli_query(sql);

// 	hideuntil = -1;
// 	hidetag = "removeClass('hide');";

// 	while (record = mysqli_fetch_assoc(res)) { // MAIN LOOP
// 		actcode = record['Code'] + 0;
// 		order = record['TiOrder'] + 0;
// 		notword = record['TiIsNotWord'] + 0;
// 		termex = isset(record['WoID']);
// 		spanid = 'ID-' . order . '-' . actcode;

// 		if (hideuntil > 0) {
// 			if (order <= hideuntil)
// 				hidetag = "addClass('hide');";
// 			else {
// 				hideuntil = -1;
// 				hidetag = "removeClass('hide');";
// 			}
// 		}

// 		if (notword !== 0) { // NOT A TERM
// 			out += "$('#" . spanid . "',context)." . hidetag . "\n";
// 		} else { // A TERM
// 			if (actcode > 1) { // A MULTIWORD FOUND
// 				if (termex) { // MULTIWORD FOUND - DISPLAY
// 					if (hideuntil === -1)
// 						hideuntil = order + (actcode - 1) * 2;
// 					out += "$('#" . spanid . "',context)." . hidetag . "\n";
// 				} else { // MULTIWORD PLACEHOLDER - NO DISPLAY
// 					out += "$('#" . spanid . "',context).addClass('hide');\n";
// 				}
// 			} // (actcode > 1) -- A MULTIWORD FOUND
// 			else { // (actcode === 1)  -- A WORD FOUND
// 				out += "$('#" . spanid . "',context)." . hidetag . "\n";
// 			}
// 		}
// 	} //  MAIN LOOP
// 	mysqli_free_result(res);
// 	return out;
// }

// // -------------------------------------------------------------

// function check_update_db()
// {
// 	global debug, tbpref;
// 	tables = array();

// 	res = do_mysqli_query(str_replace('_', "\\_", "SHOW TABLES LIKE " . _nonull(tbpref . '%')));
// 	while (row = mysqli_fetch_row(res))
// 		tables[] = row[0];
// 	mysqli_free_result(res);

// 	count = 0; // counter for cache rebuild

// 	// Rebuild Tables if missing (current versions!)

// 	if (in_array(tbpref . 'archivedtexts', tables) === FALSE) {
// 		if (debug)
// 			echo '<p>DEBUG: rebuilding archivedtexts</p>';
// 		runsql("CREATE TABLE IF NOT EXISTS " . tbpref . "archivedtexts ( AtID int(11) unsigned NOT NULL AUTO_INCREMENT, AtLgID int(11) unsigned NOT NULL, AtTitle varchar(200) NOT NULL, AtText text NOT NULL, AtAnnotatedText longtext NOT NULL, AtAudioURI varchar(200) DEFAULT NULL, AtSourceURI varchar(1000) DEFAULT NULL, PRIMARY KEY (AtID), KEY AtLgID (AtLgID) ) ENGINE=MyISAM DEFAULT CHARSET=utf8", '');
// 	}

// 	if (in_array(tbpref . 'languages', tables) === FALSE) {
// 		if (debug)
// 			echo '<p>DEBUG: rebuilding languages</p>';
// 		runsql("CREATE TABLE IF NOT EXISTS " . tbpref . "languages ( LgID int(11) unsigned NOT NULL AUTO_INCREMENT, LgName varchar(40) NOT NULL, LgDict1URI varchar(200) NOT NULL, LgDict2URI varchar(200) DEFAULT NULL, LgGoogleTranslateURI varchar(200) DEFAULT NULL, LgExportTemplate varchar(1000) DEFAULT NULL, LgTextSize int(5) unsigned NOT NULL DEFAULT '100', LgCharacterSubstitutions varchar(500) NOT NULL, LgRegexpSplitSentences varchar(500) NOT NULL, LgExceptionsSplitSentences varchar(500) NOT NULL, LgRegexpWordCharacters varchar(500) NOT NULL, LgRemoveSpaces int(1) unsigned NOT NULL DEFAULT '0', LgSplitEachChar int(1) unsigned NOT NULL DEFAULT '0', LgRightToLeft int(1) unsigned NOT NULL DEFAULT '0', PRIMARY KEY (LgID), UNIQUE KEY LgName (LgName) ) ENGINE=MyISAM DEFAULT CHARSET=utf8", '');
// 	}

// 	if (in_array(tbpref . 'sentences', tables) === FALSE) {
// 		if (debug)
// 			echo '<p>DEBUG: rebuilding sentences</p>';
// 		runsql("CREATE TABLE IF NOT EXISTS " . tbpref . "sentences ( SeID int(11) unsigned NOT NULL AUTO_INCREMENT, SeLgID int(11) unsigned NOT NULL, SeTxID int(11) unsigned NOT NULL, SeOrder int(11) unsigned NOT NULL, SeText text, PRIMARY KEY (SeID), KEY SeLgID (SeLgID), KEY SeTxID (SeTxID), KEY SeOrder (SeOrder) ) ENGINE=MyISAM DEFAULT CHARSET=utf8", '');
// 		count++;
// 	}

// 	if (in_array(tbpref . 'settings', tables) === FALSE) {
// 		if (debug)
// 			echo '<p>DEBUG: rebuilding settings</p>';
// 		runsql("CREATE TABLE IF NOT EXISTS " . tbpref . "settings ( StKey varchar(40) NOT NULL, StValue varchar(40) DEFAULT NULL, PRIMARY KEY (StKey) ) ENGINE=MyISAM DEFAULT CHARSET=utf8", '');
// 	}

// 	if (in_array(tbpref . 'textitems', tables) === FALSE) {
// 		if (debug)
// 			echo '<p>DEBUG: rebuilding textitems</p>';
// 		runsql("CREATE TABLE IF NOT EXISTS " . tbpref . "textitems ( TiID int(11) unsigned NOT NULL AUTO_INCREMENT, TiLgID int(11) unsigned NOT NULL, TiTxID int(11) unsigned NOT NULL, TiSeID int(11) unsigned NOT NULL, TiOrder int(11) unsigned NOT NULL, TiWordCount int(1) unsigned NOT NULL, TiText varchar(250) NOT NULL, TiTextLC varchar(250) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL, TiIsNotWord tinyint(1) NOT NULL, PRIMARY KEY (TiID), KEY TiLgID (TiLgID), KEY TiTxID (TiTxID), KEY TiSeID (TiSeID), KEY TiOrder (TiOrder), KEY TiTextLC (TiTextLC), KEY TiIsNotWord (TiIsNotWord) ) ENGINE=MyISAM DEFAULT CHARSET=utf8", '');
// 		count++;
// 	}

// 	if (in_array(tbpref . 'texts', tables) === FALSE) {
// 		if (debug)
// 			echo '<p>DEBUG: rebuilding texts</p>';
// 		runsql("CREATE TABLE IF NOT EXISTS " . tbpref . "texts ( TxID int(11) unsigned NOT NULL AUTO_INCREMENT, TxLgID int(11) unsigned NOT NULL, TxTitle varchar(200) NOT NULL, TxText text NOT NULL, TxAnnotatedText longtext NOT NULL, TxAudioURI varchar(200) DEFAULT NULL, TxSourceURI varchar(1000) DEFAULT NULL, PRIMARY KEY (TxID), KEY TxLgID (TxLgID) ) ENGINE=MyISAM DEFAULT CHARSET=utf8", '');
// 	}

// 	if (in_array(tbpref . 'words', tables) === FALSE) {
// 		if (debug)
// 			echo '<p>DEBUG: rebuilding words</p>';
// 		runsql("CREATE TABLE IF NOT EXISTS " . tbpref . "words ( WoID int(11) unsigned NOT NULL AUTO_INCREMENT, WoLgID int(11) unsigned NOT NULL, WoText varchar(250) NOT NULL, WoTextLC varchar(250) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL, WoStatus tinyint(4) NOT NULL, WoTranslation varchar(500) NOT NULL DEFAULT '*', WoRomanization varchar(100) DEFAULT NULL, WoSentence varchar(1000) DEFAULT NULL, WoCreated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, WoStatusChanged timestamp NOT NULL DEFAULT '0000-00-00 00:00:00', WoTodayScore double NOT NULL DEFAULT '0', WoTomorrowScore double NOT NULL DEFAULT '0', WoRandom double NOT NULL DEFAULT '0', PRIMARY KEY (WoID), UNIQUE KEY WoLgIDTextLC (WoLgID,WoTextLC), KEY WoLgID (WoLgID), KEY WoStatus (WoStatus), KEY WoTextLC (WoTextLC), KEY WoTranslation (WoTranslation(333)), KEY WoCreated (WoCreated), KEY WoStatusChanged (WoStatusChanged), KEY WoTodayScore (WoTodayScore), KEY WoTomorrowScore (WoTomorrowScore), KEY WoRandom (WoRandom) ) ENGINE=MyISAM DEFAULT CHARSET=utf8", '');
// 	}

// 	if (in_array(tbpref . 'tags', tables) === FALSE) {
// 		if (debug)
// 			echo '<p>DEBUG: rebuilding tags</p>';
// 		runsql("CREATE TABLE IF NOT EXISTS " . tbpref . "tags ( TgID int(11) unsigned NOT NULL AUTO_INCREMENT, TgText varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL, TgComment varchar(200) NOT NULL DEFAULT '', PRIMARY KEY (TgID), UNIQUE KEY TgText (TgText) ) ENGINE=MyISAM DEFAULT CHARSET=utf8", '');
// 	}

// 	if (in_array(tbpref . 'wordtags', tables) === FALSE) {
// 		if (debug)
// 			echo '<p>DEBUG: rebuilding wordtags</p>';
// 		runsql("CREATE TABLE IF NOT EXISTS " . tbpref . "wordtags ( WtWoID int(11) unsigned NOT NULL, WtTgID int(11) unsigned NOT NULL, PRIMARY KEY (WtWoID,WtTgID), KEY WtTgID (WtTgID), KEY WtWoID (WtWoID) ) ENGINE=MyISAM DEFAULT CHARSET=utf8", '');
// 	}

// 	if (in_array(tbpref . 'tags2', tables) === FALSE) {
// 		if (debug)
// 			echo '<p>DEBUG: rebuilding tags2</p>';
// 		runsql("CREATE TABLE IF NOT EXISTS " . tbpref . "tags2 ( T2ID int(11) unsigned NOT NULL AUTO_INCREMENT, T2Text varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL, T2Comment varchar(200) NOT NULL DEFAULT '', PRIMARY KEY (T2ID), UNIQUE KEY T2Text (T2Text) ) ENGINE=MyISAM DEFAULT CHARSET=utf8", '');
// 	}

// 	if (in_array(tbpref . 'texttags', tables) === FALSE) {
// 		if (debug)
// 			echo '<p>DEBUG: rebuilding texttags</p>';
// 		runsql("CREATE TABLE IF NOT EXISTS " . tbpref . "texttags ( TtTxID int(11) unsigned NOT NULL, TtT2ID int(11) unsigned NOT NULL, PRIMARY KEY (TtTxID,TtT2ID), KEY TtTxID (TtTxID), KEY TtT2ID (TtT2ID) ) ENGINE=MyISAM DEFAULT CHARSET=utf8", '');
// 	}

// 	if (in_array(tbpref . 'archtexttags', tables) === FALSE) {
// 		if (debug)
// 			echo '<p>DEBUG: rebuilding archtexttags</p>';
// 		runsql("CREATE TABLE IF NOT EXISTS " . tbpref . "archtexttags ( AgAtID int(11) unsigned NOT NULL, AgT2ID int(11) unsigned NOT NULL, PRIMARY KEY (AgAtID,AgT2ID), KEY AgAtID (AgAtID), KEY AgT2ID (AgT2ID) ) ENGINE=MyISAM DEFAULT CHARSET=utf8", '');
// 	}

// 	if (count > 0) {
// 		// Rebuild Text Cache if cache tables new
// 		if (debug)
// 			echo '<p>DEBUG: rebuilding cache tables</p>';
// 		reparse_all_texts();
// 	}

// 	// DB Version

// 	currversion = get_version_number();

// 	res = mysqli_query(GLOBALS['DBCONNECTION'], "select StValue as value from " . tbpref . "settings where StKey = 'dbversion'");
// 	if (mysqli_errno(GLOBALS['DBCONNECTION']) !== 0)
// 		my_die('There is something wrong with your database ' . dbname . '. Please reinstall.');
// 	record = mysqli_fetch_assoc(res);
// 	if (record) {
// 		dbversion = record["value"];
// 	} else {
// 		dbversion = 'v001000000';
// 	}
// 	mysqli_free_result(res);

// 	// Do DB Updates if tables seem to be old versions

// 	if (dbversion < currversion) {
// 		if (debug)
// 			echo "<p>DEBUG: do DB updates: dbversion --&gt; currversion</p>";
// 		runsql("ALTER TABLE " . tbpref . "words ADD WoTodayScore DOUBLE NOT NULL DEFAULT 0, ADD WoTomorrowScore DOUBLE NOT NULL DEFAULT 0, ADD WoRandom DOUBLE NOT NULL DEFAULT 0", '', sqlerrdie = FALSE);
// 		runsql("ALTER TABLE " . tbpref . "words ADD INDEX WoTodayScore (WoTodayScore), ADD INDEX WoTomorrowScore (WoTomorrowScore), ADD INDEX WoRandom (WoRandom)", '', sqlerrdie = FALSE);
// 		runsql("ALTER TABLE " . tbpref . "languages ADD LgRightToLeft INT(1) UNSIGNED NOT NULL DEFAULT  0", '', sqlerrdie = FALSE);
// 		runsql("ALTER TABLE " . tbpref . "texts ADD TxAnnotatedText LONGTEXT NOT NULL AFTER TxText", '', sqlerrdie = FALSE);
// 		runsql("ALTER TABLE " . tbpref . "archivedtexts ADD AtAnnotatedText LONGTEXT NOT NULL AFTER AtText", '', sqlerrdie = FALSE);
// 		runsql("ALTER TABLE " . tbpref . "tags CHANGE TgComment TgComment VARCHAR(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT ''", '', sqlerrdie = FALSE);
// 		runsql("ALTER TABLE " . tbpref . "tags2 CHANGE T2Comment T2Comment VARCHAR(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT ''", '', sqlerrdie = FALSE);
// 		runsql("ALTER TABLE " . tbpref . "languages CHANGE LgGoogleTTSURI LgExportTemplate VARCHAR(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL", '', sqlerrdie = FALSE);
// 		runsql("ALTER TABLE " . tbpref . "texts ADD TxSourceURI VARCHAR(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL", '', sqlerrdie = FALSE);
// 		runsql("ALTER TABLE " . tbpref . "archivedtexts ADD AtSourceURI VARCHAR(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL", '', sqlerrdie = FALSE);
// 		// set to current.
// 		saveSetting('dbversion', currversion);
// 		saveSetting('lastscorecalc', ''); // do next section, too
// 	}

// 	// Do Scoring once per day, clean Word/Texttags, and optimize db

// 	lastscorecalc = getSetting('lastscorecalc');
// 	today = date('Y-m-d');
// 	if (lastscorecalc !== today) {
// 		if (debug)
// 			echo '<p>DEBUG: Doing score recalc. Today: ' . today . ' / Last: ' . lastscorecalc . '</p>';
// 		runsql("UPDATE " . tbpref . "words SET " . make_score_random_insert_update('u'), '');
// 		runsql("DELETE " . tbpref . "wordtags FROM (" . tbpref . "wordtags LEFT JOIN " . tbpref . "tags on WtTgID = TgID) WHERE TgID IS NULL", '');
// 		runsql("DELETE " . tbpref . "wordtags FROM (" . tbpref . "wordtags LEFT JOIN " . tbpref . "words on WtWoID = WoID) WHERE WoID IS NULL", '');
// 		runsql("DELETE " . tbpref . "texttags FROM (" . tbpref . "texttags LEFT JOIN " . tbpref . "tags2 on TtT2ID = T2ID) WHERE T2ID IS NULL", '');
// 		runsql("DELETE " . tbpref . "texttags FROM (" . tbpref . "texttags LEFT JOIN " . tbpref . "texts on TtTxID = TxID) WHERE TxID IS NULL", '');
// 		runsql("DELETE " . tbpref . "archtexttags FROM (" . tbpref . "archtexttags LEFT JOIN " . tbpref . "tags2 on AgT2ID = T2ID) WHERE T2ID IS NULL", '');
// 		runsql("DELETE " . tbpref . "archtexttags FROM (" . tbpref . "archtexttags LEFT JOIN " . tbpref . "archivedtexts on AgAtID = AtID) WHERE AtID IS NULL", '');
// 		optimizedb();
// 		saveSetting('lastscorecalc', today);
// 	}
// }

// // -------------------------------------------------------------

// //////////////////  S T A R T  /////////////////////////////////

// // Start Timer

// if (dspltime)
// 	get_execution_time();

// // Connection, @ suppresses messages from function

// @mysqli_report(MYSQLI_REPORT_OFF); // added because mysqli_report default setting in PHP 8.1+ has changed

// DBCONNECTION = @mysqli_connect(server, userid, passwd, dbname);

// if ((!DBCONNECTION) && mysqli_connect_errno() === 1049) {
// 	DBCONNECTION = @mysqli_connect(server, userid, passwd);
// 	if (!DBCONNECTION)
// 		my_die('DB connect error (MySQL not running or connection parameters are wrong; start MySQL and/or correct file "connect.inc"). Please read the documentation: https://learning-with-texts.sourceforge.io [Error Code: ' . mysqli_connect_errno() . ' / Error Message: ' . mysqli_connect_error() . ']');
// 	runsql("CREATE DATABASE `" . dbname . "` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci", '');
// 	mysqli_close(DBCONNECTION);
// 	DBCONNECTION = @mysqli_connect(server, userid, passwd, dbname);
// }

// if (!DBCONNECTION)
// 	my_die('DB connect error (MySQL not running or connection parameters are wrong; start MySQL and/or correct file "connect.inc"). Please read the documentation: https://learning-with-texts.sourceforge.io [Error Code: ' . mysqli_connect_errno() . ' / Error Message: ' . mysqli_connect_error() . ']');

// @mysqli_query(DBCONNECTION, "SET NAMES 'utf8'");

// // @mysqli_query(DBCONNECTION, "SET SESSION sql_mode = 'STRICT_ALL_TABLES'");
// @mysqli_query(DBCONNECTION, "SET SESSION sql_mode = ''");

// // *** GLOBAL VARAIABLES ***
// // tbpref = Current Table Prefix
// // fixed_tbpref = Table Prefix is fixed, no changes possible
// // *** GLOBAL VARAIABLES ***

// // Is tbpref set in connect.inc? Take it and fixed_tbpref=1.
// // If not: fixed_tbpref=0. Is it set in table "_lwtgeneral"? Take it.
// // If not: Use tbpref = '' (no prefix, old/standard behaviour).

// if (!isset(tbpref)) {
// 	fixed_tbpref = 0;
// 	p = LWTTableGet("current_table_prefix");
// 	if (isset(p))
// 		tbpref = p;
// 	else {
// 		tbpref = '';
// 	}
// } else
// 	fixed_tbpref = 1;

// len_tbpref = strlen(tbpref);
// if (len_tbpref > 0) {
// 	if (len_tbpref > 20)
// 		my_die('Table prefix/set "' . tbpref . '" longer than 20 digits or characters. Please fix in "connect.inc".');
// 	for (i = 0; i < len_tbpref; i++)
// 		if (strpos("_0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", substr(tbpref, i, 1)) === FALSE)
// 			my_die('Table prefix/set "' . tbpref . '" contains characters or digits other than 0-9, a-z, A-Z or _. Please fix in "connect.inc".');
// }

// if (!fixed_tbpref)
// 	LWTTableSet("current_table_prefix", tbpref);

// // *******************************************************************
// // IF PREFIX IS NOT '', THEN ADD A '_', TO ENSURE NO IDENTICAL NAMES
// if (tbpref !== '')
// 	tbpref += "_";
// // *******************************************************************

// // check/update db
// check_update_db();

// // -------------------------------------------------------------

// ?>

/**
 *
 * @param f
 * //  * TODO onSubmit?
 * @param sel
 * @param n
 */
export function allActionGo({
  sel,
  numRecords: numRecords,
  onAddTag,
  onSetCapitalization,
  onSetStrength,
  onExport,
  onClear,
}: {
  sel: { value: string; text: string } | undefined;
  numRecords: number;
  onExport: () => void;
  onClear: () => void;
  onAddTag: (tagStr: string) => void;
  onSetCapitalization: SetBoolHandler;
  onSetStrength: (strength: NumericalStrength) => void;
}) {
  if (sel !== undefined) {
    const v = sel.value;
    if (typeof v === 'string') {
      if (v === 'addtagall' || v === 'deltagall') {
        const answer = verifyAddTagWindow(sel.text, numRecords);
        if (answer !== '') {
          onAddTag(answer);
        }
      } else if (
        v === 'delall' ||
        v === 'smi1all' ||
        v === 'spl1all' ||
        v === 's1all' ||
        v === 's5all' ||
        v === 's98all' ||
        v === 's99all' ||
        v === 'todayall' ||
        v === 'delsentall' ||
        v === 'capall' ||
        v === 'lowerall'
      ) {
        const answer = confirm(
          'THIS IS AN ACTION ON ALL RECORDS\nON ALL PAGES OF THE CURRENT QUERY!\n\n*** ' +
            sel.text +
            ' ***\n\n*** ' +
            numRecords +
            ' Record(s) will be affected ***\n\nARE YOU SURE?'
        );
        if (answer) {
          switch (v) {
            case 'capall':
              return onSetCapitalization(true);
            case 'lowerall':
              return onSetCapitalization(true);
            case 's1all':
              return onSetStrength(1);
            case 's5all':
              return onSetStrength(5);
            case 's98all':
              return onSetStrength(98);
            case 's99all':
              return onSetStrength(99);
            // TODO others
          }
        }
      } else if (v === 'expall' || v === 'expall2' || v === 'expall3') {
        return onExport();
      }
    }
    onClear();
  }
}

/**
 *
 * @param form
 * @param sel
 */
export function multiActionGo(
  sel: undefined | HTMLSelectElement,
  numChecked: number
) {
  if (typeof sel !== 'undefined') {
    const v = sel.value;
    const t = sel.options[sel.selectedIndex].text;
    if (typeof v === 'string') {
      if (v === 'addtag' || v === 'deltag') {
        const answer: string | null = verifyAddTagWindow(t, sel.options.length);
        if (answer !== '') {
          // onTagAnswer()
          return { tagChange: answer };
        }
      } else if (
        v === 'del' ||
        v === 'smi1' ||
        v === 'spl1' ||
        v === 's1' ||
        v === 's5' ||
        v === 's98' ||
        v === 's99' ||
        v === 'today' ||
        v === 'delsent' ||
        v === 'lower' ||
        v === 'cap'
      ) {
        const answer = confirm(
          `*** ${t} ***\n\n*** ${numChecked} Record${pluralize(
            numChecked
          )} will be affected ***\n\nAre you sure?`
        );
        if (answer) {
          // onSet()
          return true;
        }
      } else {
        return true;
      }
    }
    sel.value = '';
  }
}
// TODO pipe into here
// if (isset($_REQUEST['markaction'])) {
// 	markaction = $_REQUEST['markaction'];
// 	actiondata = (getreq('data'));
// 	message = "Multiple Actions: 0";
// 	if (isset($_REQUEST['marked'])) {
// 		if (is_array($_REQUEST['marked'])) {
// 			l = count($_REQUEST['marked']);
// 			if (l > 0 ) {
// 				list = "(" . $_REQUEST['marked'][0];
// 				for (i=1; i<l; i++) list .= "," . $_REQUEST['marked'][i];
// 				list .= ")";
// 				if (markaction === 'del') {
// 					message = runsql('delete from ' . tbpref . 'words where WoID in ' . list, "Deleted");
// 					adjust_autoincr('words','WoID');
// 					runsql("DELETE " . tbpref . "wordtags FROM (" . tbpref . "wordtags LEFT JOIN " . tbpref . "words on WtWoID = WoID) WHERE WoID IS NULL",'');
// 				}
// 				elseif (markaction === 'addtag' ) {
// 					message = addtaglist(actiondata,list);
// 				}
// 				elseif (markaction === 'deltag' ) {
// 					message = removetaglist(actiondata,list);
// 					header("Location: edit_words");
// 					exit();
// 				}
// 				elseif (markaction === 'spl1' ) {
// 					message = runsql('update ' . tbpref . 'words set WoStatus=WoStatus+1, WoStatusChanged = NOW(),' . make_score_random_insert_update('u') . ' where WoStatus in (1,2,3,4) and WoID in ' . list, "Updated Status (+1)");
// 				}
// 				elseif (markaction === 'smi1' ) {
// 					message = runsql('update ' . tbpref . 'words set WoStatus=WoStatus-1, WoStatusChanged = NOW(),' . make_score_random_insert_update('u') . ' where WoStatus in (2,3,4,5) and WoID in ' . list, "Updated Status (-1)");
// 				}
// 				elseif (markaction === 's5' ) {
// 					message = runsql('update ' . tbpref . 'words set WoStatus=5, WoStatusChanged = NOW(),' . make_score_random_insert_update('u') . ' where WoID in ' . list, "Updated Status (=5)");
// 				}
// 				elseif (markaction === 's1' ) {
// 					message = runsql('update ' . tbpref . 'words set WoStatus=1, WoStatusChanged = NOW(),' . make_score_random_insert_update('u') . ' where WoID in ' . list, "Updated Status (=1)");
// 				}
// 				elseif (markaction === 's99' ) {
// 					message = runsql('update ' . tbpref . 'words set WoStatus=99, WoStatusChanged = NOW(),' . make_score_random_insert_update('u') . ' where WoID in ' . list, "Updated Status (=99)");
// 				}
// 				elseif (markaction === 's98' ) {
// 					message = runsql('update ' . tbpref . 'words set WoStatus=98, WoStatusChanged = NOW(),' . make_score_random_insert_update('u') . ' where WoID in ' . list, "Updated Status (=98)");
// 				}
// 				elseif (markaction === 'today' ) {
// 					message = runsql('update ' . tbpref . 'words set WoStatusChanged = NOW(),' . make_score_random_insert_update('u') . ' where WoID in ' . list, "Updated Status Date (= Now)");
// 				}
// 				elseif (markaction === 'delsent' ) {
// 					message = runsql('update ' . tbpref . 'words set WoSentence = NULL where WoID in ' . list, "Term Sentence(s) deleted");
// 				}
// 				elseif (markaction === 'lower' ) {
// 					message = runsql('update ' . tbpref . 'words set WoText = WoTextLC where WoID in ' . list, "Term(s) set to lowercase");
// 				}
// 				elseif (markaction === 'cap' ) {
// 					message = runsql('update ' . tbpref . 'words set WoText = CONCAT(UPPER(LEFT(WoTextLC,1)),SUBSTRING(WoTextLC,2)) where WoID in ' . list, "Term(s) capitalized");
// 				}
// 				elseif (markaction === 'exp' ) {
// 					anki_export('select distinct WoID, LgRightToLeft, LgRegexpWordCharacters, LgName, WoText, WoTranslation, WoRomanization, WoSentence, ifnull(group_concat(distinct TgText order by TgText separator \' \'),\'\') as taglist from ((' . tbpref . 'words left JOIN ' . tbpref . 'wordtags ON WoID = WtWoID) left join ' . tbpref . 'tags on TgID = WtTgID), ' . tbpref . 'languages where WoLgID = LgID AND WoTranslation !== \'\' AND WoTranslation !== \'*\' and WoSentence like concat(\'%{\',WoText,\'}%\') and WoID in ' . list . ' group by WoID');
// 				}
// 				elseif (markaction === 'exp2' ) {
// 					tsv_export('select distinct WoID, LgName, WoText, WoTranslation, WoRomanization, WoSentence, WoStatus, ifnull(group_concat(distinct TgText order by TgText separator \' \'),\'\') as taglist from ((' . tbpref . 'words left JOIN ' . tbpref . 'wordtags ON WoID = WtWoID) left join ' . tbpref . 'tags on TgID = WtTgID), ' . tbpref . 'languages where WoLgID = LgID and WoID in ' . list . ' group by WoID');
// 				}
// 				elseif (markaction === 'exp3' ) {
// 					flexible_export('select distinct WoID, LgName, LgExportTemplate, LgRightToLeft, WoText, WoTextLC, WoTranslation, WoRomanization, WoSentence, WoStatus, ifnull(group_concat(distinct TgText order by TgText separator \' \'),\'\') as taglist from ((' . tbpref . 'words left JOIN ' . tbpref . 'wordtags ON WoID = WtWoID) left join ' . tbpref . 'tags on TgID = WtTgID), ' . tbpref . 'languages where WoLgID = LgID and WoID in ' . list . ' group by WoID');
// 				}
// 				elseif (markaction === 'test' ) {
// 					$_SESSION['testsql'] = ' ' . tbpref . 'words where WoID in ' . list . ' ';
// 					header("Location: do_test?selection=1");
// 					exit();
// 				}
// 			}
// 		}
// 	}
// }

export type RawTextItem = TextItem;
// Pick<
//   TextItem,
//   // TODO
//   // | 'TiSeID'
// >;
/**
 *
 * @param t
 * @param numChecked
 */
export function verifyAddTagWindow(t: string, numChecked: number) {
  let notok = 1;
  let answer: string | null = '';
  while (notok) {
    answer = prompt(
      `*** ${t} ***\n\n*** ${numChecked} Record(s) will be affected ***\n\nPlease enter one tag (20 char. max., no spaces, no commas -- or leave empty to cancel:`,
      answer
    );
    if (typeof answer === 'object') answer = '';
    if (answer.indexOf(' ') > 0 || answer.indexOf(',') > 0) {
      alert('Please no spaces or commas!');
    } else if (answer.length > 20) {
      alert('Please no tags longer than 20 char.!');
    } else {
      notok = 0;
    }
  }
  return answer;
}

/**
 *
 * @param text
 * @param language
 * @param id
 */
export function splitCheckText(
  text: Pick<Text, 'TxText' | 'TxID'>,
  language: Language,
  sentenceStartID: SentencesID = 0 as SentencesID,
  textItemStartID: TextItemsID = 0 as TextItemsID
) {
  const { LgRegexpWordCharacters, LgRemoveSpaces } = language;
  const sArray = buildSentences(text, language, sentenceStartID);

  // TODO make sure PREG_SPLIT_DELIM_CAPTURE isnt doing anything we're not
  const reNotTermMatch = new RegExp(
    `([^${LgRegexpWordCharacters.replace(
      // javascript handles unicode different than php
      new RegExp('\\x{([A-F0-9]*)}', 'g'),
      '\\m$1'
    )}]{1,})`,
    'g'
  );
  const symbolList: RawTextItem[] = sArray
    .map(({ SeText: val, SeID }, ss) =>
      val
        .split(reNotTermMatch)
        .filter((term) => term !== '')
        .map((term, ii) => ({
          TiIsNotWord: reNotTermMatch.test(term) ? (1 as const) : (0 as const),
          // TODO should already be even-odd here?
          // isTerm: ii % 2 === 0,
          TiText: term.trim(),
          // TODO locale lowercase?
          TiTextLC: term.trim().toLowerCase(),
          TiOrder: ii + ss,
          // TODO
          TiWordCount: 1,
          TiLgID: language.LgID,
          TiTxID: text.TxID,
          TiSeID: SeID,
          TiID: (textItemStartID + ii) as TextItemsID,
        }))
    )
    .flat();

  const { wordCount, sepsCount } = symbolList.reduce<{
    wordCount: Record<string, number>;
    sepsCount: Record<string, number>;
  }>(
    (prev, curr) => {
      // TODO
      // %2===0 => is word
      // if (ii % 2 === 0) {
      if (!curr.TiIsNotWord) {
        const wordKey = curr.TiText.toLowerCase();
        return {
          ...prev,
          wordCount: {
            ...prev.wordCount,
            [wordKey]: prev.wordCount[wordKey]
              ? prev.wordCount[wordKey] + 1
              : 1,
          },
        };
      }
      // %2===1 => is sep
      const sepKey = remove_spaces(curr.TiText, LgRemoveSpaces);
      return {
        ...prev,
        sepsCount: {
          ...prev.sepsCount,
          [sepKey]: prev.sepsCount[sepKey] ? prev.sepsCount[sepKey] + 1 : 1,
        },
      };
    },
    { wordCount: {}, sepsCount: {} }
  );

  return { wordCount, sArray, sepsCount, symbolList };
}
type RawSentence = Sentence;

/**
 *
 * @param text
 */
export function buildSentences(
  text: Pick<Text, 'TxText' | 'TxID'>,
  {
    LgCharacterSubstitutions,
    LgSplitEachChar,
    LgRegexpSplitSentences,
    LgExceptionsSplitSentences,
    LgID,
  }: Language,
  startAt: SentencesID = 0 as SentencesID
): RawSentence[] {
  const replace = LgCharacterSubstitutions.split('|');

  let s = cleanText(text.TxText, LgSplitEachChar);

  s = s.replace('{', '[').replace('}', ']');

  replace.forEach((repEquation) => {
    const repChars = repEquation.split('=');
    if (repChars.length >= 2) {
      s = s.replace(repChars[0].trim(), repChars[1].trim());
    }
  });

  s = s.trim();

  if (LgExceptionsSplitSentences !== '') {
    const reNoSplit = new RegExp(`/(${LgExceptionsSplitSentences})\\s`, 'g');
    s = s.replace(reNoSplit, '$1‧');
  }
  const reSplitSentence = new RegExp(`([${LgRegexpSplitSentences}¶])`, 'g');
  console.log('TEST123-PARSE-SENTENCE-PRE', s, reSplitSentence);
  s = s
    // \n seems to be used as an intermediate char here?
    .replace(reSplitSentence, '$1\n')
    .replace(new RegExp(' ¶\\n', 'g'), '\n¶\n')
    .replace('‧', ' ')
    .trim();
  console.log('TEST123-PARSE-SENTENCE', s);
  const sentences: RawSentence[] = s
    .split('\n')
    .filter((sent) => sent.trim() !== '')
    // TODO
    // 		while (pos !== false && i > 0) {
    // 			s[i - 1] .= " " . s[i];
    // 			for (j = i + 1; j < l; j++)
    // 				s[j - 1] = s[j];
    // 			array_pop(s);
    // 			l = count(s);
    // 			pos = strpos(LgRegexpSplitSentences, s[i]);
    // 		}
    .map((sent, ii) => {
      const trimmed = sent.trim();
      // TODO
      // const pos = LgRegexpSplitSentences.indexOf(trimmed);
      return {
        SeText: trimmed,
        SeOrder: ii,
        SeID: (ii + startAt) as SentencesID,
        SeLgID: LgID,
        SeTxID: text.TxID,
      };
    });
  // .filter((val) => val !== '');
  // TODO
  // const l = sentences.length;
  // sentences.map(({ SeText: val }) => {
  // const pos = val.indexOf(LgRegexpSplitSentences);
  // const cleanedVal = val.trim();
  // });
  return sentences;
}

/**
 *
 * @param text
 * @param LgSplitEachChar
 */
export function cleanText(
  text: string,
  LgSplitEachChar: LanguageNoID['LgSplitEachChar']
) {
  let s = text
    .replace(new RegExp('\\r\\n', 'g'), '\n')
    .replace(new RegExp('\\n', 'g'), ' ¶ ')
    .replace(new RegExp('\\t', 'g'), ' ')
    .trim();
  if (LgSplitEachChar) {
    // add space after anything not a space
    console.log('TEST123-spliteachchar', s);
    s = s.replace(new RegExp(/([^\s])/u, 'g'), '$1 ');
    console.log('TEST123-spliteachchar', s);
  }
  // replace any multiple spaces with single space
  s = s.replace(/\s{2,}/u, ' ');
  return s;
}

// TODO

export function check_dupl_lang() {}
/**
 *
 * @param method
 */
export function getsqlscoreformula(
  checkingDate: Date,
  word: Pick<Word, 'WoStatus' | 'WoStatusChanged'>
) {
  // method = 2 (today)
  // method = 3 (tomorrow)
  // Formula: {{{2.4^{Status}+Status-Days-1} over Status -2.4} over 0.14325248}
  const { WoStatus, WoStatusChanged } = word;
  if (WoStatus > 5) {
    return 100;
  }
  const score =
    (((2.4 ^ WoStatus) +
      WoStatus -
      DateDiff(checkingDate, new Date(WoStatusChanged)) -
      1) /
      WoStatus -
      2.4) /
    0.14325248;
  return score;
}
export function AreUnknownWordsInSentence(
  sentno: SentencesID,
  textItems: TextItem[],
  words: Word[]
) {
  const numTextItemsForThisSentence = textItems.filter(
    (item) =>
      item.TiSeID === sentno &&
      item.TiWordCount === 1 &&
      item.TiIsNotWord === 0 &&
      words.find((word) => word.WoTextLC === item.TiTextLC) === undefined
  ).length;
  return numTextItemsForThisSentence === 0;
}
