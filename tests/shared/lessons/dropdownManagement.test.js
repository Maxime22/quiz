import * as dropdownManagement from "../../../src/shared/js/lessons/dropdownManagement.js";

describe('updateLessonInSelectDropdown', () => {
    it('should update the lesson in the select dropdown', () => {
        // GIVEN
        const lessonValue = '2';

        // Créer un nouvel élément select
        const selectElement = document.createElement('select');
        selectElement.id = 'lessonSelect';
        const option1 = document.createElement('option');
        option1.value = '1';
        option1.textContent = 'Option 1';
        const option2 = document.createElement('option');
        option2.value = '2';
        option2.textContent = 'Option 2';
        selectElement.appendChild(option1);
        selectElement.appendChild(option2);

        // Ajouter l'élément select au corps du document
        document.body.appendChild(selectElement);

        // WHEN
        dropdownManagement.updateLessonInSelectDropdown(lessonValue);

        // THEN
        const updatedSelectElement = document.getElementById('lessonSelect');
        expect(updatedSelectElement).toBeDefined();
        expect(updatedSelectElement.value).toEqual(lessonValue);
    });
});

describe('populateLessonDropdown', () => {
    it('should populate the lesson dropdown', () => {
        // GIVEN
        document.body.innerHTML = '<select id="lessonSelect"></select>';
        const lessons = [
            { lesson: 1, otherProperty: 'someValue1' },
            { lesson: 2, otherProperty: 'someValue2' },
            { lesson: 1, otherProperty: 'someValue3' },
            // Add more test data as needed
        ];

        // WHEN
        dropdownManagement.populateLessonDropdown(lessons);

        // THEN
        const selectElement = document.getElementById('lessonSelect');
        expect(selectElement.childNodes.length).toBe(2); // Assuming two unique lessons in the test data

        const options = selectElement.getElementsByTagName('option');
        expect(options[0].value).toBe('1');
        expect(options[0].textContent).toBe('Leçon 1');

        expect(options[1].value).toBe('2');
        expect(options[1].textContent).toBe('Leçon 2');

    });
});
