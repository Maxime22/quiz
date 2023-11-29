let database;
// const badgeTable = "badges"
// const indexedDBVersion = 1;

const badgeTable = "newBadges"
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
        // registerBadge("Lesson 1");

        displayBadges();
    };

    request.onupgradeneeded = function (event) {
        let transaction = event.target.transaction;
        transaction.onerror = function (event) {
            console.error("Erreur de transaction:", event.target.error);
        };

        let databaseVersion = event.oldVersion;

        database = event.target.result;
        if (databaseVersion >= 0) {
            if (!database.objectStoreNames.contains("badges")) {
                let badgeStore = database.createObjectStore("badges", {keyPath: "badgeName"});
                badgeStore.createIndex("badgeName", "badgeName", {unique: true});
            }
        }
        if (databaseVersion >= 1) {
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

function registerScore(scoreInPercentage, lessonNumber) {
    let transaction = database.transaction(["lessons"], "readwrite");
    let lessonStore = transaction.objectStore("lessons");

    let getLesson = lessonStore.get(lessonNumber);

    getLesson.onsuccess = function (e) {
        let data = e.target.result;

        if (data) {
            if (!data.score || data.score < scoreInPercentage) {
                data.score = scoreInPercentage
            }
            lessonStore.put(data);
        } else {
            lessonStore.add({
                lessonId: "Lesson_" + lessonNumber + "_" + Date.now(),
                lessonNumber: lessonNumber,
                score: scoreInPercentage
            });
        }
        displayBadges();
    };
}

function registerBadge(badgeName) {
    let transaction = database.transaction([badgeTable], "readwrite");
    let badgeStore = transaction.objectStore(badgeTable);
    let getBadge = badgeStore.get(badgeName);

    getBadge.onsuccess = function (e) {
        let data = e.target.result;

        if (data) {
            data.numberOfThisBadge++;
            badgeStore.put(data);
        } else {
            badgeStore.add({badgeId: badgeName + "_" + Date.now(), badgeName: badgeName, numberOfThisBadge: 1});
        }
        displayBadges();
    };

    getBadge.onerror = function () {
        console.error("Erreur lors de l'enregistrement du badge");
    };
}

function displayBadges() {
    let transaction = database.transaction([badgeTable], "readonly");
    let badgeStore = transaction.objectStore(badgeTable);
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

            // Assemblage du badge
            badgeContainer.appendChild(badgeName);
            badgeContainer.appendChild(badgeCount);
            listItem.appendChild(badgeContainer);
            badgeListElement.appendChild(listItem);
        });
    };

    getAllBadges.onerror = function () {
        console.error("Erreur lors de la récupération des badges");
    };
}