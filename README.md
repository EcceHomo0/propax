# Propax - Plateforme de gestion des offres d'emploi

Application fullstack développée avec React et Node.js pour la gestion des offres d'emploi.

## 🏗️ Structure du projet

```
propax/
├── package.json          # Scripts globaux du monorepo
├── client/              # Frontend React
│   ├── src/
│   │   ├── components/  # Composants React
│   │   ├── pages/      # Pages de l'application
│   │   └── styles/     # Fichiers CSS
│   └── package.json
├── server/              # Backend Node.js
│   ├── routes/         # Routes API
│   ├── db.js           # Configuration base de données
│   ├── server.js       # Serveur Express
│   └── package.json
└── README.md           # Documentation principale
```

## 🚀 Installation et démarrage

### Installation complète

```bash
npm run install-all
```

### Démarrage en développement

```bash
# Lance frontend + backend simultanément
npm run dev

# Ou séparément :
npm run client  # Frontend sur http://localhost:3000
npm run server  # Backend sur http://localhost:5000
```

## 📋 Prérequis

- **Node.js** (version 16+)
- **MySQL** (base de données)
- **npm** ou **yarn**

## 🗄️ Configuration base de données

1. Installer MySQL
2. Créer la base de données `propax`
3. Configurer le fichier `server/.env` :

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=propax
```

4. Créer la table `offre` :

```sql
CREATE TABLE offre (
  id INT AUTO_INCREMENT PRIMARY KEY,
  intitule VARCHAR(255) NOT NULL,
  type_contrat VARCHAR(100) NOT NULL,
  duree_contrat VARCHAR(100) NOT NULL,
  lieu_mission VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎯 Fonctionnalités

- ✅ Ajout d'offres d'emploi
- ✅ Connexion base de données MySQL
- ✅ API RESTful
- ✅ Interface React responsive

## 🔧 Scripts disponibles

| Commande              | Description                     |
| --------------------- | ------------------------------- |
| `npm run dev`         | Lance frontend + backend        |
| `npm run client`      | Lance uniquement le frontend    |
| `npm run server`      | Lance uniquement le backend     |
| `npm run build`       | Build de production             |
| `npm run install-all` | Installe toutes les dépendances |
| `npm run clean`       | Supprime tous les node_modules  |
| `npm run reset`       | Clean + install complet         |

## 📡 API Endpoints

### Offres d'emploi

- `GET /api/offers` - Récupérer toutes les offres
- `POST /api/offers` - Créer une nouvelle offre

## 🌐 Accès application

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **API Test**: http://localhost:5000/api/test

## 🎓 Contexte

Projet de formation CDA (Concepteur Développeur d'Applications) - ADRAR
