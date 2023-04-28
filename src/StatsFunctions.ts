const { readdirSync, readFileSync } = require('fs');

// Output missing translations
export const UnderTranslated = () => {
};

// Output translations that aren't in the game
export const OverTranslated = () => {
};

// Output translations that aren't changed from the generated file 
export const NotTranslated = () => {
};