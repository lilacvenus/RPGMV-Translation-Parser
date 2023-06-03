const originalTextElement = document.getElementById('original-text');
const userTextElement = document.getElementById('user-text');
const autofillCheckbox = document.getElementById('autofill-checkbox');
const previousButton = document.getElementById('previous-button');
const nextButton = document.getElementById('next-button');
document.getElementById('copy-button').addEventListener('click', function () {
    originalTextElement.select();
    navigator.clipboard.writeText(originalTextElement.value);
});

let data = {
    "msg": {
        "Hello": {
            "Français": "Hello"
        },
        "Goodbye": {
            "Français": "Goodbye"
        },
        "Pesto Sauce": {
            "Français": "Pesto Sauce"
        }
    }
};

let keys = Object.keys(data.msg);
let currentIndex = 0;
const currentLanguage = 'Français';
let isAutofillChecked = autofillCheckbox.checked;

function updateTextFields(index) {
    let originalText = keys[index];
    let transText = data.msg[originalText][currentLanguage];
    originalTextElement.value = originalText;
    userTextElement.value = transText;

    if (isAutofillChecked && originalText === transText) {
        userTextElement.value = transText.toUpperCase();
    }

    else {
        userTextElement.value = transText;
    }

}

function saveData() {
    data.msg[keys[currentIndex]][currentLanguage] = userTextElement.value;
    console.log(data.msg[keys[currentIndex]][currentLanguage]);
}

previousButton.addEventListener('click', function () {
    saveData();

    if (currentIndex === 0) {
        currentIndex = keys.length - 1;
    } else {
        currentIndex--;
    }
    updateTextFields(currentIndex);
});

nextButton.addEventListener('click', function () {
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
