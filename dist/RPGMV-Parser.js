"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ScrapeFunctions_1 = require("./ScrapeFunctions");
const StatsFunctions_1 = require("./StatsFunctions");
const TranslateFunctions_1 = require("./TranslateFunctions");
const fs_1 = require("fs");
const languages = ["Français"];
const mapfile_folder = "./MapFiles/";
const output_folder = "./output/";
const matching_files = (0, fs_1.readdirSync)(mapfile_folder).filter(file => file.match(/^Map\d{3}\.json$/)); // Regex to match MAP000.json files
let global_JSON = { msg: {}, cmd: {}, terms: {}, custom: {} };
const scraped_data = (0, ScrapeFunctions_1.ScrapeAll)(mapfile_folder, matching_files);
global_JSON = (0, TranslateFunctions_1.TranslateAll)(languages, scraped_data);
let test_JSON = (0, StatsFunctions_1.NotTranslated)(mapfile_folder, matching_files, languages);
(0, fs_1.writeFile)(output_folder + 'NotTranslated.json', JSON.stringify(test_JSON), (err) => {
    if (err)
        throw err;
    console.log('Wowie!');
});
// writeFile(output_folder + 'Translations.json', JSON.stringify(global_JSON), (err) => {
//     if (err) throw err;
//     console.log('Wow!');
// });
//# sourceMappingURL=RPGMV-Parser.js.map