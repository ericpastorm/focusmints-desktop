const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const Store = require('electron-store').default;

let store;

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Quit',
        role: 'quit'
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools', label: 'Developer Tools' },
    ]
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'About FocusMints',
        click: () => {
          dialog.showMessageBox({
            type: 'info',
            title: 'About FocusMints',
            message: 'FocusMints',
            detail: `Version: ${app.getVersion()}\nAn application to help you stay focused.`
          });
  }
      },
      {
        label: 'Open Website',
        click: async () => {
          await shell.openExternal('https://www.focusmints.app');
        }
      },
      { type: 'separator' },
      {
        label: 'Check for Updates...',
        click: () => {
          autoUpdater.checkForUpdatesAndNotify();
          dialog.showMessageBox({
            type: 'info',
            title: 'Searching for Updates',
            message: 'FocusMints is looking for a new version. You will be notified if one is found.'
          });
        }
      }
    ]
  }
];
const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);


function createWindow() {
  const winBounds = store.get('windowBounds', { width: 1200, height: 800 });
  
  const mainWindow = new BrowserWindow({
    ...winBounds,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, 
      nodeIntegration: false, 
    },
  });

  mainWindow.on('close', () => {
    store.set('windowBounds', mainWindow.getBounds());
  });

  mainWindow.loadURL('https://www.focusmints.app/');

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' }; 
  });
}

app.whenReady().then(() => {
  // -> CAMBIO 2: Inicializamos 'store' aquí, cuando la app ya está lista.
  store = new Store();

  createWindow();

  autoUpdater.checkForUpdatesAndNotify();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
  
  autoUpdater.on('checking-for-update', () => {
    console.log('Buscando actualizaciones...');
  });
  autoUpdater.on('update-available', (info) => {
    console.log('¡Actualización disponible!', info);
  });
  autoUpdater.on('update-not-available', (info) => {
    console.log('No hay actualizaciones disponibles.', info);
  });
  autoUpdater.on('error', (err) => {
    console.error('Error en el actualizador automático: ' + err);
  });
  autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Velocidad de descarga: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Descargado ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    console.log(log_message);
  });
  autoUpdater.on('update-downloaded', (info) => {
    console.log('Actualización descargada. Se instalará al reiniciar.', info);
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});