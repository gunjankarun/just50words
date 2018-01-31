const { app, BrowserWindow, autoUpdater } = require('electron');
const path = require('path')
const url = require('url')
const isDev = require('electron-is-dev');  // this is required to check if the app is running in development mode

global.application_root = 'dada';

require('./electron-src/file-operations');
const { appUpdater } = require('./electron-src/autoupdater');

let win

function createWindow() {
    win = new BrowserWindow({ 
        width: 1000, 
        height: 700,
        minWidth: 1000,
        minHeight: 700,
        backgroundColor: '#ffffff',
        show: false
    })
        // background-color: rgb(207, 172, 126);
    win.once('ready-to-show', () => {
        win.show();
    })

    // load the dist folder from Angular
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools optionally:
    win.webContents.openDevTools()

    win.on('closed', () => {
        win = null
    })

    // Build the menu
    require('./electron-src/main-menu');
    const userDataPath = app.getPath('userData');
    console.log('000 userDataPath is', userDataPath);
    // We'll use the `configName` property to set the file name and path.join to bring it all together as a string
    global.application_root = path.join(userDataPath, '/');

    // about to call auto-update function
    const page = win.webContents;

    // This function is called when page is loaded
    page.once('did-frame-finish-load', () => {
        console.log('Main Page loaded');
    // const checkOS = isWindowsOrmacOS();
    // if (checkOS && !isDev) {
    // if (checkOS) {
    //     console.log('Checking for update');
    //     // Initate auto-updates on macOs and windows
    //     appUpdater();
    // }
    });
}

app.on('ready', createWindow)


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})

// Funtion to check the current OS. As of now there is no proper method to add auto-updates to linux platform.
function isWindowsOrmacOS() {
	return process.platform === 'darwin' || process.platform === 'win32';
}