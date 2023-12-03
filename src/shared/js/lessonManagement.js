import {checkAnswer, congratsUser} from "./uiHelpers.js";
import {showWrongAnswerModal} from "./modalManagement.js";
import {displayStatistics, registerBadge, registerLessonScore} from "./indexedDB.js";
import {lessons} from "./lessonsData.js";

let currentLesson;
let wordsForCurrentLesson = [];
let totalCountOfWordsForCurrentLesson;
let unknownWordsForCurrentLesson = [];
let currentWordIndex;
let lastWordDisplayed = null;
const changeWordButton = document.getElementById("changeWord");
const selectElement = document.getElementById('lessonSelect');

export function handleKeyUp(event) {
    // "Enter"
    if (event.keyCode === 13) {
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

if(changeWordButton){
    changeWordButton.addEventListener("click", (event) => {
        const unknownWord = wordsForCurrentLesson[currentWordIndex].trad
        unknownWordsForCurrentLesson.push(unknownWord)
        showWrongAnswerModal(wordsForCurrentLesson, currentWordIndex)
        displayNextWord(lessons, wordsForCurrentLesson, currentLesson);
    });
}

export function updateToNextLesson(lessons) {
    let completionLessonScoreInPercentage = calculateScoreInPercentage();
    document.getElementById('quizArea').style.display = "none";
    registerBadge('Lesson_' + currentLesson);
    registerLessonScore(completionLessonScoreInPercentage, currentLesson);
    displayStatistics();
    chooseLesson(lessons, currentLesson + 1);
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