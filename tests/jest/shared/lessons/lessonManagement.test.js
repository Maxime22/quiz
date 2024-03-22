import * as lessonManagement from "../../../../src/shared/js/lessons/lessonManagement.js";
import * as uiHelpers from "../../../../src/shared/js/lessons/uiHelpers.js";
import * as calculation from "../../../../src/shared/js/lessons/calculation.js";
import * as updateWords from "../../../../src/shared/js/lessons/updateWords.js";
import * as indexedDB from "../../../../src/shared/js/lessons/database/indexedDB.js";
import * as modalManagement from "../../../../src/shared/js/lessons/modal/modalManagement.js";
import * as submitScore from "../../../../src/shared/js/lessons/database/submitScore.js";


// PLUS SIMPLE (VOIR UNIQUEMENT POSSIBLE) à MOCKER SI la fonction appelée est DANS UN AUTRE FICHIER, DE PLUS ILS ONT PAS LA MEME RESPONSABILITE DONC C'EST NORMAL DE PAS LE METTRE DANS LE MEME FICHIER
// IL Y A PEUT ETRE MOYEN DE LE FAIRE MAIS CE SERAIT AVEC THIS OU AUTRE ET C'EST PLUS COMPLIQUE
jest.mock("../../../../src/shared/js/lessons/uiHelpers.js", () => ({
    checkAnswer: jest.fn(),
    updateUI: jest.fn(),
    congratsUser: jest.fn(),
    updateProgressBar: jest.fn()
}));

jest.mock("../../../../src/shared/js/lessons/database/indexedDB.js", () => ({
    updateDatabaseAndDisplay: jest.fn(),
}));

jest.mock("../../../../src/shared/js/lessons/database/submitScore.js", () => ({
    submitScore: jest.fn(),
}));

jest.mock("../../../../src/shared/js/lessons/calculation.js", () => ({
    calculateTimeSpent: jest.fn(),
    calculateScoreInPercentage: jest.fn(),
}));

jest.mock("../../../../src/shared/js/lessons/updateWords.js", () => ({
    updateAllWordsForCurrentLesson: jest.fn(),
}));

jest.mock("../../../../src/shared/js/lessons/modal/modalManagement.js", () => ({
    showWrongAnswerModal: jest.fn(),
}));


describe("calculateTimeSpent", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should calculate the correct time spent", () => {
        // GIVEN
        // Get the actual implementation of calculateTimeSpent
        const realCalculateTimeSpent = jest.requireActual(
            "../../../../src/shared/js/lessons/calculation.js",
        ).calculateTimeSpent;

        // Mock Date.now() to return a specific timestamp
        jest
            .spyOn(global.Date, "now")
            .mockImplementation(() => new Date("2023-12-11T12:00:00Z").getTime());

        // Initialize the timer
        let timerStart = new Date("2023-12-11T11:59:30Z").getTime();

        // WHEN
        const timeSpent = realCalculateTimeSpent(timerStart);

        // THEN
        expect(timeSpent).toBe(30); // 30 seconds
    });
});

describe("handleKeyUp", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should start timer and call checkAnswer on Enter key press", () => {
        // GIVEN
        const mockEvent = {keyCode: 13}; // 13 is the keycode for Enter

        // WHEN
        lessonManagement.handleKeyUp(mockEvent);

        // THEN
        expect(uiHelpers.checkAnswer).toHaveBeenCalled();
    });
});

describe("updateCurrentLesson", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should call updateUI on successful database update", async () => {
        // GIVEN
        const lessons = ["lesson1", "lesson2"];
        let currentLesson = 1;
        calculation.calculateTimeSpent.mockReturnValue(120);
        calculation.calculateScoreInPercentage.mockReturnValue(80);
        submitScore.submitScore.mockResolvedValue();

        // WHEN
        await lessonManagement.updateCurrentLesson(lessons, currentLesson);

        // THEN
        expect(submitScore.submitScore).toHaveBeenCalledWith(
            {"completion_time": 120, "language": "", "lesson_id": currentLesson, "score": 80}
        );
        expect(uiHelpers.updateUI).toHaveBeenCalledWith(lessons, currentLesson);
    });
});

