import * as modalManagement from "../../../../src/shared/js/lessons/modal/modalManagement.js";

// Simulez le DOM nécessaire pour vos tests
beforeEach(() => {
    document.body.innerHTML = `
    <div id="myModal"></div>
    <div id="myBadgeModal"></div>
    <span class="closeModal"></span>
    <span class="closeBadgeModal"></span>
    <div id="modalText1"></div>
  `;
});

describe('Modal functionality tests', () => {
    test('showWrongAnswerModal displays modal with correct text', () => {
        const wordsForCurrentLesson = [{word: 'Bonjour', trad: 'Hello'}];
        modalManagement.showWrongAnswerModal(wordsForCurrentLesson, 0);
        expect(document.getElementById("myModal").style.display).toBe("block");
        expect(document.getElementById("modalText1").textContent).toContain('La réponse pour Bonjour était : Hello 😏');
    });

    test('showLessonCompletedModal displays modal with completion text', () => {
        modalManagement.showLessonCompletedModal('1');
        expect(document.getElementById("myModal").style.display).toBe("block");
        expect(document.getElementById("modalText1").textContent).toContain('✨ Félicitations ! ✨ Vous avez terminé la leçon 1! 😃');
    });

    test('showSuccess shows the badge modal', () => {
        modalManagement.showSuccess();
        expect(document.getElementById("myBadgeModal").style.display).toBe("block");
    });

    test('hideModal hides the modal', () => {
        modalManagement.hideModal(document.getElementById("myModal"));
        expect(document.getElementById("myModal").style.display).toBe("none");
    });

    test('hideBadgeModal hides the badge modal', () => {
        modalManagement.hideBadgeModal(document.getElementById("myBadgeModal"));
        expect(document.getElementById("myBadgeModal").style.display).toBe("none");
    });
});
