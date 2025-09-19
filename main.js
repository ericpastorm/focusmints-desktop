// Importa los módulos necesarios de Electron
const { app, BrowserWindow } = require('electron');
const path = require('path');

// Función para crear la ventana principal de la aplicación
function createWindow() {
  // Crea una nueva ventana del navegador
  const mainWindow = new BrowserWindow({
    width: 1200, // Ancho de la ventana
    height: 800, // Alto de la ventana
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Opcional: para comunicación segura entre la web y el escritorio
    },
  });

  // Carga la URL de tu aplicación web FocusMints
  mainWindow.loadURL('https://www.focusmints.app/'); // ¡Asegúrate de cambiar esto por tu URL real!

  // Opcional: Abre las herramientas de desarrollo (para depuración)
  // mainWindow.webContents.openDevTools();
}

// Este método se llamará cuando Electron haya terminado
// la inicialización y esté listo para crear ventanas del navegador.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // En macOS es común volver a crear una ventana en la aplicación cuando el
    // icono del dock es presionado y no hay otras ventanas abiertas.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Salir cuando todas las ventanas estén cerradas, excepto en macOS.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});