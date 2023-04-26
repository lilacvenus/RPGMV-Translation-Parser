const fs = require('fs');

const languages = ["Français"]; // Adding more language auto-generates the fields.
const menuOptions = ["Generate Translations", "Untranslated Count"];

// --------------------- //
//      DRIVER CODE      //
// --------------------- //

console.log('[MENU]');
menuOptions.forEach((option, index) => {
    console.log(`${String(index)}${'.'.padEnd(4)} ${option}`);
});

generateTranslations();
//untranslatedCount();

// --------------------- //
// THAR BE FUNCTIONS BELOW
// --------------------- //

const translate = (translations, array, type) => {
    array.forEach(newTranslation => {
        languages.forEach(language => {
            translations[type][newTranslation] = translations[type][newTranslation] || {};
            translations[type][newTranslation][language] = newTranslation;
        });
    });
};

function generateTranslations() {
    const folderPath = './MapFiles';
    let untranslatedMsgs = [], untranslatedCmds = [], mapNames = [];
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error(err);
            return;
        }

        let translations = { msg: {}, cmd: {}, terms: {}, custom: {} }; // Empty translations template

        const regex = /^Map\d{3}\.json$/; //filter files that match the format "Map000.json"
        const matchingFiles = files.filter(file => regex.test(file)); // array of files that match the format "Map000.json"

        matchingFiles.forEach(file => {
            const json = require(`./MapFiles/${file}`);
            let concatenatedString = "";

            json.events.forEach(event => {
                if (event && event.pages) {
                    event.pages.forEach(page => {
                        if (page && page.list) {
                            page.list.forEach((item, index) => {
                                // Messages (Dialogue) have the code 401, multi-line dialogue are separated in chunks in the map data
                                // So when storing them in the JSON, we concatenate them into a single string separated by \n
                                // Until we reach a different code, which means we reached the end of the chunk.
                                if (item.code === 401) {
                                    if (item.parameters && item.parameters.length > 0) {
                                        let parameter = item.parameters[0].trim();
                                        if (concatenatedString !== "") {
                                            concatenatedString += "\n" + parameter;
                                        } else {
                                            concatenatedString = parameter;
                                        }
                                    }
                                } else {
                                    if (concatenatedString !== "") {
                                        untranslatedMsgs.push(concatenatedString);
                                        concatenatedString = "";
                                    }
                                }
                                if (index === page.list.length - 1 && concatenatedString !== "") {
                                    untranslatedMsgs.push(concatenatedString);
                                    concatenatedString = "";
                                }

                                // Commands (Menu options) have the code 102 and are handled differently
                                if (item.code === 102 && Array.isArray(item.parameters) && Array.isArray(item.parameters[0])) {
                                    item.parameters[0].forEach(param => {
                                        if (typeof param === 'string') {
                                            untranslatedCmds.push(param);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });

        fs.readFile('MapFiles/MapInfos.json', (err, data) => { // Read and add maps names to custom translations
            if (err) {
                console.log("Could not read the MapInfos.json file");
                return;
            }
            const mapData = JSON.parse(data);

            mapData.forEach(item => {
                if (item && "name" in item) {
                    mapNames.push(item.name);
                }
            });

            // Write Data to translations variable before exporting as JSON
            translate(translations, mapNames, 'custom');
            translate(translations, untranslatedMsgs, 'msg');
            translate(translations, untranslatedCmds, 'cmd');

            // Gets an array of all keys, and returns the count, or 0 if no keys exist
            const msgChildren = translations.msg ? Object.keys(translations.msg).length : 0;
            const cmdChildren = translations.cmd ? Object.keys(translations.cmd).length : 0;
            const termsChildren = translations.terms ? Object.keys(translations.terms).length : 0;
            const customChildren = translations.custom ? Object.keys(translations.custom).length : 0;

            // Hardcoded until I add a language selection menu
            selectedLanguage = "notfrench"

            console.log(`[GENERATED TRANSLATIONS FOR ${selectedLanguage.toUpperCase()}]\n# of messages:   ${msgChildren.toString().padStart(8)} \n# of commands:   ${cmdChildren.toString().padStart(8)} \n# of terms:      ${termsChildren.toString().padStart(8)} \n# of custom:     ${customChildren.toString().padStart(8)}`);


            // Write translations to file
            fs.writeFile('Translations.json', JSON.stringify(translations, null, 2), (err) => {
                if (err) throw err;
                console.log('Successfully wrote to Translations.json');
            });
        });
    });
}

function untranslatedCount() {
    fs.readFile('Translations.json', (err, data) => {
        if (err) throw err;
        const translations = JSON.parse(data);
        var languages = [];
        const keysToCheck = ['msg', 'cmd', 'terms', 'custom'];

        // Checks what languages are available by checking msg, then cmd, then terms, then custom
        for (var i = 0; i < keysToCheck.length; i++) {
            var key = keysToCheck[i];
            if (translations.hasOwnProperty(key) && Object.values(translations[key])[0]) {
                languages = Object.keys(translations[key][Object.keys(translations[key])[0]]);
                if (languages.length > 0) { break; }
            }
        }
        if (languages.length === 0) {
            console.log("No languages found");
            return;
        }

        console.log("UNTRANSLATED STRINGS");
        console.log(`${'LANGUAGE'.padEnd(10)} ${'MSG'.padEnd(6)} ${'CMD'.padEnd(6)} ${'TERMS'.padEnd(6)} | ${'CUSTOM'.padEnd(6)}`);
        // Checks for untranslated strings by seeing if the key and value are the same for each language
        languages.forEach(language => {
            const msgUntranslated = translations.msg ? Object.entries(translations.msg).filter(([key, value]) => key === value[language]).length : 0;
            const cmdUntranslated = translations.cmd ? Object.entries(translations.cmd).filter(([key, value]) => key === value[language]).length : 0;
            const termsUntranslated = translations.terms ? Object.entries(translations.terms).filter(([key, value]) => key === value[language]).length : 0;
            const customUntranslated = translations.custom ? Object.entries(translations.custom).filter(([key, value]) => key === value[language]).length : 0;
            console.log(`${language.padEnd(9)}: ${String(msgUntranslated).padEnd(6)} ${String(cmdUntranslated).padEnd(6)} ${String(termsUntranslated).padEnd(6)} | ${String(customUntranslated).padEnd(6)}`);
        });
    });
}