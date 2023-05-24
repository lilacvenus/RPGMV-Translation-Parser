"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StatsFunctions_1 = require("./StatsFunctions");
const fs_1 = require("fs");
const languages = ["Français"];
const mapfile_folder = "./MapFiles/";
const output_folder = "./output/";
const matching_files = (0, fs_1.readdirSync)(mapfile_folder).filter(file => file.match(/^Map\d{3}\.json$/)); // Regex to match MAP000.json files
let global_JSON = { msg: {}, cmd: {}, terms: {}, custom: {} };
(0, StatsFunctions_1.UnderTranslated)(mapfile_folder, matching_files, languages);
// OverTranslated(mapfile_folder, matching_files, languages);
// const scraped_data = ScrapeAll(mapfile_folder, matching_files);
// global_JSON = TranslateAll(languages, scraped_data);
// let test_JSON = NotTranslated();
// console.log(test_JSON);
// writeFile(output_folder + 'NotTranslated.json', JSON.stringify(test_JSON), (err) => {
//     if (err) throw err;
//     console.log('Wowie!');
// });
// writeFile(output_folder + 'Translations.json', JSON.stringify(global_JSON), (err) => {
//     if (err) throw err;
//     console.log('Wow!');
// });
//# sourceMappingURL=RPGMV-Parser.js.map