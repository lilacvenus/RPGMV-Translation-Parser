import { ScrapeAll } from './ScrapeFunctions';
import { TranslateAll } from './TranslateFunctions';
import { readFileSync, writeFile } from 'fs';
const output_folder: string = "./output/";

// TODO: Make it so the under/over translation functions can update Translations.json without overwriting existing data

// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
//  Outputs JSON for missing or excess translations                                 //
//  Input: The path to the folder containing the MAP files                          //
//         An array of all the MAP000.json files                                    //
//         An array of all the languages to be translated                           //
//         "under" or "over" depending on the mode (handled by wrapped functions)   //
//  Output: JSON file + an array for the count of each category                     //
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
const GeneralTranslated = (folder_path: string, matching_files: string[], languages: string[], mode: 'under' | 'over') => {
    const scraped_data = ScrapeAll(folder_path, matching_files);
    const new_JSON = TranslateAll(languages, scraped_data);
    const old_JSON = JSON.parse(readFileSync(output_folder + 'Translations.json', 'utf8'));
    let returned_count: number[] = [0, 0, 0, 0];
    const categories = ['msg', 'cmd', 'terms', 'custom'];
    const output_JSON: Record<string, any> = {};

    categories.forEach((category, index) => {
        const oldCategory = old_JSON[category];
        const newCategory = new_JSON[category];

        if (oldCategory && newCategory) {
            Object.entries(newCategory).forEach(([key, value]) => {
                if (mode === 'under' && !oldCategory.hasOwnProperty(key)) {
                    output_JSON[category] = output_JSON[category] || {};
                    output_JSON[category][key] = value;
                    returned_count[index]++;
                } else if (mode === 'over' && oldCategory.hasOwnProperty(key) && !newCategory.hasOwnProperty(key)) {
                    output_JSON[category] = output_JSON[category] || {};
                    output_JSON[category][key] = oldCategory[key];
                    returned_count[index]++;
                }
            });
        }
    });

    const filename = mode === 'under' ? 'UnderTranslated.json' : 'OverTranslated.json';
    writeFile((output_folder+ filename), JSON.stringify(output_JSON), (err: any) => {
        if (err) throw err;
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
export const NotTranslated = (folder_path: string, matching_files: string[], languages: string[]) => {
    const scraped_data = ScrapeAll(folder_path, matching_files);
    const new_JSON = TranslateAll(languages, scraped_data);
    const old_JSON = JSON.parse(readFileSync(output_folder + 'Translations.json', 'utf8'))

    const result: Record<string, any> = {};

    for (const category in new_JSON) {
        result[category] = {};

        for (const item in new_JSON[category]) {
            result[category][item] = {};

            for (const lang of languages) {
                if (old_JSON[category][item] && old_JSON[category][item][lang] === new_JSON[category][item][lang]) {
                    result[category][item][lang] = new_JSON[category][item][lang];
                } else if (!old_JSON[category][item]) {
                    result[category][item][lang] = new_JSON[category][item][lang];
                }
            }

            if (Object.keys(result[category][item]).length === 0) { delete result[category][item]; }
        }

        if (Object.keys(result[category]).length === 0) { delete result[category]; }
    }

    return result;
}

// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
//               Wrapper functions for the GeneralTranslated function               //
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
export const UnderTranslated = (folder_path: string, matching_files: string[], languages: string[]) => {
    return GeneralTranslated(folder_path, matching_files, languages, 'under');
};

export const OverTranslated = (folder_path: string, matching_files: string[], languages: string[]) => {
    return GeneralTranslated(folder_path, matching_files, languages, 'over');
};