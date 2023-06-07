import { ScrapeAll } from './ScrapeFunctions.js';
import { TranslateAll } from './TranslateFunctions.js';
import { UnderTranslated, OverTranslated, NotTranslated } from './StatsFunctions.js';
import { writeFile} from 'fs';

let project_path: string = "C:/Users/Venus/Desktop/Caketropolis";

const WriteToFile = (file_name: string, data: any) => {
    writeFile(`${project_path}/data/${file_name}`, JSON.stringify(data), (err) => {
        if (err) throw err;
        console.log('Generated the ' + file_name + ' file!');
    });
}

export const OutputTranslations = (languages: string[]) =>{
    let output_JSON: any = { msg: {}, cmd: {}, terms: {}, custom: {} };

    const scraped_data = ScrapeAll();
    output_JSON = TranslateAll(languages, scraped_data);

    WriteToFile('Translations.json', output_JSON);
}

export const OutputUnderTranslated = (languages: string[]) =>{

    const output_JSON = UnderTranslated(languages);

    WriteToFile('UnderTranslated.json', output_JSON);
}

export const OutputOverTranslated = (languages: string[]) =>{

    const output_JSON = OverTranslated(languages);

    WriteToFile('OverTranslated.json', output_JSON);
}

export const OutputNotTranslated = () =>{
    const output_JSON = NotTranslated();

    WriteToFile('NotTranslated.json', output_JSON);
}
