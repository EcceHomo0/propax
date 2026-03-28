const request = require('supertest');
const express = require('express');

// Mock du pool de la base de données avant d'importer le router
jest.mock('../db', () => ({
  query: jest.fn(),
  execute: jest.fn(),
}));

const pool = require('../db');
const offersRouter = require('../routes/offers');

describe('Intégration route /api/offers', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/offers', offersRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/offers renvoie une liste formatée', async () => {
    // Préparer la fausse réponse SQL
    const rows = [
      {
        id_offre: 1,
        intitule: 'Développeur React',
        type_contrat: 'CDI',
        duree_contrat: 'Indéterminée',
        lieu_mission: 'Paris',
      },
    ];
    pool.query.mockResolvedValue([rows]);

    const res = await request(app).get('/api/offers').expect(200);

    expect(pool.query).toHaveBeenCalled();
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toMatchObject({
      id: 1,
      intitule: 'Développeur React',
      typeContrat: 'CDI',
      dureeContrat: 'Indéterminée',
      lieuMission: 'Paris',
    });
  });

  it('POST /api/offers valide les champs requis et insère', async () => {
    // Mock de l'insertion
    pool.execute.mockResolvedValue([{ insertId: 42 }]);

    const newOffer = {
      intitule: 'Testeur',
      typeContrat: 'CDD',
      dureeContrat: '3 mois',
      lieuMission: 'Lyon', //ligne supprimée lors du test de cas d'erreur
      idEntreprise: 7,
    };

    const res = await request(app).post('/api/offers').send(newOffer).expect(201);

    expect(pool.execute).toHaveBeenCalled();
    expect(res.body).toMatchObject({
      id: 42,
      intitule: newOffer.intitule,
      typeContrat: newOffer.typeContrat,
      dureeContrat: newOffer.dureeContrat,
      lieuMission: newOffer.lieuMission,
      idEntreprise: newOffer.idEntreprise,
    });
  });

//   it('POST /api/offers retourne 400 si champs manquants', async () => {
//     // Ajout d'une offre incomplète (manque dureeContrat, lieuMission, idEntreprise)
//     const incomplete = { intitule: 'Developpeur', typeContrat: 'CDI' }; 

//     const res = await request(app).post('/api/offers').send(incomplete).expect(400);

//     expect(pool.execute).not.toHaveBeenCalled();
//     expect(res.body).toHaveProperty('error');
//   });
});
