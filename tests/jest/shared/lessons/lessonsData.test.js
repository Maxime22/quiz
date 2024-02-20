import * as lessonsData from "../../../../src/shared/js/lessons/lessonsData.js";

jest.mock("../../../../src/languages/japanese/js/japaneseLesson.js", () => ({
    japaneseWordsTradsAndLessons: [
        { word: "こんにちは", trad: "hello", lesson: "1" }
    ],
}));

jest.mock("../../../../src/languages/spanish/js/spanishLesson.js", () => ({
    spanishWordsTradsAndLessons: [
        { word: "hola", trad: "hello", lesson: "1" }
    ],
}));

describe('getScriptElementSource', () => {
    it('returns the data-html-source attribute of the script element', () => {
        document.body.innerHTML = `<script src="../../../../src/shared/js/lessons/quizInput.js" data-html-source="japanLessons"></script>`;

        expect(lessonsData.getScriptElementSource()).toBe("japanLessons");
    });

    it('returns an empty string if the script element is not found', () => {
        document.body.innerHTML = '';
        expect(lessonsData.getScriptElementSource()).toBe("");
    });
});

describe('getLessonsFromSource', () => {
    it('returns Japanese lessons for "japanLessons" source', () => {
        const lessons = lessonsData.getLessonsFromSource("japanLessons");
        expect(lessons).toEqual([{ word: "こんにちは", trad: "hello", lesson: "1" }]);
    });

    it('returns Spanish lessons for "spanishLessons" source', () => {
        const lessons = lessonsData.getLessonsFromSource("spanishLessons");
        expect(lessons).toEqual([{ word: "hola", trad: "hello", lesson: "1" }]);
    });

    it('returns an empty array for an unknown source', () => {
        const lessons = lessonsData.getLessonsFromSource("unknownSource");
        expect(lessons).toEqual([]);
    });
});

describe('getSourceLanguageFromSource', () => {
    it('returns "ja_JP" for "japanLessons" source', () => {
        expect(lessonsData.getSourceLanguageFromSource("japanLessons")).toBe("ja_JP");
    });

    it('returns "es_ES" for "spanishLessons" source', () => {
        expect(lessonsData.getSourceLanguageFromSource("spanishLessons")).toBe("es_ES");
    });

    it('returns an empty string for an unknown source', () => {
        expect(lessonsData.getSourceLanguageFromSource("unknownSource")).toBe("");
    });
});

describe('calculateNumberOfWordsForALesson', () => {
    it('calculates the correct number of words for a given lesson number', () => {
        const lessons = [
            { word: "word1", trad: "trad1", lesson: "1" },
            { word: "word2", trad: "trad2", lesson: "1" },
            { word: "word3", trad: "trad3", lesson: "2" }
        ];
        const count = lessonsData.calculateNumberOfWordsForALesson(1, lessons);
        expect(count).toBe(2);
    });
});

describe('compareLessons', () => {

    it('should correctly sort an array of lesson objects by lesson number', () => {
        const lessons = [
            { word: "word3", trad: "trad3", lesson: "3" },
            { word: "word1", trad: "trad1", lesson: "1" },
            { word: "word2", trad: "trad2", lesson: "2" }
        ];

        const sortedLessons = lessons.sort(lessonsData.compareLessons);

        expect(sortedLessons).toEqual([
            { word: "word1", trad: "trad1", lesson: "1" },
            { word: "word2", trad: "trad2", lesson: "2" },
            { word: "word3", trad: "trad3", lesson: "3" }
        ]);

        expect(sortedLessons[0].lesson).toBe("1");
        expect(sortedLessons[1].lesson).toBe("2");
        expect(sortedLessons[2].lesson).toBe("3");
    });

    it('should handle lessons with numerical string values correctly', () => {
        const lessons = [
            { word: "word2", trad: "trad2", lesson: "10" },
            { word: "word1", trad: "trad1", lesson: "2" }
        ];

        const sortedLessons = lessons.sort(lessonsData.compareLessons);

        expect(sortedLessons).toEqual([
            { word: "word1", trad: "trad1", lesson: "2" },
            { word: "word2", trad: "trad2", lesson: "10" }
        ]);
    });
});


