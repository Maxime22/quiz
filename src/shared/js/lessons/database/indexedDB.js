import {getScriptElementSource, getSourceLanguageFromSource} from "../lessonsData.js";

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

// A REMPLACER POUR AFFICHER LES SUCCES
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


