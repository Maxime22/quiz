import { playSound } from "./media/soundManagement.js";
import { showLessonCompletedModal } from "./modal/modalManagement.js";
import {
  displayNextWord,
  reinitializeUnknownWords,
  updateCurrentLesson,
  updateLessonInSelectDropdown,
} from "./lessonManagement.js";

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
  let wordsForNewLesson = updateCurrentLesson();
  reinitializeUnknownWords();
  updateLessonInSelectDropdown(currentLesson);
  displayNextWord(lessons, wordsForNewLesson, currentLesson);
}
