//  Wrapper function that translates a 2D array with 4 elements into a blank translation file
const TranslateAll = (language: string | string[], scraped_data: string[][]) => {
    const languages = typeof language === 'string' ? [language] : language;
    let JSON: any = {};
    const category: string[] = ["msg", "cmd", "terms", "custom"];

    scraped_data.forEach((current_array: string[], index: number) => {
        JSON = Translate(languages, current_array, category[index], JSON);
    });

    return JSON;
};



//  Converts an array to the JSON format for use by the translation plugin
const Translate = (language: string | string[], content_array: string[], category: string, existingJSON?: any) => {
    const languages = typeof language === 'string' ? [language] : language;
    let newJSON: any = { ...existingJSON };
    newJSON[category] = newJSON[category] || {};

    if (category === "custom") {
        const translations: { [key: string]: string } = {};
        content_array.forEach((new_translation: string) => {
            languages.forEach((language: string) => {
                translations[new_translation] = '';
                newJSON["custom"][language] = translations;
            });
        });
    }

    else {
        content_array.forEach(new_translation => {
            languages.forEach(language => {
                newJSON[category][new_translation] = newJSON[category][new_translation] || {};
                newJSON[category][new_translation][language] = '';
            });
        });
    }


    return newJSON;
};

module.exports = { TranslateAll, Translate };
