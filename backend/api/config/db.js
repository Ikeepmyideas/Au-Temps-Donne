const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('Xnauteb622', 'xnauteb622', 'khaoulaasmaoceaneG4', {
  host: '51.91.236.255',
  port: 3306,
  dialect: 'mysql',
});

sequelize.authenticate()
  .then(() => {
    console.log('Connexion réussie.');
  })
  .catch(err => {
    console.error('Erreur de connexion:', err);
  });

module.exports = sequelize;
