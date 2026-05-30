const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// ADVERTENCIA: Ajusta esta ruta a donde realmente está tu control.py y config.json
const RUTA_JSON = 'E:\\Descargas\\Arduino\\config.json';

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1100,
        height: 800,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// === COMUNICACIÓN CON EL FRONTEND ===
ipcMain.handle('leer-config', async () => {
    try {
        if (fs.existsSync(RUTA_JSON)) {
            return JSON.parse(fs.readFileSync(RUTA_JSON, 'utf-8'));
        }
        return {};
    } catch (error) {
        return {};
    }
});

ipcMain.on('guardar-config', (event, nuevaConfiguracion) => {
    try {
        fs.writeFileSync(RUTA_JSON, JSON.stringify(nuevaConfiguracion, null, 4), 'utf-8');
    } catch (error) {}
});

// NUEVO: Abrir el explorador de archivos nativo de Windows
ipcMain.handle('abrir-explorador', async () => {
    const result = await dialog.showOpenDialog({
        title: 'Selecciona un ejecutable',
        properties: ['openFile'],
        filters: [
            { name: 'Aplicaciones', extensions: ['exe', 'bat', 'cmd'] },
            { name: 'Todos los archivos', extensions: ['*'] }
        ]
    });

    if (result.canceled) return null;
    return result.filePaths[0]; 
});


ipcMain.handle('obtener-icono', async (event, rutaAbsoluta) => {
    try {

        const icon = await app.getFileIcon(rutaAbsoluta, { size: 'normal' });
        return icon.toDataURL(); 
    } catch (error) {
        console.error("No se pudo extraer el icono:", error);
        return null;
    }
});