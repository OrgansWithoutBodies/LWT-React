import { useLocation } from 'react-router-dom';
import { Icon } from '../Icon';
import { TextsId } from '../data/validators';
import { A } from '../nav/InternalLink';
import { InternalPaths, useInternalNavigate } from '../nav/useInternalNav';

export const headerValuesTemp = {
  index: { params: [] },
  edit_texts: { params: ['page', 'new'] },
  edit_archivedtexts: { params: ['page'] },
  edit_texttags: { params: ['page'] },
  edit_languages: { params: ['page'] },
  edit_words: {
    params: ['page', 'status', 'query', 'tag12', 'tag1', 'sort', 'text'],
  },
  edit_tags: { params: ['page'] },
  statistics: { params: [] },
  check_text: { params: [] },
  long_text_import: { params: [] },
  upload_words: { params: [] },
  backup_restore: { params: [] },
  settings: { params: [] },
  info: { params: [] },
} as const;
export const headerValues = {
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
} as const;

export function Header({
  afterDropdown,
  title,
  link = '/',
  readerProps = undefined,
}: {
  afterDropdown?: string[];
  title: string;
  link?: InternalPaths;
  readerProps?: {
    prevTextID: TextsId;
    nextTextID: TextsId;

    prevTextString: string;
    nextTextString: string;
  };
}) {
  const logoSize = 48;
  const navigate = useInternalNavigate();
  const location = useLocation();
  return (
    <>
      <h4>
        <A href={link} target="_top">
          <img
            className="lwtlogo"
            src="img/lwt_icon.svg"
            title="LWT - Current Table Set: Default Table Set"
            alt="LWT - Current Table Set: Default Table Set"
            width={logoSize}
            height={logoSize}
          />
          LWT
        </A>
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
          <option disabled>[Menu]</option>
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
            <A href={`/do_text?start=${readerProps.prevTextID}`} target="_top">
              <Icon
                src="navigation-180-button"
                title={`Previous Text: ${readerProps.prevTextString}`}
              />
            </A>
            <A href={`/do_text?start=${readerProps.nextTextID}`} target="_top">
              <Icon
                src="navigation-000-button"
                title={`Next Text: ${readerProps.nextTextString}`}
              />
            </A>
            &nbsp; | &nbsp;
            <A href={`/do_test?text=${11}`} target="_top">
              <Icon src="question-balloon" title="Test" />
            </A>
            &nbsp;
            <A href={`/print_text?text=${11}`} target="_top">
              <Icon src="printer" title="Print" />
              &nbsp;
            </A>
            <A target="_top" href={`/edit_texts?chg=${11}`}>
              <Icon src="document--pencil" title="Edit Text" />
            </A>
            &nbsp; | &nbsp;
            <A href={`/new_word?text=${11}&lang=${2}`} target="ro">
              <Icon src="sticky-note--plus" title="New Term" />
            </A>
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
      {/* <h3>READ&nbsp;▶</h3></td><td className="width99pc"><h3>一中三宪 <A href="https://zh.wikipedia.org/wiki/%E4%B8%80%E4%B8%AD%E4%B8%89%E6%86%B2" target="_blank"><Icon iconName="chain" title="Text Source" /></A></h3> */}
    </>
  );
}
// @TODO
// TO DO:  369
//     Show All
