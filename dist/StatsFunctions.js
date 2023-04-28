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
exports.NotTranslated = exports.OverTranslated = exports.UnderTranslated = void 0;
const ScrapeFunctions_1 = require("./ScrapeFunctions");
const TranslateFunctions_1 = require("./TranslateFunctions");
const fs = __importStar(require("fs"));
const { readdirSync, readFileSync } = require('fs');
// TODO: Add a count for each category rather than just a total count in UnderTranslated and OverTranslated
const UnderTranslated = (folder_path, matching_files, languages) => {
    const scraped_data = (0, ScrapeFunctions_1.ScrapeAll)(folder_path, matching_files);
    const new_JSON = (0, TranslateFunctions_1.TranslateAll)(languages, scraped_data);
    const old_JSON = JSON.parse(readFileSync('Translations.json', 'utf8'));
    let under_count = 0;
    const categories = ['msg', 'cmd', 'terms', 'custom'];
    const under_JSON = {};
    categories.forEach((category) => {
        const oldCategory = old_JSON[category];
        const newCategory = new_JSON[category];
        if (oldCategory && newCategory) {
            Object.entries(newCategory).forEach(([key, value]) => {
                if (!oldCategory.hasOwnProperty(key)) {
                    under_JSON[category] = under_JSON[category] || {};
                    under_JSON[category][key] = value;
                    under_count++;
                }
            });
        }
    });
    fs.writeFile('UnderTranslated.json', JSON.stringify(under_JSON), (err) => {
        if (err)
            throw err;
        console.log('The under-translated file has been saved as UnderTranslated.json!');
    });
    return under_count;
};
exports.UnderTranslated = UnderTranslated;
const OverTranslated = (folder_path, matching_files, languages) => {
    const scraped_data = (0, ScrapeFunctions_1.ScrapeAll)(folder_path, matching_files);
    const new_JSON = (0, TranslateFunctions_1.TranslateAll)(languages, scraped_data);
    const old_JSON = JSON.parse(readFileSync('Translations.json', 'utf8'));
    let over_count = 0;
    const categories = ['msg', 'cmd', 'terms', 'custom'];
    const over_JSON = {};
    categories.forEach((category) => {
        const oldCategory = old_JSON[category];
        const newCategory = new_JSON[category];
        if (oldCategory && newCategory) {
            Object.entries(oldCategory).forEach(([key, value]) => {
                if (!newCategory.hasOwnProperty(key)) {
                    over_JSON[category] = over_JSON[category] || {};
                    over_JSON[category][key] = value;
                    over_count++;
                }
            });
        }
    });
    fs.writeFile('OverTranslated.json', JSON.stringify(over_JSON), (err) => {
        if (err)
            throw err;
        console.log('The over-translated file has been saved as OverTranslated.json!');
    });
    return over_count;
};
exports.OverTranslated = OverTranslated;
// Output translations that aren't changed from the generated file 
const NotTranslated = () => {
};
exports.NotTranslated = NotTranslated;
//# sourceMappingURL=StatsFunctions.js.map