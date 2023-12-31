import {getLessons} from "./indexedDB.js";
import {japaneseBadges} from "./japaneseBadges.js";
import {calculateNumberOfWordsForALesson} from "./lessonsData.js";

let badges = [];

export function displayStatistics(database, sourceLanguage = "ja_JP") {
    getLessons(database).then(lessons => {
        if (sourceLanguage === "ja_JP") {
            badges = japaneseBadges
        }
        displayBadges(createLessonsMap(lessons, sourceLanguage), badges)
    }).catch(error => {
        console.error("Erreur lors de l'affichage des statistiques :", error);
    });
}

function createLessonsMap(lessons, sourceLanguage) {
    const lessonsMap = new Map();
    lessons.forEach(lesson => {
        lessonsMap.set(lesson.lessonNumber,
            {
                score: lesson.score,
                timeSpent: lesson.timeSpent,
                language: lesson.language ? lesson.language : sourceLanguage,
                numberOfLessonCompletion: lesson.numberOfLessonCompletion ? lesson.numberOfLessonCompletion : 1,
            });
    });
    return lessonsMap;
}

export function displayBadges(lessonsMap, badges) {
    let badgeListElement = document.getElementById('badgeListItems');

    if (badgeListElement) {
        badgeListElement.innerHTML = '';
        badges.forEach(badge => {
            let lessonNumber = parseInt(badge.badgeName.match(/\d+/)[0]);
            if (lessonsMap.has(lessonNumber) && (badge.badgeName === "Lesson " + lessonNumber)) {
                createBadgeWithScoreForDisplay(badge, badgeListElement, lessonsMap);
            }
        });
    }
}

function createBadgeWithScoreForDisplay(badge, badgeListElement, lessonsMap) {
    let listItem = document.createElement('li');
    listItem.className = 'badgeItem'; // Ajouter une classe pour le styliser en CSS

    // Structure du badge
    let badgeContainer = document.createElement('div');
    badgeContainer.className = 'badgeContainer';

    let badgeName = document.createElement('span');
    badgeName.className = 'badgeName';
    badgeName.textContent = badge.badgeName;

    let lessonNumber = parseInt(badge.badgeName.match(/\d+/)[0]);
    let lessonDetails = lessonsMap.get(lessonNumber);
    let lessonScore = (lessonDetails && lessonDetails.score) ? lessonDetails.score : "??";
    let lessonTimeSpent = (lessonDetails && lessonDetails.timeSpent) ? lessonDetails.timeSpent : "??";

    let numberOfWordsInTheLesson = calculateNumberOfWordsForALesson(lessonNumber);
    let starElement = createStarElement(lessonScore, lessonTimeSpent, numberOfWordsInTheLesson);

    let badgeCount = document.createElement('span');
    badgeCount.className = 'badgeCount';
    badgeCount.textContent = lessonDetails.numberOfLessonCompletion ? `x${lessonDetails.numberOfLessonCompletion}` : `x1` ;

    let lessonScoreAndTimeDisplayed = document.createElement('div');
    lessonScoreAndTimeDisplayed.className = "lessonScoreAndTimeDisplayed";

    let lessonScoreDisplayed = document.createElement('span');
    lessonScoreDisplayed.className = "lessonScoreDisplayed";
    lessonScoreDisplayed.style.color = lessonScore > 89 ? "green" : "red";
    lessonScoreDisplayed.textContent = `${lessonScore}%`;

    let lessonTimeSpentDisplayed = document.createElement('span');

    lessonTimeSpentDisplayed.className = "lessonTimeSpentDisplayed";
    lessonTimeSpentDisplayed.style.color = lessonTimeSpent < numberOfWordsInTheLesson * 3 ? "green" : "red";
    lessonTimeSpentDisplayed.textContent = `${lessonTimeSpent}s`;

    lessonScoreAndTimeDisplayed.textContent = '(';
    lessonScoreAndTimeDisplayed.appendChild(lessonScoreDisplayed);
    lessonScoreAndTimeDisplayed.appendChild(document.createTextNode(' / '));
    lessonScoreAndTimeDisplayed.appendChild(lessonTimeSpentDisplayed);
    lessonScoreAndTimeDisplayed.appendChild(document.createTextNode(')'));

    badgeContainer.appendChild(badgeName);
    badgeContainer.appendChild(badgeCount);
    badgeContainer.appendChild(starElement);
    badgeContainer.appendChild(lessonScoreAndTimeDisplayed)

    listItem.appendChild(badgeContainer);
    badgeListElement.appendChild(listItem);
}

function createStarElement(score, timeSpent, numberOfWordsInTheLesson) {
    let starContainer = document.createElement('div');
    starContainer.className = 'lessonScoreStarContainer';

    let starCount = calculateStars(score);

    if(starCount === 5 && (timeSpent === "??" || (numberOfWordsInTheLesson * 3 < timeSpent))){
        starCount--
    }

    for (let i = 0; i < starCount; i++) {
        let star = document.createElement('span');
        star.className = 'lessonScoreStar';
        star.textContent = '⭐';
        starContainer.appendChild(star);
    }

    return starContainer;
}

function calculateStars(score) {
    if (score === 100) return 5;
    if (score >= 75) return 4;
    if (score >= 50) return 3;
    if (score >= 25) return 2;
    return 1;
}