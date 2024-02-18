import { japaneseWordsTradsAndLessons } from "../../../languages/japanese/js/japaneseLesson.js";
import { spanishWordsTradsAndLessons } from "../../../languages/spanish/js/spanishLesson.js";

export function getScriptElementSource() {
    const scriptElement = document.querySelector('script[src*="quizInput.js"]');
    return scriptElement ? scriptElement.getAttribute("data-html-source") : "";
}

export function getLessonsFromSource(source) {
    switch (source) {
        case "japanLessons":
            return [...japaneseWordsTradsAndLessons];
        case "spanishLessons":
            return [...spanishWordsTradsAndLessons].sort(compareLessons);
        default:
            return [];
    }
}

export function getSourceLanguageFromSource(source) {
    switch (source) {
        case "japanLessons":
            return "ja_JP";
        case "spanishLessons":
            return "es_ES";
        default:
            return "";
    }
}

export function compareLessons(a, b) {
    return a.lesson - b.lesson;
}

export function calculateNumberOfWordsForALesson(lessonNumber, lessons) {
  let wordsForLessonNumber = lessons.filter(
    (word) => parseInt(word.lesson) === lessonNumber,
  );
  return wordsForLessonNumber.length;
}
