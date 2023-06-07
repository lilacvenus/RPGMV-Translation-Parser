import { ScrapeAll } from './ScrapeFunctions.js';
import { TranslateAll } from './TranslateFunctions.js';
import { readFileSync } from 'fs';
let project_path = "C:/Users/Venus/Desktop/Caketropolis";
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
// Locates missing or excess translations and outputs them to a file for review     //
// Input: Path to map000 files, array of all MAP000.json files, array of languages  //
// Output: A JSON object containing missing/excess translations based on mode       //
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
const GeneralTranslated = (languages, mode) => {
    const scraped_data = ScrapeAll();
    const new_JSON = TranslateAll(languages, scraped_data);
    const old_JSON = JSON.parse(readFileSync(`${project_path}/data/Translations.json`, 'utf8'));
    const output_JSON = {};
    const categories = ["msg", "cmd", "terms", "custom"];
    for (const category of categories) {
        const target_JSON = mode === 'under' ? old_JSON[category] : new_JSON[category];
        const compare_JSON = mode === 'under' ? new_JSON[category] : old_JSON[category];
        if (category === "custom") {
            for (const lang in target_JSON) {
                const keysInLang = Object.keys(compare_JSON[lang]);
                for (const key of keysInLang) {
                    if (typeof target_JSON[lang]?.[key] === 'undefined') {
                        output_JSON[category] = output_JSON[category] || {};
                        output_JSON[category][lang] = output_JSON[category][lang] || {};
                        output_JSON[category][lang][key] = compare_JSON[lang]?.[key];
                    }
                }
            }
        }
        else {
            for (const key of Object.keys(compare_JSON)) {
                if (typeof target_JSON[key] === 'undefined') {
                    output_JSON[category] = output_JSON[category] || {};
                    output_JSON[category][key] = compare_JSON[key];
                }
            }
        }
    }
    return output_JSON;
};
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
// Filters out translated objects from Translations.json in the output folder       //
// Input: None                                                                      //
// Output: A JSON object containing untranslated objects                            //
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
export const NotTranslated = () => {
    // Get the JSON that's already been translated
    const old_JSON = JSON.parse(readFileSync(`${project_path}/data/Translations.json`, 'utf8'));
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
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
//               Wrapper functions for the GeneralTranslated function               //
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
export const OverTranslated = (languages) => {
    return GeneralTranslated(languages, 'over');
};
export const UnderTranslated = (languages) => {
    return GeneralTranslated(languages, 'under');
};
//# sourceMappingURL=StatsFunctions.js.map