const electron = require('electron'); // eslint-disable-line
const path = require('path');
const isDev = require('electron-is-dev');
// const ECx = require('electron-chrome-extension');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow = null;
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 920,
        height: 715,
    });
    mainWindow.loadURL(
        isDev
            ? 'http://localhost:8585'
            : `file://${path.join(__dirname, '../build/index.html')}`
    );
    mainWindow.webContents.once('dom-ready', () => mainWindow.webContents.openDevTools());
    mainWindow.on('closed', () => { mainWindow = null; });
}

app.on('ready', async () => {
    createWindow();
    // setup chrome extensions
    // if (isDev) {
    //     await ECx.load('fmkadmapgofadopljbjfkapdkoienihi');
    //     await ECx.load('lmhkpmbekcpmknklioeibfkpmmfibljd');
    // }
});

// if (isDev) {
//     app.on('session-created', session =>
// session.setPreloads([path.join(__dirname,
// '../../node_modules/electron-chrome-extension/preload')]))
// }

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
