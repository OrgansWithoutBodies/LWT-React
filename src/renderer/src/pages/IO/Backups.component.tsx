import { useRef } from 'react';
import { dataService } from '../../data/data.service';
import { useInternalNavigate } from '../../hooks/useInternalNav';
import { Header } from '../../ui-kit/Header';
import { confirmDelete } from '../../utils/utils';

export function BackupScreen(): JSX.Element {
  // const [] = useData([]);
  const navigate = useInternalNavigate();

  const restoreBackup = useRef<HTMLInputElement | null>(null);
  return (
    <>
      <Header title="Backup/Restore/Empty Database" />
      <p>&nbsp;</p>
      <form>
        <table className="tab1" cellSpacing={0} cellPadding={5}>
          <tbody>
            <tr>
              <th className="th1 center">Backup</th>
              <td className="td1">
                <p className="smallgray2">
                  The database <i>lwt</i> (Default Table Set) will be exported
                  to a gzipped SQL file.
                  <br />
                  Please keep this file in a safe place.
                  <br />
                  If necessary, you can recreate the database via the Restore
                  function below.
                  <br />
                  Important: If the backup file is too large, the restore may
                  not be possible (see limits below).
                </p>
                <p className="right">
                  &nbsp;
                  <br />
                  Download LWT Backup:
                  <input
                    type="button"
                    name="backup"
                    onClick={() => dataService.downloadBackup('SQL')}
                    value=".sql.gz"
                  />
                  <input
                    type="button"
                    name="backup"
                    onClick={() => dataService.downloadBackup('JSON')}
                    value=".json.gz"
                  />
                </p>
              </td>
            </tr>
            <tr>
              <th className="th1 center">Restore</th>
              <td className="td1">
                <p className="smallgray2">
                  The database <i>lwt</i> (Default Table Set) will be{' '}
                  <b>replaced</b> by the data in the specified backup file
                  <br />
                  (gzipped or normal SQL file, created above).
                  <br />
                  <br />
                  <span className="smallgray">
                    Important: If the backup file is too large, the restore may
                    not be possible.
                    <br />
                    Upload limits (in bytes):
                    {/* TODO see if these limits can be surpassed */}
                    <b>post_max_size = 8M / upload_max_filesize = 2M</b>
                    <br />
                    If needed, increase in "" and restart server.
                    <br />
                    &nbsp;
                  </span>
                </p>
                <p>
                  <input name="file" type="file" ref={restoreBackup} />
                </p>
                <p className="right">
                  &nbsp;
                  <br />
                  <span className="red2">
                    YOU MAY LOSE DATA - BE CAREFUL: &nbsp; &nbsp; &nbsp;
                  </span>
                  <input
                    type="button"
                    name="restore"
                    value="Restore from LWT Backup"
                    onClick={() => {
                      // onSubmit="return confirm('Are you sure?');"
                      if (
                        restoreBackup.current &&
                        restoreBackup.current.files
                      ) {
                        dataService.restoreFromBackup(
                          restoreBackup.current.files[0]
                        );
                      }
                    }}
                  />
                </p>
              </td>
            </tr>
            <tr>
              <th className="th1 center">
                Install
                <br />
                LWT
                <br />
                Demo
              </th>
              <td className="td1">
                <p className="smallgray2">
                  The database <i>lwt</i> (Default Table Set) will be
                  <b>replaced</b> by the LWT demo database.
                </p>
                <p className="right">
                  &nbsp;
                  <br />
                  <input
                    type="button"
                    value="Install LWT Demo Database"
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
              <th className="th1 center">
                Empty
                <br />
                Database
              </th>
              <td className="td1">
                <p className="smallgray2">
                  Empty (= <b>delete</b> the contents of) all tables - except
                  the Settings - of your database <i>lwt</i> (Default Table
                  Set).
                </p>
                <p className="right">
                  &nbsp;
                  <br />
                  <span className="red2">
                    YOU MAY LOSE DATA - BE CAREFUL: &nbsp; &nbsp; &nbsp;
                  </span>
                  <input
                    type="button"
                    name="empty"
                    onClick={() => {
                      if (confirmDelete()) {
                        dataService.emptyDatabase();
                      }
                    }}
                    value="Empty LWT Database"
                  />
                </p>
              </td>
            </tr>
            <tr>
              <td className="td1 right" colSpan={2}>
                <input
                  type="button"
                  value="<< Back"
                  onClick={() => {
                    navigate('/');
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </>
  );
}
