import {checkAnswer, congratsUser} from "./uiHelpers.js";
import {showSuccess, showWrongAnswerModal} from "./modal/modalManagement.js";
import {lessons, sourceLanguage} from "./lessonsData.js";
import {registerLessonScore, setupDB} from "./database/indexedDB.js";
import {displayStatistics} from "./display/displayBadgeAndScore.js";

let currentLesson;
let wordsForCurrentLesson = [];
let totalCountOfWordsForCurrentLesson;
let unknownWordsForCurrentLesson = [];
let currentWordIndex;
let lastWordDisplayed = null;
const changeWordButton = document.getElementById("changeWord");
const displaySuccessButton = document.getElementById("displaySuccess");
let timerStart = null;

export function handleKeyUp(event) {
    // "Enter"
    if (event.keyCode === 13) {
        if (timerStart === null) {
            timerStart = Date.now(); // Démarrer le timer à la première réponse
        }
        checkAnswer(lessons, wordsForCurrentLesson, currentWordIndex, currentLesson, lastWordDisplayed);
    }
}

export function populateLessonDropdown(lessons) {
    const lessonSet = new Set(lessons.map(wordObj => wordObj.lesson));

    const selectElement = document.getElementById('lessonSelect');
    lessonSet.forEach(lesson => {
        const optionElement = document.createElement('option');
        optionElement.value = lesson;
        optionElement.textContent = 'Leçon ' + lesson;
        selectElement.appendChild(optionElement);
    });
}

export function updateToNextLesson(lessons) {
    let timeSpent = calculateTimeSpent(timerStart);
    timerStart = null; // restart for each lesson
    let completionLessonScoreInPercentage = calculateScoreInPercentage();
    updateDatabaseAndDisplay(completionLessonScoreInPercentage, timeSpent).then(() => {
            let wordsForNewLesson = updateCurrentLesson()
            reinitializeUnknownWords()
            updateLessonInSelectDropdown(currentLesson)
            displayNextWord(lessons, wordsForNewLesson, currentLesson)
        }
    )
}

export function updateCurrentLesson(lesson = null) {
    if (lesson !== null) {
        currentLesson = lesson
    } else {
        currentLesson++
    }
    let wordsForCurrentLesson = updateAllWordForCurrentLesson(currentLesson)
    if (checkIfLessonIsEmpty()) {
        updateCurrentLesson()
    }
    return wordsForCurrentLesson
}

export function updateLessonInSelectDropdown(lesson) {
    const selectElement = document.getElementById('lessonSelect');
    if (selectElement) {
        selectElement.value = lesson
    }
}

export function updateAllWordForCurrentLesson(currentLesson) {
    wordsForCurrentLesson = lessons.filter(word => parseInt(word.lesson) === parseInt(currentLesson));
    totalCountOfWordsForCurrentLesson = wordsForCurrentLesson.length;
    return wordsForCurrentLesson
}

function checkIfLessonIsEmpty() {
    return totalCountOfWordsForCurrentLesson === 0;
}

export function reinitializeUnknownWords() {
    unknownWordsForCurrentLesson = [];
}

export function displayNextWord(lessons, wordsForCurrentLesson, currentLesson) {
    if (wordsForCurrentLesson.length === 0) {
        congratsUser(currentLesson);
        updateToNextLesson(lessons);
        return;
    }
    const wordObj = getRandomWord(wordsForCurrentLesson, currentLesson, lastWordDisplayed);
    if (!wordObj) return;
    let currentWordSpan = document.getElementById('currentWord')
    if (currentWordSpan) {
        currentWordSpan.textContent = wordObj.word;
    }
    lastWordDisplayed = wordObj;
    currentWordIndex = wordsForCurrentLesson.indexOf(wordObj);
}

if (changeWordButton) {
    changeWordButton.addEventListener("click", (event) => {
        let unknownWord = wordsForCurrentLesson[currentWordIndex].trad
        if (unknownWordsForCurrentLesson.indexOf(unknownWord) === -1) {
            unknownWordsForCurrentLesson.push(unknownWord)
        }
        showWrongAnswerModal(wordsForCurrentLesson, currentWordIndex)
        displayNextWord(lessons, wordsForCurrentLesson, currentLesson);
    });
}

if (displaySuccessButton) {
    displaySuccessButton.addEventListener("click", (event) => {
        return new Promise((resolve, reject) => {
            setupDB().then((database => {
                    showSuccess()
                    displayStatistics(database, sourceLanguage);
                    resolve();
                }
            ));
        });
    });
}

export function calculateTimeSpent(timerStart = null) {
    if (timerStart) {
        let endTime = Date.now();
        let timeSpent = ((endTime - timerStart) / 1000).toFixed(2); // Temps en secondes avec 2 décimales
        return parseFloat(timeSpent); // Convertir en nombre si nécessaire
    }
    return 0;
}

function updateDatabaseAndDisplay(completionLessonScoreInPercentage, timeSpent) {
    return new Promise((resolve, reject) => {
        setupDB().then((database => {
                registerLessonScore(database, completionLessonScoreInPercentage, currentLesson, timeSpent, sourceLanguage);
                resolve();
            }
        ));
    });
}

export function getRandomWord(wordsForCurrentLesson, currentLesson, lastWordDisplayed) {
    if (wordsForCurrentLesson.length === 1) {
        return wordsForCurrentLesson[0];
    }
    let wordObj;
    do {
        const randomIndex = Math.floor(Math.random() * wordsForCurrentLesson.length);
        wordObj = wordsForCurrentLesson[randomIndex];
    } while (wordObj === lastWordDisplayed);

    return wordObj;
}

function calculateScoreInPercentage() {
    return Math.round(((totalCountOfWordsForCurrentLesson - unknownWordsForCurrentLesson.length) / totalCountOfWordsForCurrentLesson) * 100);
}