// const ScrapeFunctions = require('./ScrapeFunctions.js');
// const TranslateFunctions = require('./TranslateFunctions.js');
// const { IsDisassembleValid } = require('./UserFunctions.js');
// const { NotTranslated, OverTranslated, UnderTranslated } = require('./StatsFunctions.js');
// const { OutputNotTranslated, OutputOverTranslated, OutputTranslations, OutputUnderTranslated } = require('./OutputFunctions.js');

// Global variables
var project_path: string;
var current_language: string;

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

                try {
                    const gameInfo = JSON.parse(fs.readFileSync(`${globalThis.project_path}/data/System.json`, 'utf-8'));
                    event.reply('game-title-reply', gameInfo.gameTitle);
                }
                catch (error) {
                    event.reply('game-title-reply', undefined);
                    console.log(`Error loading game title: ${error}`);
                }

                let translatedData = JSON.parse(fs.readFileSync(`${globalThis.project_path}/data/Translations.json`, 'utf8'));
                event.reply('load-file-translation-reply', translatedData);
                fs.writeFileSync(`${globalThis.project_path}/data/Translations2.json`, JSON.stringify(translatedData), 'utf8');
            }
        })
        .catch((err: Error) => {
            console.log(`Error loading file: ${err}`);
        });
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
    console.log(`Project path: ${globalThis.project_path}`);
    console.log(`Target language: ${globalThis.current_language}`);
})
