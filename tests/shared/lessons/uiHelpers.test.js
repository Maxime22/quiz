import * as uiHelpers from "../../../src/shared/js/lessons/uiHelpers";
import {playSound} from "../../../src/shared/js/lessons/media/soundManagement";
import {
    displayNextWord,
    updateToNextLesson,
    reinitializeUnknownWords
} from "../../../src/shared/js/lessons/lessonManagement";
import {showLessonCompletedModal} from "../../../src/shared/js/lessons/modal/modalManagement.js";
import {updateLessonInSelectDropdown} from "../../../src/shared/js/lessons/dropdownManagement.js"

jest.mock("../../../src/shared/js/lessons/media/soundManagement.js");
jest.mock("../../../src/shared/js/lessons/lessonManagement.js");
jest.mock("../../../src/shared/js/lessons/modal/modalManagement.js");
jest.mock("../../../src/shared/js/lessons/dropdownManagement.js");

const mockInputElement = {value: ""};
const mockFeedbackElement = {textContent: ""};
document.getElementById = jest.fn((id) => {
    if (id === "userLessonInput") return mockInputElement;
    if (id === "feedbackEmoji") return mockFeedbackElement;
    // Add more mocks as needed
});

describe("checkAnswer", () => {
    const lessons = []; // Mock lessons array
    let wordsForCurrentLesson = [
        {word: "où", trad: "doko", lesson: "1"},
        {word: "[destination]", trad: "e", lesson: "1"},
    ]; // Mock words array
    const currentWordIndex = 0;
    const currentLesson = 1;

    beforeEach(() => {
        // Initialize the array before each test
        wordsForCurrentLesson = [
            {word: "où", trad: "doko", lesson: "1"},
            {word: "[destination]", trad: "e", lesson: "1"},
        ];
        mockInputElement.value = "";
        mockFeedbackElement.textContent = "";
    });

    afterEach(() => {
        // Reset mocks after each test
        playSound.mockClear();
        displayNextWord.mockClear();
    });

    it("should handle correct answer", () => {
        // GIVEN
        mockInputElement.value = "doko";

        // WHEN
        uiHelpers.checkAnswer(
            lessons,
            wordsForCurrentLesson,
            currentWordIndex,
            currentLesson,
        );

        // THEN
        expect(mockFeedbackElement.textContent).toBe("✅");
        expect(wordsForCurrentLesson.length).toBe(1); // Word should be removed
        expect(displayNextWord).toHaveBeenCalled();
        expect(playSound).toHaveBeenCalledWith("correctSound");
        expect(mockInputElement.value).toBe(""); // Input should be cleared
    });

    it("should handle incorrect answer", () => {
        // GIVEN
        mockInputElement.value = "dok";

        // WHEN
        uiHelpers.checkAnswer(
            lessons,
            wordsForCurrentLesson,
            currentWordIndex,
            currentLesson,
        );

        // THEN
        expect(mockFeedbackElement.textContent).toBe("❌");
        expect(wordsForCurrentLesson.length).toBe(2); // Word should not be removed
        expect(displayNextWord).not.toHaveBeenCalled();
        expect(playSound).toHaveBeenCalledWith("wrongSound");
        expect(mockInputElement.value).toBe(""); // Input should be cleared
    });
});

describe('congratsUser', () => {

    beforeEach(() => {
        playSound.mockClear();
        showLessonCompletedModal.mockClear();
    });

    it('calls playSound and showLessonCompletedModal with correct arguments', () => {
        // GIVEN
        const currentLesson = 5;

        // WHEN
        uiHelpers.congratsUser(currentLesson);

        // THEN
        expect(playSound).toHaveBeenCalledWith("lessonCompletedSound");
        expect(showLessonCompletedModal).toHaveBeenCalledWith(currentLesson);
    });
});

describe('updateUI', () => {

    beforeEach(() => {
        updateToNextLesson.mockClear().mockReturnValue([
            {word: 'TestWord', lesson: 1},
            {word: 'TestWord1', lesson: 1}
        ]);
        reinitializeUnknownWords.mockClear();
        updateLessonInSelectDropdown.mockClear();
        displayNextWord.mockClear();
    });

    it('performs UI updates for the next lesson', () => {
        // GIVEN
        const lessons = [];
        const currentLesson = 5;

        // WHEN
        uiHelpers.updateUI(lessons, currentLesson);

        // THEN
        expect(updateToNextLesson).toHaveBeenCalled();
        expect(reinitializeUnknownWords).toHaveBeenCalled();
        expect(updateLessonInSelectDropdown).toHaveBeenCalledWith(currentLesson);
        expect(displayNextWord).toHaveBeenCalledWith(
            lessons, [
                {word: 'TestWord', lesson: 1},
                {word: 'TestWord1', lesson: 1}
            ],
            currentLesson);
    });
});

