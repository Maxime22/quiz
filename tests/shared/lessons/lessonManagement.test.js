//https://stackoverflow.com/questions/45111198/how-to-mock-functions-in-the-same-module-using-jest
//
// import {
//   handleKeyUp,
//   updateToNextLesson,
// } from "../../../src/shared/js/lessons/lessonManagement.js";
import * as lessonManagement from "../../../src/shared/js/lessons/lessonManagement.js";
import * as uiHelpers from "../../../src/shared/js/lessons/uiHelpers.js";
import * as calculation from "../../../src/shared/js/lessons/calculation.js";
import * as updateWords from "../../../src/shared/js/lessons/updateWords.js";
import * as indexedDB from "../../../src/shared/js/lessons/database/indexedDB.js";


// PLUS SIMPLE (VOIR UNIQUEMENT POSSIBLE) à MOCKER SI la fonction appelée est DANS UN AUTRE FICHIER, DE PLUS ILS ONT PAS LA MEME RESPONSABILITE DONC C'EST NORMAL DE PAS LE METTRE DANS LE MEME FICHIER
// IL Y A PEUT ETRE MOYEN DE LE FAIRE MAIS CE SERAIT AVEC THIS OU AUTRE ET C'EST PLUS COMPLIQUE
jest.mock("../../../src/shared/js/lessons/uiHelpers.js", () => ({
    checkAnswer: jest.fn(),
    updateUI: jest.fn(),
    congratsUser: jest.fn()
}));

jest.mock("../../../src/shared/js/lessons/database/indexedDB.js", () => ({
    updateDatabaseAndDisplay: jest.fn(),
}));

jest.mock("../../../src/shared/js/lessons/calculation.js", () => ({
    calculateTimeSpent: jest.fn(),
    calculateScoreInPercentage: jest.fn(),
}));

jest.mock("../../../src/shared/js/lessons/updateWords.js", () => ({
    updateAllWordsForCurrentLesson: jest.fn(),
}));


describe("calculateTimeSpent", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should calculate the correct time spent", () => {
        // GIVEN
        // Get the actual implementation of calculateTimeSpent
        const realCalculateTimeSpent = jest.requireActual(
            "../../../src/shared/js/lessons/calculation.js",
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
        indexedDB.updateDatabaseAndDisplay.mockResolvedValue();

        // WHEN
        await lessonManagement.updateCurrentLesson(lessons, currentLesson);

        // THEN
        expect(indexedDB.updateDatabaseAndDisplay).toHaveBeenCalledWith(
            80,
            120,
            currentLesson,
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
});

describe('displayNextWord', () => {
    beforeEach(() => {
        jest.resetAllMocks();
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

});