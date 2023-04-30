interface Translations {
    [category: string]: { [key: string]: { [key: string]: string } };
}

// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
//  Converts all arrays to the JSON format for use by the translation plugin        //
//  Input: Array of strings for languages,                                          //
//         Array of string arrays [[msg], [cmd], [terms], [custom]]                 //
//  Output: JSON of blank translations for all categories                           //
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
export const TranslateAll = (languages: string[], scraped_data: string[][]) => {
    let JSON: Translations = { msg: {}, cmd: {}, terms: {}, custom: {} };
    const category: string[] = ["msg", "cmd", "terms", "custom"];
    scraped_data.forEach((current_array: string[], index: number) => {
        if (index === 3) {
            const translations: { [key: string]: string } = {};
            current_array.forEach((new_translation: string) => {
              languages.forEach((language: string) => {
                translations[new_translation] = new_translation;
                JSON[category[index]][language] = translations;
              });
            });
          }
        else {
            current_array.forEach((new_translation: string) => {
                languages.forEach((language: string) => {
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
