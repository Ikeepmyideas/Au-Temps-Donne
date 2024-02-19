const mysql = require('mysql');
const bcrypt = require('bcrypt');
const util = require('util');

// Créer une connexion à la base de données MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'AutempsDonnée',
});

// Utiliser la méthode util.promisify pour pouvoir utiliser des promesses avec les méthodes de la connexion MySQL
const query = util.promisify(db.query).bind(db);


const addVolunteer = async (nom,prenom, email, mot_de_passe) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  await query('INSERT INTO Benevoles (nom,prenom, email,mot_de_passe) VALUES (?, ?, ?,?)', [nom, prenom, email, hash]);
};

// Fonction pour comparer le mot de passe lors de la connexion
const comparePassword = async (email, mot_de_passe) => {
  const result = await query('SELECT * FROM volunteers WHERE email = ?', [email]);

  if (result.length === 0) {
    return false; // L'utilisateur n'a pas été trouvé
  }

  const volunteer = result[0];
  return bcrypt.compare(mot_de_passe, volunteer.mot_de_passe);
};

module.exports = {
  addVolunteer,
  comparePassword,
};
