const jwt = require("jsonwebtoken");

/**
 * Middleware d'authentification JWT.
 * Attend un header : Authorization: Bearer <token>
 * En cas de succès, expose req.user = { id, email }
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res
      .status(401)
      .json({ error: "Token manquant. Authentification requise." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch {
    return res.status(401).json({ error: "Token invalide ou expiré." });
  }
}

module.exports = authMiddleware;
