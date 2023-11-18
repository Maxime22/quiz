let lessons = [...wordsTradsAndLessons]

let currentWordIndex;
let currentLesson;

function populateLessonDropdown() {
    const lessonSet = new Set(lessons.map(wordObj => wordObj.lesson));

    const selectElement = document.getElementById('lessonSelect');
    lessonSet.forEach(lesson => {
        const optionElement = document.createElement('option');
        optionElement.value = lesson;
        optionElement.textContent = 'Leçon ' + lesson;
        selectElement.appendChild(optionElement);
    });
}

function chooseLesson() {
    currentLesson = parseInt(document.getElementById('lessonSelect').value);
    document.getElementById('quizArea').style.display = "block";
    displayNextWord();
}

function displayNextWord() {
    const wordObj = getRandomWord();
    if (!wordObj) return;
    document.getElementById('currentWord').textContent = wordObj.word;
    currentWordIndex = wordsTradsAndLessons.indexOf(wordObj);
}

function getRandomWord() {
    const wordsFromCurrentLesson = wordsTradsAndLessons.filter(word => parseInt(word.lesson) === currentLesson);
    if (wordsFromCurrentLesson.length === 0) {
        alert("Félicitations ! Vous avez terminé la leçon " + currentLesson);
        document.getElementById('quizArea').style.display = "none";
        chooseLesson()
        registerBadge('Lesson ' + currentLesson);
        return;
    }

    const randomIndex = Math.floor(Math.random() * wordsFromCurrentLesson.length);
    return wordsFromCurrentLesson[randomIndex];
}

function handleKeyUp(event) {
    // Si la touche pressée est "Enter"
    if (event.keyCode === 13) {
        checkAnswer();
    }
}

function playSound(id) {
    const audio = document.getElementById(id);
    audio.currentTime = 0; // Revenir au début pour permettre des lectures consécutives
    audio.play();
}

function checkAnswer() {
    const userTranslation = document.getElementById('userLessonInput').value;
    const feedbackEmojiElement = document.getElementById('feedbackEmoji');

    if (userTranslation.toLowerCase().trim() === (wordsTradsAndLessons[currentWordIndex].trad).toLowerCase().trim()) {
        feedbackEmojiElement.textContent = "✅"; // Émoji de validation verte
        playSound("correctSound");
        wordsTradsAndLessons.splice(currentWordIndex, 1);  // Supprimez le mot du tableau
        displayNextWord();
    } else {
        feedbackEmojiElement.textContent = "❌"; // Émoji de croix rouge
        playSound("wrongSound");
    }
    document.getElementById('userLessonInput').value = ""; // Réinitialisez l'input
}

const changeWordButton = document.getElementById("changeWord");
changeWordButton.addEventListener("click", (event) => {
    alert("La réponse était " + wordsTradsAndLessons[currentWordIndex].trad);
    displayNextWord();
});

populateLessonDropdown();

chooseLesson(1);