import { TextsID } from '../../data/validators';
import { useData } from '../../hooks/useData';
import { useInternalNavigate } from '../../hooks/useInternalNav';
import { useUpdateActiveText } from '../../hooks/useUpdateActiveText';
import { Header } from '../../ui-kit/Header';
import { Icon } from '../../ui-kit/Icon';
import { getDirTag } from '../../utils/getDirTag';
import { AnnPlcmnt } from './PrintText.component';
/**
 *
 */
export function AnnotateText({
  textID: textID,
  editmode: editmode,
  annplcmnt,
}: {
  textID: TextsID;
  annplcmnt: AnnPlcmnt;
  editmode: boolean;
}) {
  useUpdateActiveText({ textID });
  const [{ texts, languages }] = useData(['texts', 'languages']);
  const $ann = '';
  const text = texts.find((val) => val.TxID === textID);
  if (!text) {
    throw new Error('Invalid Text ID');
  }
  const language = languages.find((val) => val.LgID === text.TxLgID);
  if (!language) {
    throw new Error('Invalid Lang ID for given text');
  }
  // const delmode = getreq('del');
  // const delmode = (delmode === '' ? 0 : (delmode+0));
  // const ann = get_first_value("select TxAnnotatedText as value from " . tbpref . "texts where TxID = " . textid);
  // const ann_exists = (strlen(ann) > 0);
  // if (ann_exists) {
  // 	const ann = recreate_save_ann(textid, ann);
  // 	const ann_exists = (strlen(ann) > 0);
  // }

  // if(textid==0) {
  // 	Header("Location: edit_texts");
  // 	xit();
  // }

  // if ( delmode ) {  // Delete
  // 	if ( ann_exists ) const dummy = runsql('update ' . tbpref . 'texts set ' .
  // 			'TxAnnotatedText = ' . ("") . ' where TxID = ' . textid, "");
  // 	const ann_exists = ((get_first_value("select length(TxAnnotatedText) as value from " . tbpref . "texts where TxID = " . textid) + 0) > 0);
  // 	if ( ! ann_exists ) {
  // 		header("Location: print_text?text=" . textid);
  // 		xit();
  // 	}
  // }

  // const sql = 'select TxLgID, TxTitle, TxAudioURI, TxSourceURI from ' . tbpref . 'texts where TxID = ' . textid;
  // const res = do_mysqli_query(sql);
  // const record = mysqli_fetch_assoc(res);
  // const title = record['TxTitle'];
  // const sourceURI = record['TxSourceURI'];
  // const langid = record['TxLgID'];
  // const audio = record['TxAudioURI'];
  // if(! isset(audio)) {const audio='';}
  // const audio = trim(audio);

  // const sql = 'select LgTextSize, LgRemoveSpaces, LgRightToLeft from ' . tbpref . 'languages where LgID = ' . langid;
  // const res = do_mysqli_query(sql);
  // const record = mysqli_fetch_assoc(res);
  // const textsize = record['LgTextSize'];
  // const removeSpaces = record['LgRemoveSpaces'];
  // const rtlScript = record['LgRightToLeft'];

  // saveSetting('currenttext',textid);

  // pagestart_nobody('Annotated Text');
  const navigator = useInternalNavigate();
  const $items = $ann.split('/[\n]/u');

  return (
    <>
      <div className="noprint">
        <Header
          title={`ANN.TEXT ▶ ${text.TxTitle}`}
          TitleDecoration={
            text.TxSourceURI
              ? () => (
                  <a href={`${text.TxSourceURI}`} target="_blank">
                    <Icon src={'chain'} title="Text Source" />
                  </a>
                )
              : undefined
          }
        />

        <p id="printoptions">
          <b>Improved Annotated Text</b>{' '}
          {editmode ? (
            <>
              <b>(Edit Mode)</b>
              <Icon
                src="question-frame"
                title="Help"
                className="click"
                onClick={() => navigator('/info#il')}
              />
              <br />
              <input
                type="button"
                value="Display/Print Mode"
                onClick={() => navigator('/print_impr_text?text=')}
              />
            </>
          ) : (
            <>
              <b>(Display/Print Mode)</b>
              <br />
              <input
                type="button"
                value="Edit"
                onClick={() =>
                  navigator(`/print_impr_text?edit=1&text=${textID}`)
                }
              ></input>
            </>
          )}
          &nbsp; | &nbsp;
          <input
            type="button"
            value="Delete"
            onClick={() => {
              if (window.confirm('Are you sure?')) {
                navigator(`/print_impr_text?del=1&text=${textID}`);
              }
            }}
          />
          &nbsp; | &nbsp;
          <input type="button" value="Print" onClick={() => window.print()} />
          &nbsp; | &nbsp;
          <input
            type="button"
            value={`Display${
              // TODO make sure this empty string doesnt happen & is always converted to undefined
              text.TxAudioURI !== '' && text.TxAudioURI !== undefined
                ? ' with Audio Player'
                : ''
            } in new Window`}
            onClick={() => navigator(`/display_impr_text?text=${textID}`)}
          />
        </p>
      </div>
      <>
        {editmode ? (
          <></>
        ) : (
          <>
            {/* TODO dedupe with print if possible */}
            {
              <div id="print" {...getDirTag(language)}>
                <p
                  style={{
                    fontSize: `${language.LgTextSize}%`,
                    lineHeight: 1.35,
                    marginBottom: '10px',
                  }}
                >
                  {text.TxTitle}
                  <br />
                  <br />
                  {$items.map(($item) => {
                    const $vals = $item.split('/[\t]/u');
                    return (
                      <>
                        {$vals[0] > -1 ? (
                          <>
                            {/* $trans = '';
			if (count($vals) > 3) $trans = $vals[3];
			if ($trans == '*') $trans = $vals[1] . " "; // <- U+200A HAIR SPACE
			echo ' <ruby><rb><span class="anntermruby">' . tohtml($vals[1]) . '</span></rb><rt><span class="anntransruby2">' . tohtml($trans) . '</span></rt></ruby> '; */}
                          </>
                        ) : (
                          <>
                            {$vals.length >= 2 &&
                              $vals[1].split('¶').map((val) => (
                                <p
                                  style={{
                                    fontSize: `${language.LgTextSize}%`,
                                    lineHeight: 1.3,
                                    marginBottom: '10px',
                                  }}
                                >
                                  {val}
                                </p>
                              ))}
                          </>
                        )}
                      </>
                    );
                  })}
                </p>
                {/* TODO */}
                {/* <!-- noprint --> */}
              </div>
            }
          </>
        )}
      </>
    </>
  );
}
