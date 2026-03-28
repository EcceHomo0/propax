const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /api/entreprises - liste toutes les entreprises (pour le select du formulaire)
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id_entreprise, nom FROM ENTREPRISE_CLIENTE ORDER BY nom ASC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST /api/entreprises - créer une entreprise cliente
router.post("/", async (req, res) => {
  const { nom, adresse, activite, description, contact, email, telephone } = req.body;
  if (!nom) {
    return res.status(400).json({ error: "Le nom de l'entreprise est requis." });
  }
  try {
    const sql =
      "INSERT INTO ENTREPRISE_CLIENTE (nom, adresse, activite, description, contact, email, telephone) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const [result] = await pool.execute(sql, [
      nom,
      adresse || null,
      activite || null,
      description || null,
      contact || null,
      email || null,
      telephone || null,
    ]);
    res.status(201).json({ id_entreprise: result.insertId, nom });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur lors de la création." });
  }
});

module.exports = router;
