const { ipcRenderer } = require('electron');

const originalTextElement = document.getElementById('original-text') as HTMLInputElement;
const userTextElement = document.getElementById('user-text') as HTMLInputElement;
const autofillCheckbox = document.getElementById('autofill-checkbox') as HTMLInputElement;

const previousButton = document.getElementById('previous-button');
const nextButton = document.getElementById('next-button');
const loadButton = document.getElementById('load-button');

let data = {
    msg: {}
};

let isAutofillChecked = autofillCheckbox?.checked;
let keys : any = [];
let currentIndex = 0;
const currentLanguage = "Français";

document.getElementById('copy-button')?.addEventListener('click', function () {
    navigator.clipboard.writeText(originalTextElement?.value);
});

document.getElementById('copy-button-trans')?.addEventListener('click', function () {
    navigator.clipboard.writeText(userTextElement?.value);
});

function loadFile() {
    ipcRenderer.send('load-file', 'ping');
}

ipcRenderer.on('game-title-reply', (event: any, arg: any) => {
    console.log("Render received game title: " + arg);
    const gameTitleElement = document.getElementById('game-title');
    if (gameTitleElement) {
        gameTitleElement.innerText = arg;
    }
});

ipcRenderer.on('load-file-translation-reply', (event: any, arg: any) => {
    console.log("Render received translation data: " + JSON.stringify(arg));
    data = arg;
    keys = Object.keys(data.msg);
    currentIndex = 0;
    updateTextFields(currentIndex);
});

function updateTextFields(index: number) {
    let originalText = keys[index];
    let transText = data.msg[originalText][currentLanguage];
    originalTextElement.value = originalText;

    if (isAutofillChecked && transText === "") {
        userTextElement.value = originalText.toUpperCase();
    } else {
        userTextElement.value = transText;
    }
}

function saveData() {
    data.msg[keys[currentIndex]][currentLanguage] = userTextElement.value;
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
