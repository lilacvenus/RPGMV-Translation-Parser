"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OutputFunctions_1 = require("./OutputFunctions");
const fs_1 = require("fs");
const languages = ["Français"];
const mapfile_folder = "./MapFiles/";
const matching_files = (0, fs_1.readdirSync)(mapfile_folder).filter(file => file.match(/^Map\d{3}\.json$/)); // Regex to match MAP000.json files
(0, OutputFunctions_1.OutputNotTranslated)();
(0, OutputFunctions_1.OutputOverTranslated)(mapfile_folder, matching_files, languages);
(0, OutputFunctions_1.OutputUnderTranslated)(mapfile_folder, matching_files, languages);
(0, OutputFunctions_1.OutputTranslations)(mapfile_folder, matching_files, languages);
//# sourceMappingURL=RPGMV-Parser.js.map