"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const ScrapeFunctions_1 = require("./ScrapeFunctions");
const TranslateFunctions_1 = require("./TranslateFunctions");
const languages = ["Français", "Spanish"];
const folder_path = "./MapFiles/";
const matching_files = fs.readdirSync(folder_path).filter(file => file.match(/^Map\d{3}\.json$/)); // Regex to match MAP000.json files
let global_JSON = { msg: {}, cmd: {}, terms: {}, custom: {} };
const scraped_data = (0, ScrapeFunctions_1.ScrapeAll)(folder_path, matching_files);
global_JSON = (0, TranslateFunctions_1.TranslateAll)(languages, scraped_data);
fs.writeFile('Translations.json', JSON.stringify(global_JSON), (err) => {
    if (err)
        throw err;
    console.log('The blank translations file has been saved as Translations.json!');
});
// let scraped_messages: string[] = scraped_data[0];
// let scraped_commands: string[] = scraped_data[1];
// let scraped_terms: string[] = scraped_data[2];
// let scraped_custom: string[] = scraped_data[3];
// scraped_messages = ScrapeMessages(folder_path, matching_files);
// scraped_commands = ScrapeCommands(folder_path, matching_files);
// scraped_custom = scraped_custom.concat(ScrapeMapNames(folder_path));
// global_JSON = Translate(languages, scraped_commands, "cmd", global_JSON);
// global_JSON = Translate(languages, scraped_messages, "msg", global_JSON);
// global_JSON = TranslateAll(languages, [scraped_messages, scraped_commands, scraped_terms, scraped_custom]);
//# sourceMappingURL=RPGMV-Parser.js.map