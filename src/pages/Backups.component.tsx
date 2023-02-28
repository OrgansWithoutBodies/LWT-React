import React from 'react';
import { useData } from '../data/useAkita';
import { Header } from './Header';

export function BackupScreen(): JSX.Element {
  const [
    ,
    { downloadBackup, restoreFromBackup, emptyDatabase, installDemoDatabase },
  ] = useData([]);
  return (
    <>
      <body>
        <Header title="Backup/Restore/Empty Database" />
        <p>&nbsp;</p>
        <form
          encType="multipart/form-data"
          action="/backup_restore.php"
          method="post"
          // onsubmit="return confirm('Are you sure?');"
        >
          <table className="tab1" cellSpacing="0" cellPadding={5}>
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
                    <input
                      type="submit"
                      name="backup"
                      value="Download LWT Backup"
                    />
                  </p>
                </td>
              </tr>
              <tr>
                <th className="th1 center">Restore</th>
                <td className="td1">
                  <p className="smallgray2">
                    The database <i>lwt</i> (Default Table Set) will be
                    <b>replaced</b> by the data in the specified backup file
                    <br />
                    (gzipped or normal SQL file, created above).
                    <br />
                    <br />
                    <span className="smallgray">
                      Important: If the backup file is too large, the restore
                      may not be possible.
                      <br />
                      Upload limits (in bytes):
                      <b>post_max_size = 8M / upload_max_filesize = 2M</b>
                      <br />
                      If needed, increase in "" and restart server.
                      <br />
                      &nbsp;
                    </span>
                  </p>
                  <p>
                    <input name="thefile" type="file" />
                  </p>
                  <p className="right">
                    &nbsp;
                    <br />
                    <span className="red2">
                      YOU MAY LOSE DATA - BE CAREFUL: &nbsp; &nbsp; &nbsp;
                    </span>
                    <input
                      type="submit"
                      name="restore"
                      value="Restore from LWT Backup"
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
                      onClick={installDemoDatabase}
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
                      type="submit"
                      name="empty"
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
                    // onClick="location.href='index.php';"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </body>
    </>
  );
}
