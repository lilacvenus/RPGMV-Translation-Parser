interface Translations {
    [category: string]: { [key: string]: { [key: string]: string } };
}

// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
//  Translates everything in the game                                               //
//  Input: Array of strings for languages,                                          //
//         Array of string arrays [[msg], [cmd], [terms], [custom]]                 //
//  Output: JSON of blank translations for all categories                           //
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
export const TranslateAll = (languages: string[], scraped_data: string[][]) => {
    let JSON: Translations = { msg: {}, cmd: {}, terms: {}, custom: {} };
    const category: string[] = ["msg", "cmd", "terms", "custom"];
    scraped_data.forEach((current_array: string[], index: number) => {
        current_array.forEach((new_translation: string) => {
            languages.forEach((language: string) => {
                JSON[category[index]][new_translation] = JSON[category[index]][new_translation] || {};
                JSON[category[index]][new_translation][language] = new_translation;
            });
        });
    });

    return JSON;
};

// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
//  Translates one category in the game                                             //
//  Input: Array of strings for languages,                                          //
//         Array of strings to generate translations for                            //
//         "msg", "cmd", "terms", or "custom" depending on the category             //
//         The existing JSON so it doesn't overwrite categories it isn't writing    //
//  Output: JSON of previous translations + chosen translation cateogory            //
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
export const Translate = (languages: string[], content_array: string[], category: keyof Translations, existingJSON: Translations) => {
    let newJSON: Translations = { ...existingJSON };
    content_array.forEach(new_translation => {
        languages.forEach(language => {
            newJSON[category][new_translation] = newJSON[category][new_translation] || {};
            newJSON[category][new_translation][language] = new_translation;
        });
    });

    return newJSON;
};
