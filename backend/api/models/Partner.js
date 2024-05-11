const { Sequelize} = require("sequelize");
const { sequelize } = require("../database");

const Partner = sequelize.define("commercants_partenaire", {
    id_commercant: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: Sequelize.STRING,
        allowNull: false
    },
    contact: {
        type: Sequelize.STRING
    },

    adresse: { type: Sequelize.STRING },

  ville: { type: Sequelize.STRING },

  code_postal: { type: Sequelize.STRING(5) }
}, {
    timestamps: false
});

module.exports = Partner;
