import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '../Icon';
import { TextsId } from '../data/validators';

export function Header({
  afterDropdown,
  title,
  link = '/',
  readerProps = undefined,
}: {
  afterDropdown?: string[];
  title: string;
  link?: string;
  readerProps?: {
    prevTextID: TextsId;
    nextTextID: TextsId;

    prevTextString: string;
    nextTextString: string;
  };
}) {
  const logoSize = 48;
  const navigate = useNavigate();
  const location = useLocation();
  const headerValues = {
    Home: 'index',
    Texts: 'edit_texts',
    'Text Archive': 'edit_archivedtexts',
    'Text Tags': 'edit_texttags',
    Languages: 'edit_languages',
    Terms: 'edit_words',
    'Term Tags': 'edit_tags',
    Statistics: 'statistics',
    'Text Check': 'check_text',
    'Long Text': 'long_text_import',
    'Term Import': 'upload_words',
    'Backup/Restore': 'backup_restore',
    Settings: 'settings',
    Help: 'info',
  };
  return (
    <>
      <h4>
        <a href={link} target="_top">
          <img
            className="lwtlogo"
            src="img/lwt_icon.svg"
            title="LWT - Current Table Set: Default Table Set"
            alt="LWT - Current Table Set: Default Table Set"
            width={logoSize}
            height={logoSize}
          />
          LWT
        </a>
        &nbsp; | &nbsp;
        <select
          id="quickmenu"
          onChange={(val) => {
            if (val.target.value === '') {
              return;
            }
            // TODO validate?
            navigate(`/${val.target.value}`);
          }}
        >
          <option value="">[Menu]</option>
          {Object.keys(headerValues).map((key) => {
            return (
              <option
                value={headerValues[key]}
                selected={location.pathname === `/${headerValues[key]}`}
              >
                {key}
              </option>
            );
          })}
        </select>
        {readerProps && (
          <>
            &nbsp; | &nbsp;
            <a href={`do_text?start=${readerProps.prevTextID}`} target="_top">
              <Icon
                iconName="navigation-180-button"
                title={`Previous Text: ${readerProps.prevTextString}`}
                alt={`Previous Text: ${readerProps.prevTextString}`}
              />
            </a>
            <a href={`do_text?start=${readerProps.nextTextID}`} target="_top">
              <Icon
                iconName="navigation-000-button"
                title={`Next Text: ${readerProps.nextTextString}`}
                alt={`Next Text: ${readerProps.nextTextString}`}
              />
            </a>
            &nbsp; | &nbsp;
            <a href={`do_test?text=${11}`} target="_top">
              <Icon iconName="question-balloon" title="Test" alt="Test" />
            </a>
            &nbsp;
            <a href={`print_text?text=${11}`} target="_top">
              <Icon iconName="printer" title="Print" alt="Print" />
              &nbsp;
            </a>
            <a target="_top" href={`edit_texts?chg=${11}`}>
              <Icon
                iconName="document--pencil"
                title="Edit Text"
                alt="Edit Text"
              />
            </a>
            &nbsp; | &nbsp;
            <a href={`new_word?text=${11}&lang=${2}`} target="ro">
              <Icon
                iconName="sticky-note--plus"
                title="New Term"
                alt="New Term"
              />
            </a>
          </>
        )}
      </h4>
      <table>
        <tbody>
          <tr>
            <h3>{title}</h3>
          </tr>
        </tbody>
      </table>
      {/* <h3>READ&nbsp;▶</h3></td><td className="width99pc"><h3>一中三宪 <a href="https://zh.wikipedia.org/wiki/%E4%B8%80%E4%B8%AD%E4%B8%89%E6%86%B2" target="_blank"><Icon iconName="chain" title="Text Source" alt="Text Source" /></a></h3> */}
    </>
  );
}
// @TODO
// TO DO:  369
//     Show All
