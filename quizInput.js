let lessons = [...wordsTradsAndLessons]
let wordsForCurrentLesson = [];

let currentWordIndex;
let currentLesson;
let lastWordDisplayed = null;

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
    wordsForCurrentLesson = lessons.filter(word => parseInt(word.lesson) === currentLesson);
    document.getElementById('quizArea').style.display = "block";
    displayNextWord();
}

function displayNextWord() {
    const wordObj = getRandomWord();
    if (!wordObj) return;
    document.getElementById('currentWord').textContent = wordObj.word;
    lastWordDisplayed = wordObj;
    currentWordIndex = wordsForCurrentLesson.indexOf(wordObj);
}

function getRandomWord() {
    if (wordsForCurrentLesson.length === 0) {
        alert("Félicitations ! Vous avez terminé la leçon " + currentLesson);
        document.getElementById('quizArea').style.display = "none";
        chooseLesson(currentLesson);
        registerBadge('Lesson ' + currentLesson);
        return;
    }

    if (wordsForCurrentLesson.length === 1) {
        return wordsForCurrentLesson[0];
    }

    let wordObj;
    do {
        const randomIndex = Math.floor(Math.random() * wordsForCurrentLesson.length);
        wordObj = wordsForCurrentLesson[randomIndex];
    } while (wordObj === lastWordDisplayed);

    return wordObj;
}

function handleKeyUp(event) {
    // "Enter"
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

    if (userTranslation.toLowerCase().trim() === (wordsForCurrentLesson[currentWordIndex].trad).toLowerCase().trim()) {
        feedbackEmojiElement.textContent = "✅"; // Émoji de validation verte
        playSound("correctSound");
        wordsForCurrentLesson.splice(currentWordIndex, 1);  // Supprimez le mot du tableau
        displayNextWord();
    } else {
        feedbackEmojiElement.textContent = "❌"; // Émoji de croix rouge
        playSound("wrongSound");
    }
    document.getElementById('userLessonInput').value = ""; // Réinitialisez l'input
}

const changeWordButton = document.getElementById("changeWord");
changeWordButton.addEventListener("click", (event) => {
    alert("La réponse était " + wordsForCurrentLesson[currentWordIndex].trad);
    displayNextWord();
});

populateLessonDropdown();
chooseLesson(1);