import {
  updateCurrentLesson,
  populateLessonDropdown,
  handleKeyUp,
  updateLessonInSelectDropdown,
  displayNextWord,
  updateAllWordForCurrentLesson,
  reinitializeUnknownWords,
} from "./lessonManagement.js";
import { lessons } from "./lessonsData.js";

populateLessonDropdown(lessons);
let wordsForNewLesson = updateCurrentLesson(1);
updateLessonInSelectDropdown(1);
displayNextWord(lessons, wordsForNewLesson, 1);

document
  .getElementById("userLessonInput")
  .addEventListener("keyup", handleKeyUp);
document.getElementById("lessonSelect").addEventListener("change", (event) => {
  let wordsForNewLesson = updateCurrentLesson(event.target.value);
  reinitializeUnknownWords();
  updateLessonInSelectDropdown(event.target.value);
  displayNextWord(lessons, wordsForNewLesson, event.target.value);
});
