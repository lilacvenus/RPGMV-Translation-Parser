import { ScrapeAll } from './ScrapeFunctions';
import { TranslateAll } from './TranslateFunctions';
import { readFileSync, writeFileSync } from 'fs';
const output_folder: string = "./output/";

// TODO: Make it so the under/over translation functions can update Translations.json without overwriting existing data


// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
// Filters out translated objects from Translations.json in the output folder       //
// Input: None                                                                      //
// Output: A JSON object containing untranslated objects                            //
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
export const NotTranslated = () => {
    // Get the JSON that's already been translated
    const old_JSON = JSON.parse(readFileSync(output_folder + 'Translations.json', 'utf8'));

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

export const OverTranslated = (folder_path: string, matching_files: string[], languages: string[]) => {
};


// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
//               Wrapper functions for the GeneralTranslated function               //
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
export const UnderTranslated = (folder_path: string, matching_files: string[], languages: string[]) => {
    const scraped_data = ScrapeAll(folder_path, matching_files);
    const new_JSON = TranslateAll(languages, scraped_data);
    const old_JSON = JSON.parse(readFileSync(output_folder + 'Translations.json', 'utf8'));
    const output_JSON: Record<string, any> = {};

    const categories = ["msg", "cmd", "terms", "custom"];
    for (const category of categories) {
        if (category === "custom") {
            for (const lang in old_JSON[category]) { // For each language in the custom category
                const keysInLang = Object.keys(new_JSON[category][lang]); // Array of keys in the new JSON for this language

                for (const key of keysInLang) { // For each key in this language
                    if (typeof old_JSON[category]?.[lang]?.[key] === 'undefined') { // If the key is not in the old JSON
                        output_JSON[category] = output_JSON[category] || {}; // Create the category if it doesn't exist
                        output_JSON[category][lang] = output_JSON[category][lang] || {}; // Create the language if it doesn't exist
                        output_JSON[category][lang][key] = new_JSON[category]?.[lang]?.[key]; // Add the key to the output JSON
                    }
                }
            }
        }


        else {
            for (const key in new_JSON[category]) {
                // console.log(key);
                // if key is not in old_JSON[category], add it to output_JSON
            }
        }

    }

    return output_JSON;
};

