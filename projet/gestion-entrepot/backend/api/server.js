const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001; // Vous pouvez choisir un autre port si nécessaire

app.use(express.json());
app.use(cors());

// Importation des routes
const authRoutes = require('./routes/connRoute');

// Utilisation des routes
app.use('/api', authRoutes);

app.get('/', (req, res) => {
  res.send('Serveur de Gestion-Entrepot en fonctionnement');
});
app.use(cors({
  origin: 'http://localhost:3000' // Autoriser seulement cette origine à accéder à l'API
}));
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