describe('updateToNextLesson', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should choose lesson 1 at first call', () => {
        // GIVEN
        updateWords.updateAllWordsForCurrentLesson.mockReturnValue(['']);

        // WHEN
        lessonManagement.updateToNextLesson();

        // THEN
        expect(updateWords.updateAllWordsForCurrentLesson).toHaveBeenCalledWith(1, []);
    });

    it('should increment currentLesson if no lesson is passed', () => {
        // GIVEN
        let initialLesson = 2;
        let initialLessons = [];
        lessonManagement.initializeLessonManagementGlobalState(initialLesson, initialLessons);
        updateWords.updateAllWordsForCurrentLesson.mockReturnValue(['']);

        // WHEN
        lessonManagement.updateToNextLesson();

        // THEN
        expect(updateWords.updateAllWordsForCurrentLesson).toHaveBeenCalledWith(3, initialLessons);
    });

    it('should update to the specified lesson if one is passed', () => {
        // GIVEN
        let initialLesson = 1;
        let initialLessons = [];
        lessonManagement.initializeLessonManagementGlobalState(initialLesson, initialLessons);
        updateWords.updateAllWordsForCurrentLesson.mockReturnValue(['']);

        let specificLesson = 3;

        // WHEN
        lessonManagement.updateToNextLesson(specificLesson);

        // THEN
        expect(updateWords.updateAllWordsForCurrentLesson).toHaveBeenCalledWith(specificLesson, initialLessons);
    });

    it('should update the total number of words for the new lesson', () => {
        // GIVEN
        updateWords.updateAllWordsForCurrentLesson.mockReturnValue(
            [
                {word: 'TestWord', lesson: 1},
                {word: 'TestWord1', lesson: 1}
            ]);

        // WHEN
        lessonManagement.updateToNextLesson();

        // THEN
        expect(lessonManagement.globalState.totalCountOfWordsForCurrentLesson).toEqual(2);
    });

    it('should recall the method if the new current lesson has no words', () => {
        // GIVEN
        updateWords.updateAllWordsForCurrentLesson
            .mockReturnValueOnce([])
            .mockReturnValueOnce([{word: 'Mot1', lesson: 2}]);

        // WHEN
        let result = lessonManagement.updateToNextLesson();

        // THEN
        expect(updateWords.updateAllWordsForCurrentLesson).toHaveBeenCalledTimes(2);
        expect(result).toEqual([{word: 'Mot1', lesson: 2}]);
    });

    it('should throw an Error if lesson passed to the function is not a number', () => {
        // THEN
        expect(() => {
            lessonManagement.updateToNextLesson('not_an_integer');
        }).toThrowError('Lesson passed to updateToNextLesson is not a number');
    });
});

describe('displayNextWord', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        // Active le mock seulement pour les tests dans ce describe
        jest.spyOn(lessonManagement, 'getRandomWord').mockReturnValue({ word: "cherry", lesson: "1" });
    });

    afterEach(() => {
        // Restaure l'implémentation originale après chaque test dans ce bloc
        lessonManagement.getRandomWord.mockRestore();
    });

    it('should congrats user and go to next lesson if there are no words left', () => {
        // GIVEN
        let currentLesson = 1;
        let initialLessons = [];
        let wordsForCurrentLesson = []
        lessonManagement.initializeLessonManagementGlobalState(currentLesson, initialLessons);
        indexedDB.updateDatabaseAndDisplay.mockResolvedValue();
        jest.spyOn(lessonManagement, 'updateCurrentLesson').mockImplementation();

        // WHEN
        lessonManagement.displayNextWord(initialLessons, wordsForCurrentLesson, currentLesson)

        // THEN
        expect(uiHelpers.congratsUser).toHaveBeenCalledWith(currentLesson);
        expect(lessonManagement.updateCurrentLesson).toHaveBeenCalled();
    });

    it('updates globalState with the last displayed word and its index', () => {
        // GIVEN
        const initialLessons = [{ word: 'apple', lesson: '1' }, { word: 'banana', lesson: '1' }, { word: 'cherry', lesson: '1' }];
        const wordsForCurrentLesson = [{ word: 'banana', lesson: '1' }, { word: 'cherry', lesson: '1' }];
        const currentLesson = 1;
        lessonManagement.initializeLessonManagementGlobalState(currentLesson, initialLessons,3,null,null,[]);
        document.getElementById = jest.fn().mockReturnValue({
            textContent: ''
        });

        // WHEN
        lessonManagement.displayNextWord(initialLessons, wordsForCurrentLesson, currentLesson);

        // THEN
        expect(document.getElementById).toHaveBeenCalledWith('currentWord');

        expect(lessonManagement.globalState.lastWordDisplayed).toEqual({ word: 'cherry', lesson: '1' });
        expect(lessonManagement.globalState.currentWordIndex).toBe(1);

        const mockedElement = document.getElementById('currentWord');
        expect(mockedElement.textContent).toBe('cherry');

        expect(uiHelpers.updateProgressBar).toHaveBeenCalledWith(expect.any(Object),1,3);
    });

    it('exits early if getRandomWord returns no word object', () => {
        // GIVEN
        const initialLessons = [{ word: 'apple', lesson: '1' }, { word: 'banana', lesson: '1' }, { word: 'cherry', lesson: '1' }];
        const wordsForCurrentLesson = [...initialLessons];
        const currentLesson = 1;
        lessonManagement.initializeLessonManagementGlobalState(currentLesson, initialLessons);
        document.getElementById = jest.fn().mockReturnValue({ textContent: '' });
        jest.spyOn(lessonManagement, 'getRandomWord').mockReturnValueOnce(undefined);

        // WHEN
        lessonManagement.displayNextWord(initialLessons, wordsForCurrentLesson, currentLesson);

        // THEN
        expect(document.getElementById).not.toHaveBeenCalled();
        expect(lessonManagement.globalState.lastWordDisplayed).toBeNull();
        expect(lessonManagement.globalState.currentWordIndex).toEqual(0);
    });

    it('should throw an Error if lesson passed to the function is not a number', () => {
        // THEN
        expect(() => {
            lessonManagement.displayNextWord('not_an_integer');
        }).toThrowError('Lesson passed to displayNextWord is not a number');
    });

});

