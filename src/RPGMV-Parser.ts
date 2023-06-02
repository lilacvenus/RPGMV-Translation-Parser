import { OutputTranslations, OutputNotTranslated, OutputOverTranslated, OutputUnderTranslated } from './OutputFunctions';
import { splitDialogue, translateAPI, IsDisassembleValid } from './UserFunctions.js';
import { ScrapeAll } from './ScrapeFunctions.js';
import { TranslateAll } from './TranslateFunctions.js';
import { readdirSync } from 'fs';


const languages: string[] = ["Français"];
const mapfile_folder: string = "./MapFiles/";
const matching_files = readdirSync(mapfile_folder).filter(file => file.match(/^Map\d{3}\.json$/)); // Regex to match MAP000.json files

const validDisassemble = IsDisassembleValid(mapfile_folder, matching_files, languages);
console.log(validDisassemble);


// let array = splitDialogue(key);
        // array.forEach(async (element, index) => {
        //     if (element[0] !== "\\") {
        //         if (element.length > 1) {
        //             let coolVar = await translateAPI(element, "FR");
        //             console.log(element, index);
        //         }
        //     }
        // });