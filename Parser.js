const fs = require('fs');

const folderPath = './MapFiles';
const languages = ["Français"];
let untranslatedMsgs = ["\\m[Rim]There's nothing to smell here.", "\\m[Rim]I probably shouldn't do that."]; // temporary hard coded strings
let mapNames = [];

fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.error(err);
        return;
    }

    let translations = { msg: {}, cmd: {}, terms: {}, custom: {} }; // Empty translations template

    // Read all parameters here

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
                translations.custom[mapName][language] = "";
            });
        });

        untranslatedMsgs.forEach(newTranslation => { // All the dialogue from Map000.json files
            languages.forEach(language => {
                translations.msg[newTranslation] = translations.msg[newTranslation] || {};
                translations.msg[newTranslation][language] = "";
            });
        });


        // Write translations to file
        fs.writeFile('Translations.json', JSON.stringify(translations, null, 2), (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
    });

    // filter files that match the format "Map000.json"
    // const regex = /^Map\d{3}\.json$/;
    // const matchingFiles = files.filter(file => regex.test(file));
});
