import {sourceLanguage} from "../lessonsData.js";
import { v4 as uuidv4 } from 'uuid';


const badgeStoreName = "newBadges"
const indexedDBVersion = 3;

window.onload = function () {
    const firstPromise = setupDB();
};

export function setupDB(databaseName = "QuizBDD") {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open(databaseName, indexedDBVersion);
        // FOR DEV PURPOSE
        // indexedDB.deleteDatabase("QuizBDD")

        request.onupgradeneeded = function (event) {
            let transaction = event.target.transaction;
            let database = event.target.result;
            let oldDatabaseVersion = event.oldVersion;

            if (oldDatabaseVersion < 1) {
                if (!database.objectStoreNames.contains("badges")) {
                    let badgeStore = database.createObjectStore("badges", {
                        keyPath: "badgeName",
                    });
                    badgeStore.createIndex("badgeName", "badgeName", {unique: true});
                }
            }
            if (oldDatabaseVersion < 2) {
                if (!database.objectStoreNames.contains("lessons")) {
                    let lessonStore = database.createObjectStore("lessons", {
                        keyPath: "lessonId",
                    });
                    lessonStore.createIndex("lessonNumber", "lessonNumber", {
                        unique: true,
                    });
                    lessonStore.createIndex("score", "score");
                }
                if (database.objectStoreNames.contains("badges")) {
                    if (!database.objectStoreNames.contains("newBadges")) {
                        let newBadgeStore = database.createObjectStore("newBadges", {
                            keyPath: "badgeId",
                        });
                        newBadgeStore.createIndex("badgeName", "badgeName", {
                            unique: true,
                        });

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

            if (oldDatabaseVersion < 4) {
                if (database.objectStoreNames.contains("lessons")) {
                    let lessonStore = event.target.transaction.objectStore("lessons");
                    // Supprimer l'ancien index
                    lessonStore.deleteIndex("lessonNumber");
                    // Créer un nouvel index sans la contrainte unique
                    lessonStore.createIndex("lessonNumber", "lessonNumber", {unique: false});
                    lessonStore.createIndex("language", "language");
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

export function getLessonsByLanguage(database, language) {
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(["lessons"], "readonly");
        const lessonStore = transaction.objectStore("lessons");
        const languageIndex = lessonStore.index("language");
        let getLanguageLessons = languageIndex.getAll(language);
        getLanguageLessons.onsuccess = e => resolve(e.target.result);
        getLanguageLessons.onerror = e => reject("Erreur lors de la récupération des leçons par leur langue");
    })
}

// export function getBadgesData(database) {
//     return new Promise((resolve, reject) => {
//         let transaction = database.transaction([badgeStoreName], "readonly");
//         let badgeStore = transaction.objectStore(badgeStoreName);
//         let getAllBadges = badgeStore.getAll();
//
//         getAllBadges.onsuccess = function (e) {
//             let badges = e.target.result;
//             // Tri des badges par numéro de leçon
//             badges.sort((a, b) => {
//                 let numberA = parseInt(a.badgeName.match(/\d+/)[0]);
//                 let numberB = parseInt(b.badgeName.match(/\d+/)[0]);
//                 return numberA - numberB;
//             });
//             resolve(badges);
//         };
//
//         getAllBadges.onerror = function () {
//             reject("Erreur lors de la récupération des badges");
//         };
//     });
// }

export function registerLesson(
    database,
    lessonScore,
    lessonNumber,
    timeSpent,
    sourceLanguage
) {
    return new Promise((resolve, reject) => {
        let invalidArgs = [];

        if (lessonScore === undefined || typeof lessonScore !== 'number' || lessonScore < 0) invalidArgs.push("lessonScore");
        if (lessonNumber === undefined || typeof lessonNumber !== 'number' || lessonNumber <= 0) invalidArgs.push("lessonNumber");
        if (timeSpent === undefined || typeof timeSpent !== 'number' || timeSpent < 0) invalidArgs.push("timeSpent");
        if (sourceLanguage === undefined || typeof sourceLanguage !== 'string' || !sourceLanguage.match(/^[a-z]{2}_[A-Z]{2}$/)) invalidArgs.push("sourceLanguage");
        if (invalidArgs.length > 0) {
            throw new Error(`Invalid or missing argument(s): ${invalidArgs.join(", ")}`);
        }

        let transaction = database.transaction(["lessons"], "readwrite");
        let lessonStore = transaction.objectStore("lessons");
        let lessonIndex = lessonStore.index("lessonNumber");
        let getLesson = lessonIndex.get(lessonNumber);

        // NECESSITE PROMISE POUR TEST
        getLesson.onsuccess = function (e) {
            let data = e.target.result;

            if (data && data.language === sourceLanguage) {
                if (data.numberOfLessonCompletion) {
                    data.numberOfLessonCompletion++;
                } else {
                    data.numberOfLessonCompletion = 1;
                }
                if (!data.score || data.score < lessonScore) {
                    data.score = lessonScore;
                }
                if (
                    !data.timeSpent ||
                    data.score <= lessonScore ||
                    (data.timeSpent < timeSpent && data.score === lessonScore)
                ) {
                    data.timeSpent = timeSpent;
                }
                if (!data.language) {
                    data.language = sourceLanguage;
                }
                updateLessonStore(lessonStore, data)
                    .then(() => {
                        resolve("Lesson updated successfully");
                    })
                    .catch((error) => {
                        reject("Error in updating lesson : " + error);
                    });
            } else {
                addNewLesson(
                    lessonStore,
                    lessonNumber,
                    lessonScore,
                    timeSpent,
                    sourceLanguage,
                )
                    .then(() => {
                        resolve("Lesson added successfully");
                    })
                    .catch((error) => {
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
            reject(e.target.error);
        };
    });
}

function addNewLesson(
    lessonStore,
    lessonNumber,
    lessonScore,
    timeSpent,
    language,
) {
    return new Promise((resolve, reject) => {
        // Suppose lessonStore.add returns a request object
        let request = lessonStore.add({
            lessonId: "Lesson_" + lessonNumber + "_" + uuidv4(),
            lessonNumber: lessonNumber,
            score: lessonScore,
            timeSpent: timeSpent,
            language: language,
            numberOfLessonCompletion: 1,
        });

        request.onsuccess = function () {
            resolve();
        };

        request.onerror = function (e) {
            reject(e.target.error);
        };
    });
}

export function updateDatabaseAndDisplay(
    completionLessonScoreInPercentage,
    timeSpent,
    currentLesson,
) {
    return new Promise((resolve, reject) => {
        setupDB()
            .then((database) => {
                registerLesson(
                    database,
                    completionLessonScoreInPercentage,
                    currentLesson,
                    timeSpent,
                    sourceLanguage
                );
                resolve();
            })
            .catch((error) => {
                reject(error);
            });
    });
}
