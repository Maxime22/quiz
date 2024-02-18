import * as displayBadgeAndScore from "../../../../src/shared/js/lessons/display/displayBadgeAndScore.js";
import * as indexedDB from "../../../../src/shared/js/lessons/database/indexedDB.js";
import * as lessonsData from "../../../../src/shared/js/lessons/lessonsData.js";


describe('createLessonsMap', () => {
    it('returns an empty map for an empty lessons array', () => {
        // GIVEN
        const lessons = [];
        const sourceLanguage = 'English';
        // WHEN
        const result = displayBadgeAndScore.createLessonsMap(lessons, sourceLanguage);
        // THEN
        expect(result.size).toBe(0);
    });

    it('adds lessons in the source language to the map', () => {
        // GIVEN
        const lessons = [
            {lessonNumber: 1, score: 95, timeSpent: 30, language: 'English', numberOfLessonCompletion: 2},
            {lessonNumber: 2, score: 88, timeSpent: 25, language: 'French'}
        ];
        const sourceLanguage = 'English';
        // WHEN
        const result = displayBadgeAndScore.createLessonsMap(lessons, sourceLanguage);
        // THEN
        expect(result.size).toBe(1);
        expect(result.get(1)).toEqual({
            score: 95,
            timeSpent: 30,
            language: sourceLanguage,
            numberOfLessonCompletion: 2,
        });
    });

    it('assigns a default value of 1 to numberOfLessonCompletion if not provided', () => {
        // GIVEN
        const lessons = [
            {lessonNumber: 1, score: 95, timeSpent: 30, language: 'English'}
        ];
        const sourceLanguage = 'English';
        // WHEN
        const result = displayBadgeAndScore.createLessonsMap(lessons, sourceLanguage);
        //THEN
        expect(result.get(1).numberOfLessonCompletion).toBe(1);
    });
});

describe('createBadgeWithScoreForDisplay', () => {
    beforeEach(() => {
        document.body.innerHTML = '<ul id="badgeListItems"></ul>';
    });

    it('should create and append a badge with score display to the badge list', () => {
        // GIVEN
        const badgeListElement = document.getElementById("badgeListItems");
        const lessonsMap = new Map([
            [1, {score: 90, timeSpent: 10, numberOfLessonCompletion: 2}],
        ]);
        const badge = {badgeName: 'Lesson 1'};
        lessonsData.getLessonsFromSource = jest.fn().mockReturnValue(
            [
            { word: "vite", trad: "hayaku", lesson: "1" },
            { word: "allons(-y)", trad: "ikimashô", lesson: "1" },
            { word: "j'ai compris", trad: "wakarimashita", lesson: "1" },
            { word: "où", trad: "doko", lesson: "1" }
            ]);

        // WHEN
        displayBadgeAndScore.createBadgeWithScoreForDisplay(badge, badgeListElement, lessonsMap);

        // THEN
        expect(badgeListElement.children.length).toBe(1);
        const listItem = badgeListElement.firstChild;
        expect(listItem.querySelector('.badgeName').textContent).toBe('Lesson 1');
        expect(listItem.querySelector('.lessonScoreDisplayed').textContent).toBe('90%');
        expect(listItem.querySelector('.lessonScoreDisplayed').style.color).toBe('green');
        expect(listItem.querySelector('.lessonTimeSpentDisplayed').textContent).toBe('10s');
        expect(listItem.querySelector('.lessonTimeSpentDisplayed').style.color).toBe('green'); // 10 < 4*3
        expect(listItem.querySelector('.badgeCount').textContent).toBe('x2');
        expect(listItem.querySelectorAll('.lessonScoreStar').length).toBe(4); // Vérifie la présence de 4 étoiles pour un score de 90
    });
});

