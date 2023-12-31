import {sourceLanguage} from "./lessonsData.js";

const badgeStoreName = "newBadges"
const indexedDBVersion = 2;

window.onload = function () {
    const firstPromise = setupDB();
}

export function setupDB() {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open("QuizBDD", indexedDBVersion);
        // FOR DEV PURPOSE
        // indexedDB.deleteDatabase("QuizBDD")

        request.onupgradeneeded = function (event) {
            let transaction = event.target.transaction;
            let database = event.target.result;
            let oldDatabaseVersion = event.oldVersion;

            if (oldDatabaseVersion < 1) {
                if (!database.objectStoreNames.contains("badges")) {
                    let badgeStore = database.createObjectStore("badges", {keyPath: "badgeName"});
                    badgeStore.createIndex("badgeName", "badgeName", {unique: true});
                }
            }
            if (oldDatabaseVersion < 2) {
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

            if (oldDatabaseVersion < 3) {
                if (database.objectStoreNames.contains("newBadges")) {
                    database.deleteObjectStore("newBadges");
                }
            }

            transaction.onerror = function (event) {
                console.error("Erreur de transaction:", event.target.error);
            };
        };

        request.onsuccess = function (event) {
            let database = event.target.result;
            // console.log("Version actuelle de la base de données:", database.version);
            resolve(database);
        };

        request.onerror = function (event) {
            console.log("Erreur d'ouverture de la base de données", event);
            console.error("Erreur IndexedDB:", event.target.error);
            reject();
        };
    });
}

export function getLessons(database) {
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(["lessons"], "readonly");
        const lessonStore = transaction.objectStore("lessons");
        let getAllLessons = lessonStore.getAll();
        getAllLessons.onsuccess = e => resolve(e.target.result);
        getAllLessons.onerror = e => reject("Erreur lors de la récupération des leçons");
    })
}

export function getBadgesData(database) {
    return new Promise((resolve, reject) => {
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
            resolve(badges);
        };

        getAllBadges.onerror = function () {
            reject("Erreur lors de la récupération des badges");
        };
    });
}

export function registerLessonScore(database, lessonScore, lessonNumber, timeSpent) {
    return new Promise((resolve, reject) => {
        let transaction = database.transaction(["lessons"], "readwrite");
        let lessonStore = transaction.objectStore("lessons");
        let lessonIndex = lessonStore.index('lessonNumber');
        let getLesson = lessonIndex.get(lessonNumber);

        // NECESSITE PROMISE POUR TEST
        getLesson.onsuccess = function (e) {
            let data = e.target.result;

            if (data) {
                if(data.numberOfLessonCompletion){
                    data.numberOfLessonCompletion++;
                } else {
                    data.numberOfLessonCompletion = 1;
                }
                if (!data.score || data.score < lessonScore) {
                    data.score = lessonScore;
                }
                if (!data.timeSpent || (data.score <= lessonScore) || (data.timeSpent < timeSpent && data.score === lessonScore)) {
                    data.timeSpent = timeSpent;
                }
                if (!data.language) {
                    data.language = sourceLanguage;
                }
                updateLessonStore(lessonStore, data).then(() => {
                    resolve("Lesson updated successfully");
                }).catch((error) => {
                    reject("Error in updating lesson : " + error);
                });
            } else {
                addNewLesson(lessonStore, lessonNumber, lessonScore, timeSpent, sourceLanguage).then(() => {
                    resolve("Lesson added successfully");
                }).catch((error) => {
                    reject("Error in adding lesson : " + error);
                });
            }
        };

        getLesson.onerror = function (e) {
            reject("Error in getting lesson: " + e.target.errorCode);
        };
    });
}

function updateLessonStore(lessonStore, data) {
    return new Promise((resolve, reject) => {
        // Suppose lessonStore.put returns a request object
        // NECESSITE PROMISE POUR TEST
        let request = lessonStore.put(data);

        request.onsuccess = function () {
            resolve();
        };

        request.onerror = function (e) {
            reject(e.target.errorCode);
        };
    });
}

function addNewLesson(lessonStore, lessonNumber, lessonScore, timeSpent, language) {
    return new Promise((resolve, reject) => {
        // Suppose lessonStore.add returns a request object
        let request = lessonStore.add({
            lessonId: "Lesson_" + lessonNumber + "_" + Date.now(),
            lessonNumber: lessonNumber,
            score: lessonScore,
            timeSpent: timeSpent,
            language: language,
            numberOfLessonCompletion : 1
        });

        request.onsuccess = function () {
            resolve();
        };

        request.onerror = function (e) {
            reject(e.target.errorCode);
        };
    });
}