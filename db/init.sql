-- ============================================================
-- init.sql - Initialisation de la base de données Propax
-- Ce fichier est exécuté automatiquement par le conteneur MySQL
-- au premier démarrage (docker-entrypoint-initdb.d)
-- La base et l'utilisateur sont déjà créés par les variables
-- d'environnement MYSQL_DATABASE / MYSQL_USER dans docker-compose.
-- ============================================================

-- Table UTILISATEUR
CREATE TABLE IF NOT EXISTS UTILISATEUR (
    id_utilisateur INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    nom VARCHAR(50),
    prenom VARCHAR(50)
) ENGINE=InnoDB;

-- Table EMPLOYE
CREATE TABLE IF NOT EXISTS EMPLOYE (
    id_utilisateur INT PRIMARY KEY NOT NULL,
    matricule VARCHAR(50),
    CONSTRAINT fk_employe_user FOREIGN KEY (id_utilisateur)
        REFERENCES UTILISATEUR(id_utilisateur) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table UTILISATEUR_CONNECTE
CREATE TABLE IF NOT EXISTS UTILISATEUR_CONNECTE (
    id_utilisateur INT PRIMARY KEY NOT NULL,
    telephone VARCHAR(20),
    cv VARCHAR(100),
    disponibilite VARCHAR(100),
    date_inscription DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_connecte_user FOREIGN KEY (id_utilisateur)
        REFERENCES UTILISATEUR(id_utilisateur) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table INTERIMAIRE
CREATE TABLE IF NOT EXISTS INTERIMAIRE (
    id_utilisateur INT PRIMARY KEY NOT NULL,
    numero_interimaire VARCHAR(20),
    date_entree_agence DATETIME,
    CONSTRAINT fk_interimaire_connecte FOREIGN KEY (id_utilisateur)
        REFERENCES UTILISATEUR_CONNECTE(id_utilisateur) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table ENTREPRISE_CLIENTE
CREATE TABLE IF NOT EXISTS ENTREPRISE_CLIENTE (
    id_entreprise INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    nom VARCHAR(100),
    adresse VARCHAR(255),
    activite VARCHAR(100),
    description TEXT,
    contact VARCHAR(100),
    email VARCHAR(50),
    telephone VARCHAR(20)
) ENGINE=InnoDB;

-- Table OFFRE
CREATE TABLE IF NOT EXISTS OFFRE (
    id_offre INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    intitule VARCHAR(100),
    type_contrat VARCHAR(20),
    duree_contrat VARCHAR(20),
    lieu_mission VARCHAR(100),
    niveau_etudes VARCHAR(20),
    experience VARCHAR(50),
    salaire DECIMAL(6,2),
    missions TEXT,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_entreprise INT NOT NULL,
    CONSTRAINT fk_offre_entreprise FOREIGN KEY (id_entreprise)
        REFERENCES ENTREPRISE_CLIENTE(id_entreprise)
) ENGINE=InnoDB;

-- Table ALERTE
CREATE TABLE IF NOT EXISTS ALERTE (
    id_alerte INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    intitule_poste VARCHAR(100),
    lieu_recherche VARCHAR(100),
    id_utilisateur INT NOT NULL,
    CONSTRAINT fk_alerte_user FOREIGN KEY (id_utilisateur)
        REFERENCES UTILISATEUR_CONNECTE(id_utilisateur)
) ENGINE=InnoDB;

-- Table CANDIDATURE
CREATE TABLE IF NOT EXISTS CANDIDATURE (
    id_candidature INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    message TEXT,
    cv VARCHAR(100),
    lettre_motivation VARCHAR(100),
    statut VARCHAR(20),
    date_candidature DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_offre INT NOT NULL,
    id_utilisateur INT NOT NULL,
    CONSTRAINT fk_cand_offre FOREIGN KEY (id_offre) REFERENCES OFFRE(id_offre),
    CONSTRAINT fk_cand_user FOREIGN KEY (id_utilisateur) REFERENCES UTILISATEUR_CONNECTE(id_utilisateur)
) ENGINE=InnoDB;

-- Table CONTRAT
CREATE TABLE IF NOT EXISTS CONTRAT (
    id_contrat INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    designation VARCHAR(100),
    date_debut DATETIME,
    date_fin DATETIME,
    lieu_mission VARCHAR(100),
    salaire DECIMAL(10,2),
    statut VARCHAR(10),
    id_offre INT,
    id_utilisateur INT NOT NULL,
    CONSTRAINT fk_contrat_offre FOREIGN KEY (id_offre) REFERENCES OFFRE(id_offre),
    CONSTRAINT fk_contrat_interim FOREIGN KEY (id_utilisateur) REFERENCES INTERIMAIRE(id_utilisateur)
) ENGINE=InnoDB;

-- Table BULLETIN_DE_SALAIRE
CREATE TABLE IF NOT EXISTS BULLETIN_DE_SALAIRE (
    id_bulletin INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    periode VARCHAR(100),
    salaire_brut DECIMAL(10,2),
    salaire_net DECIMAL(10,2),
    date_paiement DATETIME,
    fichier VARCHAR(100),
    id_utilisateur INT NOT NULL,
    CONSTRAINT fk_bulletin_interim FOREIGN KEY (id_utilisateur) REFERENCES INTERIMAIRE(id_utilisateur)
) ENGINE=InnoDB;

-- Table DEMANDE_ACCOMPTE
CREATE TABLE IF NOT EXISTS DEMANDE_ACCOMPTE (
    id_accompte INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    montant DECIMAL(10,2),
    statut VARCHAR(10),
    date_demande DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_utilisateur INT NOT NULL,
    CONSTRAINT fk_accompte_interim FOREIGN KEY (id_utilisateur) REFERENCES INTERIMAIRE(id_utilisateur)
) ENGINE=InnoDB;

-- Table de jointure : gerer
CREATE TABLE IF NOT EXISTS gerer (
    id_utilisateur INT NOT NULL,
    id_offre INT NOT NULL,
    PRIMARY KEY (id_utilisateur, id_offre),
    CONSTRAINT fk_gerer_emp FOREIGN KEY (id_utilisateur) REFERENCES EMPLOYE(id_utilisateur),
    CONSTRAINT fk_gerer_offre FOREIGN KEY (id_offre) REFERENCES OFFRE(id_offre)
) ENGINE=InnoDB;

-- Données initiales
INSERT INTO ENTREPRISE_CLIENTE (nom, adresse, activite) VALUES ('GriaCad', 'Saint-Domingue', 'Ressources Humaines');
