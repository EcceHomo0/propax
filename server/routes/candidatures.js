const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/auth");

// Toutes les routes de ce fichier nécessitent d'être authentifié
router.use(authMiddleware);

// GET /api/candidatures - candidatures de l'intérimaire connecté uniquement
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT
         c.id_candidature,
         o.intitule         AS offre_intitule,
         o.type_contrat,
         o.lieu_mission,
         c.statut,
         c.date_candidature
       FROM CANDIDATURE c
       JOIN OFFRE o ON o.id_offre = c.id_offre
       WHERE c.id_utilisateur = ?
       ORDER BY c.date_candidature DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// POST /api/candidatures - postuler à une offre
router.post("/", async (req, res) => {
  const { offre_id, message } = req.body;

  if (!offre_id) {
    return res.status(400).json({ error: "Le champ offre_id est requis." });
  }

  try {
    // Vérifie que l'offre existe
    const [offre] = await pool.execute(
      "SELECT id_offre FROM OFFRE WHERE id_offre = ?",
      [offre_id]
    );
    if (offre.length === 0) {
      return res.status(404).json({ error: "Offre introuvable." });
    }

    // Vérifie qu'une candidature n'existe pas déjà pour cette offre
    const [existing] = await pool.execute(
      "SELECT id_candidature FROM CANDIDATURE WHERE id_offre = ? AND id_utilisateur = ?",
      [offre_id, req.user.id]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: "Vous avez déjà postulé à cette offre." });
    }

    await pool.execute(
      "INSERT INTO CANDIDATURE (id_offre, id_utilisateur, message) VALUES (?, ?, ?)",
      [offre_id, req.user.id, message || null]
    );

    res.status(201).json({ message: "Candidature envoyée avec succès." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

module.exports = router;
