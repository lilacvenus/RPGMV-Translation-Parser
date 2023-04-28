"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StatsFunctions_1 = require("./StatsFunctions");
const fs_1 = require("fs");
const languages = ["Français", "Spanish"];
const folder_path = "./MapFiles/";
const matching_files = (0, fs_1.readdirSync)(folder_path).filter(file => file.match(/^Map\d{3}\.json$/)); // Regex to match MAP000.json files
let global_JSON = { msg: {}, cmd: {}, terms: {}, custom: {} };
const underStats = (0, StatsFunctions_1.UnderTranslated)(folder_path, matching_files, languages);
console.log(underStats);
const overStats = (0, StatsFunctions_1.OverTranslated)(folder_path, matching_files, languages);
console.log(overStats);
// const scraped_data = ScrapeAll(folder_path, matching_files);
// global_JSON = TranslateAll(languages, scraped_data);
(0, fs_1.writeFile)('./output/Translations.json', JSON.stringify(global_JSON), (err) => {
    if (err)
        throw err;
    console.log('The blank translations file has been saved as Translations.json!');
});
//# sourceMappingURL=RPGMV-Parser.js.map