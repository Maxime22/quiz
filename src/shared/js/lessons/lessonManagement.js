// Nécessaire pour tester les fonctions qui appellent d'autres fonctions du même fichier : https://stackoverflow.com/questions/45111198/how-to-mock-functions-in-the-same-module-using-jest
import * as thisModule from './lessonManagement.js';

import {checkAnswer, congratsUser, updateProgressBar, updateUI} from "./uiHelpers.js";
import {showWrongAnswerModal} from "./modal/modalManagement.js";
import {getLessonsFromSource, getScriptElementSource, getSourceLanguageFromSource} from "./lessonsData.js";
import {
    setupDB,
    updateDatabaseAndDisplay,
} from "./database/indexedDB.js";
import {calculateScoreInPercentage, calculateTimeSpent} from "./calculation.js";
import {updateAllWordsForCurrentLesson} from "./updateWords.js";

let unknownWordsForCurrentLesson = [];
const changeWordButton = document.getElementById("changeWord");

let timerStart = null;
export let globalState = {};
initializeLessonManagementGlobalState();

export function initializeLessonManagementGlobalState(
    initialLesson = 0,
    initialLessons = getLessonsFromSource(getScriptElementSource()),
    totalCountOfWordsForCurrentLesson = 0,
    initialSourceLanguage = getSourceLanguageFromSource(getScriptElementSource()),
    initialLastWordDisplayed = null,
    initialWordsForCurrentLesson = [],
    initialCurrentWordIndex = 0,
    initialUnknownWordsForCurrentLesson = []
) {
    globalState.currentLesson = initialLesson;
    globalState.lessons = initialLessons;
    globalState.totalCountOfWordsForCurrentLesson = totalCountOfWordsForCurrentLesson;
    globalState.sourceLanguage = initialSourceLanguage;
    globalState.lastWordDisplayed = initialLastWordDisplayed;
    globalState.wordsForCurrentLesson = initialWordsForCurrentLesson;
    globalState.currentWordIndex = initialCurrentWordIndex;
    globalState.unknownWordsForCurrentLesson = initialUnknownWordsForCurrentLesson;
}

export function handleKeyUp(event) {
    // "Enter"
    if (event.keyCode === 13) {
        if (timerStart === null) {
            timerStart = Date.now(); // Démarrer le timer à la première réponse
        }
        checkAnswer(
            globalState.lessons,
            globalState.wordsForCurrentLesson,
            globalState.currentWordIndex,
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
        globalState.unknownWordsForCurrentLesson,
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
    globalState.totalCountOfWordsForCurrentLesson = wordsForCurrentLesson.length;

    if (globalState.totalCountOfWordsForCurrentLesson === 0) {
        wordsForCurrentLesson = updateToNextLesson();
    }
    globalState.wordsForCurrentLesson = wordsForCurrentLesson
    return wordsForCurrentLesson;
}

export function reinitializeUnknownWords() {
    globalState.unknownWordsForCurrentLesson = [];
}

export function displayNextWord(lessons, wordsToFindForCurrentLesson, currentLesson) {
    if (wordsToFindForCurrentLesson.length === 0) {
        congratsUser(currentLesson);
        thisModule.updateCurrentLesson(lessons, currentLesson);
        return;
    }
    const wordObj = thisModule.getRandomWord(
        wordsToFindForCurrentLesson,
        currentLesson,
        globalState.lastWordDisplayed,
    );
    if (!wordObj) return;
    let currentWordSpan = document.getElementById("currentWord");
    if (currentWordSpan) {
        currentWordSpan.textContent = wordObj.word;
    }
    globalState.lastWordDisplayed = wordObj;
    globalState.currentWordIndex = wordsToFindForCurrentLesson.findIndex(word =>
        word.word === wordObj.word && word.lesson === wordObj.lesson);

    let correctAnswers = globalState.totalCountOfWordsForCurrentLesson - wordsToFindForCurrentLesson.length
    updateProgressBar(document.getElementById('progressBar') ,correctAnswers, globalState.totalCountOfWordsForCurrentLesson);
}

if (changeWordButton) {
    changeWordButton.addEventListener("click", (event) => {
        changeWord()
    });
}

export function changeWord(){
    let unknownWord = globalState.wordsForCurrentLesson[globalState.currentWordIndex].trad;
    if (globalState.unknownWordsForCurrentLesson.indexOf(unknownWord) === -1) {
        globalState.unknownWordsForCurrentLesson.push(unknownWord);
    }
    showWrongAnswerModal(globalState.wordsForCurrentLesson, globalState.currentWordIndex);
    thisModule.displayNextWord(globalState.lessons, globalState.wordsForCurrentLesson, globalState.currentLesson);
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
