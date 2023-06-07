import { ScrapeAll, ScrapeCommands, ScrapeMapNames, ScrapeMessages } from './ScrapeFunctions.js';
import { Translate, TranslateAll } from './TranslateFunctions.js';
import { readFileSync, writeFile } from 'fs';
import { IsDisassembleValid } from './UserFunctions.js';
import { NotTranslated, OverTranslated, UnderTranslated } from './StatsFunctions.js';
import { OutputTranslations, OutputUnderTranslated } from './OutputFunctions.js';

const languages: string[] = ["Français"];

OutputUnderTranslated(languages);
