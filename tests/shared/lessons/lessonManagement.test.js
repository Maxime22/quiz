import { populateLessonDropdown} from "../../../src/shared/js/lessons/lessonManagement.js";
describe('populateLessonDropdown', () => {
    // Mock du DOM
    document.body.innerHTML = `
    <select id="lessonSelect"></select>
  `;

    it('should populate the dropdown with unique lessons', () => {
        // GIVEN
        const lessonsMock = [
            { lesson: 1, word: 'Bonjour', trad: 'Hello' },
            { lesson: 2, word: 'Au revoir', trad: 'Goodbye' }
        ];

        // WHEN
        populateLessonDropdown(lessonsMock);

        // THEN
        const select = document.getElementById('lessonSelect');
        const options = select.getElementsByTagName('option');

        // Assertions
        expect(options.length).toBe(2);
        expect(options[0].value).toBe('1');
        expect(options[0].textContent).toBe('Leçon 1');
        expect(options[1].value).toBe('2');
        expect(options[1].textContent).toBe('Leçon 2');
    });
});

