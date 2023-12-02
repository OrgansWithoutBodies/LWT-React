import { useData } from '../data/useAkita';
import { TextsId } from '../data/validators';
import { Header } from '../ui-kit/Header';
import { Icon } from '../ui-kit/Icon';

export function PrintText({ textID }: { textID: TextsId }) {
  const [{ texts, languages }] = useData(['texts', 'languages']);
  const showingText = texts.find(({ TxID }) => TxID === textID);
  if (!showingText) {
    throw new Error('invalid Text ID!');
  }
  const language = languages.find(({ LgID }) => LgID === showingText.TxLgID);
  if (!language) {
    throw new Error('invalid Text Language ID!');
  }
  return (
    <>
      <div className="noprint">
        <Header
          title={`PRINT&nbsp▶${showingText.TxTitle} ${
            showingText.TxSourceURI ? (
              <a
                href={showingText.TxSourceURI}
                target="_blank"
                rel="noreferrer"
              >
                <Icon src="chain" title="Text Source" />
              </a>
            ) : (
              <></>
            )
          }) . '}`}
        />

        <p id="printoptions">
          Terms with <b>status(es)</b>{' '}
          <select
            id="status"
            // onchange="{val=document.getElementById('status').options[document.getElementById('status').selectedIndex].valuelocation.href='print_text?text=" . textid . "&ampstatus=' + val}"
          >
            echo get_wordstatus_selectoptions(statusrange, true, true, false)
          </select>{' '}
          ...
          <br />
          will be <b>annotated</b> with "
          <select id="ann">
            <option value="0">Nothing</option>
            <option value="1">Translation</option>
            <option value="5">Translation &amp Tags</option>
            <option value="2">Romanization</option>
            <option value="3">Romanization &amp Translation</option>
            <option value="7">Romanization, Translation &amp Tags</option>
          </select>
          <select
            id="annplcmnt"
            // onchange="{val=document.getElementById('annplcmnt').options[document.getElementById('annplcmnt').selectedIndex].valuelocation.href='print_text?text=" . textid . "&ampannplcmnt=' + val}"
          >
            <option
              value="0"
              // " . get_selected(0,annplcmnt) . "
            >
              behind
            </option>
            <option
              value="1"
              // " . get_selected(1,annplcmnt) . "
            >
              in front of
            </option>
            <option
              value="2"
              // " . get_selected(2,annplcmnt) . "
            >
              above (ruby)
            </option>
          </select>{' '}
          the term.
          <br />
          <input
            type="button"
            value="Print it!"
            onClick={() => window.print()}
            // onClick="window.print()"
          />{' '}
          (only the text below the line)
          {/* if ((get_first_value("select length(TxAnnotatedText) as value from " . tbpref . "texts where TxID = " . textid) + 0) > 0) {
	 &nbsp | &nbsp Or <input type="button" value="Print/Edit/Delete" onclick="location.href='print_impr_text?text=" . textid . "'" /> your <b>Improved Annotated Text</b>" . get_annotation_link(textid) . ".
} else {
	 &nbsp | &nbsp <input type="button" value="Create" onclick="location.href='print_impr_text?edit=1&amptext=" . textid . "'" /> an <b>Improved Annotated Text</b> [<img src="icn/tick.png" title="Annotated Text" alt="Annotated Text" />].
} */}
        </p>
      </div>
      <div
        id="print"
        // " . (rtlScript ? ' dir="rtl"' : '') . "
      >
        <p
          style={{ fontSize: language.LgTextSize }}
          // style="font-size:' . textsize . '%line-height: 1.35 margin-bottom: 10px "
        >
          {showingText.TxTitle}
          <br />
          <br />
          {showingText.TxText}
        </p>
      </div>
    </>
  );
}
