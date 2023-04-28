import { ScrapeAll, ScrapeMessages, ScrapeCommands, ScrapeMapNames } from './ScrapeFunctions';
import { UnderTranslated, OverTranslated, NotTranslated } from './StatsFunctions';
import { Translate, TranslateAll } from './TranslateFunctions';
import { writeFile, readdirSync } from 'fs';

const languages: string[] = ["Français"];
const mapfile_folder: string = "./MapFiles/";
const output_folder: string = "./output/";
const matching_files = readdirSync(mapfile_folder).filter(file => file.match(/^Map\d{3}\.json$/)); // Regex to match MAP000.json files

let global_JSON: any = { msg: {}, cmd: {}, terms: {}, custom: {} };

// const underStats = UnderTranslated(folder_path, matching_files, languages);
// console.log(underStats);

// const overStats = OverTranslated(folder_path, matching_files, languages);
// console.log(overStats);

let returned_JSON = NotTranslated(mapfile_folder, matching_files, languages);
console.log(returned_JSON);

const scraped_data = ScrapeAll(mapfile_folder, matching_files);
global_JSON = TranslateAll(languages, scraped_data);

writeFile(output_folder + 'NotTranslated.json', JSON.stringify(returned_JSON), (err) => {
    if (err) throw err;
    console.log('Wow!');
});