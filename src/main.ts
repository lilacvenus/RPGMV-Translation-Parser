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

const { app, BrowserWindow, dialog, ipcMain} = require('electron')
const path = require('path')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        icon: 'media/egg.ico',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
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
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})