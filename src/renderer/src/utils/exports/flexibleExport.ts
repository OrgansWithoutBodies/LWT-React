// // -------------------------------------------------------------

// function flexible_export(sql)
// {
// 	// WoID, LgName, LgExportTemplate, LgRightToLeft, WoText, WoTextLC, WoTranslation, WoRomanization, WoSentence, WoStatus, taglist
// 	res = do_mysqli_query(sql);
// 	x = '';
// 	while (record = mysqli_fetch_assoc(res)) {
// 		if (isset(record['LgExportTemplate'])) {
// 			woid = record['WoID'] + 0;
// 			langname = replaceTabsWithNewLine(record['LgName']);
// 			rtlScript = record['LgRightToLeft'];
// 			span1 = (rtlScript ? '<span dir="rtl">' : '');
// 			span2 = (rtlScript ? '</span>' : '');
// 			term = replaceTabsWithNewLine(record['WoText']);
// 			term_lc = replaceTabsWithNewLine(record['WoTextLC']);
// 			transl = replaceTabsWithNewLine(record['WoTranslation']);
// 			rom = replaceTabsWithNewLine(record['WoRomanization']);
// 			sent_raw = replaceTabsWithNewLine(record['WoSentence']);
// 			sent = str_replace('{', '', str_replace('}', '', sent_raw));
// 			sent_c = mask_term_in_sentence_v2(sent_raw);
// 			sent_d = str_replace('{', '[', str_replace('}', ']', sent_raw));
// 			sent_x = str_replace('{', '{{c1::', str_replace('}', '}}', sent_raw));
// 			sent_y = str_replace('{', '{{c1::', str_replace('}', '::' . transl . '}}', sent_raw));
// 			status = record['WoStatus'] + 0;
// 			taglist = trim(record['taglist']);
// 			xx = replaceTabsWithNewLine(record['LgExportTemplate']);
// 			xx = str_replace('%w', term, xx);
// 			xx = str_replace('%t', transl, xx);
// 			xx = str_replace('%s', sent, xx);
// 			xx = str_replace('%c', sent_c, xx);
// 			xx = str_replace('%d', sent_d, xx);
// 			xx = str_replace('%r', rom, xx);
// 			xx = str_replace('%a', status, xx);
// 			xx = str_replace('%k', term_lc, xx);
// 			xx = str_replace('%z', taglist, xx);
// 			xx = str_replace('%l', langname, xx);
// 			xx = str_replace('%n', woid, xx);
// 			xx = str_replace('%%', '%', xx);
// 			xx = str_replace('w', span1 . tohtml(term) . span2, xx);
// 			xx = str_replace('t', tohtml(transl), xx);
// 			xx = str_replace('s', span1 . tohtml(sent) . span2, xx);
// 			xx = str_replace('c', span1 . tohtml(sent_c) . span2, xx);
// 			xx = str_replace('d', span1 . tohtml(sent_d) . span2, xx);
// 			xx = str_replace('x', span1 . tohtml(sent_x) . span2, xx);
// 			xx = str_replace('y', span1 . tohtml(sent_y) . span2, xx);
// 			xx = str_replace('r', tohtml(rom), xx);
// 			xx = str_replace('k', span1 . tohtml(term_lc) . span2, xx);
// 			xx = str_replace('z', tohtml(taglist), xx);
// 			xx = str_replace('l', tohtml(langname), xx);
// 			xx = str_replace('$$', '$', xx);
// 			xx = str_replace('\\t', "\t", xx);
// 			xx = str_replace('\\n', "\n", xx);
// 			xx = str_replace('\\r', "\r", xx);
// 			xx = str_replace('\\\\', '\\', xx);
// 			x += xx;
// 		}
// 	}
// 	mysqli_free_result(res);
// 	header('Content-type: text/plain; charset=utf-8');
// 	header("Content-disposition: attachment; filename=lwt_flexible_export_" . date('Y-m-d-H-i-s') . ".txt");
// 	echo x;
// 	exit();
// }
