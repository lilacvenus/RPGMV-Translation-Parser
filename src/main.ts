// Global variables
var project_path: string;

const electron = require('electron')
const { app, BrowserWindow, dialog, ipcMain } = electron
const fs = require('fs')
const path = require('path')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        icon: 'media/egg.ico',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    })

    win.loadFile('index.html')
    win.setMenuBarVisibility(false)
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

ipcMain.on('load-file', (event: any, arg: any) => {
    console.log(`Event: ${event}. Main received: ${arg}`);
    dialog.showOpenDialog({ properties: ['openDirectory'] })
        .then((result: any) => {
            if (!result.canceled) {
                globalThis.project_path = result.filePaths[0];
                event.reply('load-file-reply', globalThis.project_path);

                // Get game icon
                const iconPath = path.join(globalThis.project_path, 'icon/icon.png');
                fs.readFile(iconPath, (error, data) => {
                    if (error) {
                        event.reply('game-icon-reply', null);
                        console.log(`Error loading game icon: ${error}`);
                    } else {
                        event.reply('game-icon-reply', data.toString('base64'));
                    }
                });

                // Get game title
                try {
                    const gameInfo = JSON.parse(fs.readFileSync(`${globalThis.project_path}/data/System.json`, 'utf-8'));
                    event.reply('game-title-reply', gameInfo.gameTitle);
                }
                catch (error) {
                    event.reply('game-title-reply', undefined);
                    console.log(`Error loading game title: ${error}`);
                }

                // Get translations
                let translatedData = JSON.parse(fs.readFileSync(`${globalThis.project_path}/data/Translations.json`, 'utf8'));
                const normalizedData = normalizeKeys(translatedData);
                event.reply('load-file-translation-reply', normalizedData);
            }
        })
        .catch((err: Error) => {
            console.log(`Error loading file: ${err}`);
        });
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

// Normalize all keys in the JSON from Translations.JSON so languages with accents don't return undefined
function normalizeKeys(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
        return obj; // Base case: return non-object values as is
    }

    const normalizedObj: any = Array.isArray(obj) ? [] : {}; // Create a new object or array

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const normalizedKey = key.normalize('NFC');
            normalizedObj[normalizedKey] = normalizeKeys(obj[key]); // Recursively normalize nested objects
        }
    }

    return normalizedObj;
}
