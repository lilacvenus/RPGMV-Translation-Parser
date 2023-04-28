import * as fs from 'fs';
import { ScrapeAll, ScrapeMessages, ScrapeCommands, ScrapeMapNames } from './ScrapeFunctions';
import { UnderTranslated, OverTranslated, NotTranslated } from './StatsFunctions';
import { Translate, TranslateAll } from './TranslateFunctions';

const languages: string[] = ["Français", "Spanish"];
const folder_path: string = "./MapFiles/";
const matching_files = fs.readdirSync(folder_path).filter(file => file.match(/^Map\d{3}\.json$/)); // Regex to match MAP000.json files

let global_JSON: any = { msg: {}, cmd: {}, terms: {}, custom: {} };

const underStats = UnderTranslated(folder_path, matching_files, languages);
console.log(underStats);

const overStats = OverTranslated(folder_path, matching_files, languages);
console.log(overStats);

// const scraped_data = ScrapeAll(folder_path, matching_files);
// global_JSON = TranslateAll(languages, scraped_data);

// fs.writeFile('./output/Translations.json', JSON.stringify(global_JSON), (err) => {
//     if (err) throw err;
//     console.log('The blank translations file has been saved as Translations.json!');
// });