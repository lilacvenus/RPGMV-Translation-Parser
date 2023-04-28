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
const StatsFunctions_1 = require("./StatsFunctions");
const languages = ["Français", "Spanish"];
const folder_path = "./MapFiles/";
const matching_files = fs.readdirSync(folder_path).filter(file => file.match(/^Map\d{3}\.json$/)); // Regex to match MAP000.json files
let global_JSON = { msg: {}, cmd: {}, terms: {}, custom: {} };
const underStats = (0, StatsFunctions_1.UnderTranslated)(folder_path, matching_files, languages);
console.log(underStats);
const overStats = (0, StatsFunctions_1.OverTranslated)(folder_path, matching_files, languages);
console.log(overStats);
// const scraped_data = ScrapeAll(folder_path, matching_files);
// global_JSON = TranslateAll(languages, scraped_data);
// fs.writeFile('./output/Translations.json', JSON.stringify(global_JSON), (err) => {
//     if (err) throw err;
//     console.log('The blank translations file has been saved as Translations.json!');
// });
//# sourceMappingURL=RPGMV-Parser.js.map