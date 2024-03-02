import {
    updateToNextLesson,
    handleKeyUp,
    displayNextWord,
    reinitializeUnknownWords,
} from "./lessonManagement.js";
import {getLessonsFromSource, getScriptElementSource} from "./lessonsData.js";
import {populateLessonDropdown, updateLessonInSelectDropdown} from "./dropdownManagement.js";

let lessons = getLessonsFromSource(getScriptElementSource())
populateLessonDropdown(lessons);
let wordsForNewLesson = updateToNextLesson(1);
updateLessonInSelectDropdown(1);
displayNextWord(lessons, wordsForNewLesson, 1);

document
    .getElementById("userLessonInput")
    .addEventListener("keyup", handleKeyUp);
document.getElementById("lessonSelect").addEventListener("change", (event) => {
    let wordsForNewLesson = updateToNextLesson(parseInt(event.target.value));
    reinitializeUnknownWords();
    updateLessonInSelectDropdown(event.target.value);
    displayNextWord(lessons, wordsForNewLesson, parseInt(event.target.value));
});
