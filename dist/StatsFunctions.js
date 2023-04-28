"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotTranslated = exports.OverTranslated = exports.UnderTranslated = void 0;
const { readdirSync, readFileSync } = require('fs');
// Output missing translations
const UnderTranslated = () => {
};
exports.UnderTranslated = UnderTranslated;
// Output translations that aren't in the game
const OverTranslated = () => {
};
exports.OverTranslated = OverTranslated;
// Output translations that aren't changed from the generated file 
const NotTranslated = () => {
};
exports.NotTranslated = NotTranslated;
//# sourceMappingURL=StatsFunctions.js.map