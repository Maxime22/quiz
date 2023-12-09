let modal = document.getElementById("myModal");
let badgeModal = document.getElementById("myBadgeModal");
// Récupérez l'élément <span> qui permet de fermer la modale
let closeModal = document.getElementsByClassName("closeModal")[0];
let closeBadgeModal = document.getElementsByClassName("closeBadgeModal")[0];
let modalText1 = document.getElementById('modalText1')

export function showWrongAnswerModal(wordsForCurrentLesson, currentWordIndex) {
    modal.style.display = "block";
    modalText1.textContent = "La réponse était : " + wordsForCurrentLesson[currentWordIndex].trad + " 😏";
}

export function showLessonCompletedModal(currentLesson) {
    modal.style.display = "block";
    modalText1.textContent = "✨ Félicitations ! ✨ Vous avez terminé la leçon " + currentLesson + "! 😃";
}

export function showSuccess(currentLesson) {
    badgeModal.style.display = "block";
}

if (closeModal) {
    closeModal.onclick = function () {
        hideModal()
    }
}

if (closeBadgeModal) {
    closeBadgeModal.onclick = function () {
        hideBadgeModal()
    }
}

function hideModal() {
    modal.style.display = "none";
}

function hideBadgeModal() {
    badgeModal.style.display = "none";
}