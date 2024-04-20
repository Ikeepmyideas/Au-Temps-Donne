const { Sequelize } = require('sequelize');

const databaseUrl = process.env.DATABASE_URL;

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'mysql',
});

sequelize.authenticate().then(() => {
  console.log('Connection successful.');
}).catch(err => {
  console.error('Connection failed:', err);
});

module.exports = sequelize;
