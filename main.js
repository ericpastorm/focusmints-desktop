// Importa los módulos necesarios de Electron
// NUEVO: Añadimos Menu, shell y autoUpdater
const { app, BrowserWindow, Menu, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

// NUEVO: Creamos una plantilla para el menú nativo de la aplicación
const menuTemplate = [
  {
    label: 'Archivo',
    submenu: [
      {
        label: 'Salir',
        role: 'quit' // 'role' usa el comportamiento nativo (Cmd+Q en Mac, Alt+F4 en Win)
      }
    ]
  },
  {
    label: 'Editar',
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
    label: 'Ver',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools', label: 'Herramientas de Desarrollador' },
    ]
  }
];
const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);


// Función para crear la ventana principal de la aplicación
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // NUEVO: Mejoras de seguridad explícitas
      contextIsolation: true, // Aísla el preload/web de los procesos internos de Electron
      nodeIntegration: false, // Impide que la web acceda a las APIs de Node.js
    },
  });

  mainWindow.loadURL('https://www.focusmints.app/');

  // NUEVO: Gestiona enlaces externos para que se abran en el navegador
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' }; // Impide que se cree una nueva ventana en Electron
  });
}

app.whenReady().then(() => {
  createWindow();

  // NUEVO: Busca actualizaciones automáticamente al iniciar la aplicación
  autoUpdater.checkForUpdatesAndNotify();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});