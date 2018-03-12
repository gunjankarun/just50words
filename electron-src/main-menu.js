/**
 * This file defines the menus to be shown by electron. The idea is to keep the menus specific to platform and not add any custom functionality on these menus. 
 * The custom functionality will be implemented using items on main screen.
 * That will make it easy to move the entire solution to a cloud based solution in future.
 */
const { Menu } = require('electron')
const electron = require('electron')
const app = electron.app

const template = [
    {
        label: 'Edit',
        submenu: [
            {
                role: 'undo'
            },
            {
                role: 'redo'
            },
            {
                type: 'separator'
            },
            {
                role: 'cut'
            },
            {
                role: 'copy'
            },
            {
                role: 'paste'
            },
            {
                role: 'pasteandmatchstyle'
            },
            {
                role: 'delete'
            },
            {
                role: 'selectall'
            }
        ]
    },
    {
        label: 'View',
        submenu: [
            // {
            //     label: 'Reload',
            //     accelerator: 'CmdOrCtrl+R',
            //     click(item, focusedWindow) {
            //         if (focusedWindow) focusedWindow.reload()
            //     }
            // },
            {
                label: 'Toggle Developer Tools',
                accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                click(item, focusedWindow) {
                    if (focusedWindow) focusedWindow.webContents.toggleDevTools()
                }
            },
            {
                type: 'separator'
            },
            {
                role: 'resetzoom'
            },
            {
                role: 'zoomin'
            },
            {
                role: 'zoomout'
            },
            {
                type: 'separator'
            },
            {
                role: 'togglefullscreen'
            }
        ]
    },
    {
        role: 'window',
        submenu: [
            {
                role: 'minimize'
            },
            {
                role: 'close'
            }
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click() { require('electron').shell.openExternal('https://just50words.com') }
            }
        ]
    }
]

if (process.platform === 'darwin') {
    const name = app.getName()
    template.unshift({
        label: name,
        submenu: [
            {
            label: 'About Just 50 Words',
            click () { require('electron').shell.openExternal('https://just50words.com') }
            },
            {
                type: 'separator'
            },
            {
                role: 'services',
                submenu: []
            },
            {
                type: 'separator'
            },
            {
                role: 'hide'
            },
            {
                role: 'hideothers'
            },
            {
                role: 'unhide'
            },
            {
                type: 'separator'
            },
            {
                role: 'quit'
            }
        ]
    })
    // Edit menu.
    template[1].submenu.push(
        {
            type: 'separator'
        },
        {
            label: 'Speech',
            submenu: [
                {
                    role: 'startspeaking'
                },
                {
                    role: 'stopspeaking'
                }
            ]
        }
    )
    // Window menu.
    template[3].submenu = [
        {
            label: 'Close',
            accelerator: 'CmdOrCtrl+W',
            role: 'close'
        },
        {
            label: 'Minimize',
            accelerator: 'CmdOrCtrl+M',
            role: 'minimize'
        },
        {
            label: 'Zoom',
            role: 'zoom'
        },
        {
            type: 'separator'
        },
        {
            label: 'Bring All to Front',
            role: 'front'
        }
    ]
}

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)