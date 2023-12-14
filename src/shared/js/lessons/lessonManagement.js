import { checkAnswer, congratsUser, updateUI } from "./uiHelpers.js";
import { showSuccess, showWrongAnswerModal } from "./modal/modalManagement.js";
import { lessons, sourceLanguage } from "./lessonsData.js";
import {
  registerLessonScore,
  setupDB,
  updateDatabaseAndDisplay,
} from "./database/indexedDB.js";
import { displayStatistics } from "./display/displayBadgeAndScore.js";
import { appel } from "./appel";
import { calculateScoreInPercentage, calculateTimeSpent } from "./calculation";

let currentLesson;
let wordsForCurrentLesson = [];
let totalCountOfWordsForCurrentLesson;
let unknownWordsForCurrentLesson = [];
let currentWordIndex;
let lastWordDisplayed = null;
const changeWordButton = document.getElementById("changeWord");
const displaySuccessButton = document.getElementById("displaySuccess");
let timerStart = null;

export function populateLessonDropdown(lessons) {
  const lessonSet = new Set(lessons.map((wordObj) => wordObj.lesson));

  const selectElement = document.getElementById("lessonSelect");
  lessonSet.forEach((lesson) => {
    const optionElement = document.createElement("option");
    optionElement.value = lesson;
    optionElement.textContent = "Leçon " + lesson;
    selectElement.appendChild(optionElement);
  });
}

export function handleKeyUp(event) {
  // "Enter"
  if (event.keyCode === 13) {
    if (timerStart === null) {
      timerStart = Date.now(); // Démarrer le timer à la première réponse
    }
    checkAnswer(
      lessons,
      wordsForCurrentLesson,
      currentWordIndex,
      currentLesson,
      lastWordDisplayed,
    );
  }
}

export function updateToNextLesson(lessons, currentLesson) {
  let timeSpent = calculateTimeSpent(timerStart);
  timerStart = null; // restart for each lesson
  let completionLessonScoreInPercentage = calculateScoreInPercentage(
    totalCountOfWordsForCurrentLesson,
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

export function updateCurrentLesson(lesson = null) {
  if (lesson !== null) {
    currentLesson = lesson;
  } else {
    currentLesson++;
  }
  let wordsForCurrentLesson = updateAllWordForCurrentLesson(currentLesson);
  if (checkIfLessonIsEmpty()) {
    updateCurrentLesson();
  }
  return wordsForCurrentLesson;
}

export function updateLessonInSelectDropdown(lesson) {
  const selectElement = document.getElementById("lessonSelect");
  if (selectElement) {
    selectElement.value = lesson;
  }
}

export function updateAllWordForCurrentLesson(currentLesson) {
  wordsForCurrentLesson = lessons.filter(
    (word) => parseInt(word.lesson) === parseInt(currentLesson),
  );
  totalCountOfWordsForCurrentLesson = wordsForCurrentLesson.length;
  return wordsForCurrentLesson;
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
    updateToNextLesson(lessons, currentLesson);
    return;
  }
  const wordObj = getRandomWord(
    wordsForCurrentLesson,
    currentLesson,
    lastWordDisplayed,
  );
  if (!wordObj) return;
  let currentWordSpan = document.getElementById("currentWord");
  if (currentWordSpan) {
    currentWordSpan.textContent = wordObj.word;
  }
  lastWordDisplayed = wordObj;
  currentWordIndex = wordsForCurrentLesson.indexOf(wordObj);
}

if (changeWordButton) {
  changeWordButton.addEventListener("click", (event) => {
    let unknownWord = wordsForCurrentLesson[currentWordIndex].trad;
    if (unknownWordsForCurrentLesson.indexOf(unknownWord) === -1) {
      unknownWordsForCurrentLesson.push(unknownWord);
    }
    showWrongAnswerModal(wordsForCurrentLesson, currentWordIndex);
    displayNextWord(lessons, wordsForCurrentLesson, currentLesson);
  });
}

if (displaySuccessButton) {
  displaySuccessButton.addEventListener("click", (event) => {
    return new Promise((resolve, reject) => {
      setupDB().then((database) => {
        showSuccess();
        displayStatistics(database, sourceLanguage);
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
