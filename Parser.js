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

        let concatenatedString = "";

        json.events.forEach(event => {
            if (event && event.pages) {
                event.pages.forEach(page => {
                    if (page && page.list) {
                        page.list.forEach((item, index) => {
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


        // Write translations to file
        fs.writeFile('Translations.json', JSON.stringify(translations, null, 2), (err) => {
            if (err) throw err;
            console.log('Successfully wrote to Translations.json');
        });
    });
});

const translate = (translations, array, type) => {
    array.forEach(newTranslation => {
        languages.forEach(language => {
            translations[type][newTranslation] = translations[type][newTranslation] || {};
            translations[type][newTranslation][language] = newTranslation;
        });
    });
};
