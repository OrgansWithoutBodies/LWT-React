import { getDirTag } from 'lwt-common';
import {
  Language,
  NumericalStrengthPotentiallyCompound,
  StrengthMapNumericalKey,
  Text,
  TextItem,
  TextItemsID,
  TextsID,
  Word,
} from 'lwt-schemas';
import { useData } from 'lwt-state';
import {
  A,
  Header,
  Icon,
  useInternalNavigate,
  useThemeColors,
  useUpdateActiveText,
  useUpdateParams,
} from 'lwt-ui-kit';
import { changeImprAnnRadio, changeImprAnnText } from '../IO/CheckForm';
import { AnnPlcmnt, AnnType } from './Annotation.types';
/**
 *
 */
export function PrintText({
  textID,
  ann,
  status,
  annplcmnt,
}: {
  textID: TextsID;
  ann: AnnType;
  status: NumericalStrengthPotentiallyCompound;
  annplcmnt: AnnPlcmnt;
}) {
  // TODO
  const statusRange = 1;
  const [{ texts, languages, textitems, words, wordHashmapByLC }] = useData([
    'texts',
    'languages',
    'textitems',
    'words',
    'wordHashmapByLC',
  ]);
  useUpdateActiveText({ txID: textID });

  const paramUpdater = useUpdateParams();
  const navigator = useInternalNavigate();
  const showingText = texts.find(({ TxID }) => TxID === textID);
  if (!showingText) {
    throw new Error('invalid Text ID!');
  }
  const textItemsForThisText = textitems
    .filter((val) => val.TiTxID === textID)
    .sort((a, b) => (a.TiOrder > b.TiOrder ? 1 : -1));
  console.log('test123-PRINT', textitems, textItemsForThisText);
  const language = languages.find(({ LgID }) => LgID === showingText.TxLgID);
  if (!language) {
    throw new Error('invalid Text Language ID!');
  }
  if (!wordHashmapByLC) {
    return <></>;
  }
  const wordLookupKeyedByTextLC = wordHashmapByLC;

  const show_trans =
    ann === AnnType['Romanization & Translation'] ||
    ann === AnnType['Translation'] ||
    ann === AnnType['Translation & Tags'] ||
    ann === AnnType['Romanization, Translation & Tags'];
  const show_rom =
    ann === AnnType['Romanization & Translation'] ||
    ann === AnnType['Romanization'] ||
    ann === AnnType['Romanization, Translation & Tags'];
  return (
    <>
      <div className="noprint">
        <Header
          TitleDecoration={() => (
            <>
              {showingText.TxSourceURI ? (
                <a
                  href={showingText.TxSourceURI}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon src="chain" title="Text Source" />
                </a>
              ) : (
                <></>
              )}{' '}
            </>
          )}
          title={`PRINT ▶ ${showingText.TxTitle} `}
        />

        <p id="printoptions">
          Terms with <b>status(es)</b>{' '}
          <select
            id="status"
            defaultValue={status}
            onChange={({ target: { value } }) => {
              paramUpdater({ status: value });
            }}
          >
            <GetWordstatusSelectoptions v={statusRange} all not9899 />
          </select>{' '}
          ...
          <br />
          will be <b>annotated</b> with "
          <select
            id="ann"
            defaultValue={ann}
            onChange={({ target: { value } }) => {
              paramUpdater({ ann: value });
            }}
          >
            <option value="0">Nothing</option>
            <option value="1">Translation</option>
            <option value="5">Translation & Tags</option>
            <option value="2">Romanization</option>
            <option value="3">Romanization & Translation</option>
            <option value="7">Romanization, Translation & Tags</option>
          </select>
          <select
            id="annplcmnt"
            onChange={({ target: { value: val } }) => {
              paramUpdater({ annplcmnt: val });
            }}
          >
            <option value="0" selected={annplcmnt === 0}>
              behind
            </option>
            <option value="1" selected={annplcmnt === 1}>
              in front of
            </option>
            <option value="2" selected={annplcmnt === 2}>
              above (ruby)
            </option>
          </select>{' '}
          the term.
          <br />
          <input
            type="button"
            value="Print it!"
            onClick={() => window.print()}
          />{' '}
          (only the text below the line)
          {/* TODO */}
          {
            // get_first_value("select length(TxAnnotatedText) as value from " . tbpref . "texts where TxID = " . textID) */
          }
          {0 > 0 ? (
            <>
              &nbsp; | &nbsp; Or{' '}
              <input
                type="button"
                value="Print/Edit/Delete"
                onClick={() => navigator(`/print_impr_text?&text=${textID}`)}
              />{' '}
              your <b>Improved Annotated Text</b>
              {<GetAnnotationLink textID={textID} />}
            </>
          ) : (
            <>
              &nbsp; | &nbsp;{' '}
              <input
                type="button"
                value="Create"
                onClick={() =>
                  navigator(`/print_impr_text?edit=1&text=${textID}`)
                }
              />{' '}
              an <b>Improved Annotated Text</b> [
              <Icon src="tick" title="Annotated Text" />
              ].
            </>
          )}
        </p>
      </div>
      <div id="print" {...getDirTag(language)}>
        {
          <DisplayAnnotatedText
            language={language}
            showingText={showingText}
            textItemsForThisText={textItemsForThisText}
            wordLookupKeyedByTextLC={wordLookupKeyedByTextLC}
            annplcmnt={annplcmnt}
            show_trans={show_trans}
            show_rom={show_rom}
          />
        }
      </div>
    </>
  );
}
/**
 *
 */
