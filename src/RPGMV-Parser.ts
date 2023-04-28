import { ScrapeAll, ScrapeMessages, ScrapeCommands, ScrapeMapNames } from './ScrapeFunctions';
import { UnderTranslated, OverTranslated, NotTranslated } from './StatsFunctions';
import { Translate, TranslateAll } from './TranslateFunctions';
import { writeFile, readdirSync } from 'fs';

const languages: string[] = ["Français", "Spanish"];
const folder_path: string = "./MapFiles/";
const matching_files = readdirSync(folder_path).filter(file => file.match(/^Map\d{3}\.json$/)); // Regex to match MAP000.json files

let global_JSON: any = { msg: {}, cmd: {}, terms: {}, custom: {} };

// const underStats = UnderTranslated(folder_path, matching_files, languages);
// console.log(underStats);

// const overStats = OverTranslated(folder_path, matching_files, languages);
// console.log(overStats);

let returned_JSON = NotTranslated(folder_path, matching_files, languages);
console.log(returned_JSON);

const scraped_data = ScrapeAll(folder_path, matching_files);
global_JSON = TranslateAll(languages, scraped_data);

writeFile('./output/NTranslations.json', JSON.stringify(returned_JSON), (err) => {
    if (err) throw err;
    console.log('Wow!');
});