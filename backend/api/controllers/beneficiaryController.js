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

        res.cookie('access_token', token, { httpOnly: true, maxAge: 36000000 }); // Expires in 1 hour (3600000 ms)

        return res.status(200).json({ message: "Logged in successfully", token });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
},
  displayUserInfo: async (req, res) => {
    try {
      const token = req.cookies.access_token;

      if (!token) {
          return res.status(401).json({ error: 'Token not provided' });
      }

      jwt.verify(token, 'your-secret-key', async (err, decoded) => {
          if (err) {
              return res.status(401).json({ error: 'Invalid token' });
          }

          const userId = decoded.userId;

          Beneficiary.findById(userId, (error, beneficiary) => {
              if (error) {
                  console.error(error);
                  return res.status(500).json({ error: 'Internal server error' });
              }
              if (!beneficiary) {
                  return res.status(404).json({ error: 'User not found' });
              }

              return res.status(200).json({ user: beneficiary });
          });
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
  }
},
  updateUserInfo: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { prenom, nom, dateDeNaissance, genre, numeroTelephone, adresse, codePostal, ville, besoin } = req.body;
  
      Beneficiary.update(userId, { prenom, nom, dateDeNaissance, genre, numeroTelephone, adresse, codePostal, ville, besoin }, (error, beneficiary) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'Internal server error' });
        }
        if (!beneficiary) {
          return res.status(404).json({ error: 'User not found' });
        }
  
        return res.status(200).json({ user: beneficiary });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

 logout(req, res) {
    return res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "Successfully logged out 😏 🍀" });
  },

 getAllArticles: async (req, res) => {
    try {
      const sql = 'SELECT * FROM Article';
      pool.query(sql, (error, results) => {
        if (error) {
          console.error('Erreur lors de la récupération des articles :', error);
          return res.status(500).json({ error: 'Erreur lors de la récupération des articles' });
        }
        res.status(200).json(results);
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};
