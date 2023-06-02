"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ScrapeFunctions_1 = require("./ScrapeFunctions");
const TranslateFunctions_1 = require("./TranslateFunctions");
const fs_1 = require("fs");
const languages = ["Français"];
const mapfile_folder = "./MapFiles/";
const matching_files = (0, fs_1.readdirSync)(mapfile_folder).filter(file => file.match(/^Map\d{3}\.json$/)); // Regex to match MAP000.json files
function replacePatterns(step0) {
    const step1 = step0.split(/(\\C\[\d+\])/); // Split on "\\C[21]"
    const step2 = step1.flatMap(item => item.split(/(\\>)/)); // Split on "\\>"
    const step3 = step2.flatMap(item => item.split(/(\\fb)/)); // Split on "\\fb"
    const step4 = step3.flatMap(item => item.split(/(\\\|)/)); // Split on "\\|"
    const step5 = step4.flatMap(item => item.split(/(\\\^)/)); // Split on "\\^"
    const step6 = step5.flatMap(item => item.split(/(\\lsoff)/)); // Split on "\\lsoff"
    const step7 = step6.flatMap(item => item.split(/(\\\.\n)/)); // Split on "\\.\n"
    const step8 = step7.flatMap(item => item.split(/(\\lson)/)); // Split on "\\lson"
    const step9 = step8.flatMap(item => item.split(/(\\ntc<[^>]+>)/)); // Split on "\\ntc<Construction Worker>"
    const step10 = step9.flatMap(item => item.split(/(\\fn<[^>]+>)/)); // Split on "\\fn<Gabriola>"
    const step11 = step10.flatMap(item => item.split(/(\\m\[[^\]]+\])/)); // Split on "\\m[Cerio]"
    const step12 = step11.flatMap(item => item.split(/(\\TA\[\d+\])/)); // Split on "\\TA[1]"
    const step13 = step12.flatMap(item => item.split(/(\\msgposy\[\d+\])/)); // Split on "\\msgposy[455]"
    const step14 = step13.flatMap(item => item.split(/(\\autoevent\[\d+\])/)); // Split on "\\autoevent[1]"
    const step15 = step14.flatMap(item => item.split(/(\\msgwidth\[[^\]]+\])/)); // Split on "\\msgwidth[auto]"
    return step15.filter(item => item.trim().length > 0);
}
let scraped_data = (0, ScrapeFunctions_1.ScrapeAll)(mapfile_folder, matching_files);
let output_JSON = (0, TranslateFunctions_1.TranslateAll)(languages, scraped_data);
let condition = 1;
for (let key in output_JSON.msg) {
    condition++;
    if (output_JSON.msg.hasOwnProperty(key)) {
        console.log(replacePatterns(key));
    }
    if (condition > 10) {
        break;
    }
}
//# sourceMappingURL=RPGMV-Parser.js.map