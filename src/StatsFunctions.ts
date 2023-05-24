import { ScrapeAll } from './ScrapeFunctions';
import { Translate, TranslateAll } from './TranslateFunctions';
import { readFileSync, writeFile } from 'fs';
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


// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
//               Wrapper functions for the GeneralTranslated function               //
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
export const UnderTranslated = (folder_path: string, matching_files: string[], languages: string[]) => {
    const scraped_data = ScrapeAll(folder_path, matching_files);
    const new_JSON = TranslateAll(languages, scraped_data);
    const old_JSON = JSON.parse(readFileSync(output_folder + 'Translations.json', 'utf8'));
    const categories = ['msg', 'cmd', 'terms'];
    const output_JSON: Record<string, any> = {};
};

export const OverTranslated = (folder_path: string, matching_files: string[], languages: string[]) => {
    const scraped_data = ScrapeAll(folder_path, matching_files);
    const new_JSON = TranslateAll(languages, scraped_data);
    const old_JSON = JSON.parse(readFileSync(output_folder + 'Translations.json', 'utf8'));
    const categories = ['msg', 'cmd', 'terms'];
    const output_JSON: Record<string, any> = {};
};