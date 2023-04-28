"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverTranslated = exports.UnderTranslated = exports.NotTranslated = void 0;
const ScrapeFunctions_1 = require("./ScrapeFunctions");
const TranslateFunctions_1 = require("./TranslateFunctions");
const fs_1 = require("fs");
const output_folder = "./output/";
// TODO: Make it so the under/over translation functions can update Translations.json without overwriting existing data
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
//  Outputs JSON for missing or excess translations                                 //
//  Input: The path to the folder containing the MAP files                          //
//         An array of all the MAP000.json files                                    //
//         An array of all the languages to be translated                           //
//         "under" or "over" depending on the mode (handled by wrapped functions)   //
//  Output: JSON file + an array for the count of each category                     //
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
const GeneralTranslated = (folder_path, matching_files, languages, mode) => {
    const scraped_data = (0, ScrapeFunctions_1.ScrapeAll)(folder_path, matching_files);
    const new_JSON = (0, TranslateFunctions_1.TranslateAll)(languages, scraped_data);
    const old_JSON = JSON.parse((0, fs_1.readFileSync)(output_folder + 'Translations.json', 'utf8'));
    let returned_count = [0, 0, 0, 0];
    const categories = ['msg', 'cmd', 'terms', 'custom'];
    const output_JSON = {};
    categories.forEach((category, index) => {
        const oldCategory = old_JSON[category];
        const newCategory = new_JSON[category];
        if (oldCategory && newCategory) {
            Object.entries(newCategory).forEach(([key, value]) => {
                if (mode === 'under' && !oldCategory.hasOwnProperty(key)) {
                    output_JSON[category] = output_JSON[category] || {};
                    output_JSON[category][key] = value;
                    returned_count[index]++;
                }
                else if (mode === 'over' && oldCategory.hasOwnProperty(key) && !newCategory.hasOwnProperty(key)) {
                    output_JSON[category] = output_JSON[category] || {};
                    output_JSON[category][key] = oldCategory[key];
                    returned_count[index]++;
                }
            });
        }
    });
    const filename = mode === 'under' ? 'UnderTranslated.json' : 'OverTranslated.json';
    (0, fs_1.writeFile)((output_folder + filename), JSON.stringify(output_JSON), (err) => {
        if (err)
            throw err;
        console.log(`The ${filename} file has been saved!`);
    });
    return returned_count;
};
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
// Filters out translated objects from newly generated file and user input          //
// Input: A file path to the folder containing the scraped data                     //
//        An array of MAP000 file names                                             //
//        An array of the languages to check for                                    //
// Output: A JSON object containing untranslated objects                            //
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
const NotTranslated = (folder_path, matching_files, languages) => {
    const scraped_data = (0, ScrapeFunctions_1.ScrapeAll)(folder_path, matching_files);
    const new_JSON = (0, TranslateFunctions_1.TranslateAll)(languages, scraped_data);
    const old_JSON = JSON.parse((0, fs_1.readFileSync)(output_folder + 'Translations.json', 'utf8'));
    const result = {};
    for (const category in new_JSON) {
        result[category] = {};
        for (const item in new_JSON[category]) {
            result[category][item] = {};
            for (const lang of languages) {
                if (old_JSON[category][item] && old_JSON[category][item][lang] === new_JSON[category][item][lang]) {
                    result[category][item][lang] = new_JSON[category][item][lang];
                }
                else if (!old_JSON[category][item]) {
                    result[category][item][lang] = new_JSON[category][item][lang];
                }
            }
            if (Object.keys(result[category][item]).length === 0) {
                delete result[category][item];
            }
        }
        if (Object.keys(result[category]).length === 0) {
            delete result[category];
        }
    }
    return result;
};
exports.NotTranslated = NotTranslated;
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
//               Wrapper functions for the GeneralTranslated function               //
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
const UnderTranslated = (folder_path, matching_files, languages) => {
    return GeneralTranslated(folder_path, matching_files, languages, 'under');
};
exports.UnderTranslated = UnderTranslated;
const OverTranslated = (folder_path, matching_files, languages) => {
    return GeneralTranslated(folder_path, matching_files, languages, 'over');
};
exports.OverTranslated = OverTranslated;
//# sourceMappingURL=StatsFunctions.js.map