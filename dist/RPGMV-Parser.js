"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ScrapeFunctions_1 = require("./ScrapeFunctions");
const TranslateFunctions_1 = require("./TranslateFunctions");
const fs_1 = require("fs");
const languages = ["Français"];
const mapfile_folder = "./MapFiles/";
const output_folder = "./output/";
const matching_files = (0, fs_1.readdirSync)(mapfile_folder).filter(file => file.match(/^Map\d{3}\.json$/)); // Regex to match MAP000.json files
let global_JSON = { msg: {}, cmd: {}, terms: {}, custom: {} };
//const scraped_data = ScrapeAll(mapfile_folder, matching_files);
const scraped_custom = (0, ScrapeFunctions_1.ScrapeMapNames)(mapfile_folder);
global_JSON = (0, TranslateFunctions_1.Translate)(languages, scraped_custom, "custom", global_JSON);
//global_JSON = TranslateAll(languages, scraped_data);
(0, fs_1.writeFile)(output_folder + 'Translations.json', JSON.stringify(global_JSON), (err) => {
    if (err)
        throw err;
    console.log('Wow!');
});
//# sourceMappingURL=RPGMV-Parser.js.map