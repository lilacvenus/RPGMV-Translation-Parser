import { ScrapeAll } from './ScrapeFunctions.js';
import { TranslateAll } from './TranslateFunctions.js';
import { UnderTranslated, OverTranslated, NotTranslated } from './StatsFunctions.js';
import { writeFile} from 'fs';
import { project_path, current_language } from './GlobalVars.js';

const WriteToFile = (file_name: string, data: any) => {
    writeFile(`${project_path}/data/${file_name}`, JSON.stringify(data), (err) => {
        if (err) throw err;
        console.log('Generated the ' + file_name + ' file!');
    });
}

export const OutputTranslations = () =>{
    let output_JSON: any = { msg: {}, cmd: {}, terms: {}, custom: {} };

    output_JSON = TranslateAll(current_language, ScrapeAll());

    WriteToFile('Translations.json', output_JSON);
}

export const OutputUnderTranslated = () =>{
    const output_JSON = UnderTranslated();

    WriteToFile('UnderTranslated.json', output_JSON);
}

export const OutputOverTranslated = () =>{
    const output_JSON = OverTranslated();

    WriteToFile('OverTranslated.json', output_JSON);
}

export const OutputNotTranslated = () =>{
    const output_JSON = NotTranslated();

    WriteToFile('NotTranslated.json', output_JSON);
}
