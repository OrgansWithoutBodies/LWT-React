import { BrowserWindow, Menu, app, ipcMain, nativeImage } from 'electron';
import { AppVariables } from 'lwt-build';
import { BackendPlugin } from 'lwt-persist/electron-sqlite';
import { IDValOf, LWTData, Persistable } from 'lwt-schemas';
import { createColors } from 'lwt-style';
import path from 'path';
import icon from '../renderer/public/img/lwt_icon.png';

let mainWindow: BrowserWindow | null;

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
const backendHandlers = {
  'backend-plugin-get': (_: any, { key }: { key: Persistable }) =>
    BackendPlugin.get(key),
  'backend-plugin-insert': (
    _: any,
    { key, dataEntry }: { key: Persistable; dataEntry: LWTData[typeof key] }
  ) =>
    // TODO no !'s
    BackendPlugin.insert!(key, dataEntry),
  'backend-plugin-update': (
    _: any,
    { key, dataEntry }: { key: Persistable; dataEntry: LWTData[typeof key] }
  ) =>
    // TODO no !'s
    BackendPlugin.update!(key, dataEntry),
  'backend-plugin-delete': (
    _: any,
    { key, deleteID }: { key: Persistable; deleteID: IDValOf<typeof key> }
  ) => BackendPlugin.delete!(key, deleteID),
  'backend-plugin-empty': () => BackendPlugin.empty!(),
} as const;
type IPCKeys = keyof typeof backendHandlers;
type ArgParams<TKey extends keyof typeof backendHandlers> = Parameters<
  (typeof backendHandlers)[TKey]
> extends undefined
  ? never
  : Parameters<(typeof backendHandlers)[TKey]>[1];
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Electron {
    interface IpcRenderer {
      invoke<TKey extends IPCKeys>(
        channel: TKey,
        args: ArgParams<TKey>
      ): Promise<ReturnType<(typeof backendHandlers)[TKey]>>;
    }
  }
}
app.whenReady().then(() => {
  Object.keys(backendHandlers).forEach((key) =>
    ipcMain.handle(key, backendHandlers[key])
  );

  BackendPlugin.init!();
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
