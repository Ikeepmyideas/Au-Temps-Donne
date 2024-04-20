const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
});

sequelize.authenticate().then(() => {
  console.log('Connexion réussie.');
}).catch(err => {
  console.error('Erreur de connexion:', err);
});

module.exports = sequelize;
