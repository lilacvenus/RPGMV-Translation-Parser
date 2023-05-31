"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnderTranslated = exports.OverTranslated = exports.NotTranslated = void 0;
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
const OverTranslated = (folder_path, matching_files, languages) => {
};
exports.OverTranslated = OverTranslated;
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
//               Wrapper functions for the GeneralTranslated function               //
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
const UnderTranslated = (folder_path, matching_files, languages) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const scraped_data = (0, ScrapeFunctions_1.ScrapeAll)(folder_path, matching_files);
    const new_JSON = (0, TranslateFunctions_1.TranslateAll)(languages, scraped_data);
    const old_JSON = JSON.parse((0, fs_1.readFileSync)(output_folder + 'Translations.json', 'utf8'));
    const output_JSON = {};
    const categories = ["msg", "cmd", "terms", "custom"];
    for (const category of categories) {
        if (category === "custom") {
            for (const lang in old_JSON[category]) { // For each language in the custom category
                const keysInLang = Object.keys(new_JSON[category][lang]); // Array of keys in the new JSON for this language
                for (const key of keysInLang) { // For each key in this language
                    if (typeof ((_b = (_a = old_JSON[category]) === null || _a === void 0 ? void 0 : _a[lang]) === null || _b === void 0 ? void 0 : _b[key]) === 'undefined') { // If the key is not in the old JSON
                        output_JSON[category] = output_JSON[category] || {}; // Create the category if it doesn't exist
                        output_JSON[category][lang] = output_JSON[category][lang] || {}; // Create the language if it doesn't exist
                        output_JSON[category][lang][key] = (_d = (_c = new_JSON[category]) === null || _c === void 0 ? void 0 : _c[lang]) === null || _d === void 0 ? void 0 : _d[key]; // Add the key to the output JSON
                    }
                }
            }
            for (const lang in new_JSON[category]) {
                const keysInLang = Object.keys(old_JSON[category][lang]);
                for (const key of keysInLang) { // For each key in this language
                    if (typeof ((_f = (_e = new_JSON[category]) === null || _e === void 0 ? void 0 : _e[lang]) === null || _f === void 0 ? void 0 : _f[key]) === 'undefined') {
                        output_JSON[category] = output_JSON[category] || {}; // Create the category if it doesn't exist
                        output_JSON[category][lang] = output_JSON[category][lang] || {}; // Create the language if it doesn't exist
                        output_JSON[category][lang][key] = (_h = (_g = old_JSON[category]) === null || _g === void 0 ? void 0 : _g[lang]) === null || _h === void 0 ? void 0 : _h[key]; // Add the key to the output JSON
                    }
                }
            }
        }
        else {
            for (const key in new_JSON[category]) {
                // TODO
            }
        }
    }
    return output_JSON;
};
exports.UnderTranslated = UnderTranslated;
//# sourceMappingURL=StatsFunctions.js.map