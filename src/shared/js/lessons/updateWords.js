export function updateAllWordsForCurrentLesson(currentLesson, lessons) {
    return lessons.filter(
        (word) => parseInt(word.lesson) === parseInt(currentLesson),
    );
}