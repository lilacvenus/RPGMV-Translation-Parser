import { ScrapeAll, ScrapeMessages, ScrapeCommands, ScrapeMapNames } from './ScrapeFunctions';
import { UnderTranslated, OverTranslated, NotTranslated } from './StatsFunctions';
import { Translate, TranslateAll } from './TranslateFunctions';
import { writeFile, readdirSync } from 'fs';

const languages: string[] = ["Français"];
const mapfile_folder: string = "./MapFiles/";
const output_folder: string = "./output/";
const matching_files = readdirSync(mapfile_folder).filter(file => file.match(/^Map\d{3}\.json$/)); // Regex to match MAP000.json files

let global_JSON: any = { msg: {}, cmd: {}, terms: {}, custom: {} };

//const scraped_data = ScrapeAll(mapfile_folder, matching_files);
const scraped_custom = ScrapeMapNames(mapfile_folder);
global_JSON = Translate(languages, scraped_custom,"custom", global_JSON);
//global_JSON = TranslateAll(languages, scraped_data);

writeFile(output_folder + 'Translations.json', JSON.stringify(global_JSON), (err) => {
    if (err) throw err;
    console.log('Wow!');
});