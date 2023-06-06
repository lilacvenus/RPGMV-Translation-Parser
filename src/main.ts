// import { OutputTranslations, OutputNotTranslated, OutputOverTranslated, OutputUnderTranslated } from './OutputFunctions';
// import { splitDialogue, translateAPI, IsDisassembleValid } from './UserFunctions.js';
// import { ScrapeMessages } from './ScrapeFunctions.js';
// import { Translate } from './TranslateFunctions.js';
// import { readdirSync } from 'fs';


// const languages: string[] = ["Français"];
// const mapfile_folder: string = "./MapFiles/";
// const matching_files = readdirSync(mapfile_folder).filter(file => file.match(/^Map\d{3}\.json$/)); // Regex to match MAP000.json files

// IsDisassembleValid(mapfile_folder, matching_files, languages);

// let scraped_data = ScrapeMessages(mapfile_folder, matching_files);
// let output_JSON = Translate(languages, scraped_data, "msg");

// let array = splitDialogue(key);
// array.forEach(async (element, index) => {
//         if (element[0] !== "\\") {
//                 if (element.length > 1) {
//                         let coolVar = await translateAPI(element, "FR");
//                         console.log(element, index);
//                 }
//         }
// });

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
}

app.whenReady().then(() => {
    createWindow()
    console.log(__dirname)

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

ipcMain.on('load-file', (event: any, arg: any) => {
    console.log("Main recieved: " + arg);
    dialog.showOpenDialog({ properties: ['openDirectory'] })
        .then((result: any) => {
            if (!result.canceled) {
                const folderPath = result.filePaths[0];
                event.reply('load-file-reply', folderPath);

                const filePath = `${folderPath}/data/System.json`;

                try {
                    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                    event.reply('game-title-reply', jsonData.gameTitle);
                }
                catch (error) {
                    event.reply('game-title-reply', undefined);
                    console.log(error);
                }

            }
        })
        .catch((err: Error) => {
            console.log(err);
        });
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})