export function DisplayAnnotatedText({
  language,
  showingText,
  textItemsForThisText,
  wordLookupKeyedByTextLC,
  annplcmnt,
  show_trans,
  show_rom,
  onClickTerm,
  onClickAnn,
  transClassName = 'anntransruby',
  hiddenTrans = {},
  hiddenAnns = {},
}: {
  language: Language;
  showingText: Text;
  textItemsForThisText: TextItem[];
  wordLookupKeyedByTextLC: Record<string, Word>;
  annplcmnt: AnnPlcmnt;
  show_trans: boolean;
  show_rom: boolean;
  onClickTerm?: (val: TextItemsID) => void;
  onClickAnn?: (val: TextItemsID) => void;
  // transClassName:keyof ReturnType<typeof createColors>
  transClassName?: 'anntransruby' | 'anntransruby2';
  hiddenAnns?: Record<TextItemsID, true>;
  hiddenTrans?: Record<TextItemsID, true>;
}) {
  const themeColors = useThemeColors();
  return (
    <p
      style={{
        fontSize: `${language.LgTextSize}%`,
        lineHeight: '1.35',
        marginBottom: '10px',
      }}
    >
      {showingText.TxTitle}
      <br />
      <br />
      {textItemsForThisText.map((textItem) => {
        const isTermHidden = hiddenTrans[textItem.TiID];
        const isAnnHidden = hiddenAnns[textItem.TiID];
        const wordForThisTextItem = wordLookupKeyedByTextLC[textItem.TiTextLC];
        const splitItems = textItem.TiText.split('¶');
        return (
          <>
            {annplcmnt === AnnPlcmnt['above (ruby)'] ? (
              <>
                <ruby>
                  {/* TODO React says these dont exist but they work :shrug: */}
                  <rb>
                    <span
                      onClick={() => onClickTerm && onClickTerm(textItem.TiID)}
                      style={{
                        cursor: onClickTerm ? 'pointer' : undefined,
                        color: isTermHidden
                          ? themeColors.lum4
                          : themeColors.lum0,
                        backgroundColor: isTermHidden
                          ? themeColors.lum4
                          : themeColors.lum6,
                      }}
                      className="anntermruby"
                    >
                      {textItem.TiText}
                    </span>
                  </rb>
                  {wordForThisTextItem && (
                    <rt>
                      {' '}
                      {show_trans && (
                        <span
                          className={transClassName}
                          style={{
                            cursor: onClickAnn ? 'pointer' : undefined,

                            color: isAnnHidden
                              ? themeColors.lum3
                              : themeColors.test7,
                            backgroundColor: isAnnHidden
                              ? themeColors.lum3
                              : themeColors.lum0,
                          }}
                          onClick={() =>
                            onClickAnn && onClickAnn(textItem.TiID)
                          }
                        >
                          {wordForThisTextItem.WoTranslation}
                        </span>
                      )}{' '}
                      {show_rom && !show_trans && (
                        <span className="annromrubysolo">
                          {wordForThisTextItem.WoRomanization}
                        </span>
                      )}{' '}
                      {show_rom && show_trans && (
                        <span className="annromruby" dir="ltr">
                          [ {wordForThisTextItem.WoTranslation}]
                        </span>
                      )}{' '}
                    </rt>
                  )}
                </ruby>{' '}
              </>
            ) : (
              <>
                {wordForThisTextItem &&
                  annplcmnt === AnnPlcmnt['in front of'] && (
                    <InlineAnnotation
                      word={wordForThisTextItem}
                      show_rom={show_rom}
                      show_trans={show_trans}
                    />
                  )}
                {/* TODO not always this class? unclear think only if known word */}
                <span className="annterm">
                  {splitItems.length === 1 ? (
                    <>{splitItems[0]}</>
                  ) : (
                    // TODO dont like this split pattern, figure out if necessary
                    splitItems.map((splitItem) => (
                      <p
                        style={{
                          fontSize: `${language.LgTextSize}%`,
                          lineHeight: 1.3,
                          marginBottom: '10px',
                        }}
                      >
                        {splitItem}
                      </p>
                    ))
                  )}
                </span>
                {wordForThisTextItem && annplcmnt === AnnPlcmnt['behind'] && (
                  <InlineAnnotation
                    word={wordForThisTextItem}
                    show_rom={show_rom}
                    show_trans={show_trans}
                  />
                )}{' '}
              </>
            )}
          </>
        );
      })}
      {/* {showingText.TxText} */}
    </p>
  );
}

