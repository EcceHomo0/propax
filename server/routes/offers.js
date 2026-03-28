// Version enregistrement en mémoire

// const express = require('express');
// const router = express.Router();

// let offers = []; // Stockage temporaire en mémoire

// // Récupérer toutes les offres
// router.get('/', (req, res) => {
//   res.json(offers);
// });

// // Ajouter une nouvelle offre
// router.post('/', (req, res) => {
//   const { intitule, typeContrat, dureeContrat, lieuMission } = req.body;
//   if (!intitule || !typeContrat || !dureeContrat || !lieuMission) {
//     return res.status(400).json({ error: 'Tous les champs sont requis.' });
//   }
//   const newOffer = {
//     id: Date.now(),
//     intitule,
//     typeContrat,
//     dureeContrat,
//     lieuMission
//   };
//   offers.push(newOffer);
//   res.status(201).json(newOffer);
// });

// module.exports = router;

// Version avec base de données MySQL

// routes/offers.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /api/offers - récupération de toutes les offres (résumé pour la liste)
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id_offre, intitule, type_contrat, duree_contrat, lieu_mission FROM OFFRE ORDER BY id_offre DESC",
    );
    const offers = rows.map((row) => ({
      id: row.id_offre,
      intitule: row.intitule,
      typeContrat: row.type_contrat,
      dureeContrat: row.duree_contrat,
      lieuMission: row.lieu_mission,
    }));
    res.json(offers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST /api/offers - Création d'une offre d'emploi
router.post("/", async (req, res) => {
  const {
    intitule,
    typeContrat,
    dureeContrat,
    lieuMission,
    niveauEtudes,
    experience,
    salaire,
    missions,
    idEntreprise,
  } = req.body;

  if (
    !intitule ||
    !typeContrat ||
    !dureeContrat ||
    !lieuMission ||
    !idEntreprise
  ) {
    return res
      .status(400)
      .json({
        error:
          "Les champs intitule, typeContrat, dureeContrat, lieuMission et idEntreprise sont requis.",
      });
  }

  try {
    const sql =
      "INSERT INTO OFFRE (intitule, type_contrat, duree_contrat, lieu_mission, niveau_etudes, experience, salaire, missions, id_entreprise) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const [result] = await pool.execute(sql, [
      intitule,
      typeContrat,
      dureeContrat,
      lieuMission,
      niveauEtudes || null,
      experience || null,
      salaire || null,
      missions || null,
      idEntreprise,
    ]);
    res.status(201).json({
      id: result.insertId,
      intitule,
      typeContrat,
      dureeContrat,
      lieuMission,
      niveauEtudes,
      experience,
      salaire,
      missions,
      idEntreprise,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur lors de l'insertion." });
  }
});

module.exports = router;
