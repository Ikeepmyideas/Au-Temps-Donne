const multer = require('multer');
const Admin = require('../models/Admin');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');

const { Op } = require('sequelize'); 
const argon2 = require('argon2');
const Entrepot = require('../models/Entrepot'); 
const Denree = require('../models/Denree');
const Maraude = require('../models/Maraude');
const Volunteer = require('../models/Volunteer');
const Disponibilite = require('../models/Disponibilite');

require('dotenv').config(); 
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
  
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
  
        const admin = await Admin.findOne({ where: { email } });
  
        if (!admin) {
            return res.status(404).json({ error: 'User not found' });
        }
  
        const passwordMatch = await argon2.verify(admin.mot_de_passe, password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }
  
  
        const token = generateToken(admin.id,  admin.email);
  
        const userType = "admin"
  
        res.cookie('access_token', token, {
            httpOnly: true,
            maxAge: 3600000, // 1 hour
            sameSite: 'none',
            path: '/', // Set the cookie path to '/'
            secure: true // Add 'secure: true' if your app is served over HTTPS
        });
  
        res.status(200).json({ message: 'Login successful', token, userType }); 
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  };


const createEntrepot = async (req, res) => {
    const { nom, adresse, ville, code_postal, capacite } = req.body;
    try {
        const entrepot = await Entrepot.create({
            nom,
            adresse,
            ville,
            code_postal,
            capacite
        });
        res.status(201).json(entrepot);
    } catch (error) {
        console.error('Erreur lors de la création de l\'entrepôt:', error);
        res.status(500).json({ message: 'Erreur lors de la création de l\'entrepôt.' });
    }
};
const getAllEntrepots = async (req, res) => {
    try {
        const entrepots = await Entrepot.findAll();
        res.status(200).json(entrepots);
    } catch (error) {
        console.error('Erreur lors de la récupération des entrepôts:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des entrepôts.' });
    }
};

const updateEntrepot = async (req, res) => {
    const { id } = req.params;
    const { nom, adresse, ville, code_postal, capacite } = req.body;
    try {
        const entrepot = await Entrepot.findByPk(id);
        if (!entrepot) {
            return res.status(404).json({ message: 'Entrepôt non trouvé.' });
        }
        entrepot.nom = nom;
        entrepot.adresse = adresse;
        entrepot.ville = ville;
        entrepot.code_postal = code_postal;
        entrepot.capacite = capacite;
        await entrepot.save();
        res.status(200).json(entrepot);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'entrepôt:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'entrepôt.' });
    }
};

const deleteEntrepot = async (req, res) => {
    const { id } = req.params;
    try {
        const entrepot = await Entrepot.findByPk(id);
        if (!entrepot) {
            return res.status(404).json({ message: 'Entrepôt non trouvé.' });
        }
        await entrepot.destroy();
        res.status(204).end();
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'entrepôt:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'entrepôt.' });
    }
};

const Stock = require('../models/Stocks');



const getAllStockedDenrees = async (req, res) => {
    try {
        const entrepots = await Stock.findAll({
            include: [
                { 
                    model: Entrepot, 
                    as: 'entrepot'                },
                { 
                    model: Denree, 
                    as: 'denree'
                }
            ]
        });
        res.status(200).json(entrepots);
    } catch (error) {
        console.error('Erreur lors de la récupération des entrepôts:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des entrepôts.' });
    }
};
const deleteStock = async (req, res) => {
    const { id } = req.params;
    try {
        const numDestroyed = await Stock.destroy({
            where: { ID_Stock: id }
        });
        if (numDestroyed) {
            return res.status(200).json({ message: 'Stock deleted successfully' });
        } else {
            return res.status(404).json({ message: 'Stock not found' });
        }
    } catch (error) {
        console.error('Error deleting stock:', error);
        return res.status(500).json({ message: 'Error deleting stock', error: error.message });
    }
};
const updateStock = async (req, res) => {
    const { id } = req.params;
    const { date_collecte, ID_Entrepot, ID_Denree } = req.body;

    try {
        const stock = await Stock.findByPk(id);
        if (stock) {
            stock.date_collecte = date_collecte;
            stock.ID_Entrepot = ID_Entrepot;
            stock.ID_Denree = ID_Denree;
            await stock.save();
            return res.status(200).json({ message: 'Stock updated successfully', stock });
        } else {
            return res.status(404).json({ message: 'Stock not found' });
        }
    } catch (error) {
        console.error('Error updating stock:', error);
        return res.status(500).json({ message: 'Error updating stock', error: error.message });
    }
};



const addMaraude = async (req, res) => {
    const { nom, lieuDepart, lieuArrivee, dateDebut, description, chauffeurID, stockID } = req.body;
    
    try {
        // Check if the referenced Stock and Chauffeur exist
        const stock = await Stock.findByPk(stockID);
        const chauffeur = await Volunteer.findByPk(chauffeurID);

        if (!stock || !chauffeur) {
            return res.status(404).json({
                message: "Stock or Chauffeur not found"
            });
        }

        // Create the new Maraude
        const newMaraude = await Maraude.create({
            Nom: nom,
            LieuDepart: lieuDepart,
            LieuArrivee: lieuArrivee,
            DateDebut: dateDebut,
            Description: description,
            ChauffeurID: chauffeurID,
            StockID: stockID
        });

        return res.status(201).json({
            message: "Maraude successfully created",
            maraude: newMaraude
        });
    } catch (error) {
        console.error("Error creating maraude: ", error);
        return res.status(500).json({
            message: "Failed to create maraude",
            error: error.message
        });
    }
};

const getVolunteersDisponibles = async (req, res) => {
    try {
        const { date, startTime } = req.query;  

        if (!date || !startTime ) {
            return res.status(400).send("All parameters are required.");
        }

        const jourDate = new Date(date + 'T00:00:00Z'); 

        const startDate = new Date(`${date}T${startTime}:00Z`); 

        const availableVolunteers = await Disponibilite.findAll({
            where: {
                jour: jourDate,
                heure_debut: {
                    [Op.lte]: startDate 
                }
                
            },
            include: [{
                model: Volunteer,
                as: 'benevole',
                attributes: ['nom', 'prenom', 'email', 'telephone'],
                where: { permis_conduire: "oui" } 
            }]
        });

        if (availableVolunteers.length === 0) {
            return res.status(404).send('No available volunteers found.');
        }

        res.json(availableVolunteers.map(vol => vol.benevole)); 
    } catch (error) {
        console.error('Error retrieving available volunteers:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    getVolunteersDisponibles,
    addMaraude,
    getAllStockedDenrees,
    createEntrepot,
    getAllEntrepots,
    updateEntrepot,
    deleteEntrepot,
    deleteStock,
    updateStock
};