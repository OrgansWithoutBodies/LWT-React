export function InfoExportTemplate() {
  return (
    <>
      <h3>
        <img
          style={{ marginRight: '15px', marginBottom: '15px', float: 'left' }}
          src="img/lwt_icon.png"
          title="LWT"
          alt="LWT"
        />
        About LWT Export Templates for "Flexible Exports"
      </h3>

      <p>
        An export template consists of a string of characters. Some parts of
        this string are <b>placeholders</b> (beginning with{' '}
        <b>"%", "$" or "\"</b>) that are <b>replaced</b> by the actual term
        data, <b>see the following table</b>. For each term (word or
        expression), that has been selected for export, the placeholders of the
        export template will be replaced by the term data and the string will be
        written to the export file.{' '}
      </p>

      <p>
        <b>A template must end with</b> either <b>"\n"</b> (UNIX, Mac) or{' '}
        <b>"\r\n"</b> (Windows).{' '}
        <b>If you omit this, the whole export will be one single line!</b>
      </p>

      <p>
        If the export template is <b>empty, no terms of this language</b> will
        be exported.
      </p>

      <table className="tab3" cellSpacing="0" cellPadding="5">
        <tr className="tr1">
          <th className="th1">Placeholders</th>
          <th className="th1">Placeholders replaced by ...</th>
        </tr>

        <tr className="tr1">
          <th className="th1">%...</th>
          <th className="th1">Raw Text</th>
        </tr>

        <tr className="tr1">
          <td className="td1 center">%w</td>
          <td className="td1">
            Term (Word/Expression) - as <b>raw text</b>.
          </td>
        </tr>

        <tr className="tr1">
          <td className="td1 center">%t</td>
          <td className="td1">
            Translation - as <b>raw text</b>.
          </td>
        </tr>

        <tr className="tr1">
          <td className="td1 center">%s</td>
          <td className="td1">
            Sentence, curly braces removed - as <b>raw text</b>.
          </td>
        </tr>

        <tr className="tr1">
          <td className="td1 center">%c</td>
          <td className="td1">
            The sentence, but the "{`{xxx}`}" parts are replaced by "[...]"
            (cloze test question) - as <b>raw text</b>.
          </td>
        </tr>

        <tr className="tr1">
          <td className="td1 center">%d</td>
          <td className="td1">
            The sentence, but the "{`{xxx}`}" parts are replaced by "[xxx]"
            (cloze test solution) - as <b>raw text</b>.
          </td>
        </tr>

        <tr className="tr1">
          <td className="td1 center">%r</td>
          <td className="td1">
            Romanization - as <b>raw text</b>.
          </td>
        </tr>

        <tr className="tr1">
          <td className="td1 center">%a</td>
          <td className="td1">
            Status (1..5, 98, 99) - as <b>raw text</b>.
          </td>
        </tr>

        <tr className="tr1">
          <td className="td1 center">%k</td>
          <td className="td1">
            Term in lowercase (key) - as <b>raw text</b>.
          </td>
        </tr>

        <tr className="tr1">
          <td className="td1 center">%z</td>
          <td className="td1">
            Tag List - as <b>raw text</b>.
          </td>
        </tr>

        <tr className="tr1">
          <td className="td1 center">%l</td>
          <td className="td1">
            Language - as <b>raw text</b>.
          </td>
        </tr>

        <tr className="tr1">
          <td className="td1 center">%n</td>
          <td className="td1">
            Word Number in LWT (key in table "words") - as <b>raw text</b>.
          </td>
        </tr>

        <tr className="tr1">
          <td className="td1 center">%%</td>
          <td className="td1">Just one percent sign "%".</td>
        </tr>

        <tr className="tr1">
          <th className="th1">$...</th>
          <th className="th1">
            HTML Text. HTML special characters are escaped:
            <br />
            &lt; = &amp;lt; / &gt; = &amp;gt; / &amp; = &amp;amp; / &quot; =
            &amp;quot;
          </th>
        </tr>

        <tr className="tr1">
          <td className="td1 center">$w</td>
          <td className="td1">
            Term (Word/Expression) - as <b>HTML text</b>.
          </td>
        </tr>

        <tr className="tr1">
          <td className="td1 center">$t</td>
          <td className="td1">
            Translation - as <b>HTML text</b>.
          </td>
        </tr>

        <tr className="tr1">
          <td className="td1 center">$s</td>
          <td className="td1">
            Sentence, curly braces removed - as <b>HTML text</b>.
          </td>
        </tr>

        <tr className="tr1">
          <td className="td1 center">$c</td>
          <td className="td1">
            The sentence, but the "{`{xxx}`}" parts are replaced by "[...]"
            (cloze test question) - as <b>HTML text</b>.
          </td>
        </tr>

        <tr className="tr1">
          <td className="td1 center">$d</td>
          <td className="td1">
            The sentence, but the "{`{xxx}`}" parts are replaced by "[xxx]"
            (cloze test solution) - as <b>HTML text</b>.
          </td>
        </tr>

        <tr className="tr1">
          <td className="td1 center">$x</td>
          <td className="td1">
            The sentence in Anki2 cloze test notation: the "{`{xxx}`}" parts are
            replaced by "{`{{c1::xxx}}`}" - as <b>HTML text</b>.
          </td>
        </tr>

        <tr className="tr1">
          <td className="td1 center">$y</td>
          <td className="td1">
            The sentence in Anki2 cloze test notation, with translation: the "
            {`{xxx}`}" parts are replaced by "{`{{c1::xxx::translation}}`}" - as{' '}
            <b>HTML text</b>.
          </td>
        </tr>

        <tr className="tr1">
          <td className="td1 center">$r</td>
          <td className="td1">
            Romanization - as <b>HTML text</b>.
          </td>
        </tr>

        <tr className="tr1">
          <td className="td1 center">$k</td>
          <td className="td1">
            Term in lowercase (key) - as <b>HTML text</b>.
          </td>
        </tr>

        <tr className="tr1">
          <td className="td1 center">$z</td>
          <td className="td1">
            Tag List - as <b>HTML text</b>.
          </td>
        </tr>

        <tr className="tr1">
          <td className="td1 center">$l</td>
          <td className="td1">
            Language - as <b>HTML text</b>.
          </td>
        </tr>

        <tr className="tr1">
          <td className="td1 center">$$</td>
          <td className="td1">Just one dollar sign "$".</td>
        </tr>

        <tr className="tr1">
          <th className="th1">\...</th>
          <th className="th1">Special Characters</th>
        </tr>

        <tr className="tr1">
          <td className="td1 center">\t</td>
          <td className="td1">TAB character (HEX 9).</td>
        </tr>

        <tr className="tr1">
          <td className="td1 center">\n</td>
          <td className="td1">NEWLINE character (HEX 10).</td>
        </tr>

        <tr className="tr1">
          <td className="td1 center">\r</td>
          <td className="td1">CARRIAGE RETURN character (HEX 13).</td>
        </tr>

        <tr className="tr1">
          <td className="td1 center">\\</td>
          <td className="td1">Just one backslash "\".</td>
        </tr>
      </table>
    </>
  );
}
