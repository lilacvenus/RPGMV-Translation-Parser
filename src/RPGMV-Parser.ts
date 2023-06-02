import { OutputTranslations, OutputNotTranslated, OutputOverTranslated, OutputUnderTranslated } from './OutputFunctions';
import { ScrapeAll } from './ScrapeFunctions.js';
import { TranslateAll } from './TranslateFunctions.js';
import { readdirSync} from 'fs';
import dotnev from 'dotenv';
dotnev.config();

const languages: string[] = ["Français"];
const mapfile_folder: string = "./MapFiles/";
const matching_files = readdirSync(mapfile_folder).filter(file => file.match(/^Map\d{3}\.json$/)); // Regex to match MAP000.json files
const API_KEY = process.env.API_KEY;

async function translateAPI(text: string, target_lang: string): Promise<string> {
    const encoded_text = `text=${encodeURIComponent(text)}&target_lang=${encodeURIComponent(target_lang)}`;

    const response = await fetch('https://api-free.deepl.com/v2/translate', {
        method: 'POST',
        headers: {
            'Authorization': API_KEY??"",
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': encoded_text.length.toString()
        },
        body: encoded_text
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    return json.translations[0].text;

}

// TODO : Split leading and trailing spaces from the text to translate
function replacePatterns(step0: string): string[] {
    const step1 = step0.split(/(\\C\[\d+\])/);                                      // Split on "\\C[21]"
    const step2 = step1.flatMap(item => item.split("\n"));                          // Split on "\n"
    const step3 = step2.flatMap(item => item.split(/(\\>)/));                       // Split on "\\>"
    const step4 = step3.flatMap(item => item.split("\\."));                         // Split on "\\."
    const step5 = step4.flatMap(item => item.split(/(\\fb)/));                      // Split on "\\fb"
    const step6 = step5.flatMap(item => item.split(/(\\\|)/));                      // Split on "\\|"
    const step7 = step6.flatMap(item => item.split(/(\\\^)/));                      // Split on "\\^"
    const step8 = step7.flatMap(item => item.split(/(\\lson)/));                    // Split on "\\lson"
    const step9 = step8.flatMap(item => item.split(/(\\lsoff)/));                   // Split on "\\lsoff"
    const step10 = step9.flatMap(item => item.split(/(\\ntc<[^>]+>)/));             // Split on "\\ntc<Construction Worker>"
    const step11 = step10.flatMap(item => item.split(/(\\fn<[^>]+>)/));             // Split on "\\fn<Gabriola>"
    const step12 = step11.flatMap(item => item.split(/(\\TA\[\d+\])/));             // Split on "\\TA[1]"
    const step13 = step12.flatMap(item => item.split(/(\\m\[[^\]]+\])/));           // Split on "\\m[Cerio]"
    const step14 = step13.flatMap(item => item.split(/(\\msgposy\[\d+\])/));        // Split on "\\msgposy[455]"
    const step15 = step14.flatMap(item => item.split(/(\\autoevent\[\d+\])/));      // Split on "\\autoevent[1]"
    const step16 = step15.flatMap(item => item.split(/(\\msgwidth\[[^\]]+\])/));    // Split on "\\msgwidth[auto]"
    
    return step16.filter(item => item.trim().length > 0);
}

let scraped_data = ScrapeAll(mapfile_folder, matching_files);
let output_JSON = TranslateAll(languages, scraped_data);

let condition = 1;
for (let key in output_JSON.msg) {
    condition++;
    if (output_JSON.msg.hasOwnProperty(key)) {
        let array = replacePatterns(key);
        array.forEach(async element => {
            if (element[0] !== "\\") {
                if (element.length > 1) {
                    let coolVar = await translateAPI(element, "FR");
                    console.log(coolVar);
                }
            }
        });
    }
    if (condition > 1) {
        break;
    }
}




