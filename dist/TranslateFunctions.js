// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
//  Converts all arrays to the JSON format for use by the translation plugin        //
//  Input: Array of strings for languages,                                          //
//         Array of string arrays [[msg], [cmd], [terms], [custom]]                 //
//  Output: JSON of blank translations for all categories                           //
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
export const TranslateAll = (languages, scraped_data) => {
    let JSON = { msg: {}, cmd: {}, terms: {}, custom: {} };
    const category = ["msg", "cmd", "terms", "custom"];
    scraped_data.forEach((current_array, index) => {
        if (index === 3) {
            const translations = {};
            current_array.forEach((new_translation) => {
                languages.forEach((language) => {
                    translations[new_translation] = new_translation;
                    JSON["custom"][language] = translations;
                });
            });
        }
        else {
            current_array.forEach((new_translation) => {
                languages.forEach((language) => {
                    JSON[category[index]][new_translation] = JSON[category[index]][new_translation] || {};
                    JSON[category[index]][new_translation][language] = new_translation;
                });
            });
        }
    });
    return JSON;
};
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
//  Converts an array to the JSON format for use by the translation plugin          //
//  Input: Array of strings for all the languages you want,                         //
//         Array of strings to generate translations for,                           //
//         "msg", "cmd", "terms", or "custom" depending on the category             //
//         The existing JSON so it doesn't overwrite old data,                      //
//  Output: JSON of previous translations + chosen translation category             //
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
export const Translate = (languages, content_array, category, existingJSON) => {
    let newJSON = { ...existingJSON };
    newJSON[category] = newJSON[category] || {};
    if (category === "custom") {
        const translations = {};
        content_array.forEach((new_translation) => {
            languages.forEach((language) => {
                translations[new_translation] = new_translation;
                newJSON["custom"][language] = translations;
            });
        });
    }
    else {
        content_array.forEach(new_translation => {
            languages.forEach(language => {
                newJSON[category][new_translation] = newJSON[category][new_translation] || {};
                newJSON[category][new_translation][language] = new_translation;
            });
        });
    }
    return newJSON;
};
//# sourceMappingURL=TranslateFunctions.js.map