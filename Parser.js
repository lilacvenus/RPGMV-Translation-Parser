const fs = require('fs');

const folderPath = './MapFiles';
const languages = ["Français", "Spanish"];
//let untranslatedMsgs = ["\\m[Rim]There's nothing to smell here.", "\\m[Rim]I probably shouldn't do that."]; // temporary hard coded strings
let untranslatedMsgs = [];
let mapNames = [];

fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.error(err);
        return;
    }

    let translations = { msg: {}, cmd: {}, terms: {}, custom: {} }; // Empty translations template

    // Read all parameters here
    const regex = /^Map\d{3}\.json$/; //filter files that match the format "Map000.json"
    const matchingFiles = files.filter(file => regex.test(file)); // array of files that match the format "Map000.json"

    console.log("Found " + matchingFiles.length + " files");

    const totalFiles = matchingFiles.length;
    let processedFiles = 0;

    function progressBar(current, total) {
        const percent = (current / total) * 100;
        const filled = Math.floor(percent / 5);
        const empty = 20 - filled;
        const progressBar = "[" + "#".repeat(filled) + " ".repeat(empty) + "]";
        console.clear();
        console.log("Processing Dialogue: " + progressBar + " " + current + "/" + total + " - " + percent.toFixed(2) + "%");
    }

    matchingFiles.forEach(file => {
        const json = require(`./MapFiles/${file}`); // Load the JSON files

        // Read and add dialogue to custom translations that has a 401 code
        json.events.forEach(event => {
            if (event && event.pages) {
                event.pages.forEach(page => {
                    if (page && page.list) {
                        page.list.forEach(item => {
                            if (item.code === 401 && Array.isArray(item.parameters)) {
                                item.parameters.forEach(param => {
                                    if (typeof param === 'string') {
                                        untranslatedMsgs.push(param);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
        
        progressBar(++processedFiles, totalFiles);
    });


    // End of reading parameters

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
        mapNames.forEach(mapName => { // All the map names from MapInfos.json
            languages.forEach(language => {
                translations.custom[mapName] = translations.custom[mapName] || {};
                translations.custom[mapName][language] = "UNTRANSLATED-MAP-NAME";
            });
        });

        untranslatedMsgs.forEach(newTranslation => { // All the dialogue from Map000.json files
            languages.forEach(language => {
                translations.msg[newTranslation] = translations.msg[newTranslation] || {};
                translations.msg[newTranslation][language] = "UNTRANSLATED-DIALOGUE";
            });
        });


        // Write translations to file
        fs.writeFile('Translations.json', JSON.stringify(translations, null, 2), (err) => {
            if (err) throw err;
            console.log('Successfully wrote to Translations.json');
        });
    });


});
