// https://dev.to/andyhaskell/testing-your-indexeddb-code-with-jest-2o17
import {
  registerLessonScore,
  setupDB,
} from "../../../../src/shared/js/lessons/database/indexedDB";
import "fake-indexeddb/auto";

if (typeof structuredClone === "undefined") {
  global.structuredClone = function (obj) {
    return JSON.parse(JSON.stringify(obj));
  };
}

describe("registerLessonScore", () => {
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

    // WHEN
    await registerLessonScore(database, lessonScore, lessonNumber, timeSpent);

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
          expect(data.lessonNumber).toBe(lessonNumber);
          expect(data.score).toBe(lessonScore);
          expect(data.timeSpent).toBe(timeSpent);
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

    // Mocking database transaction to simulate failure
    database.transaction = jest.fn().mockImplementation(() => {
      throw new Error("Database error");
    });

    // WHEN & THEN
    await expect(
      registerLessonScore(database, lessonScore, lessonNumber, timeSpent),
    ).rejects.toThrow("Database error");
  });

  it("should add new lesson if data does not exist", async () => {
    // GIVEN
    const timeSpent = 120; // Ajouter une valeur pour timeSpent

    // WHEN
    const result = await registerLessonScore(database, 80, 1, timeSpent);

    // THEN
    expect(result).toBe("Lesson added successfully");
  });

  it("should modify lesson if score is higher", async () => {
    // GIVEN
    const initialTimeSpent = 100;
    await registerLessonScore(database, 80, 1, initialTimeSpent);
    const newTimeSpent = 150; // Ajouter une nouvelle valeur pour timeSpent

    // WHEN
    const result = await registerLessonScore(database, 85, 1, newTimeSpent);

    // THEN
    expect(result).toBe("Lesson updated successfully");
  });

  it("should not update lesson if new score is lower", async () => {
    // GIVEN
    const initialScore = 85;
    const newScore = 80; // lower than initialScore
    const lessonNumber = 1;
    const timeSpent = 120;
    await registerLessonScore(database, initialScore, lessonNumber, timeSpent);

    // WHEN
    await registerLessonScore(database, newScore, lessonNumber, timeSpent);

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
});
