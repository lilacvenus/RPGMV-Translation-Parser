const { ipcRenderer } = require('electron');

const originalTextElement = document.getElementById('original-text') as HTMLInputElement;
const userTextElement = document.getElementById('user-text') as HTMLInputElement;
const autofillCheckbox = document.getElementById('autofill-checkbox') as HTMLInputElement;

const previousButton = document.getElementById('previous-button');
const nextButton = document.getElementById('next-button');
const loadButton = document.getElementById('load-button');

let data: {
    msg: {
        [key: string]: {
            [key: string]: string;
        };
    };
} = {
    "msg": {
        "Hello": {
            "Français": ""
        },
        "Goodbye": {
            "Français": ""
        },
        "Pesto Sauce": {
            "Français": ""
        }
    }
};

let isAutofillChecked = autofillCheckbox?.checked;
let keys = Object.keys(data.msg);
let currentIndex = 0;
const currentLanguage = 'Français';



document.getElementById('copy-button')?.addEventListener('click', function () {
    navigator.clipboard.writeText(originalTextElement?.value);
});

document.getElementById('copy-button-trans')?.addEventListener('click', function () {
    navigator.clipboard.writeText(userTextElement?.value);
});

function loadFile() {
    ipcRenderer.send('load-file');
}

function updateTextFields(index: number) {
    console.log(index);
    console.log(typeof index);
    let originalText = keys[index];
    let transText = data.msg[originalText][currentLanguage];
    originalTextElement.value = originalText;
    userTextElement.value = transText;

    if (isAutofillChecked && transText === "") {
        userTextElement.value = originalText.toUpperCase();
    }

    else {
        userTextElement.value = transText;
    }

}

function saveData() {
    data.msg[keys[currentIndex]][currentLanguage] = userTextElement.value;
    console.log(data.msg[keys[currentIndex]][currentLanguage]);
}

previousButton?.addEventListener('click', function () {
    saveData();

    if (currentIndex === 0) {
        currentIndex = keys.length - 1;
    } else {
        currentIndex--;
    }
    updateTextFields(currentIndex);
});

nextButton?.addEventListener('click', function () {
    saveData();

    if (currentIndex === keys.length - 1) {
        currentIndex = 0;
    } else {
        currentIndex++;
    }
    updateTextFields(currentIndex);
});

autofillCheckbox.addEventListener('change', function () {
    isAutofillChecked = autofillCheckbox.checked;
    updateTextFields(currentIndex);
});

updateTextFields(currentIndex);