/**
 *
 */
export function InlineAnnotation({
  word: { WoRomanization, WoTranslation },
  show_rom,
  show_trans,
}: {
  word: Pick<Word, 'WoRomanization' | 'WoTranslation'>;
  show_rom: boolean;
  show_trans: boolean;
}) {
  return (
    <>
      {show_trans && <span className="anntrans">{WoTranslation}</span>}
      {show_rom && !show_trans && (
        <span className="annrom">{WoRomanization}</span>
      )}
      {show_rom && show_trans && (
        <span className="annrom" dir="ltr">
          [{WoRomanization}]
        </span>
      )}
    </>
  );
}

/**
 *
 */
export function GetAnnotationLink({ textID }: { textID: TextsID }) {
  if (
    // TODO
    // get_first_value('select length(TxAnnotatedText) as value from ' . tbpref . 'texts where TxID=' . textID)
    0 > 0
  )
    return (
      <>
        &nbsp;
        <A href={`/print_impr_text?text=${textID}`} target="_top">
          <Icon src="tick" title="Annotated Text" />
        </A>
      </>
    );
  else return <></>;
}

/**
 *
 */
export function GetWordstatusSelectoptions({
  // defaultval
  v = 1,
  all,
  not9899,
  off = true,
}: {
  v: any;
  all: boolean;
  not9899: boolean;
  off?: boolean;
}) {
  return (
    <>
      {all && off && (
        <>
          <option value="" selected>
            [Filter off]
          </option>
        </>
      )}
      {(not9899
        ? Object.keys(StrengthMapNumericalKey).filter(
            (n) => !(n === 98 || n === 99)
          )
        : Object.keys(StrengthMapNumericalKey)
      ).map((n) => {
        const status = StrengthMapNumericalKey[n];
        return (
          <option key={n} value={n}>
            {status['name']} [{status['abbr']}]
          </option>
        );
      })}
      <option disabled>--------</option>
      <option value="12">Learning [1..2]</option>
      <option value="13">Learning [1..3]</option>
      <option value="14">Learning [1..4]</option>
      <option value="15">Learning/-ed [1..5]</option>
      <option disabled>--------</option>
      <option value="23">Learning [2..3]</option>
      <option value="24">Learning [2..4]</option>
      <option value="25">Learning/-ed [2..5]</option>
      <option disabled>--------</option>
      <option value="34">Learning [3..4]</option>
      <option value="35">Learning/-ed [3..5]</option>
      <option disabled>--------</option>
      <option value="45">Learning/-ed [4..5]</option>
      <option disabled>--------</option>
      <option value="599">All known [5+WKn]</option>
    </>
  );
}

// TODO
/**
 *
 * @param pagepos
 * @param word
 */
export function do_ajax_edit_impr_text(pagepos: number, word) {
  if (word == '') $('#editimprtextdata').html('<img src="icn/waiting2.gif" />');
  const textid = $('#editimprtextdata').attr('data_id');
  $.post('ajax_edit_impr_text', { id: textid, word }, function (data) {
    // alert(data);
    eval(data);
    $.scrollTo(pagepos);
    $('input.impr-ann-text').change(changeImprAnnText);
    $('input.impr-ann-radio').change(changeImprAnnRadio);
  });
}

// textid = $_POST["id"] + 0;
// wordlc = stripTheSlashesIfNeeded($_POST['word']);

