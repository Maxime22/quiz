import { japaneseWordsTradsAndLessons } from "../../../languages/japanese/js/japaneseLesson.js";
import { spanishWordsTradsAndLessons } from "../../../languages/spanish/js/spanishLesson.js";

let lessons = [];
let source = "";
let sourceLanguage = "";
let scriptElement = document.querySelector('script[src*="quizInput.js"]');

if (scriptElement) {
    source = scriptElement.getAttribute('data-html-source');
}
if (source === "japanLessons") {
    lessons = [...japaneseWordsTradsAndLessons];
    sourceLanguage = "ja_JP"
}
if (source === "spanishLessons") {
    lessons = spanishWordsTradsAndLessons.sort(compareLessons);
    sourceLanguage = "es_ES"
}

function compareLessons(a, b) {
    return a.lesson - b.lesson;
}

export { lessons, sourceLanguage };

export function calculateNumberOfWordsForALesson(lessonNumber){
    let wordsForLessonNumber = [...japaneseWordsTradsAndLessons].filter(word => parseInt(word.lesson) === lessonNumber);
    return wordsForLessonNumber.length
}
