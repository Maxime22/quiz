import {calculateTimeSpent, handleKeyUp} from "../../../src/shared/js/lessons/lessonManagement";
import * as uiHelpers from '../../../src/shared/js/lessons/uiHelpers.js';
jest.mock('../../../src/shared/js/lessons/uiHelpers.js', () => ({
    checkAnswer: jest.fn(),
}));

describe('calculateTimeSpent', () => {
    it('should calculate the correct time spent', () => {
        // Mock Date.now() to return a specific timestamp
        jest.spyOn(global.Date, 'now').mockImplementation(() => new Date('2023-12-11T12:00:00Z').getTime());

        // Initialize the timer
        let timerStart = new Date('2023-12-11T11:59:30Z').getTime();

        const timeSpent = calculateTimeSpent(timerStart);
        expect(timeSpent).toBe(30); // 30 seconds
    });
});

describe('handleKeyUp', () => {
    it('should start timer and call checkAnswer on Enter key press', () => {
        // GIVEN
        const mockEvent = { keyCode: 13 }; // 13 is the keycode for Enter

        // WHEN
        handleKeyUp(mockEvent);

        // THEN
        expect(uiHelpers.checkAnswer).toHaveBeenCalled();
    });
});