describe('reinitializeUnknownWords', () => {
    it('should reinitialize unknown words', () => {
        // GIVEN
        lessonManagement.initializeLessonManagementGlobalState(
            0,
            [],
            0,
            "es_ES",
            0,
            [{ word: "arbre", lesson: "1" , trad: "arbol"}],
            0,
            ["manzana"]
        );

        // WHEN
        lessonManagement.reinitializeUnknownWords();

        // THEN
        expect(lessonManagement.globalState.unknownWordsForCurrentLesson).toEqual([]);
    });
});

describe('changeWord', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        global.unknownWordsForCurrentLesson = [];
        global.globalState = {
            wordsForCurrentLesson: [{ word: 'apple', trad: 'pomme' }],
            currentWordIndex: 0,
            lessons: [],
            currentLesson: 1
        };
        jest.spyOn(lessonManagement, 'displayNextWord').mockImplementation();
    });

    it('adds unknown word if not already in the list and calls dependent functions', () => {
        // GIVEN
        lessonManagement.initializeLessonManagementGlobalState(
            0,
            [],
            0,
            "es_ES",
            0,
            [{ word: "arbre", lesson: "1" , trad: "arbol"}],
            0,
            ["manzana"]
            );

        // WHEN
        lessonManagement.changeWord();

        // THEN
        expect(lessonManagement.globalState.unknownWordsForCurrentLesson).toContain('manzana');
        expect(lessonManagement.globalState.unknownWordsForCurrentLesson.length).toBe(2);
        expect(modalManagement.showWrongAnswerModal).toHaveBeenCalledWith(lessonManagement.globalState.wordsForCurrentLesson, lessonManagement.globalState.currentWordIndex);
        expect(lessonManagement.displayNextWord).toHaveBeenCalledWith(lessonManagement.globalState.lessons, lessonManagement.globalState.wordsForCurrentLesson, lessonManagement.globalState.currentLesson);
    });

    it('does not add an unknown word if it is already in the list', () => {
        // GIVEN
        lessonManagement.initializeLessonManagementGlobalState(
            0,
            [],
            0,
            "es_ES",
            0,
            [{ word: "arbre", lesson: "1" , trad: "arbol"}],
            0,
            ["arbol"]
        );

        // WHEN
        lessonManagement.changeWord();

        // THEN
        expect(lessonManagement.globalState.unknownWordsForCurrentLesson.length).toBe(1);
    });
});


describe('getRandomWord', () => {
    it('returns the only word in the list if there is only one word', () => {
        // GIVEN
        const wordsForCurrentLesson = [{ word: "apple", lesson: "1" }];
        const currentLesson = "1";
        const lastWordDisplayed = null;

        // WHEN
        const wordObj = lessonManagement.getRandomWord(wordsForCurrentLesson, currentLesson, lastWordDisplayed);

        // THEN
        expect(wordObj).toEqual({ word: "apple", lesson: "1" });
    });

    it('returns a word different from the last word displayed', () => {
        // GIVEN
        const wordsForCurrentLesson = [
            { word: "apple", lesson: "1" },
            { word: "banana", lesson: "1" }
        ];
        const currentLesson = "1";
        const lastWordDisplayed = { word: "apple", lesson: "1" };
        jest.spyOn(Math, 'random').mockReturnValue(0.99); // sélectionne banana

        // WHEN
        const wordObj = lessonManagement.getRandomWord(wordsForCurrentLesson, currentLesson, lastWordDisplayed);

        // THEN
        expect(wordObj).toEqual({ word: "banana", lesson: "1" });
    });

    it('returns a random word from the list', () => {
        // GIVEN
        const wordsForCurrentLesson = [
            { word: "apple", lesson: "1" },
            { word: "banana", lesson: "1" },
            { word: "cherry", lesson: "1" }
        ];
        const currentLesson = "1";
        const lastWordDisplayed = { word: "banana", lesson: "1" };
        jest.spyOn(Math, 'random').mockReturnValue(0.99); // Cela sélectionnera "cherry" dans cet exemple

        // WHEN
        const wordObj = lessonManagement.getRandomWord(wordsForCurrentLesson, currentLesson, lastWordDisplayed);

        // THEN
        expect(wordObj).toEqual({ word: "cherry", lesson: "1" });
    });
});
