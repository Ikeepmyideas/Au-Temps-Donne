const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Read the database connection URL from the environment variables
const databaseUrl = process.env.DATABASE_URL;

// Initialize Sequelize with the database connection URL
const sequelize = new Sequelize(databaseUrl, {
  dialect: 'mysql',
});

// Define a function to dynamically import model files
function importModels(directory) {
  const models = {};
  fs.readdirSync(directory)
    .filter(file => file.endsWith('.js'))
    .forEach(file => {
      const model = require(path.join(directory, file))(sequelize, Sequelize.DataTypes);
      models[model.name] = model;
    });
  return models;
}

// Dynamically import all model files from the 'models' directory
const models = importModels(path.join(__dirname, '../models'));

// Synchronize all models with the database
sequelize.sync()
  .then(() => {
    console.log('Models synchronized with the database.');
  })
  .catch((error) => {
    console.error('Error synchronizing models:', error);
  });

// Export models for use in other parts of the project
module.exports = sequelize;
