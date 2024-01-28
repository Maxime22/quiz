// Nécessaire pour tester les fonctions qui appellent d'autres fonctions du même fichier : https://stackoverflow.com/questions/45111198/how-to-mock-functions-in-the-same-module-using-jest
import * as thisModule from './lessonManagement.js';

import {checkAnswer, congratsUser, updateUI} from "./uiHelpers.js";
import {showSuccess, showWrongAnswerModal} from "./modal/modalManagement.js";
import {lessons, sourceLanguage} from "./lessonsData.js";
import {
    setupDB,
    updateDatabaseAndDisplay,
} from "./database/indexedDB.js";
import {displayStatistics} from "./display/displayBadgeAndScore.js";
import {calculateScoreInPercentage, calculateTimeSpent} from "./calculation.js";
import {updateAllWordsForCurrentLesson} from "./updateWords.js";

let wordsForCurrentLesson = [];
let unknownWordsForCurrentLesson = [];
let currentWordIndex;
const changeWordButton = document.getElementById("changeWord");
const displaySuccessButton = document.getElementById("displaySuccess");
let timerStart = null;
export let globalState = {};
initializeLessonManagementGlobalState();

export function initializeLessonManagementGlobalState(
    initialLesson = 0,
    initialLessons = lessons,
    totalCountOfWordsForCurrentLesson = 0,
    initialSourceLanguage = sourceLanguage,
    initialLastWordDisplayed = null
) {
    globalState.currentLesson = initialLesson;
    globalState.lessons = initialLessons;
    globalState.totalCountOfWordsForCurrentLesson = totalCountOfWordsForCurrentLesson;
    globalState.sourceLanguage = initialSourceLanguage;
    globalState.lastWordDisplayed = initialLastWordDisplayed;
}

export function handleKeyUp(event) {
    // "Enter"
    if (event.keyCode === 13) {
        if (timerStart === null) {
            timerStart = Date.now(); // Démarrer le timer à la première réponse
        }
        checkAnswer(
            globalState.lessons,
            wordsForCurrentLesson,
            currentWordIndex,
            globalState.currentLesson,
            globalState.lastWordDisplayed,
        );
    }
}

export function updateCurrentLesson(lessons, currentLesson) {
    let timeSpent = calculateTimeSpent(timerStart);
    timerStart = null; // restart for each lesson
    let completionLessonScoreInPercentage = calculateScoreInPercentage(
        globalState.totalCountOfWordsForCurrentLesson,
        unknownWordsForCurrentLesson,
    );
    return updateDatabaseAndDisplay(
        completionLessonScoreInPercentage,
        timeSpent,
        currentLesson,
    )
        .then(() => {
            updateUI(lessons, currentLesson);
        })
        .catch((error) => {
            console.log(error);
        });
}

export function updateToNextLesson(lesson = null) {
    if (lesson !== null) {
        globalState.currentLesson = lesson;
    } else {
        globalState.currentLesson++;
    }
    let wordsForCurrentLesson = updateAllWordsForCurrentLesson(globalState.currentLesson, globalState.lessons);

    if (wordsForCurrentLesson !== undefined) {
        globalState.totalCountOfWordsForCurrentLesson = wordsForCurrentLesson.length;
    } else {
        globalState.totalCountOfWordsForCurrentLesson = 0;
    }

    if (globalState.totalCountOfWordsForCurrentLesson === 0) {
        wordsForCurrentLesson = updateToNextLesson();
    }
    return wordsForCurrentLesson;
}

export function reinitializeUnknownWords() {
    unknownWordsForCurrentLesson = [];
}

export function displayNextWord(lessons, wordsForCurrentLesson, currentLesson) {
    if (wordsForCurrentLesson.length === 0) {
        congratsUser(currentLesson);
        thisModule.updateCurrentLesson(lessons, currentLesson);
        return;
    }
    // TODO
    const wordObj = getRandomWord(
        wordsForCurrentLesson,
        currentLesson,
        globalState.lastWordDisplayed,
    );
    if (!wordObj) return;
    let currentWordSpan = document.getElementById("currentWord");
    if (currentWordSpan) {
        currentWordSpan.textContent = wordObj.word;
    }
    globalState.lastWordDisplayed = wordObj;
    currentWordIndex = wordsForCurrentLesson.indexOf(wordObj);
}

if (changeWordButton) {
    changeWordButton.addEventListener("click", (event) => {
        let unknownWord = wordsForCurrentLesson[currentWordIndex].trad;
        if (unknownWordsForCurrentLesson.indexOf(unknownWord) === -1) {
            unknownWordsForCurrentLesson.push(unknownWord);
        }
        showWrongAnswerModal(wordsForCurrentLesson, currentWordIndex);
        displayNextWord(globalState.lessons, wordsForCurrentLesson, currentLesson);
    });
}

if (displaySuccessButton) {
    displaySuccessButton.addEventListener("click", (event) => {
        return new Promise((resolve, reject) => {
            setupDB().then((database) => {
                showSuccess();
                displayStatistics(database, globalState.sourceLanguage);
                resolve();
            });
        });
    });
}

export function getRandomWord(
    wordsForCurrentLesson,
    currentLesson,
    lastWordDisplayed,
) {
    if (wordsForCurrentLesson.length === 1) {
        return wordsForCurrentLesson[0];
    }
    let wordObj;
    do {
        const randomIndex = Math.floor(
            Math.random() * wordsForCurrentLesson.length,
        );
        wordObj = wordsForCurrentLesson[randomIndex];
    } while (wordObj === lastWordDisplayed);

    return wordObj;
}
