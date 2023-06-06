import { ScrapeAll } from './ScrapeFunctions.js';
import { TranslateAll } from './TranslateFunctions.js';
import fs from 'fs';

const languages: string[] = ["Français"];

let scraped_data = ScrapeAll();
let output_JSON = TranslateAll(languages, scraped_data);

fs.writeFile('output.json', JSON.stringify(output_JSON), (err) => {
    if (err) throw err;
    console.log('Output JSON has been written to output.json');
});


// let array = splitDialogue(key);
// array.forEach(async (element, index) => {
//         if (element[0] !== "\\") {
//                 if (element.length > 1) {
//                         let coolVar = await translateAPI(element, "FR");
//                         console.log(element, index);
//                 }
//         }
// });

// const electron = require('electron')
// const { app, BrowserWindow, dialog, ipcMain } = electron
// const fs = require('fs')
// const path = require('path')

// const createWindow = () => {
//     const win = new BrowserWindow({
//         width: 1920,
//         height: 1080,
//         icon: 'media/egg.ico',
//         webPreferences: {
//             nodeIntegration: true,
//             contextIsolation: false,
//             enableRemoteModule: true,
//         }
//     })

//     win.loadFile('index.html')
//     win.setMenuBarVisibility(false)
// }

// app.whenReady().then(() => {
//     createWindow()
//     console.log(__dirname)

//     app.on('activate', () => {
//         if (BrowserWindow.getAllWindows().length === 0) createWindow()
//     })
// })

// ipcMain.on('load-file', (event: any, arg: any) => {
//     console.log("Main recieved: " + arg);
//     dialog.showOpenDialog({ properties: ['openDirectory'] })
//         .then((result: any) => {
//             if (!result.canceled) {
//                 const folderPath = result.filePaths[0];
//                 event.reply('load-file-reply', folderPath);

//                 const filePath = `${folderPath}/data/System.json`;

//                 try {
//                     const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
//                     event.reply('game-title-reply', jsonData.gameTitle);
//                 }
//                 catch (error) {
//                     event.reply('game-title-reply', undefined);
//                     console.log(`Error loading game title: ${error}`);
//                 }

//             }
//         })
//         .catch((err: Error) => {
//             console.log(`Error loading file: ${err}`);
//         });
// })

// app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') app.quit()
// })