describe('calculateStars', () => {
    it('returns 5 stars for a score of 100', () => {
        expect(displayBadgeAndScore.calculateStars(100)).toBe(5);
    });

    it('returns 4 stars for scores between 75 and 99', () => {
        expect(displayBadgeAndScore.calculateStars(75)).toBe(4);
        expect(displayBadgeAndScore.calculateStars(99)).toBe(4);
    });

    it('returns 3 stars for scores between 50 and 74', () => {
        expect(displayBadgeAndScore.calculateStars(50)).toBe(3);
        expect(displayBadgeAndScore.calculateStars(74)).toBe(3);
    });

    it('returns 2 stars for scores between 25 and 49', () => {
        expect(displayBadgeAndScore.calculateStars(25)).toBe(2);
        expect(displayBadgeAndScore.calculateStars(49)).toBe(2);
    });

    it('returns 1 star for scores below 25', () => {
        expect(displayBadgeAndScore.calculateStars(0)).toBe(1);
        expect(displayBadgeAndScore.calculateStars(24)).toBe(1);
    });
});

describe('createStarElement', () => {
    it('creates the correct number of stars based on score', () => {
        // WHEN
        const starElementHighScore = displayBadgeAndScore.createStarElement(100, 60, 200); // Cas de 5 étoiles
        const starElementMidScore = displayBadgeAndScore.createStarElement(50, 60, 200); // Cas de 3 étoiles
        // THEN
        expect(starElementHighScore.querySelectorAll('.lessonScoreStar').length).toBe(5);
        expect(starElementMidScore.querySelectorAll('.lessonScoreStar').length).toBe(3);
    });

    it('reduces star count by one if time spent is more than thrice the number of words in the lesson', () => {
        // WHEN
        const starElement = displayBadgeAndScore.createStarElement(100, (3 * 200) + 1, 200); // Devrait réduire à 4 étoiles
        // THEN
        expect(starElement.querySelectorAll('.lessonScoreStar').length).toBe(4);
    });
});

describe('displayBadges', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="badgeListItems"></div>';
    });

    it('should clear existing badges and display only the correct badges for lessons in lessonsMap', () => {
        // GIVEN
        const lessonsMap = new Map([
            [1, {score: 90, timeSpent: 30, numberOfLessonCompletion: 2}],
            [2, {score: 80, timeSpent: 45, numberOfLessonCompletion: 1}],
        ]);

        const badges = [
            {badgeName: 'Lesson 1'},
            {badgeName: 'Lesson 2'},
            {badgeName: 'Nonexistent Lesson'},
        ];
        // WHEN
        displayBadgeAndScore.displayBadges(lessonsMap, badges);
        // THEN
        const badgeListElement = document.getElementById("badgeListItems");
        expect(badgeListElement.children.length).toBe(2);
        expect(badgeListElement.querySelectorAll('.badgeItem').length).toBe(2);
        expect(badgeListElement.innerHTML).toContain('Lesson 1');
        expect(badgeListElement.innerHTML).toContain('Lesson 2');
        expect(badgeListElement.innerHTML).not.toContain('Nonexistent Lesson');
    });
});


describe('displayStatistics tests', () => {
    let databaseMock;

    beforeEach(() => {
        jest.resetAllMocks();
        databaseMock = {};
        indexedDB.getLessonsByLanguage = jest.fn().mockResolvedValue([]);
        jest.spyOn(displayBadgeAndScore, 'displayBadges').mockImplementation();
        jest.spyOn(displayBadgeAndScore, 'createLessonsMap').mockImplementation();
    });

    const testCases = [
        { language: "ja_JP", expectedLanguage: "ja_JP" },
        { language: "es_ES", expectedLanguage: "es_ES" }
    ];

    test.each(testCases)('displayBadges is called with correct arguments for $language', async ({ language, expectedLanguage }) => {
        await displayBadgeAndScore.displayStatistics(databaseMock, language);

        expect(indexedDB.getLessonsByLanguage).toHaveBeenCalledWith(databaseMock, expectedLanguage);
        expect(displayBadgeAndScore.displayBadges).toHaveBeenCalled();
    });
});
