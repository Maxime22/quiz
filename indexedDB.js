let database;

// FOR DEV PURPOSE
// const badgeTable = "badges"
// const indexedDBVersion = 1;

const badgeStoreName = "newBadges"
const indexedDBVersion = 2;

window.onload = function () {
    let request = window.indexedDB.open("QuizBDD", indexedDBVersion);
    // FOR DEV PURPOSE
    // indexedDB.deleteDatabase("QuizBDD")

    request.onerror = function (event) {
        console.log("Erreur d'ouverture de la base de données", event);
        console.error("Erreur IndexedDB:", event.target.error);
    };

    request.onsuccess = function (event) {
        database = event.target.result;
        console.log("Version actuelle de la base de données:", database.version);

        // FOR DEV PURPOSE
        for (let i = 1; i < 22; i++) {
            registerBadge("Lesson_" + i);
        }

        displayStatistics();
    };

    request.onupgradeneeded = function (event) {
        let transaction = event.target.transaction;
        transaction.onerror = function (event) {
            console.error("Erreur de transaction:", event.target.error);
        };

        let databaseVersion = event.oldVersion;

        database = event.target.result;
        if (databaseVersion < 1) {
            if (!database.objectStoreNames.contains("badges")) {
                let badgeStore = database.createObjectStore("badges", {keyPath: "badgeName"});
                badgeStore.createIndex("badgeName", "badgeName", {unique: true});
            }
        }
        if (databaseVersion < 2) {
            if (!database.objectStoreNames.contains("lessons")) {
                let lessonStore = database.createObjectStore("lessons", {keyPath: "lessonId"});
                lessonStore.createIndex("lessonNumber", "lessonNumber", {unique: true});
                lessonStore.createIndex("score", "score");
            }
            if (database.objectStoreNames.contains("badges")) {
                if (!database.objectStoreNames.contains("newBadges")) {
                    let newBadgeStore = database.createObjectStore("newBadges", {keyPath: "badgeId"});
                    newBadgeStore.createIndex("badgeName", "badgeName", {unique: true});

                    let oldBadgeStore = event.target.transaction.objectStore("badges");
                    oldBadgeStore.openCursor().onsuccess = function (event) {
                        let cursor = event.target.result;
                        if (cursor) {
                            let data = cursor.value;
                            let originalBadgeName = data.badgeName;
                            let modifiedBadgeName = originalBadgeName.replace(/ /g, "_");
                            data.badgeId = modifiedBadgeName + "_" + Date.now();
                            data.badgeName = modifiedBadgeName;
                            newBadgeStore.add(data);
                            cursor.continue();
                        } else {
                            database.deleteObjectStore("badges");
                        }
                    };
                }
            }
        }
    };

}

function registerLessonScore(lessonScore, lessonNumber) {
    let transaction = database.transaction(["lessons"], "readwrite");
    let lessonStore = transaction.objectStore("lessons");

    let getLesson = lessonStore.get(lessonNumber);

    getLesson.onsuccess = function (e) {
        let data = e.target.result;

        if (data) {
            if (!data.score || data.score > lessonScore) {
                data.score = lessonScore
            }
            lessonStore.put(data);
        } else {
            lessonStore.add({
                lessonId: "Lesson_" + lessonNumber + "_" + Date.now(),
                lessonNumber: lessonNumber,
                score: lessonScore
            });
        }
    };
}

function registerBadge(badgeName) {
    let transaction = database.transaction([badgeStoreName], "readwrite");
    let badgeStore = transaction.objectStore(badgeStoreName);
    let getBadge = badgeStore.get(badgeName);

    getBadge.onsuccess = function (e) {
        let data = e.target.result;

        if (data) {
            data.numberOfThisBadge++;
            badgeStore.put(data);
        } else {
            badgeStore.add({badgeId: badgeName + "_" + Date.now(), badgeName: badgeName, numberOfThisBadge: 1});
        }
    };

    getBadge.onerror = function () {
        console.error("Erreur lors de l'enregistrement du badge");
    };
}

function displayStatistics() {
    let transaction = database.transaction(["lessons"], "readonly");
    let lessonStore = transaction.objectStore("lessons");
    let getAllLessons = lessonStore.getAll();

    getAllLessons.onsuccess = function (e) {
        let lessons = e.target.result;
        let lessonsMap = new Map();

        lessons.forEach(lesson => {
            lessonsMap.set(lesson.lessonNumber, lesson.score);
        });

        displayBadgesWithScores(lessonsMap);
    };

    getAllLessons.onerror = function () {
        console.error("Erreur lors de la récupération des leçons");
    };

}

function displayBadgesWithScores(lessonsMap) {
    let transaction = database.transaction([badgeStoreName], "readonly");
    let badgeStore = transaction.objectStore(badgeStoreName);
    let getAllBadges = badgeStore.getAll();

    getAllBadges.onsuccess = function (e) {
        let badges = e.target.result;

        // Tri des badges par numéro de leçon
        badges.sort((a, b) => {
            let numberA = parseInt(a.badgeName.match(/\d+/)[0]);
            let numberB = parseInt(b.badgeName.match(/\d+/)[0]);
            return numberA - numberB;
        });

        let badgeListElement = document.getElementById('badgeListItems');
        badgeListElement.innerHTML = '';

        badges.forEach(badge => {
            createBadgeWithScoreForDisplay(badge, badgeListElement, lessonsMap)
        });
    };

    getAllBadges.onerror = function () {
        console.error("Erreur lors de la récupération des badges");
    };
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

    let badgeCount = document.createElement('span');
    badgeCount.className = 'badgeCount';
    badgeCount.textContent = `x${badge.numberOfThisBadge}`;

    let lessonScore = lessonsMap.get(parseInt(badge.badgeName.match(/\d+/)[0]));
    if (!lessonScore){
        lessonScore = "??";
    }
    let starElement = createStarElement(lessonScore);

    let lessonScoreDisplayed = document.createElement('span');
    lessonScoreDisplayed.className = "lessonScoreDisplayed";
    lessonScoreDisplayed.textContent = " (" + lessonScore + "%)";

    badgeContainer.appendChild(badgeName);
    badgeContainer.appendChild(badgeCount);
    badgeContainer.appendChild(starElement);
    badgeContainer.appendChild(lessonScoreDisplayed)

    listItem.appendChild(badgeContainer);
    badgeListElement.appendChild(listItem);
}

function createStarElement(score) {
    let starContainer = document.createElement('div');
    starContainer.className = 'lessonScoreStarContainer';

    let starCount = calculateStars(score);


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