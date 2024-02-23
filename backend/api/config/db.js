const Sequelize = require('sequelize');
const sequelize = new Sequelize('AutempsDonnée', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
});

sequelize.authenticate().then(() => {
  console.log('Connexion réussie.');
}).catch(err => {
  console.error('Erreur de connexion:', err);
});

module.exports = sequelize;