// sql = 'select TxLgID, TxTitle from ' . tbpref . 'texts where TxID = ' . textid;
// res = do_mysqli_query(sql);
// record = mysqli_fetch_assoc(res);
// title = record['TxTitle'];
// langid = record['TxLgID'];
// mysqli_free_result(res);

// sql = 'select LgTextSize, LgRightToLeft from ' . tbpref . 'languages where LgID = ' . langid;
// res = do_mysqli_query(sql);
// record = mysqli_fetch_assoc(res);
// textsize = record['LgTextSize'] + 0;
// if (textsize > 100)
// 	textsize = intval(textsize * 0.8);
// rtlScript = record['LgRightToLeft'];
// mysqli_free_result(res);

// ann = get_first_value("select TxAnnotatedText as value from " . tbpref . "texts where TxID = " . textid);
// ann_exists = (strlen(ann) > 0);
// if (ann_exists) {
// 	ann = recreate_save_ann(textid, ann);
// 	ann_exists = (strlen(ann) > 0);
// }

// rr = "";
// r = "";
// r .= '<form ><table class="tab1" cellspacing="0" cellpadding="5"><tr>';
// r .= '<th class="th1 center">Text</th>';
// r .= '<th class="th1 center">Dict.</th>';
// r .= '<th class="th1 center">Edit<br />Term</th>';
// r .= '<th class="th1 center">Term Translations (Delim.: ' . tohtml(getSettingWithDefault('set-term-translation-delimiters')) . ')<br /><input type="button" value="Reload" onclick="do_ajax_edit_impr_text(0,\'\');" /></th>';
// r .= '</tr>';
// nonterms = "";
// items = preg_split('/[\n]/u', ann);
// i = 0;
// nontermbuffer = '';
// foreach (items as item) {
// 	i++;
// 	vals = preg_split('/[\t]/u', item);
// 	if (vals[0] > -1) {
// 		if (nontermbuffer !== '') {
// 			r .= '<tr><td class="td1 center" style="font-size:' . textsize . '%;">';
// 			r .= nontermbuffer;
// 			r .= '</td><td class="td1 right" colspan="3"><img class="click" src="icn/tick.png" title="Back to \'Display/Print Mode\'" alt="Back to \'Display/Print Mode\'" onclick="location.href=\'print_impr_text?text=' . textid . '\';" /></td></tr>';
// 			nontermbuffer = '';
// 		}
// 		id = '';
// 		trans = '';
// 		if (count(vals) > 2) {
// 			id = vals[2];
// 			if (is_numeric(id)) {
// 				if (
// 					get_first_value("select count(WoID) as value from " . tbpref . "words where WoID = "
// 						. id) < 1
// 				)
// 					id = '';
// 			}
// 		}
// 		if (count(vals) > 3)
// 			trans = vals[3];
// 		r .= '<tr><td class="td1 center" style="font-size:' . textsize . '%;"' .
// 			(rtlScript ? ' dir="rtl"' : '') . '><span id="term' . i . '">';
// 		r .= tohtml(vals[1]);
// 		mustredo = (trim(wordlc) === mb_strtolower(trim(vals[1]), 'UTF-8'));
// 		r .= '</span></td><td class="td1 center" nowrap="nowrap">';
// 		r .= makeDictLinks(langid, prepare_textdata_js(vals[1]));
// 		r .= '</td><td class="td1 center"><span id="editlink' . i . '">';
// 		if (id === '') {
// 			plus = '&nbsp;';
// 		} else {
// 			plus = '<a name="rec' . i . '"></a><span class="click" onclick="oewin(\'edit_word?fromAnn=\' + $(document).scrollTop() + \'&wid=' . id . '\');"><img src="icn/sticky-note--pencil.png" title="Edit Term" alt="Edit Term" /></span>';
// 		}
// 		if (mustredo)
// 			rr .= "$('#editlink" . i . "').html(" . prepare_textdata_js(plus) . ");";
// 		r .= plus;
// 		r .= '</span></td><td class="td1" style="font-size:90%;"><span id="transsel' . i . '">';
// 		plus = make_trans(i, id, trans, vals[1], langid);
// 		if (mustredo)
// 			rr .= "$('#transsel" . i . "').html(" . prepare_textdata_js(plus) . ");";
// 		r .= plus;
// 		r .= '</span></td></tr>';
// 	} else {
// 		if (trim(vals[1]) !== '') {
// 			nontermbuffer .= str_replace("¶", '<img src="icn/new_line.png" title="New Line" alt="New Line" />', tohtml(vals[1]));
// 		}
// 	}
// }
// if (nontermbuffer !== '') {
// 	r .= '<tr><td class="td1 center" style="font-size:' . textsize . '%;">';
// 	r .= nontermbuffer;
// 	r .= '</td><td class="td1 right" colspan="3"><img class="click" src="icn/tick.png" title="Back to \'Display/Print Mode\'" alt="Back to \'Display/Print Mode\'" onclick="location.href=\'print_impr_text?text=' . textid . '\';" /></td></tr>';
// }
// r .= '<th class="th1 center">Text</th>';
// r .= '<th class="th1 center">Dict.</th>';
// r .= '<th class="th1 center">Edit<br />Term</th>';
// r .= '<th class="th1 center">Term Translations (Delim.: ' . tohtml(getSettingWithDefault('set-term-translation-delimiters')) . ')<br /><input type="button" value="Reload" onclick="do_ajax_edit_impr_text(1e6,\'\');" /><a name="bottom"></a></th>';
// r .= '</tr></table></form>' . "\n";
// /*
// r .= '<script type="text/javascript">' . "\n";
// r .= '//<![CDATA[' . "\n";
// r .= '$(document).ready( function() {' . "\n";
// r .= "$('input.impr-ann-text').change(changeImprAnnText);\n";
// r .= "$('input.impr-ann-radio').change(changeImprAnnRadio);\n";
// r .= '} );' . "\n";
// r .= '//]]>' . "\n";
// r .= '</script>' . "\n";
// */

