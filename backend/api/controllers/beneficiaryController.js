const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Beneficiary, pool } = require('../models/Beneficiary');

module.exports = {
  signup: async (req, res) => {
    const { email, prenom, nom, motDePasse, dateDeNaissance, genre, numeroTelephone, adresse, codePostal, ville, besoin } = req.body;

    if (!email || !prenom || !nom || !motDePasse || !dateDeNaissance || !genre || !numeroTelephone || !adresse || !codePostal || !ville || !besoin) {
      return res.status(400).json({ error: 'Missing required data' });
    }

    try {
      const hashedPassword = await bcrypt.hash(motDePasse, 10); 

      const beneficiaryData = { email, prenom, nom, motDePasse: hashedPassword, dateDeNaissance, genre, numeroTelephone, adresse, codePostal, ville, besoin };
      Beneficiary.signup(beneficiaryData, (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'Internal server error' });
        }
        const token = jwt.sign({ email, id: result.insertId }, 'your-secret-key', { expiresIn: '1h' });

        res.status(201).json({ message: 'Signup successful', token });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  
  login: async (req, res) => {
    const { email, motDePasse } = req.body;

    if (!email || !motDePasse) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      const beneficiary = await new Promise((resolve, reject) => {
        Beneficiary.findByEmail(email, (error, beneficiary) => {
          if (error) {
            console.error(error);
            reject(error);
          } else {
            resolve(beneficiary);
          }
        });
      });

      if (!beneficiary) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const passwordMatch = await bcrypt.compare(motDePasse, beneficiary.motDePasse);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = jwt.sign({ userId: beneficiary.id }, 'your-secret-key', { expiresIn: '1h' });

      pool.query('SELECT * FROM beneficiaires WHERE id = ?', [beneficiary.id], (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: 'User not found' });
        }

        const user = results[0];

        res.status(200).json({ message: 'Login successful', token, user });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  updateUser: async (userId, updatedData, res) => {
    try {
      if (!updatedData) {
        return res.status(400).json({ error: 'Updated data is required' });
      }

      pool.query('UPDATE beneficiaires SET ? WHERE id = ?', [updatedData, userId], (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User information updated successfully' });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  deleteUser: async (userId, res) => {
    try {
      pool.query('DELETE FROM beneficiaires WHERE id = ?', [userId], (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
