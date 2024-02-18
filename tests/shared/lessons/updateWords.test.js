import * as updateWords from "../../../src/shared/js/lessons/updateWords.js";

describe('updateAllWordsForCurrentLesson', () => {

    it('should return all words that match the current lesson number', () => {
        const lessons = [
            { word: "apple", trad: "りんご", lesson: "1" },
            { word: "banana", trad: "バナナ", lesson: "2" },
            { word: "cherry", trad: "さくらんぼ", lesson: "1" },
            { word: "date", trad: "デーツ", lesson: "3" }
        ];

        const currentLesson = "1";
        const updatedLessons = updateWords.updateAllWordsForCurrentLesson(currentLesson, lessons);

        expect(updatedLessons.length).toBe(2);
        expect(updatedLessons).toEqual([
            { word: "apple", trad: "りんご", lesson: "1" },
            { word: "cherry", trad: "さくらんぼ", lesson: "1" }
        ]);
    });

    it('should handle lessons specified as numbers correctly', () => {
        const lessons = [
            { word: "apple", trad: "りんご", lesson: "1" },
            { word: "banana", trad: "バナナ", lesson: "2" }
        ];

        const currentLesson = 1;
        const updatedLessons = updateWords.updateAllWordsForCurrentLesson(currentLesson, lessons);

        expect(updatedLessons.length).toBe(1);
        expect(updatedLessons).toEqual([
            { word: "apple", trad: "りんご", lesson: "1" }
        ]);
    });

    it('should return an empty array if no words match the current lesson', () => {
        const lessons = [
            { word: "apple", trad: "りんご", lesson: "1" },
            { word: "banana", trad: "バナナ", lesson: "2" }
        ];

        const currentLesson = "3";
        const updatedLessons = updateWords.updateAllWordsForCurrentLesson(currentLesson, lessons);

        expect(updatedLessons).toEqual([]);
    });
});
