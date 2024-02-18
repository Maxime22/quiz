export function playSound(id) {
  const audio = document.getElementById(id);
  audio.currentTime = 0; // Revenir au début pour permettre des lectures consécutives
  audio.play();
}

export function toggleMute(muteButton) {
  const mediaElements = document.querySelectorAll("audio, video");
  const isMuted = mediaElements[0] && mediaElements[0].muted;

  mediaElements.forEach((media) => {
    media.muted = !isMuted;
  });

  muteButton.textContent = isMuted ? "Mute" : "Unmute";
}

const muteButton = document.getElementById("muteButton");
if (muteButton) {
  muteButton.addEventListener("click", function() {
    toggleMute(muteButton);
  });
}