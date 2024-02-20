describe('Test de l\'affichage de la modale de succès', () => {
    it('Affiche la modale lorsque le bouton displaySuccess est cliqué', () => {
        // Visiter la page HTML
        cy.visit('http://app/src/languages/spanish/html/spanishLessonsIndex.html');

        // Vérifier que la modal est initialement cachée (display: none)
        cy.get('#myBadgeModal').should('have.css', 'display', 'none');

        // Cliquer sur le bouton displaySuccess
        cy.get('#displaySuccess').click();

        // Vérifier que la modal est maintenant affichée (display: block)
        cy.get('#myBadgeModal').should('have.css', 'display', 'block');
    });
});
