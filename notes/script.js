let currentNoteIndex = 0; // Index de la note actuelle
const cursor = document.querySelector('#cursor');
let currentLeft = 3;
const validateButton = document.getElementById('validate-button');

function updateCursorPosition() {
    currentLeft += 5
    if(currentLeft == 68){
        currentLeft = 3
    }
    cursor.style.left = currentLeft + '%'
}

// Événement de validation
validateButton.addEventListener('click', () => {
    // Valider la note ici et passer à la suivante
    updateCursorPosition();
});
