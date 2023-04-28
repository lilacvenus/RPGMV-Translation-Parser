import { ScrapeAll } from './ScrapeFunctions';
import { TranslateAll } from './TranslateFunctions';
import * as fs from 'fs';
const { readdirSync, readFileSync } = require('fs');

// TODO: Add a count for each category rather than just a total count in UnderTranslated and OverTranslated

export const UnderTranslated = (folder_path: string, matching_files: string[], languages: string[]) => {
    const scraped_data = ScrapeAll(folder_path, matching_files);
    const new_JSON = TranslateAll(languages, scraped_data);
    const old_JSON = JSON.parse(readFileSync('Translations.json', 'utf8'));
    let under_count: number = 0;

    const categories = ['msg', 'cmd', 'terms', 'custom'];
    const under_JSON: Record<string, any> = {};

    categories.forEach((category) => {
        const oldCategory = old_JSON[category];
        const newCategory = new_JSON[category];

        if (oldCategory && newCategory) {
            Object.entries(newCategory).forEach(([key, value]) => {
                if (!oldCategory.hasOwnProperty(key)) {
                    under_JSON[category] = under_JSON[category] || {};
                    under_JSON[category][key] = value;
                    under_count++;
                }
            });
        }
    });

    fs.writeFile('UnderTranslated.json', JSON.stringify(under_JSON), (err: any) => {
        if (err) throw err;
        console.log('The under-translated file has been saved as UnderTranslated.json!');
    });

    return under_count;
};

export const OverTranslated = (folder_path: string, matching_files: string[], languages: string[]) => {
    const scraped_data = ScrapeAll(folder_path, matching_files);
    const new_JSON = TranslateAll(languages, scraped_data);
    const old_JSON = JSON.parse(readFileSync('Translations.json', 'utf8'));
    let over_count: number = 0;
    
    const categories = ['msg', 'cmd', 'terms', 'custom'];
    const over_JSON: Record<string, any> = {};

    categories.forEach((category) => {
        const oldCategory = old_JSON[category];
        const newCategory = new_JSON[category];

        if (oldCategory && newCategory) {
            Object.entries(oldCategory).forEach(([key, value]) => {
                if (!newCategory.hasOwnProperty(key)) {
                    over_JSON[category] = over_JSON[category] || {};
                    over_JSON[category][key] = value;
                    over_count++;
                }
            });
        }
    });

    fs.writeFile('OverTranslated.json', JSON.stringify(over_JSON), (err: any) => {
        if (err) throw err;
        console.log('The over-translated file has been saved as OverTranslated.json!');
    });

    return over_count;
};


// Output translations that aren't changed from the generated file 
export const NotTranslated = () => {
};