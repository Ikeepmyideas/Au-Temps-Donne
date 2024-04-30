const Volunteer = require('../models/Volunteer'); // Importation correcte du modèle Volunteer
const Admin = require('../models/Admin'); 
const Entrepot = require('../models/Entrepots');
const Lieu= require('../models/Lieu');
const sequelize = require('../config/db'); 

async function verifyCredentials(email, mot_de_passe) {
    console.log(`Recherche de l'utilisateur avec l'email: ${email}`);
    let user = await Volunteer.findOne({ where: { email: email } });
    console.log(`Utilisateur trouvé: ${user}`);
    if (user && user.mot_de_passe === mot_de_passe) {
        return { user, type: 'volunteer' };
    }
    
    user = await Admin.findOne({ where: { email: email } });
    console.log(`Utilisateur trouvé: ${user}`);
    if (user && user.mot_de_passe === mot_de_passe) {
        return { user, type: 'admin' };
    }
    
    return null;
}


exports.login = async (req, res) => {
    const { email, mot_de_passe } = req.body;
    
    try {
        const result = await verifyCredentials(email, mot_de_passe);
        if (result) {
            res.send(`Connexion réussie en tant que ${result.type}`);
        } else {
            res.status(401).send('Identifiants invalides');
        }
    } catch (error) {
        console.error(error); 
        res.status(500).send('Erreur serveur');
    }
};
exports.getAllEntrepot = async (req, res) => {
    try {
        const entrepots = await Entrepot.findAll();
        res.json(entrepots);
      } catch (error) {
        console.error("Erreur lors de la récupération de la liste des entrepots :", error);
        res.status(500).json({ message: "Erreur serveur." });
      }
};


exports.addEntrepot = async (req, res) => {
    const { adresse, ville, code_postal } = req.body;

    try {
        const nouvelEntrepot = await Entrepot.create({
            adresse: adresse,
            ville: ville,
            code_postal: code_postal
        });

        res.status(201).json({
            message: 'Entrepôt ajouté avec succès.',
            entrepot: nouvelEntrepot
        });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'entrepôt : ', error);
        res.status(500).json({
            error: 'Erreur lors de l\'ajout de l\'entrepôt : ' + error.message
        });
    }
};
exports.deleteEntrepot = async (req, res) => {
    const entrepotId = req.params.id;

    try {
        const entrepot = await Entrepot.findByPk(entrepotId);

        if (!entrepot) {
            return res.status(404).json({ error: 'Entrepôt non trouvé.' });
        }

        await entrepot.destroy();

        res.status(200).json({ message: 'Entrepôt supprimé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'entrepôt : ', error);
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'entrepôt : ' + error.message });
    }
};
exports.updateEntrepot = async (req, res) => {
    const entrepotId = req.params.id;
    const { adresse, ville, code_postal } = req.body;

    try {
        let entrepot = await Entrepot.findByPk(entrepotId);

        if (!entrepot) {
            return res.status(404).json({ error: 'Entrepôt non trouvé.' });
        }

        entrepot.adresse = adresse;
        entrepot.ville = ville;
        entrepot.code_postal = code_postal;

        await entrepot.save();

        res.status(200).json({
            message: 'Entrepôt mis à jour avec succès.',
            entrepot: entrepot
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'entrepôt : ', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'entrepôt : ' + error.message });
    }
};
exports.getAllEntrepots = async (req, res) => {
    try {
        const entrepots = await Entrepot.findAll();
        res.status(200).json(entrepots);
    } catch (error) {
        console.error('Erreur lors de la récupération de tous les entrepôts : ', error);
        res.status(500).json({ error: 'Erreur lors de la récupération de tous les entrepôts : ' + error.message });
    }
};
