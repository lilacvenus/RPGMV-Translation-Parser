"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Translate = exports.TranslateAll = void 0;
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
//  Translates everything in the game                                               //
//  Input: Array of strings for languages,                                          //
//         Array of string arrays [[msg], [cmd], [terms], [custom]]                 //
//  Output: JSON of blank translations for all categories                           //
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
const TranslateAll = (languages, scraped_data) => {
    let JSON = { msg: {}, cmd: {}, terms: {}, custom: {} };
    const category = ["msg", "cmd", "terms", "custom"];
    scraped_data.forEach((current_array, index) => {
        current_array.forEach((new_translation) => {
            languages.forEach((language) => {
                JSON[category[index]][new_translation] = JSON[category[index]][new_translation] || {};
                JSON[category[index]][new_translation][language] = new_translation;
            });
        });
    });
    return JSON;
};
exports.TranslateAll = TranslateAll;
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
//  Translates one category in the game                                             //
//  Input: Array of strings for languages,                                          //
//         Array of strings to generate translations for                            //
//         "msg", "cmd", "terms", or "custom" depending on the category             //
//         The existing JSON so it doesn't overwrite categories it isn't writing    //
//  Output: JSON of previous translations + chosen translation cateogory            //
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
const Translate = (languages, content_array, category, existingJSON) => {
    let newJSON = Object.assign({}, existingJSON);
    content_array.forEach(new_translation => {
        languages.forEach(language => {
            newJSON[category][new_translation] = newJSON[category][new_translation] || {};
            newJSON[category][new_translation][language] = new_translation;
        });
    });
    return newJSON;
};
exports.Translate = Translate;
//# sourceMappingURL=TranslateFunctions.js.map