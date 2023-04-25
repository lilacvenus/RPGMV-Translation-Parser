const fs = require('fs');

const folderPath = './MapFiles';
const languages = ["Français"]; // Adding more language auto-generates the fields.
let untranslatedMsgs = [];
let untranslatedCmds = [];
let mapNames = [];


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

        // Read and add dialogue to custom translations that has a 401 code
        json.events.forEach(event => {
            if (event && event.pages) {
                event.pages.forEach(page => {
                    if (page && page.list) {
                        page.list.forEach(item => {
                            // Dialogue
                            if (item.code === 401 && Array.isArray(item.parameters)) {
                                item.parameters.forEach(param => {
                                    if (typeof param === 'string') {
                                        untranslatedMsgs.push(param);
                                    }
                                });
                            }
                            // Menu options
                            else if (item.code === 102 && Array.isArray(item.parameters) && Array.isArray(item.parameters[0])) { // Updated condition
                                item.parameters[0].forEach(param => { // Iterate through nested array
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

    // Read and add maps names to custom translations

    fs.readFile('MapFiles/MapInfos.json', (err, data) => {
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

        // Write Data to translations variable
        translate(translations, mapNames, 'custom', 'UNTRANSLATED-MAP-NAME');
        translate(translations, untranslatedMsgs, 'msg', 'UNTRANSLATED-DIALOGUE');
        translate(translations, untranslatedCmds, 'cmd', 'UNTRANSLATED-COMMAND');


        // Write translations to file
        fs.writeFile('Translations.json', JSON.stringify(translations, null, 2), (err) => {
            if (err) throw err;
            console.log('Successfully wrote to Translations.json');
        });
    });
});

const translate = (translations, array, type, defaultValue) => {
    array.forEach(newTranslation => {
        languages.forEach(language => {
            translations[type][newTranslation] = translations[type][newTranslation] || {};
            translations[type][newTranslation][language] = defaultValue;
        });
    });
};
