# Plan DevOps - Projet Propax

## Application Full-Stack de gestion d'offres d'emploi

### React 19 | Node.js/Express | MySQL 8 | Docker | GitHub Actions

---

## Sommaire

1. [Architecture de l'application](#1-architecture-de-lapplication)
2. [Conteneurisation avec Docker](#2-conteneurisation-avec-docker)
3. [Orchestration avec Docker Compose](#3-orchestration-avec-docker-compose)
4. [Pipeline CI/CD avec GitHub Actions](#4-pipeline-cicd-avec-github-actions)
5. [Stratégie de branches Git](#5-stratégie-de-branches-git)
6. [Sécurité et bonnes pratiques](#6-sécurité-et-bonnes-pratiques)
7. [Environnements](#7-environnements)
8. [Commandes utiles](#8-commandes-utiles)
9. [Schéma global du pipeline](#9-schéma-global-du-pipeline)

---

## 1. Architecture de l'application

### Stack technique

| Composant       | Technologie                      | Version  |
| --------------- | -------------------------------- | -------- |
| Frontend        | React + React Router             | 19.x     |
| Styles          | CSS + Sass                       | 1.x      |
| Backend         | Node.js + Express                | 20 / 5.x |
| Base de données | MySQL                            | 8.0      |
| Serveur web     | Nginx                            | 1.25     |
| Conteneurs      | Docker + Compose                 | latest   |
| CI/CD           | GitHub Actions                   | -        |
| Registry        | GitHub Container Registry (GHCR) | -        |

### Structure du monorepo

```
propax/
├── client/              ← Application React (frontend)
│   ├── src/
│   │   ├── components/  ← Composants réutilisables
│   │   ├── pages/       ← Pages (Home, Offers, Poste, etc.)
│   │   └── styles/      ← Feuilles de style CSS/Sass
│   ├── Dockerfile       ← Build React + Nginx
│   └── nginx.conf       ← Config Nginx (proxy, SPA, sécurité)
│
├── server/              ← API REST Express (backend)
│   ├── routes/
│   │   └── offers.js    ← Routes CRUD des offres
│   ├── db.js            ← Pool de connexion MySQL
│   ├── server.js        ← Point d'entrée Express
│   └── Dockerfile       ← Image Node.js production
│
├── db/
│   └── init.sql         ← Script d'initialisation MySQL
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml    ← Pipeline GitHub Actions
│
├── docker-compose.yml   ← Orchestration des 3 services
└── .env.example         ← Modèle des variables d'environnement
```

---

## 2. Conteneurisation avec Docker

### Principe du build multi-stage

Le build multi-stage permet d'obtenir des images de production **légères et sécurisées** en séparant l'environnement de build de l'environnement d'exécution.

### Image Frontend — `client/Dockerfile`

```
┌─────────────────────────────────┐
│  Stage 1 : BUILDER              │
│  node:20-alpine                  │
│  → npm ci                        │
│  → npm run build                 │
│  → Génère /app/build (assets)    │
└──────────────┬──────────────────┘
               │ COPY --from=builder
               ▼
┌─────────────────────────────────┐
│  Stage 2 : PRODUCTION           │
│  nginx:1.25-alpine              │
│  → Copie /app/build             │
│  → nginx.conf (proxy + SPA)     │
│  → Expose port 80               │
│  Taille finale : ~25 MB         │
└─────────────────────────────────┘
```

**Bénéfices :**

- L'image finale ne contient **pas** Node.js ni les outils de build
- Taille réduite : ~25 MB au lieu de ~400 MB
- Surface d'attaque minimisée

### Image Backend — `server/Dockerfile`

```
┌─────────────────────────────────┐
│  Stage 1 : BUILDER              │
│  node:20-alpine                  │
│  → npm ci --omit=dev             │
│    (sans devDependencies)        │
└──────────────┬──────────────────┘
               │ COPY --from=builder
               ▼
┌─────────────────────────────────┐
│  Stage 2 : PRODUCTION           │
│  node:20-alpine                  │
│  → Utilisateur non-root (propax) │
│  → Healthcheck intégré           │
│  → Expose port 5000              │
│  Taille finale : ~120 MB         │
└─────────────────────────────────┘
```

**Mesures de sécurité :**

- Exécution sous un **utilisateur non-root** (`propax`)
- Seules les dépendances de production sont incluses
- Healthcheck natif Docker

---

## 3. Orchestration avec Docker Compose

### Les 3 services

```
                    ┌─────────────────────────────────────────┐
                    │           RÉSEAU propax-network          │
                    │                                          │
   http:80          │  ┌──────────┐    /api/*    ┌──────────┐ │
  ──────────────────►  │ FRONTEND │─────────────►│ BACKEND  │ │
   (navigateur)     │  │  Nginx   │   proxy_pass │ Express  │ │
                    │  │  port 80 │              │ port 5000│ │
                    │  └──────────┘              └────┬─────┘ │
                    │                                 │ mysql2 │
                    │                          ┌──────▼─────┐  │
                    │                          │    DB      │  │
                    │                          │  MySQL 8   │  │
                    │                          │ port 3306  │  │
                    │                          └────────────┘  │
                    └─────────────────────────────────────────┘
                                                    │
                                              mysql_data
                                             (volume persistant)
```

### Gestion des dépendances entre services

Les services démarrent dans l'ordre grâce aux `healthchecks` :

```
db (healthy) → backend (healthy) → frontend (running)
```

Sans healthcheck, le backend démarrerait avant que MySQL soit prêt, causant des erreurs de connexion.

### Variables d'environnement

Les secrets sont passés au runtime via un fichier `.env` (jamais versionné) :

```bash
# Copier et remplir le fichier
cp .env.example .env
nano .env
```

---

## 4. Pipeline CI/CD avec GitHub Actions

### Vue d'ensemble

```
Code Push
    │
    ▼
┌───────────────────────────────────────────────────────┐
│                    GitHub Actions                      │
│                                                        │
│  JOB 1 : CI (tous les push + PR)                      │
│  ─────────────────────────────────────────────────    │
│  ① Checkout du code                                    │
│  ② Setup Node.js 20                                    │
│  ③ npm ci (client)                                     │
│  ④ ESLint (via react-scripts build)                    │
│  ⑤ npm test --watchAll=false (client)                  │
│  ⑥ npm ci (server)                                     │
│  ⑦ npm test (server)                                   │
│  ⑧ docker build frontend (vérification)               │
│  ⑨ docker build backend (vérification)                │
│                          │                             │
│                          │ CI réussit ?               │
│                          │ + branche = main ?         │
│                          ▼                             │
│  JOB 2 : CD (push main uniquement)                    │
│  ─────────────────────────────────────────────────    │
│  ① docker login GHCR                                   │
│  ② Build + Push image frontend (SHA + latest)         │
│  ③ Build + Push image backend  (SHA + latest)         │
│  ④ SSH → serveur prod :                               │
│       git pull                                         │
│       docker pull (nouvelles images)                   │
│       docker compose up -d                             │
│       docker image prune                               │
│                          │                             │
│  JOB 3 : Notification (résumé dans GitHub)            │
└───────────────────────────────────────────────────────┘
```

### Tagging des images Docker

Chaque image est taguée avec **deux identifiants** :

- `:latest` → pointe toujours vers la dernière version stable
- `:<git-sha>` → identifiant unique et immuable du commit (traçabilité, rollback)

```bash
# Exemple de rollback vers une version précédente
docker pull ghcr.io/monuser/propax-backend:abc123def
docker compose up -d --no-build
```

### Secrets GitHub requis

À configurer dans **Settings > Secrets and variables > Actions** :

| Secret         | Description                            |
| -------------- | -------------------------------------- |
| `PROD_HOST`    | IP ou domaine du serveur de production |
| `PROD_USER`    | Utilisateur SSH du serveur             |
| `PROD_SSH_KEY` | Clé privée SSH (ED25519 recommandé)    |

Le `GITHUB_TOKEN` est automatiquement disponible (accès GHCR).

---

## 5. Stratégie de branches Git

### Git Flow simplifié

```
main ──────────────────────────────────────────► (production)
  │                                  ▲
  │           merge (PR validée)     │
  └─── develop ──────────────────────┘
           │              ▲
           │  merge       │
           └── feature/xxx ──────────
```

| Branche       | Rôle                        | CI         | CD              |
| ------------- | --------------------------- | ---------- | --------------- |
| `main`        | Code de production stable   | ✓          | ✓ (deploy prod) |
| `develop`     | Intégration des features    | ✓          | ✗               |
| `feature/xxx` | Développement d'une feature | ✓ (sur PR) | ✗               |

### Règles recommandées

- **Aucun push direct** sur `main` (protection de branche activée)
- Toute modification passe par une **Pull Request**
- La PR doit passer les **checks CI** avant le merge
- 1 review minimum recommandée

---

## 6. Sécurité et bonnes pratiques

### Sécurité des images Docker

| Pratique                       | Implémentation                              |
| ------------------------------ | ------------------------------------------- |
| Images de base légères         | `alpine` (diminue la surface d'attaque)     |
| Utilisateur non-root           | `adduser propax` dans le Dockerfile backend |
| Fichiers sensibles exclus      | `.dockerignore` (node_modules, .env, logs)  |
| Dépendances de prod uniquement | `npm ci --omit=dev`                         |
| Scanning de vulnérabilités     | À ajouter : `docker scout` ou `trivy`       |

### Sécurité des secrets

- Le fichier `.env` n'est **jamais** commité (ajouté au `.gitignore`)
- Les secrets de production sont stockés dans **GitHub Secrets**
- Les mots de passe MySQL sont générés aléatoirement et complexes

### Headers de sécurité Nginx

Configurés dans `nginx.conf` :

- `X-Frame-Options: SAMEORIGIN` → Protection contre le clickjacking
- `X-Content-Type-Options: nosniff` → Protection contre le MIME sniffing
- `X-XSS-Protection: 1; mode=block` → Protection XSS navigateur
- `Referrer-Policy: strict-origin-when-cross-origin`

---

## 7. Environnements

| Environnement     | Déclencheur    | Cible                 |
| ----------------- | -------------- | --------------------- |
| **Développement** | `npm run dev`  | localhost:3000 / 5000 |
| **Staging**       | Push `develop` | serveur de pré-prod   |
| **Production**    | Push `main`    | serveur public        |

### Lancer localement avec Docker

```bash
# 1. Préparer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# 2. Démarrer tous les services
docker compose up --build

# 3. Accéder à l'application
# Frontend : http://localhost
# API      : http://localhost/api/offers
# API direct : http://localhost:5000/api/test
```

---

## 8. Commandes utiles

### Docker Compose

```bash
# Démarrer tous les services (en arrière-plan)
docker compose up -d

# Démarrer avec rebuild des images
docker compose up --build -d

# Voir les logs en temps réel
docker compose logs -f

# Logs d'un service spécifique
docker compose logs -f backend

# Arrêter les services
docker compose down

# Arrêter + supprimer les volumes (ATTENTION : efface la BDD)
docker compose down -v

# Statut des containers
docker compose ps

# Entrer dans un container
docker compose exec backend sh
docker compose exec db mysql -u propax_user -p propax_db
```

### Docker (images)

```bash
# Lister les images locales
docker images | grep propax

# Supprimer les images inutilisées
docker image prune -f

# Inspecter une image
docker inspect ghcr.io/monuser/propax-backend:latest

# Scanner les vulnérabilités (si docker scout disponible)
docker scout cves ghcr.io/monuser/propax-backend:latest
```

### GitHub Actions

```bash
# Simuler le pipeline localement avec Act
# (https://github.com/nektos/act)
act push --secret-file .env
```

---

## 9. Schéma global du pipeline

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FLUX DEVOPS PROPAX                           │
│                                                                     │
│  DÉVELOPPEUR                                                        │
│      │                                                              │
│      │  git push / Pull Request                                     │
│      ▼                                                              │
│  ┌─────────┐                                                        │
│  │  GitHub │                                                        │
│  │  Repo   │                                                        │
│  └────┬────┘                                                        │
│       │  Webhook                                                    │
│       ▼                                                             │
│  ┌────────────────────────────────────────────────────┐            │
│  │            GITHUB ACTIONS (Runner Ubuntu)           │            │
│  │                                                     │            │
│  │  ① Checkout  ② Install  ③ Test  ④ Build Docker     │            │
│  │                                                     │            │
│  │       (si main) ⑤ Push GHCR  ⑥ Deploy SSH          │            │
│  └────────────────────────────────────────────────────┘            │
│                           │           │                             │
│                           ▼           ▼                             │
│                    ┌──────────┐  ┌──────────┐                      │
│                    │   GHCR   │  │  SERVEUR │                      │
│                    │ Registry │  │   PROD   │                      │
│                    │ (images) │  │(docker   │                      │
│                    └──────────┘  │ compose) │                      │
│                                  └──────────┘                      │
│                                       │                             │
│                                       ▼                             │
│                               ┌───────────────┐                    │
│                               │  APPLICATION  │                    │
│                               │  EN LIGNE     │                    │
│                               │               │                    │
│                               │ [Nginx:80]    │                    │
│                               │ [Express:5000]│                    │
│                               │ [MySQL:3306]  │                    │
│                               └───────────────┘                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Points clés à retenir pour la présentation

1. **Infrastructure as Code** : Toute l'infrastructure est décrite dans des fichiers versionnés (`Dockerfile`, `docker-compose.yml`, `ci-cd.yml`)
2. **Reproductibilité** : Le même conteneur tourne en développement, en staging et en production — élimine le « ça marche sur ma machine »
3. **Automatisation** : Zéro intervention manuelle entre un `git push` sur `main` et la mise en production
4. **Traçabilité** : Chaque image Docker est taguée avec le SHA du commit → rollback immédiat possible
5. **Sécurité** : Utilisateur non-root, secrets non versionnés, headers HTTP sécurisés, images Alpine légères
6. **Résilience** : Healthchecks sur chaque service, `restart: unless-stopped`, volumes persistants pour les données
