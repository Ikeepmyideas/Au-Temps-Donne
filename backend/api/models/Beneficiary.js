const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'au_temps_donné'
});

const Beneficiary = {
    signup: (signupData, callback) => {
        const { email, prenom, nom, motDePasse, dateDeNaissance, genre, numeroTelephone, adresse, codePostal, ville, besoin } = signupData;
        pool.query('INSERT INTO beneficiaires (email, prenom, nom, motDePasse, dateDeNaissance, genre, numeroTelephone, adresse, codePostal, ville, besoin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [email, prenom, nom, motDePasse, dateDeNaissance, genre, numeroTelephone, adresse, codePostal, ville, besoin],
            (error, results) => {
                if (error) {
                    console.error('Error signing up:', error);
                    return callback(error, null);
                }
                callback(null, results);
            }
        );
    },

    findByEmail: (email, callback) => {
        pool.query('SELECT * FROM beneficiaires WHERE email = ?', [email], (error, results) => {
            if (error) {
                console.error('Error finding beneficiary by email:', error);
                return callback(error, null);
            }
            if (results.length === 0) {
                return callback(null, null);
            }
            const beneficiary = results[0];
            beneficiary.unhashedPassword = beneficiary.motDePasse;
            return callback(null, beneficiary);
        });
    }
};

module.exports = { Beneficiary, pool };
