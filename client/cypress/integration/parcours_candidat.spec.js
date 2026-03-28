describe('Parcours candidat - recherche -> consultation -> candidature', () => {
  beforeEach(() => {
    // stub API responses pour rendre le test indépendant du backend
    cy.intercept('GET', '/api/offers', {
      statusCode: 200,
      body: [
        { id: 1, intitule: 'Développeur', typeContrat: 'CDI', dureeContrat: 'Indéterminée', lieuMission: 'Toulouse' }
      ]
    }).as('getOffers');
  });

  it('cherche une offre et soumet une candidature', () => {
    cy.viewport(440, 900);
    cy.visit('/');

    // Recherche
    cy.get('input[placeholder="Saisissez une profession"]').type('Développeur');
    cy.get('input[placeholder="Saisissez un lieu"]').type('Toulouse');
    cy.contains('button', 'Rechercher').click();
    // Attendre l'appel API et vérifier les résultats
    cy.wait('@getOffers');
    cy.contains('Développeur').should('be.visible');
    // Cliquer sur "En savoir plus" pour la première, et ici unique, offre
    cy.contains('button', 'En savoir plus').first().click();

    // L'application n'est pas à un stade de développement permettant d'exécuter la suite du test
    // Cependant, voici comment je procéderais pour aller au bout du parcours candidat :
    // cy.visit('/poste/1'); // On suppose que l'offre a l'id 1
    // cy.contains('button', 'Postuler').first().click();
    // cy.visit('/candidature');
    // // Remplissage du formulaire
    // cy.get('input[placeholder="Veuillez saisir votre nom"]').type('Dupont');
    // cy.get('input[placeholder="Veuillez saisir votre prénom"]').type('Jean');
    // cy.get('input[placeholder="Veuillez saisir votre email"]').type('jean.dupont@mail.com');
    // cy.get('input[placeholder="Veuillez saisir votre numéro de téléphone"]').type('0600000000');
    // // Pour l'upload CV on utilisera le plugin attachFile sur le champ <input type="file">
    // cy.get('input[type="file"]').attachFile('cv.pdf');
    // cy.get('input[placeholder="Veuillez saisir un message"]').type('Motivation pour le poste.');
    // cy.get('input[placeholder="Veuillez saisir votre disponibilité"]').type('Immédiate');
    // // Soumission du formulaire
    // cy.get('input[type="submit"]').click();
    // // Message de confirmation
    // cy.contains('Merci pour votre candidature').should('exist');
  });
});
