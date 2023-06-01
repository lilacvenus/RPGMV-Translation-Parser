import { ScrapeAll, ScrapeMessages, ScrapeCommands, ScrapeMapNames } from './ScrapeFunctions';
import { UnderTranslated, OverTranslated, NotTranslated } from './StatsFunctions';
import { Translate, TranslateAll } from './TranslateFunctions';
import { writeFile, readdirSync } from 'fs';

const languages: string[] = ["Français"];
const mapfile_folder: string = "./MapFiles/";
const output_folder: string = "./output/";
const matching_files = readdirSync(mapfile_folder).filter(file => file.match(/^Map\d{3}\.json$/)); // Regex to match MAP000.json files

let global_JSON: any = { msg: {}, cmd: {}, terms: {}, custom: {} };

global_JSON = UnderTranslated(mapfile_folder, matching_files, languages, 'over');
// OverTranslated(mapfile_folder, matching_files, languages);

// const scraped_data = ScrapeAll(mapfile_folder, matching_files);
// global_JSON = TranslateAll(languages, scraped_data);


writeFile(output_folder + 'UnderTranslated.json', JSON.stringify(global_JSON), (err) => {
    if (err) throw err;
    console.log('UnderTranslated.json written to file!');
});

// writeFile(output_folder + 'Translations.json', JSON.stringify(global_JSON), (err) => {
//     if (err) throw err;
//     console.log('Wow!');
// });