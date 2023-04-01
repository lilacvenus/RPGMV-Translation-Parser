const fs = require('fs');

const folderPath = './MapFiles';
const languages = ["Français"];

fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.error(err);
        return;
    }

    let translations = { msg: {}, cmd: {}, terms: {}, custom: {} };

    const newTranslation = "\\m[Rim]There's nothing to smell here."; // Temporary hard coded string

    languages.forEach(language => {
        translations.msg[newTranslation] = translations.msg[newTranslation] || {}; // Make key
        translations.msg[newTranslation][language] = ""; // Write empty translation strings
      });

    fs.writeFile('Translations.json', JSON.stringify(translations, null, 2), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      });

    //   // filter files that match the format "Map000.json"
    //   const regex = /^Map\d{3}\.json$/;
    //   const matchingFiles = files.filter(file => regex.test(file));

    //   // output the file names of the matching files
    //   matchingFiles.forEach(file => {
    //     console.log(file);
    //   });
});