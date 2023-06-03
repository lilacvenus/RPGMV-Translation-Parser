import { OutputTranslations, OutputNotTranslated, OutputOverTranslated, OutputUnderTranslated } from './OutputFunctions';
import { splitDialogue, translateAPI, IsDisassembleValid } from './UserFunctions.js';
import { ScrapeMessages } from './ScrapeFunctions.js';
import { Translate } from './TranslateFunctions.js';
import { readdirSync } from 'fs';


const languages: string[] = ["Français"];
const mapfile_folder: string = "./MapFiles/";
const matching_files = readdirSync(mapfile_folder).filter(file => file.match(/^Map\d{3}\.json$/)); // Regex to match MAP000.json files

IsDisassembleValid(mapfile_folder, matching_files, languages);

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