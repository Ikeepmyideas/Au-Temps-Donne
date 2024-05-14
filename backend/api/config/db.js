const { Sequelize } = require('sequelize');



const sequelize = new Sequelize('mysql://xnauteb622:Asmaoceanekhaoula2024@51.91.236.255:port/Xnauteb622');

sequelize.authenticate()
  .then(() => {
    console.log('Connexion réussie.');
  })
  .catch(err => {
    console.error('Erreur de connexion:', err);
  });

module.exports = sequelize;
