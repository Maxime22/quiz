let lessons = [...wordsTradsAndLessons]
let wordsForCurrentLesson = [];

let currentWordIndex;
let currentLesson;
let lastWordDisplayed = null;
let unknownWords = [];
let totalCountOfWordsForCurrentLesson;

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

function chooseLesson(lesson = null) {
    const selectElement = document.getElementById('lessonSelect');
    currentLesson = parseInt(selectElement.value);
    if (lesson) {
        currentLesson = lesson;
    }
    selectElement.value = currentLesson;
    wordsForCurrentLesson = lessons.filter(word => parseInt(word.lesson) === currentLesson);
    totalCountOfWordsForCurrentLesson = wordsForCurrentLesson.length;
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
        congratsUser();
        updateToNextLesson();
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

function congratsUser() {
    playSound("lessonCompletedSound");
    alert("Félicitations ! Vous avez terminé la leçon " + currentLesson);
}

function updateToNextLesson() {
    let scoreInPercentage = calculateScoreInPercentage();
    document.getElementById('quizArea').style.display = "none";
    registerBadge('Lesson_' + currentLesson);
    registerScore(scoreInPercentage, currentLesson);
    unknownWords = [];
    chooseLesson(currentLesson + 1);
}

function calculateScoreInPercentage() {
    return Math.round(((totalCountOfWordsForCurrentLesson - unknownWords.length) / totalCountOfWordsForCurrentLesson)*100);
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
    const userTranslation = (document.getElementById('userLessonInput').value).toLowerCase().trim();
    const currentCorrectTranslation = (wordsForCurrentLesson[currentWordIndex].trad).toLowerCase().trim();
    const feedbackEmojiElement = document.getElementById('feedbackEmoji');

    // accents or not are equivalent in the condition
    if (userTranslation.localeCompare(currentCorrectTranslation, undefined, {sensitivity: 'base'}) === 0) {
        feedbackEmojiElement.textContent = "✅"; // Émoji de validation verte
        if (wordsForCurrentLesson.length !== 1) {
            playSound("correctSound");
        }
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
    const unknownWord = wordsForCurrentLesson[currentWordIndex].trad
    unknownWords.push(unknownWord)
    alert("La réponse était " + wordsForCurrentLesson[currentWordIndex].trad);
    displayNextWord();
});

populateLessonDropdown();
chooseLesson(1);