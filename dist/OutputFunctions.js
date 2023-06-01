"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputNotTranslated = exports.OutputOverTranslated = exports.OutputUnderTranslated = exports.OutputTranslations = void 0;
const ScrapeFunctions_1 = require("./ScrapeFunctions");
const TranslateFunctions_1 = require("./TranslateFunctions");
const StatsFunctions_1 = require("./StatsFunctions");
const fs_1 = require("fs");
const output_folder = "./output/";
const WriteToFile = (file_name, data) => {
    (0, fs_1.writeFile)(output_folder + file_name, JSON.stringify(data), (err) => {
        if (err)
            throw err;
        console.log('Generated the ' + file_name + ' file!');
    });
};
const OutputTranslations = (mapfile_folder, matching_files, languages) => {
    let output_JSON = { msg: {}, cmd: {}, terms: {}, custom: {} };
    const scraped_data = (0, ScrapeFunctions_1.ScrapeAll)(mapfile_folder, matching_files);
    output_JSON = (0, TranslateFunctions_1.TranslateAll)(languages, scraped_data);
    WriteToFile('Translations.json', output_JSON);
};
exports.OutputTranslations = OutputTranslations;
const OutputUnderTranslated = (mapfile_folder, matching_files, languages) => {
    const output_JSON = (0, StatsFunctions_1.UnderTranslated)(mapfile_folder, matching_files, languages);
    WriteToFile('UnderTranslated.json', output_JSON);
};
exports.OutputUnderTranslated = OutputUnderTranslated;
const OutputOverTranslated = (mapfile_folder, matching_files, languages) => {
    const output_JSON = (0, StatsFunctions_1.OverTranslated)(mapfile_folder, matching_files, languages);
    WriteToFile('OverTranslated.json', output_JSON);
};
exports.OutputOverTranslated = OutputOverTranslated;
const OutputNotTranslated = () => {
    const output_JSON = (0, StatsFunctions_1.NotTranslated)();
    WriteToFile('NotTranslated.json', output_JSON);
};
exports.OutputNotTranslated = OutputNotTranslated;
//# sourceMappingURL=OutputFunctions.js.map