// https://dev.to/andyhaskell/testing-your-indexeddb-code-with-jest-2o17
import {registerBadge, registerLessonScore, setupDB} from "../../src/shared/js/indexedDB";
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

        // WHEN
        const result = await registerLessonScore(database, 80,1);

        // THEN
        expect(result).toBe('Lesson added successfully');
    });

    it('should modify lesson if score is higher', async () => {
        // GIVEN
        await registerLessonScore(database, 80, 1);

        // WHEN
        const result = await registerLessonScore(database, 85,1);

        // THEN
        expect(result).toBe('Lesson updated successfully');
    });

    it('should add new badge if data does not exist', async () => {
        // GIVEN

        // WHEN
        const result = await registerBadge(database, "Lesson_1");

        // THEN
        expect(result).toBe('Badge added successfully');
    });

    it('should modify badge', async () => {
        // GIVEN
        await registerBadge(database, "Lesson_1");

        // WHEN
        const result = await registerBadge(database, "Lesson_1");

        // THEN
        expect(result).toBe('Badge updated successfully');
    });
});
