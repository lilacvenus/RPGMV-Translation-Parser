"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnderTranslated = exports.OverTranslated = exports.NotTranslated = exports.GeneralTranslated = void 0;
const ScrapeFunctions_1 = require("./ScrapeFunctions");
const TranslateFunctions_1 = require("./TranslateFunctions");
const fs_1 = require("fs");
const output_folder = "./output/";
// TODO: Make it so the under/over translation functions can update Translations.json without overwriting existing data
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
// Locates missing or excess translations and outputs them to a file for review     //
// Input: Path to map000 files, array of all MAP000.json files, array of languages  //
// Output: A JSON object containing missing/excess translations based on mode       //
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
const GeneralTranslated = (folder_path, matching_files, languages, mode) => {
    var _a, _b;
    const scraped_data = (0, ScrapeFunctions_1.ScrapeAll)(folder_path, matching_files);
    const new_JSON = (0, TranslateFunctions_1.TranslateAll)(languages, scraped_data);
    const old_JSON = JSON.parse((0, fs_1.readFileSync)(output_folder + 'Translations.json', 'utf8'));
    const output_JSON = {};
    const categories = ["msg", "cmd", "terms", "custom"];
    for (const category of categories) {
        const target_JSON = mode === 'under' ? old_JSON[category] : new_JSON[category];
        const compare_JSON = mode === 'under' ? new_JSON[category] : old_JSON[category];
        if (category === "custom") {
            for (const lang in target_JSON) {
                const keysInLang = Object.keys(compare_JSON[lang]);
                for (const key of keysInLang) {
                    if (typeof ((_a = target_JSON[lang]) === null || _a === void 0 ? void 0 : _a[key]) === 'undefined') {
                        output_JSON[category] = output_JSON[category] || {};
                        output_JSON[category][lang] = output_JSON[category][lang] || {};
                        output_JSON[category][lang][key] = (_b = compare_JSON[lang]) === null || _b === void 0 ? void 0 : _b[key];
                    }
                }
            }
        }
        else {
            for (const key in target_JSON) {
                if (typeof compare_JSON[key] === 'undefined') {
                    output_JSON[category] = output_JSON[category] || {};
                    output_JSON[category][key] = target_JSON[key];
                }
            }
        }
    }
    ;
    return output_JSON;
};
exports.GeneralTranslated = GeneralTranslated;
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
const OverTranslated = (folder_path, matching_files, languages) => {
    return (0, exports.GeneralTranslated)(folder_path, matching_files, languages, 'over');
};
exports.OverTranslated = OverTranslated;
const UnderTranslated = (folder_path, matching_files, languages) => {
    return (0, exports.GeneralTranslated)(folder_path, matching_files, languages, 'under');
};
exports.UnderTranslated = UnderTranslated;
//# sourceMappingURL=StatsFunctions.js.map