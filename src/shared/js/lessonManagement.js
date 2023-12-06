import {checkAnswer, congratsUser} from "./uiHelpers.js";
import {showWrongAnswerModal} from "./modalManagement.js";
import {lessons} from "./lessonsData.js";
import {displayStatistics, registerBadge, registerLessonScore, setupDB} from "./indexedDB.js";

let currentLesson;
let wordsForCurrentLesson = [];
let totalCountOfWordsForCurrentLesson;
let unknownWordsForCurrentLesson = [];
let currentWordIndex;
let lastWordDisplayed = null;
const changeWordButton = document.getElementById("changeWord");
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

export function chooseLesson(lessons, lesson = null) {
    const selectElement = document.getElementById('lessonSelect');
    if (selectElement) {
        if (lesson) {
            currentLesson = lesson;
            selectElement.value = currentLesson;
        } else {
            currentLesson = parseInt(selectElement.value);
        }
    }
    wordsForCurrentLesson = lessons.filter(word => parseInt(word.lesson) === currentLesson);
    totalCountOfWordsForCurrentLesson = wordsForCurrentLesson.length;
    unknownWordsForCurrentLesson = [];
    document.getElementById('quizArea').style.display = "block";
    displayNextWord(lessons, wordsForCurrentLesson, currentLesson);
}

export function displayNextWord(lessons, wordsForCurrentLesson, currentLesson) {
    if (wordsForCurrentLesson.length === 0) {
        congratsUser(currentLesson);
        updateToNextLesson(lessons);
        return;
    }
    const wordObj = getRandomWord(wordsForCurrentLesson, currentLesson, lastWordDisplayed);
    if (!wordObj) return;
    document.getElementById('currentWord').textContent = wordObj.word;
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

export function updateToNextLesson(lessons) {
    let timeSpent = calculateTimeSpent();
    let completionLessonScoreInPercentage = calculateScoreInPercentage();
    document.getElementById('quizArea').style.display = "none";
    updateDatabaseAndDisplay(completionLessonScoreInPercentage, timeSpent).then(() => chooseLesson(lessons, currentLesson + 1))
}

function calculateTimeSpent() {
    if (timerStart) {
        let endTime = Date.now();
        let timeSpent = ((endTime - timerStart) / 1000).toFixed(2); // Temps en secondes avec 2 décimales
        return parseFloat(timeSpent); // Convertir en nombre si nécessaire
    }
    return 0;
}

function updateDatabaseAndDisplay(completionLessonScoreInPercentage, timeSpent){
    return new Promise((resolve, reject) => {
        setupDB().then((database => {
                registerBadge(database, 'Lesson_' + currentLesson);
                registerLessonScore(database, completionLessonScoreInPercentage, currentLesson, timeSpent);
                displayStatistics(database);
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