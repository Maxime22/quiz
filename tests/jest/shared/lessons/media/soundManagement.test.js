import * as soundManagement from "../../../../../src/shared/js/lessons/media/soundManagement.js";

describe('playSound', () => {
    beforeEach(() => {
        // Préparation du DOM fictif
        document.body.innerHTML = `<audio id="testAudio"></audio>`;
    });

    it('should play the sound by resetting currentTime and calling play', () => {
        // GIVEN
        const mockPlay = jest.fn();
        const audio = document.getElementById("testAudio");
        audio.play = mockPlay;

        // WHEN
        soundManagement.playSound('testAudio');

        // THEN
        expect(audio.currentTime).toBe(0);
        expect(mockPlay).toHaveBeenCalled();
    });
});

describe('toggleMute', () => {
    beforeEach(() => {
        // Préparation du DOM fictif
        document.body.innerHTML = `
      <button id="muteButton">Mute</button>
      <audio></audio>
      <video></video>`;
    });

    it('should toggle mute state on all media elements and update button text', () => {
        // GIVEN
        const muteButton = document.getElementById("muteButton");
        const mediaElements = document.querySelectorAll("audio, video");
        mediaElements.forEach(el => el.muted = false);

        // WHEN
        soundManagement.toggleMute(muteButton)

        // THEN
        mediaElements.forEach(el => {
            expect(el.muted).toBe(true); // Tous les éléments doivent être mis en sourdine
        });
        expect(muteButton.textContent).toBe("Unmute"); // Le texte du bouton doit être mis à jour

        // WHEN
        soundManagement.toggleMute(muteButton)

        // THEN
        mediaElements.forEach(el => {
            expect(el.muted).toBe(false); // La sourdine doit être désactivée
        });
        expect(muteButton.textContent).toBe("Mute"); // Le texte du bouton doit être réinitialisé
    });
});