// if (wordlc === '')
// 	echo "$('#editimprtextdata').html(" . prepare_textdata_js(r) . ");";
// else
// 	echo rr;

// ?>

// fromAnn = getreq("fromAnn"); // from-recno or empty

// // INS/UPD

// if (isset($_REQUEST['op'])) {

// 	textlc = trim(prepare_textdata($_REQUEST["WoTextLC"]));
// 	text = trim(prepare_textdata($_REQUEST["WoText"]));

// 	if (mb_strtolower(text, 'UTF-8') === textlc) {

// 		// INSERT

// 		if ($_REQUEST['op'] === 'Save') {

// 			titletext = "New Term: " . tohtml(prepare_textdata($_REQUEST["WoTextLC"]));
// 			pagestart_nobody(titletext);
// 			echo '<h4><span class="bigger">' . titletext . '</span></h4>';

// 			message = runsql('insert into ' . tbpref . 'words (WoLgID, WoTextLC, WoText, ' .
// 				'WoStatus, WoTranslation, WoSentence, WoRomanization, WoStatusChanged,' . make_score_random_insert_update('iv') . ') values( ' .
// 				$_REQUEST["WoLgID"] . ', ' .
// 				convert_string_to_sqlsyntax($_REQUEST["WoTextLC"]) . ', ' .
// 				convert_string_to_sqlsyntax($_REQUEST["WoText"]) . ', ' .
// 				$_REQUEST["WoStatus"] . ', ' .
// 				convert_string_to_sqlsyntax(translation) . ', ' .
// 				convert_string_to_sqlsyntax(repl_tab_nl($_REQUEST["WoSentence"])) . ', ' .
// 				convert_string_to_sqlsyntax($_REQUEST["WoRomanization"]) . ', NOW(), ' .
// 				make_score_random_insert_update('id') . ')', "Term saved");
// 			wid = get_last_key();

// 			hex = strToClassName(prepare_textdata($_REQUEST["WoTextLC"]));

// 		} // $_REQUEST['op'] === 'Save'

// 		// UPDATE
// 		else {  // $_REQUEST['op'] !== 'Save'

// 			titletext = "Edit Term: " . tohtml(prepare_textdata($_REQUEST["WoTextLC"]));
// 			pagestart_nobody(titletext);
// 			echo '<h4><span class="bigger">' . titletext . '</span></h4>';

// 			oldstatus = $_REQUEST["WoOldStatus"];
// 			newstatus = $_REQUEST["WoStatus"];
// 			xx = '';
// 			if (oldstatus !== newstatus)
// 				xx = ', WoStatus = ' . newstatus . ', WoStatusChanged = NOW()';

// 			message = runsql('update ' . tbpref . 'words set WoText = ' .
// 				convert_string_to_sqlsyntax($_REQUEST["WoText"]) . ', WoTranslation = ' .
// 				convert_string_to_sqlsyntax(translation) . ', WoSentence = ' .
// 				convert_string_to_sqlsyntax(repl_tab_nl($_REQUEST["WoSentence"])) . ', WoRomanization = ' .
// 				convert_string_to_sqlsyntax($_REQUEST["WoRomanization"]) . xx . ',' . make_score_random_insert_update('u') . ' where WoID = ' . $_REQUEST["WoID"], "Updated");
// 			wid = $_REQUEST["WoID"];

