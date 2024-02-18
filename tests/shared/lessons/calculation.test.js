import * as calculation from "../../../src/shared/js/lessons/calculation.js";

describe('calculateTimeSpent', () => {
    beforeAll(() => {
        jest.spyOn(Date, 'now').mockReturnValue(new Date('2024-02-20T10:00:00Z').getTime());
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('should return the time spent in seconds when timerStart is provided', () => {
        const timerStart = new Date('2024-02-20T09:59:50Z').getTime();
        const timeSpent = calculation.calculateTimeSpent(timerStart);
        expect(timeSpent).toBe(10.00);
    });

    it('should return 0 when timerStart is null', () => {
        const timeSpent = calculation.calculateTimeSpent(null);
        expect(timeSpent).toBe(0);
    });
});


describe('calculateScoreInPercentage', () => {
    it('should calculate the correct score when there are unknown words', () => {
        const score = calculation.calculateScoreInPercentage(100, ['word1', 'word2', 'word3']);
        expect(score).toBe(97);
    });

    it('should calculate 100% score when there are no unknown words', () => {
        const score = calculation.calculateScoreInPercentage(100, []);
        expect(score).toBe(100);
    });

    it('should calculate 0% score when all words are unknown', () => {
        const score = calculation.calculateScoreInPercentage(100, new Array(100).fill('word'));
        expect(score).toBe(0);
    });
});
