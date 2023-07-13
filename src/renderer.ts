// TODO: Fix blank translation file as it's missing some of the opening dialogue, and some of the text seems to have excess escape characters
// TODO: Make the message category automatically load data on project load so the user doesn't need to flip back and forth between categories
const { ipcRenderer } = require('electron');

const originalTextElement = document.getElementById('original-text') as HTMLInputElement;
const userTextElement = document.getElementById('user-text') as HTMLInputElement;
const autofillCheckbox = document.getElementById('autofill-checkbox') as HTMLInputElement;

const previousButton = document.getElementById('previous-button');
const nextButton = document.getElementById('next-button');
const loadButton = document.getElementById('load-button');

interface TheWarningRemover {
    [category: string]: {
        [text: string]: any;
    };
}

let data: TheWarningRemover = {
    msg: {},
    cmd: {},
    terms: {},
    custom: {}
};

let isAutofillChecked = autofillCheckbox?.checked;
let keys: any = [];
let currentIndex: number = 0;
let currentLanguage: string = "Français";
let currentCategory: string = "msg";


// Copies text to clipboard
document.getElementById('copy-button')?.addEventListener('click', function () { navigator.clipboard.writeText(originalTextElement?.value) });
document.getElementById('copy-button-trans')?.addEventListener('click', function () { navigator.clipboard.writeText(userTextElement?.value); });

function loadFile() {
    ipcRenderer.send('load-file', 'ping');
}

ipcRenderer.on('game-title-reply', (event: any, arg: any) => {
    const gameTitleElement = document.getElementById('project-name');
    if (gameTitleElement) {
        gameTitleElement.innerText = arg;
    }
});

ipcRenderer.on('game-icon-reply', (event, arg) => {
    if (arg === null) {
        console.log('Game icon not found.');
    } else {
        const gameIconElement = document.getElementById('project-icon');
        gameIconElement.src = `data:image/png;base64,${arg}`;
    }
});

ipcRenderer.on('load-file-translation-reply', (event: any, arg: any) => {
    data = arg;
});

function splitEscapeCharacters(originalText: string): string {

    let modifiedSplitText: string[] = [];
    let escapeNext: boolean = false;
    let splitText: string[] = splitDialogue(originalText);
    
    console.log(splitText);

    for (const element of splitText) {
        if (escapeNext) {
            modifiedSplitText.push(element);
            escapeNext = false;
        } else if (element.startsWith('\\') && element !== '\\n') {
            escapeNext = true;
        } else {
            modifiedSplitText.push(element);
        }
    }

    console.log(modifiedSplitText);

    let finalText: string = modifiedSplitText.join('');
    return finalText;
}

function updateTextFields(index: number) {
    let originalText = keys[index];

    let transText = "";
    if (currentCategory === "custom") {
        transText = data["custom"][currentLanguage][originalText];
    } else {
        transText = data[currentCategory][originalText][currentLanguage];
    }

    if (isAutofillChecked && transText === "") {
        // If autofill is on and no translation exists, make it uppercase (for now)
        // TODO: Change this to use local AI or AI API
        transText = originalText.toUpperCase();
    }

    // // ↓ SET TEXTBOX VALUES ↓ // //

    originalTextElement.value = splitEscapeCharacters(originalText);
    userTextElement.value = transText;
}

function saveData() {
    if (currentCategory === "custom") {
        data[currentLanguage][keys[currentIndex]] = userTextElement.value;
    }
    else { // msg, cmd, terms
        data[currentCategory][keys[currentIndex]][currentLanguage] = userTextElement.value;
    }
}

function switchCategory(category: string) {
    if (currentCategory !== category) {
        currentCategory = category;
        setCategory(currentCategory);

        // Update the active button
        const categoryButtons = document.querySelectorAll('.button-category');

        categoryButtons.forEach(button => {
            const isActive = button.id === `category-${currentCategory}`;
            button.classList.toggle('active', isActive);
        });
    }
}

