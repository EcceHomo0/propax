# ============================================================
# Dockerfile - Frontend React (Propax)
# Build multi-stage :
#   Stage 1 : compilation du bundle React (builder)
#   Stage 2 : serveur Nginx léger pour la production
# ============================================================

# ---------- Stage 1 : Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copie des fichiers de dépendances en premier (cache layer Docker)
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copie du code source
COPY . .

# Build de l'application React (génère /app/build)
RUN npm run build

# ---------- Stage 2 : Serve avec Nginx ----------
FROM nginx:1.25-alpine

# Suppression de la config par défaut
RUN rm /etc/nginx/conf.d/default.conf

# Copie de notre configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/propax.conf

# Copie du build React dans le dossier servi par Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Exposition du port 80
EXPOSE 80

# Démarrage de Nginx en avant-plan
CMD ["nginx", "-g", "daemon off;"]
