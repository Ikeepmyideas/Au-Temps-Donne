-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : dim. 12 mai 2024 à 02:17
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `pa`
--

-- --------------------------------------------------------

--
-- Structure de la table `activites`
--

CREATE TABLE `activites` (
  `ID_Activite` int(11) NOT NULL,
  `description` text NOT NULL,
  `date_activite` date NOT NULL,
  `heure_debut` time NOT NULL,
  `heure_fin` time DEFAULT NULL,
  `titre` varchar(100) NOT NULL,
  `id_lieu` int(11) DEFAULT NULL,
  `nom_service` varchar(100) DEFAULT NULL,
  `nb_benevoles` int(11) DEFAULT 0,
  `date_create` timestamp NOT NULL DEFAULT current_timestamp(),
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `activites_prives`
--

CREATE TABLE `activites_prives` (
  `ID_Activite` int(11) NOT NULL,
  `description` text NOT NULL,
  `date_activite` date NOT NULL,
  `heure_debut` time NOT NULL,
  `heure_fin` time DEFAULT NULL,
  `titre` varchar(100) NOT NULL,
  `id_lieu` int(11) DEFAULT NULL,
  `nom_service` varchar(100) DEFAULT NULL,
  `id_beneficiaire` int(11) DEFAULT NULL,
  `id_benevole` int(11) DEFAULT NULL,
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `administrateurs`
--

CREATE TABLE `administrateurs` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `beneficiaires`
--

CREATE TABLE `beneficiaires` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `ville` varchar(255) DEFAULT NULL,
  `code_postal` char(5) DEFAULT NULL,
  `telephone` varchar(15) DEFAULT NULL,
  `besoin` text DEFAULT NULL,
  `avis_impot` varchar(255) DEFAULT NULL,
  `statut_validation` varchar(50) DEFAULT NULL,
  `date_inscription` date DEFAULT current_timestamp(),
  `date_adhesion` date DEFAULT NULL,
  `genre` varchar(10) DEFAULT NULL,
  `date_de_naissance` date NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `benevoles`
--

CREATE TABLE `benevoles` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `date_de_naissance` date NOT NULL,
  `email` varchar(100) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `telephone` varchar(15) DEFAULT NULL,
  `competences` text DEFAULT NULL,
  `qualites` text DEFAULT NULL,
  `message_candidature` text DEFAULT NULL,
  `statut_validation` varchar(50) DEFAULT NULL,
  `casier_judiciaire` varchar(255) DEFAULT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `ville` varchar(255) DEFAULT NULL,
  `code_postal` char(5) DEFAULT NULL,
  `date_inscription` date DEFAULT current_timestamp(),
  `date_adhesion` date DEFAULT NULL,
  `genre` varchar(50) DEFAULT NULL,
  `justificatif_permis` varchar(255) DEFAULT NULL,
  `permis_conduire` varchar(3) NOT NULL,
  `langues` varchar(50) NOT NULL,
  `token_activation` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `benevole_disponibilite`
--

CREATE TABLE `benevole_disponibilite` (
  `id_benevole` int(11) NOT NULL,
  `id_disponibilite` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `blog`
--

CREATE TABLE `blog` (
  `id` int(11) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `contenu` text NOT NULL,
  `auteur` int(11) DEFAULT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `campagnes`
--

CREATE TABLE `campagnes` (
  `ID_Campagne` bigint(20) UNSIGNED NOT NULL,
  `titre` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `montant_cible` int(11) NOT NULL,
  `montant_actuel` int(11) DEFAULT 0,
  `date_debut` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_fin` timestamp NOT NULL DEFAULT current_timestamp(),
  `statut` varchar(10) DEFAULT 'actif' CHECK (`statut` in ('actif','termine'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `circuit_ramassage`
--

CREATE TABLE `circuit_ramassage` (
  `ID_Circuit` int(11) NOT NULL,
  `date_circuit` date NOT NULL,
  `ID_Route` int(11) DEFAULT NULL,
  `ID_Benevole` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `commercants_partenaire`
--

CREATE TABLE `commercants_partenaire` (
  `ID_Commercant` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `telephone` varchar(10) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `ville` varchar(50) NOT NULL,
  `code_postal` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `commercant_circuit`
--

CREATE TABLE `commercant_circuit` (
  `ID_Commercant` int(11) NOT NULL,
  `ID_Circuit` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `demandes_service`
--

CREATE TABLE `demandes_service` (
  `ID_Demande` int(11) NOT NULL,
  `id_beneficiaire` int(11) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `service` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `date_demande` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `denrees`
--

CREATE TABLE `denrees` (
  `ID_Denree` int(11) NOT NULL,
  `date_peremption` date NOT NULL,
  `quantite` int(11) NOT NULL,
  `ID_Stock` int(11) DEFAULT NULL,
  `id_commercant` int(11) DEFAULT NULL,
  `id_maraude` int(11) DEFAULT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `categorie` varchar(255) DEFAULT NULL,
  `date_ajout` date NOT NULL DEFAULT current_timestamp(),
  `statut_collecte` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `disponibilite`
--

CREATE TABLE `disponibilite` (
  `id_disponibilite` int(11) NOT NULL,
  `id_benevole` int(11) NOT NULL,
  `jour` date NOT NULL,
  `heure_debut` time NOT NULL,
  `heure_fin` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `donations`
--

CREATE TABLE `donations` (
  `ID_Donation` bigint(20) UNSIGNED NOT NULL,
  `montant` int(11) NOT NULL,
  `devise` varchar(10) NOT NULL,
  `email` varchar(255) NOT NULL,
  `id_paiement` varchar(255) NOT NULL,
  `statut` varchar(10) DEFAULT 'en_attente' CHECK (`statut` in ('en_attente','reussi','echoue')),
  `campagne_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `entrepot`
--

CREATE TABLE `entrepot` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `adresse` varchar(255) NOT NULL,
  `capacite` int(11) NOT NULL,
  `ville` varchar(255) NOT NULL,
  `code_postal` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `evenements_beneficiaires`
--

CREATE TABLE `evenements_beneficiaires` (
  `ID_Evenement_Beneficiaire` int(11) NOT NULL,
  `ID_event` int(11) NOT NULL,
  `ID_Beneficiaire` int(11) NOT NULL,
  `Date_Inscription` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `evenements_benevoles`
--

CREATE TABLE `evenements_benevoles` (
  `ID_Evenement_Benevole` int(11) NOT NULL,
  `ID_event` int(11) NOT NULL,
  `ID_Benevole` int(11) NOT NULL,
  `Date_Inscription` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `formations`
--

CREATE TABLE `formations` (
  `ID_Formation` int(11) NOT NULL,
  `titre` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `heure_debut` time DEFAULT NULL,
  `heure_fin` time DEFAULT NULL,
  `id_lieu` int(11) DEFAULT NULL,
  `date_create` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `image_profile`
--

CREATE TABLE `image_profile` (
  `ID_Image` int(11) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `ID_Admin` int(11) DEFAULT NULL,
  `ID_Benevole` int(11) DEFAULT NULL,
  `ID_Beneficiaire` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `inscriptionsformations`
--

CREATE TABLE `inscriptionsformations` (
  `id` int(11) NOT NULL,
  `id_formation` int(11) NOT NULL,
  `id_benevole` int(11) NOT NULL,
  `date_inscription` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `lieux`
--

CREATE TABLE `lieux` (
  `id_lieu` int(11) NOT NULL,
  `adresse` varchar(255) NOT NULL,
  `code_postal` varchar(5) NOT NULL,
  `ville` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `maraude`
--

CREATE TABLE `maraude` (
  `ID` int(11) NOT NULL,
  `Nom` varchar(255) NOT NULL,
  `LieuDepart` varchar(255) NOT NULL,
  `LieuArrivee` varchar(255) NOT NULL,
  `DateDebut` datetime NOT NULL,
  `Description` text DEFAULT NULL,
  `ChauffeurID` int(11) DEFAULT NULL,
  `StockID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `newsletters`
--

CREATE TABLE `newsletters` (
  `id` int(11) NOT NULL,
  `date_inscription` datetime NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `id_benevole` int(11) DEFAULT NULL,
  `id_beneficiaire` int(11) DEFAULT NULL,
  `titre` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `date_envoi` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `planning`
--

CREATE TABLE `planning` (
  `ID_Planning` int(11) NOT NULL,
  `planning_date` date NOT NULL,
  `ID_Benevole` int(11) DEFAULT NULL,
  `ID_Activite` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `problems`
--

CREATE TABLE `problems` (
  `id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `solved` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `resolved_at` timestamp NULL DEFAULT NULL,
  `type` enum('urgent','other') NOT NULL DEFAULT 'other',
  `admin_id` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `routes`
--

CREATE TABLE `routes` (
  `ID_Route` int(11) NOT NULL,
  `plan_route` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `services`
--

CREATE TABLE `services` (
  `ID_Service` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `stocks`
--

CREATE TABLE `stocks` (
  `ID_Stock` int(11) NOT NULL,
  `date_collecte` date NOT NULL,
  `ID_Entrepot` int(11) DEFAULT NULL,
  `ID_Denree` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

CREATE TABLE `utilisateurs` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `date_de_naissance` date NOT NULL,
  `email` varchar(255) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `ville` varchar(255) DEFAULT NULL,
  `code_postal` char(5) DEFAULT NULL,
  `telephone` varchar(15) DEFAULT NULL,
  `role` enum('beneficiaire','benevole') NOT NULL,
  `date_inscription` date DEFAULT current_timestamp(),
  `date_adhesion` date DEFAULT NULL,
  `genre` varchar(50) DEFAULT NULL,
  `besoin` text DEFAULT NULL,
  `avis_impot` varchar(255) DEFAULT NULL,
  `statut_validation` varchar(50) DEFAULT NULL,
  `competences` text DEFAULT NULL,
  `qualites` text DEFAULT NULL,
  `message_candidature` text DEFAULT NULL,
  `casier_judiciaire` varchar(255) DEFAULT NULL,
  `justificatif_permis` varchar(255) DEFAULT NULL,
  `permis_conduire` varchar(3) DEFAULT NULL,
  `langues` varchar(50) DEFAULT NULL,
  `token_activation` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `activites`
--
ALTER TABLE `activites`
  ADD PRIMARY KEY (`ID_Activite`),
  ADD KEY `id_lieu` (`id_lieu`) USING BTREE;

--
-- Index pour la table `activites_prives`
--
ALTER TABLE `activites_prives`
  ADD PRIMARY KEY (`ID_Activite`),
  ADD KEY `id_beneficiaire` (`id_beneficiaire`),
  ADD KEY `id_benevole` (`id_benevole`),
  ADD KEY `id_lieu` (`id_lieu`);

--
-- Index pour la table `administrateurs`
--
ALTER TABLE `administrateurs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `beneficiaires`
--
ALTER TABLE `beneficiaires`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `benevoles`
--
ALTER TABLE `benevoles`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `benevole_disponibilite`
--
ALTER TABLE `benevole_disponibilite`
  ADD PRIMARY KEY (`id_benevole`,`id_disponibilite`),
  ADD KEY `id_disponibilite` (`id_disponibilite`);

--
-- Index pour la table `blog`
--
ALTER TABLE `blog`
  ADD PRIMARY KEY (`id`),
  ADD KEY `auteur` (`auteur`);

--
-- Index pour la table `campagnes`
--
ALTER TABLE `campagnes`
  ADD PRIMARY KEY (`ID_Campagne`);

--
-- Index pour la table `circuit_ramassage`
--
ALTER TABLE `circuit_ramassage`
  ADD PRIMARY KEY (`ID_Circuit`),
  ADD KEY `ID_Route` (`ID_Route`);

--
-- Index pour la table `commercants_partenaire`
--
ALTER TABLE `commercants_partenaire`
  ADD PRIMARY KEY (`ID_Commercant`);

--
-- Index pour la table `commercant_circuit`
--
ALTER TABLE `commercant_circuit`
  ADD PRIMARY KEY (`ID_Commercant`,`ID_Circuit`),
  ADD KEY `ID_Circuit` (`ID_Circuit`);

--
-- Index pour la table `demandes_service`
--
ALTER TABLE `demandes_service`
  ADD PRIMARY KEY (`ID_Demande`),
  ADD KEY `id_beneficiaire` (`id_beneficiaire`);

--
-- Index pour la table `denrees`
--
ALTER TABLE `denrees`
  ADD PRIMARY KEY (`ID_Denree`),
  ADD KEY `ID_Stock` (`ID_Stock`);

--
-- Index pour la table `disponibilite`
--
ALTER TABLE `disponibilite`
  ADD PRIMARY KEY (`id_disponibilite`),
  ADD KEY `id_benevole` (`id_benevole`);

--
-- Index pour la table `donations`
--
ALTER TABLE `donations`
  ADD PRIMARY KEY (`ID_Donation`);

--
-- Index pour la table `entrepot`
--
ALTER TABLE `entrepot`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `evenements_beneficiaires`
--
ALTER TABLE `evenements_beneficiaires`
  ADD PRIMARY KEY (`ID_Evenement_Beneficiaire`),
  ADD KEY `ID_event` (`ID_event`),
  ADD KEY `ID_Beneficiaire` (`ID_Beneficiaire`);

--
-- Index pour la table `evenements_benevoles`
--
ALTER TABLE `evenements_benevoles`
  ADD PRIMARY KEY (`ID_Evenement_Benevole`),
  ADD UNIQUE KEY `ID_event` (`ID_event`,`ID_Benevole`),
  ADD KEY `ID_Benevole` (`ID_Benevole`);

--
-- Index pour la table `formations`
--
ALTER TABLE `formations`
  ADD PRIMARY KEY (`ID_Formation`),
  ADD KEY `fk_lieu` (`id_lieu`);

--
-- Index pour la table `image_profile`
--
ALTER TABLE `image_profile`
  ADD PRIMARY KEY (`ID_Image`),
  ADD KEY `ID_Admin` (`ID_Admin`),
  ADD KEY `ID_Benevole` (`ID_Benevole`),
  ADD KEY `ID_Beneficiaire` (`ID_Beneficiaire`);

--
-- Index pour la table `inscriptionsformations`
--
ALTER TABLE `inscriptionsformations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_formation` (`id_formation`),
  ADD KEY `id_benevole` (`id_benevole`);

--
-- Index pour la table `lieux`
--
ALTER TABLE `lieux`
  ADD PRIMARY KEY (`id_lieu`);

--
-- Index pour la table `maraude`
--
ALTER TABLE `maraude`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ChauffeurID` (`ChauffeurID`),
  ADD KEY `StockID` (`StockID`);

--
-- Index pour la table `newsletters`
--
ALTER TABLE `newsletters`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `id_benevole` (`id_benevole`),
  ADD KEY `id_beneficiaire` (`id_beneficiaire`);

--
-- Index pour la table `planning`
--
ALTER TABLE `planning`
  ADD PRIMARY KEY (`ID_Planning`),
  ADD KEY `ID_Benevole` (`ID_Benevole`),
  ADD KEY `ID_Activite` (`ID_Activite`);

--
-- Index pour la table `problems`
--
ALTER TABLE `problems`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Index pour la table `routes`
--
ALTER TABLE `routes`
  ADD PRIMARY KEY (`ID_Route`);

--
-- Index pour la table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`ID_Service`),
  ADD UNIQUE KEY `unique_nom` (`nom`);

--
-- Index pour la table `stocks`
--
ALTER TABLE `stocks`
  ADD PRIMARY KEY (`ID_Stock`),
  ADD KEY `ID_Entrepot` (`ID_Entrepot`),
  ADD KEY `fk_denree_id` (`ID_Denree`);

--
-- Index pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_role` (`role`),
  ADD KEY `idx_email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `activites`
--
ALTER TABLE `activites`
  MODIFY `ID_Activite` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `activites_prives`
--
ALTER TABLE `activites_prives`
  MODIFY `ID_Activite` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `administrateurs`
--
ALTER TABLE `administrateurs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `beneficiaires`
--
ALTER TABLE `beneficiaires`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `benevoles`
--
ALTER TABLE `benevoles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `blog`
--
ALTER TABLE `blog`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `campagnes`
--
ALTER TABLE `campagnes`
  MODIFY `ID_Campagne` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `circuit_ramassage`
--
ALTER TABLE `circuit_ramassage`
  MODIFY `ID_Circuit` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `commercants_partenaire`
--
ALTER TABLE `commercants_partenaire`
  MODIFY `ID_Commercant` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `demandes_service`
--
ALTER TABLE `demandes_service`
  MODIFY `ID_Demande` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `denrees`
--
ALTER TABLE `denrees`
  MODIFY `ID_Denree` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `disponibilite`
--
ALTER TABLE `disponibilite`
  MODIFY `id_disponibilite` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `donations`
--
ALTER TABLE `donations`
  MODIFY `ID_Donation` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `entrepot`
--
ALTER TABLE `entrepot`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `evenements_beneficiaires`
--
ALTER TABLE `evenements_beneficiaires`
  MODIFY `ID_Evenement_Beneficiaire` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `evenements_benevoles`
--
ALTER TABLE `evenements_benevoles`
  MODIFY `ID_Evenement_Benevole` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `formations`
--
ALTER TABLE `formations`
  MODIFY `ID_Formation` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `image_profile`
--
ALTER TABLE `image_profile`
  MODIFY `ID_Image` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `inscriptionsformations`
--
ALTER TABLE `inscriptionsformations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `lieux`
--
ALTER TABLE `lieux`
  MODIFY `id_lieu` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `maraude`
--
ALTER TABLE `maraude`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `newsletters`
--
ALTER TABLE `newsletters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `planning`
--
ALTER TABLE `planning`
  MODIFY `ID_Planning` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `problems`
--
ALTER TABLE `problems`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `routes`
--
ALTER TABLE `routes`
  MODIFY `ID_Route` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `services`
--
ALTER TABLE `services`
  MODIFY `ID_Service` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `stocks`
--
ALTER TABLE `stocks`
  MODIFY `ID_Stock` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `activites`
--
ALTER TABLE `activites`
  ADD CONSTRAINT `activites_ibfk_1` FOREIGN KEY (`id_lieu`) REFERENCES `lieux` (`id_lieu`);

--
-- Contraintes pour la table `benevole_disponibilite`
--
ALTER TABLE `benevole_disponibilite`
  ADD CONSTRAINT `benevole_disponibilite_ibfk_1` FOREIGN KEY (`id_benevole`) REFERENCES `benevoles` (`id`),
  ADD CONSTRAINT `benevole_disponibilite_ibfk_2` FOREIGN KEY (`id_disponibilite`) REFERENCES `disponibilite` (`id_disponibilite`);

--
-- Contraintes pour la table `demandes_service`
--
ALTER TABLE `demandes_service`
  ADD CONSTRAINT `demandes_service_ibfk_1` FOREIGN KEY (`id_beneficiaire`) REFERENCES `beneficiaires` (`id`);

--
-- Contraintes pour la table `disponibilite`
--
ALTER TABLE `disponibilite`
  ADD CONSTRAINT `disponibilite_ibfk_1` FOREIGN KEY (`id_benevole`) REFERENCES `benevoles` (`id`);

--
-- Contraintes pour la table `inscriptionsformations`
--
ALTER TABLE `inscriptionsformations`
  ADD CONSTRAINT `inscriptionsformations_ibfk_1` FOREIGN KEY (`id_formation`) REFERENCES `formations` (`ID_Formation`),
  ADD CONSTRAINT `inscriptionsformations_ibfk_2` FOREIGN KEY (`id_benevole`) REFERENCES `benevoles` (`id`);

--
-- Contraintes pour la table `maraude`
--
ALTER TABLE `maraude`
  ADD CONSTRAINT `maraude_ibfk_1` FOREIGN KEY (`ChauffeurID`) REFERENCES `benevoles` (`id`),
  ADD CONSTRAINT `maraude_ibfk_2` FOREIGN KEY (`StockID`) REFERENCES `stocks` (`ID_Stock`);

--
-- Contraintes pour la table `problems`
--
ALTER TABLE `problems`
  ADD CONSTRAINT `problems_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `administrateurs` (`id`);

--
-- Contraintes pour la table `stocks`
--
ALTER TABLE `stocks`
  ADD CONSTRAINT `fk_denree_id` FOREIGN KEY (`ID_Denree`) REFERENCES `denrees` (`ID_Denree`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