function handleClick(isPrevious: boolean) {
    saveData();

    if (isPrevious) {
        currentIndex = (currentIndex === 0) ? keys.length - 1 : currentIndex - 1;
    } else {
        currentIndex = (currentIndex === keys.length - 1) ? 0 : currentIndex + 1;
    }

    updateTextFields(currentIndex);
}

function setCategory(category: string) {
    // TODO : Make this not error out when there's no data in a category (keys is an empty array)
    keys = currentCategory === "custom" ? Object.keys(data["custom"][currentLanguage]) : Object.keys(data[currentCategory]);
    currentIndex = 0;                           // Reset index
    updateTextFields(currentIndex);             // Update visual text fields
}

previousButton?.addEventListener('click', function () {
    handleClick(true);
});

nextButton?.addEventListener('click', function () {
    handleClick(false);
});

autofillCheckbox.addEventListener('change', function () {
    isAutofillChecked = autofillCheckbox.checked;
    updateTextFields(currentIndex);
});

loadButton?.addEventListener('click', function () {
    loadFile();
});

// TODO : Make this split properly all the time, an example problem string is: "\\autoevent[6]\\m[Avis]Weren't you supposed to be getting up nice and early\nto help Cerio with the festival stuff tomorrow?"
function splitDialogue(step0: string): string[] {
    const step1 = step0.split(/(\\C\[\d+\])/);                                      // Split on "\\C[21]"
    const step2 = step1.flatMap(item => item.split(/\\n/));                         // Split on "\n"
    const step3 = step2.flatMap(item => item.split(/(\\>)/));                       // Split on "\\>"
    const step4 = step3.flatMap(item => item.split("\\."));                         // Split on "\\."
    const step5 = step4.flatMap(item => item.split(/(\\fb)/));                      // Split on "\\fb"
    const step6 = step5.flatMap(item => item.split(/(\\\|)/));                      // Split on "\\|"
    const step7 = step6.flatMap(item => item.split(/(\\\^)/));                      // Split on "\\^"
    const step8 = step7.flatMap(item => item.split(/(\\lson)/));                    // Split on "\\lson"
    const step9 = step8.flatMap(item => item.split(/(\\lsoff)/));                   // Split on "\\lsoff"
    const step10 = step9.flatMap(item => item.split(/(\\ntc<[^>]+>)/));             // Split on "\\ntc<Construction Worker>"
    const step11 = step10.flatMap(item => item.split(/(\\fn<[^>]+>)/));             // Split on "\\fn<Gabriola>"
    const step12 = step11.flatMap(item => item.split(/(\\TA\[\d+\])/));             // Split on "\\TA[1]"
    const step13 = step12.flatMap(item => item.split(/(\\m\[[^\]]+\])/));           // Split on "\\m[Cerio]"
    const step14 = step13.flatMap(item => item.split(/(\\msgposy\[\d+\])/));        // Split on "\\msgposy[455]"
    const step15 = step14.flatMap(item => item.split(/(\\autoevent\[\d+\])/));      // Split on "\\autoevent[1]"
    const step16 = step15.flatMap(item => item.split(/(\\msgwidth\[[^\]]+\])/));    // Split on "\\msgwidth[auto]"

    const step17 = step16.flatMap(item => {                                        // Split on leading/trailing spaces
        const trimmedItem = item.trim();
        const leadingSpaces = (item.match(/^\s*/) ?? [""])[0];
        const trailingSpaces = (item.match(/\s*$/) ?? [""])[0];

        const result = [];
        if (leadingSpaces.length > 0) {
            result.push(leadingSpaces);
        }
        if (trimmedItem.length > 0) {
            result.push(trimmedItem);
        }
        if (trailingSpaces.length > 0) {
            result.push(trailingSpaces);
        }

        return result;
    });

    return step17.filter(item => item.length > 0);
}