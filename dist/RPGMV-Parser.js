import { IsDisassembleValid } from './UserFunctions.js';
import { readdirSync } from 'fs';
const languages = ["Français"];
const mapfile_folder = "./MapFiles/";
const matching_files = readdirSync(mapfile_folder).filter(file => file.match(/^Map\d{3}\.json$/)); // Regex to match MAP000.json files
const validDisassemble = IsDisassembleValid(mapfile_folder, matching_files, languages);
console.log(validDisassemble);
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
//# sourceMappingURL=RPGMV-Parser.js.map