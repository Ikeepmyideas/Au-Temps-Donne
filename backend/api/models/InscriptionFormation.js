const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const Volunteer = require('./Volunteer');
const Formation = require('./Formation');

const InscriptionFormation = sequelize.define('inscriptionsformations', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_formation: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Formation,
      key: "ID_Formation"
    }
  },
  id_benevole: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  date_inscription: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
  timestamps: false,
  // Explicitly specify foreign key constraint
  foreignKeys: [{
    name: 'FK_InscriptionFormation_Formation',
    referencedTableName: 'formations',
    referencedColumn: 'ID_Formation',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE'
  }]
});

// Set up the associations
Volunteer.hasMany(InscriptionFormation, { foreignKey: 'id_benevole' });
InscriptionFormation.belongsTo(Volunteer, { foreignKey: 'id_benevole', as: 'volunteer' });

//InscriptionFormation.belongsTo(Formation, { foreignKey: 'id_formation', as: 'formation' });
//Formation.hasMany(InscriptionFormation, { foreignKey: 'id_formation' });

module.exports = InscriptionFormation;
