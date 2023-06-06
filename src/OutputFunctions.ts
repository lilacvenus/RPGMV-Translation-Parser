import { ScrapeAll } from './ScrapeFunctions';
import { TranslateAll } from './TranslateFunctions';
import { UnderTranslated, OverTranslated, NotTranslated } from './StatsFunctions';
import { writeFile} from 'fs';
const output_folder: string = "./output/";

const WriteToFile = (file_name: string, data: any) => {
    writeFile(output_folder + file_name, JSON.stringify(data), (err) => {
        if (err) throw err;
        console.log('Generated the ' + file_name + ' file!');
    });
}

export const OutputTranslations = (mapfile_folder: string, matching_files: string[], languages: string[]) =>{
    let output_JSON: any = { msg: {}, cmd: {}, terms: {}, custom: {} };

    const scraped_data = ScrapeAll();
    output_JSON = TranslateAll(languages, scraped_data);

    WriteToFile('Translations.json', output_JSON);
}

export const OutputUnderTranslated = (mapfile_folder: string, matching_files: string[], languages: string[]) =>{

    const output_JSON = UnderTranslated(mapfile_folder, matching_files, languages);

    WriteToFile('UnderTranslated.json', output_JSON);
}

export const OutputOverTranslated = (mapfile_folder: string, matching_files: string[], languages: string[]) =>{

    const output_JSON = OverTranslated(mapfile_folder, matching_files, languages);

    WriteToFile('OverTranslated.json', output_JSON);
}

export const OutputNotTranslated = () =>{
    const output_JSON = NotTranslated();

    WriteToFile('NotTranslated.json', output_JSON);
}
