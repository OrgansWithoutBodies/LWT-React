import { Icon } from '../Icon';

export function Header({
  afterDropdown,
  title,
  link = '/',
  readerIcons = false,
}: {
  afterDropdown?: string[];
  title: string;
  link?: string;
  readerIcons?: boolean;
}) {
  const logoSize = 48;
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
        <select id="quickmenu">
          {/* TODO add change here onselect */}
          <option value="">[Menu]</option>
          <option value="index">Home</option>
          <option value="edit_texts">Texts</option>
          <option value="edit_archivedtexts">Text Archive</option>
          <option value="edit_texttags">Text Tags</option>
          <option value="edit_languages">Languages</option>
          <option value="edit_words">Terms</option>
          <option value="edit_tags">Term Tags</option>
          <option value="statistics">Statistics</option>
          <option value="check_text">Text Check</option>
          <option value="long_text_import">Long Text Import</option>
          <option value="upload_words">Term Import</option>
          <option value="backup_restore">Backup/Restore</option>
          <option value="settings">Settings</option>
          <option value="INFO">Help</option>
        </select>
        {readerIcons && (
          <>
            &nbsp; | &nbsp;
            <a href="do_text?start=2" target="_top">
              <Icon
                iconName="navigation-180-button"
                // TODO
                title="Previous Text: The Man and the Dog (annotated version)"
                alt="Previous Text: The Man and the Dog (annotated version)"
              />
            </a>
            <a href="do_text?start=14" target="_top">
              <Icon
                iconName="navigation-000-button"
                // TODO
                title="Next Text: 为什么反舰导弹近距离攻击反而不准？"
                alt="Next Text: 为什么反舰导弹近距离攻击反而不准？"
              />
            </a>
            &nbsp; | &nbsp;
            <a href="do_test?text=11" target="_top">
              <Icon iconName="question-balloon" title="Test" alt="Test" />
            </a>
            &nbsp;
            <a href="print_text?text=11" target="_top">
              <Icon iconName="printer" title="Print" alt="Print" />
              &nbsp;
            </a>
            <a target="_top" href="edit_texts?chg=11">
              <Icon
                iconName="document--pencil"
                title="Edit Text"
                alt="Edit Text"
              />
            </a>
            &nbsp; | &nbsp;
            <a href="new_word?text=11&amp;lang=2" target="ro">
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
