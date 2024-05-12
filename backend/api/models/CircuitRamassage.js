const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Volunteer = require('./Volunteer');
const Entrepot = require('./Entrepot');
const Denree = require('./Denree');
const Partenaire = require('./Partenaire');


const Collecte = sequelize.define("collecte", {
  id_collecte: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date_collecte: {
    type: DataTypes.DATE,
    allowNull: false
  },
  LieuDepart: {
    type: DataTypes.STRING,
    allowNull: false
  },
  LieuArrivee: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id_denree: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ID_Route: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  
  id_chauffeur: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: "collecte",
  timestamps: false
});



Collecte.belongsTo(Volunteer, {
  foreignKey: 'ChauffeurID',
  as: 'Chauffeur'
});

Collecte.belongsTo(Denree, {
  foreignKey: 'id_denree',
  as: 'Denree'
});

module.exports = Collecte;