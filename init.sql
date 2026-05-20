CREATE DATABASE IF NOT EXISTS gestion_formations
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE gestion_formations;


CREATE TABLE IF NOT EXISTS admins (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  nom      VARCHAR(100) NOT NULL,
  email    VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role     ENUM('admin') DEFAULT 'admin',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS etudiants (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  nom      VARCHAR(100) NOT NULL,
  prenom   VARCHAR(100) NOT NULL,
  email    VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role     ENUM('etudiant') DEFAULT 'etudiant',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS formations (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(200) NOT NULL,
  duree VARCHAR(50)  NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS inscriptions (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  etudiant_id  INT NOT NULL,
  formation_id INT NOT NULL,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_inscription (etudiant_id),
  FOREIGN KEY (etudiant_id)  REFERENCES etudiants(id) ON DELETE CASCADE,
  FOREIGN KEY (formation_id) REFERENCES formations(id) ON DELETE CASCADE
);


INSERT INTO admins (nom, email, password) VALUES
  ('Administrateur', 'admin@formations.ma',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhu2');


INSERT INTO formations (titre, duree) VALUES
  ('Développement Web Full-Stack',    '6 mois'),
  ('Intelligence Artificielle',       '4 mois'),
  ('DevOps & Cloud',                  '3 mois'),
  ('Cybersécurité',                   '5 mois'),
  ('Mobile React Native',             '3 mois');

