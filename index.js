const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let addWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModue: false,
            preload: path.join(__dirname, "preload.js")
        }
    });
    mainWindow.loadFile(path.join(__dirname, 'main.html'));

    mainWindow.on('closed', () => app.quit());

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
};

app.on('ready', createWindow);

function addToDo() {
    addWindow = new BrowserWindow( {
        width: 300,
        height: 200,
        title: 'Add new Todo',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModue: false,
            preload: path.join(__dirname, "preload2.js")

        }
    });
    addWindow.loadFile(path.join(__dirname, 'add.html'));
    addWindow.on('closed', () => addWindow = null);
}

function clearToDo() {
    mainWindow.webContents.send('todo:clearFromMainProcess');
}

ipcMain.on('todo:addFromSubWindow', (event, data) => {
    // console.log("in mainwindow");
    mainWindow.webContents.send('todo:addFromMainProcess', data);
    addWindow.close();
});

const menuTemplate = [
    {
        label: 'File',
        submenu: [
            {   label: 'Add todo',
                click() { addToDo(); }
            },
            {   label: 'Clear todo', 
                click() {
                    clearToDo();
                }
            },
            {   label: 'Quit',
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+W',
                click() { app.quit(); }
            }
        ]
    }
];

if (process.platform === 'darwin') {
    menuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production') {
    menuTemplate.push({
        label: 'View',
        submenu: [
            { role: 'reload' },
            { 
                label: 'Toggle Developer Tools',
                accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    })
}
