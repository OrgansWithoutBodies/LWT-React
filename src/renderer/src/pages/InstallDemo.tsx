import { dataService } from '../data/data.service';
import { useData } from '../data/useAkita';
import { useInternalNavigate } from '../hooks/useInternalNav';
import { Header } from '../ui-kit/Header';

export function InstallDemo() {
  //   if (Set(Request['install'])) {
  //     // file = getcwd() . '/install_demo_db.sql.gz';
  //     if (file_exists(File)) {
  //       const handle = open(File, 'r');
  //       if (handle === FALSE) {
  //         onmessage = "Error: File ' . file . ' could not be opened";
  //       } // handle not OK
  //       else {
  //         // handle OK
  //         const message = restore_file(handle, 'Demo Database');
  //       } // handle OK
  //     } // restore file specified
  //     else {
  //       const message = "Error: File ' . file . ' does not exist";
  //     }
  //   }
  const [{ languages }] = useData(['languages']);
  const langcnt = languages.length;
  const navigator = useInternalNavigate();
  const dbname = '';
  return (
    <>
      <Header title="Install LWT Demo Database" />

      <form encType="multipart/form-data">
        <table className="tab3" cellSpacing={0} cellPadding={5}>
          <tr>
            <th className="th1 center">Install Demo</th>
            <td className="td1">
              <p className="smallgray2">
                The database <i>{dbname}</i>
                will be <b>replaced</b> by the LWT demo database.
                {langcnt > 0 && (
                  <>
                    <br />
                    The existent database will be <b>overwritten!</b>
                  </>
                )}
              </p>
              <p className="right">
                &nbsp;
                <br />
                <span className="red2">
                  YOU MAY LOSE DATA - BE CAREFUL: &nbsp; &nbsp; &nbsp;
                </span>
                <input
                  type="button"
                  name="install"
                  value="Install LWT demo database"
                  onClick={() => {
                    if (window.confirm('Are you sure?')) {
                      dataService.installDemoDatabase();
                    }
                  }}
                />
              </p>
            </td>
          </tr>
          <tr>
            <td className="td1 right" colSpan={2}>
              <input
                type="button"
                value="&lt;&lt; Back to LWT Main Menu"
                onClick={() => navigator('/')}
              />
            </td>
          </tr>
        </table>
      </form>
    </>
  );
}
