const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

// POST /api/auth/register - inscription d'un intérimaire
// Schéma : UTILISATEUR → UTILISATEUR_CONNECTE → INTERIMAIRE (3 insertions)
router.post("/register", async (req, res) => {
  const { nom, prenom, email, mot_de_passe, telephone } = req.body;

  if (!nom || !prenom || !email || !mot_de_passe) {
    return res.status(400).json({ error: "Les champs nom, prenom, email et mot_de_passe sont requis." });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Vérifie que l'email n'est pas déjà utilisé
    const [existing] = await conn.execute(
      "SELECT id_utilisateur FROM UTILISATEUR WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      await conn.rollback();
      return res.status(409).json({ error: "Cet email est déjà enregistré." });
    }

    const hash = await bcrypt.hash(mot_de_passe, 12);

    // 1. Insertion dans UTILISATEUR
    const [userResult] = await conn.execute(
      "INSERT INTO UTILISATEUR (email, mot_de_passe, nom, prenom) VALUES (?, ?, ?, ?)",
      [email, hash, nom, prenom]
    );
    const id = userResult.insertId;

    // 2. Insertion dans UTILISATEUR_CONNECTE
    await conn.execute(
      "INSERT INTO UTILISATEUR_CONNECTE (id_utilisateur, telephone) VALUES (?, ?)",
      [id, telephone || null]
    );

    // 3. Insertion dans INTERIMAIRE
    await conn.execute(
      "INSERT INTO INTERIMAIRE (id_utilisateur) VALUES (?)",
      [id]
    );

    await conn.commit();
    res.status(201).json({ message: "Compte créé avec succès.", id });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: "Erreur serveur lors de l'inscription." });
  } finally {
    conn.release();
  }
});

// POST /api/auth/login - connexion d'un intérimaire
router.post("/login", async (req, res) => {
  const { email, mot_de_passe } = req.body;

  if (!email || !mot_de_passe) {
    return res.status(400).json({ error: "Email et mot de passe requis." });
  }

  try {
    // Vérifie que l'utilisateur est bien un intérimaire (JOIN sur les 3 tables)
    const [rows] = await pool.execute(
      `SELECT u.id_utilisateur, u.nom, u.prenom, u.email, u.mot_de_passe
       FROM UTILISATEUR u
       INNER JOIN UTILISATEUR_CONNECTE uc ON uc.id_utilisateur = u.id_utilisateur
       INNER JOIN INTERIMAIRE i ON i.id_utilisateur = u.id_utilisateur
       WHERE u.email = ?`,
      [email]
    );

    if (rows.length === 0) {
      // Message volontairement générique pour ne pas révéler si l'email existe
      return res.status(401).json({ error: "Identifiants incorrects." });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Identifiants incorrects." });
    }

    const token = jwt.sign(
      { id: user.id_utilisateur, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      user: {
        id: user.id_utilisateur,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur lors de la connexion." });
  }
});

module.exports = router;
