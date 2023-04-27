const fs = require('fs');

const languages = ["Français", "Spanish"];
let translations = { msg: {}, cmd: {}, terms: {}, custom: {} };

// --------------------- //
//      DRIVER CODE      //
// --------------------- //

generateTranslations();
//untranslatedCount();

// --------------------- //
// THAR BE FUNCTIONS BELOW
// --------------------- //

//translate(json template, the array of shit to add, which category);
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

            console.log(mapNames.length + " map names found")
            // Write Data to translations variable before exporting as JSON
            translate(translations, mapNames, 'custom');
            translate(translations, untranslatedMsgs, 'msg');
            translate(translations, untranslatedCmds, 'cmd');

            // Gets an array of all keys, and returns the count, or 0 if no keys exist
            const msgChildren = translations.msg ? Object.keys(translations.msg).length : 0;
            const cmdChildren = translations.cmd ? Object.keys(translations.cmd).length : 0;
            const termsChildren = translations.terms ? Object.keys(translations.terms).length : 0;
            const customChildren = translations.custom ? Object.keys(translations.custom).length : 0;

            console.log(`[GENERATED TRANSLATIONS]\n# of messages:   ${msgChildren.toString().padStart(8)} \n# of commands:   ${cmdChildren.toString().padStart(8)} \n# of terms:      ${termsChildren.toString().padStart(8)} \n# of custom:     ${customChildren.toString().padStart(8)}`);


            // Write translations to file
            fs.writeFile('Translations.json', JSON.stringify(translations, null, 2), (err) => {
                if (err) throw err;
                console.log('Successfully wrote to Translations.json');
            });
        });
    });
}

function untranslatedCount() {
}

function overTranslated() {
    console.log("[OVER TRANSLATED STRINGS]");
}

function underTranslated() {
    console.log("[UNDER TRANSLATED STRINGS]");
}