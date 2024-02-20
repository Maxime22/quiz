module.exports = {
  integrationFolder: "tests/cypress",
}

const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // Options de test E2E
    setupNodeEvents(on, config) {
      // gérer les événements du nœud ici
    },
    supportFile: false,
    baseUrl: 'http://app/', // Ajustez en fonction de l'URL de votre application
    // Chemin vers les fichiers de test
    specPattern: 'tests/cypress/**/*.cy.{js,jsx,ts,tsx}'
  }
});
