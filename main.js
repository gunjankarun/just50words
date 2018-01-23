const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
global.application_root = path.join(__dirname, '/');

require('./electron-src/file-operations');

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
    // win.webContents.openDevTools()

    win.on('closed', () => {
        win = null
    })

    require('./electron-src/main-menu');
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