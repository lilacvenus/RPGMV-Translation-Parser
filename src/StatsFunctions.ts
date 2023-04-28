import { ScrapeAll } from './ScrapeFunctions';
import { TranslateAll } from './TranslateFunctions';
import * as fs from 'fs';
const { readdirSync, readFileSync } = require('fs');

const GeneralTranslated = (folder_path: string, matching_files: string[], languages: string[], mode: 'under' | 'over') => {
    const scraped_data = ScrapeAll(folder_path, matching_files);
    const new_JSON = TranslateAll(languages, scraped_data);
    const old_JSON = JSON.parse(readFileSync('./output/Translations.json', 'utf8'));
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
    fs.writeFile(("./output/" + filename), JSON.stringify(output_JSON), (err: any) => {
        if (err) throw err;
        console.log(`The ${filename} file has been saved!`);
    });

    return returned_count;
};

export const UnderTranslated = (folder_path: string, matching_files: string[], languages: string[]) => {
    return GeneralTranslated(folder_path, matching_files, languages, 'under');
};

export const OverTranslated = (folder_path: string, matching_files: string[], languages: string[]) => {
    return GeneralTranslated(folder_path, matching_files, languages, 'over');
};


// Output translations that aren't changed from the generated file 
export const NotTranslated = () => {
};