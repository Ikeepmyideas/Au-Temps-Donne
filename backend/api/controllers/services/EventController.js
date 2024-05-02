const express = require('express');
const sequelize = require('../config/db'); 
const { Op } = require('sequelize'); 
const Volunteer = require('../models/Volunteer');
const Formation = require('../models/Formation');
const Beneficiary = require('../models/Beneficiary');
const Partenaire = require('../models/Partenaire');
const crypto = require('crypto');
const Lieu= require('../models/Lieu');
const Activity = require('../models/Activity');
const ActivityPrive = require('../models/ActivityPrivate');
const Service = require('../models/Service');
const Blog = require('../models/Blog');
const EvenementBenevole = require('../models/EvenementBenevole');
const models = require('../models');
models.Activity.belongsTo(models.Lieu, { foreignKey: 'id_lieu', as: 'activityLieu' });


exports.getAllServices = async (req, res) => {
    try {
      const services = await Service.findAll();
      res.status(200).json(services);
    } catch (error) {
      console.error('Erreur lors de la récupération des services :', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  };
exports.createActivityPrive = async (req, res) => {

    const { description, date_activite, heure_debut, heure_fin, titre, adresseComplete, ville, code_postal, nomBeneficiaire, prenomBeneficiaire, nomBenevole, prenomBenevole, nom_service } = req.body;
    const t = await sequelize.transaction();
  
    try {
      const benevoleId = await getBenevoleId(nomBenevole, prenomBenevole);
      const beneficiaireId = await getBeneficiaireId(nomBeneficiaire, prenomBeneficiaire);
  
     
      const existingEvent = await ActivityPrive.findOne({
        attributes: ['id_benevole', 'id_beneficiaire', 'heure_debut', 'date_activite'],
        where: {
          date_activite,
          heure_debut,
          [Op.or]: [
            { id_benevole: benevoleId },
            { id_beneficiaire: beneficiaireId }
          ]
        },
        transaction: t
      });
    
  
      if (existingEvent) {
        throw new Error('Un événement avec le même nom et prénom de bénévole/bénéficiaire, la même date et heure existe déjà.');
      }
      let [lieu, created] = await Lieu.findOrCreate({
        where: { adresse: adresseComplete, ville, code_postal },
        defaults: { adresse: adresseComplete, ville, code_postal },
        transaction: t
      });
  
      const [benevole, benevoleCreated] = await Volunteer.findOrCreate({
        where: { nom: nomBenevole, prenom: prenomBenevole },
        defaults: { nom: nomBenevole, prenom: prenomBenevole },
        transaction: t
      });
  
      if (!benevoleCreated && !benevole) {
        throw new Error('Bénévole non trouvé et impossible à créer.');
      }
  
      const [beneficiaire, beneficiaireCreated] = await Beneficiary.findOrCreate({
        where: { nom: nomBeneficiaire, prenom: prenomBeneficiaire },
        defaults: { nom: nomBeneficiaire, prenom: prenomBeneficiaire },
        transaction: t
      });
  
      if (!beneficiaireCreated && !beneficiaire) {
        throw new Error('Bénéficiaire non trouvé et impossible à créer.');
      }
  
      await ActivityPrive.create({
        description,
        date_activite,
        heure_debut,
        heure_fin,
        titre,
        id_lieu: lieu.id_lieu,
        id_beneficiaire: beneficiaire.id,
        id_benevole: benevole.id,
        nom_service
      }, { transaction: t });
  
      await t.commit();
  
      res.status(201).send('Activité privée ajoutée avec succès.');
    } catch (error) {
      await t.rollback();
      console.error('Erreur lors de l\'ajout de l\'activité privée : ', error);
      res.status(500).send('Erreur lors de l\'ajout de l\'activité privée : ' + error.message);
    }
  };
  
  async function getBenevoleId(nom, prenom) {
    const benevole = await Volunteer.findOne({ where: { nom, prenom } });
    if (!benevole) {
      throw new Error(`Bénévole non trouvé avec le nom ${nom} et le prénom ${prenom}`);
    }
    return benevole.id;
  }
  
  async function getBeneficiaireId(nom, prenom) {
    const beneficiaire = await Beneficiary.findOne({ where: { nom, prenom } });
    if (!beneficiaire) {
      throw new Error(`Bénéficiaire non trouvé avec le nom ${nom} et le prénom ${prenom}`);
    }
    return beneficiaire.id;
  }
  
  exports.getVolunteerById = async (req, res) => {
    try {
      const id = req.params.id;
      const volunteer = await Volunteer.findByPk(id);
      if (!volunteer) {
        return res.status(404).send({ message: 'Bénévole non trouvé.' });
      }
      res.send({ nom: volunteer.nom, prenom: volunteer.prenom });
    } catch (error) {
      console.error('Erreur lors de la récupération du bénévole:', error);
      res.status(500).send({ message: 'Erreur lors de la récupération des informations du bénévole.' });
    }
  };
  exports.getBeneficiaryById = async (req, res) => {
    try {
      const id = req.params.id;
      const beneficiary = await Beneficiary.findByPk(id);
      if (!beneficiary) {
        return res.status(404).send({ message: 'Bénéficiaire non trouvé.' });
      }
      res.send({ nom: beneficiary.nom, prenom: beneficiary.prenom });
    } catch (error) {
      console.error('Erreur lors de la récupération du bénéficiaire:', error);
      res.status(500).send({ message: 'Erreur lors de la récupération des informations du bénéficiaire.' });
    }
  };
  exports.createActivity = async (req, res) => {
    const { description, date_activite, heure_debut, heure_fin, titre, adresseComplete, ville, code_postal, nom_service, nb_benevoles } = req.body;
    const t = await sequelize.transaction();
  
    try {
      const currentDate = new Date();
      const startDate = new Date(date_activite);
    
      if (startDate < currentDate) {
        return res.status(400).send('La date de début est déjà passée.');
      }
  
      let [lieu, created] = await Lieu.findOrCreate({
        where: { adresse: adresseComplete, ville, code_postal },
        defaults: { adresse: adresseComplete, ville, code_postal },
        transaction: t
      });
  
      const existingActivity = await Activity.findOne({
        where: {
          date_activite: startDate,
          id_lieu: lieu.id_lieu,
          [Op.or]: [
            {
              [Op.and]: [
                { heure_debut: { [Op.lte]: heure_debut } },
                { heure_fin: { [Op.gte]: heure_debut } }
              ]
            },
            {
              [Op.and]: [
                { heure_debut: { [Op.lte]: heure_fin } },
                { heure_fin: { [Op.gte]: heure_fin } }
              ]
            },
            {
              [Op.and]: [
                { heure_debut: { [Op.gte]: heure_debut } },
                { heure_fin: { [Op.lte]: heure_fin } }
              ]
            }
          ]
        },
        transaction: t
      });
  
      if (existingActivity) {
        await t.rollback();
        return res.status(400).json({ error: 'Une Activite avec les mêmes dates de début et de fin existe déjà.' });
      }
  
      await Activity.create({
        description,
        date_activite,
        heure_debut,
        heure_fin,
        titre,
        id_lieu: lieu.id_lieu,
        nom_service,
        nb_benevoles
      }, { transaction: t });
  
      await t.commit();
  
      res.status(201).send('Activité ajoutée avec succès.');
    } catch (error) {
      await t.rollback();
      console.error('Erreur lors de l\'ajout de l\'activité : ', error);
      res.status(500).send('Erreur lors de l\'ajout de l\'activité : ' + error.message);
    }
  };
exports.createFormation = async (req, res) => {
    const { description, date_debut, date_fin, heure_debut, heure_fin, titre, adresseComplete, ville, code_postal } = req.body;
    const t = await sequelize.transaction();
  
    try {
      const currentDate = new Date();
      const startDate = new Date(date_debut);
      const EndDate = new Date(date_fin);
    
      if (startDate < currentDate) {
        return res.status(400).send('La date de début est déjà passée.');
      }
      if (EndDate < currentDate) {
        return res.status(400).send('La date de fin est déjà passée.');
      }
  
      let [lieu, created] = await Lieu.findOrCreate({
        where: { adresse: adresseComplete, ville, code_postal },
        defaults: { adresse: adresseComplete, ville, code_postal },
        transaction: t
      });
  
      const endDate = new Date(date_fin);
  
      const existingFormation = await Formation.findOne({
        where: {
          date_debut: startDate,
          date_fin: endDate,
          id_lieu: lieu.id_lieu
        },
        transaction: t
      });
  
      if (existingFormation) {
        await t.rollback();
        return res.status(400).send('Une formation avec les mêmes dates de début et de fin existe déjà.');
      }
  
      await Formation.create({
        description,
        date_debut: startDate,
        date_fin: endDate,
        heure_debut,
        heure_fin,
        titre,
        id_lieu: lieu.id_lieu,
      }, { transaction: t });
  
      await t.commit();
  
      res.status(201).send('Formation ajoutée avec succès.');
    } catch (error) {
      await t.rollback();
      console.error('Erreur lors de l\'ajout de formation : ', error);
      res.status(500).send('Erreur lors de l\'ajout de formation : ' + error.message);
    }
  };

  exports.updateActivity = async (req, res) => {
    const { ID_Activite } = req.params;
    const { description, date_activite, heure_debut, heure_fin, titre, adresseComplete, ville, code_postal, nom_service, nb_benevoles } = req.body;
    const t = await sequelize.transaction();
  
    try {
      const currentDate = new Date();
      const startDate = new Date(date_activite);
  
      if (startDate < currentDate) {
        await t.rollback();
        return res.status(400).send('La date de l\'activité ne peut pas être dans le passé.');
      }
  
      let [lieu, created] = await Lieu.findOrCreate({
        where: { adresse: adresseComplete, ville, code_postal },
        defaults: { adresse: adresseComplete, ville, code_postal },
        transaction: t
      });
  
      if (!lieu) {
        await t.rollback();
        return res.status(404).send('Lieu introuvable.');
      }
  
      const existingActivity = await Activity.findOne({
        where: {
          ID_Activite: {
            [Op.ne]: ID_Activite
          },
          date_activite: startDate,
          id_lieu: lieu.id_lieu,
          [Op.or]: [
            {
              [Op.and]: [
                { heure_debut: { [Op.lte]: heure_debut } },
                { heure_fin: { [Op.gte]: heure_debut } }
              ]
            },
            {
              [Op.and]: [
                { heure_debut: { [Op.lte]: heure_fin } },
                { heure_fin: { [Op.gte]: heure_fin } }
              ]
            },
            {
              [Op.and]: [
                { heure_debut: { [Op.gte]: heure_debut } },
                { heure_fin: { [Op.lte]: heure_fin } }
              ]
            }
          ]
        },
        transaction: t
      });
  
      if (existingActivity) {
        await t.rollback();
        return res.status(400).send('Conflit d\'horaire avec une autre activité.');
      }
  
      await Activity.update({
        titre,
        description,
        date_activite,
        heure_debut,
        heure_fin,
        titre,
        id_lieu: lieu.id_lieu,
        nom_service,
        nb_benevoles
      }, {
        where: { ID_Activite },
        transaction: t
      });
  
      await t.commit();
      res.status(200).send('Activité mise à jour avec succès.');
    } catch (error) {
      await t.rollback();
      console.error('Erreur lors de la mise à jour de l\'activité : ', error);
      res.status(500).send('Erreur lors de la mise à jour de l\'activité : ' + error.message);
    }
  };
  
exports.getLatestActivities = async (req, res) => {
    try {
      const activities = await Activity.findAll({
        include: [{
          model: Lieu, 
          as: 'lieu' 
        }],
        order: [['date_create', 'DESC']],
        limit: 4
      });
      
      res.status(200).json(activities);
    } catch (error) {
      console.error("Erreur lors de la récupération des dernières activités :", error);
      res.status(500).json({ message: "Erreur lors de la récupération des dernières activités." });
    }
  };
  exports.getActivities = async (req, res) => {
    try {
      const activities = await Activity.findAll({
        include: [{
          model: Lieu, 
          as: 'lieu' 
        }],
      });
      
      res.status(200).json(activities);
    } catch (error) {
      console.error("Erreur lors de la récupération des dernières activités :", error);
      res.status(500).json({ message: "Erreur lors de la récupération des dernières activités." });
    }
  };
  exports.showEvent = async (req, res) => {
    try {
      const { ID_Activite } = req.params;
      const activity = await Activity.findByPk(ID_Activite, {
        include: [{
          model: Lieu, 
          as: 'lieu' 
        }],
      });
  
      if (!activity) {
        return res.status(404).json({ error: 'Activité non trouvée.' });
      }
  
      res.json(activity);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'activité :', error);
      res.status(500).send({ message: 'Erreur lors de la récupération des informations de l\'activité.' });
    }
  };