const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('Xnauteb622', 'xnauteb622', 'Asmaoceanekhaoula2024', {
  host: 'xnauteb622.mysql.db',
  dialect: 'mysql',
  port: 3306,
});

sequelize.authenticate()
  .then(() => {
    console.log('Connexion réussie.');
  })
  .catch(err => {
    console.error('Erreur de connexion:', err);
  });

module.exports = sequelize;
