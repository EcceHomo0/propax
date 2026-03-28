-- ============================================================
--  PROPAX – Gestion des droits et rôles utilisateurs (MySQL)
--  Thème : sécurité et contrôle d'accès à la base de données
-- ============================================================
--
--  Trois rôles distincts sont modélisés :
--    1. propax_visiteur     → lecture seule sur les offres (anonyme)
--    2. propax_interimaire  → consultation + gestion de ses propres candidatures
--    3. propax_employe      → accès complet (CRUD) sur toutes les tables
--
-- ============================================================


-- ============================================================
--  1. STRUCTURE DE LA BASE DE DONNÉES
-- ============================================================

CREATE DATABASE IF NOT EXISTS propax
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE propax;

-- Compte utilisateur commun à tous les profils
CREATE TABLE IF NOT EXISTS UTILISATEUR (
    id_utilisateur INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    email          VARCHAR(50)  UNIQUE NOT NULL,
    mot_de_passe   VARCHAR(255) NOT NULL,          -- hashé avec bcrypt
    nom            VARCHAR(50),
    prenom         VARCHAR(50)
) ENGINE=InnoDB;

-- Employés de l'agence
CREATE TABLE IF NOT EXISTS EMPLOYE (
    id_utilisateur INT PRIMARY KEY NOT NULL,
    matricule      VARCHAR(50),
    CONSTRAINT fk_employe_user FOREIGN KEY (id_utilisateur)
        REFERENCES UTILISATEUR(id_utilisateur) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Utilisateurs connectés
CREATE TABLE IF NOT EXISTS UTILISATEUR_CONNECTE (
    id_utilisateur INT PRIMARY KEY NOT NULL,
    telephone      VARCHAR(20),
    cv             VARCHAR(100),
    disponibilite  VARCHAR(100),
    date_inscription DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_connecte_user FOREIGN KEY (id_utilisateur)
        REFERENCES UTILISATEUR(id_utilisateur) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Intérimaires inscrits sur la plateforme
CREATE TABLE IF NOT EXISTS INTERIMAIRE (
    id_utilisateur      INT PRIMARY KEY NOT NULL,
    numero_interimaire  VARCHAR(20),
    date_entree_agence  DATETIME,
    CONSTRAINT fk_interimaire_connecte FOREIGN KEY (id_utilisateur)
        REFERENCES UTILISATEUR_CONNECTE(id_utilisateur) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Entreprises clientes
CREATE TABLE IF NOT EXISTS ENTREPRISE_CLIENTE (
    id_entreprise INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    nom           VARCHAR(100),
    adresse       VARCHAR(255),
    activite      VARCHAR(100),
    description   TEXT,
    contact       VARCHAR(100),
    email         VARCHAR(50),
    telephone     VARCHAR(20)
) ENGINE=InnoDB;

-- Offres d'emploi publiées par l'agence
CREATE TABLE IF NOT EXISTS OFFRE (
    id_offre       INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    intitule       VARCHAR(100),
    type_contrat   VARCHAR(20),
    duree_contrat  VARCHAR(20),
    lieu_mission   VARCHAR(100),
    niveau_etudes  VARCHAR(20),
    experience     VARCHAR(50),
    salaire        DECIMAL(6,2),
    missions       TEXT,
    date_creation  DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_entreprise  INT NOT NULL,
    CONSTRAINT fk_offre_entreprise FOREIGN KEY (id_entreprise)
        REFERENCES ENTREPRISE_CLIENTE(id_entreprise)
) ENGINE=InnoDB;

-- Alertes / recherches sauvegardées
CREATE TABLE IF NOT EXISTS ALERTE (
    id_alerte      INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    intitule_poste VARCHAR(100),
    lieu_recherche VARCHAR(100),
    id_utilisateur INT NOT NULL,
    CONSTRAINT fk_alerte_user FOREIGN KEY (id_utilisateur)
        REFERENCES UTILISATEUR_CONNECTE(id_utilisateur)
) ENGINE=InnoDB;

-- Candidatures (relation offre – utilisateur connecté)
CREATE TABLE IF NOT EXISTS CANDIDATURE (
    id_candidature   INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    message          TEXT,
    cv               VARCHAR(100),
    lettre_motivation VARCHAR(100),
    statut           VARCHAR(20),
    date_candidature DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_offre         INT NOT NULL,
    id_utilisateur   INT NOT NULL,
    CONSTRAINT fk_cand_offre FOREIGN KEY (id_offre)
        REFERENCES OFFRE(id_offre),
    CONSTRAINT fk_cand_user FOREIGN KEY (id_utilisateur)
        REFERENCES UTILISATEUR_CONNECTE(id_utilisateur)
) ENGINE=InnoDB;

-- Contrats de mission
CREATE TABLE IF NOT EXISTS CONTRAT (
    id_contrat    INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    designation   VARCHAR(100),
    date_debut    DATETIME,
    date_fin      DATETIME,
    lieu_mission  VARCHAR(100),
    salaire       DECIMAL(10,2),
    statut        VARCHAR(10),
    id_offre      INT,
    id_utilisateur INT NOT NULL,
    CONSTRAINT fk_contrat_offre   FOREIGN KEY (id_offre)       REFERENCES OFFRE(id_offre),
    CONSTRAINT fk_contrat_interim FOREIGN KEY (id_utilisateur) REFERENCES INTERIMAIRE(id_utilisateur)
) ENGINE=InnoDB;

-- Bulletins de salaire
CREATE TABLE IF NOT EXISTS BULLETIN_DE_SALAIRE (
    id_bulletin    INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    periode        VARCHAR(100),
    salaire_brut   DECIMAL(10,2),
    salaire_net    DECIMAL(10,2),
    date_paiement  DATETIME,
    fichier        VARCHAR(100),
    id_utilisateur INT NOT NULL,
    CONSTRAINT fk_bulletin_interim FOREIGN KEY (id_utilisateur) REFERENCES INTERIMAIRE(id_utilisateur)
) ENGINE=InnoDB;

-- Demandes d'acompte
CREATE TABLE IF NOT EXISTS DEMANDE_ACCOMPTE (
    id_accompte    INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    montant        DECIMAL(10,2),
    statut         VARCHAR(10),
    date_demande   DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_utilisateur INT NOT NULL,
    CONSTRAINT fk_accompte_interim FOREIGN KEY (id_utilisateur) REFERENCES INTERIMAIRE(id_utilisateur)
) ENGINE=InnoDB;

-- Table de jointure : gestion des offres par les employés
CREATE TABLE IF NOT EXISTS gerer (
    id_utilisateur INT NOT NULL,
    id_offre       INT NOT NULL,
    PRIMARY KEY (id_utilisateur, id_offre),
    CONSTRAINT fk_gerer_emp  FOREIGN KEY (id_utilisateur) REFERENCES EMPLOYE(id_utilisateur),
    CONSTRAINT fk_gerer_offre FOREIGN KEY (id_offre)      REFERENCES OFFRE(id_offre)
) ENGINE=InnoDB;


-- ============================================================
--  2. CRÉATION DES UTILISATEURS MySQL
-- ============================================================
-- Note : en développement/démonstration, des mots de passe simples suffisent.
-- En production, activer le plugin validate_password (MySQL 8+) impose
-- une complexité minimale (majuscule, chiffre, caractère spécial).

-- Visiteur
CREATE USER IF NOT EXISTS 'propax_visiteur'@'%'
    IDENTIFIED BY 'Visiteur@2026!';

-- Intérimaire
CREATE USER IF NOT EXISTS 'propax_interimaire'@'%'
    IDENTIFIED BY 'Interimaire@2026!';

-- Employé de l'agence
CREATE USER IF NOT EXISTS 'propax_employe'@'%'
    IDENTIFIED BY 'Employe@2026!';


-- ============================================================
--  3. ATTRIBUTION DES DROITS (GRANT)
-- ============================================================

-- ----- VISITEUR -----
-- Peut uniquement consulter les offres.
GRANT SELECT ON propax.OFFRE
    TO 'propax_visiteur'@'%';

-- ----- INTÉRIMAIRE -----
-- Peut consulter les offres.
GRANT SELECT ON propax.OFFRE
    TO 'propax_interimaire'@'%';

-- Peut créer une candidature et consulter les siennes
-- (filtrées via la vue v_mes_candidatures).
GRANT SELECT, INSERT ON propax.CANDIDATURE
    TO 'propax_interimaire'@'%';

-- Peut lire et mettre à jour son propre profil (pas CREATE ni DELETE).
GRANT SELECT, UPDATE ON propax.UTILISATEUR
    TO 'propax_interimaire'@'%';

GRANT SELECT, UPDATE ON propax.UTILISATEUR_CONNECTE
    TO 'propax_interimaire'@'%';

GRANT SELECT ON propax.INTERIMAIRE
    TO 'propax_interimaire'@'%';

-- Peut consulter ses contrats et bulletins, et faire des demandes d'acompte.
GRANT SELECT ON propax.CONTRAT
    TO 'propax_interimaire'@'%';

GRANT SELECT ON propax.BULLETIN_DE_SALAIRE
    TO 'propax_interimaire'@'%';

GRANT SELECT, INSERT ON propax.DEMANDE_ACCOMPTE
    TO 'propax_interimaire'@'%';

-- ----- EMPLOYÉ DE L'AGENCE -----
-- Accès complet (CRUD) sur l'ensemble des tables métier.
GRANT SELECT, INSERT, UPDATE, DELETE ON propax.OFFRE
    TO 'propax_employe'@'%';

GRANT SELECT, INSERT, UPDATE, DELETE ON propax.CANDIDATURE
    TO 'propax_employe'@'%';

GRANT SELECT, INSERT, UPDATE, DELETE ON propax.UTILISATEUR
    TO 'propax_employe'@'%';

GRANT SELECT, INSERT, UPDATE, DELETE ON propax.UTILISATEUR_CONNECTE
    TO 'propax_employe'@'%';

GRANT SELECT, INSERT, UPDATE, DELETE ON propax.INTERIMAIRE
    TO 'propax_employe'@'%';

GRANT SELECT, INSERT, UPDATE, DELETE ON propax.ENTREPRISE_CLIENTE
    TO 'propax_employe'@'%';

GRANT SELECT, INSERT, UPDATE, DELETE ON propax.CONTRAT
    TO 'propax_employe'@'%';

GRANT SELECT, INSERT, UPDATE, DELETE ON propax.BULLETIN_DE_SALAIRE
    TO 'propax_employe'@'%';

GRANT SELECT, INSERT, UPDATE, DELETE ON propax.DEMANDE_ACCOMPTE
    TO 'propax_employe'@'%';

GRANT SELECT, INSERT, UPDATE, DELETE ON propax.gerer
    TO 'propax_employe'@'%';

-- Application immédiate des privilèges
FLUSH PRIVILEGES;


-- ============================================================
--  4. VUE SÉCURISÉE : isolation des candidatures par intérimaire
-- ============================================================
-- Principe de moindre privilège appliqué au niveau des données :
-- chaque intérimaire ne voit QUE ses propres candidatures,
-- jamais celles des autres candidats.
--
-- Prérequis : cette vue fonctionne uniquement si chaque intérimaire
-- se connecte à MySQL avec un compte dont le nom est son adresse e-mail
-- (ex : CREATE USER 'jean@dupont.fr'@'%' ...).
-- CURRENT_USER() retourne 'nom_compte@host' ; SUBSTRING_INDEX(..., '@', 1)
-- en extrait la partie avant le premier @, soit le nom du compte MySQL,
-- qui doit donc correspondre à l'e-mail stocké dans UTILISATEUR.
--
-- Dans une architecture avec pool de connexions partagé (cas courant en
-- production), l'isolation est assurée côté application via un token JWT
-- et des requêtes paramétrées (WHERE id_utilisateur = ?).

CREATE OR REPLACE VIEW v_mes_candidatures AS
SELECT
    c.id_candidature                        AS candidature_id,
    o.intitule                              AS offre_intitule,
    o.type_contrat,
    o.lieu_mission,
    c.statut,
    c.date_candidature
FROM CANDIDATURE c
JOIN OFFRE o ON o.id_offre = c.id_offre
WHERE c.id_utilisateur = (
    -- Résolution de l'intérimaire connecté via son e-mail (= nom du compte MySQL)
    SELECT id_utilisateur
    FROM UTILISATEUR
    WHERE email = SUBSTRING_INDEX(CURRENT_USER(), '@', 1)
);


-- ============================================================
--  5. TABLEAU RÉCAPITULATIF DES DROITS
-- ============================================================
--
--  Action                            | visiteur | intérimaire | employé
--  ---------------------------------|----------|-------------|--------
--  Consulter les offres              |   OUI    |     OUI     |   OUI
--  Postuler à une offre              |   NON    |     OUI     |   OUI
--  Voir ses candidatures             |   NON    |   OUI (*)   |   OUI
--  Voir les candidatures des autres  |   NON    |     NON     |   OUI
--  Modifier son profil               |   NON    |   OUI (*)   |   OUI
--  Créer / modifier une offre        |   NON    |     NON     |   OUI
--  Voir ses contrats / bulletins     |   NON    |   OUI (*)   |   OUI
--  Faire une demande d'acompte       |   NON    |     OUI     |   OUI
--  Gérer les offres (table gerer)    |   NON    |     NON     |   OUI
--  Supprimer des données             |   NON    |     NON     |   OUI
--
--  (*) limité à ses propres données grâce à la vue v_mes_candidatures
--      et aux requêtes paramétrées côté application (WHERE id_utilisateur = ?)


-- ============================================================
--  6. RÉVOCATION DE DROITS (exemple)
-- ============================================================
-- Si un intérimaire est suspendu, on révoque ses accès
-- sans supprimer son compte ni ses données :

REVOKE SELECT, INSERT ON propax.CANDIDATURE         FROM 'propax_interimaire'@'%';
REVOKE SELECT, UPDATE ON propax.UTILISATEUR          FROM 'propax_interimaire'@'%';
REVOKE SELECT, UPDATE ON propax.UTILISATEUR_CONNECTE FROM 'propax_interimaire'@'%';
REVOKE SELECT          ON propax.INTERIMAIRE          FROM 'propax_interimaire'@'%';
REVOKE SELECT          ON propax.CONTRAT              FROM 'propax_interimaire'@'%';
REVOKE SELECT          ON propax.BULLETIN_DE_SALAIRE  FROM 'propax_interimaire'@'%';
REVOKE SELECT, INSERT  ON propax.DEMANDE_ACCOMPTE     FROM 'propax_interimaire'@'%';
FLUSH PRIVILEGES;

-- Pour réactiver le compte :
-- GRANT SELECT, INSERT ON propax.CANDIDATURE         TO 'propax_interimaire'@'%';
-- GRANT SELECT, UPDATE ON propax.UTILISATEUR          TO 'propax_interimaire'@'%';
-- GRANT SELECT, UPDATE ON propax.UTILISATEUR_CONNECTE TO 'propax_interimaire'@'%';
-- GRANT SELECT          ON propax.INTERIMAIRE          TO 'propax_interimaire'@'%';
-- GRANT SELECT          ON propax.CONTRAT              TO 'propax_interimaire'@'%';
-- GRANT SELECT          ON propax.BULLETIN_DE_SALAIRE  TO 'propax_interimaire'@'%';
-- GRANT SELECT, INSERT  ON propax.DEMANDE_ACCOMPTE     TO 'propax_interimaire'@'%';
-- FLUSH PRIVILEGES;
