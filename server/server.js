const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:3000";

app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  }),
);

app.use(express.json());

const offersRoutes = require("./routes/offers");
app.use("/api/offers", offersRoutes);

const entreprisesRoutes = require("./routes/entreprises");
app.use("/api/entreprises", entreprisesRoutes);

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const candidaturesRoutes = require("./routes/candidatures");
app.use("/api/candidatures", candidaturesRoutes);

// Route de test
app.get("/", (req, res) => {
  res.json({ message: "Le serveur fonctionne" });
});

// Route API de test
app.get("/api/test", (req, res) => {
  res.json({
    message: "API fonctionnelle",
    timestamp: new Date().toISOString(),
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
