import { OutputTranslations, OutputNotTranslated, OutputOverTranslated, OutputUnderTranslated } from './OutputFunctions';
import { ScrapeAll } from './ScrapeFunctions';
import { TranslateAll } from './TranslateFunctions';
import { readdirSync } from 'fs';

const languages: string[] = ["Français"];
const mapfile_folder: string = "./MapFiles/";
const matching_files = readdirSync(mapfile_folder).filter(file => file.match(/^Map\d{3}\.json$/)); // Regex to match MAP000.json files

function replacePatterns(step0: string): string[] {
    const step1 = step0.split(/(\\C\[\d+\])/);                                     // Split on "\\C[21]"
    const step2 = step1.flatMap(item => item.split(/(\\>)/));                      // Split on "\\>"
    const step3 = step2.flatMap(item => item.split(/(\\fb)/));                     // Split on "\\fb"
    const step4 = step3.flatMap(item => item.split(/(\\\|)/));                     // Split on "\\|"
    const step5 = step4.flatMap(item => item.split(/(\\\^)/));                     // Split on "\\^"
    const step6 = step5.flatMap(item => item.split(/(\\lsoff)/));                  // Split on "\\lsoff"
    const step7 = step6.flatMap(item => item.split("\n"));                         // Split on "\n"
    const step8 = step7.flatMap(item => item.split(/(\\lson)/));                   // Split on "\\lson"
    const step9 = step8.flatMap(item => item.split(/(\\ntc<[^>]+>)/));             // Split on "\\ntc<Construction Worker>"
    const step10 = step9.flatMap(item => item.split(/(\\fn<[^>]+>)/));             // Split on "\\fn<Gabriola>"
    const step11 = step10.flatMap(item => item.split(/(\\m\[[^\]]+\])/));          // Split on "\\m[Cerio]"
    const step12 = step11.flatMap(item => item.split(/(\\TA\[\d+\])/));            // Split on "\\TA[1]"
    const step13 = step12.flatMap(item => item.split(/(\\msgposy\[\d+\])/));       // Split on "\\msgposy[455]"
    const step14 = step13.flatMap(item => item.split(/(\\autoevent\[\d+\])/));     // Split on "\\autoevent[1]"
    const step15 = step14.flatMap(item => item.split(/(\\msgwidth\[[^\]]+\])/));   // Split on "\\msgwidth[auto]"
    const step16 = step15.flatMap(item => item.split("\\."));                      // Split on "\\."


    return step16.filter(item => item.trim().length > 0);
}

let scraped_data = ScrapeAll(mapfile_folder, matching_files);
let output_JSON = TranslateAll(languages, scraped_data);

let condition = 1;
for (let key in output_JSON.msg) {
    condition++;
    if (output_JSON.msg.hasOwnProperty(key)) {
        let array = replacePatterns(key);
        array.forEach(element => {
            if (element[0] !== "\\") {
                console.log(element);
            }
        });
    }
    if (condition > 10) {
        break;
    }
}






