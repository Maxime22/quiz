// https://dev.to/andyhaskell/testing-your-indexeddb-code-with-jest-2o17
import {registerLessonScore, setupDB} from "../../../../src/shared/js/lessons/database/indexedDB";
import "fake-indexeddb/auto";

if (typeof structuredClone === 'undefined') {
    global.structuredClone = function (obj) {
        return JSON.parse(JSON.stringify(obj));
    };
}

describe('registerLessonScore', () => {
    let database;
    // Mock de votre IndexedDB ou de l'objet lessonStore
    beforeEach(async () => {
        database = await setupDB();
    });

    afterEach(() => {
        database.close();
    });

    it('should add new lesson if data does not exist', async () => {
        // GIVEN
        const timeSpent = 120; // Ajouter une valeur pour timeSpent

        // WHEN
        const result = await registerLessonScore(database, 80, 1, timeSpent);

        // THEN
        expect(result).toBe('Lesson added successfully');
    });

    it('should modify lesson if score is higher', async () => {
        // GIVEN
        const initialTimeSpent = 100;
        await registerLessonScore(database, 80, 1, initialTimeSpent);
        const newTimeSpent = 150; // Ajouter une nouvelle valeur pour timeSpent

        // WHEN
        const result = await registerLessonScore(database, 85, 1, newTimeSpent);

        // THEN
        expect(result).toBe('Lesson updated successfully');
    });
});
