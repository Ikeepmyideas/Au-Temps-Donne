const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const Benevole = require('./Volunteer'); // Import the Benevole model

const Disponibilite = sequelize.define('disponibilite', {
    id_disponibilite: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_benevole: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {        
            model: Benevole,
            key: 'id_benevole' 
        }
    },
    jour: {
        type: Sequelize.STRING(10),
        allowNull: false
    },
    heure_debut: {
        type: Sequelize.TIME,
        allowNull: false
    },
    heure_fin: {
        type: Sequelize.TIME,
        allowNull: false
    }
}, {
    tableName: 'disponibilite',
    timestamps: false 
});

Disponibilite.belongsTo(Benevole, { foreignKey: 'id_benevole', as: 'benevole' });

module.exports = Disponibilite;
