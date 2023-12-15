import { BrowserWindow, Menu, app, ipcMain, nativeImage } from 'electron';
import path from 'path';
import icon from '../renderer/public/img/lwt_icon.png';
import { AppVariables } from '../renderer/src/meta';
import { createColors } from '../renderer/src/styles';
import { BackendPlugin } from './electron-sqlite.backend-plugin.main';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload', 'preload.js'),
    },
  });
  mainWindow.setIcon(nativeImage.createFromDataURL(icon));
  const style = createColors(AppVariables.styleVariant);
  // TODO bgcolor
  console.log(style.body.backgroundColor!);
  // Vite dev server URL

  // TODO option
  mainWindow.loadURL('http://localhost:5173');
  mainWindow.on('closed', () => (mainWindow = null));
  const template: Electron.MenuItemConstructorOptions[] = [
    // TODO reload page shortcut
    {
      label: 'New',
      submenu: [
        {
          label: 'Language',
          click: (_, window) => {
            // TODO API typesafety
            window?.loadURL('http://localhost:5173/edit_languages?new=1');
          },
        },
        {
          label: 'Text',
          submenu: [
            {
              label: 'Short Text',
              click: (_, window) => {
                window?.loadURL('http://localhost:5173/edit_texts?new=1');
              },
            },
            {
              label: 'Long Text',
              click: (_, window) => {
                window?.loadURL('http://localhost:5173/long_text_import');
              },
            },
          ],
        },
        {
          label: 'Word Tag',
          click: (_, window) => {
            window?.loadURL('http://localhost:5173/edit_tags?new=1');
          },
        },
        {
          label: 'Text Tag',
          click: (_, window) => {
            window?.loadURL('http://localhost:5173/edit_texttags?new=1');
          },
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        {
          role: 'cut',
        },
        {
          role: 'copy',
        },
        {
          role: 'paste',
        },
      ],
    },

    {
      label: 'View',
      submenu: [
        {
          role: 'reload',
        },
        {
          role: 'toggleDevTools',
        },
        {
          type: 'separator',
        },
        {
          role: 'resetZoom',
        },
        {
          role: 'zoomIn',
        },
        {
          role: 'zoomOut',
        },
        {
          type: 'separator',
        },
        {
          role: 'togglefullscreen',
        },
      ],
    },

    {
      role: 'window',
      submenu: [
        {
          role: 'minimize',
        },
        {
          role: 'close',
        },
      ],
    },

    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: (_, window) => {
            window?.loadURL('http://localhost:5173/info');
          },
        },
      ],
    },
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  ipcMain.handle('backend-plugin-get', (_, { key }) => BackendPlugin.get(key));
  ipcMain.handle('backend-plugin-insert', (_, { key, dataEntry }) =>
    BackendPlugin!.insert(key, dataEntry)
  );
  ipcMain.handle('backend-plugin-update', (_, { key, dataEntry }) =>
    BackendPlugin!.update(key, dataEntry)
  );
  ipcMain.handle('backend-plugin-delete', (_, { key, deleteId }) =>
    BackendPlugin!.delete(key, deleteId)
  );
  ipcMain.handle('backend-plugin-empty', () => BackendPlugin!.empty());

  BackendPlugin.init();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
