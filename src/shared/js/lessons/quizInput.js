import {chooseLesson, populateLessonDropdown, handleKeyUp} from "./lessonManagement.js";
import {lessons} from "./lessonsData.js";

populateLessonDropdown(lessons);
chooseLesson(lessons,1);

document.getElementById('userLessonInput').addEventListener('keyup', handleKeyUp);
document.getElementById('lessonSelect').addEventListener('change', (event) => {
    chooseLesson(lessons);
});
