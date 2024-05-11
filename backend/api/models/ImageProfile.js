const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const Beneficiary = require('./Beneficiary');
const Volunteer = require('./Volunteer');

const ImageProfile = sequelize.define('image_profile', {
  ID_Image: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  image_path: {
    type: Sequelize.STRING,
    allowNull: false
  },
  // If you have foreign key constraints, you can define them here
  ID_Admin: {
    type: Sequelize.INTEGER,
    references: {
      model: 'Admin', // Assuming you have an Admin table
      key: 'ID_Admin'
    }
  },
  ID_Benevole: {
    type: Sequelize.INTEGER,
    references: {
      model: 'Volunteer', // Assuming you have a Volunteer table
      key: 'ID_Volunteer'
    }
  },
  ID_Beneficiaire: {
    type: Sequelize.INTEGER,
    references: {
      model: 'Beneficiary', // Assuming you have a Beneficiary table
      key: 'ID_Beneficiary'
    }
  }
}, {
    tableName: 'image_profile',
  timestamps: false // Disable timestamps
});

module.exports = ImageProfile;
