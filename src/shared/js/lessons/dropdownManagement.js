export function updateLessonInSelectDropdown(lesson) {
    const selectElement = document.getElementById("lessonSelect");
    if (selectElement) {
        selectElement.value = lesson;
    }
}

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