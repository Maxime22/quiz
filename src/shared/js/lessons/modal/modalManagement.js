// Récupérez l'élément <span> qui permet de fermer la modale
let closeModal = document.getElementsByClassName("closeModal")[0];
let closeBadgeModal = document.getElementsByClassName("closeBadgeModal")[0];

export function showWrongAnswerModal(wordsForCurrentLesson, currentWordIndex) {
  document.getElementById("myModal").style.display = "block";
  document.getElementById("modalText1").textContent =
    "La réponse pour " +
    wordsForCurrentLesson[currentWordIndex].word +
    " était : " +
    wordsForCurrentLesson[currentWordIndex].trad +
    " 😏";
}

export function showLessonCompletedModal(currentLesson) {
  document.getElementById("myModal").style.display = "block";
  document.getElementById("modalText1").textContent =
    "✨ Félicitations ! ✨ Vous avez terminé la leçon " +
    currentLesson +
    "! 😃";
}

export function showSuccess() {
  document.getElementById("myBadgeModal").style.display = "block";
}

if (closeModal) {
  closeModal.onclick = function () {
    hideModal(document.getElementById("myModal"));
  };
}

if (closeBadgeModal) {
  closeBadgeModal.onclick = function () {
    hideBadgeModal(document.getElementById("myBadgeModal"));
  };
}

export function hideModal(modal) {
  modal.style.display = "none";
}

export function hideBadgeModal(badgeModal) {
  badgeModal.style.display = "none";
}
