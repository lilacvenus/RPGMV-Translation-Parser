import * as fs from 'fs';
import { ScrapeMessages, ScrapeCommands, ScrapeMapNames } from './ScrapeFunctions';
import { UnderTranslated, OverTranslated, NotTranslated } from './StatsFunctions';
import { Translate, TranslateAll } from './TranslateFunctions';

const languages: string[] = ["Français", "Spanish"];
const folder_path: string = "./MapFiles/";
const matching_files = fs.readdirSync(folder_path).filter(file => file.match(/^Map\d{3}\.json$/)); // Regex to match MAP000.json files

let scraped_messages: string[] = [];
let scraped_commands: string[] = [];
let scraped_terms: string[] = [];
let scraped_custom: string[] = [];

let global_JSON: any = {
    msg: {},
    cmd: {},
    terms: {},
    custom: {}
};

scraped_messages = ScrapeMessages(folder_path, matching_files);
scraped_commands = ScrapeCommands(folder_path, matching_files);
scraped_custom = scraped_custom.concat(ScrapeMapNames(folder_path));

// global_JSON = Translate(languages, scraped_commands, "cmd", global_JSON);
// global_JSON = Translate(languages, scraped_messages, "msg", global_JSON);

global_JSON = TranslateAll(languages, [scraped_messages, scraped_commands, scraped_terms, scraped_custom]);

fs.writeFile('Translations.json', JSON.stringify(global_JSON), (err) => {
    if (err) throw err;
    console.log('The blank translations file has been saved as Translations.json!');
});