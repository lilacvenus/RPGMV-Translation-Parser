import * as fs from 'fs';
import { ScrapeMessages, ScrapeCommands, ScrapeMapNames } from './ScrapeFunctions';

const languages: string[] = ["Français", "Spanish"];
const folder_path: string = "./MapFiles/";
const matching_files = fs.readdirSync(folder_path).filter(file => file.match(/^Map\d{3}\.json$/)); // Regex to match MAP000.json files

let scraped_messages: string[] = [];
let scraped_commands: string[] = [];
let scraped_maps: string[] = [];


// Defines the structure of the JSON
interface Translations {
    msg: { [key: string]: { [key: string]: string } };
    cmd: { [key: string]: { [key: string]: string } };
    terms: { [key: string]: { [key: string]: string } };
    custom: { [key: string]: { [key: string]: string } };
}

let global_JSON: Translations = {
    msg: {},
    cmd: {},
    terms: {},
    custom: {}
};

const translate = (global_JSON: Translations, content_array: string[], category: keyof Translations) => {
    content_array.forEach(new_translation => {
        languages.forEach(language => {
            global_JSON[category][new_translation] = global_JSON[category][new_translation] || {};
            global_JSON[category][new_translation][language] = new_translation;
        });
    });
};

scraped_messages = ScrapeMessages(folder_path, matching_files);
scraped_commands = ScrapeCommands(folder_path, matching_files);
scraped_maps = ScrapeMapNames(folder_path);
translate(global_JSON, scraped_messages, "msg");
translate(global_JSON, scraped_commands, "cmd");
translate(global_JSON, scraped_maps, "custom");

fs.writeFile('Translations.json', JSON.stringify(global_JSON), (err) => {
    if (err) throw err;
    console.log('The blank translations file has been saved as Translations.json!');
});