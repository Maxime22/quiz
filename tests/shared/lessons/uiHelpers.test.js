import { checkAnswer } from '../../../src/shared/js/lessons/uiHelpers'; // Replace with actual path
import { playSound } from '../../../src/shared/js/lessons/media/soundManagement'; // Replace with actual path
import { displayNextWord } from '../../../src/shared/js/lessons/lessonManagement'; // Replace with actual path

// Mocks for DOM elements and external functions
jest.mock('../../../src/shared/js/lessons/media/soundManagement');
jest.mock('../../../src/shared/js/lessons/lessonManagement');

const mockInputElement = { value: '' };
const mockFeedbackElement = { textContent: '' };
document.getElementById = jest.fn((id) => {
    if (id === 'userLessonInput') return mockInputElement;
    if (id === 'feedbackEmoji') return mockFeedbackElement;
    // Add more mocks as needed
});

describe('checkAnswer', () => {
    const lessons = []; // Mock lessons array
    let wordsForCurrentLesson = [
        { word: "où", trad: "doko", lesson: "1" },
        { word: "[destination]", trad: "e", lesson: "1" }
    ]; // Mock words array
    const currentWordIndex = 0;
    const currentLesson = 1;

    beforeEach(() => {
        // Initialize the array before each test
        wordsForCurrentLesson = [
            { word: "où", trad: "doko", lesson: "1" },
            { word: "[destination]", trad: "e", lesson: "1" }
        ];
        mockInputElement.value = '';
        mockFeedbackElement.textContent = '';
    });

    afterEach(() => {
        // Reset mocks after each test
        playSound.mockClear();
        displayNextWord.mockClear();
    });

    it('should handle correct answer', () => {
        // GIVEN
        mockInputElement.value = 'doko';

        // WHEN
        checkAnswer(lessons, wordsForCurrentLesson, currentWordIndex, currentLesson);

        // THEN
        expect(mockFeedbackElement.textContent).toBe("✅");
        expect(wordsForCurrentLesson.length).toBe(1); // Word should be removed
        expect(displayNextWord).toHaveBeenCalled();
        expect(playSound).toHaveBeenCalledWith('correctSound');
        expect(mockInputElement.value).toBe(''); // Input should be cleared
    });

    it('should handle incorrect answer', () => {
        // GIVEN
        mockInputElement.value = 'dok';

        // WHEN
        checkAnswer(lessons, wordsForCurrentLesson, currentWordIndex, currentLesson);

        // THEN
        expect(mockFeedbackElement.textContent).toBe("❌");
        expect(wordsForCurrentLesson.length).toBe(2); // Word should not be removed
        expect(displayNextWord).not.toHaveBeenCalled();
        expect(playSound).toHaveBeenCalledWith('wrongSound');
        expect(mockInputElement.value).toBe(''); // Input should be cleared
    });
});
