import { playSound } from "./media/soundManagement.js";
import { showLessonCompletedModal } from "./modal/modalManagement.js";
import {
  displayNextWord,
  reinitializeUnknownWords,
  updateToNextLesson
} from "./lessonManagement.js";
import { updateLessonInSelectDropdown } from "./dropdownManagement.js";
import * as thisModule from './uiHelpers.js';

export function checkAnswer(
  lessons,
  wordsForCurrentLesson,
  currentWordIndex,
  currentLesson,
) {
  const userTranslation = document
    .getElementById("userLessonInput")
    .value.toLowerCase()
    .trim();
  const currentCorrectTranslation = wordsForCurrentLesson[currentWordIndex].trad
    .toLowerCase()
    .trim();
  const feedbackEmojiElement = document.getElementById("feedbackEmoji");

  // accents or not are equivalent in the condition
  if (
    userTranslation.localeCompare(currentCorrectTranslation, undefined, {
      sensitivity: "base",
    }) === 0
  ) {
    feedbackEmojiElement.textContent = "✅"; // Émoji de validation verte
    if (wordsForCurrentLesson.length !== 1) {
      playSound("correctSound");
    }
    wordsForCurrentLesson.splice(currentWordIndex, 1); // Supprimez le mot du tableau
    displayNextWord(lessons, wordsForCurrentLesson, currentLesson);
  } else {
    feedbackEmojiElement.textContent = "❌"; // Émoji de croix rouge
    playSound("wrongSound");
  }
  document.getElementById("userLessonInput").value = ""; // Réinitialisez l'input
}

export function congratsUser(currentLesson) {
  playSound("lessonCompletedSound");
  showLessonCompletedModal(currentLesson);
}

export function updateUI(lessons, currentLesson) {
  let wordsForNewLesson = updateToNextLesson();
  reinitializeUnknownWords();
  updateLessonInSelectDropdown(currentLesson + 1);
  thisModule.resetProgressBar(document.getElementById('progressBar'));
  displayNextWord(lessons, wordsForNewLesson, currentLesson);
}

export function updateProgressBar(progressBar, correctAnswers, totalWords) {
  const percentage = (correctAnswers / totalWords) * 100;
  progressBar.style.width = percentage + '%';
}

export function resetProgressBar(progressBar){
  progressBar.style.width = 0 + '%';
}