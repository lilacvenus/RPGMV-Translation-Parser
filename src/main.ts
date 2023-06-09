import { ScrapeAll, ScrapeCommands, ScrapeMapNames, ScrapeMessages } from './ScrapeFunctions.js';
import { Translate, TranslateAll } from './TranslateFunctions.js';
import { readFileSync, writeFile } from 'fs';
import { IsDisassembleValid } from './UserFunctions.js';
import { NotTranslated, OverTranslated, UnderTranslated } from './StatsFunctions.js';
import { OutputNotTranslated, OutputOverTranslated, OutputTranslations, OutputUnderTranslated } from './OutputFunctions.js';
import { project_path, current_language } from './GlobalVars.js';


IsDisassembleValid(current_language);
// const scraped_data = ScrapeAll();
// let output = TranslateAll(["French"], scraped_data);
// // let output = Translate(["French"], scraped_data[0], "msg");
// // output = Translate(["French"], scraped_data[1], "cmd", output);

// writeFile("newTranslateAll.json", JSON.stringify(output), (err) => {
//     if (err) throw err;
//     console.log('The file has been saved!');
// }
// );
