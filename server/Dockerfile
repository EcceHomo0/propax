# ============================================================
# Dockerfile - Backend Node.js/Express (Propax)
# Build multi-stage :
#   Stage 1 : installation des dépendances (builder)
#   Stage 2 : image de production allégée
# ============================================================

# ---------- Stage 1 : Dépendances ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copie des manifestes de dépendances
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# ---------- Stage 2 : Production ----------
FROM node:20-alpine

# Création d'un utilisateur non-root pour la sécurité
RUN addgroup -S propax && adduser -S propax -G propax

WORKDIR /app

# Copie des dépendances installées depuis le stage précédent
COPY --from=builder /app/node_modules ./node_modules

# Copie du code source du serveur
COPY . .

# Changement de propriétaire des fichiers
RUN chown -R propax:propax /app

# Passage à l'utilisateur non-root
USER propax

# Port exposé par l'API Express
EXPOSE 5000

# Variables d'environnement par défaut (surchargées par docker-compose)
ENV NODE_ENV=production
ENV PORT=5000

# Healthcheck : vérifie que l'API répond toutes les 30s
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/test || exit 1

# Démarrage du serveur
CMD ["node", "server.js"]
