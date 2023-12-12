import { useData } from '../data/useAkita';
import { TextsId } from '../data/validators';
import { useUpdateParams } from '../hooks/useInternalNav';
import { A } from '../nav/InternalLink';
import { Header } from '../ui-kit/Header';
import { Icon } from '../ui-kit/Icon';
import { getDirTag } from './Reader.component';
import { StrengthMapNumericalKey } from './StrengthMap';
enum AnnPlcmnt {
  'behind' = 0,
  'in front of' = 1,
  'above (ruby)' = 2,
}
/**
 *
 */
export function PrintText({
  textID,
  ann,
  status,
  annplcmnt,
}: {
  textID: TextsId;
  ann: number;
  status: number;
  annplcmnt: AnnPlcmnt;
}) {
  // TODO
  const statusRange = 1;
  const [{ texts, languages }] = useData(['texts', 'languages']);
  const paramUpdater = useUpdateParams();
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
            defaultValue={status}
            onChange={({ target: { value } }) => {
              paramUpdater({ status: value });
            }}
          >
            <GetWordstatusSelectoptions
              v={statusRange}
              all={true}
              not9899={true}
            />
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
              &nbsp | &nbsp Or{' '}
              <input
                type="button"
                value="Print/Edit/Delete"
                onClick={() => `location.href='print_impr_text?text=${textID}`}
              />{' '}
              your <b>Improved Annotated Text</b>
              {<GetAnnotationLink textID={textID} />}
            </>
          ) : (
            <>
              &nbsp | &nbsp{' '}
              <input
                type="button"
                value="Create"
                onClick={() =>
                  `location.href='print_impr_text?edit=1&text=${textID}`
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
        <p
          style={{
            fontSize: language.LgTextSize,
            lineHeight: '1.35',
            marginBottom: '10px',
          }}
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

/**
 *
 */
export function GetAnnotationLink({ textID }: { textID: TextsId }) {
  // global tbpref;
  if (
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
  not9899: false;
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
            (n) => !(n == 98 || n == 99)
          )
        : Object.keys(StrengthMapNumericalKey)
      ).map((n) => {
        const status = StrengthMapNumericalKey[n];
        return (
          <option value={n}>
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