// 		}  // $_REQUEST['op'] !== 'Save'

// 		saveWordTags(wid);

// 	} // (mb_strtolower(text, 'UTF-8') === textlc)
// 	else { // (mb_strtolower(text, 'UTF-8') !== textlc)

// 		titletext = "New/Edit Term: " . tohtml(prepare_textdata($_REQUEST["WoTextLC"]));
// 		pagestart_nobody(titletext);
// 		echo '<h4><span class="bigger">' . titletext . '</span></h4>';
// 		message = 'Error: Term in lowercase must be exactly = "' . textlc . '", please go back and correct this!';
// 		echo error_message_with_hide(message, 0);
// 		pageend();
// 		exit();

// 	}

// 	?>

// 	<p>OK:
// 		<?php echo tohtml(message); ?>
// 	</p>

// 	<script type="text/javascript">
// 		//<![CDATA[
// 		<?php
// 		if (fromAnn !== '') {
// 			?>
// 			window.opener.do_ajax_edit_impr_text(<?php echo fromAnn; ?>, <?php echo prepare_textdata_js(textlc); ?>);
// 			<?php
// 		} else {
// 			?>
// 			var context = window.parent.frames['l'].document;
// 			var contexth = window.parent.frames['h'].document;
// 			var woid = <?php echo prepare_textdata_js(wid); ?>;
// 			var status = <?php echo prepare_textdata_js($_REQUEST["WoStatus"]); ?>;
// 			var trans = <?php echo prepare_textdata_js(translation . getWordTagList(wid, ' ', 1, 0)); ?>;
// 			var roman = <?php echo prepare_textdata_js($_REQUEST["WoRomanization"]); ?>;
// 			var title = make_tooltip(<?php echo prepare_textdata_js($_REQUEST["WoText"]); ?>, trans, roman, status);
// 			<?php
// 			if ($_REQUEST['op'] === 'Save') {
// 				?>
// 				$('.TERM<?php echo hex; ?>', context).removeClass('status0').addClass('word' + woid + ' ' + 'status' + status).attr('data_trans', trans).attr('data_rom', roman).attr('data_status', status).attr('data_wid', woid).attr('title', title);
// 				<?php
// 			} else {
// 				?>
// 				$('.word' + woid, context).removeClass('status<?php echo $_REQUEST['WoOldStatus']; ?>').addClass('status' + status).attr('data_trans', trans).attr('data_rom', roman).attr('data_status', status).attr('title', title);
// 				<?php
// 			}
// 			?>
// 			$('#learnstatus', contexth).html('<?php echo texttodocount2($_REQUEST['tid']); ?>');
// 			window.parent.frames['l'].focus();
// 			window.parent.frames['l'].setTimeout('cClick()', 100);
// 			<?php
// 		}  // fromAnn !== ''
// 		?>
// 		//]]>
// 	</script>

// 	<?php

// } // if (isset($_REQUEST['op']))
/**
 *
 * @param word
 * @param status
 */
export function isValidStatus(
  word: Word,
  status: NumericalStrengthPotentiallyCompound
) {
  // TODO more elegant than this
  switch (word.WoStatus) {
    case 0:
      return status === 0;
    case 1:
      return (
        status === 12 ||
        status === 13 ||
        status === 14 ||
        status === 15 ||
        status === 1
      );
    case 2:
      return (
        status === 12 ||
        status === 13 ||
        status === 14 ||
        status === 15 ||
        status === 23 ||
        status === 24 ||
        status === 25 ||
        status === 2
      );
    case 3:
      return (
        status === 13 ||
        status === 14 ||
        status === 15 ||
        status === 23 ||
        status === 24 ||
        status === 25 ||
        status === 34 ||
        status === 35 ||
        status === 3
      );
    case 4:
      return (
        status === 14 ||
        status === 15 ||
        status === 24 ||
        status === 25 ||
        status === 34 ||
        status === 35 ||
        status === 45 ||
        status === 4
      );
    case 5:
      return (
        status === 15 ||
        status === 25 ||
        status === 35 ||
        status === 45 ||
        status === 599 ||
        status === 5
      );
    case 98:
      return status === 599 || status === 98;
    case 99:
      return status === 599 || status === 99;
  }
}
