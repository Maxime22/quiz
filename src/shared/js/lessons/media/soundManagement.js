
export function playSound(id) {
    const audio = document.getElementById(id);
    audio.currentTime = 0; // Revenir au début pour permettre des lectures consécutives
    audio.play();
}

const muteButton = document.getElementById('muteButton');
if (muteButton) {
    muteButton.addEventListener('click', function () {
        const mediaElements = document.querySelectorAll('audio, video');
        const isMuted = mediaElements[0] && mediaElements[0].muted;

        mediaElements.forEach(media => {
            media.muted = !isMuted;
        });

        this.textContent = isMuted ? 'Mute' : 'Unmute';
    });
}