import { OutputTranslations, OutputNotTranslated, OutputOverTranslated, OutputUnderTranslated } from './OutputFunctions';
import { readdirSync } from 'fs';

const languages: string[] = ["Français"];
const mapfile_folder: string = "./MapFiles/";
const matching_files = readdirSync(mapfile_folder).filter(file => file.match(/^Map\d{3}\.json$/)); // Regex to match MAP000.json files


OutputNotTranslated();
OutputOverTranslated(mapfile_folder, matching_files, languages);
OutputUnderTranslated(mapfile_folder, matching_files, languages);
OutputTranslations(mapfile_folder, matching_files, languages);
