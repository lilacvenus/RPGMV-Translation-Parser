"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverTranslated = exports.UnderTranslated = exports.NotTranslated = void 0;
const ScrapeFunctions_1 = require("./ScrapeFunctions");
const TranslateFunctions_1 = require("./TranslateFunctions");
const fs_1 = require("fs");
const output_folder = "./output/";
// TODO: Make it so the under/over translation functions can update Translations.json without overwriting existing data
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
// Filters out translated objects from Translations.json in the output folder       //
// Input: None                                                                      //
// Output: A JSON object containing untranslated objects                            //
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
const NotTranslated = () => {
    // Get the JSON that's already been translated
    const old_JSON = JSON.parse((0, fs_1.readFileSync)(output_folder + 'Translations.json', 'utf8'));
    // Iterate over the categories: "msg", "cmd", "terms", "custom"
    const categories = ["msg", "cmd", "terms", "custom"];
    for (const category of categories) {
        const translations = old_JSON[category];
        if (category === "custom") {
            for (const lang in translations) {
                const languageObj = translations[lang];
                for (const item in languageObj) {
                    const translation = languageObj[item];
                    if (item != translation) {
                        delete languageObj[item];
                    }
                }
                // If the language has no data left, delete the language
                if (Object.keys(languageObj).length === 0) {
                    delete translations[lang];
                }
            }
        }
        else {
            for (const key in translations) {
                const translationsObj = translations[key];
                for (const lang in translationsObj) {
                    const value = translationsObj[lang];
                    if (value !== key) {
                        delete translationsObj[lang];
                    }
                }
                // If all translations have been removed, delete the entire section
                if (Object.keys(translationsObj).length === 0) {
                    delete translations[key];
                }
            }
        }
    }
    return old_JSON;
};
exports.NotTranslated = NotTranslated;
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
//               Wrapper functions for the GeneralTranslated function               //
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
const UnderTranslated = (folder_path, matching_files, languages) => {
    const scraped_data = (0, ScrapeFunctions_1.ScrapeAll)(folder_path, matching_files);
    const new_JSON = (0, TranslateFunctions_1.TranslateAll)(languages, scraped_data);
    const old_JSON = JSON.parse((0, fs_1.readFileSync)(output_folder + 'Translations.json', 'utf8'));
    const categories = ['msg', 'cmd', 'terms'];
    const output_JSON = {};
};
exports.UnderTranslated = UnderTranslated;
const OverTranslated = (folder_path, matching_files, languages) => {
    const scraped_data = (0, ScrapeFunctions_1.ScrapeAll)(folder_path, matching_files);
    const new_JSON = (0, TranslateFunctions_1.TranslateAll)(languages, scraped_data);
    const old_JSON = JSON.parse((0, fs_1.readFileSync)(output_folder + 'Translations.json', 'utf8'));
    const categories = ['msg', 'cmd', 'terms'];
    const output_JSON = {};
};
exports.OverTranslated = OverTranslated;
//# sourceMappingURL=StatsFunctions.js.map