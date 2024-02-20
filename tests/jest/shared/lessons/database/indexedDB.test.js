// https://dev.to/andyhaskell/testing-your-indexeddb-code-with-jest-2o17
import {
    getLessonsByLanguage,
    registerLesson,
    setupDB,
    updateDatabaseAndDisplay
} from "../../../../../src/shared/js/lessons/database/indexedDB";
import "fake-indexeddb/auto";

if (typeof structuredClone === "undefined") {
    global.structuredClone = function (obj) {
        return JSON.parse(JSON.stringify(obj));
    };
}

describe("registerLesson", () => {
    let database;
    // Mock de votre IndexedDB ou de l'objet lessonStore
    beforeEach(async () => {
        // Créer un identifiant unique pour chaque test
        const uniqueDBName = "TestDB_" + Date.now();
        database = await setupDB(uniqueDBName);
    });

    afterEach(() => {
        database.close();
        // Effacer la base de données après chaque test
        indexedDB.deleteDatabase(database.name);
    });

    it("should correctly store data in database when adding new lesson", async () => {
        // GIVEN
        const lessonScore = 80;
        const lessonNumber = 1;
        const timeSpent = 120;
        const language = "es_ES"

        // WHEN
        const result = await registerLesson(database, lessonScore, lessonNumber, timeSpent, language);

        // THEN
        const transaction = database.transaction(["lessons"], "readonly");
        const lessonStore = transaction.objectStore("lessons");
        const lessonIndex = lessonStore.index("lessonNumber");
        const getLesson = lessonIndex.get(lessonNumber);

        expect(result).toBe("Lesson added successfully");

        new Promise((resolve, reject) => {
            getLesson.onsuccess = function (e) {
                const data = e.target.result;
                try {
                    expect(data).toBeDefined();
                    expect(data.lessonNumber).toBe(lessonNumber);
                    expect(data.score).toBe(lessonScore);
                    expect(data.timeSpent).toBe(timeSpent);
                    expect(data.language).toBe(language);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            };

            getLesson.onerror = function (error) {
                reject(error);
            };
        });

    });

    it("should handle error when database operation fails", async () => {
        // GIVEN
        const lessonScore = 80;
        const lessonNumber = 1;
        const timeSpent = 120;
        const language = "es_ES"

        // Mocking database transaction to simulate failure
        database.transaction = jest.fn().mockImplementation(() => {
            throw new Error("Database error");
        });

        // WHEN & THEN
        await expect(
            registerLesson(database, lessonScore, lessonNumber, timeSpent, language),
        ).rejects.toThrow("Database error");
    });

    it("should modify lesson if score is higher", async () => {
        // GIVEN
        const initialTimeSpent = 100;
        const language = "es_ES"
        await registerLesson(database, 80, 1, initialTimeSpent, language);
        const newTimeSpent = 150; // Ajouter une nouvelle valeur pour timeSpent

        // WHEN
        const result = await registerLesson(database, 85, 1, newTimeSpent, language);

        // THEN
        expect(result).toBe("Lesson updated successfully");
    });

    it("should not update lesson if new score is lower", async () => {
        // GIVEN
        const initialScore = 85;
        const newScore = 80; // lower than initialScore
        const lessonNumber = 1;
        const timeSpent = 120;
        await registerLesson(database, initialScore, lessonNumber, timeSpent, "es_ES");

        // WHEN
        await registerLesson(database, newScore, lessonNumber, timeSpent, "es_ES");

        // THEN
        const transaction = database.transaction(["lessons"], "readonly");
        const lessonStore = transaction.objectStore("lessons");
        const lessonIndex = lessonStore.index("lessonNumber");
        const getLesson = lessonIndex.get(lessonNumber);

        return new Promise((resolve, reject) => {
            getLesson.onsuccess = function (e) {
                const data = e.target.result;
                try {
                    expect(data).toBeDefined();
                    expect(data.score).not.toBe(newScore); // Should still be the initialScore
                    resolve();
                } catch (error) {
                    reject(error);
                }
            };

            getLesson.onerror = function (error) {
                reject(error);
            };
        });
    });

    it("should create a new lesson if language is different", async () => {
        // GIVEN
        const score = 85;
        const lessonNumber = 1;
        const timeSpent = 120;
        const language1 = "es_ES";
        const language2 = "jp_JP";
        await registerLesson(database, score, lessonNumber, timeSpent, language1);

        // WHEN
        await registerLesson(database, score, lessonNumber, timeSpent, language2);

        // THEN
        const transaction = database.transaction(["lessons"], "readonly");
        const lessonStore = transaction.objectStore("lessons");
        const lessonIndex = lessonStore.index("lessonNumber");
        const getLesson = lessonIndex.getAll();

        await new Promise((resolve, reject) => {
            getLesson.onsuccess = function (e) {
                const data = e.target.result;
                try {
                    expect(data.length).toBe(2);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            };

            getLesson.onerror = function (error) {
                console.log(error)
                reject(error);
            };
        });
    });

    it("should throw error if each data is not sent", async () => {
        // GIVEN
        const score = 85;
        const lessonNumber = 1;
        const timeSpent = 120;

        // THEN
        await expect(registerLesson(database, score, lessonNumber, timeSpent, undefined)).rejects.toThrow("Invalid or missing argument(s): sourceLanguage");
    });

    it("should throw error if each data is invalid", async () => {
        // GIVEN
        const invalidScore = -1;
        const lessonNumber = 1;
        const timeSpent = 120;
        const language = "es_ES";

        // THEN
        await expect(registerLesson(database, invalidScore, lessonNumber, timeSpent, language)).rejects.toThrow("Invalid or missing argument(s): lessonScore");
    });
});

describe("getLessonsByLanguage", () => {
    let database;
    // Mock de votre IndexedDB ou de l'objet lessonStore
    beforeEach(async () => {
        // Créer un identifiant unique pour chaque test
        const uniqueDBName = "TestDB_" + Date.now();
        database = await setupDB(uniqueDBName);
    });

    afterEach(() => {
        database.close();
        // Effacer la base de données après chaque test
        indexedDB.deleteDatabase(database.name);
    });

    it("should handle error when database operation fails", async () => {
        // GIVEN
        const language = "es_ES";

        // Mocking database transaction to simulate failure
        database.transaction = jest.fn().mockImplementation(() => {
            throw new Error("Database error");
        });

        // WHEN & THEN
        await expect(
            getLessonsByLanguage(database, language),
        ).rejects.toThrow("Database error");
    });

    it("should get data for correct language", async () => {
        // GIVEN
        const score = 85;
        const lessonNumber = 1;
        const timeSpent = 120;
        const language1 = "es_ES";
        const language2 = "jp_JP";
        await registerLesson(database, score, lessonNumber, timeSpent, language1);
        await registerLesson(database, score, lessonNumber, timeSpent, language2);

        // WHEN
        const result = await getLessonsByLanguage(database, language1);

        // THEN
        expect(result).toEqual([
            expect.objectContaining({
                "language": language1,
                "lessonNumber": 1,
                "numberOfLessonCompletion": 1,
                "score": 85,
                "timeSpent": 120
            })
        ]);

        expect(result).toEqual(
            expect.not.objectContaining({
                "language": language2
            })
        );
    });

});

