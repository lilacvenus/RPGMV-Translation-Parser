import { OutputTranslations, OutputNotTranslated, OutputOverTranslated, OutputUnderTranslated } from './OutputFunctions';
import { ScrapeAll } from './ScrapeFunctions';
import { TranslateAll } from './TranslateFunctions';
import { readdirSync } from 'fs';

const languages: string[] = ["Français"];
const mapfile_folder: string = "./MapFiles/";
const matching_files = readdirSync(mapfile_folder).filter(file => file.match(/^Map\d{3}\.json$/)); // Regex to match MAP000.json files

function replacePatterns(input: string): string {
    // Remove "\\C[21]"
    const step1 = input.replace(/\\C\[\d+\]/g, '');

    // Remove "\\fb"
    const step2 = step1.replace(/\\fb/g, '');

    // Remove "\\msgposy[455]"
    const step3 = step2.replace(/\\msgposy\[\d+\]/g, '');

    // Remove "\\msgwidth[auto]"
    const step4 = step3.replace(/\\msgwidth\[[^\]]+\]/g, '');

    // Remove "\\lsoff"
    const step5 = step4.replace(/\\lsoff/g, '');

    // Remove "\\>"
    const step6 = step5.replace(/\\>/g, '');

    // Remove "\\m[Cerio]"
    const step7 = step6.replace(/\\m\[[^\]]+\]/g, '');

    // Remove "\\autoevent[1]"
    const step8 = step7.replace(/\\autoevent\[\d+\]/g, '');

    // Remove "\\ntc<Construction Worker>"
    const step9 = step8.replace(/\\ntc<[^>]+>/g, '');

    // Remove "\\fn<Gabriola>"
    const step10 = step9.replace(/\\fn<[^>]+>/g, '');

    // Remove "\\TA[1]"
    const step11 = step10.replace(/\\TA\[\d+\]/g, '');

    // Remove "\\lson"
    const step12 = step11.replace(/\\lson/g, '');

    // Remove "\\|"
    const step13 = step12.replace(/\\\|/g, '');

    // Remove "\\^"
    const step14 = step13.replace(/\\\^/g, '');

    // Remove "\\."
    const step15 = step14.replace(/\\\./g, '');

    return step15;
}



let scraped_data = ScrapeAll(mapfile_folder, matching_files);
let output_JSON = TranslateAll(languages, scraped_data);

for (let key in output_JSON.msg) {
    if (output_JSON.msg.hasOwnProperty(key)) {
        console.log(replacePatterns(key));
    }
}






