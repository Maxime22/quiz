import {japaneseWordsTradsAndLessons} from "../../languages/japanese/js/japaneseLesson.js";
let lessons = [];
let source = "";
let scriptElement = document.querySelector('script[src*="quizInput.js"]');

if (scriptElement) {
    source = scriptElement.getAttribute('data-html-source');
}
if (source === "japLessonsIndex") {
    lessons = [...japaneseWordsTradsAndLessons]
}

export { lessons };