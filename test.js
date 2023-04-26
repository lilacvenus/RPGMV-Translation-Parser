const fs = require('fs'); // Import the fs module if not already imported
const languages = ["English", "French"]; // Adding more language auto-generates the fields.
let translations = { msg: {}, cmd: {}, terms: {}, custom: {} };

const translate = (translations, array, type) => {
    array.forEach(newTranslation => {
        languages.forEach(language => {
            if (!translations[type][newTranslation] || !translations[type][newTranslation][language]) {
                translations[type][newTranslation] = translations[type][newTranslation] || {};
                translations[type][newTranslation][language] = newTranslation;
            }
        });
    });
};

// Load the contents of Translations.json
const theFile = require('./Translations.json');

const getUntranslatedKeys = (obj) => {
    if (!obj) return [];
    return Object.entries(obj)
        .filter(([key, value]) => {
            const values = Object.values(value);
            return values.some(val => key === val) || !values.includes(key);
        })
        .map(([key]) => key);
};

const msgUntranslated = getUntranslatedKeys(theFile.msg);
const cmdUntranslated = getUntranslatedKeys(theFile.cmd);
const termsUntranslated = getUntranslatedKeys(theFile.terms);
const customUntranslated = getUntranslatedKeys(theFile.custom);

translate(translations, msgUntranslated, 'msg');
translate(translations, cmdUntranslated, 'cmd');
translate(translations, termsUntranslated, 'terms');
translate(translations, customUntranslated, 'custom');

const data = JSON.stringify(translations, null, 2);
fs.writeFile('untranslated.json', data, (err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Data has been written to untranslated.json successfully.');
});
