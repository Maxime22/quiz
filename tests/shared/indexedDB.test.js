import {registerLessonScore} from "../../src/shared/js/indexedDB.js";

const LOW_SCORE = 70;

const mockGet = jest.fn();
const mockPut = jest.fn();
const mockAdd = jest.fn();
const mockIndex = { get: mockGet };
const mockStore = {
    index: jest.fn().mockReturnValue(mockIndex),
    put: mockPut,
    add: mockAdd
};
const mockTransaction = {
    objectStore: jest.fn().mockReturnValue(mockStore)
};
const mockDB = {
    transaction: jest.fn().mockReturnValue(mockTransaction)
};

beforeAll(() => {
    global.indexedDB = {
        open: jest.fn().mockImplementation(() => {
            return {
                onupgradeneeded: jest.fn(),
                onsuccess: jest.fn((e) => {
                    e.target = { result: mockDB };
                }),
                onerror: jest.fn()
            };
        })
    };
});

beforeEach(() => {
    document.body.innerHTML = `
    <div id="badgeListItems"></div>
  `;
});

describe('registerLessonScore', () => {
    it('should update the score if the lesson exists and the new score is higher', () => {
        // GIVEN
        const existingLesson = { lessonNumber: 1, score: LOW_SCORE };
        mockGet.mockImplementationOnce((query, callback) => {
            callback({ target: { result: existingLesson } });
        });

        // WHEN
        registerLessonScore(80, 1);

        // THEN
        expect(mockPut).toHaveBeenCalledWith({ ...existingLesson, score: 80 });
    });

    it('should add a new lesson if it does not exist', () => {
        // GIVEN
        mockGet.mockImplementationOnce((query, callback) => {
            callback({ target: { result: undefined } });
        });

        // WHEN
        registerLessonScore(85, 2);

        // THEN
        expect(mockAdd).toHaveBeenCalledWith({
            lessonId: expect.stringContaining('Lesson_2_'),
            lessonNumber: 2,
            score: 85
        });
    });
});
