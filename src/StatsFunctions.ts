import { ScrapeAll } from './ScrapeFunctions';
import { TranslateAll } from './TranslateFunctions';
import { readFileSync} from 'fs';
const output_folder: string = "./output/";

// TODO: Make it so the under/over translation functions can update Translations.json without overwriting existing data

// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
// Locates missing or excess translations and outputs them to a file for review     //
// Input: Path to map000 files, array of all MAP000.json files, array of languages  //
// Output: A JSON object containing missing/excess translations based on mode       //
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
export const GeneralTranslated = (folder_path: string, matching_files: string[], languages: string[], mode: 'under' | 'over') => {
    const scraped_data = ScrapeAll(folder_path, matching_files);
    const new_JSON = TranslateAll(languages, scraped_data);
    const old_JSON = JSON.parse(readFileSync(output_folder + 'Translations.json', 'utf8'));
    const output_JSON: Record<string, any> = {};

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
            for (const key in target_JSON) {
                if (typeof compare_JSON[key] === 'undefined') {
                    output_JSON[category] = output_JSON[category] || {};
                    output_JSON[category][key] = target_JSON[key];
                }
            }
        }
    };

    return output_JSON;

};


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

// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
//               Wrapper functions for the GeneralTranslated function               //
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//

export const OverTranslated = (folder_path: string, matching_files: string[], languages: string[]) => {
    return GeneralTranslated(folder_path, matching_files, languages, 'over');
};

export const UnderTranslated = (folder_path: string, matching_files: string[], languages: string[]) => {
    return GeneralTranslated(folder_path, matching_files, languages, 'under');
};
